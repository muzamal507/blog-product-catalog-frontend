import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import brandService from '../../../services/brandService'
import productCategoryService from '../../../services/productCategoryService'

function BrandsPage() {
  const [brands, setBrands]         = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [activeCategory, setActiveCategory] = useState('')
  const [catLoading, setCatLoading] = useState(false)

  // Load all categories for filter
  useEffect(() => {
    productCategoryService.getAll({ all: true })
      .then(res => setCategories(res.data.data?.data || res.data.data || []))
      .catch(() => {})
  }, [])

  // Load brands — filter by category
  useEffect(() => {
    setLoading(true)

    const fetchBrands = activeCategory
      ? brandService.getByCategoryId(activeCategory)
      : brandService.getAll({ all: true })

    fetchBrands
      .then(res => {
        const data = activeCategory
          ? res.data.data || []
          : res.data.data?.data || res.data.data || []
        setBrands(data)
      })
      .catch(() => setBrands([]))
      .finally(() => setLoading(false))
  }, [activeCategory])

  return (
    <div>
      {/* Hero */}
      <div className="py-5 text-center"
        style={{ background: 'linear-gradient(135deg,#0d1b2a,#0f2d40)' }}>
        <small className="fw-bold text-uppercase" style={{ color: '#00b894', letterSpacing: 2 }}>
          OUR PARTNERS
        </small>
        <h1 className="fw-bold text-white mt-2 mb-2">All Brands</h1>
        <p style={{ color: '#8fa3b8' }}>Premium brands curated for quality and authenticity</p>
      </div>

      <div className="container py-5">

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mb-5 justify-content-center">
            <button
              onClick={() => setActiveCategory('')}
              className="btn btn-sm fw-semibold px-3"
              style={{
                borderRadius: 20,
                background: !activeCategory ? '#00b894' : '#f3f4f6',
                color: !activeCategory ? '#fff' : '#374151',
                border: 'none'
              }}>
              All Categories
            </button>
            {categories.filter(c => !c.parent_id).map(cat => (
              <button key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.id ? '' : cat.id)}
                className="btn btn-sm fw-semibold px-3"
                style={{
                  borderRadius: 20,
                  background: activeCategory === cat.id ? '#00b894' : '#f3f4f6',
                  color: activeCategory === cat.id ? '#fff' : '#374151',
                  border: 'none', transition: 'all 0.2s'
                }}>
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#00b894' }} />
          </div>
        ) : brands.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <div style={{ fontSize: 48 }}>🏷️</div>
            <p className="mt-3">No brands found for this category.</p>
            {activeCategory && (
              <button className="btn btn-outline-secondary btn-sm mt-2"
                onClick={() => setActiveCategory('')}>
                Show All Brands
              </button>
            )}
          </div>
        ) : (
          <div className="row g-4">
            {brands.map(brand => (
              <div className="col-6 col-sm-4 col-lg-3" key={brand.id}>
                <Link
                  to={`/catalog?brand_id=${brand.id}`}
                  className="text-decoration-none">
                  <div className="card border-0 shadow-sm h-100 text-center p-4"
                    style={{ borderRadius: 16, transition: 'transform 0.2s, box-shadow 0.2s' }}
                    onMouseOver={e => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,.1)'
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.transform = ''
                      e.currentTarget.style.boxShadow = ''
                    }}>
                    {/* Logo */}
                    <div className="mx-auto mb-3"
                      style={{ width: 80, height: 80, borderRadius: 16, overflow: 'hidden',
                        background: '#f3f4f6', display: 'flex',
                        alignItems: 'center', justifyContent: 'center' }}>
                      {brand.image_url ? (
                        <img src={brand.image_url} alt={brand.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain',
                            padding: 8 }} />
                      ) : (
                        <span style={{ fontSize: 36 }}>🏷️</span>
                      )}
                    </div>

                    <h6 className="fw-bold mb-1" style={{ color: '#1a1a2e' }}>{brand.name}</h6>

                    {brand.description && (
                      <p className="text-muted mb-2"
                        style={{ fontSize: 12, lineHeight: 1.6,
                          display: '-webkit-box', WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {brand.description}
                      </p>
                    )}

                    {brand.active_products_count !== undefined && (
                      <small style={{ color: '#00b894', fontWeight: 600 }}>
                        {brand.active_products_count} Products
                      </small>
                    )}

                    {brand.website && (
                      <div className="mt-2">
                        <a href={brand.website} target="_blank" rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{ fontSize: 11, color: '#6b7280' }}>
                          🔗 Visit Website
                        </a>
                      </div>
                    )}

                    {brand.is_featured && (
                      <span className="badge mt-2 d-inline-block"
                        style={{ background: '#fef9c3', color: '#854d0e', fontSize: 11 }}>
                        ⭐ Featured
                      </span>
                    )}
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

export default BrandsPage