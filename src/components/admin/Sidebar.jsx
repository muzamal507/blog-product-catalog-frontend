import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const MENU = [
  {
    icon: '📊', label: 'Dashboard',
    to: '/admin', exact: true
  },
  {
    icon: '🛒', label: 'Catalog', group: true,
    children: [
      { icon: '📦', label: 'Products',    to: '/admin/products'           },
      { icon: '🏷️', label: 'Brands',      to: '/admin/brands'             },
      { icon: '📂', label: 'Categories',  to: '/admin/product-categories' },
      { icon: '🎨', label: 'Attributes',  to: '/admin/attributes'         },
    ]
  },
  {
    icon: '🛍️', label: 'Orders',
    to: '/admin/orders'
  },
  {
    icon: '✍️', label: 'Blog', group: true,
    children: [
      { icon: '📝', label: 'Posts',       to: '/admin/blogs'              },
      { icon: '📂', label: 'Categories',  to: '/admin/blog-categories'    },
      { icon: '🏷️', label: 'Tags',        to: '/admin/blog-tags'          },
      { icon: '📄', label: 'Pages',       to: '/admin/pages'              },
    ]
  },
  {
    icon: '🖼️', label: 'Sliders',
    to: '/admin/sliders'
  },
  {
    icon: '⭐', label: 'Testimonials',
    to: '/admin/testimonials'
  },
  {
    icon: '📧', label: 'Newsletter',
    to: '/admin/newsletter'
  },
  {
    icon: '📬', label: 'Messages',
    to: '/admin/contact-messages'
  },
  {
    icon: '⚙️', label: 'Settings',
    to: '/admin/settings'
  },
]

