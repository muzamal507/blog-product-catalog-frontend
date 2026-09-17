import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer style={{ background: '#0d1b2a' }} className="pt-4 pt-md-5 pb-3 px-3 px-md-4">
      <div className="row g-4 pb-4 mb-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,.08)' }}>

        {/* Brand — full width mobile */}
        <div className="col-12 col-md-4">
          <div style={{ width: 80, height: 34,
            background: 'linear-gradient(135deg,#ff6b6b,#a855f7,#3b82f6)',
            borderRadius: 8 }} className="mb-3" />
          <p style={{ color: '#8fa3b8', fontSize: 13, lineHeight: 1.8 }}>
            Curated limited edition runs of titanium automatic wristwatches,
            mechanical peripherals, and handcrafted full-grain leather goods.
          </p>
        </div>

        {/* Nav — 2 cols on mobile */}
        <div className="col-6 col-md-2">
          <p className="fw-bold text-uppercase mb-3"
            style={{ color: '#00b894', fontSize: 11, letterSpacing: 1.5 }}>
            NAVIGATION
          </p>
          <ul className="list-unstyled mb-0">
            {[['/', 'Home'], ['/catalog', 'Catalog'], ['/about', 'About'], ['/blogs', 'Blogs']].map(([to, label]) => (
              <li key={to} className="mb-2">
                <Link to={to} style={{ color: '#8fa3b8', fontSize: 13 }}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Corporate — 2 cols on mobile */}
        <div className="col-6 col-md-3">
          <p className="fw-bold text-uppercase mb-3"
            style={{ color: '#00b894', fontSize: 11, letterSpacing: 1.5 }}>
            CORPORATE
          </p>
          <ul className="list-unstyled mb-0">
            {[
              ['/',             'Explore Home'     ],
              ['/catalog',      'Catalog'          ],
              ['/categories',   'All Categories'   ],
              ['/brands',       'All Brands'       ],
              ['/testimonials', 'Customer Reviews' ],
              ['/blogs',        'Chronicles Blogs' ],
            ].map(([to, label]) => (
              <li key={to} className="mb-2">
                <Link to={to} style={{ color: '#8fa3b8', fontSize: 13 }}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support — full width mobile */}
        <div className="col-12 col-md-3">
          <p className="fw-bold text-uppercase mb-3"
            style={{ color: '#00b894', fontSize: 11, letterSpacing: 1.5 }}>
            SUPPORT
          </p>
          {[
            ['🕐', 'Mon–Fri: 9AM–6PM, Sat: 10AM–4PM'],
            ['📞', '+92 333 0437 507'],
            ['✉',  'admin@gmail.com'],
          ].map(([icon, text]) => (
            <div key={text} className="d-flex gap-2 mb-2"
              style={{ color: '#8fa3b8', fontSize: 13 }}>
              <span style={{ flexShrink: 0 }}>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="d-flex flex-column flex-sm-row justify-content-center gap-1">
        <small style={{ color: '#4b5563' }}>© 2026 Tahir's Tech Solutions. All rights reserved.</small>
      </div>
    </footer>
  )
}

export default Footer