import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import testimonialService from '../../../services/testimonialService'

function TestimonialTrash() {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [restoring, setRestoring] = useState(null)
  const [deleting, setDeleting]   = useState(null)

  const fetchTrash = () => {
    setLoading(true)
    testimonialService.trashedList()
      .then(res => setItems(res.data.data?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTrash() }, [])

  const handleRestore = async (id) => {
    setRestoring(id)
    try { await testimonialService.restore(id); fetchTrash() }
    catch (_) {} finally { setRestoring(null) }
  }

  const handleForce = async (id) => {
    if (!window.confirm('Permanently delete? This cannot be undone.')) return
    setDeleting(id)
    try { await testimonialService.forceDelete(id); fetchTrash() }
    catch (_) {} finally { setDeleting(null) }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Testimonial Trash</h4>
          <small className="text-muted">Restore or permanently delete testimonials</small>
        </div>
        <Link to="/admin/testimonials" className="btn btn-outline-secondary btn-sm">
          ← Back
        </Link>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: 14 }}>
            <thead className="table-light">
              <tr>
                <th>Customer</th>
                <th>Rating</th>
                <th>Message</th>
                <th>Deleted At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-5">
                  <div className="spinner-border" style={{ color: '#00b894' }} />
                </td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-5 text-muted">
                  <div style={{ fontSize: 40 }}>🗑️</div>
                  <p className="mt-2">Trash is empty.</p>
                </td></tr>
              ) : items.map(t => (
                <tr key={t.id}>
                  <td>
                    <div className="fw-semibold">{t.name}</div>
                    <small className="text-muted">
                      {[t.designation, t.company].filter(Boolean).join(', ')}
                    </small>
                  </td>
                  <td>
                    <span style={{ color: '#f59e0b', fontSize: 14 }}>
                      {'★'.repeat(t.rating)}
                    </span>
                  </td>
                  <td>
                    <span className="text-muted" style={{ fontSize: 13 }}>
                      {t.message?.slice(0, 60)}...
                    </span>
                  </td>
                  <td className="text-muted" style={{ fontSize: 12 }}>
                    {new Date(t.deleted_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-success"
                        disabled={restoring === t.id}
                        onClick={() => handleRestore(t.id)}>
                        {restoring === t.id
                          ? <span className="spinner-border spinner-border-sm" />
                          : '♻️ Restore'}
                      </button>
                      <button className="btn btn-sm btn-outline-danger"
                        disabled={deleting === t.id}
                        onClick={() => handleForce(t.id)}>
                        {deleting === t.id
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

export default TestimonialTrash