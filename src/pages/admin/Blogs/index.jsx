import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import blogPostService from '../../../services/blog/postService'

const STATUS_COLORS = {
  Published: { bg: '#d1fae5', color: '#059669' },
  Draft:     { bg: '#f3f4f6', color: '#374151' },
  Scheduled: { bg: '#dbeafe', color: '#1d4ed8' },
  Archived:  { bg: '#fef9c3', color: '#854d0e' },
}

function AdminBlogs() {
  const [posts, setPosts]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [status, setStatus]     = useState('')
  const [page, setPage]         = useState(1)
  const [meta, setMeta]         = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchPosts = useCallback(() => {
    setLoading(true)
    blogPostService.adminList({ search, status, page, per_page: 10 })
      .then(res => {
        setPosts(res.data.data?.data || res.data.data || [])
        setMeta(res.data.data?.meta || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, status, page])

  useEffect(() => { fetchPosts() }, [fetchPosts])
  useEffect(() => { setPage(1) }, [search, status])

  const handleChangeStatus = async (id, newStatus) => {
    try { await blogPostService.changeStatus(id, newStatus); fetchPosts() }
    catch (_) {}
  }

  const handleDelete = async () => {
    setDeleting(true)
    try { await blogPostService.destroy(deleteId); setDeleteId(null); fetchPosts() }
    catch (_) {} finally { setDeleting(false) }
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Blog Posts</h4>
          <small className="text-muted">{meta?.total ?? 0} total articles</small>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/blogs/trash" className="btn btn-outline-secondary btn-sm">🗑 Trash</Link>
          <Link to="/admin/blogs/add"
            className="btn text-white fw-semibold px-3"
            style={{ background: '#00b894', borderRadius: 8 }}>
            + New Post
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {Object.entries(STATUS_COLORS).map(([s, colors]) => (
          <div className="col-6 col-md-3" key={s}>
            <button
              onClick={() => setStatus(status === s ? '' : s)}
              className="card border-0 shadow-sm p-3 w-100 text-start"
              style={{ borderRadius: 12, border: 'none', cursor: 'pointer',
                background: status === s ? colors.bg : '#fff' }}>
              <div style={{ color: colors.color, fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                {s}
              </div>
              <div className="fw-bold" style={{ fontSize: 20 }}>
                {posts.filter(p => p.status === s).length}
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4 p-3" style={{ borderRadius: 12 }}>
        <div className="d-flex flex-wrap gap-2">
          <div className="input-group" style={{ maxWidth: 280 }}>
            <span className="input-group-text bg-light border-end-0">🔍</span>
            <input type="text" className="form-control border-start-0 bg-light"
              placeholder="Search posts..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ maxWidth: 160 }}
            value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All Status</option>
            {Object.keys(STATUS_COLORS).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
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
                <th>Post</th>
                <th>Category</th>
                <th>Author</th>
                <th>Views</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-5">
                  <div className="spinner-border" style={{ color: '#00b894' }} />
                </td></tr>
              ) : posts.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-5 text-muted">
                  <div style={{ fontSize: 40 }}>✍️</div>
                  <p className="mt-2">No posts found.</p>
                </td></tr>
              ) : posts.map(post => (
                <tr key={post.id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <div style={{
                        width: 56, height: 40, borderRadius: 6, flexShrink: 0,
                        overflow: 'hidden', background: '#f3f4f6'
                      }}>
                        {post.featured_image ? (
                          <img src={post.featured_image} alt={post.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                            <span style={{ fontSize: 18 }}>✍️</span>
                          </div>
                        )}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div className="fw-semibold text-truncate" style={{ maxWidth: 240, fontSize: 14 }}>
                          {post.title}
                        </div>
                        <small className="text-muted">{post.slug}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    {post.category?.name ? (
                      <span className="badge px-2 py-1"
                        style={{ background: '#00b89420', color: '#00b894', fontSize: 11 }}>
                        {post.category.name}
                      </span>
                    ) : <span className="text-muted">—</span>}
                  </td>
                  <td className="text-muted">{post.author?.name || '—'}</td>
                  <td>👁 {post.views || 0}</td>
                  <td>
                    <select className="form-select form-select-sm"
                      style={{ ...STATUS_COLORS[post.status], border: 'none',
                        fontWeight: 600, fontSize: 12, width: 120 }}
                      value={post.status}
                      onChange={e => handleChangeStatus(post.id, e.target.value)}>
                      {Object.keys(STATUS_COLORS).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="text-muted" style={{ fontSize: 12 }}>
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Link to={`/blogs/${post.slug}`} target="_blank"
                        className="btn btn-sm btn-outline-secondary">👁</Link>
                      <Link to={`/admin/blogs/edit/${post.id}`}
                        className="btn btn-sm btn-outline-primary">✏️</Link>
                      <button className="btn btn-sm btn-outline-danger"
                        onClick={() => setDeleteId(post.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {meta && meta.last_page > 1 && (
          <div className="p-3 d-flex justify-content-between align-items-center border-top">
            <small className="text-muted">Showing {meta.from}–{meta.to} of {meta.total}</small>
            <div className="d-flex gap-1">
              <button className="btn btn-sm btn-outline-secondary"
                disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
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
                <div style={{ fontSize: 52 }}>✍️</div>
                <h5 className="fw-bold mt-3 mb-2">Delete this post?</h5>
                <p className="text-muted mb-4">It will be moved to trash.</p>
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

export default AdminBlogs