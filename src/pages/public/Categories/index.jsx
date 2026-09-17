import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import productCategoryService from '../../../services/productCategoryService'

function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [searchParams]              = useSearchParams()

  useEffect(() => {
    productCategoryService.getAll({ all: true })
      .then(res => {
        const data = res.data.data?.data || res.data.data || []
        setCategories(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const parents  = categories.filter(c => !c.parent_id)
  const children = (parentId) => categories.filter(c => c.parent_id === parentId)

  return (
    <div>
      {/* Hero */}
      <div className="py-5 text-center"
        style={{ background: 'linear-gradient(135deg,#0d1b2a,#0f2d40)' }}>
        <small className="fw-bold text-uppercase" style={{ color: '#00b894', letterSpacing: 2 }}>
          CLASSIFICATION
        </small>
        <h1 className="fw-bold text-white mt-2 mb-2">All Categories</h1>
        <p style={{ color: '#8fa3b8' }}>Browse our curated product collections</p>
      </div>

      <div className="container py-5">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#00b894' }} />
          </div>
        ) : parents.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <div style={{ fontSize: 48 }}>📂</div>
            <p className="mt-3">No categories found.</p>
          </div>
        ) : (
          <div className="row g-4">
            {parents.map(cat => (
              <div className="col-12 col-sm-6 col-lg-4" key={cat.id}>
                <Link
                  to={`/catalog?category_id=${cat.id}`}
                  className="text-decoration-none">
                  <div className="card border-0 shadow-sm h-100 overflow-hidden"
                    style={{ borderRadius: 16, transition: 'transform 0.2s, box-shadow 0.2s' }}
                    onMouseOver={e => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,.12)'
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.transform = ''
                      e.currentTarget.style.boxShadow = ''
                    }}>
                    {/* Image */}
                    <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: '#f3f4f6' }}>
                      {cat.image_url ? (
                        <img src={cat.image_url} alt={cat.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover',
                            transition: 'transform 0.4s' }}
                          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                          onMouseOut={e => e.currentTarget.style.transform = ''} />
                      ) : (
                        <div className="w-100 h-100 d-flex align-items-center justify-content-center"
                          style={{ background: 'linear-gradient(135deg,#0d1b2a,#0f2d40)' }}>
                          <span style={{ fontSize: 56 }}>📂</span>
                        </div>
                      )}
                      {cat.is_featured && (
                        <span className="badge position-absolute top-0 end-0 m-2"
                          style={{ background: '#f59e0b', fontSize: 11 }}>⭐ Featured</span>
                      )}
                    </div>

                    {/* Body */}
                    <div className="card-body p-4">
                      <h5 className="fw-bold mb-2" style={{ color: '#1a1a2e' }}>{cat.name}</h5>
                      {cat.description && (
                        <p className="text-muted mb-3"
                          style={{ fontSize: 13, lineHeight: 1.7,
                            display: '-webkit-box', WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {cat.description}
                        </p>
                      )}

                      {/* Subcategories */}
                      {children(cat.id).length > 0 && (
                        <div className="d-flex flex-wrap gap-1 mb-3">
                          {children(cat.id).slice(0, 4).map(sub => (
                            <Link key={sub.id}
                              to={`/catalog?category_id=${sub.id}`}
                              onClick={e => e.stopPropagation()}
                              className="badge text-decoration-none px-2 py-1"
                              style={{ background: '#00b89415', color: '#00b894',
                                fontSize: 11, border: '1px solid #00b89430' }}>
                              {sub.name}
                            </Link>
                          ))}
                          {children(cat.id).length > 4 && (
                            <span className="badge" style={{ background: '#f3f4f6', color: '#6b7280', fontSize: 11 }}>
                              +{children(cat.id).length - 4} more
                            </span>
                          )}
                        </div>
                      )}

                      <div className="d-flex align-items-center"
                        style={{ color: '#00b894', fontSize: 13, fontWeight: 600 }}>
                        Browse Collection
                        <span className="ms-1">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoriesPage