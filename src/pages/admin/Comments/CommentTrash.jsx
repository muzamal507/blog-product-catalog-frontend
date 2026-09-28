import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import commentService from '../../../services/commentService'

function CommentTrash() {
  const [comments, setComments]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [restoring, setRestoring] = useState(null)
  const [deleting, setDeleting]   = useState(null)

  const fetchTrash = () => {
    setLoading(true)
    commentService.trashedList()
      .then(res => setComments(res.data.data?.data || res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTrash() }, [])

  const handleRestore = async (id) => {
    setRestoring(id)
    try { await commentService.restore(id); fetchTrash() }
    catch (_) {} finally { setRestoring(null) }
  }

  const handleForce = async (id) => {
    if (!window.confirm('Permanently delete? Replies will also be deleted.')) return
    setDeleting(id)
    try { await commentService.forceDelete(id); fetchTrash() }
    catch (_) {} finally { setDeleting(null) }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Comment Trash</h4>
          <small className="text-muted">Restore or permanently delete comments</small>
        </div>
        <Link to="/admin/comments" className="btn btn-outline-secondary btn-sm">← Back</Link>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: 14 }}>
            <thead className="table-light">
              <tr>
                <th>Author</th>
                <th>Comment</th>
                <th>Post</th>
                <th>Deleted At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-5">
                  <div className="spinner-border" style={{ color: '#00b894' }} />
                </td></tr>
              ) : comments.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-5 text-muted">
                  <div style={{ fontSize: 40 }}>🗑️</div>
                  <p className="mt-2">Trash is empty.</p>
                </td></tr>
              ) : comments.map(c => (
                <tr key={c.id}>
                  <td>
                    <div className="fw-semibold" style={{ fontSize: 13 }}>
                      {c.user?.name || c.guest_name || 'Guest'}
                    </div>
                    <small className="text-muted">
                      {c.user?.email || c.guest_email || '—'}
                    </small>
                  </td>
                  <td>
                    <div className="text-muted text-truncate" style={{ maxWidth: 200, fontSize: 13 }}>
                      {c.comment}
                    </div>
                  </td>
                  <td className="text-muted" style={{ fontSize: 12 }}>
                    {c.post?.title || '—'}
                  </td>
                  <td className="text-muted" style={{ fontSize: 12 }}>
                    {new Date(c.deleted_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-success"
                        disabled={restoring === c.id}
                        onClick={() => handleRestore(c.id)}>
                        {restoring === c.id
                          ? <span className="spinner-border spinner-border-sm" />
                          : '♻️ Restore'}
                      </button>
                      <button className="btn btn-sm btn-outline-danger"
                        disabled={deleting === c.id}
                        onClick={() => handleForce(c.id)}>
                        {deleting === c.id
                          ? <span className="spinner-border spinner-border-sm" />
                          : '🗑 Delete Forever'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CommentTrash