import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import sliderService from '../../../services/sliderService'

const INITIAL = {
  title: '', subtitle: '', description: '',
  button_text: '', button_url: '',
  sort_order: 0, status: 'Active',
}

function SliderForm() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const isEdit     = Boolean(id)

  const [form, setForm]       = useState(INITIAL)
  const [preview, setPreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [errors, setErrors]   = useState({})
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    sliderService.getById(id)
      .then(res => {
        const s = res.data.data || res.data
        setForm({
          title:       s.title || '',
          subtitle:    s.subtitle || '',
          description: s.description || '',
          button_text: s.button_text || '',
          button_url:  s.button_url || '',
          sort_order:  s.sort_order || 0,
          status:      s.status || 'Active',
        })
        setPreview(s.image || null)
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
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null && v !== undefined) fd.append(k, v)
    })
    if (imageFile) fd.append('image', imageFile)

    try {
      if (isEdit) await sliderService.update(id, fd)
      else        await sliderService.create(fd)
      setSaved(true)
      setTimeout(() => navigate('/admin/sliders'), 1200)
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
          <h4 className="fw-bold mb-1">{isEdit ? 'Edit Slide' : 'Add Slide'}</h4>
          <small className="text-muted">
            <Link to="/admin/sliders" style={{ color: '#00b894' }}>Sliders</Link>
            {' / '}{isEdit ? 'Edit' : 'New'}
          </small>
        </div>
        <Link to="/admin/sliders" className="btn btn-outline-secondary btn-sm">← Back</Link>
      </div>

      {saved && (
        <div className="alert alert-success mb-4">
          ✅ Slide {isEdit ? 'updated' : 'created'} successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-4">Slide Content</h6>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                  Title <span className="text-danger">*</span>
                </label>
                <input type="text" name="title"
                  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  placeholder="Main heading of the slide"
                  value={form.title} onChange={handleChange} />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                  Subtitle / Badge Text
                </label>
                <input type="text" name="subtitle" className="form-control"
                  placeholder="e.g. PREMIUM CURATION CATALOG"
                  value={form.subtitle} onChange={handleChange} />
                <small className="text-muted">Shows as badge above the title</small>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                  Description
                </label>
                <textarea name="description" rows={3} className="form-control"
                  placeholder="Short description below the title..."
                  value={form.description} onChange={handleChange} />
              </div>

              <div className="row g-3">
                <div className="col-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Button Text
                  </label>
                  <input type="text" name="button_text" className="form-control"
                    placeholder="Explore Collection"
                    value={form.button_text} onChange={handleChange} />
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Button URL
                  </label>
                  <input type="text" name="button_url" className="form-control"
                    placeholder="/catalog or https://..."
                    value={form.button_url} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>

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
              <div className="mb-4">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Sort Order</label>
                <input type="number" name="sort_order" min={0} className="form-control"
                  value={form.sort_order} onChange={handleChange} />
                <small className="text-muted">Lower = shown first</small>
              </div>
              <div className="d-grid gap-2">
                <button type="submit"
                  className="btn text-white fw-semibold"
                  style={{ background: '#00b894', borderRadius: 8 }}
                  disabled={saving || saved}>
                  {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                   : saved ? '✅ Saved!'
                   : isEdit ? '💾 Update Slide'
                   : '🚀 Create Slide'}
                </button>
                <Link to="/admin/sliders" className="btn btn-outline-secondary">Cancel</Link>
              </div>
            </div>

            {/* Image */}
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-3">Slide Image</h6>
              {preview ? (
                <div className="position-relative mb-3">
                  <img src={preview} alt="preview"
                    className="w-100 rounded-3"
                    style={{ height: 140, objectFit: 'cover' }} />
                  <button type="button"
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                    onClick={() => { setPreview(null); setImageFile(null) }}>✕</button>
                </div>
              ) : (
                <label htmlFor="slider-img"
                  className="d-block text-center p-4 rounded-3 mb-3"
                  style={{ background: '#f9fafb', border: '2px dashed #e5e7eb', cursor: 'pointer' }}>
                  <div style={{ fontSize: 36 }}>🖼️</div>
                  <small className="text-muted d-block mt-1">Recommended: 1400×480px</small>
                </label>
              )}
              <input type="file" id="slider-img" className="d-none"
                accept="image/*" onChange={handleImage} />
              <label htmlFor="slider-img"
                className="btn btn-outline-secondary btn-sm w-100">
                📁 Choose Image
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SliderForm