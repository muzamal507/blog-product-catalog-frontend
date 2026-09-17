import React, { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'

const categories = ['Timepieces', 'Peripherals', 'Acoustics', 'Travel Gear', 'About Us']

function AddBlog() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    title: '',
    category: '',
    author: '',
    excerpt: '',
    content: '',
    image: '',
    status: 'Draft',
    featured: false,
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim())    e.title    = 'Title is required'
    if (!form.category)        e.category = 'Category is required'
    if (!form.author.trim())   e.author   = 'Author is required'
    if (!form.excerpt.trim())  e.excerpt  = 'Excerpt is required'
    if (!form.content.trim())  e.content  = 'Content is required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }

    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => navigate('/admin/blogs'), 1200)
    }, 900)
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">{isEdit ? 'Edit Blog' : 'New Blog'}</h4>
          <small className="text-muted">
            <Link to="/admin/blogs" style={{ color: '#00b894' }}>Blogs</Link> / {isEdit ? 'Edit' : 'Add New'}
          </small>
        </div>
        <Link to="/admin/blogs" className="btn btn-outline-secondary btn-sm">
          ← Back
        </Link>
      </div>

      {saved && (
        <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
          ✅ Blog {isEdit ? 'updated' : 'created'} successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">

          {/* LEFT - Main Content */}
          <div className="col-12 col-lg-8">

            {/* Basic Info */}
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-4">Blog Information</h6>

              {/* Title */}
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                  Title <span className="text-danger">*</span>
                </label>
                <input type="text" name="title" className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  placeholder="Enter blog title..."
                  value={form.title} onChange={handleChange} />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>

              {/* Excerpt */}
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                  Excerpt <span className="text-danger">*</span>
                </label>
                <textarea name="excerpt" rows={3}
                  className={`form-control ${errors.excerpt ? 'is-invalid' : ''}`}
                  placeholder="Short summary shown on blog listing page..."
                  value={form.excerpt} onChange={handleChange} />
                {errors.excerpt && <div className="invalid-feedback">{errors.excerpt}</div>}
                <small className="text-muted">{form.excerpt.length}/200 characters</small>
              </div>

              {/* Content */}
              <div className="mb-0">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                  Content <span className="text-danger">*</span>
                </label>
                <textarea name="content" rows={14}
                  className={`form-control font-monospace ${errors.content ? 'is-invalid' : ''}`}
                  placeholder="Write full blog content here. Use ## for headings, leave blank lines between paragraphs..."
                  value={form.content} onChange={handleChange}
                  style={{ fontSize: 13, lineHeight: 1.8 }} />
                {errors.content && <div className="invalid-feedback">{errors.content}</div>}
              </div>
            </div>

            {/* Image */}
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-3">Featured Image</h6>
              <input type="text" name="image" className="form-control mb-3"
                placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                value={form.image} onChange={handleChange} />
              {form.image && (
                <img src={form.image} alt="preview"
                  className="w-100 rounded-3" style={{ height: 220, objectFit: 'cover' }} />
              )}
              {!form.image && (
                <div className="text-center py-4 rounded-3"
                  style={{ background: '#f9fafb', border: '2px dashed #e5e7eb', color: '#9ca3af' }}>
                  <div style={{ fontSize: 36 }}>🖼️</div>
                  <small>Paste image URL above to preview</small>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT - Settings */}
          <div className="col-12 col-lg-4">

            {/* Publish */}
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-4">Publish Settings</h6>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Status</label>
                <select name="status" className="form-select"
                  value={form.status} onChange={handleChange}>
                  <option value="Draft">📝 Draft</option>
                  <option value="Published">✅ Published</option>
                </select>
              </div>

              <div className="form-check mb-4">
                <input className="form-check-input" type="checkbox"
                  name="featured" id="featured"
                  checked={form.featured} onChange={handleChange} />
                <label className="form-check-label fw-semibold" htmlFor="featured" style={{ fontSize: 13 }}>
                  ⭐ Mark as Featured
                </label>
                <div className="text-muted" style={{ fontSize: 12 }}>Shows on homepage hero section</div>
              </div>

              <div className="d-grid gap-2">
                <button type="submit"
                  className="btn text-white fw-semibold"
                  style={{ background: '#00b894', borderRadius: 8 }}
                  disabled={saving || saved}>
                  {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> :
                   saved   ? '✅ Saved!' :
                   isEdit  ? '💾 Update Blog' : '🚀 Publish Blog'}
                </button>
                <Link to="/admin/blogs" className="btn btn-outline-secondary">Cancel</Link>
              </div>
            </div>

            {/* Category & Author */}
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-4">Details</h6>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                  Category <span className="text-danger">*</span>
                </label>
                <select name="category"
                  className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                  value={form.category} onChange={handleChange}>
                  <option value="">Select category...</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <div className="invalid-feedback">{errors.category}</div>}
              </div>

              <div className="mb-0">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                  Author <span className="text-danger">*</span>
                </label>
                <input type="text" name="author"
                  className={`form-control ${errors.author ? 'is-invalid' : ''}`}
                  placeholder="Author name"
                  value={form.author} onChange={handleChange} />
                {errors.author && <div className="invalid-feedback">{errors.author}</div>}
              </div>
            </div>

            {/* Tips */}
            <div className="card border-0 p-4" style={{ borderRadius: 12, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <h6 className="fw-semibold mb-3" style={{ color: '#059669' }}>✍️ Writing Tips</h6>
              <ul className="mb-0 ps-3" style={{ fontSize: 12, color: '#6b7280', lineHeight: 2 }}>
                <li>Use <code>##</code> for section headings</li>
                <li>Leave blank lines between paragraphs</li>
                <li>Keep excerpt under 200 characters</li>
                <li>Use high quality Unsplash images</li>
              </ul>
            </div>

          </div>
        </div>
      </form>
    </div>
  )
}

export default AddBlog