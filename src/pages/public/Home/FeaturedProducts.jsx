import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import productService from '../../../services/productService'
import { useCart } from '../../../context/CartContext'

// Skeleton Card
function SkeletonCard() {
  return (
    <div className="card border h-100" style={{ borderRadius: 10, borderColor: '#eef0f4' }}>
      <div style={{ aspectRatio: '4/3', background: '#f0f0f0',
        borderRadius: '10px 10px 0 0', animation: 'skeleton 1.5s infinite' }} />
      <div className="card-body p-3">
        <div style={{ height: 10, background: '#f0f0f0', borderRadius: 4,
          width: '35%', marginBottom: 8, animation: 'skeleton 1.5s infinite' }} />
        <div style={{ height: 14, background: '#f0f0f0', borderRadius: 4,
          marginBottom: 6, animation: 'skeleton 1.5s infinite' }} />
        <div style={{ height: 14, background: '#f0f0f0', borderRadius: 4,
          width: '60%', marginBottom: 16, animation: 'skeleton 1.5s infinite' }} />
        <div style={{ height: 36, background: '#f0f0f0', borderRadius: 6,
          animation: 'skeleton 1.5s infinite' }} />
      </div>
      <style>{`@keyframes skeleton{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  )
}

function FeaturedProducts() {
  const { addToCart }     = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [added, setAdded]       = useState(null)

  useEffect(() => {
    productService.getAll({ is_featured: 1, per_page: 6 })
      .then(res => {
        const data = res.data.data?.data || res.data.data || []
        setProducts(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = (product) => {
    addToCart({
      id:    product.id,
      name:  product.name,
      price: product.price,
      sku:   product.sku,
      image: product.main_image,
    })
    setAdded(product.id)
    setTimeout(() => setAdded(null), 1200)
  }

  return (
    <section className="py-4 py-md-5 px-3 px-md-4"
      style={{ background: '#f9fafb' }}>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-start align-items-md-center mb-4 gap-2">
        <div>
          <small className="fw-bold text-uppercase"
            style={{ color: '#00b894', letterSpacing: 2, fontSize: 11 }}>
            HANDPICKED
          </small>
          <h2 className="fw-bold mb-0 mt-1"
            style={{ fontSize: 'clamp(18px,4vw,26px)' }}>
            Featured Exquisites
          </h2>
        </div>
        <Link to="/catalog?is_featured=1"
          className="text-nowrap fw-semibold text-decoration-none"
          style={{ color: '#00b894', fontSize: 14, flexShrink: 0 }}>
          Full Catalog ›
        </Link>
      </div>

      {/* Grid */}
      <div className="row g-3">
        {loading ? (
          [1,2,3].map(i => (
            <div className="col-12 col-sm-6 col-lg-4" key={i}>
              <SkeletonCard />
            </div>
          ))
        ) : products.length === 0 ? (
          <div className="col-12 text-center py-4 text-muted">
            <div style={{ fontSize: 40 }}>📦</div>
            <p className="mt-2">No featured products yet.</p>
          </div>
        ) : products.map(product => (
          <div className="col-12 col-sm-6 col-lg-4" key={product.id}>
            <div className="card border h-100"
              style={{ borderRadius: 10, borderColor: '#eef0f4',
                transition: 'box-shadow 0.2s, transform 0.2s' }}
              onMouseOver={e => {
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,.1)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.boxShadow = ''
                e.currentTarget.style.transform = ''
              }}>

              {/* Image */}
              <Link to={`/product/${product.id}`} className="text-decoration-none">
                <div className="position-relative overflow-hidden"
                  style={{ borderRadius: '10px 10px 0 0', aspectRatio: '4/3',
                    background: '#f5f5f5' }}>
                  {product.main_image ? (
                    <img src={product.main_image} alt={product.name}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover', transition: 'transform 0.4s' }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={e => e.currentTarget.style.transform = ''} />
                  ) : (
                    <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                      <span style={{ fontSize: 48, opacity: 0.3 }}>📦</span>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="position-absolute top-0 start-0 m-2 d-flex flex-column gap-1">
                    {product.is_on_sale && (
                      <span className="badge"
                        style={{ background: '#e74c3c', fontSize: 10 }}>
                        -{product.discount_percent}% OFF
                      </span>
                    )}
                    {product.is_new && (
                      <span className="badge"
                        style={{ background: '#3b82f6', fontSize: 10 }}>🆕 New</span>
                    )}
                    {product.is_bestseller && (
                      <span className="badge"
                        style={{ background: '#f59e0b', fontSize: 10 }}>🔥 Best</span>
                    )}
                  </div>
                </div>
              </Link>

              {/* Body */}
              <div className="card-body d-flex flex-column p-3">
                {product.brand && (
                  <small className="fw-bold text-uppercase mb-1"
                    style={{ color: '#00b894', letterSpacing: 1.5, fontSize: 10 }}>
                    {product.brand.name}
                  </small>
                )}

                <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                  <h6 className="fw-semibold mb-2"
                    style={{ fontSize: 14, lineHeight: 1.5,
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.name}
                  </h6>
                </Link>

                <div className="d-flex align-items-center gap-2 mb-3 mt-auto">
                  <span className="fw-bold" style={{ fontSize: 18 }}>
                    ${product.price}
                  </span>
                  {product.compare_price && (
                    <span className="text-muted text-decoration-line-through"
                      style={{ fontSize: 13 }}>
                      ${product.compare_price}
                    </span>
                  )}
                </div>

                <button
                  className="btn w-100 fw-semibold text-white"
                  style={{
                    background: added === product.id ? '#059669' : '#1a1a2e',
                    borderRadius: 6, fontSize: 13,
                    transition: 'background 0.2s'
                  }}
                  onClick={() => handleAdd(product)}>
                  {added === product.id ? '✓ Added!' : 'Add To Cart'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturedProducts