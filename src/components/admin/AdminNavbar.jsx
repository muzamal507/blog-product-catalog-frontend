import React from 'react'
import { useAuth } from '../../context/AuthContext'

function AdminNavbar({ onToggleSidebar }) {
  const { admin } = useAuth()

  return (
    <header className="bg-white d-flex align-items-center gap-3 px-4 sticky-top border-bottom"
      style={{ height: 64, zIndex: 100, boxShadow: '0 1px 4px rgba(0,0,0,.05)' }}>
      <button className="btn btn-light border-0 fs-5 p-2" onClick={onToggleSidebar}>☰</button>

      <div className="flex-fill text-muted" style={{ fontSize: 14 }}>
        Welcome back, <strong className="text-dark">{admin?.name || 'Admin'}</strong> 👋
      </div>

      <div className="d-flex align-items-center gap-3">
        <a href="/" target="_blank" className="btn btn-outline-secondary btn-sm">🌐 View Site</a>

        <div className="position-relative fs-5" style={{ cursor: 'pointer' }}>
          🔔
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger rounded-circle"
            style={{ width: 8, height: 8 }} />
        </div>

        <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-3 border" style={{ background: '#f9fafb' }}>
          <div style={{ width: 28, height: 28, background: '#00b894', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>
            {admin?.name?.charAt(0) || 'A'}
          </div>
          <span style={{ fontSize: 13, fontWeight: 500 }}>{admin?.name || 'Admin'}</span>
        </div>
      </div>
    </header>
  )
}

export default AdminNavbar