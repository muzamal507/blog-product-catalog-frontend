import React from 'react'
import { Link } from 'react-router-dom'

function AdminNotFound() {
  return (
    <div className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '60vh' }}>
      <div className="text-center p-4">
        <div style={{ fontSize: 80, fontWeight: 900, color: '#e5e7eb', lineHeight: 1 }}>
          404
        </div>
        <div style={{ fontSize: 40, marginTop: -24, marginBottom: 16 }}>🗺️</div>
        <h4 className="fw-bold mb-2">Page Not Found</h4>
        <p className="text-muted mb-4">
          This admin page doesn't exist or has been moved.
        </p>
        <div className="d-flex gap-3 justify-content-center">
          <Link to="/admin" className="btn text-white"
            style={{ background: '#00b894', borderRadius: 8 }}>
            📊 Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminNotFound