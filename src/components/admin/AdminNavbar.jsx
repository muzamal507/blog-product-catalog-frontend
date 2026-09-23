import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

function AdminNavbar({ onMenuClick }) {
  const { admin, logout } = useAuth()
  const { totalItems }    = useCart()
  const navigate          = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <header className="d-flex align-items-center px-3 px-md-4"
      style={{
        height: 60, background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 1px 4px rgba(0,0,0,.06)'
      }}>

      {/* Hamburger — mobile only */}
      <button
        className="btn btn-sm d-lg-none me-3"
        style={{ color: '#374151', background: 'none', border: 'none', padding: 4 }}
        onClick={onMenuClick}>
        <div style={{ width: 20, height: 2, background: 'currentColor', marginBottom: 4 }} />
        <div style={{ width: 20, height: 2, background: 'currentColor', marginBottom: 4 }} />
        <div style={{ width: 14, height: 2, background: 'currentColor' }} />
      </button>

      {/* Page Title — mobile */}
      <span className="fw-bold d-lg-none" style={{ fontSize: 15, color: '#1a1a2e' }}>
        Aero<span style={{ color: '#00b894' }}>Lux</span>
      </span>

      {/* Spacer */}
      <div className="flex-fill" />

      {/* Right actions */}
      <div className="d-flex align-items-center gap-2 gap-md-3">

        {/* View Site */}
        <Link to="/" target="_blank"
          className="btn btn-sm btn-outline-secondary d-none d-md-inline-flex"
          style={{ fontSize: 12 }}>
          🌐 View Site
        </Link>

        {/* Cart */}
        <Link to="/cart" className="position-relative"
          style={{ color: '#374151', fontSize: 20 }}>
          🛒
          {totalItems > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
              style={{ background: '#00b894', fontSize: 9, padding: '3px 5px' }}>
              {totalItems}
            </span>
          )}
        </Link>

        {/* Admin dropdown */}
        <div className="dropdown">
          <button className="btn btn-sm d-flex align-items-center gap-2"
            style={{ border: 'none', background: 'none', padding: 0 }}
            data-bs-toggle="dropdown">
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: '#00b894', color: '#fff',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 700, fontSize: 14
            }}>
              {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <span className="d-none d-md-block fw-semibold" style={{ fontSize: 13 }}>
              {admin?.name || 'Admin'}
            </span>
            <span className="d-none d-md-block text-muted" style={{ fontSize: 12 }}>▾</span>
          </button>

          <ul className="dropdown-menu dropdown-menu-end shadow border-0"
            style={{ borderRadius: 10, minWidth: 160 }}>
            <li className="px-3 py-2 border-bottom">
              <div className="fw-semibold" style={{ fontSize: 13 }}>{admin?.name}</div>
              <small className="text-muted" style={{ fontSize: 11 }}>{admin?.email}</small>
            </li>
            <li>
              <Link to="/admin/settings" className="dropdown-item" style={{ fontSize: 13 }}>
                ⚙️ Settings
              </Link>
            </li>
            <li>
              <Link to="/" className="dropdown-item" style={{ fontSize: 13 }}>
                🌐 View Site
              </Link>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button className="dropdown-item text-danger" style={{ fontSize: 13 }}
                onClick={handleLogout}>
                🚪 Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}

export default AdminNavbar