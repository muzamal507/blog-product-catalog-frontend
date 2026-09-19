import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../../context/CartContext'

function ProductCard({ product }) {
    const { addToCart } = useCart()
    const [added, setAdded] = useState(false)

    const handleAdd = (e) => {
        e.preventDefault()
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            sku: product.sku,
            image: product.main_image,
        })
        setAdded(true)
        setTimeout(() => {
            setAdded(false)
        }, 1200)
    }

    return (
        <div className="card border h-100"
            style={{borderRadius: 10, borderColor: '#eef0f4',
                transition: 'box-shadow 0.2s, transform 0.2s'}}
            onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,.1)'
                e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = ''
                e.currentTarget.style.transform = ''
            }}
        >
            {/* Image */}
            <Link to={`/product/${product.id}`} className="text-decoration-none" >
                <div className="position-relative overflow-hidden"
                    style={{ borderRadius: '10px 10px 0 0', aspectRatio: '4/3', background: '#f5f5f5'}} >
                    {product.main_image ? (
                        <img src={product.main_image} alt={product.name} className="w-100 h-100"
                            style={{objectFit: 'cover', transition: 'transform 0.4s'}}
                            onMouseOver={(e) =>(e.currentTarget.style.transform = 'scale(1.05)')}
                            onMouseOut={(e) =>(e.currentTarget.style.transform = '')}
                        />
                    ) : (
                        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                            <span style={{ fontSize: 48 }}>📦</span>
                        </div>
                    )}

                    {/* Badges */}
                    <div className="position-absolute top-0 start-0 m-2 d-flex flex-column gap-1">
                        {product.is_on_sale && (
                          <span className="badge" style={{background: '#e74c3c', fontSize: 10}} >
                              -{product.discount_percent}% OFF
                          </span>
                        )}

                        {product.is_new && (
                          <span className="badge" style={{background: '#3b82f6', fontSize: 10}} >
                              🆕 New
                          </span>
                        )}

                        {product.is_bestseller && (
                          <span className="badge" style={{background: '#f59e0b', fontSize: 10}} >
                              🔥 Best
                          </span>
                        )}
                    </div>
                </div>
            </Link>

            {/* Body */}
            <div className="card-body d-flex flex-column p-3">
                {product.brand && (
                    <small className="fw-bold text-uppercase mb-1"
                        style={{color: '#00b894', letterSpacing: 1.5, fontSize: 10}} >
                        {product.brand.name}
                    </small>
                )}

                <Link to={`/product/${product.id}`} className="text-decoration-none text-dark" >
                    <h6 className="fw-semibold mb-2"
                        style={{fontSize: 14, lineHeight: 1.5, display: '-webkit-box',
                            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}} >
                        {product.name}
                    </h6>
                </Link>

                <div className="d-flex align-items-center gap-2 mb-3 mt-auto">
                    <span className="fw-bold fs-6">${product.price}</span>
                    {product.compare_price && (
                        <span className="text-muted text-decoration-line-through" style={{ fontSize: 13 }} >
                            ${product.compare_price}
                        </span>
                    )}
                </div>

                <button className="btn w-100 fw-semibold text-white"
                    style={{background: added ? '#059669' : '#1a1a2e', borderRadius: 6,
                        fontSize: 13, transition: 'background 0.2s'}} onClick={handleAdd} >
                    {added ? '✓ Added!' : 'Add To Cart'}
                </button>
            </div>
        </div>
    )
}

export default ProductCard