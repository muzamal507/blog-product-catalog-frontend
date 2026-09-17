import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import orderService from '../../../services/orderService'
import productService from '../../../services/productService'

const INITIAL_FORM = {
  customer_name: '', customer_phone: '',
  customer_email: '', address: '', city: '',
  notes: '', source: 'Admin',
  shipping: 0, discount: 0,
}

function CreateOrder() {
  const navigate = useNavigate()

  const [form, setForm]     = useState(INITIAL_FORM)
  const [items, setItems]   = useState([])
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState([])
  const [searching, setSearching] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  // Search products
  useEffect(() => {
    if (!search.trim()) { setProducts([]); return }
    const timer = setTimeout(() => {
      setSearching(true)
      productService.adminList({ search, per_page: 8 })
        .then(res => setProducts(res.data.data?.data || []))
        .catch(() => {})
        .finally(() => setSearching(false))
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const addProduct = (product) => {
    const existing = items.find(i => i.product_id === product.id && !i.variant_id)
    if (existing) {
      setItems(prev => prev.map(i =>
        i.product_id === product.id && !i.variant_id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ))
    } else {
      setItems(prev => [...prev, {
        product_id:   product.id,
        product_name: product.name,
        variant_id:   null,
        variant_name: null,
        sku:          product.sku,
        price:        product.price || 0,
        quantity:     1,
      }])
    }
    setSearch('')
    setProducts([])
  }

  const updateQty = (idx, qty) => {
    if (qty < 1) return
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, quantity: qty } : item))
  }

  const removeItem = (idx) => {
    setItems(prev => prev.filter((_, i) => i !== idx))
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const total    = subtotal + parseFloat(form.shipping || 0) - parseFloat(form.discount || 0)

  const validate = () => {
    const e = {}
    if (!form.customer_name.trim())  e.customer_name  = 'Name is required'
    if (!form.customer_phone.trim()) e.customer_phone = 'Phone is required'
    if (items.length === 0)          e.items          = 'Add at least one product'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    try {
      await orderService.store({
        ...form,
        items: items.map(i => ({
          product_id:         i.product_id,
          product_variant_id: i.variant_id,
          quantity:           i.quantity,
        })),
      })
      navigate('/admin/orders')
    } catch (err) {
      setErrors(err.response?.data?.errors || {})
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Create Manual Order</h4>
          <small className="text-muted">
            <Link to="/admin/orders" style={{ color: '#00b894' }}>Orders</Link> / New
          </small>
        </div>
        <Link to="/admin/orders" className="btn btn-outline-secondary btn-sm">← Back</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">

          {/* LEFT */}
          <div className="col-12 col-lg-8">

            {/* Product Search */}
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-3">Add Products</h6>

              {errors.items && (
                <div className="alert alert-danger py-2 mb-3" style={{ fontSize: 13 }}>
                  {errors.items}
                </div>
              )}

              {/* Search */}
              <div className="position-relative mb-3">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">🔍</span>
                  <input type="text" className="form-control border-start-0"
                    placeholder="Search product by name or SKU..."
                    value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                {/* Results */}
                {(products.length > 0 || searching) && (
                  <div className="position-absolute w-100 bg-white shadow rounded-3 mt-1"
                    style={{ zIndex: 100, border: '1px solid #e5e7eb', maxHeight: 300, overflowY: 'auto' }}>
                    {searching ? (
                      <div className="text-center py-3">
                        <div className="spinner-border spinner-border-sm" style={{ color: '#00b894' }} />
                      </div>
                    ) : products.map(p => (
                      <div key={p.id}
                        className="d-flex align-items-center gap-3 p-3"
                        style={{ cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}
                        onClick={() => addProduct(p)}
                        onMouseOver={e => e.currentTarget.style.background = '#f9fafb'}
                        onMouseOut={e => e.currentTarget.style.background = ''}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 6,
                          overflow: 'hidden', background: '#f3f4f6', flexShrink: 0
                        }}>
                          {p.main_image
                            ? <img src={p.main_image} alt={p.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <div className="w-100 h-100 d-flex align-items-center justify-content-center">📦</div>
                          }
                        </div>
                        <div className="flex-fill" style={{ minWidth: 0 }}>
                          <div className="fw-semibold text-truncate" style={{ fontSize: 14 }}>{p.name}</div>
                          <small className="text-muted">{p.sku} — ${p.price}</small>
                        </div>
                        <span className="badge" style={{ background: '#00b894' }}>+ Add</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Items List */}
              {items.length === 0 ? (
                <div className="text-center py-4 text-muted rounded-3"
                  style={{ background: '#f9fafb', border: '2px dashed #e5e7eb' }}>
                  <div style={{ fontSize: 32 }}>📦</div>
                  <small>Search and add products above</small>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {items.map((item, idx) => (
                    <div key={idx}
                      className="d-flex align-items-center gap-3 p-3 rounded-3"
                      style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                      <div className="flex-fill" style={{ minWidth: 0 }}>
                        <div className="fw-semibold text-truncate" style={{ fontSize: 14 }}>
                          {item.product_name}
                        </div>
                        <small className="text-muted">${item.price} each</small>
                      </div>
                      <div className="d-flex align-items-center gap-2 flex-shrink-0">
                        <button type="button" className="btn btn-sm btn-outline-secondary"
                          style={{ width: 28, height: 28, padding: 0 }}
                          onClick={() => updateQty(idx, item.quantity - 1)}>−</button>
                        <span className="fw-bold" style={{ minWidth: 24, textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button type="button" className="btn btn-sm btn-outline-secondary"
                          style={{ width: 28, height: 28, padding: 0 }}
                          onClick={() => updateQty(idx, item.quantity + 1)}>+</button>
                      </div>
                      <div className="fw-bold text-end flex-shrink-0" style={{ minWidth: 70 }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button type="button" className="btn btn-sm btn-outline-danger flex-shrink-0"
                        style={{ width: 28, height: 28, padding: 0 }}
                        onClick={() => removeItem(idx)}>✕</button>
                    </div>
                  ))}

                  {/* Total */}
                  <div className="p-3 rounded-3 mt-1" style={{ background: '#f0fdf4' }}>
                    <div className="d-flex justify-content-between mb-1">
                      <small className="text-muted">Subtotal</small>
                      <small className="fw-bold">${subtotal.toFixed(2)}</small>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <small className="text-muted">Shipping</small>
                      <small className="fw-bold">+${parseFloat(form.shipping || 0).toFixed(2)}</small>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <small className="text-muted">Discount</small>
                      <small className="fw-bold text-danger">−${parseFloat(form.discount || 0).toFixed(2)}</small>
                    </div>
                    <div className="d-flex justify-content-between fw-bold"
                      style={{ borderTop: '1px solid #bbf7d0', paddingTop: 6, marginTop: 6 }}>
                      <span>Total</span>
                      <span style={{ color: '#00b894' }}>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Info */}
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-4">Customer Information</h6>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Name <span className="text-danger">*</span>
                  </label>
                  <input type="text" name="customer_name"
                    className={`form-control ${errors.customer_name ? 'is-invalid' : ''}`}
                    value={form.customer_name} onChange={handleChange} />
                  {errors.customer_name && <div className="invalid-feedback">{errors.customer_name}</div>}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Phone <span className="text-danger">*</span>
                  </label>
                  <input type="text" name="customer_phone"
                    className={`form-control ${errors.customer_phone ? 'is-invalid' : ''}`}
                    value={form.customer_phone} onChange={handleChange} />
                  {errors.customer_phone && <div className="invalid-feedback">{errors.customer_phone}</div>}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Email</label>
                  <input type="email" name="customer_email" className="form-control"
                    value={form.customer_email} onChange={handleChange} />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>City</label>
                  <input type="text" name="city" className="form-control"
                    value={form.city} onChange={handleChange} />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Address</label>
                  <textarea name="address" rows={2} className="form-control"
                    value={form.address} onChange={handleChange} />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Notes</label>
                  <textarea name="notes" rows={2} className="form-control"
                    placeholder="Special instructions..."
                    value={form.notes} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-4">Order Settings</h6>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Source</label>
                <select name="source" className="form-select"
                  value={form.source} onChange={handleChange}>
                  <option value="Admin">👤 Admin</option>
                  <option value="Website">🌐 Website</option>
                  <option value="WhatsApp">💬 WhatsApp</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                  Shipping ($)
                </label>
                <input type="number" name="shipping" min="0" step="0.01"
                  className="form-control"
                  value={form.shipping} onChange={handleChange} />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                  Discount ($)
                </label>
                <input type="number" name="discount" min="0" step="0.01"
                  className="form-control"
                  value={form.discount} onChange={handleChange} />
              </div>

              <div className="p-3 rounded-3 mb-4"
                style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <div className="d-flex justify-content-between fw-bold">
                  <span>Grand Total</span>
                  <span style={{ color: '#00b894', fontSize: 18 }}>${total.toFixed(2)}</span>
                </div>
                <small className="text-muted d-block mt-1">Payment: Cash on Delivery</small>
              </div>

              <div className="d-grid gap-2">
                <button type="submit"
                  className="btn text-white fw-semibold"
                  style={{ background: '#00b894', borderRadius: 8 }}
                  disabled={saving}>
                  {saving
                    ? <><span className="spinner-border spinner-border-sm me-2" />Creating...</>
                    : '🚀 Create Order'}
                </button>
                <Link to="/admin/orders" className="btn btn-outline-secondary">Cancel</Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CreateOrder