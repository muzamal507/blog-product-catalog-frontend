import React, { useState, useEffect, useCallback } from 'react'
import commentService from '../../../services/commentService'

const STATUS_COLORS = {
  Pending:  { bg: '#fef9c3', color: '#854d0e', icon: '⏳' },
  Approved: { bg: '#d1fae5', color: '#059669', icon: '✅' },
  Rejected: { bg: '#fee2e2', color: '#dc2626', icon: '❌' },
}

function AdminComments() {
  const [comments, setComments]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [status, setStatus]       = useState('')
  const [page, setPage]           = useState(1)
  const [meta, setMeta]           = useState(null)
  const [selected, setSelected]   = useState(null)
  const [deleteId, setDeleteId]   = useState(null)
  const [deleting, setDeleting]   = useState(false)
  const [changingStatus, setChangingStatus] = useState(null)

  const fetchComments = useCallback(() => {
    setLoading(true)
    commentService.getAll({ search, status, page, per_page: 15 })
      .then(res => {
        setComments(res.data.data?.data || res.data.data || [])
        setMeta(res.data.data?.meta || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, status, page])

  useEffect(() => { fetchComments() }, [fetchComments])
  useEffect(() => { setPage(1) }, [search, status])

  const handleStatus = async (id, newStatus) => {
    setChangingStatus(id)
    try {
      await commentService.changeStatus(id, newStatus)
      setComments(prev =>
        prev.map(c => c.id === id ? { ...c, status: newStatus } : c)
      )
      if (selected?.id === id) setSelected(prev => ({ ...prev, status: newStatus }))
    } catch (_) {}
    finally { setChangingStatus(null) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await commentService.destroy(deleteId)
      setDeleteId(null)
      if (selected?.id === deleteId) setSelected(null)
      fetchComments()
    } catch (_) {} finally { setDeleting(false) }
  }

  const pending  = comments.filter(c => c.status === 'Pending').length
  const approved = comments.filter(c => c.status === 'Approved').length
  const rejected = comments.filter(c => c.status === 'Rejected').length

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">
            Comments
            {pending > 0 && (
              <span className="badge ms-2"
                style={{ background: '#f59e0b', fontSize: 12 }}>
                {pending} pending
              </span>
            )}
          </h4>
          <small className="text-muted">{meta?.total ?? 0} total comments</small>
        </div>
      </div>

      {/* Status Filter Chips */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        <button onClick={() => setStatus('')}
          className="btn btn-sm"
          style={{ borderRadius: 20, fontSize: 12, border: 'none',
            background: !status ? '#1a1a2e' : '#f3f4f6',
            color: !status ? '#fff' : '#374151' }}>
          All Comments
        </button>
        {Object.entries(STATUS_COLORS).map(([s, colors]) => (
          <button key={s}
            onClick={() => setStatus(status === s ? '' : s)}
            className="btn btn-sm"
            style={{
              borderRadius: 20, fontSize: 12, border: 'none',
              background: status === s ? colors.color : colors.bg,
              color: status === s ? '#fff' : colors.color,
              fontWeight: status === s ? 600 : 400
            }}>
            {colors.icon} {s}
            {s === 'Pending' && pending > 0 && (
              <span className="ms-1 badge"
                style={{ background: '#854d0e', color: '#fff', fontSize: 10 }}>
                {pending}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4 p-3" style={{ borderRadius: 12 }}>
        <div className="d-flex flex-wrap gap-2">
          <div className="input-group" style={{ maxWidth: 300 }}>
            <span className="input-group-text bg-light border-end-0">🔍</span>
            <input type="text" className="form-control border-start-0 bg-light"
              placeholder="Search comments..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {(search || status) && (
            <button className="btn btn-outline-secondary btn-sm"
              onClick={() => { setSearch(''); setStatus('') }}>
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      <div className="row g-4">

        {/* LEFT — Comments List */}
        <div className={selected ? 'col-12 col-lg-6' : 'col-12'}>
          <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" style={{ color: '#00b894' }} />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <div style={{ fontSize: 40 }}>💬</div>
                <p className="mt-2">No comments found.</p>
              </div>
            ) : (
              <div>
                {comments.map((c, i) => {
                  const colors = STATUS_COLORS[c.status] || STATUS_COLORS.Pending
                  const isSelected = selected?.id === c.id
                  return (
                    <div key={c.id}
                      onClick={() => setSelected(isSelected ? null : c)}
                      className="d-flex gap-3 px-4 py-3"
                      style={{
                        borderBottom: i < comments.length - 1 ? '1px solid #f3f4f6' : 'none',
                        background: isSelected ? '#f0fdf4' : '',
                        cursor: 'pointer', transition: 'background 0.15s'
                      }}
                      onMouseOver={e => { if (!isSelected) e.currentTarget.style.background = '#f9fafb' }}
                      onMouseOut={e => { if (!isSelected) e.currentTarget.style.background = '' }}>

                      {/* Avatar */}
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                        background: '#00b894', color: '#fff',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontWeight: 700, fontSize: 15
                      }}>
                        {(c.user?.name || c.guest_name || 'G').charAt(0).toUpperCase()}
                      </div>

                      {/* Content */}
                      <div className="flex-fill" style={{ minWidth: 0 }}>
                        <div className="d-flex justify-content-between align-items-start gap-2">
                          <div style={{ minWidth: 0 }}>
                            <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                              <span className="fw-semibold" style={{ fontSize: 13 }}>
                                {c.user?.name || c.guest_name || 'Guest'}
                              </span>
                              {c.parent_id && (
                                <span className="badge"
                                  style={{ background: '#dbeafe', color: '#1d4ed8', fontSize: 10 }}>
                                  ↩ Reply
                                </span>
                              )}
                              <span className="badge px-2"
                                style={{ background: colors.bg, color: colors.color, fontSize: 10 }}>
                                {colors.icon} {c.status}
                              </span>
                            </div>
                            <p className="text-muted mb-1"
                              style={{
                                fontSize: 13, lineHeight: 1.5,
                                display: '-webkit-box', WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical', overflow: 'hidden'
                              }}>
                              {c.comment}
                            </p>
                            <small className="text-muted" style={{ fontSize: 11 }}>
                              📝 {c.post?.title || 'Unknown Post'} ·{' '}
                              {new Date(c.created_at).toLocaleDateString('en-US', {
                                month: 'short', day: 'numeric', year: 'numeric'
                              })}
                            </small>
                          </div>

                          {/* Quick Actions */}
                          <div className="d-flex flex-column gap-1 flex-shrink-0"
                            onClick={e => e.stopPropagation()}>
                            {c.status !== 'Approved' && (
                              <button className="btn btn-sm"
                                style={{ fontSize: 10, padding: '2px 8px',
                                  background: '#d1fae5', color: '#059669', border: 'none' }}
                                disabled={changingStatus === c.id}
                                onClick={() => handleStatus(c.id, 'Approved')}>
                                ✓ Approve
                              </button>
                            )}
                            {c.status !== 'Rejected' && (
                              <button className="btn btn-sm"
                                style={{ fontSize: 10, padding: '2px 8px',
                                  background: '#fee2e2', color: '#dc2626', border: 'none' }}
                                disabled={changingStatus === c.id}
                                onClick={() => handleStatus(c.id, 'Rejected')}>
                                ✕ Reject
                              </button>
                            )}
                            <button className="btn btn-sm btn-outline-danger"
                              style={{ fontSize: 10, padding: '2px 8px' }}
                              onClick={() => setDeleteId(c.id)}>
                              🗑 Delete
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
                  {meta.from}–{meta.to} of {meta.total}
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

        {/* RIGHT — Comment Detail */}
        {selected && (
          <div className="col-12 col-lg-6">
            <CommentDetail
              comment={selected}
              onStatusChange={handleStatus}
              onDelete={(id) => setDeleteId(id)}
              onClose={() => setSelected(null)}
              changingStatus={changingStatus}
            />
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,.5)', zIndex: 9999 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0" style={{ borderRadius: 12 }}>
              <div className="modal-body text-center p-5">
                <div style={{ fontSize: 52 }}>💬</div>
                <h5 className="fw-bold mt-3 mb-2">Delete this comment?</h5>
                <p className="text-muted mb-4">It will be moved to trash.</p>
                <div className="d-flex gap-3 justify-content-center">
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

// ==================== COMMENT DETAIL ====================
function CommentDetail({ comment: c, onStatusChange, onDelete, onClose, changingStatus }) {
  const [history, setHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const colors = STATUS_COLORS[c.status] || STATUS_COLORS.Pending

  const loadHistory = () => {
    if (showHistory) { setShowHistory(false); return }
    setLoadingHistory(true)
    commentService.getHistory(c.id)
      .then(res => setHistory(res.data.data || res.data || []))
      .catch(() => {})
      .finally(() => { setLoadingHistory(false); setShowHistory(true) })
  }

  return (
    <div className="card border-0 shadow-sm p-4 sticky-top" style={{ borderRadius: 12, top: 80 }}>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <h6 className="fw-bold mb-0">Comment Detail</h6>
        <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>✕</button>
      </div>

      {/* Status */}
      <div className="text-center mb-4">
        <span className="badge px-4 py-2"
          style={{ background: colors.bg, color: colors.color, fontSize: 14 }}>
          {colors.icon} {c.status}
        </span>
      </div>

      {/* Author */}
      <div className="p-3 rounded-3 mb-3" style={{ background: '#f9fafb' }}>
        <small className="text-muted fw-semibold d-block mb-2" style={{ fontSize: 11 }}>
          👤 Author
        </small>
        <div className="d-flex align-items-center gap-2">
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#00b894', color: '#fff', flexShrink: 0,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 700, fontSize: 15
          }}>
            {(c.user?.name || c.guest_name || 'G').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="fw-semibold" style={{ fontSize: 14 }}>
              {c.user?.name || c.guest_name || 'Guest'}
            </div>
            <small className="text-muted">
              {c.user?.email || c.guest_email || '—'}
            </small>
          </div>
          {!c.user && (
            <span className="badge ms-1"
              style={{ background: '#fef9c3', color: '#854d0e', fontSize: 10 }}>
              Guest
            </span>
          )}
        </div>
      </div>

      {/* Post */}
      <div className="p-3 rounded-3 mb-3" style={{ background: '#f9fafb' }}>
        <small className="text-muted fw-semibold d-block mb-1" style={{ fontSize: 11 }}>
          📝 Post
        </small>
        <div style={{ fontSize: 14 }}>{c.post?.title || '—'}</div>
      </div>

      {/* Comment Text */}
      <div className="p-3 rounded-3 mb-3"
        style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
        <small className="text-muted fw-semibold d-block mb-2" style={{ fontSize: 11 }}>
          💬 Comment
        </small>
        <p style={{ fontSize: 14, lineHeight: 1.8, margin: 0,
          whiteSpace: 'pre-wrap' }}>
          {c.comment}
        </p>
      </div>

      {/* Meta */}
      <div className="p-3 rounded-3 mb-4" style={{ background: '#f9fafb' }}>
        <div className="row g-2">
          {[
            ['📅 Posted',  new Date(c.created_at).toLocaleString()],
            ['💬 Type',    c.parent_id ? 'Reply' : 'Top-level'],
            ['🔗 Post ID', c.post_id],
          ].map(([label, val]) => (
            <div className="col-12" key={label}>
              <small className="text-muted">{label}: </small>
              <span style={{ fontSize: 13 }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status Actions */}
      <div className="d-flex gap-2 mb-3">
        {['Approved', 'Rejected', 'Pending'].map(s => (
          <button key={s}
            className="btn btn-sm flex-fill"
            style={{
              background: c.status === s ? STATUS_COLORS[s].color : STATUS_COLORS[s].bg,
              color: c.status === s ? '#fff' : STATUS_COLORS[s].color,
              border: 'none', fontWeight: c.status === s ? 600 : 400, fontSize: 12
            }}
            disabled={c.status === s || changingStatus === c.id}
            onClick={() => onStatusChange(c.id, s)}>
            {STATUS_COLORS[s].icon} {s}
          </button>
        ))}
      </div>

      {/* History */}
      <button className="btn btn-sm btn-outline-secondary w-100 mb-3"
        onClick={loadHistory}>
        {loadingHistory
          ? <span className="spinner-border spinner-border-sm me-2" />
          : showHistory ? '▲ Hide History' : '🕐 View Edit History'}
      </button>

      {showHistory && (
        <div className="mb-3">
          {history.length === 0 ? (
            <p className="text-muted text-center" style={{ fontSize: 13 }}>
              No edit history.
            </p>
          ) : history.map((h, i) => (
            <div key={i} className="p-3 rounded-3 mb-2"
              style={{ background: '#fef9c3', border: '1px solid #fde68a' }}>
              <small className="text-muted fw-semibold d-block mb-1" style={{ fontSize: 11 }}>
                ✏️ Edited by {h.editor?.name || 'Unknown'} — {new Date(h.edited_at).toLocaleString()}
              </small>
              <div style={{ fontSize: 12, color: '#dc2626', textDecoration: 'line-through' }}>
                {h.old_comment}
              </div>
              <div style={{ fontSize: 12, color: '#059669', marginTop: 4 }}>
                {h.new_comment}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete */}
      <button className="btn btn-outline-danger w-100"
        onClick={() => onDelete(c.id)}>
        🗑 Delete Comment
      </button>
    </div>
  )
}

export default AdminComments