function Sidebar({ open, onClose }) {
  const location = useLocation()

  // Track which groups are open
  const [openGroups, setOpenGroups] = useState(() => {
    // Auto-open groups whose child matches current route
    const initial = {}
    MENU.forEach(item => {
      if (item.group) {
        const isActive = item.children.some(c => location.pathname.startsWith(c.to))
        if (isActive) initial[item.label] = true
      }
    })
    return initial
  })

  // Auto-open group when route changes
  useEffect(() => {
    MENU.forEach(item => {
      if (item.group) {
        const isActive = item.children.some(c => location.pathname.startsWith(c.to))
        if (isActive) {
          setOpenGroups(prev => ({ ...prev, [item.label]: true }))
        }
      }
    })
  }, [location.pathname])

  const toggleGroup = (label) => {
    setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }))
  }

  const isActive = (to, exact = false) => {
    if (exact) return location.pathname === to
    return location.pathname.startsWith(to)
  }

  const isGroupActive = (children) => {
    return children.some(c => location.pathname.startsWith(c.to))
  }

  const SidebarContent = () => (
    <div className="d-flex flex-column h-100">
      {/* Logo */}
      <div className="px-4 py-3 d-flex align-items-center justify-content-between"
        style={{ borderBottom: '1px solid rgba(255,255,255,.08)' }}>
        <Link to="/admin" className="text-decoration-none"
          onClick={() => window.innerWidth < 992 && onClose?.()}>
          <span className="fw-bold text-white" style={{ fontSize: 18, letterSpacing: 0.5 }}>
            Aero<span style={{ color: '#00b894' }}>Lux</span>
          </span>
          <span className="text-muted ms-2" style={{ fontSize: 11 }}>Admin</span>
        </Link>
        {/* Close button — mobile only */}
        <button className="btn btn-sm d-lg-none"
          style={{ color: '#8fa3b8', background: 'none', border: 'none' }}
          onClick={onClose}>✕</button>
      </div>

      {/* Nav */}
      <nav className="flex-fill py-3 overflow-auto" style={{ scrollbarWidth: 'thin' }}>
        {MENU.map((item) => {

          // Group item
          if (item.group) {
            const groupActive = isGroupActive(item.children)
            const isOpen      = openGroups[item.label]

            return (
              <div key={item.label}>
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(item.label)}
                  className="d-flex align-items-center w-100 px-4 py-2"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: groupActive ? '#00b894' : '#8fa3b8',
                    fontSize: 13, fontWeight: groupActive ? 600 : 400,
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={e => { if (!groupActive) e.currentTarget.style.color = '#c5d0dc' }}
                  onMouseOut={e => { if (!groupActive) e.currentTarget.style.color = '#8fa3b8' }}>
                  <span style={{ fontSize: 16, width: 24, flexShrink: 0 }}>{item.icon}</span>
                  <span className="flex-fill ms-2 text-start">{item.label}</span>
                  {/* Group indicator */}
                  {groupActive && (
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: '#00b894', flexShrink: 0, marginRight: 6
                    }} />
                  )}
                  {/* Arrow */}
                  <span style={{
                    fontSize: 11,
                    transform: isOpen ? 'rotate(90deg)' : 'rotate(0)',
                    transition: 'transform 0.2s',
                    flexShrink: 0
                  }}>›</span>
                </button>

                {/* Children */}
                <div style={{
                  overflow: 'hidden',
                  maxHeight: isOpen ? `${item.children.length * 44}px` : 0,
                  transition: 'max-height 0.3s ease',
                }}>
                  {item.children.map(child => {
                    const active = isActive(child.to)
                    return (
                      <Link key={child.to} to={child.to}
                        onClick={() => window.innerWidth < 992 && onClose?.()}
                        className="d-flex align-items-center text-decoration-none px-4 py-2"
                        style={{
                          paddingLeft: '52px !important',
                          color: active ? '#fff' : '#8fa3b8',
                          fontSize: 13, fontWeight: active ? 600 : 400,
                          background: active ? 'rgba(0,184,148,.15)' : 'transparent',
                          borderRight: active ? '3px solid #00b894' : '3px solid transparent',
                          transition: 'all 0.15s',
                          paddingLeft: 52,
                        }}
                        onMouseOver={e => { if (!active) e.currentTarget.style.color = '#c5d0dc' }}
                        onMouseOut={e => { if (!active) e.currentTarget.style.color = '#8fa3b8' }}>
                        <span style={{ fontSize: 14, width: 20, flexShrink: 0 }}>{child.icon}</span>
                        <span className="ms-2">{child.label}</span>
                      </Link>
                    )
                  })}
                </div>

                {/* Divider after group */}
                <div style={{ height: 1, background: 'rgba(255,255,255,.05)',
                  margin: '4px 16px' }} />
              </div>
            )
          }

          // Single item
          const active = isActive(item.to, item.exact)
          return (
            <Link key={item.to} to={item.to}
              onClick={() => window.innerWidth < 992 && onClose?.()}
              className="d-flex align-items-center text-decoration-none px-4 py-2"
              style={{
                color: active ? '#fff' : '#8fa3b8',
                fontSize: 13, fontWeight: active ? 600 : 400,
                background: active ? 'rgba(0,184,148,.15)' : 'transparent',
                borderRight: active ? '3px solid #00b894' : '3px solid transparent',
                transition: 'all 0.15s'
              }}
              onMouseOver={e => { if (!active) e.currentTarget.style.color = '#c5d0dc' }}
              onMouseOut={e => { if (!active) e.currentTarget.style.color = '#8fa3b8' }}>
              <span style={{ fontSize: 16, width: 24, flexShrink: 0 }}>{item.icon}</span>
              <span className="ms-2">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}>
        <div className="d-flex align-items-center gap-2">
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: '#00b894', color: '#fff',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 700, fontSize: 14
          }}>A</div>
          <div style={{ minWidth: 0 }}>
            <div className="text-white fw-semibold text-truncate" style={{ fontSize: 13 }}>
              Admin
            </div>
            <small className="text-muted" style={{ fontSize: 11, background: '#424444', 
              color: '#d4d1d1',}}>Administrator</small>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="d-none d-lg-flex flex-column h-100"
        style={{ background: '#0d1b2a', width: 240, flexShrink: 0 }}>
        <SidebarContent />
      </div>

      {/* Mobile Overlay */}
      {open && (
        <>
          <div
            className="d-lg-none position-fixed top-0 start-0 w-100 h-100"
            style={{ background: 'rgba(0,0,0,.6)', zIndex: 1040 }}
            onClick={onClose}
          />
          <div className="d-lg-none position-fixed top-0 start-0 h-100"
            style={{
              background: '#0d1b2a', width: 260, zIndex: 1050,
              boxShadow: '4px 0 24px rgba(0,0,0,.4)',
              animation: 'slideIn .25s ease'
            }}>
            <SidebarContent />
          </div>
        </>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%) }
          to   { transform: translateX(0) }
        }
      `}</style>
    </>
  )
}

export default Sidebar