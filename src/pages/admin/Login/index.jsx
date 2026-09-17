import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) return setError('Please fill in all fields.')

    setLoading(true)
    try {
      // Real Laravel API call
      await login(form.email, form.password)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex">
      {/* LEFT */}
      <div className="d-none d-lg-flex flex-column justify-content-between p-5 flex-fill"
        style={{ background: 'linear-gradient(145deg,#0d1b2a,#0f2d40,#0a3d2e)' }}>
        <div className="d-flex align-items-center gap-3">
          {/* <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#ff6b6b,#a855f7,#3b82f6)', 
            borderRadius: 10 }}
          /> */}
          <div className="">
            <img src="/tech-logo-w.png" alt="Tahir Electronics"
              style={{ width: 60, height: 60, flexShrink: 0, objectFit: 'contain', borderRadius: 8}} />
          </div>
          <div>
            <div className="text-white fw-bold fs-3">Tahir's Tech Solutions</div>
            <small style={{ color: '#d7e2f1' }}>Blog & Catalog Admin Panel</small>
          </div>
        </div>

        <div>
          <h3 className="text-white fw-bold mb-2" style={{ fontSize: 28 }}>
            Manage your blog & catalog<br />with easy way
          </h3>
          <p style={{ color: '#8fa3b8', fontSize: 15 }} className="mb-4">
            Products, orders, blogs and more — all in one place.
          </p>
          <ul className="list-unstyled d-flex flex-column gap-3">
            {['Product & Category Management', 'Order Tracking', 'Blog & Testimonial Control', 'Real-time Dashboard'].map(f => (
              <li key={f} className="fw-medium" style={{ color: '#00b894' }}>✓ {f}</li>
            ))}
          </ul>
        </div>
        <small style={{ color: '#989da1' }}>© 2026 Tahir's Tech Solutions. All rights reserved.</small>
      </div>

      {/* RIGHT */}
      <div className="d-flex align-items-center justify-content-center flex-fill p-4"
        style={{ background: '#f4f6fa' }}>
        <div className="card border-0 shadow p-4 p-md-5 w-100" style={{ maxWidth: 420, borderRadius: 16 }}>
          <div className="text-center mb-4">
            <div className="fs-1 mb-2">🔐</div>
            <h4 className="fw-bold mb-1">Admin Login</h4>
            <small className="text-muted">Enter your credentials to access the panel</small>
          </div>

          {error && (
            <div className="alert alert-danger py-2 px-3 d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">✉</span>
                <input type="email" className="form-control border-start-0 bg-light"
                  placeholder="admin@gmail.com"
                  value={form.email}
                  onChange={e => { setForm({ ...form, email: e.target.value }); setError('') }} />
              </div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">🔒</span>
                <input type={showPass ? 'text' : 'password'} className="form-control border-start-0 border-end-0 bg-light"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => { setForm({ ...form, password: e.target.value }); setError('') }} />
                <button type="button" className="input-group-text bg-light"
                  onClick={() => setShowPass(!showPass)}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check mb-0">
                <input className="form-check-input" type="checkbox" id="remember" />
                <label className="form-check-label" htmlFor="remember" style={{ fontSize: 13 }}>Remember me</label>
              </div>
              <a href="#" style={{ color: '#00b894', fontSize: 13 }}>Forgot password?</a>
            </div>

            {/* Submit */}
            <button type="submit" className="btn w-100 text-white fw-semibold py-2"
              style={{ background: '#00b894', borderRadius: 8, fontSize: 15 }}
              disabled={loading}>
              {loading
                ? <span className="spinner-border spinner-border-sm me-2" />
                : null}
              {loading ? 'Logging in...' : 'Login to Admin Panel →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin