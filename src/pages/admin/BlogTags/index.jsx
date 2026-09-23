import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import blogTagService from '../../../services/blog/tagService'

function AdminBlogTags() {
  const [tags, setTags]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [status, setStatus]     = useState('')
  const [page, setPage]         = useState(1)
  const [meta, setMeta]         = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [toggling, setToggling] = useState(null)

  // Inline add
  const [showAdd, setShowAdd]   = useState(false)
  const [newTag, setNewTag]     = useState({ name: '', status: 'Active' })
  const [adding, setAdding]     = useState(false)
  const [addError, setAddError] = useState('')

  const fetchTags = useCallback(() => {
    setLoading(true)
    blogTagService.getAll({ search, status, page, per_page: 15 })
      .then(res => {
        setTags(res.data.data?.data || res.data.data || [])
        setMeta(res.data.data?.meta || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, status, page])

  useEffect(() => { fetchTags() }, [fetchTags])
  useEffect(() => { setPage(1) }, [search, status])

  const handleToggle = async (id) => {
    setToggling(id)
    try { await blogTagService.changeStatus(id); fetchTags() }
    catch (_) {} finally { setToggling(null) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await blogTagService.destroy(deleteId)
      setDeleteId(null); fetchTags()
    } catch (err) {
      alert(err.response?.data?.message || 'Cannot delete.')
    } finally { setDeleting(false) }
  }

  const handleQuickAdd = async (e) => {
    e.preventDefault()
    if (!newTag.name.trim()) { setAddError('Name is required'); return }
    setAdding(true)
    setAddError('')
    try {
      await blogTagService.store(newTag)
      setNewTag({ name: '', status: 'Active' })
      setShowAdd(false)
      fetchTags()
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to create tag.')
    } finally { setAdding(false) }
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Blog Tags</h4>
          <small className="text-muted">Manage blog post tags</small>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/blog-tags/trash" className="btn btn-outline-secondary btn-sm">
            🗑 Trash
          </Link>
          <button
            className="btn text-white fw-semibold px-3"
            style={{ background: '#00b894', borderRadius: 8 }}
            onClick={() => setShowAdd(!showAdd)}>
            {showAdd ? '✕ Cancel' : '+ Add Tag'}
          </button>
        </div>
      </div>

      {/* Quick Add */}
      {showAdd && (
        <div className="card border-0 shadow-sm p-4 mb-4"
          style={{ borderRadius: 12, borderLeft: '3px solid #00b894' }}>
          <h6 className="fw-bold mb-3">Quick Add Tag</h6>
          <form onSubmit={handleQuickAdd}>
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-5">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                  Tag Name <span className="text-danger">*</span>
                </label>
                <input type="text" className={`form-control ${addError ? 'is-invalid' : ''}`}
                  placeholder="e.g. Watches, Mechanical Keyboards..."
                  value={newTag.name}
                  onChange={e => { setNewTag(p => ({ ...p, name: e.target.value })); setAddError('') }} />
                {addError && <div className="invalid-feedback d-block">{addError}</div>}
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Status</label>
                <select className="form-select"
                  value={newTag.status}
                  onChange={e => setNewTag(p => ({ ...p, status: e.target.value }))}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="col-12 col-md-4">
                <button type="submit" className="btn text-white fw-semibold w-100"
                  style={{ background: '#00b894', borderRadius: 8 }}
                  disabled={adding}>
                  {adding
                    ? <><span className="spinner-border spinner-border-sm me-2" />Creating...</>
                    : '🏷️ Create Tag'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4 p-3" style={{ borderRadius: 12 }}>
        <div className="d-flex flex-wrap gap-2">
          <div className="input-group" style={{ maxWidth: 280 }}>
            <span className="input-group-text bg-light border-end-0">🔍</span>
            <input type="text" className="form-control border-start-0 bg-light"
              placeholder="Search tags..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ maxWidth: 160 }}
            value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Active">✅ Active</option>
            <option value="Inactive">⛔ Inactive</option>
          </select>
          {(search || status) && (
            <button className="btn btn-outline-secondary btn-sm"
              onClick={() => { setSearch(''); setStatus('') }}>✕ Clear</button>
          )}
        </div>
      </div>

      {/* Tags Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: '#00b894' }} />
        </div>
      ) : tags.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <div style={{ fontSize: 40 }}>🏷️</div>
          <p className="mt-2">No tags found.</p>
        </div>
      ) : (
        <>
          <div className="row g-3 mb-4">
            {tags.map(tag => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={tag.id}>
                <div className="card border-0 shadow-sm p-3 h-100"
                  style={{ borderRadius: 12,
                    borderLeft: tag.status === 'Active'
                      ? '3px solid #00b894' : '3px solid #e5e7eb' }}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className="badge px-3 py-2"
                        style={{ background: '#00b89415', color: '#00b894', fontSize: 13 }}>
                        # {tag.name}
                      </span>
                    </div>
                    <div className="form-check form-switch mb-0">
                      <input className="form-check-input" type="checkbox"
                        checked={tag.status === 'Active'}
                        disabled={toggling === tag.id}
                        onChange={() => handleToggle(tag.id)}
                        style={{ cursor: 'pointer' }} />
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between mt-2">
                    <div>
                      <small className="text-muted" style={{ fontSize: 11 }}>
                        {tag.posts_count ?? 0} posts
                      </small>
                      <code className="d-block text-muted" style={{ fontSize: 10 }}>
                        {tag.slug}
                      </code>
                    </div>
                    <div className="d-flex gap-1">
                      <Link to={`/admin/blog-tags/edit/${tag.id}`}
                        className="btn btn-sm btn-outline-primary p-1">✏️</Link>
                      <button className="btn btn-sm btn-outline-danger p-1"
                        onClick={() => setDeleteId(tag.id)}>🗑</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="d-flex justify-content-between align-items-center">
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
                      {idx > 0 && arr[idx-1] !== p-1 && <span className="btn btn-sm disabled">…</span>}
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
        </>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,.5)', zIndex: 9999 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0" style={{ borderRadius: 12 }}>
              <div className="modal-body text-center p-5">
                <div style={{ fontSize: 52 }}>🏷️</div>
                <h5 className="fw-bold mt-3 mb-2">Delete this tag?</h5>
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

export default AdminBlogTags