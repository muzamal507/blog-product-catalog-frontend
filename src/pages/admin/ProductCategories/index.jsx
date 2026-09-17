import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import productCategoryService from '../../../services/productCategoryService'

function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [status, setStatus]         = useState('')
  const [parentFilter, setParentFilter] = useState('')
  const [page, setPage]             = useState(1)
  const [meta, setMeta]             = useState(null)
  const [deleteId, setDeleteId]     = useState(null)
  const [deleting, setDeleting]     = useState(false)
  const [toggling, setToggling]     = useState(null)
  const [parents, setParents]       = useState([])

  // Fetch parent categories for filter dropdown
  useEffect(() => {
    productCategoryService.getAll({ all: true, parent_only: true })
      .then(res => setParents(res.data.data?.data || res.data.data || []))
      .catch(() => {})
  }, [])

  const fetchCategories = useCallback(() => {
    setLoading(true)
    productCategoryService.adminList({
      search, status, parent_id: parentFilter, page, per_page: 10
    })
      .then(res => {
        const d = res.data
        setCategories(d.data?.data || d.data || [])
        setMeta(d.data?.meta || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, status, parentFilter, page])

  useEffect(() => { fetchCategories() }, [fetchCategories])
  useEffect(() => { setPage(1) }, [search, status, parentFilter])

  const handleToggle = async (id) => {
    setToggling(id)
    try { await productCategoryService.changeStatus(id); fetchCategories() }
    catch (_) {} finally { setToggling(null) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await productCategoryService.destroy(deleteId)
      setDeleteId(null)
      fetchCategories()
    } catch (err) {
      alert(err.response?.data?.message || 'Cannot delete category.')
    } finally { setDeleting(false) }
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Product Categories</h4>
          <small className="text-muted">Manage product categories and subcategories</small>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/product-categories/trash"
            className="btn btn-outline-secondary btn-sm">🗑 Trash</Link>
          <Link to="/admin/product-categories/add"
            className="btn text-white fw-semibold px-3"
            style={{ background: '#00b894', borderRadius: 8 }}>
            + Add Category
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 12 }}>
        <div className="p-3 d-flex flex-wrap gap-2">
          <div className="input-group" style={{ maxWidth: 260 }}>
            <span className="input-group-text bg-light border-end-0">🔍</span>
            <input type="text" className="form-control border-start-0 bg-light"
              placeholder="Search categories..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ maxWidth: 150 }}
            value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select className="form-select" style={{ maxWidth: 200 }}
            value={parentFilter} onChange={e => setParentFilter(e.target.value)}>
            <option value="">All Categories</option>
            <option value="null">Parent Only</option>
            {parents.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {(search || status || parentFilter) && (
            <button className="btn btn-outline-secondary btn-sm"
              onClick={() => { setSearch(''); setStatus(''); setParentFilter('') }}>
              ✕ Clear
            </button>
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
                <th>Category</th>
                <th>Parent</th>
                <th>Products</th>
                <th>Featured</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-5">
                  <div className="spinner-border" style={{ color: '#00b894' }} />
                </td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-5 text-muted">
                  <div style={{ fontSize: 40 }}>📂</div>
                  <p className="mt-2">No categories found.</p>
                </td></tr>
              ) : categories.map((cat, i) => (
                <tr key={cat.id}>
                  <td className="text-muted" style={{ fontSize: 12 }}>
                    {((page - 1) * 10) + i + 1}
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      {/* Image */}
                      <div style={{
                        width: 40, height: 40, borderRadius: 8,
                        overflow: 'hidden', background: '#f3f4f6',
                        flexShrink: 0, display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                      }}>
                        {cat.image_url
                          ? <img src={cat.image_url} alt={cat.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <span style={{ fontSize: 18 }}>📂</span>
                        }
                      </div>
                      <div>
                        <div className="fw-semibold">{cat.name}</div>
                        <small className="text-muted">{cat.slug}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    {cat.parent
                      ? <span className="badge px-2 py-1"
                          style={{ background: '#f3f4f6', color: '#374151', fontSize: 12 }}>
                          ↳ {cat.parent.name}
                        </span>
                      : <span className="badge px-2 py-1"
                          style={{ background: '#dbeafe', color: '#1d4ed8', fontSize: 12 }}>
                          Root
                        </span>
                    }
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border">
                      {cat.products_count ?? 0}
                    </span>
                  </td>
                  <td>
                    {cat.is_featured
                      ? <span className="badge" style={{ background: '#fef9c3', color: '#854d0e' }}>⭐ Yes</span>
                      : <span className="text-muted">—</span>
                    }
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="form-check form-switch mb-0">
                        <input className="form-check-input" type="checkbox"
                          checked={cat.status === 'Active'}
                          disabled={toggling === cat.id}
                          onChange={() => handleToggle(cat.id)}
                          style={{ cursor: 'pointer' }} />
                      </div>
                      <span className={`badge ${cat.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}
                        style={{ fontSize: 11 }}>
                        {cat.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Link to={`/admin/product-categories/edit/${cat.id}`}
                        className="btn btn-sm btn-outline-primary">✏️</Link>
                      <button className="btn btn-sm btn-outline-danger"
                        onClick={() => setDeleteId(cat.id)}>🗑</button>
                    </div>
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
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="btn btn-sm btn-outline-secondary disabled">…</span>
                    )}
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
                <div style={{ fontSize: 52 }}>📂</div>
                <h5 className="fw-bold mt-3 mb-2">Delete this category?</h5>
                <p className="text-muted mb-4">
                  Categories with subcategories or products cannot be deleted.
                </p>
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

export default AdminCategories