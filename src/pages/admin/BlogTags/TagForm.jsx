import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import blogTagService from '../../../services/blog/tagService'

const INITIAL = { name: '', status: 'Active' }

function TagForm() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const isEdit   = Boolean(id)

  const [form, setForm]     = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    blogTagService.getById(id)
      .then(res => {
        const t = res.data.data || res.data
        setForm({ name: t.name || '', status: t.status || 'Active' })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Tag name is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    try {
      if (isEdit) await blogTagService.update(id, form)
      else        await blogTagService.store(form)
      setSaved(true)
      setTimeout(() => navigate('/admin/blog-tags'), 1200)
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
          <h4 className="fw-bold mb-1">{isEdit ? 'Edit Tag' : 'Add Tag'}</h4>
          <small className="text-muted">
            <Link to="/admin/blog-tags" style={{ color: '#00b894' }}>Blog Tags</Link>
            {' / '}{isEdit ? 'Edit' : 'New'}
          </small>
        </div>
        <Link to="/admin/blog-tags" className="btn btn-outline-secondary btn-sm">← Back</Link>
      </div>

      {saved && (
        <div className="alert alert-success mb-4">
          ✅ Tag {isEdit ? 'updated' : 'created'} successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-4">Tag Information</h6>

              <div className="mb-0">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                  Tag Name <span className="text-danger">*</span>
                </label>
                <input type="text" name="name"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="e.g. Watches, Horology, Travel"
                  value={form.name} onChange={handleChange} />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                <small className="text-muted mt-1 d-block">
                  Slug will be auto-generated from name.
                </small>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-4">Settings</h6>

              <div className="mb-4">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Status</label>
                <select name="status" className="form-select"
                  value={form.status} onChange={handleChange}>
                  <option value="Active">✅ Active</option>
                  <option value="Inactive">⛔ Inactive</option>
                </select>
              </div>

              {/* Preview */}
              {form.name && (
                <div className="mb-4 p-3 rounded-3" style={{ background: '#f9fafb' }}>
                  <small className="text-muted fw-semibold d-block mb-2">Preview</small>
                  <span className="badge px-3 py-2"
                    style={{ background: '#00b89415', color: '#00b894', fontSize: 14 }}>
                    #{form.name}
                  </span>
                </div>
              )}

              <div className="d-grid gap-2">
                <button type="submit"
                  className="btn text-white fw-semibold"
                  style={{ background: '#00b894', borderRadius: 8 }}
                  disabled={saving || saved}>
                  {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                   : saved ? '✅ Saved!'
                   : isEdit ? '💾 Update Tag'
                   : '🏷️ Create Tag'}
                </button>
                <Link to="/admin/blog-tags" className="btn btn-outline-secondary">Cancel</Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default TagForm