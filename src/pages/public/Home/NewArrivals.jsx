import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import productService from '../../../services/productService'
import { useCart } from '../../../context/CartContext'

function NewArrivals() {
  const { addToCart }           = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [added, setAdded]       = useState(null)

  useEffect(() => {
    productService.getAll({ is_new: 1, per_page: 4 })
      .then(res => {
        const data = res.data.data?.data || res.data.data || []
        setProducts(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Agar koi new product nahi hai toh section hide karo
  if (!loading && products.length === 0) return null

  const handleAdd = (product) => {
    addToCart({
      id: product.id, name: product.name,
      price: product.price, sku: product.sku,
      image: product.main_image,
    })
    setAdded(product.id)
    setTimeout(() => setAdded(null), 1200)
  }

  return (
    <section className="py-4 py-md-5 px-3 px-md-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <small className="fw-bold text-uppercase"
            style={{ color: '#3b82f6', letterSpacing: 2, fontSize: 11 }}>
            JUST ARRIVED
          </small>
          <h2 className="fw-bold mb-0 mt-1"
            style={{ fontSize: 'clamp(18px,4vw,26px)' }}>
            New Arrivals 🆕
          </h2>
        </div>
        <Link to="/catalog?is_new=1"
          className="fw-semibold text-decoration-none text-nowrap"
          style={{ color: '#3b82f6', fontSize: 14 }}>
          View All →
        </Link>
      </div>

      {loading ? (
        <div className="row g-3">
          {[1,2,3,4].map(i => (
            <div className="col-6 col-md-3" key={i}>
              <div style={{ aspectRatio: '1', background: '#f0f0f0', borderRadius: 10,
                animation: 'skeleton 1.5s infinite' }} />
              <style>{`@keyframes skeleton{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
            </div>
          ))}
        </div>
      ) : (
        <div className="row g-3">
          {products.map(product => (
            <div className="col-6 col-md-3" key={product.id}>
              <div className="card border-0 shadow-sm h-100"
                style={{ borderRadius: 10, transition: 'transform 0.2s' }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseOut={e => e.currentTarget.style.transform = ''}>

                <Link to={`/product/${product.id}`} className="text-decoration-none">
                  <div className="position-relative overflow-hidden"
                    style={{ borderRadius: '10px 10px 0 0',
                      aspectRatio: '1', background: '#f5f5f5' }}>
                    {product.main_image ? (
                      <img src={product.main_image} alt={product.name}
                        className="w-100 h-100" style={{ objectFit: 'cover' }} />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                        <span style={{ fontSize: 36, opacity: 0.3 }}>📦</span>
                      </div>
                    )}
                    <span className="badge position-absolute top-0 start-0 m-2"
                      style={{ background: '#3b82f6', fontSize: 10 }}>
                      🆕 New
                    </span>
                  </div>
                </Link>

                <div className="card-body p-3">
                  {product.brand && (
                    <small className="fw-bold text-uppercase d-block mb-1"
                      style={{ color: '#00b894', fontSize: 10, letterSpacing: 1 }}>
                      {product.brand.name}
                    </small>
                  )}
                  <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                    <p className="fw-semibold mb-2"
                      style={{ fontSize: 13, lineHeight: 1.4,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.name}
                    </p>
                  </Link>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold" style={{ color: '#1a1a2e' }}>
                      ${product.price}
                    </span>
                    <button
                      className="btn btn-sm fw-semibold text-white"
                      style={{
                        background: added === product.id ? '#059669' : '#00b894',
                        fontSize: 11, borderRadius: 6
                      }}
                      onClick={() => handleAdd(product)}>
                      {added === product.id ? '✓' : '+ Cart'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default NewArrivals