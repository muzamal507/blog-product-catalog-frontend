import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import orderService from '../../../services/orderService'

const STATUS_COLORS = {
  Pending:    { bg: '#fef9c3', color: '#854d0e'  },
  Confirmed:  { bg: '#dbeafe', color: '#1d4ed8'  },
  Processing: { bg: '#ede9fe', color: '#6d28d9'  },
  Shipped:    { bg: '#e0f2fe', color: '#0369a1'  },
  Delivered:  { bg: '#d1fae5', color: '#059669'  },
  Cancelled:  { bg: '#fee2e2', color: '#dc2626'  },
  Returned:   { bg: '#f3f4f6', color: '#374151'  },
}

const STATUSES = ['Pending','Confirmed','Processing','Shipped','Delivered','Cancelled','Returned']

function OrderDetail() {
  const { id }     = useParams()
  const [order, setOrder]         = useState(null)
  const [loading, setLoading]     = useState(true)
  const [changing, setChanging]   = useState(false)
  const [newStatus, setNewStatus] = useState('')

  const fetchOrder = () => {
    setLoading(true)
    orderService.show(id)
      .then(res => {
        setOrder(res.data.data)
        setNewStatus(res.data.data.status)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrder() }, [id])

  const handleStatusChange = async () => {
    if (newStatus === order.status) return
    setChanging(true)
    try {
      await orderService.changeStatus(id, newStatus)
      fetchOrder()
    } catch (_) {}
    finally { setChanging(false) }
  }

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border" style={{ color: '#00b894' }} />
    </div>
  )

  if (!order) return (
    <div className="text-center py-5 text-muted">
      <p>Order not found.</p>
      <Link to="/admin/orders" className="btn btn-outline-secondary btn-sm">← Back</Link>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Order #{order.order_number}</h4>
          <small className="text-muted">{order.created_at}</small>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/orders" className="btn btn-outline-secondary btn-sm">← Back</Link>
        </div>
      </div>

      <div className="row g-4">

        {/* LEFT */}
        <div className="col-12 col-lg-8">

          {/* Order Items */}
          <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 12 }}>
            <h6 className="fw-bold mb-4">Order Items ({order.items?.length})</h6>
            <div className="d-flex flex-column gap-3">
              {order.items?.map(item => (
                <div key={item.id}
                  className="d-flex align-items-center gap-3 p-3 rounded-3"
                  style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                  {/* Image */}
                  <div style={{
                    width: 64, height: 64, borderRadius: 8,
                    overflow: 'hidden', background: '#e5e7eb', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {item.image
                      ? <img src={item.image} alt={item.product_name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: 24 }}>📦</span>
                    }
                  </div>
                  {/* Info */}
                  <div className="flex-fill" style={{ minWidth: 0 }}>
                    <div className="fw-semibold text-truncate">{item.product_name}</div>
                    {item.variant_name && (
                      <small className="text-muted">{item.variant_name}</small>
                    )}
                    <div>
                      <code style={{ fontSize: 11 }}>{item.sku}</code>
                    </div>
                  </div>
                  {/* Price */}
                  <div className="text-end flex-shrink-0">
                    <div className="fw-semibold">${item.price} × {item.quantity}</div>
                    <div className="fw-bold" style={{ color: '#00b894' }}>${item.total}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-4 pt-3" style={{ borderTop: '1px solid #e5e7eb' }}>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span>${order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Discount</span>
                  <span className="text-danger">−${order.discount}</span>
                </div>
              )}
              {order.coupon_discount > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Coupon ({order.coupon_code})</span>
                  <span className="text-danger">−${order.coupon_discount}</span>
                </div>
              )}
              {order.shipping > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Shipping</span>
                  <span>+${order.shipping}</span>
                </div>
              )}
              <div className="d-flex justify-content-between fw-bold fs-6 pt-2"
                style={{ borderTop: '1px solid #e5e7eb' }}>
                <span>Total</span>
                <span style={{ color: '#00b894' }}>${order.total}</span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
            <h6 className="fw-bold mb-4">Customer Information</h6>
            <div className="row g-3">
              {[
                ['👤 Name',    order.customer_name],
                ['📞 Phone',   order.customer_phone],
                ['✉ Email',   order.customer_email || '—'],
                ['📍 City',    order.city || '—'],
                ['🏠 Address', order.address || '—'],
                ['📝 Notes',   order.notes || '—'],
              ].map(([label, val]) => (
                <div className="col-12 col-md-6" key={label}>
                  <small className="text-muted fw-semibold d-block" style={{ fontSize: 11 }}>
                    {label}
                  </small>
                  <span style={{ fontSize: 14 }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-12 col-lg-4">

          {/* Status */}
          <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 12 }}>
            <h6 className="fw-bold mb-4">Order Status</h6>

            <div className="mb-3">
              <span className="badge px-3 py-2 mb-3 d-block text-center"
                style={{ ...STATUS_COLORS[order.status], fontSize: 14 }}>
                {order.status}
              </span>
            </div>

            <select className="form-select mb-3"
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}>
              {STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <button
              className="btn w-100 fw-semibold text-white"
              style={{ background: '#00b894', borderRadius: 8 }}
              disabled={changing || newStatus === order.status}
              onClick={handleStatusChange}>
              {changing
                ? <><span className="spinner-border spinner-border-sm me-2" />Updating...</>
                : '💾 Update Status'}
            </button>

            {/* Timeline */}
            <div className="mt-4">
              <small className="fw-semibold text-muted d-block mb-3">Timeline</small>
              {[
                ['Order Placed',  order.created_at,    '📋'],
                ['Confirmed',     order.confirmed_at,  '✅'],
                ['Shipped',       order.shipped_at,    '🚚'],
                ['Delivered',     order.delivered_at,  '🎉'],
                ['Cancelled',     order.cancelled_at,  '❌'],
              ].map(([label, date, icon]) => date ? (
                <div key={label} className="d-flex gap-2 mb-2 align-items-start">
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div className="fw-semibold" style={{ fontSize: 13 }}>{label}</div>
                    <small className="text-muted">{date}</small>
                  </div>
                </div>
              ) : null)}
            </div>
          </div>

          {/* Order Meta */}
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
            <h6 className="fw-bold mb-4">Order Info</h6>
            {[
              ['Order #',  order.order_number],
              ['Source',   order.source],
              ['Payment',  'Cash on Delivery'],
            ].map(([label, val]) => (
              <div className="d-flex justify-content-between mb-3" key={label}>
                <small className="text-muted">{label}</small>
                <span className="fw-semibold" style={{ fontSize: 13 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail