import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

const navLinks = [
  { to: '/',            label: 'Home'         },
  { to: '/catalog',     label: 'Catalog'      },
  { to: '/categories',  label: 'Categories'   },
  { to: '/brands',      label: 'Brands'       },
  { to: '/blogs',       label: 'Blogs'        },
  { to: '/testimonials',label: 'Reviews'      },
  { to: '/contact',     label: 'Contact Us'   },
]

function Navbar() {
  const { totalItems } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-white border-bottom sticky-top shadow-sm" style={{ zIndex: 100 }}>
      <div className="d-flex align-items-center justify-content-between px-3 px-md-4"
        style={{ height: 60 }}>

        {/* Logo */}
        <Link to="/" onClick={() => setOpen(false)}>
          {/* <div style={{
            width: 80, height: 36,
            background: 'linear-gradient(135deg,#ff6b6b,#a855f7,#3b82f6)',
            borderRadius: 8
          }} /> */}
          <h4>Tahir Electronic's</h4>
          <small>Home Appliance Showroom</small>
        </Link>

        {/* Desktop Links */}
        <ul className="d-none d-lg-flex list-unstyled mb-0 gap-1 align-items-center">
          {navLinks.map(link => (
            <li key={link.to}>
              <NavLink to={link.to} end
                className={({ isActive }) =>
                  `px-3 py-2 rounded-2 fw-medium d-block`
                }
                style={({ isActive }) => ({
                  color: isActive ? '#00b894' : '#374151',
                  fontSize: 14,
                  textDecoration: 'none',
                  background: isActive ? '#00b89412' : 'transparent'
                })}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right: Cart + Hamburger */}
        <div className="d-flex align-items-center gap-3">
          <Link to="/cart" className="position-relative text-dark"
            style={{ fontSize: 20 }}>
            🛒
            {totalItems > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                style={{ background: '#00b894', fontSize: 9, padding: '3px 5px' }}>
                {totalItems}
              </span>
            )}
          </Link>

          {/* Hamburger — mobile only */}
          <button
            className="d-lg-none btn btn-sm btn-light border-0 p-2"
            onClick={() => setOpen(!open)}
            style={{ fontSize: 20 }}>
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && (
        <div className="d-lg-none border-top bg-white px-3 py-2"
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,.08)' }}>
          {navLinks.map(link => (
            <NavLink key={link.to} to={link.to} end
              onClick={() => setOpen(false)}
              style={({ isActive }) => ({
                display: 'block',
                padding: '10px 12px',
                borderRadius: 8,
                color: isActive ? '#00b894' : '#374151',
                fontWeight: 500,
                fontSize: 15,
                textDecoration: 'none',
                background: isActive ? '#00b89412' : 'transparent',
                marginBottom: 4
              })}>
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navbar