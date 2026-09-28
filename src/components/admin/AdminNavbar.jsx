import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth }          from '../../context/AuthContext'
import { useCart }          from '../../context/CartContext'
import { useNotifications } from '../../context/NotificationContext'

const TYPE_COLORS = {
  Success: { bg: '#d1fae5', color: '#059669', icon: '✅' },
  Info:    { bg: '#dbeafe', color: '#1d4ed8', icon: 'ℹ️' },
  Warning: { bg: '#fef9c3', color: '#854d0e', icon: '⚠️' },
  Error:   { bg: '#fee2e2', color: '#dc2626', icon: '❌' },
}

function AdminNavbar({ onMenuClick }) {
  const { admin, logout }                                          = useAuth()
  const { totalItems }                                             = useCart()
  const { unreadCount, notifications, loading,
          fetchRecent, markRead, markAllRead, clearAll }           = useNotifications()
  const navigate                                                   = useNavigate()

  const [bellOpen, setBellOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const handleBellOpen = () => {
    if (!bellOpen) fetchRecent()
    setBellOpen(p => !p)
  }

  return (
    <>
      <header className="d-flex align-items-center px-3 px-md-4"
        style={{
          height: 60, background: '#fff',
          borderBottom: '1px solid #e5e7eb',
          position: 'sticky', top: 0, zIndex: 100,
          boxShadow: '0 1px 4px rgba(0,0,0,.06)'
        }}>

        {/* Hamburger — mobile */}
        <button className="btn btn-sm d-lg-none me-3"
          style={{ color: '#374151', background: 'none', border: 'none', padding: 4 }}
          onClick={onMenuClick}>
          <div style={{ width: 20, height: 2, background: 'currentColor', marginBottom: 4 }} />
          <div style={{ width: 20, height: 2, background: 'currentColor', marginBottom: 4 }} />
          <div style={{ width: 14, height: 2, background: 'currentColor' }} />
        </button>

        {/* Brand — mobile */}
        <span className="fw-bold d-lg-none" style={{ fontSize: 15, color: '#1a1a2e' }}>
          Aero<span style={{ color: '#00b894' }}>Lux</span>
        </span>

        <div className="flex-fill" />

        {/* Right actions */}
        <div className="d-flex align-items-center gap-2 gap-md-3">

          {/* View Site */}
          <Link to="/" target="_blank"
            className="btn btn-sm btn-outline-secondary d-none d-md-inline-flex"
            style={{ fontSize: 12 }}>
            🌐 View Site
          </Link>

          {/* Notification Bell */}
          <div className="position-relative">
            <button
              className="btn btn-sm position-relative"
              style={{ background: 'none', border: 'none',
                color: '#374151', fontSize: 20, padding: '4px 8px' }}
              onClick={handleBellOpen}>
              🔔
              {unreadCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                  style={{ background: '#dc2626', fontSize: 9, padding: '3px 5px',
                    minWidth: 18, transform: 'translate(-40%, -20%)' }}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Bell Dropdown */}
            {bellOpen && (
              <>
                <div className="position-fixed top-0 start-0 w-100 h-100"
                  style={{ zIndex: 1040 }}
                  onClick={() => setBellOpen(false)} />

                <div className="position-absolute bg-white shadow"
                  style={{
                    right: 0, top: '110%', width: 360,
                    borderRadius: 12, zIndex: 1050,
                    border: '1px solid #e5e7eb',
                    maxHeight: 480, display: 'flex', flexDirection: 'column'
                  }}>

                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-center px-4 py-3"
                    style={{ borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
                    <div>
                      <span className="fw-bold" style={{ fontSize: 15 }}>Notifications</span>
                      {unreadCount > 0 && (
                        <span className="badge ms-2"
                          style={{ background: '#dc2626', fontSize: 11 }}>
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="d-flex gap-2">
                      {unreadCount > 0 && (
                        <button className="btn btn-sm"
                          style={{ fontSize: 11, color: '#00b894',
                            background: 'none', border: 'none', padding: 0 }}
                          onClick={markAllRead}>
                          ✓ Mark all read
                        </button>
                      )}
                      <button className="btn btn-sm"
                        style={{ fontSize: 11, color: '#dc2626',
                          background: 'none', border: 'none', padding: 0 }}
                        onClick={clearAll}>
                        Clear all
                      </button>
                    </div>
                  </div>

                  {/* List */}
                  <div style={{ overflowY: 'auto', flex: 1 }}>
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="spinner-border spinner-border-sm"
                          style={{ color: '#00b894' }} />
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="text-center py-5 text-muted">
                        <div style={{ fontSize: 36 }}>🔔</div>
                        <small className="d-block mt-2">No notifications</small>
                      </div>
                    ) : notifications.map(n => {
                      const colors = TYPE_COLORS[n.type] || TYPE_COLORS.Info
                      return (
                        <div key={n.id}
                          className="d-flex gap-3 px-4 py-3"
                          style={{
                            borderBottom: '1px solid #f3f4f6',
                            background: n.is_read ? '#fff' : '#f0fdf4',
                            cursor: 'pointer', transition: 'background 0.15s'
                          }}
                          onClick={() => !n.is_read && markRead(n.id)}
                          onMouseOver={e => e.currentTarget.style.background = '#f9fafb'}
                          onMouseOut={e => e.currentTarget.style.background =
                            n.is_read ? '#fff' : '#f0fdf4'}>

                          {/* Type icon */}
                          <div style={{
                            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                            background: colors.bg, color: colors.color,
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: 16
                          }}>
                            {colors.icon}
                          </div>

                          {/* Content */}
                          <div className="flex-fill" style={{ minWidth: 0 }}>
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="fw-semibold text-truncate"
                                style={{ fontSize: 13, maxWidth: 220 }}>
                                {n.title}
                              </div>
                              {!n.is_read && (
                                <div style={{
                                  width: 8, height: 8, borderRadius: '50%',
                                  background: '#00b894', flexShrink: 0, marginTop: 4
                                }} />
                              )}
                            </div>
                            {n.message && (
                              <div className="text-muted text-truncate"
                                style={{ fontSize: 12, marginTop: 2 }}>
                                {n.message}
                              </div>
                            )}
                            <small className="text-muted" style={{ fontSize: 11 }}>
                              {new Date(n.created_at).toLocaleString('en-US', {
                                month: 'short', day: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                              })}
                            </small>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Footer */}
                  <div className="text-center py-2"
                    style={{ borderTop: '1px solid #e5e7eb', flexShrink: 0 }}>
                    <Link to="/admin/notifications"
                      onClick={() => setBellOpen(false)}
                      style={{ color: '#00b894', fontSize: 13, fontWeight: 600 }}>
                      View All Notifications →
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

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
                <Link to="/admin/notifications" className="dropdown-item" style={{ fontSize: 13 }}>
                  🔔 Notifications
                  {unreadCount > 0 && (
                    <span className="badge ms-2"
                      style={{ background: '#dc2626', fontSize: 10 }}>
                      {unreadCount}
                    </span>
                  )}
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
    </>
  )
}

export default AdminNavbar