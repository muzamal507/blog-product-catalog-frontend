import React, { useState, useEffect, useCallback } from 'react'
import notificationService from '../../../services/notificationService'
import { useNotifications } from '../../../context/NotificationContext'

const TYPE_COLORS = {
  Success: { bg: '#d1fae5', color: '#059669', icon: '✅' },
  Info:    { bg: '#dbeafe', color: '#1d4ed8', icon: 'ℹ️' },
  Warning: { bg: '#fef9c3', color: '#854d0e', icon: '⚠️' },
  Error:   { bg: '#fee2e2', color: '#dc2626', icon: '❌' },
}

function AdminNotifications() {
  const { refresh } = useNotifications()

  const [notifications, setNotifications] = useState([])
  const [loading, setLoading]             = useState(true)
  const [search, setSearch]               = useState('')
  const [type, setType]                   = useState('')
  const [readFilter, setReadFilter]       = useState('')
  const [page, setPage]                   = useState(1)
  const [meta, setMeta]                   = useState(null)
  const [deleteId, setDeleteId]           = useState(null)
  const [deleting, setDeleting]           = useState(false)
  const [showForm, setShowForm]           = useState(false)

  // Form state
  const [form, setForm]     = useState({ title: '', message: '', type: 'Info' })
  const [formErr, setFormErr] = useState({})
  const [saving, setSaving]  = useState(false)

  const fetchNotifications = useCallback(() => {
    setLoading(true)
    const params = { search, page, per_page: 15 }
    if (type)       params.type    = type
    if (readFilter !== '') params.is_read = readFilter

    notificationService.getAll(params)
      .then(res => {
        setNotifications(res.data.data?.data || res.data.data || [])
        setMeta(res.data.data?.meta || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, type, readFilter, page])

  useEffect(() => { fetchNotifications() }, [fetchNotifications])
  useEffect(() => { setPage(1) }, [search, type, readFilter])

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markRead(id)
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      )
      refresh()
    } catch (_) {}
  }

  const handleMarkUnread = async (id) => {
    try {
      await notificationService.markUnread(id)
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: false } : n)
      )
      refresh()
    } catch (_) {}
  }

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead()
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      refresh()
    } catch (_) {}
  }

  const handleClearAll = async () => {
    if (!window.confirm('Clear all notifications? Cannot be undone.')) return
    try {
      await notificationService.clearAll()
      setNotifications([])
      setMeta(null)
      refresh()
    } catch (_) {}
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await notificationService.destroy(deleteId)
      setDeleteId(null)
      fetchNotifications()
      refresh()
    } catch (_) {} finally { setDeleting(false) }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (Object.keys(errs).length) { setFormErr(errs); return }

    setSaving(true)
    try {
      await notificationService.store(form)
      setForm({ title: '', message: '', type: 'Info' })
      setShowForm(false)
      fetchNotifications()
      refresh()
    } catch (err) {
      setFormErr(err.response?.data?.errors || {})
    } finally { setSaving(false) }
  }

  const unread = notifications.filter(n => !n.is_read).length
  const total  = meta?.total ?? notifications.length

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">
            Notifications
            {unread > 0 && (
              <span className="badge ms-2"
                style={{ background: '#dc2626', fontSize: 12 }}>
                {unread} unread
              </span>
            )}
          </h4>
          <small className="text-muted">{total} total notifications</small>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          {unread > 0 && (
            <button className="btn btn-sm btn-outline-success"
              onClick={handleMarkAllRead}>
              ✓ Mark All Read
            </button>
          )}
          <button className="btn btn-sm btn-outline-danger"
            onClick={handleClearAll}>
            🗑 Clear All
          </button>
          <button
            className="btn text-white fw-semibold px-3 btn-sm"
            style={{ background: '#00b894', borderRadius: 8 }}
            onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Add Notification'}
          </button>
        </div>
      </div>

      {/* Quick Add Form */}
      {showForm && (
        <div className="card border-0 shadow-sm p-4 mb-4"
          style={{ borderRadius: 12, borderLeft: '3px solid #00b894' }}>
          <h6 className="fw-bold mb-3">Create Notification</h6>
          <form onSubmit={handleFormSubmit}>
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                  Title <span className="text-danger">*</span>
                </label>
                <input type="text"
                  className={`form-control ${formErr.title ? 'is-invalid' : ''}`}
                  placeholder="Notification title..."
                  value={form.title}
                  onChange={e => { setForm(p => ({ ...p, title: e.target.value })); setFormErr({}) }} />
                {formErr.title && <div className="invalid-feedback">{formErr.title}</div>}
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Type</label>
                <select className="form-select"
                  value={form.type}
                  onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                  {Object.keys(TYPE_COLORS).map(t => (
                    <option key={t} value={t}>
                      {TYPE_COLORS[t].icon} {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Message</label>
                <input type="text" className="form-control"
                  placeholder="Optional message..."
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
              </div>
              <div className="col-12 col-md-2">
                <button type="submit"
                  className="btn w-100 text-white fw-semibold"
                  style={{ background: '#00b894', borderRadius: 8 }}
                  disabled={saving}>
                  {saving
                    ? <span className="spinner-border spinner-border-sm" />
                    : '🔔 Create'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Type Filter Chips */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setType('')}
          className="btn btn-sm"
          style={{
            borderRadius: 20, fontSize: 12, border: 'none',
            background: !type ? '#1a1a2e' : '#f3f4f6',
            color: !type ? '#fff' : '#374151'
          }}>
          All Types
        </button>
        {Object.entries(TYPE_COLORS).map(([t, colors]) => (
          <button key={t}
            onClick={() => setType(type === t ? '' : t)}
            className="btn btn-sm"
            style={{
              borderRadius: 20, fontSize: 12, border: 'none',
              background: type === t ? colors.color : colors.bg,
              color: type === t ? '#fff' : colors.color,
              fontWeight: type === t ? 600 : 400
            }}>
            {colors.icon} {t}
          </button>
        ))}
        <div className="ms-auto">
          <select className="form-select form-select-sm" style={{ width: 140 }}
            value={readFilter} onChange={e => setReadFilter(e.target.value)}>
            <option value="">All</option>
            <option value="0">🔴 Unread</option>
            <option value="1">✅ Read</option>
          </select>
        </div>
      </div>

      {/* Search */}
      <div className="card border-0 shadow-sm mb-4 p-3" style={{ borderRadius: 12 }}>
        <div className="d-flex gap-2">
          <div className="input-group" style={{ maxWidth: 300 }}>
            <span className="input-group-text bg-light border-end-0">🔍</span>
            <input type="text" className="form-control border-start-0 bg-light"
              placeholder="Search notifications..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {(search || type || readFilter) && (
            <button className="btn btn-outline-secondary btn-sm"
              onClick={() => { setSearch(''); setType(''); setReadFilter('') }}>
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#00b894' }} />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <div style={{ fontSize: 48 }}>🔔</div>
            <p className="mt-3">No notifications found.</p>
          </div>
        ) : (
          <div>
            {notifications.map((n, i) => {
              const colors = TYPE_COLORS[n.type] || TYPE_COLORS.Info
              return (
                <div key={n.id}
                  className="d-flex align-items-start gap-3 px-4 py-3"
                  style={{
                    borderBottom: i < notifications.length - 1 ? '1px solid #f3f4f6' : 'none',
                    background: n.is_read ? '#fff' : '#f0fdf4',
                  }}>

                  {/* Type Icon */}
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: colors.bg, color: colors.color,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 18
                  }}>
                    {colors.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-fill" style={{ minWidth: 0 }}>
                    <div className="d-flex align-items-start justify-content-between gap-2">
                      <div style={{ minWidth: 0 }}>
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <span className="fw-semibold" style={{ fontSize: 14 }}>
                            {n.title}
                          </span>
                          <span className="badge px-2 py-1"
                            style={{ background: colors.bg, color: colors.color, fontSize: 10 }}>
                            {n.type}
                          </span>
                          {!n.is_read && (
                            <span className="badge"
                              style={{ background: '#d1fae5', color: '#059669', fontSize: 10 }}>
                              New
                            </span>
                          )}
                        </div>
                        {n.message && (
                          <p className="text-muted mb-1 mt-1"
                            style={{ fontSize: 13, lineHeight: 1.5 }}>
                            {n.message}
                          </p>
                        )}
                        <small className="text-muted" style={{ fontSize: 11 }}>
                          {new Date(n.created_at).toLocaleString('en-US', {
                            weekday: 'short', month: 'short', day: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </small>
                      </div>

                      {/* Actions */}
                      <div className="d-flex gap-1 flex-shrink-0">
                        {n.is_read ? (
                          <button className="btn btn-sm btn-outline-secondary"
                            style={{ fontSize: 11, padding: '2px 8px' }}
                            onClick={() => handleMarkUnread(n.id)}>
                            Mark Unread
                          </button>
                        ) : (
                          <button className="btn btn-sm btn-outline-success"
                            style={{ fontSize: 11, padding: '2px 8px' }}
                            onClick={() => handleMarkRead(n.id)}>
                            ✓ Read
                          </button>
                        )}
                        <button className="btn btn-sm btn-outline-danger"
                          style={{ fontSize: 11, padding: '2px 8px' }}
                          onClick={() => setDeleteId(n.id)}>
                          🗑
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

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
                    {idx > 0 && arr[idx-1] !== p-1 &&
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
                <div style={{ fontSize: 52 }}>🔔</div>
                <h5 className="fw-bold mt-3 mb-2">Delete this notification?</h5>
                <p className="text-muted mb-4">This action cannot be undone.</p>
                <div className="d-flex gap-3 justify-content-center">
                  <button className="btn btn-light px-4"
                    onClick={() => setDeleteId(null)}>Cancel</button>
                  <button className="btn btn-danger px-4"
                    disabled={deleting} onClick={handleDelete}>
                    {deleting
                      ? <span className="spinner-border spinner-border-sm me-2" />
                      : null}
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

export default AdminNotifications