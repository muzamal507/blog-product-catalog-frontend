import React from 'react'
import { Link } from 'react-router-dom'

function TopBar() {
  return (
    <div style={{ background: '#0d1b2a' }} className="py-2 px-3 px-md-4">
      <div className="d-flex justify-content-between align-items-center">
        {/* Left — hide on mobile */}
        <div className="d-flex gap-3 align-items-center">
          <small className="text-secondary d-none d-sm-block" style={{ fontSize: 11 }}>
            📞 +92 333 0437 507
          </small>
          <small className="text-secondary d-none d-lg-block" style={{ fontSize: 11 }}>
            🕐 Mon–Fri: 9:00 AM–6:00 PM, Sat: 10:00 AM–4:00 PM
          </small>
        </div>
        {/* Right */}
        <div className="d-flex align-items-center gap-2 ms-auto">
          <small className="text-secondary d-none d-md-block" style={{ fontSize: 11 }}>
            📍 Google Map Store Location
          </small>
          <Link to="/admin"
            className="badge text-decoration-none px-2 px-md-3 py-1 py-md-2"
            style={{ background: '#00b894', fontSize: '10px', letterSpacing: '0.5px' }}>
            ADMIN PANEL
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TopBar