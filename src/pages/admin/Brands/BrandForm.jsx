import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import brandService from '../../../services/brandService'
import productCategoryService from '../../../services/productCategoryService'

const INITIAL = {
  name: '', slug: '', description: '', website: '', product_category_id: '',
  status: 'Active', is_featured: false, sort_order: 0, meta_title: '', 
  meta_description: '', meta_keywords: '', image: null,
}

function BrandForm() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const isEdit     = Boolean(id)

  const [form, setForm]         = useState(INITIAL)
  const [preview, setPreview]   = useState(null)
  const [errors, setErrors]     = useState({})
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [loading, setLoading]   = useState(isEdit)
  const [categories, setCategories] = useState([])
  const [linkedCats, setLinkedCats] = useState([])
  const [activeTab, setActiveTab]   = useState('basic')

  // Fetch active categories for dropdown
  useEffect(() => {
    productCategoryService.getAll({ all: true })
      .then(res => {
        const cats = res.data.data?.data || res.data.data || []
        setCategories(cats)
      })
      .catch(() => {})
  }, [])

  // Fetch brand for edit
  useEffect(() => {
    if (!isEdit) return
    brandService.edit(id)
      .then(res => {
        const b = res.data.data
        setForm({
          name:                b.name || '',
          slug:                b.slug || '',
          description:         b.description || '',
          website:             b.website || '',
          product_category_id: b.product_category_id || '',
          status:              b.status || 'Active',
          is_featured:         b.is_featured || false,
          sort_order:          b.sort_order || 0,
          meta_title:          b.meta_title || '',
          meta_description:    b.meta_description || '',
          meta_keywords:       b.meta_keywords || '',
          image:               null,
        })
        setPreview(b.image_url || null)
        setLinkedCats(res.data.linked_categories || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (name === 'name' && !isEdit) {
      setForm(prev => ({
        ...prev,
        name: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      }))
    }
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setForm(prev => ({ ...prev, image: file }))
    setPreview(URL.createObjectURL(file))
    setErrors(prev => ({ ...prev, image: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Brand name is required'
    if (form.website && !/^https?:\/\/.+/.test(form.website))
      e.website = 'Enter a valid URL (https://...)'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }

    setSaving(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'image' && !v) return
      if (typeof v === 'boolean') fd.append(k, v ? '1' : '0')
      else if (v !== null && v !== undefined && v !== '') fd.append(k, v)
    })

    try {
      if (isEdit) await brandService.update(id, fd)
      else        await brandService.store(fd)
      setSaved(true)
      setTimeout(() => navigate('/admin/brands'), 1200)
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
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">{isEdit ? 'Edit Brand' : 'Add Brand'}</h4>
          <small className="text-muted">
            <Link to="/admin/brands" style={{ color: '#00b894' }}>Brands</Link>
            {' / '}{isEdit ? 'Edit' : 'Add New'}
          </small>
        </div>
        <Link to="/admin/brands" className="btn btn-outline-secondary btn-sm">← Back</Link>
      </div>

      {saved && (
        <div className="alert alert-success mb-4">
          ✅ Brand {isEdit ? 'updated' : 'created'} successfully! Redirecting...
        </div>
      )}

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        {[
          { key: 'basic', label: '📋 Basic Info' },
          { key: 'seo',   label: '🔍 SEO' },
        ].map(tab => (
          <li className="nav-item" key={tab.key}>
            <button
              className={`nav-link ${activeTab === tab.key ? 'active fw-semibold' : ''}`}
              style={activeTab === tab.key
                ? { color: '#00b894', borderBottomColor: '#00b894' } : {}}
              onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">

          {/* LEFT */}
          <div className="col-12 col-lg-8">

            {activeTab === 'basic' && (
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
                <h6 className="fw-bold mb-4">Brand Information</h6>

                {/* Name */}
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Brand Name <span className="text-danger">*</span>
                  </label>
                  <input type="text" name="name"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="e.g. Chronos, Hex Keys, Acoustics"
                    value={form.name} onChange={handleChange} />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                {/* Slug */}
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Slug</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted" style={{ fontSize: 12 }}>
                      /brand/
                    </span>
                    <input type="text" name="slug"
                      className={`form-control ${errors.slug ? 'is-invalid' : ''}`}
                      placeholder="auto-generated"
                      value={form.slug} onChange={handleChange} />
                    {errors.slug && <div className="invalid-feedback">{errors.slug}</div>}
                  </div>
                </div>

                {/* ✅ Category Dropdown — product_category_id */}
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Category
                    <small className="text-muted ms-2">
                      (Brand is linked to this category)
                    </small>
                  </label>
                  <select
                    name="product_category_id"
                    className={`form-select ${errors.product_category_id ? 'is-invalid' : ''}`}
                    value={form.product_category_id}
                    onChange={handleChange}>
                    <option value="">— Select Category (Optional) —</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.parent_id ? `↳ ${cat.name}` : cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.product_category_id && (
                    <div className="invalid-feedback">{errors.product_category_id}</div>
                  )}
                  {form.product_category_id && (
                    <small className="text-muted d-block mt-1">
                      📂 Brand will appear when this category is selected
                    </small>
                  )}
                </div>

                {/* Website */}
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Website</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">🔗</span>
                    <input type="text" name="website"
                      className={`form-control ${errors.website ? 'is-invalid' : ''}`}
                      placeholder="https://brand-website.com"
                      value={form.website} onChange={handleChange} />
                    {errors.website && (
                      <div className="invalid-feedback">{errors.website}</div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Description
                  </label>
                  <textarea name="description" rows={4} className="form-control"
                    placeholder="Brand story, history, specialization..."
                    value={form.description} onChange={handleChange} />
                </div>

                {/* Linked Categories — Edit mode */}
                {isEdit && linkedCats.length > 0 && (
                  <div className="mt-4 p-3 rounded-3"
                    style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                    <small className="fw-semibold" style={{ color: '#059669' }}>
                      📂 Linked Categories ({linkedCats.length})
                    </small>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {linkedCats.map(cat => (
                        <span key={cat.id} className="badge px-2 py-1"
                          style={{ background: '#00b89420', color: '#00b894', fontSize: 12 }}>
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
                <h6 className="fw-bold mb-4">SEO Settings</h6>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Meta Title
                  </label>
                  <input type="text" name="meta_title" className="form-control"
                    placeholder="SEO title for brand page"
                    value={form.meta_title} onChange={handleChange} />
                  <small className="text-muted">{form.meta_title.length}/60 chars</small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Meta Description
                  </label>
                  <textarea name="meta_description" rows={3} className="form-control"
                    placeholder="Short description for search engines..."
                    value={form.meta_description} onChange={handleChange} />
                  <small className="text-muted">{form.meta_description.length}/160 chars</small>
                </div>

                <div className="mb-0">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Meta Keywords
                  </label>
                  <input type="text" name="meta_keywords" className="form-control"
                    placeholder="watch, titanium, automatic, luxury (comma separated)"
                    value={form.meta_keywords} onChange={handleChange} />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="col-12 col-lg-4">

            {/* Settings */}
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-4">Settings</h6>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Status</label>
                <select name="status" className="form-select"
                  value={form.status} onChange={handleChange}>
                  <option value="Active">✅ Active</option>
                  <option value="Inactive">⛔ Inactive</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Sort Order</label>
                <input type="number" name="sort_order" className="form-control"
                  min={0} value={form.sort_order} onChange={handleChange} />
              </div>

              <div className="form-check mb-4">
                <input className="form-check-input" type="checkbox"
                  name="is_featured" id="is_featured"
                  checked={form.is_featured} onChange={handleChange} />
                <label className="form-check-label fw-semibold" htmlFor="is_featured"
                  style={{ fontSize: 13 }}>
                  ⭐ Mark as Featured
                </label>
              </div>

              <div className="d-grid gap-2">
                <button type="submit"
                  className="btn text-white fw-semibold"
                  style={{ background: '#00b894', borderRadius: 8 }}
                  disabled={saving || saved}>
                  {saving
                    ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                    : saved   ? '✅ Saved!'
                    : isEdit  ? '💾 Update Brand'
                    : '🚀 Create Brand'}
                </button>
                <Link to="/admin/brands" className="btn btn-outline-secondary">Cancel</Link>
              </div>
            </div>

            {/* Brand Logo */}
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-3">Brand Logo</h6>

              {preview ? (
                <div className="position-relative mb-3">
                  <img src={preview} alt="preview"
                    className="w-100 rounded-3"
                    style={{ height: 160, objectFit: 'contain', background: '#f9fafb' }} />
                  <button type="button"
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                    onClick={() => {
                      setPreview(null)
                      setForm(p => ({ ...p, image: null }))
                    }}>✕</button>
                </div>
              ) : (
                <label className="d-block text-center p-4 rounded-3 mb-3"
                  style={{ background: '#f9fafb', border: '2px dashed #e5e7eb', cursor: 'pointer' }}
                  htmlFor="brand-image">
                  <div style={{ fontSize: 36 }}>🖼️</div>
                  <small className="text-muted d-block mt-1">Click to upload logo</small>
                  <small className="text-muted" style={{ fontSize: 11 }}>
                    JPG, PNG, WEBP — max 2MB
                  </small>
                </label>
              )}

              <input type="file" id="brand-image" className="d-none"
                accept="image/*" onChange={handleImage} />

              {!preview && (
                <label htmlFor="brand-image"
                  className="btn btn-outline-secondary btn-sm w-100">
                  📁 Choose Image
                </label>
              )}

              {errors.image && (
                <small className="text-danger d-block mt-1">{errors.image}</small>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default BrandForm