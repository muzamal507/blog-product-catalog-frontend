import React, { useState, useEffect } from 'react'
import testimonialService from '../../../services/testimonialService'

const StarRating = ({ rating, size = 16 }) => (
  <span style={{ color: '#f59e0b', fontSize: size, letterSpacing: 1 }}>
    {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
  </span>
)

function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading]           = useState(true)
  const [filter, setFilter]             = useState('all')
  const [page, setPage]                 = useState(1)
  const [hasMore, setHasMore]           = useState(false)
  const PER_PAGE = 9

  useEffect(() => {
    setLoading(true)
    const params = {
      per_page: PER_PAGE,
      page,
      ...(filter === 'featured' ? { featured: 1 } : {}),
      ...(filter !== 'all' && filter !== 'featured' ? { min_rating: filter } : {}),
    }

    testimonialService.getAll(params)
      .then(res => {
        const data = res.data.data
        const list = data?.data || data || []
        if (page === 1) {
          setTestimonials(list)
        } else {
          setTestimonials(prev => [...prev, ...list])
        }
        setHasMore(data?.current_page < data?.last_page)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [filter, page])

  const handleFilterChange = (f) => {
    setFilter(f)
    setPage(1)
    setTestimonials([])
  }

  const avgRating = testimonials.length
    ? (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)
    : 5

  return (
    <div>
      {/* Hero */}
      <div className="py-5 text-center"
        style={{ background: 'linear-gradient(135deg,#0d1b2a,#0f2d40)' }}>
        <small className="fw-bold text-uppercase" style={{ color: '#00b894', letterSpacing: 2 }}>
          VERIFICATION
        </small>
        <h1 className="fw-bold text-white mt-2 mb-2">What Our Buyers Say</h1>
        <p style={{ color: '#8fa3b8' }}>
          Real experiences from real customers — no replicas, no fake reviews
        </p>

        {/* Stats */}
        {testimonials.length > 0 && (
          <div className="d-flex justify-content-center gap-4 mt-4">
            <div className="text-center">
              <div className="fw-bold text-white" style={{ fontSize: 28 }}>{testimonials.length}+</div>
              <small style={{ color: '#8fa3b8' }}>Reviews</small>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,.2)' }} />
            <div className="text-center">
              <div className="fw-bold text-white" style={{ fontSize: 28 }}>{avgRating}</div>
              <small style={{ color: '#8fa3b8' }}>Avg Rating</small>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,.2)' }} />
            <div className="text-center">
              <div className="fw-bold text-white" style={{ fontSize: 28 }}>
                {testimonials.filter(t => t.rating === 5).length}
              </div>
              <small style={{ color: '#8fa3b8' }}>5 Star Reviews</small>
            </div>
          </div>
        )}
      </div>

      <div className="container py-5">

        {/* Filters */}
        <div className="d-flex flex-wrap gap-2 mb-5 justify-content-center">
          {[
            { key: 'all',      label: 'All Reviews' },
            { key: 'featured', label: '⭐ Featured' },
            { key: '5',        label: '★★★★★ 5 Star' },
            { key: '4',        label: '★★★★ 4 Star' },
          ].map(f => (
            <button key={f.key}
              onClick={() => handleFilterChange(f.key)}
              className="btn btn-sm fw-semibold px-3"
              style={{
                borderRadius: 20,
                background: filter === f.key ? '#00b894' : '#f3f4f6',
                color: filter === f.key ? '#fff' : '#374151',
                border: 'none', transition: 'all 0.2s'
              }}>
              {f.label}
            </button>
          ))}
        </div>

        {loading && page === 1 ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#00b894' }} />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <div style={{ fontSize: 48 }}>⭐</div>
            <p className="mt-3">No reviews found.</p>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {testimonials.map(t => (
                <div className="col-12 col-md-6 col-lg-4" key={t.id}>
                  <div className="card border-0 shadow-sm h-100 p-4"
                    style={{
                      borderRadius: 16,
                      borderLeft: t.is_featured ? '3px solid #f59e0b' : '3px solid transparent',
                      transition: 'transform 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                    onMouseOut={e => e.currentTarget.style.transform = ''}>

                    {/* Stars */}
                    <div className="mb-3">
                      <StarRating rating={t.rating} />
                      {t.is_featured && (
                        <span className="badge ms-2"
                          style={{ background: '#fef9c3', color: '#854d0e', fontSize: 10 }}>
                          ⭐ Featured
                        </span>
                      )}
                    </div>

                    {/* Message */}
                    <p className="text-muted fst-italic flex-fill mb-4"
                      style={{ fontSize: 14, lineHeight: 1.8,
                        display: '-webkit-box', WebkitLineClamp: 5,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      "{t.message}"
                    </p>

                    {/* Author */}
                    <div className="d-flex align-items-center gap-3 mt-auto pt-3"
                      style={{ borderTop: '1px solid #f0f0f0' }}>
                      {t.image_url ? (
                        <img src={t.image_url} alt={t.name}
                          className="rounded-circle"
                          style={{ width: 44, height: 44, objectFit: 'cover', flexShrink: 0 }} />
                      ) : (
                        <div style={{
                          width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                          background: 'linear-gradient(135deg,#00b894,#0d9488)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontWeight: 700, fontSize: 18
                        }}>
                          {t.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div style={{ minWidth: 0 }}>
                        <div className="fw-bold text-truncate" style={{ fontSize: 14, color: '#1a1a2e' }}>
                          {t.name}
                        </div>
                        {(t.designation || t.company) && (
                          <small className="text-muted text-truncate d-block" style={{ fontSize: 12 }}>
                            {[t.designation, t.company].filter(Boolean).join(', ')}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-5">
                <button
                  className="btn px-5 py-2 fw-semibold text-white"
                  style={{ background: '#00b894', borderRadius: 8 }}
                  disabled={loading}
                  onClick={() => setPage(p => p + 1)}>
                  {loading
                    ? <><span className="spinner-border spinner-border-sm me-2" />Loading...</>
                    : 'Load More Reviews'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default TestimonialsPage