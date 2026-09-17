import React from 'react'
import { Link } from 'react-router-dom'

function HeroSection() {
  return (
    <section style={{
      background: 'linear-gradient(120deg,#0d1b2a 55%,#1a2d40 100%)',
      minHeight: 'clamp(340px, 55vw, 480px)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center'
    }}>
      {/* BG Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'url(https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1400&q=80) center/cover',
        opacity: 0.18
      }} />

      <div className="container-fluid px-3 px-md-5 position-relative" style={{ zIndex: 2 }}>
        <div className="row">
          <div className="col-12 col-md-8 col-lg-6">
            <span className="badge border fw-semibold mb-3 px-3 py-2 d-inline-block"
              style={{ borderColor: '#00b894', color: '#00b894',
                background: 'transparent', letterSpacing: 1, fontSize: 10 }}>
              PREMIUM CURATION CATALOG
            </span>

            <h1 className="fw-bold text-white mb-3"
              style={{ fontSize: 'clamp(26px, 5vw, 52px)', lineHeight: 1.15 }}>
              Home Appliance Products
            </h1>

            <p className="mb-4 d-none d-sm-block"
              style={{ color: '#8fa3b8', fontSize: 'clamp(13px, 2vw, 15px)',
                lineHeight: 1.8, maxWidth: 420 }}>
              Explore limited run automatic watches, custom-milled peripherals,
              and full-grain travel gear.
            </p>

            <Link to="/catalog"
              className="btn px-3 px-md-4 py-2 fw-semibold text-white"
              style={{ background: '#00b894', borderRadius: 6, fontSize: 14 }}>
              Explore Collection →
            </Link>
          </div>
        </div>
      </div>

      {/* Arrows — desktop only */}
      <div className="d-none d-md-flex position-absolute end-0 top-50 translate-middle-y gap-2 me-3"
        style={{ zIndex: 2 }}>
        {['‹', '›'].map(a => (
          <button key={a} className="btn btn-sm rounded-circle"
            style={{ background: 'rgba(255,255,255,.15)', color: '#fff',
              border: '1px solid rgba(255,255,255,.2)', width: 34, height: 34 }}>
            {a}
          </button>
        ))}
      </div>
    </section>
  )
}

export default HeroSection