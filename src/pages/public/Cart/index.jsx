import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../../context/CartContext'

function Cart() {
  const { cartItems, removeFromCart, updateQty, subtotal, totalItems, clearCart } = useCart()
  const navigate  = useNavigate()
  const [removing, setRemoving] = useState(null)

  const SHIPPING  = subtotal > 500 ? 0 : 10
  const TOTAL     = subtotal + SHIPPING

  const handleRemove = (id, variantId) => {
    setRemoving(`${id}-${variantId}`)
    setTimeout(() => {
      removeFromCart(id, variantId)
      setRemoving(null)
    }, 300)
  }

  if (cartItems.length === 0) {
    return (
      <div>
        {/* Hero */}
        <div className="py-4 text-center"
          style={{ background: 'linear-gradient(135deg,#0d1b2a,#0f2d40)' }}>
          <h2 className="fw-bold text-white mb-1">Shopping Cart</h2>
          <small style={{ color: '#8fa3b8' }}>Cash on Delivery — no card required</small>
        </div>

        <div className="container text-center py-5">
          <div style={{ fontSize: 80, marginBottom: 16 }}>🛒</div>
          <h4 className="fw-bold mb-2">Your cart is empty</h4>
          <p className="text-muted mb-4">
            Add some products to get started
          </p>
          <Link to="/catalog"
            className="btn text-white fw-semibold px-5 py-2"
            style={{ background: '#00b894', borderRadius: 8 }}>
            Browse Catalog →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero */}
      <div className="py-4 text-center"
        style={{ background: 'linear-gradient(135deg,#0d1b2a,#0f2d40)' }}>
        <h2 className="fw-bold text-white mb-1">Shopping Cart</h2>
        <small style={{ color: '#8fa3b8' }}>
          {totalItems} item{totalItems > 1 ? 's' : ''} — Cash on Delivery
        </small>
      </div>

      <div className="container py-4 py-md-5">
        <div className="row g-4">

          {/* LEFT — Cart Items */}
          <div className="col-12 col-lg-8">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">
                Cart Items ({totalItems})
              </h5>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={clearCart}>
                🗑 Clear Cart
              </button>
            </div>

            {/* Items */}
            <div className="d-flex flex-column gap-3">
              {cartItems.map(item => {
                const key       = `${item.id}-${item.variantId}`
                const isRemoving = removing === key

                return (
                  <div key={key}
                    className="card border-0 shadow-sm p-3"
                    style={{
                      borderRadius: 12,
                      opacity: isRemoving ? 0.5 : 1,
                      transition: 'opacity 0.3s'
                    }}>
                    <div className="d-flex gap-3 align-items-start">

                      {/* Image */}
                      <Link to={`/product/${item.id}`}
                        style={{ flexShrink: 0 }}>
                        <div style={{
                          width: 88, height: 88, borderRadius: 8,
                          overflow: 'hidden', background: '#f5f5f5'
                        }}>
                          {item.image ? (
                            <img src={item.image} alt={item.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                              <span style={{ fontSize: 32 }}>📦</span>
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Info */}
                      <div className="flex-fill" style={{ minWidth: 0 }}>
                        <Link to={`/product/${item.id}`}
                          className="text-decoration-none text-dark">
                          <h6 className="fw-semibold mb-1 text-truncate"
                            style={{ fontSize: 15 }}>
                            {item.name}
                          </h6>
                        </Link>

                        {item.variantName && (
                          <small className="text-muted d-block mb-1">
                            Variant: {item.variantName}
                          </small>
                        )}

                        <small className="text-muted d-block mb-2">
                          SKU: <code>{item.sku}</code>
                        </small>

                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                          {/* Quantity */}
                          <div className="d-flex align-items-center border rounded-2 overflow-hidden"
                            style={{ width: 'fit-content' }}>
                            <button type="button"
                              className="btn btn-light border-0 px-2 py-1"
                              style={{ fontSize: 16 }}
                              onClick={() => updateQty(item.id, item.variantId, item.qty - 1)}>
                              −
                            </button>
                            <span className="fw-bold px-3" style={{ fontSize: 14, minWidth: 36, textAlign: 'center' }}>
                              {item.qty}
                            </span>
                            <button type="button"
                              className="btn btn-light border-0 px-2 py-1"
                              style={{ fontSize: 16 }}
                              onClick={() => updateQty(item.id, item.variantId, item.qty + 1)}>
                              +
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-end">
                            <div className="fw-bold" style={{ fontSize: 16, color: '#1a1a2e' }}>
                              ${(item.price * item.qty).toFixed(2)}
                            </div>
                            <small className="text-muted">
                              ${item.price} × {item.qty}
                            </small>
                          </div>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        className="btn btn-sm btn-outline-danger flex-shrink-0"
                        style={{ width: 32, height: 32, padding: 0, fontSize: 14 }}
                        onClick={() => handleRemove(item.id, item.variantId)}>
                        ✕
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Continue shopping */}
            <div className="mt-4">
              <Link to="/catalog"
                className="btn btn-outline-secondary">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* RIGHT — Summary */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm p-4 sticky-top"
              style={{ borderRadius: 12, top: 80 }}>
              <h5 className="fw-bold mb-4">Order Summary</h5>

              {/* Items breakdown */}
              <div className="d-flex flex-column gap-2 mb-3 pb-3"
                style={{ borderBottom: '1px solid #e5e7eb' }}>
                {cartItems.map(item => (
                  <div key={`${item.id}-${item.variantId}`}
                    className="d-flex justify-content-between align-items-start">
                    <span className="text-muted text-truncate me-2"
                      style={{ fontSize: 13, maxWidth: 180 }}>
                      {item.name}
                      {item.variantName && ` (${item.variantName})`}
                      <span className="ms-1">×{item.qty}</span>
                    </span>
                    <span className="fw-semibold" style={{ fontSize: 13, flexShrink: 0 }}>
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span className="fw-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">
                  Shipping
                  {SHIPPING === 0 && (
                    <span className="badge ms-1" style={{ background: '#d1fae5', color: '#059669', fontSize: 10 }}>
                      FREE
                    </span>
                  )}
                </span>
                <span className="fw-semibold">
                  {SHIPPING === 0 ? 'Free' : `$${SHIPPING}`}
                </span>
              </div>

              {subtotal < 500 && SHIPPING > 0 && (
                <div className="alert py-2 mb-3" style={{ background: '#fef9c3', border: 'none', fontSize: 12 }}>
                  🚚 Add ${(500 - subtotal).toFixed(2)} more for free shipping!
                </div>
              )}

              <div className="d-flex justify-content-between fw-bold mb-4 pt-3"
                style={{ borderTop: '1px solid #e5e7eb', fontSize: 18 }}>
                <span>Total</span>
                <span style={{ color: '#00b894' }}>${TOTAL.toFixed(2)}</span>
              </div>

              {/* COD Badge */}
              <div className="text-center mb-4 py-2 rounded-2"
                style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <span style={{ fontSize: 13, color: '#059669', fontWeight: 600 }}>
                  💵 Cash on Delivery — Pay when received
                </span>
              </div>

              {/* Checkout Button */}
              <button
                className="btn w-100 text-white fw-semibold py-3"
                style={{ background: '#00b894', borderRadius: 8, fontSize: 16 }}
                onClick={() => navigate('/checkout')}>
                Proceed to Checkout →
              </button>

              {/* Guarantees */}
              <div className="mt-4 d-flex flex-column gap-2">
                {[
                  ['🛡️', '100% Genuine Items'],
                  ['🚪', 'Open box before paying'],
                  ['🔄', '7-Day Return Policy'],
                ].map(([icon, text]) => (
                  <div key={text} className="d-flex align-items-center gap-2">
                    <span style={{ fontSize: 14 }}>{icon}</span>
                    <small className="text-muted">{text}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart