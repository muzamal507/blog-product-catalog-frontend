import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../../context/CartContext'
import orderService from '../../../services/orderService'

const INITIAL_FORM = {
  customer_name:  '',
  customer_phone: '',
  customer_email: '',
  city:           '',
  address:        '',
  notes:          '',
}

function Checkout() {
  const { cartItems, subtotal, clearCart } = useCart()
  const navigate = useNavigate()

  const [form, setForm]       = useState(INITIAL_FORM)
  const [errors, setErrors]   = useState({})
  const [placing, setPlacing] = useState(false)
  const [success, setSuccess] = useState(null) // order data after success
  const [step, setStep]       = useState(1)    // 1=info, 2=review, 3=success

  const SHIPPING = subtotal > 500 ? 0 : 10
  const TOTAL    = subtotal + SHIPPING

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.customer_name.trim())
      e.customer_name  = 'Full name is required'
    if (!form.customer_phone.trim())
      e.customer_phone = 'Phone number is required'
    if (form.customer_phone && !/^[0-9+\-\s]{7,15}$/.test(form.customer_phone))
      e.customer_phone = 'Enter a valid phone number'
    if (form.customer_email && !/\S+@\S+\.\S+/.test(form.customer_email))
      e.customer_email = 'Enter a valid email address'
    if (!form.city.trim())
      e.city = 'City is required'
    if (!form.address.trim())
      e.address = 'Delivery address is required'
    return e
  }

  const handleStep1 = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStep(2)
    window.scrollTo(0, 0)
  }

  const handlePlaceOrder = async () => {
    setPlacing(true)
    try {
      const res = await orderService.placeOrder({
        customer_name:  form.customer_name,
        customer_phone: form.customer_phone,
        customer_email: form.customer_email || undefined,
        city:           form.city,
        address:        form.address,
        notes:          form.notes || undefined,
        source:         'Website',
        shipping:       SHIPPING,
        items: cartItems.map(i => ({
          product_id:         i.id,
          product_variant_id: i.variantId || undefined,
          quantity:           i.qty,
        })),
      })

      setSuccess(res.data)
      clearCart()
      setStep(3)
      window.scrollTo(0, 0)

    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.'
      alert(msg)
    } finally {
      setPlacing(false)
    }
  }

  // Cart empty guard
  if (cartItems.length === 0 && step !== 3) {
    return (
      <div className="container text-center py-5">
        <div style={{ fontSize: 72 }}>🛒</div>
        <h4 className="fw-bold mt-3 mb-2">Your cart is empty</h4>
        <Link to="/catalog" className="btn text-white px-4"
          style={{ background: '#00b894', borderRadius: 8 }}>
          Browse Catalog
        </Link>
      </div>
    )
  }

  // ==================== STEP 3 — SUCCESS ====================
  if (step === 3 && success) {
    return (
      <div>
        <div className="py-4 text-center"
          style={{ background: 'linear-gradient(135deg,#0d1b2a,#0f2d40)' }}>
          <h2 className="fw-bold text-white mb-1">Order Placed!</h2>
        </div>

        <div className="container py-5">
          <div className="card border-0 shadow-sm mx-auto text-center p-5"
            style={{ maxWidth: 560, borderRadius: 16 }}>

            {/* Success Icon */}
            <div className="mx-auto mb-4"
              style={{
                width: 80, height: 80, borderRadius: '50%',
                background: '#d1fae5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 40
              }}>
              ✅
            </div>

            <h3 className="fw-bold mb-2">Thank you, {form.customer_name}!</h3>
            <p className="text-muted mb-4">
              Your order has been placed successfully. We'll contact you shortly to confirm.
            </p>

            {/* Order Number */}
            <div className="py-3 px-4 rounded-3 mb-4"
              style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <div className="text-muted mb-1" style={{ fontSize: 13 }}>Order Number</div>
              <div className="fw-bold" style={{ fontSize: 22, color: '#059669', letterSpacing: 1 }}>
                {success.order_number}
              </div>
            </div>

            {/* Info */}
            <div className="row g-3 mb-4 text-start">
              {[
                ['📞', 'Phone',   form.customer_phone],
                ['📍', 'City',    form.city],
                ['🏠', 'Address', form.address],
                ['💵', 'Payment', 'Cash on Delivery'],
                ['💰', 'Total',   `$${TOTAL.toFixed(2)}`],
              ].map(([icon, label, val]) => (
                <div className="col-6" key={label}>
                  <small className="text-muted d-block fw-semibold" style={{ fontSize: 11 }}>
                    {icon} {label}
                  </small>
                  <span style={{ fontSize: 14 }}>{val}</span>
                </div>
              ))}
            </div>

            {/* What next */}
            <div className="p-3 rounded-3 mb-4 text-start"
              style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
              <p className="fw-semibold mb-2" style={{ fontSize: 14 }}>What happens next?</p>
              {[
                '📞 We will call to confirm your order',
                '📦 Your order will be packed carefully',
                '🚚 Delivered to your doorstep',
                '🚪 Open and verify before paying',
                '💵 Pay cash to the delivery agent',
              ].map(step => (
                <div key={step} className="d-flex align-items-start gap-2 mb-1">
                  <small style={{ fontSize: 13, color: '#374151' }}>{step}</small>
                </div>
              ))}
            </div>

            <div className="d-flex gap-3 justify-content-center">
              <Link to="/"
                className="btn btn-outline-secondary px-4">
                Back to Home
              </Link>
              <Link to="/catalog"
                className="btn text-white px-4"
                style={{ background: '#00b894', borderRadius: 8 }}>
                Continue Shopping →
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero */}
      <div className="py-4 text-center"
        style={{ background: 'linear-gradient(135deg,#0d1b2a,#0f2d40)' }}>
        <h2 className="fw-bold text-white mb-1">Checkout</h2>
        <small style={{ color: '#8fa3b8' }}>Cash on Delivery — no card required</small>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-bottom py-3">
        <div className="container">
          <div className="d-flex align-items-center justify-content-center gap-0">
            {[
              { num: 1, label: 'Your Info' },
              { num: 2, label: 'Review' },
              { num: 3, label: 'Done' },
            ].map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="d-flex align-items-center gap-2">
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: step >= s.num ? '#00b894' : '#e5e7eb',
                    color: step >= s.num ? '#fff' : '#9ca3af',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 14, flexShrink: 0
                  }}>
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: step === s.num ? 600 : 400,
                    color: step >= s.num ? '#1a1a2e' : '#9ca3af'
                  }}>
                    {s.label}
                  </span>
                </div>
                {i < 2 && (
                  <div style={{
                    flex: 1, height: 2, maxWidth: 60,
                    background: step > s.num ? '#00b894' : '#e5e7eb',
                    margin: '0 8px'
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-4 py-md-5">
        <div className="row g-4">

          {/* LEFT */}
          <div className="col-12 col-lg-7">

            {/* ===== STEP 1 — Customer Info ===== */}
            {step === 1 && (
              <form onSubmit={handleStep1}>
                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
                  <h5 className="fw-bold mb-4">📋 Delivery Information</h5>

                  {/* Name */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input type="text" name="customer_name"
                      className={`form-control ${errors.customer_name ? 'is-invalid' : ''}`}
                      placeholder="Ahmed Khan"
                      value={form.customer_name} onChange={handleChange} />
                    {errors.customer_name && <div className="invalid-feedback">{errors.customer_name}</div>}
                  </div>

                  {/* Phone */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">📞</span>
                      <input type="tel" name="customer_phone"
                        className={`form-control ${errors.customer_phone ? 'is-invalid' : ''}`}
                        placeholder="+92 333 0437 507"
                        value={form.customer_phone} onChange={handleChange} />
                      {errors.customer_phone && <div className="invalid-feedback">{errors.customer_phone}</div>}
                    </div>
                    <small className="text-muted">We'll call to confirm your order</small>
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                      Email Address
                      <span className="text-muted fw-normal ms-1">(optional)</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">✉</span>
                      <input type="email" name="customer_email"
                        className={`form-control ${errors.customer_email ? 'is-invalid' : ''}`}
                        placeholder="ahmed@example.com"
                        value={form.customer_email} onChange={handleChange} />
                      {errors.customer_email && <div className="invalid-feedback">{errors.customer_email}</div>}
                    </div>
                  </div>

                  {/* City */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                      City <span className="text-danger">*</span>
                    </label>
                    <input type="text" name="city"
                      className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                      placeholder="Karachi, Lahore, Islamabad..."
                      value={form.city} onChange={handleChange} />
                    {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                  </div>

                  {/* Address */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                      Full Address <span className="text-danger">*</span>
                    </label>
                    <textarea name="address" rows={3}
                      className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                      placeholder="House #, Street, Area, City..."
                      value={form.address} onChange={handleChange} />
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                  </div>

                  {/* Notes */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                      Order Notes
                      <span className="text-muted fw-normal ms-1">(optional)</span>
                    </label>
                    <textarea name="notes" rows={2} className="form-control"
                      placeholder="Special delivery instructions..."
                      value={form.notes} onChange={handleChange} />
                  </div>

                  <button type="submit"
                    className="btn w-100 text-white fw-semibold py-3"
                    style={{ background: '#00b894', borderRadius: 8, fontSize: 16 }}>
                    Continue to Review →
                  </button>
                </div>
              </form>
            )}

            {/* ===== STEP 2 — Review ===== */}
            {step === 2 && (
              <div>
                {/* Customer Info Review */}
                <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 12 }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">📋 Delivery Details</h5>
                    <button className="btn btn-sm btn-outline-secondary"
                      onClick={() => setStep(1)}>
                      ✏️ Edit
                    </button>
                  </div>
                  <div className="row g-2">
                    {[
                      ['👤 Name',    form.customer_name],
                      ['📞 Phone',   form.customer_phone],
                      ['✉ Email',   form.customer_email || '—'],
                      ['🏙️ City',   form.city],
                    ].map(([label, val]) => (
                      <div className="col-6" key={label}>
                        <small className="text-muted fw-semibold d-block" style={{ fontSize: 11 }}>
                          {label}
                        </small>
                        <span style={{ fontSize: 14 }}>{val}</span>
                      </div>
                    ))}
                    <div className="col-12">
                      <small className="text-muted fw-semibold d-block" style={{ fontSize: 11 }}>
                        🏠 Address
                      </small>
                      <span style={{ fontSize: 14 }}>{form.address}</span>
                    </div>
                    {form.notes && (
                      <div className="col-12">
                        <small className="text-muted fw-semibold d-block" style={{ fontSize: 11 }}>
                          📝 Notes
                        </small>
                        <span style={{ fontSize: 14 }}>{form.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cart Items Review */}
                <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 12 }}>
                  <h5 className="fw-bold mb-3">📦 Order Items ({cartItems.length})</h5>
                  <div className="d-flex flex-column gap-3">
                    {cartItems.map(item => (
                      <div key={`${item.id}-${item.variantId}`}
                        className="d-flex align-items-center gap-3">
                        <div style={{
                          width: 56, height: 56, borderRadius: 8,
                          overflow: 'hidden', background: '#f5f5f5', flexShrink: 0
                        }}>
                          {item.image ? (
                            <img src={item.image} alt={item.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                              <span style={{ fontSize: 22 }}>📦</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-fill" style={{ minWidth: 0 }}>
                          <div className="fw-semibold text-truncate" style={{ fontSize: 14 }}>
                            {item.name}
                          </div>
                          {item.variantName && (
                            <small className="text-muted">{item.variantName}</small>
                          )}
                          <div className="text-muted" style={{ fontSize: 12 }}>
                            Qty: {item.qty}
                          </div>
                        </div>
                        <div className="fw-bold flex-shrink-0" style={{ fontSize: 15 }}>
                          ${(item.price * item.qty).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COD Notice */}
                <div className="card border-0 p-4 mb-4"
                  style={{ borderRadius: 12, background: '#f0fdf4', border: '1px solid #bbf7d0 !important' }}>
                  <h6 className="fw-bold mb-3" style={{ color: '#059669' }}>
                    💵 Payment: Cash on Delivery
                  </h6>
                  <p className="mb-0 text-muted" style={{ fontSize: 14 }}>
                    You will pay <strong style={{ color: '#059669' }}>${TOTAL.toFixed(2)}</strong> in
                    cash when your order is delivered. Please keep exact change ready.
                  </p>
                </div>

                {/* Place Order */}
                <button
                  className="btn w-100 text-white fw-semibold py-3"
                  style={{ background: '#00b894', borderRadius: 8, fontSize: 16 }}
                  disabled={placing}
                  onClick={handlePlaceOrder}>
                  {placing ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Placing Order...</>
                  ) : (
                    '🚀 Place Order — Cash on Delivery'
                  )}
                </button>

                <div className="text-center mt-3">
                  <button className="btn btn-link text-muted" onClick={() => setStep(1)}>
                    ← Back to Edit Info
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Order Summary */}
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm p-4 sticky-top"
              style={{ borderRadius: 12, top: 80 }}>
              <h5 className="fw-bold mb-4">Order Summary</h5>

              {/* Items */}
              <div className="d-flex flex-column gap-2 mb-3 pb-3"
                style={{ borderBottom: '1px solid #e5e7eb' }}>
                {cartItems.map(item => (
                  <div key={`${item.id}-${item.variantId}`}
                    className="d-flex justify-content-between">
                    <span className="text-muted text-truncate me-2" style={{ fontSize: 13, maxWidth: 190 }}>
                      {item.name}
                      {item.variantName && ` (${item.variantName})`} ×{item.qty}
                    </span>
                    <span className="fw-semibold flex-shrink-0" style={{ fontSize: 13 }}>
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
                <span className="text-muted">Shipping</span>
                <span className="fw-semibold">
                  {SHIPPING === 0
                    ? <span style={{ color: '#059669' }}>Free</span>
                    : `$${SHIPPING}`}
                </span>
              </div>
              <div className="d-flex justify-content-between fw-bold py-3"
                style={{ borderTop: '1px solid #e5e7eb', fontSize: 18 }}>
                <span>Total</span>
                <span style={{ color: '#00b894' }}>${TOTAL.toFixed(2)}</span>
              </div>

              {/* Payment */}
              <div className="mt-3 p-3 rounded-2 text-center"
                style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#059669' }}>
                  💵 Cash on Delivery
                </div>
                <small className="text-muted">Pay when your order arrives</small>
              </div>

              {/* Trust Badges */}
              <div className="mt-4 pt-3" style={{ borderTop: '1px solid #e5e7eb' }}>
                {[
                  ['🛡️', '100% Genuine Items'],
                  ['🚪', 'Verify before paying'],
                  ['🔄', '7-Day Return Policy'],
                  ['📞', '24/7 Customer Support'],
                ].map(([icon, text]) => (
                  <div key={text} className="d-flex align-items-center gap-2 mb-2">
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

export default Checkout