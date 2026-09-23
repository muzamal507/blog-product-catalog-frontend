import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import blogPageService from '../../../services/blog/pageService'

const INITIAL = {
  title: '', content: '',
  template: 'Default', status: 'Draft',
  published_at: '',
  meta_title: '', meta_description: '', meta_keywords: '',
}

const TEMPLATES = ['Default', 'Full-Width', 'Contact', 'Landing']
const TEMPLATE_ICONS = {
  Default:     '📄',
  'Full-Width':'📐',
  Contact:     '📞',
  Landing:     '🚀',
}

function PageForm() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const isEdit     = Boolean(id)

  const [form, setForm]       = useState(INITIAL)
  const [image, setImage]     = useState(null)
  const [preview, setPreview] = useState(null)
  const [errors, setErrors]   = useState({})
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [activeTab, setActiveTab] = useState('content')

  useEffect(() => {
    if (!isEdit) return
    blogPageService.getById(id)
      .then(res => {
        const p = res.data.data || res.data
        setForm({
          title:            p.title || '',
          content:          p.content || '',
          template:         p.template || 'Default',
          status:           p.status || 'Draft',
          published_at:     p.published_at
            ? new Date(p.published_at).toISOString().slice(0,16) : '',
          meta_title:       p.meta_title || '',
          meta_description: p.meta_description || '',
          meta_keywords:    p.meta_keywords || '',
        })
        if (p.image) setPreview(p.image)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim())   e.title   = 'Title is required'
    if (!form.content.trim()) e.content = 'Content is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== '') fd.append(k, v)
    })
    if (image) fd.append('image', image)

    try {
      if (isEdit) await blogPageService.update(id, fd)
      else        await blogPageService.store(fd)
      setSaved(true)
      setTimeout(() => navigate('/admin/pages'), 1200)
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
          <h4 className="fw-bold mb-1">{isEdit ? 'Edit Page' : 'Add Page'}</h4>
          <small className="text-muted">
            <Link to="/admin/pages" style={{ color: '#00b894' }}>Pages</Link>
            {' / '}{isEdit ? 'Edit' : 'New'}
          </small>
        </div>
        <Link to="/admin/pages" className="btn btn-outline-secondary btn-sm">← Back</Link>
      </div>

      {saved && (
        <div className="alert alert-success mb-4">
          ✅ Page {isEdit ? 'updated' : 'created'} successfully! Redirecting...
        </div>
      )}

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        {[
          { key: 'content', label: '📄 Content' },
          { key: 'seo',     label: '🔍 SEO'     },
        ].map(tab => (
          <li className="nav-item" key={tab.key}>
            <button
              className={`nav-link ${activeTab === tab.key ? 'active fw-semibold' : ''}`}
              style={activeTab === tab.key
                ? { color: '#00b894', borderBottomColor: '#00b894' }
                : { color: '#6b7280' }}
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

            {activeTab === 'content' && (
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
                <h6 className="fw-bold mb-4">Page Content</h6>

                {/* Title */}
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Page Title <span className="text-danger">*</span>
                  </label>
                  <input type="text" name="title"
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                    placeholder="e.g. About Us, Privacy Policy, Terms..."
                    value={form.title} onChange={handleChange} />
                  {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>

                {/* Content */}
                <div className="mb-0">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Content <span className="text-danger">*</span>
                  </label>
                  <textarea name="content" rows={18}
                    className={`form-control ${errors.content ? 'is-invalid' : ''}`}
                    style={{ fontSize: 13, lineHeight: 1.8 }}
                    placeholder="Page content here. Supports ## headings, **bold**, etc."
                    value={form.content} onChange={handleChange} />
                  {errors.content && <div className="invalid-feedback">{errors.content}</div>}
                  <small className="text-muted">{form.content.length} characters</small>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
                <h6 className="fw-bold mb-4">SEO Settings</h6>
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Meta Title</label>
                  <input type="text" name="meta_title" className="form-control"
                    placeholder="SEO title..."
                    value={form.meta_title} onChange={handleChange} />
                  <small className="text-muted">{form.meta_title.length}/60</small>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Meta Description
                  </label>
                  <textarea name="meta_description" rows={3} className="form-control"
                    placeholder="SEO description..."
                    value={form.meta_description} onChange={handleChange} />
                  <small className="text-muted">{form.meta_description.length}/160</small>
                </div>
                <div className="mb-0">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Meta Keywords
                  </label>
                  <input type="text" name="meta_keywords" className="form-control"
                    placeholder="keyword1, keyword2"
                    value={form.meta_keywords} onChange={handleChange} />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="col-12 col-lg-4">

            {/* Publish */}
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-4">Page Settings</h6>

              {/* Template */}
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Template</label>
                <div className="row g-2">
                  {TEMPLATES.map(t => (
                    <div className="col-6" key={t}>
                      <button type="button"
                        onClick={() => setForm(p => ({ ...p, template: t }))}
                        className="btn w-100 btn-sm"
                        style={{
                          borderRadius: 8,
                          background: form.template === t ? '#1a1a2e' : '#f3f4f6',
                          color: form.template === t ? '#fff' : '#374151',
                          border: 'none', fontSize: 12
                        }}>
                        {TEMPLATE_ICONS[t]} {t}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Status</label>
                <select name="status" className="form-select"
                  value={form.status} onChange={handleChange}>
                  <option value="Draft">📝 Draft</option>
                  <option value="Published">✅ Published</option>
                  <option value="Scheduled">⏰ Scheduled</option>
                  <option value="Archived">📦 Archived</option>
                </select>
              </div>

              {/* Published At */}
              {form.status === 'Scheduled' && (
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Publish Date
                  </label>
                  <input type="datetime-local" name="published_at" className="form-control"
                    value={form.published_at} onChange={handleChange} />
                </div>
              )}

              <div className="d-grid gap-2">
                <button type="submit"
                  className="btn text-white fw-semibold"
                  style={{ background: '#00b894', borderRadius: 8 }}
                  disabled={saving || saved}>
                  {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                   : saved ? '✅ Saved!'
                   : isEdit ? '💾 Update Page'
                   : '🚀 Create Page'}
                </button>
                <Link to="/admin/pages" className="btn btn-outline-secondary">Cancel</Link>
              </div>
            </div>

            {/* Featured Image */}
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-3">Featured Image</h6>
              {preview ? (
                <div className="position-relative mb-3">
                  <img src={preview} alt="preview"
                    className="w-100 rounded-3"
                    style={{ height: 160, objectFit: 'cover' }} />
                  <button type="button"
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                    onClick={() => { setPreview(null); setImage(null) }}>✕</button>
                </div>
              ) : (
                <label htmlFor="page-img"
                  className="d-block text-center p-4 rounded-3 mb-3"
                  style={{ background: '#f9fafb', border: '2px dashed #e5e7eb', cursor: 'pointer' }}>
                  <div style={{ fontSize: 36 }}>🖼️</div>
                  <small className="text-muted d-block mt-1">Click to upload</small>
                </label>
              )}
              <input type="file" id="page-img" className="d-none"
                accept="image/*" onChange={handleImage} />
              <label htmlFor="page-img" className="btn btn-outline-secondary btn-sm w-100">
                📁 Choose Image
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default PageForm