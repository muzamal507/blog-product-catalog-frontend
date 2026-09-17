import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import testimonialService from '../../../services/testimonialService'

function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading]           = useState(true)
  const [active, setActive]             = useState(0)

  useEffect(() => {
    testimonialService.getFeatured()
      .then(res => {
        const data = res.data.data?.data || res.data.data || []
        setTestimonials(data.slice(0, 6))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const t = testimonials[active]

  if (loading) return (
    <section className="py-5 px-3 px-md-4" style={{ background: '#f9fafb' }}>
      <div className="text-center mb-4">
        <small className="fw-bold text-uppercase" style={{ color: '#00b894', letterSpacing: 2 }}>
          VERIFICATION
        </small>
        <h2 className="fw-bold mt-1">What Our Buyers Say</h2>
        <div className="mx-auto mt-2" style={{ width: 48, height: 3, background: '#00b894', borderRadius: 2 }} />
      </div>
      <div className="card border-0 shadow-sm mx-auto p-5 text-center" style={{ maxWidth: 640, borderRadius: 12 }}>
        <div className="spinner-border mx-auto" style={{ color: '#00b894' }} />
      </div>
    </section>
  )

  if (testimonials.length === 0) return null

  return (
    <section className="py-4 py-md-5 px-3 px-md-4" style={{ background: '#f9fafb' }}>
      <div className="text-center mb-4">
        <small className="fw-bold text-uppercase" style={{ color: '#00b894', letterSpacing: 2, fontSize: 11 }}>
          VERIFICATION
        </small>
        <h2 className="fw-bold mt-1" style={{ fontSize: 'clamp(20px,4vw,32px)' }}>
          What Our Buyers Say
        </h2>
        <div className="mx-auto mt-2" style={{ width: 48, height: 3, background: '#00b894', borderRadius: 2 }} />
      </div>

      {t && (
        <div className="card border-0 shadow-sm mx-auto mb-4 p-4"
          style={{ maxWidth: 640, borderRadius: 12, minHeight: 200 }}>
          <div style={{ color: '#f59e0b', fontSize: 20 }} className="mb-3 text-center">
            {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
          </div>
          <p className="fst-italic text-muted mb-4 text-center" style={{ fontSize: 15, lineHeight: 1.8 }}>
            "{t.message}"
          </p>
          <div className="d-flex align-items-center justify-content-center gap-3">
            {t.image_url ? (
              <img src={t.image_url} alt={t.name}
                className="rounded-circle"
                style={{ width: 44, height: 44, objectFit: 'cover' }} />
            ) : (
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'linear-gradient(135deg,#00b894,#0d9488)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: 18, flexShrink: 0
              }}>
                {t.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="text-start">
              <div className="fw-bold" style={{ fontSize: 14 }}>{t.name}</div>
              {(t.designation || t.company) && (
                <small className="text-muted" style={{ fontSize: 12 }}>
                  {[t.designation, t.company].filter(Boolean).join(', ')}
                </small>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation dots */}
      {testimonials.length > 1 && (
        <div className="d-flex justify-content-center gap-2 mb-4">
          {testimonials.map((_, i) => (
            <button key={i} type="button"
              onClick={() => setActive(i)}
              style={{
                width: i === active ? 24 : 8,
                height: 8, borderRadius: 4,
                background: i === active ? '#00b894' : '#d1d5db',
                border: 'none', cursor: 'pointer',
                transition: 'all 0.3s'
              }} />
          ))}
        </div>
      )}

      {/* View All Link */}
      <div className="text-center">
        <Link to="/testimonials"
          style={{ color: '#00b894', fontWeight: 600, fontSize: 14 }}>
          Read All Reviews →
        </Link>
      </div>
    </section>
  )
}

export default Testimonials