import React, { useState, useEffect, useCallback } from 'react'
import activityService from '../../../services/activityLogService'

const ACTION_COLORS = {
  Create:        { bg: '#d1fae5', color: '#059669', icon: '✅' },
  Update:        { bg: '#dbeafe', color: '#1d4ed8', icon: '✏️' },
  Delete:        { bg: '#fee2e2', color: '#dc2626', icon: '🗑️' },
  Restore:       { bg: '#ede9fe', color: '#6d28d9', icon: '♻️' },
  'Force Delete':{ bg: '#fef9c3', color: '#854d0e', icon: '💥' },
  Login:         { bg: '#d1fae5', color: '#059669', icon: '🔐' },
  Logout:        { bg: '#f3f4f6', color: '#374151', icon: '🚪' },
  'Status Change':{ bg: '#e0f2fe', color: '#0369a1', icon: '🔄' },
}

const MODULES = [
  'Product','Brand','ProductCategory','Attribute',
  'Order','Slider','Post','Category','Tag','Page',
  'Testimonial','Newsletter','ContactMessage',
  'Setting','SeoSetting','Menu',
]

function AdminActivityLog() {
  const [logs, setLogs]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [module, setModule]     = useState('')
  const [action, setAction]     = useState('')
  const [page, setPage]         = useState(1)
  const [meta, setMeta]         = useState(null)
  const [selected, setSelected] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchLogs = useCallback(() => {
    setLoading(true)
    activityService.getAll({ search, module, action, page, per_page: 15 })
      .then(res => {
        setLogs(res.data.data?.data || res.data.data || [])
        setMeta(res.data.data?.meta || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, module, action, page])

  useEffect(() => { fetchLogs() }, [fetchLogs])
  useEffect(() => { setPage(1) }, [search, module, action])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await activityService.destroy(deleteId)
      setDeleteId(null)
      if (selected?.id === deleteId) setSelected(null)
      fetchLogs()
    } catch (_) {}
    finally { setDeleting(false) }
  }

  // Stats from current page
  const actionCounts = Object.keys(ACTION_COLORS).reduce((acc, a) => {
    acc[a] = logs.filter(l => l.action === a).length
    return acc
  }, {})

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Activity Log</h4>
          <small className="text-muted">
            Track all admin actions — {meta?.total ?? 0} total records
          </small>
        </div>
      </div>

      {/* Action Stats */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {Object.entries(ACTION_COLORS).map(([act, colors]) => (
          <button key={act}
            onClick={() => setAction(action === act ? '' : act)}
            className="btn btn-sm d-flex align-items-center gap-1"
            style={{
              borderRadius: 20, fontSize: 12, border: 'none',
              background: action === act ? colors.color : colors.bg,
              color: action === act ? '#fff' : colors.color,
              fontWeight: action === act ? 600 : 400,
              transition: 'all 0.2s'
            }}>
            {colors.icon} {act}
          </button>
        ))}
        {action && (
          <button className="btn btn-sm btn-outline-secondary"
            style={{ borderRadius: 20, fontSize: 12 }}
            onClick={() => setAction('')}>✕ Clear</button>
        )}
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4 p-3" style={{ borderRadius: 12 }}>
        <div className="d-flex flex-wrap gap-2">
          <div className="input-group" style={{ maxWidth: 280 }}>
            <span className="input-group-text bg-light border-end-0">🔍</span>
            <input type="text" className="form-control border-start-0 bg-light"
              placeholder="Search description..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ maxWidth: 180 }}
            value={module} onChange={e => setModule(e.target.value)}>
            <option value="">All Modules</option>
            {MODULES.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          {(search || module || action) && (
            <button className="btn btn-outline-secondary btn-sm"
              onClick={() => { setSearch(''); setModule(''); setAction('') }}>
              ✕ Clear All
            </button>
          )}
        </div>
      </div>

      <div className="row g-4">

        {/* LEFT — Log List */}
        <div className={selected ? 'col-12 col-lg-7' : 'col-12'}>
          <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" style={{ color: '#00b894' }} />
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <div style={{ fontSize: 40 }}>📋</div>
                <p className="mt-2">No activity logs found.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ fontSize: 13 }}>
                  <thead className="table-light">
                    <tr>
                      <th>Action</th>
                      <th>Module</th>
                      <th>Description</th>
                      <th>User</th>
                      <th>IP</th>
                      <th>Time</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map(log => {
                      const colors = ACTION_COLORS[log.action] || { bg: '#f3f4f6', color: '#374151', icon: '📌' }
                      const isSelected = selected?.id === log.id
                      return (
                        <tr key={log.id}
                          onClick={() => setSelected(isSelected ? null : log)}
                          style={{
                            cursor: 'pointer',
                            background: isSelected ? '#f0fdf4' : ''
                          }}>
                          <td>
                            <span className="badge px-2 py-1"
                              style={{ background: colors.bg, color: colors.color, fontSize: 11 }}>
                              {colors.icon} {log.action}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border" style={{ fontSize: 11 }}>
                              {log.module}
                            </span>
                          </td>
                          <td>
                            <div className="text-truncate" style={{ maxWidth: 200 }}>
                              {log.description || '—'}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div style={{
                                width: 26, height: 26, borderRadius: '50%',
                                background: '#00b894', color: '#fff',
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'center', fontSize: 11,
                                fontWeight: 700, flexShrink: 0
                              }}>
                                {log.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                              </div>
                              <span className="text-truncate" style={{ maxWidth: 80 }}>
                                {log.user?.name || 'System'}
                              </span>
                            </div>
                          </td>
                          <td className="text-muted" style={{ fontSize: 11 }}>
                            {log.ip_address || '—'}
                          </td>
                          <td className="text-muted" style={{ fontSize: 11, whiteSpace: 'nowrap' }}>
                            {new Date(log.created_at).toLocaleString('en-US', {
                              month: 'short', day: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </td>
                          <td onClick={e => e.stopPropagation()}>
                            <button className="btn btn-sm btn-outline-danger p-1"
                              style={{ width: 28, height: 28, fontSize: 12 }}
                              onClick={() => setDeleteId(log.id)}>
                              🗑
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
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
        </div>

        {/* RIGHT — Detail Panel */}
        {selected && (
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm p-4 sticky-top"
              style={{ borderRadius: 12, top: 80 }}>
              <div className="d-flex justify-content-between align-items-start mb-4">
                <h6 className="fw-bold mb-0">Activity Detail</h6>
                <button className="btn btn-sm btn-outline-secondary"
                  onClick={() => setSelected(null)}>✕</button>
              </div>

              {/* Action Badge */}
              <div className="mb-4 text-center">
                {(() => {
                  const colors = ACTION_COLORS[selected.action] || { bg: '#f3f4f6', color: '#374151', icon: '📌' }
                  return (
                    <span className="badge px-4 py-2"
                      style={{ background: colors.bg, color: colors.color, fontSize: 16 }}>
                      {colors.icon} {selected.action}
                    </span>
                  )
                })()}
              </div>

              {/* Details */}
              <div className="d-flex flex-column gap-3">
                {[
                  ['📦 Module',       selected.module],
                  ['📝 Description',  selected.description || '—'],
                  ['🔖 Subject Type', selected.subject_type],
                  ['🆔 Subject ID',   selected.subject_id || '—'],
                ].map(([label, val]) => (
                  <div key={label} className="p-3 rounded-3"
                    style={{ background: '#f9fafb' }}>
                    <small className="text-muted fw-semibold d-block mb-1"
                      style={{ fontSize: 11 }}>
                      {label}
                    </small>
                    <div style={{ fontSize: 14 }}>{val}</div>
                  </div>
                ))}

                {/* User Info */}
                <div className="p-3 rounded-3" style={{ background: '#f9fafb' }}>
                  <small className="text-muted fw-semibold d-block mb-2" style={{ fontSize: 11 }}>
                    👤 Performed By
                  </small>
                  <div className="d-flex align-items-center gap-2">
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: '#00b894', color: '#fff',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontWeight: 700,
                      fontSize: 15, flexShrink: 0
                    }}>
                      {selected.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <div>
                      <div className="fw-semibold" style={{ fontSize: 14 }}>
                        {selected.user?.name || 'System'}
                      </div>
                      <small className="text-muted">{selected.user?.email || '—'}</small>
                    </div>
                  </div>
                </div>

                {/* Device Info */}
                <div className="p-3 rounded-3" style={{ background: '#f9fafb' }}>
                  <small className="text-muted fw-semibold d-block mb-2" style={{ fontSize: 11 }}>
                    🖥️ Device Info
                  </small>
                  <div className="row g-2">
                    {[
                      ['IP Address', selected.ip_address || '—'],
                      ['Browser',   selected.browser   || '—'],
                      ['Platform',  selected.platform  || '—'],
                    ].map(([label, val]) => (
                      <div className="col-12" key={label}>
                        <small className="text-muted">{label}: </small>
                        <span style={{ fontSize: 13 }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timestamp */}
                <div className="p-3 rounded-3" style={{ background: '#f9fafb' }}>
                  <small className="text-muted fw-semibold d-block mb-1" style={{ fontSize: 11 }}>
                    🕐 Timestamp
                  </small>
                  <div style={{ fontSize: 14 }}>
                    {new Date(selected.created_at).toLocaleString('en-US', {
                      weekday: 'long', year: 'numeric',
                      month: 'long', day: 'numeric',
                      hour: '2-digit', minute: '2-digit', second: '2-digit'
                    })}
                  </div>
                </div>
              </div>

              {/* Delete */}
              <button
                className="btn btn-outline-danger w-100 mt-4"
                onClick={() => setDeleteId(selected.id)}>
                🗑 Delete This Log
              </button>
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
                <div style={{ fontSize: 52 }}>📋</div>
                <h5 className="fw-bold mt-3 mb-2">Delete this log?</h5>
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

export default AdminActivityLog