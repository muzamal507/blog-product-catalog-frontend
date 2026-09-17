import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
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

const SOURCE_ICONS = { Website: '🌐', WhatsApp: '💬', Admin: '👤' }

function AdminOrders() {
  const [orders, setOrders]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [status, setStatus]     = useState('')
  const [source, setSource]     = useState('')
  const [page, setPage]         = useState(1)
  const [meta, setMeta]         = useState(null)
  const [stats, setStats]       = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [changingStatus, setChangingStatus] = useState(null)

  const fetchOrders = useCallback(() => {
    setLoading(true)
    orderService.adminList({ search, status, source, page, per_page: 15 })
      .then(res => {
        setOrders(res.data.data?.data || [])
        setMeta(res.data.data?.meta || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, status, source, page])

  const fetchStats = () => {
    orderService.stats()
      .then(res => setStats(res.data.data))
      .catch(() => {})
  }

  useEffect(() => { fetchOrders() }, [fetchOrders])
  useEffect(() => { fetchStats() }, [])
  useEffect(() => { setPage(1) }, [search, status, source])

  const handleStatusChange = async (orderId, newStatus) => {
    setChangingStatus(orderId)
    try {
      await orderService.changeStatus(orderId, newStatus)
      fetchOrders()
      fetchStats()
    } catch (_) {}
    finally { setChangingStatus(null) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await orderService.destroy(deleteId)
      setDeleteId(null)
      fetchOrders()
    } catch (err) {
      alert(err.response?.data?.message || 'Cannot delete.')
    } finally { setDeleting(false) }
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Orders</h4>
          <small className="text-muted">Manage customer orders — COD only</small>
        </div>
        <Link to="/admin/orders/create"
          className="btn text-white fw-semibold px-3"
          style={{ background: '#00b894', borderRadius: 8 }}>
          + Manual Order
        </Link>
      </div>

      {/* Stats */}
      {stats && (
        <div className="row g-3 mb-4">
          {[
            { icon: '📋', label: 'Total Orders',    value: stats.total,      color: '#00b894' },
            { icon: '🕐', label: 'Pending',          value: stats.pending,    color: '#f59e0b' },
            { icon: '✅', label: 'Delivered',        value: stats.delivered,  color: '#059669' },
            { icon: '💰', label: 'This Month',       value: `$${(stats.this_month_revenue || 0).toFixed(0)}`, color: '#a855f7' },
          ].map((s, i) => (
            <div className="col-6 col-md-3" key={i}>
              <div className="card border-0 shadow-sm p-3 d-flex flex-row align-items-center gap-3"
                style={{ borderRadius: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: s.color + '20', color: s.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0
                }}>{s.icon}</div>
                <div>
                  <div className="text-muted" style={{ fontSize: 12 }}>{s.label}</div>
                  <div className="fw-bold" style={{ fontSize: 22 }}>{s.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4 p-3" style={{ borderRadius: 12 }}>
        <div className="d-flex flex-wrap gap-2">
          <div className="input-group" style={{ maxWidth: 280 }}>
            <span className="input-group-text bg-light border-end-0">🔍</span>
            <input type="text" className="form-control border-start-0 bg-light"
              placeholder="Order#, name, phone..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ maxWidth: 160 }}
            value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All Status</option>
            {['Pending','Confirmed','Processing','Shipped','Delivered','Cancelled','Returned'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select className="form-select" style={{ maxWidth: 150 }}
            value={source} onChange={e => setSource(e.target.value)}>
            <option value="">All Sources</option>
            <option value="Website">🌐 Website</option>
            <option value="WhatsApp">💬 WhatsApp</option>
            <option value="Admin">👤 Admin</option>
          </select>
          {(search || status || source) && (
            <button className="btn btn-outline-secondary btn-sm"
              onClick={() => { setSearch(''); setStatus(''); setSource('') }}>
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: 14 }}>
            <thead className="table-light">
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>City</th>
                <th>Items</th>
                <th>Total</th>
                <th>Source</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="text-center py-5">
                  <div className="spinner-border" style={{ color: '#00b894' }} />
                </td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-5 text-muted">
                  <div style={{ fontSize: 40 }}>🛒</div>
                  <p className="mt-2">No orders found.</p>
                </td></tr>
              ) : orders.map(o => (
                <tr key={o.id}>
                  <td>
                    <Link to={`/admin/orders/${o.id}`}
                      className="fw-bold text-decoration-none"
                      style={{ color: '#00b894' }}>
                      {o.order_number}
                    </Link>
                  </td>
                  <td>
                    <div className="fw-semibold">{o.customer_name}</div>
                    <small className="text-muted">{o.customer_phone}</small>
                  </td>
                  <td className="text-muted">{o.city || '—'}</td>
                  <td>
                    <span className="badge bg-light text-dark border">
                      {o.items_count} items
                    </span>
                  </td>
                  <td><strong>${o.total}</strong></td>
                  <td>
                    <span style={{ fontSize: 16 }}>{SOURCE_ICONS[o.source]}</span>
                    <small className="text-muted ms-1">{o.source}</small>
                  </td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      style={{
                        ...STATUS_COLORS[o.status],
                        border: 'none', fontWeight: 600,
                        fontSize: 12, width: 130,
                        cursor: changingStatus === o.id ? 'wait' : 'pointer'
                      }}
                      value={o.status}
                      disabled={changingStatus === o.id}
                      onChange={e => handleStatusChange(o.id, e.target.value)}>
                      {['Pending','Confirmed','Processing','Shipped','Delivered','Cancelled','Returned'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="text-muted" style={{ fontSize: 12 }}>
                    {o.created_at}
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Link to={`/admin/orders/${o.id}`}
                        className="btn btn-sm btn-outline-primary">👁</Link>
                      <button className="btn btn-sm btn-outline-danger"
                        onClick={() => setDeleteId(o.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="p-3 d-flex justify-content-between align-items-center border-top">
            <small className="text-muted">
              Showing {meta.from}–{meta.to} of {meta.total}
            </small>
            <div className="d-flex gap-1">
              <button className="btn btn-sm btn-outline-secondary"
                disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
              {Array.from({ length: meta.last_page }, (_, i) => i + 1)
                .filter(p => p === 1 || p === meta.last_page || Math.abs(p - page) <= 1)
                .map((p, idx, arr) => (
                  <React.Fragment key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 &&
                      <span className="btn btn-sm disabled">…</span>}
                    <button
                      className={`btn btn-sm ${p === page ? 'text-white' : 'btn-outline-secondary'}`}
                      style={p === page ? { background: '#00b894', border: 'none' } : {}}
                      onClick={() => setPage(p)}>{p}</button>
                  </React.Fragment>
                ))}
              <button className="btn btn-sm btn-outline-secondary"
                disabled={page === meta.last_page} onClick={() => setPage(p => p + 1)}>›</button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,.5)', zIndex: 9999 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0" style={{ borderRadius: 12 }}>
              <div className="modal-body text-center p-5">
                <div style={{ fontSize: 52 }}>🗑️</div>
                <h5 className="fw-bold mt-3 mb-2">Delete this order?</h5>
                <p className="text-muted mb-4">
                  Only Delivered, Cancelled or Returned orders can be deleted.
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <button className="btn btn-light px-4" onClick={() => setDeleteId(null)}>Cancel</button>
                  <button className="btn btn-danger px-4"
                    disabled={deleting} onClick={handleDelete}>
                    {deleting ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrders