import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import userService from '../../../services/userService'

const INITIAL = {
  name: '', username: '', email: '',
  phone: '', password: '', role: '',
  status: 'Active',
}

function UserForm() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const isEdit   = Boolean(id)

  const [form, setForm]         = useState(INITIAL)
  const [roles, setRoles]       = useState([])
  const [avatar, setAvatar]     = useState(null)
  const [preview, setPreview]   = useState(null)
  const [errors, setErrors]     = useState({})
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [loading, setLoading]   = useState(isEdit)
  const [showPass, setShowPass] = useState(false)

  // Load roles
  useEffect(() => {
    userService.getRoles()
      .then(res => setRoles(res.data.data || res.data || []))
      .catch(() => {})
  }, [])

  // Load user for edit
  useEffect(() => {
    if (!isEdit) return
    userService.getById(id)
      .then(res => {
        const u = res.data.data || res.data
        setForm({
          name:     u.name     || '',
          username: u.username || '',
          email:    u.email    || '',
          phone:    u.phone    || '',
          password: '',
          role:     u.roles?.[0]?.name || '',
          status:   u.status   || 'Active',
        })
        if (u.avatar) setPreview(u.avatar)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleAvatar = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatar(file)
    setPreview(URL.createObjectURL(file))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())  e.name  = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    if (!form.role)         e.role  = 'Role is required'
    if (!isEdit && !form.password.trim())
      e.password = 'Password is required'
    if (form.password && form.password.length < 8)
      e.password = 'Password must be at least 8 characters'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'password' && !v) return // skip empty password on edit
      if (v !== null && v !== undefined && v !== '') fd.append(k, v)
    })
    if (avatar) fd.append('avatar', avatar)

    try {
      if (isEdit) await userService.update(id, fd)
      else        await userService.store(fd)
      setSaved(true)
      setTimeout(() => navigate('/admin/users'), 1200)
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
          <h4 className="fw-bold mb-1">{isEdit ? 'Edit User' : 'Add User'}</h4>
          <small className="text-muted">
            <Link to="/admin/users" style={{ color: '#00b894' }}>Users</Link>
            {' / '}{isEdit ? 'Edit' : 'New'}
          </small>
        </div>
        <Link to="/admin/users" className="btn btn-outline-secondary btn-sm">← Back</Link>
      </div>

      {saved && (
        <div className="alert alert-success mb-4">
          ✅ User {isEdit ? 'updated' : 'created'} successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">

          {/* LEFT */}
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-4">User Information</h6>

              <div className="row g-3">
                {/* Name */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input type="text" name="name"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="John Doe"
                    value={form.name} onChange={handleChange} />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                {/* Username */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Username</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">@</span>
                    <input type="text" name="username"
                      className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                      placeholder="johndoe"
                      value={form.username} onChange={handleChange} />
                    {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                  </div>
                </div>

                {/* Email */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Email <span className="text-danger">*</span>
                  </label>
                  <input type="email" name="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="john@example.com"
                    value={form.email} onChange={handleChange} />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                {/* Phone */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Phone</label>
                  <input type="tel" name="phone" className="form-control"
                    placeholder="+1 (555) 000-0000"
                    value={form.phone} onChange={handleChange} />
                </div>

                {/* Password */}
                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Password{' '}
                    {isEdit && (
                      <span className="text-muted fw-normal">(leave blank to keep current)</span>
                    )}
                    {!isEdit && <span className="text-danger">*</span>}
                  </label>
                  <div className="input-group">
                    <input
                      type={showPass ? 'text' : 'password'}
                      name="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      placeholder={isEdit ? '••••••••' : 'Minimum 8 characters'}
                      value={form.password} onChange={handleChange} />
                    <button type="button"
                      className="input-group-text bg-light"
                      onClick={() => setShowPass(p => !p)}>
                      {showPass ? '🙈' : '👁️'}
                    </button>
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-12 col-lg-4">

            {/* Role + Status */}
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-4">Role & Status</h6>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                  Role <span className="text-danger">*</span>
                </label>
                <select name="role"
                  className={`form-select ${errors.role ? 'is-invalid' : ''}`}
                  value={form.role} onChange={handleChange}>
                  <option value="">— Select Role —</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
                {errors.role && <div className="invalid-feedback">{errors.role}</div>}
              </div>

              {isEdit && (
                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Status</label>
                  <select name="status" className="form-select"
                    value={form.status} onChange={handleChange}>
                    <option value="Active">✅ Active</option>
                    <option value="Inactive">⛔ Inactive</option>
                  </select>
                </div>
              )}

              <div className="d-grid gap-2">
                <button type="submit"
                  className="btn text-white fw-semibold"
                  style={{ background: '#00b894', borderRadius: 8 }}
                  disabled={saving || saved}>
                  {saving
                    ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                    : saved ? '✅ Saved!'
                    : isEdit ? '💾 Update User'
                    : '👤 Create User'}
                </button>
                <Link to="/admin/users" className="btn btn-outline-secondary">Cancel</Link>
              </div>
            </div>

            {/* Avatar */}
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-3">Profile Picture</h6>
              {preview ? (
                <div className="text-center mb-3">
                  <img src={preview} alt="avatar"
                    className="rounded-circle"
                    style={{ width: 100, height: 100, objectFit: 'cover',
                      border: '3px solid #00b894' }} />
                  <button type="button"
                    className="btn btn-sm btn-outline-danger d-block mx-auto mt-2"
                    onClick={() => { setPreview(null); setAvatar(null) }}>
                    ✕ Remove
                  </button>
                </div>
              ) : (
                <label htmlFor="avatar-upload"
                  className="d-block text-center p-4 rounded-3 mb-3"
                  style={{ background: '#f9fafb', border: '2px dashed #e5e7eb', cursor: 'pointer' }}>
                  <div style={{ fontSize: 40 }}>👤</div>
                  <small className="text-muted d-block mt-1">Click to upload photo</small>
                  <small className="text-muted" style={{ fontSize: 11 }}>JPG, PNG — max 2MB</small>
                </label>
              )}
              <input type="file" id="avatar-upload" className="d-none"
                accept="image/*" onChange={handleAvatar} />
              <label htmlFor="avatar-upload"
                className="btn btn-outline-secondary btn-sm w-100">
                📁 Choose Photo
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default UserForm