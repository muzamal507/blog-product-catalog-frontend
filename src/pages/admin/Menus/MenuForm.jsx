import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import menuService from '../../../services/menuService'
import blogPageService from '../../../services/blog/pageService'

const INITIAL_MENU = {
  name: '', location: 'Header', status: 'Active',
}
const INITIAL_ITEM = {
  title: '', url: '', page_id: '',
  parent_id: '', sort_order: 0,
  target: '_self', icon: '',
}

const LOCATIONS = ['Header', 'Footer', 'Sidebar', 'Mobile']

function MenuForm() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const isEdit     = Boolean(id)

  const [menu, setMenu]         = useState(INITIAL_MENU)
  const [item, setItem]         = useState(INITIAL_ITEM)
  const [existingItemId, setExistingItemId] = useState(null)
  const [pages, setPages]       = useState([])
  const [errors, setErrors]     = useState({})
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [loading, setLoading]   = useState(isEdit)
  const [linkType, setLinkType] = useState('url') // 'url' or 'page'

  // Load pages for dropdown
  useEffect(() => {
    blogPageService.getAll({ status: 'Published', per_page: 100 })
      .then(res => setPages(res.data.data?.data || res.data.data || []))
      .catch(() => {})
  }, [])

  // Load menu for edit
  useEffect(() => {
    if (!isEdit) return
    menuService.getById(id)
      .then(res => {
        const m = res.data.data || res.data
        setMenu({
          name:     m.name || '',
          location: m.location || 'Header',
          status:   m.status || 'Active',
        })
        const firstItem = m.items?.[0]
        if (firstItem) {
          setExistingItemId(firstItem.id)
          setItem({
            title:      firstItem.title || '',
            url:        firstItem.url || '',
            page_id:    firstItem.page_id || '',
            parent_id:  firstItem.parent_id || '',
            sort_order: firstItem.sort_order || 0,
            target:     firstItem.target || '_self',
            icon:       firstItem.icon || '',
          })
          setLinkType(firstItem.page_id ? 'page' : 'url')
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const handleMenuChange = (e) => {
    const { name, value } = e.target
    setMenu(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleItemChange = (e) => {
    const { name, value } = e.target
    setItem(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!menu.name.trim())  e.name  = 'Menu name is required'
    if (!item.title.trim()) e.title = 'Item title is required'
    if (linkType === 'url' && !item.url.trim())
      e.url = 'URL is required'
    if (linkType === 'page' && !item.page_id)
      e.page_id = 'Page is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    const payload = {
      ...menu,
      title:      item.title,
      url:        linkType === 'url' ? item.url : null,
      page_id:    linkType === 'page' ? item.page_id : null,
      parent_id:  item.parent_id || null,
      sort_order: item.sort_order,
      target:     item.target,
      icon:       item.icon || null,
    }

    try {
      if (isEdit && existingItemId) {
        await menuService.update(id, existingItemId, payload)
      } else {
        await menuService.store(payload)
      }
      setSaved(true)
      setTimeout(() => navigate('/admin/menus'), 1200)
    } catch (err) {
      setErrors(err.response?.data?.errors || {})
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border" style={{ color: '#00b894' }} />
    </div>
  )

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">{isEdit ? 'Edit Menu' : 'Add Menu'}</h4>
          <small className="text-muted">
            <Link to="/admin/menus" style={{ color: '#00b894' }}>Menus</Link>
            {' / '}{isEdit ? 'Edit' : 'New'}
          </small>
        </div>
        <Link to="/admin/menus" className="btn btn-outline-secondary btn-sm">← Back</Link>
      </div>

      {saved && (
        <div className="alert alert-success mb-4">
          ✅ Menu {isEdit ? 'updated' : 'created'} successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">

          {/* LEFT */}
          <div className="col-12 col-lg-8">

            {/* Menu Info */}
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-4">Menu Information</h6>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Menu Name <span className="text-danger">*</span>
                  </label>
                  <input type="text" name="name"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="e.g. Main Navigation"
                    value={menu.name} onChange={handleMenuChange} />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Location</label>
                  <div className="d-flex flex-wrap gap-2 mt-1">
                    {LOCATIONS.map(loc => (
                      <button key={loc} type="button"
                        onClick={() => setMenu(p => ({ ...p, location: loc }))}
                        className="btn btn-sm"
                        style={{
                          borderRadius: 8, fontSize: 12,
                          background: menu.location === loc ? '#1a1a2e' : '#f3f4f6',
                          color: menu.location === loc ? '#fff' : '#374151',
                          border: 'none'
                        }}>
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Item */}
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-4">Menu Item</h6>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                  Item Title <span className="text-danger">*</span>
                </label>
                <input type="text" name="title"
                  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  placeholder="e.g. Home, About Us, Contact"
                  value={item.title} onChange={handleItemChange} />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>

              {/* Link Type Toggle */}
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                  Link Type
                </label>
                <div className="d-flex gap-2">
                  {[
                    { key: 'url',  label: '🔗 Custom URL' },
                    { key: 'page', label: '📄 Site Page'  },
                  ].map(t => (
                    <button key={t.key} type="button"
                      onClick={() => setLinkType(t.key)}
                      className="btn btn-sm"
                      style={{
                        borderRadius: 8, fontSize: 13,
                        background: linkType === t.key ? '#00b894' : '#f3f4f6',
                        color: linkType === t.key ? '#fff' : '#374151',
                        border: 'none'
                      }}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* URL */}
              {linkType === 'url' && (
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    URL <span className="text-danger">*</span>
                  </label>
                  <input type="text" name="url"
                    className={`form-control ${errors.url ? 'is-invalid' : ''}`}
                    placeholder="/catalog, /about, https://..."
                    value={item.url} onChange={handleItemChange} />
                  {errors.url && <div className="invalid-feedback">{errors.url}</div>}
                </div>
              )}

              {/* Page */}
              {linkType === 'page' && (
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Select Page <span className="text-danger">*</span>
                  </label>
                  <select name="page_id"
                    className={`form-select ${errors.page_id ? 'is-invalid' : ''}`}
                    value={item.page_id} onChange={handleItemChange}>
                    <option value="">— Select Page —</option>
                    {pages.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                  {errors.page_id && <div className="invalid-feedback">{errors.page_id}</div>}
                </div>
              )}

              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Open In
                  </label>
                  <select name="target" className="form-select"
                    value={item.target} onChange={handleItemChange}>
                    <option value="_self">Same Tab</option>
                    <option value="_blank">New Tab</option>
                  </select>
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Sort Order
                  </label>
                  <input type="number" name="sort_order" min={0}
                    className="form-control"
                    value={item.sort_order} onChange={handleItemChange} />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Icon
                    <small className="text-muted fw-normal ms-1">(emoji/class)</small>
                  </label>
                  <input type="text" name="icon" className="form-control"
                    placeholder="🏠 or fa-home"
                    value={item.icon} onChange={handleItemChange} />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-4">Settings</h6>

              <div className="mb-4">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Status</label>
                <select name="status" className="form-select"
                  value={menu.status} onChange={handleMenuChange}>
                  <option value="Active">✅ Active</option>
                  <option value="Inactive">⛔ Inactive</option>
                </select>
              </div>

              {/* Preview */}
              <div className="p-3 rounded-3 mb-4" style={{ background: '#f9fafb' }}>
                <small className="fw-semibold text-muted d-block mb-2">Preview</small>
                <div className="d-flex align-items-center gap-2">
                  {item.icon && <span>{item.icon}</span>}
                  <span className="fw-semibold" style={{ fontSize: 14, color: '#1a1a2e' }}>
                    {item.title || 'Menu Item'}
                  </span>
                  {item.target === '_blank' && (
                    <span className="text-muted" style={{ fontSize: 11 }}>↗</span>
                  )}
                </div>
                <small className="text-muted d-block mt-1" style={{ fontSize: 11 }}>
                  {linkType === 'page'
                    ? `Page: ${pages.find(p => p.id === parseInt(item.page_id))?.title || '—'}`
                    : item.url || '—'
                  }
                </small>
              </div>

              <div className="d-grid gap-2">
                <button type="submit"
                  className="btn text-white fw-semibold"
                  style={{ background: '#00b894', borderRadius: 8 }}
                  disabled={saving || saved}>
                  {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                   : saved ? '✅ Saved!'
                   : isEdit ? '💾 Update Menu'
                   : '🗺️ Create Menu'}
                </button>
                <Link to="/admin/menus" className="btn btn-outline-secondary">Cancel</Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default MenuForm