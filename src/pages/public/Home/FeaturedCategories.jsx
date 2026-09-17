import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import productCategoryService from '../../../services/productCategoryService'

function FeaturedCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    productCategoryService.getAll({ featured: true, all: true })
      .then(res => {
        const data = res.data.data?.data || res.data.data || []
        setCategories(data.slice(0, 4))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <section className="py-5 px-3 px-md-4">
      <div className="text-center mb-4">
        <small className="fw-bold text-uppercase" style={{ color: '#00b894', letterSpacing: 2 }}>
          CLASSIFICATION
        </small>
        <h2 className="fw-bold mt-1">Featured Categories</h2>
        <div className="mx-auto mt-2" style={{ width: 48, height: 3, background: '#00b894', borderRadius: 2 }} />
      </div>
      <div className="row g-2">
        {[1,2,3,4].map(i => (
          <div className="col-6 col-md-3" key={i}>
            <div className="rounded-3" style={{ aspectRatio: '1', background: '#f3f4f6',
              animation: 'pulse 1.5s infinite' }} />
          </div>
        ))}
      </div>
    </section>
  )

  return (
    <section className="py-4 py-md-5 px-3 px-md-4">
      <div className="text-center mb-4">
        <small className="fw-bold text-uppercase" style={{ color: '#00b894', letterSpacing: 2, fontSize: 11 }}>
          CLASSIFICATION
        </small>
        <h2 className="fw-bold mt-1" style={{ fontSize: 'clamp(20px,4vw,32px)' }}>
          Featured Categories
        </h2>
        <div className="mx-auto mt-2" style={{ width: 48, height: 3, background: '#00b894', borderRadius: 2 }} />
      </div>

      {categories.length === 0 ? (
        <div className="text-center text-muted py-4">No featured categories yet.</div>
      ) : (
        <div className="row g-2 g-md-3">
          {categories.map(cat => (
            <div className="col-6 col-md-3" key={cat.id}>
              <Link to={`/catalog?category_id=${cat.id}`} className="text-decoration-none">
                <div className="position-relative rounded-3 overflow-hidden"
                  style={{ aspectRatio: '1', cursor: 'pointer' }}>
                  {cat.image_url ? (
                    <img src={cat.image_url} alt={cat.name}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover', transition: 'transform 0.4s' }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.06)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                  ) : (
                    <div className="w-100 h-100 d-flex align-items-center justify-content-center"
                      style={{ background: 'linear-gradient(135deg,#0d1b2a,#0f2d40)' }}>
                      <span style={{ fontSize: 56 }}>📂</span>
                    </div>
                  )}
                  <div className="position-absolute bottom-0 start-0 end-0 p-2 p-md-3"
                    style={{ background: 'linear-gradient(transparent,rgba(0,0,0,.7))',
                      color: '#fff', fontWeight: 600, fontSize: 'clamp(12px,2vw,15px)' }}>
                    {cat.name}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* View All */}
      <div className="text-center mt-4">
        <Link to="/categories"
          className="btn px-4 py-2 fw-semibold"
          style={{ border: '2px solid #00b894', color: '#00b894',
            borderRadius: 8, background: 'transparent' }}>
          View All Categories →
        </Link>
      </div>
    </section>
  )
}

export default FeaturedCategories