import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import testimonialService from '../../../services/testimonialService'

const INITIAL = {
  name: '', designation: '', company: '',
  message: '', rating: 5,
  status: 'Active', is_featured: false, sort_order: 0,
}

const StarPicker = ({ value, onChange }) => (
  <div className="d-flex gap-1">
    {[1, 2, 3, 4, 5].map(star => (
      <button key={star} type="button"
        onClick={() => onChange(star)}
        style={{
          fontSize: 28, background: 'none', border: 'none',
          cursor: 'pointer', padding: '0 2px',
          color: star <= value ? '#f59e0b' : '#d1d5db',
          transition: 'color 0.15s, transform 0.1s',
          transform: star <= value ? 'scale(1.1)' : 'scale(1)'
        }}>★</button>
    ))}
    <span className="ms-2 fw-semibold align-self-center" style={{ fontSize: 14, color: '#6b7280' }}>
      {value}/5
    </span>
  </div>
)

function TestimonialForm() {
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

  // Load for edit
  useEffect(() => {
    if (!isEdit) return
    testimonialService.edit(id)
      .then(res => {
        const t = res.data.data
        setForm({
          name:        t.name || '',
          designation: t.designation || '',
          company:     t.company || '',
          message:     t.message || '',
          rating:      t.rating || 5,
          status:      t.status || 'Active',
          is_featured: t.is_featured || false,
          sort_order:  t.sort_order || 0,
        })
        setPreview(t.image_url || null)
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
    if (!form.name.trim())    e.name    = 'Name is required'
    if (!form.message.trim()) e.message = 'Message is required'
    if (form.message.trim().length < 10)
      e.message = 'Message must be at least 10 characters'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => {
      if (typeof v === 'boolean') fd.append(k, v ? '1' : '0')
      else if (v !== null && v !== undefined) fd.append(k, v)
    })
    if (imageFile) fd.append('image', imageFile)

    try {
      if (isEdit) await testimonialService.update(id, fd)
      else        await testimonialService.store(fd)
      setSaved(true)
      setTimeout(() => navigate('/admin/testimonials'), 1200)
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
          <h4 className="fw-bold mb-1">
            {isEdit ? 'Edit Testimonial' : 'Add Testimonial'}
          </h4>
          <small className="text-muted">
            <Link to="/admin/testimonials" style={{ color: '#00b894' }}>
              Testimonials
            </Link> / {isEdit ? 'Edit' : 'Add New'}
          </small>
        </div>
        <Link to="/admin/testimonials" className="btn btn-outline-secondary btn-sm">← Back</Link>
      </div>

      {saved && (
        <div className="alert alert-success mb-4">
          ✅ Testimonial {isEdit ? 'updated' : 'created'} successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">

          {/* LEFT */}
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-4">Testimonial Information</h6>

              {/* Rating */}
              <div className="mb-4">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                  Rating <span className="text-danger">*</span>
                </label>
                <StarPicker
                  value={form.rating}
                  onChange={val => setForm(prev => ({ ...prev, rating: val }))}
                />
              </div>

              {/* Message */}
              <div className="mb-4">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                  Review Message <span className="text-danger">*</span>
                </label>
                <textarea name="message" rows={5}
                  className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                  placeholder="Write the customer's review or testimonial here..."
                  value={form.message} onChange={handleChange} />
                {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                <small className="text-muted">{form.message.length} characters</small>
              </div>

              {/* Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                  Customer Name <span className="text-danger">*</span>
                </label>
                <input type="text" name="name"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="e.g. Marcus Vance"
                  value={form.name} onChange={handleChange} />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              <div className="row g-3">
                {/* Designation */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Designation
                  </label>
                  <input type="text" name="designation" className="form-control"
                    placeholder="e.g. Architect, CEO, Designer"
                    value={form.designation} onChange={handleChange} />
                </div>

                {/* Company */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Company
                  </label>
                  <input type="text" name="company" className="form-control"
                    placeholder="e.g. Atelier Vance"
                    value={form.company} onChange={handleChange} />
                </div>
              </div>
            </div>
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
                  <small className="text-muted d-block fw-normal">
                    Shows on homepage section
                  </small>
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
                    : isEdit  ? '💾 Update'
                    : '🚀 Create Testimonial'}
                </button>
                <Link to="/admin/testimonials" className="btn btn-outline-secondary">
                  Cancel
                </Link>
              </div>
            </div>

            {/* Avatar Upload */}
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-3">Customer Avatar</h6>

              {preview ? (
                <div className="text-center mb-3">
                  <img src={preview} alt="avatar"
                    className="rounded-circle"
                    style={{ width: 100, height: 100, objectFit: 'cover',
                      border: '3px solid #00b894' }} />
                  <button type="button"
                    className="btn btn-sm btn-outline-danger d-block mx-auto mt-2"
                    onClick={() => { setPreview(null); setImageFile(null) }}>
                    ✕ Remove
                  </button>
                </div>
              ) : (
                <label className="d-block text-center p-4 rounded-3 mb-3"
                  style={{ background: '#f9fafb', border: '2px dashed #e5e7eb', cursor: 'pointer' }}
                  htmlFor="avatar-upload">
                  <div style={{ fontSize: 36 }}>👤</div>
                  <small className="text-muted d-block mt-1">Click to upload photo</small>
                  <small className="text-muted" style={{ fontSize: 11 }}>
                    JPG, PNG — max 2MB
                  </small>
                </label>
              )}

              <input type="file" id="avatar-upload" className="d-none"
                accept="image/*" onChange={handleImage} />

              {!preview && (
                <label htmlFor="avatar-upload"
                  className="btn btn-outline-secondary btn-sm w-100">
                  📁 Choose Photo
                </label>
              )}
            </div>

            {/* Preview Card */}
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-3">Preview</h6>
              <div className="text-center mb-2" style={{ color: '#f59e0b', fontSize: 18 }}>
                {'★'.repeat(form.rating)}{'☆'.repeat(5 - form.rating)}
              </div>
              <p className="text-muted fst-italic mb-3"
                style={{ fontSize: 12, lineHeight: 1.7 }}>
                "{form.message || 'Review message will appear here...'}"
              </p>
              <div className="d-flex align-items-center gap-2">
                {preview ? (
                  <img src={preview} alt=""
                    className="rounded-circle"
                    style={{ width: 36, height: 36, objectFit: 'cover' }} />
                ) : (
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: '#00b894', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 15
                  }}>
                    {form.name ? form.name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
                <div>
                  <div className="fw-semibold" style={{ fontSize: 13 }}>
                    {form.name || 'Customer Name'}
                  </div>
                  <small className="text-muted" style={{ fontSize: 11 }}>
                    {[form.designation, form.company].filter(Boolean).join(', ') || 'Role, Company'}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default TestimonialForm