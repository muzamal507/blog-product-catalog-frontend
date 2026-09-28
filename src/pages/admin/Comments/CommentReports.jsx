import React, { useState, useEffect, useCallback } from 'react'
import commentReportService from '../../../services/commentReportService'

const STATUS_COLORS = {
  Pending:  { bg: '#fef9c3', color: '#854d0e' },
  Reviewed: { bg: '#dbeafe', color: '#1d4ed8' },
  Actioned: { bg: '#d1fae5', color: '#059669' },
}

const REASON_ICONS = {
  Spam:        '🚫',
  Harassment:  '😠',
  Abuse:       '⚠️',
  Other:       '📌',
}

function CommentReports() {
  const [reports, setReports]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [selected, setSelected]   = useState(null)
  const [search, setSearch]       = useState('')
  const [page, setPage]           = useState(1)
  const [meta, setMeta]           = useState(null)
  const [updating, setUpdating]   = useState(null)
  const [deleteId, setDeleteId]   = useState(null)
  const [deleting, setDeleting]   = useState(false)

  // Update form
  const [updateForm, setUpdateForm] = useState({ status: '', admin_notes: '' })

  const fetchReports = useCallback(() => {
    setLoading(true)
    commentReportService.getAll({ search, page, per_page: 15 })
      .then(res => {
        setReports(res.data.data?.data || res.data.data || [])
        setMeta(res.data.data?.meta || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, page])

  useEffect(() => { fetchReports() }, [fetchReports])
  useEffect(() => { setPage(1) }, [search])

  const handleSelect = (report) => {
    setSelected(report)
    setUpdateForm({
      status:      report.status,
      admin_notes: report.admin_notes || '',
    })
  }

  const handleUpdateStatus = async () => {
    if (!selected) return
    setUpdating(selected.id)
    try {
      await commentReportService.updateStatus(selected.id, updateForm)
      setReports(prev =>
        prev.map(r => r.id === selected.id
          ? { ...r, status: updateForm.status, admin_notes: updateForm.admin_notes }
          : r
        )
      )
      setSelected(prev => ({ ...prev, ...updateForm }))
    } catch (_) {} finally { setUpdating(null) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await commentReportService.destroy(deleteId)
      setDeleteId(null)
      if (selected?.id === deleteId) setSelected(null)
      fetchReports()
    } catch (_) {} finally { setDeleting(false) }
  }

  const pending  = reports.filter(r => r.status === 'Pending').length
  const reviewed = reports.filter(r => r.status === 'Reviewed').length

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">
            Comment Reports
            {pending > 0 && (
              <span className="badge ms-2"
                style={{ background: '#f59e0b', fontSize: 12 }}>
                {pending} pending
              </span>
            )}
          </h4>
          <small className="text-muted">{meta?.total ?? 0} total reports</small>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {Object.entries(STATUS_COLORS).map(([s, colors]) => (
          <div className="col-4" key={s}>
            <div className="card border-0 shadow-sm p-3 text-center" style={{ borderRadius: 12 }}>
              <div style={{ color: colors.color, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                {s.toUpperCase()}
              </div>
              <div className="fw-bold" style={{ fontSize: 20 }}>
                {reports.filter(r => r.status === s).length}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="card border-0 shadow-sm mb-4 p-3" style={{ borderRadius: 12 }}>
        <div className="input-group" style={{ maxWidth: 300 }}>
          <span className="input-group-text bg-light border-end-0">🔍</span>
          <input type="text" className="form-control border-start-0 bg-light"
            placeholder="Search reports..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="row g-4">

        {/* LEFT — Reports List */}
        <div className={selected ? 'col-12 col-lg-6' : 'col-12'}>
          <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" style={{ color: '#00b894' }} />
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <div style={{ fontSize: 40 }}>🚩</div>
                <p className="mt-2">No reports found.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ fontSize: 13 }}>
                  <thead className="table-light">
                    <tr>
                      <th>Reason</th>
                      <th>Comment</th>
                      <th>Reported By</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map(r => {
                      const colors = STATUS_COLORS[r.status] || STATUS_COLORS.Pending
                      return (
                        <tr key={r.id}
                          onClick={() => handleSelect(r)}
                          style={{
                            cursor: 'pointer',
                            background: selected?.id === r.id ? '#f0fdf4' : ''
                          }}>
                          <td>
                            <span>{REASON_ICONS[r.reason] || '📌'}</span>
                            <span className="ms-1 fw-semibold">{r.reason}</span>
                          </td>
                          <td>
                            <div className="text-muted text-truncate" style={{ maxWidth: 150 }}>
                              {r.comment?.comment || '—'}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: 12 }}>
                              {r.reporter?.name || 'Guest'}
                            </div>
                          </td>
                          <td>
                            <span className="badge px-2 py-1"
                              style={{ background: colors.bg, color: colors.color, fontSize: 11 }}>
                              {r.status}
                            </span>
                          </td>
                          <td onClick={e => e.stopPropagation()}>
                            <button className="btn btn-sm btn-outline-danger"
                              style={{ fontSize: 11, padding: '2px 6px' }}
                              onClick={() => setDeleteId(r.id)}>🗑</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {meta && meta.last_page > 1 && (
              <div className="p-3 d-flex justify-content-between border-top">
                <small className="text-muted">{meta.from}–{meta.to} of {meta.total}</small>
                <div className="d-flex gap-1">
                  <button className="btn btn-sm btn-outline-secondary"
                    disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                  <button className="btn btn-sm btn-outline-secondary"
                    disabled={page === meta.last_page} onClick={() => setPage(p => p + 1)}>›</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Report Detail */}
        {selected && (
          <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-sm p-4 sticky-top" style={{ borderRadius: 12, top: 80 }}>
              <div className="d-flex justify-content-between align-items-start mb-4">
                <h6 className="fw-bold mb-0">Report Detail</h6>
                <button className="btn btn-sm btn-outline-secondary"
                  onClick={() => setSelected(null)}>✕</button>
              </div>

              {/* Reason */}
              <div className="text-center mb-4">
                <div style={{ fontSize: 40 }}>{REASON_ICONS[selected.reason] || '📌'}</div>
                <div className="fw-bold mt-2" style={{ fontSize: 18 }}>{selected.reason}</div>
              </div>

              {/* Reported Comment */}
              <div className="p-3 rounded-3 mb-3"
                style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                <small className="fw-semibold text-danger d-block mb-2" style={{ fontSize: 11 }}>
                  🚩 Reported Comment
                </small>
                <p style={{ fontSize: 13, lineHeight: 1.8, margin: 0 }}>
                  {selected.comment?.comment || '—'}
                </p>
                <small className="text-muted mt-2 d-block">
                  By: {selected.comment?.user?.name || selected.comment?.guest_name || 'Guest'}
                </small>
              </div>

              {/* Reporter */}
              <div className="p-3 rounded-3 mb-3" style={{ background: '#f9fafb' }}>
                <small className="text-muted fw-semibold d-block mb-1" style={{ fontSize: 11 }}>
                  👤 Reported By
                </small>
                <div style={{ fontSize: 14 }}>
                  {selected.reporter?.name || 'Guest'}
                </div>
                <small className="text-muted">
                  {selected.reporter?.email || '—'}
                </small>
              </div>

              {/* Update Status */}
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                  Update Status
                </label>
                <select className="form-select mb-2"
                  value={updateForm.status}
                  onChange={e => setUpdateForm(p => ({ ...p, status: e.target.value }))}>
                  <option value="Pending">⏳ Pending</option>
                  <option value="Reviewed">👁 Reviewed</option>
                  <option value="Actioned">✅ Actioned</option>
                </select>
                <textarea rows={3} className="form-control"
                  placeholder="Admin notes (optional)..."
                  style={{ fontSize: 13 }}
                  value={updateForm.admin_notes}
                  onChange={e => setUpdateForm(p => ({ ...p, admin_notes: e.target.value }))} />
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn flex-fill text-white fw-semibold"
                  style={{ background: '#00b894', borderRadius: 8 }}
                  disabled={updating === selected.id}
                  onClick={handleUpdateStatus}>
                  {updating === selected.id
                    ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                    : '💾 Update Report'}
                </button>
                <button className="btn btn-outline-danger"
                  onClick={() => setDeleteId(selected.id)}>
                  🗑
                </button>
              </div>
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
                <div style={{ fontSize: 52 }}>🚩</div>
                <h5 className="fw-bold mt-3 mb-2">Delete this report?</h5>
                <div className="d-flex gap-3 justify-content-center mt-4">
                  <button className="btn btn-light px-4"
                    onClick={() => setDeleteId(null)}>Cancel</button>
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

export default CommentReports