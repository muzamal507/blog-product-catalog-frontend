import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

function NotFound() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [count, setCount] = useState(10)

  // Auto-redirect after 10s
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          clearInterval(timer)
          navigate('/')
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [navigate])

  const quickLinks = [
    { to: '/',             icon: '🏠', label: 'Home'        },
    { to: '/catalog',      icon: '📦', label: 'Catalog'     },
    { to: '/categories',   icon: '📂', label: 'Categories'  },
    { to: '/blogs',        icon: '✍️', label: 'Blog'        },
    { to: '/contact',      icon: '📞', label: 'Contact'     },
  ]

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container text-center py-5">

        {/* Animated 404 */}
        <div style={{ position: 'relative', marginBottom: 32 }}>
          <div style={{
            fontSize: 'clamp(80px,20vw,160px)',
            fontWeight: 900, lineHeight: 1,
            color: '#f0f0f0', userSelect: 'none',
            letterSpacing: -4
          }}>
            404
          </div>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            fontSize: 'clamp(40px,10vw,72px)',
          }}>
            🔍
          </div>
        </div>

        <h1 className="fw-bold mb-3"
          style={{ fontSize: 'clamp(22px,4vw,34px)', color: '#1a1a2e' }}>
          Page Not Found
        </h1>

        <p className="text-muted mb-2" style={{ maxWidth: 440, margin: '0 auto 8px' }}>
          The page{' '}
          <code style={{ color: '#dc2626', fontSize: 13 }}>
            {location.pathname}
          </code>{' '}
          doesn't exist or has been moved.
        </p>

        <p className="text-muted mb-5" style={{ fontSize: 14 }}>
          Redirecting to home in{' '}
          <span className="fw-bold" style={{ color: '#00b894' }}>{count}s</span>...
        </p>

        {/* Quick links */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
          {quickLinks.map(link => (
            <Link key={link.to} to={link.to}
              className="btn btn-sm fw-semibold px-3"
              style={{
                background: '#f3f4f6', color: '#374151',
                border: 'none', borderRadius: 8, fontSize: 13
              }}
              onMouseOver={e => e.currentTarget.style.background = '#e5e7eb'}
              onMouseOut={e => e.currentTarget.style.background = '#f3f4f6'}>
              {link.icon} {link.label}
            </Link>
          ))}
        </div>

        {/* Primary CTA */}
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <button className="btn btn-outline-secondary px-4"
            onClick={() => navigate(-1)}>
            ← Go Back
          </button>
          <Link to="/" className="btn text-white fw-semibold px-5"
            style={{ background: '#00b894', borderRadius: 8 }}>
            🏠 Back to Home
          </Link>
        </div>

        {/* Decorative */}
        <div className="mt-5 pt-3">
          <small className="text-muted" style={{ fontSize: 12 }}>
            Lost? Try the{' '}
            <Link to="/catalog" style={{ color: '#00b894' }}>product catalog</Link>
            {' '}or{' '}
            <Link to="/contact" style={{ color: '#00b894' }}>contact us</Link>.
          </small>
        </div>
      </div>
    </div>
  )
}

export default NotFound