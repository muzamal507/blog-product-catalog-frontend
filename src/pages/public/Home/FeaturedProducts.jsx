import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../../context/CartContext'

const products = [
  { id: 1, brand: 'CHRONOS',   name: 'Chronos Titanium V1 Automatic',    price: 1100, oldPrice: 1350, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80' },
  { id: 2, brand: 'ACOUSTICS', name: 'Acoustics Studio Pro ANC',          price: 299,  oldPrice: 349,  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80' },
  { id: 3, brand: 'HEX KEYS',  name: 'Hex Keys Apex-75 Custom Keyboard', price: 169,  oldPrice: 189,  image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80' },
]

function FeaturedProducts() {
  const { addToCart } = useCart()
  const [added, setAdded] = React.useState(null)

  const handleAdd = (product) => {
    addToCart(product)
    setAdded(product.id)
    setTimeout(() => setAdded(null), 1200)
  }

  return (
    <section className="py-4 py-md-5 px-3 px-md-4" style={{ background: '#f9fafb' }}>
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
        <Link to="/catalog"
          className="text-nowrap"
          style={{ color: '#00b894', fontWeight: 500, fontSize: 14, flexShrink: 0 }}>
          Full Catalog ›
        </Link>
      </div>

      {/* 1 col mobile, 3 col desktop */}
      <div className="row g-3">
        {products.map(product => (
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
              <div className="position-relative overflow-hidden"
                style={{ borderRadius: '10px 10px 0 0', aspectRatio: '4/3' }}>
                <img src={product.image} alt={product.name}
                  className="w-100 h-100 object-fit-cover" />
                <span className="badge position-absolute top-0 start-0 m-2"
                  style={{ background: '#e74c3c', fontSize: 10 }}>PROMO</span>
              </div>

              {/* Body */}
              <div className="card-body d-flex flex-column p-3">
                <small className="fw-bold text-uppercase mb-1"
                  style={{ color: '#00b894', letterSpacing: 1.5, fontSize: 10 }}>
                  {product.brand}
                </small>
                <Link to={`/product/${product.id}`} className="text-dark">
                  <h6 className="fw-semibold mb-2" style={{ fontSize: 14, lineHeight: 1.5 }}>
                    {product.name}
                  </h6>
                </Link>
                <div className="d-flex align-items-center gap-2 mb-3 mt-auto">
                  <span className="fw-bold fs-6">${product.price}</span>
                  <span className="text-muted text-decoration-line-through" style={{ fontSize: 13 }}>
                    ${product.oldPrice}
                  </span>
                </div>
                <button className="btn w-100 text-white fw-semibold"
                  style={{
                    background: added === product.id ? '#00b894' : '#1a1a2e',
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