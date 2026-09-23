import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import blogCategoryService from '../../../services/blog/categoryService'

function BlogCategoryTrash() {
  const [items, setItems]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [restoring, setRestoring] = useState(null)
  const [deleting, setDeleting]   = useState(null)

  const fetchTrash = () => {
    setLoading(true)
    blogCategoryService.trashedList()
      .then(res => setItems(res.data.data?.data || res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTrash() }, [])

  const handleRestore = async (id) => {
    setRestoring(id)
    try { await blogCategoryService.restore(id); fetchTrash() }
    catch (_) {} finally { setRestoring(null) }
  }

  const handleForce = async (id) => {
    if (!window.confirm('Permanently delete? Cannot be undone.')) return
    setDeleting(id)
    try { await blogCategoryService.forceDelete(id); fetchTrash() }
    catch (err) {
      alert(err.response?.data?.message || 'Cannot delete.')
    } finally { setDeleting(null) }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Category Trash</h4>
          <small className="text-muted">Restore or permanently delete categories</small>
        </div>
        <Link to="/admin/blog-categories" className="btn btn-outline-secondary btn-sm">← Back</Link>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: 14 }}>
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Deleted At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="text-center py-5">
                  <div className="spinner-border" style={{ color: '#00b894' }} />
                </td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-5 text-muted">
                  <div style={{ fontSize: 40 }}>🗑️</div>
                  <p className="mt-2">Trash is empty.</p>
                </td></tr>
              ) : items.map(cat => (
                <tr key={cat.id}>
                  <td>
                    <div className="fw-semibold">{cat.name}</div>
                    {cat.description && (
                      <small className="text-muted">{cat.description}</small>
                    )}
                  </td>
                  <td><code style={{ fontSize: 12 }}>{cat.slug}</code></td>
                  <td className="text-muted" style={{ fontSize: 12 }}>
                    {new Date(cat.deleted_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-success"
                        disabled={restoring === cat.id}
                        onClick={() => handleRestore(cat.id)}>
                        {restoring === cat.id
                          ? <span className="spinner-border spinner-border-sm" />
                          : '♻️ Restore'}
                      </button>
                      <button className="btn btn-sm btn-outline-danger"
                        disabled={deleting === cat.id}
                        onClick={() => handleForce(cat.id)}>
                        {deleting === cat.id
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

export default BlogCategoryTrash