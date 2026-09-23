import React, { useState, useEffect, useCallback } from 'react'
import newsletterService from '../../../services/newsletterService'

function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [status, setStatus]           = useState('')
  const [page, setPage]               = useState(1)
  const [meta, setMeta]               = useState(null)
  const [deleting, setDeleting]       = useState(null)
  const [toggling, setToggling]       = useState(null)
  const [deleteId, setDeleteId]       = useState(null)

  const fetchSubscribers = useCallback(() => {
    setLoading(true)
    newsletterService.getAll({ search, status, page, per_page: 15 })
      .then(res => {
        setSubscribers(res.data.data?.data || res.data.data || [])
        setMeta(res.data.data?.meta || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, status, page])

  useEffect(() => { fetchSubscribers() }, [fetchSubscribers])
  useEffect(() => { setPage(1) }, [search, status])

  const handleToggle = async (id) => {
    setToggling(id)
    try { await newsletterService.changeStatus(id); fetchSubscribers() }
    catch (_) {} finally { setToggling(null) }
  }

  const handleDelete = async () => {
    setDeleting(deleteId)
    try {
      await newsletterService.destroy(deleteId)
      setDeleteId(null)
      fetchSubscribers()
    } catch (_) {} finally { setDeleting(null) }
  }

  const totalSubscribed   = subscribers.filter(s => s.status === 'Subscribed').length
  const totalUnsubscribed = subscribers.filter(s => s.status === 'Unsubscribed').length

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Newsletter Subscribers</h4>
          <small className="text-muted">Manage email subscribers</small>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { icon: '📧', label: 'Total',        value: meta?.total ?? subscribers.length, color: '#00b894' },
          { icon: '✅', label: 'Subscribed',   value: totalSubscribed,   color: '#059669' },
          { icon: '🚫', label: 'Unsubscribed', value: totalUnsubscribed, color: '#dc2626' },
        ].map((s, i) => (
          <div className="col-4" key={i}>
            <div className="card border-0 shadow-sm p-3 d-flex flex-row align-items-center gap-3"
              style={{ borderRadius: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                background: s.color + '20', color: s.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
              }}>{s.icon}</div>
              <div>
                <div className="text-muted" style={{ fontSize: 12 }}>{s.label}</div>
                <div className="fw-bold" style={{ fontSize: 22 }}>{s.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4 p-3" style={{ borderRadius: 12 }}>
        <div className="d-flex flex-wrap gap-2">
          <div className="input-group" style={{ maxWidth: 280 }}>
            <span className="input-group-text bg-light border-end-0">🔍</span>
            <input type="text" className="form-control border-start-0 bg-light"
              placeholder="Search email..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ maxWidth: 180 }}
            value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Subscribed">✅ Subscribed</option>
            <option value="Unsubscribed">🚫 Unsubscribed</option>
          </select>
          {(search || status) && (
            <button className="btn btn-outline-secondary btn-sm"
              onClick={() => { setSearch(''); setStatus('') }}>✕ Clear</button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: 14 }}>
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Status</th>
                <th>Subscribed At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-5">
                  <div className="spinner-border" style={{ color: '#00b894' }} />
                </td></tr>
              ) : subscribers.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-5 text-muted">
                  <div style={{ fontSize: 40 }}>📭</div>
                  <p className="mt-2">No subscribers found.</p>
                </td></tr>
              ) : subscribers.map((sub, i) => (
                <tr key={sub.id}>
                  <td className="text-muted" style={{ fontSize: 12 }}>
                    {((page - 1) * 15) + i + 1}
                  </td>
                  <td>
                    <div className="fw-semibold">{sub.email}</div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="form-check form-switch mb-0">
                        <input className="form-check-input" type="checkbox"
                          checked={sub.status === 'Subscribed'}
                          disabled={toggling === sub.id}
                          onChange={() => handleToggle(sub.id)}
                          style={{ cursor: 'pointer' }} />
                      </div>
                      <span className={`badge ${sub.status === 'Subscribed' ? 'bg-success' : 'bg-danger'}`}
                        style={{ fontSize: 11 }}>
                        {sub.status}
                      </span>
                    </div>
                  </td>
                  <td className="text-muted" style={{ fontSize: 12 }}>
                    {sub.subscribed_at
                      ? new Date(sub.subscribed_at).toLocaleDateString()
                      : new Date(sub.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-danger"
                      onClick={() => setDeleteId(sub.id)}>
                      🗑
                    </button>
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
                <div style={{ fontSize: 52 }}>📧</div>
                <h5 className="fw-bold mt-3 mb-2">Delete this subscriber?</h5>
                <p className="text-muted mb-4">This action cannot be undone.</p>
                <div className="d-flex gap-3 justify-content-center">
                  <button className="btn btn-light px-4" onClick={() => setDeleteId(null)}>Cancel</button>
                  <button className="btn btn-danger px-4"
                    disabled={!!deleting} onClick={handleDelete}>
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

export default AdminNewsletter