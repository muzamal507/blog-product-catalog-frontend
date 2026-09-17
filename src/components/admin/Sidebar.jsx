import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const menuItems = [
  { icon: '📊', label: 'Dashboard',    to: '/admin'                    },
  { icon: '📦', label: 'Products',     to: '/admin/products'           },
  { icon: '🏷️', label: 'Brands',       to: '/admin/brands'             },
  { icon: '📂', label: 'Categories',   to: '/admin/product-categories' },
  { icon: '🎨', label: 'Attributes',   to: '/admin/attributes'         },
  { icon: '🛒', label: 'Orders',       to: '/admin/orders'             },
  { icon: '✍️', label: 'Blogs',        to: '/admin/blogs'              },
  { icon: '⭐', label: 'Testimonials', to: '/admin/testimonials'       },
]

function Sidebar({ isOpen, isMobile, onClose }) {
  const { logout, admin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const handleNavClick = () => {
    if (isMobile && onClose) onClose()
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      height: '100vh',
      width: isOpen ? 250 : (isMobile ? 0 : 70),
      background: '#0d1b2a',
      transition: 'width 0.3s',
      zIndex: 200,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Brand */}
      <div className="d-flex align-items-center gap-2 p-3"
          style={{borderBottom: '1px solid rgba(237, 243, 242, 0.08)', minHeight: 64}} >

        <img src="/tech-logo-w.png" alt="Tahir Electronics"
          style={{ width: 46, height: 46, flexShrink: 0, objectFit: 'contain', borderRadius: 8}} />

        {isOpen && (
          <div style={{ whiteSpace: 'nowrap' }}>
            <div className="text-white fw-bold" style={{ fontSize: 15 }} >
              Tahir Electronics
            </div>

            <div style={{ color: '#8fa3b8', fontSize: 11 }}>
              Admin Panel
            </div>
          </div>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-fill p-2" style={{ overflowY: 'auto' }}>
        {isOpen && (
          <div style={{
            color: '#4b5563', fontSize: 10,
            fontWeight: 700, letterSpacing: 1.5,
            padding: '4px 10px', marginBottom: 8
          }}>
            MAIN MENU
          </div>
        )}
        {menuItems.map(item => (
          <NavLink key={item.to} to={item.to}
            end={item.to === '/admin'}
            onClick={handleNavClick}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center',
              gap: 12, padding: '10px 12px',
              borderRadius: 8, textDecoration: 'none',
              marginBottom: 2,
              color: isActive ? '#fff' : '#8fa3b8',
              background: isActive ? '#00b894' : 'transparent',
              fontWeight: 500, fontSize: 14,
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            })}>
            <span style={{ fontSize: 18, width: 24, textAlign: 'center', flexShrink: 0 }}>
              {item.icon}
            </span>
            {isOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-2" style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}>
        <button onClick={handleLogout}
          className="btn w-100 d-flex align-items-center gap-2"
          style={{
            color: '#ef4444', fontWeight: 500,
            fontSize: 14, whiteSpace: 'nowrap', borderRadius: 8
          }}>
          <span style={{ fontSize: 18, width: 24, textAlign: 'center', flexShrink: 0 }}>🚪</span>
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  )
}

export default Sidebar