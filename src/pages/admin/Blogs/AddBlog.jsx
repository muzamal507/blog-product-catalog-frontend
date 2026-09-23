import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import blogPostService     from '../../../services/blog/postService'
import blogCategoryService from '../../../services/blog/categoryService'
import blogTagService      from '../../../services/blog/tagService'

const INITIAL = {
  title: '', excerpt: '', content: '',
  category_id: '', status: 'Draft',
  meta_title: '', meta_description: '', meta_keywords: '',
  published_at: '',
}

function AddBlog() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const isEdit     = Boolean(id)

  const [form, setForm]         = useState(INITIAL)
  const [selectedTags, setSelectedTags] = useState([])
  const [image, setImage]       = useState(null)
  const [preview, setPreview]   = useState(null)
  const [errors, setErrors]     = useState({})
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [loading, setLoading]   = useState(isEdit)
  const [activeTab, setActiveTab] = useState('content')

  const [categories, setCategories] = useState([])
  const [tags, setTags]             = useState([])

  // Load dropdowns
  useEffect(() => {
    blogCategoryService.getAll({ status: 'Active' })
      .then(res => setCategories(res.data.data?.data || res.data.data || []))
      .catch(() => {})

    blogTagService.getAll({ status: 'Active' })
      .then(res => setTags(res.data.data?.data || res.data.data || []))
      .catch(() => {})
  }, [])

  // Load post for edit
  useEffect(() => {
    if (!isEdit) return
    blogPostService.getById(id)
      .then(res => {
        const p = res.data || res
        setForm({
          title:             p.title || '',
          excerpt:           p.excerpt || '',
          content:           p.content || '',
          category_id:       p.category?.id || '',
          status:            p.status || 'Draft',
          meta_title:        p.meta_title || '',
          meta_description:  p.meta_description || '',
          meta_keywords:     p.meta_keywords || '',
          published_at:      p.published_at
            ? new Date(p.published_at).toISOString().slice(0, 16) : '',
        })
        setSelectedTags(p.tags?.map(t => t.id) || [])
        setPreview(p.featured_image || null)
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

  const toggleTag = (tagId) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    )
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim())    e.title    = 'Title is required'
    if (!form.content.trim())  e.content  = 'Content is required'
    if (!form.category_id)     e.category_id = 'Category is required'
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

    selectedTags.forEach(tagId => fd.append('tags[]', tagId))

    if (image) fd.append('featured_image', image)

    try {
      if (isEdit) await blogPostService.update(id, fd)
      else        await blogPostService.store(fd)
      setSaved(true)
      setTimeout(() => navigate('/admin/blogs'), 1200)
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
          <h4 className="fw-bold mb-1">{isEdit ? 'Edit Post' : 'New Blog Post'}</h4>
          <small className="text-muted">
            <Link to="/admin/blogs" style={{ color: '#00b894' }}>Blogs</Link>
            {' / '}{isEdit ? 'Edit' : 'New'}
          </small>
        </div>
        <Link to="/admin/blogs" className="btn btn-outline-secondary btn-sm">← Back</Link>
      </div>

      {saved && (
        <div className="alert alert-success mb-4">
          ✅ Post {isEdit ? 'updated' : 'created'} successfully! Redirecting...
        </div>
      )}

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        {[
          { key: 'content', label: '✍️ Content' },
          { key: 'seo',     label: '🔍 SEO' },
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
                <h6 className="fw-bold mb-4">Post Content</h6>

                {/* Title */}
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Title <span className="text-danger">*</span>
                  </label>
                  <input type="text" name="title"
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                    placeholder="Post title..."
                    value={form.title} onChange={handleChange} />
                  {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>

                {/* Excerpt */}
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Excerpt
                    <small className="text-muted fw-normal ms-1">(auto-generated if empty)</small>
                  </label>
                  <textarea name="excerpt" rows={2} className="form-control"
                    placeholder="Short summary shown on blog list..."
                    value={form.excerpt} onChange={handleChange} />
                  <small className="text-muted">{form.excerpt.length}/200</small>
                </div>

                {/* Content */}
                <div className="mb-0">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Content <span className="text-danger">*</span>
                  </label>
                  <textarea name="content" rows={16}
                    className={`form-control font-monospace ${errors.content ? 'is-invalid' : ''}`}
                    style={{ fontSize: 13, lineHeight: 1.8 }}
                    placeholder="Write full post content here. Use ## for headings..."
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
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Meta Description</label>
                  <textarea name="meta_description" rows={3} className="form-control"
                    placeholder="SEO description..."
                    value={form.meta_description} onChange={handleChange} />
                  <small className="text-muted">{form.meta_description.length}/160</small>
                </div>
                <div className="mb-0">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Meta Keywords</label>
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
              <h6 className="fw-bold mb-4">Publish Settings</h6>

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

              {form.status === 'Scheduled' && (
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Publish Date & Time
                  </label>
                  <input type="datetime-local" name="published_at" className="form-control"
                    value={form.published_at} onChange={handleChange} />
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                  Category <span className="text-danger">*</span>
                </label>
                <select name="category_id"
                  className={`form-select ${errors.category_id ? 'is-invalid' : ''}`}
                  value={form.category_id} onChange={handleChange}>
                  <option value="">— Select Category —</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.category_id && <div className="invalid-feedback">{errors.category_id}</div>}
              </div>

              <div className="d-grid gap-2">
                <button type="submit"
                  className="btn text-white fw-semibold"
                  style={{ background: '#00b894', borderRadius: 8 }}
                  disabled={saving || saved}>
                  {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                   : saved ? '✅ Saved!'
                   : isEdit ? '💾 Update Post'
                   : '🚀 Publish Post'}
                </button>
                <Link to="/admin/blogs" className="btn btn-outline-secondary">Cancel</Link>
              </div>
            </div>

            {/* Featured Image */}
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 12 }}>
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
                <label htmlFor="blog-img"
                  className="d-block text-center p-4 rounded-3 mb-3"
                  style={{ background: '#f9fafb', border: '2px dashed #e5e7eb', cursor: 'pointer' }}>
                  <div style={{ fontSize: 36 }}>🖼️</div>
                  <small className="text-muted d-block mt-1">Click to upload</small>
                </label>
              )}
              <input type="file" id="blog-img" className="d-none"
                accept="image/*" onChange={handleImage} />
              <label htmlFor="blog-img" className="btn btn-outline-secondary btn-sm w-100">
                📁 Choose Image
              </label>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
                <h6 className="fw-bold mb-3">Tags</h6>
                <div className="d-flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button key={tag.id} type="button"
                      onClick={() => toggleTag(tag.id)}
                      className="btn btn-sm"
                      style={{
                        fontSize: 12, borderRadius: 20,
                        background: selectedTags.includes(tag.id) ? '#00b894' : '#f3f4f6',
                        color: selectedTags.includes(tag.id) ? '#fff' : '#374151',
                        border: 'none'
                      }}>
                      #{tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddBlog