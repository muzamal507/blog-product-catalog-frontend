import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import brandService from '../../../services/brandService'

function AdminBrands() {
  const [brands, setBrands]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [status, setStatus]       = useState('')
  const [page, setPage]           = useState(1)
  const [meta, setMeta]           = useState(null)
  const [deleteId, setDeleteId]   = useState(null)
  const [deleting, setDeleting]   = useState(false)
  const [toggling, setToggling]   = useState(null)

  const fetchBrands = useCallback(() => {
    setLoading(true)
    brandService.adminList({ search, status, page, per_page: 10 })
      .then(res => {
        const d = res.data
        setBrands(d.data?.data || d.data || [])
        setMeta(d.data?.meta || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, status, page])

  useEffect(() => { fetchBrands() }, [fetchBrands])

  // Debounce search
  useEffect(() => {
    setPage(1)
  }, [search, status])

  const handleToggleStatus = async (id) => {
    setToggling(id)
    try {
      await brandService.changeStatus(id)
      fetchBrands()
    } catch (_) {}
    finally { setToggling(null) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await brandService.destroy(deleteId)
      setDeleteId(null)
      fetchBrands()
    } catch (err) {
      alert(err.response?.data?.message || 'Cannot delete brand.')
    } finally { setDeleting(false) }
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Brands</h4>
          <small className="text-muted">Manage product brands</small>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/brands/trash"
            className="btn btn-outline-secondary btn-sm">
            🗑 Trash
          </Link>
          <Link to="/admin/brands/add"
            className="btn text-white fw-semibold px-3"
            style={{ background: '#00b894', borderRadius: 8 }}>
            + Add Brand
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 12 }}>
        <div className="p-3 d-flex flex-wrap gap-2">
          <div className="input-group" style={{ maxWidth: 280 }}>
            <span className="input-group-text bg-light border-end-0">🔍</span>
            <input type="text" className="form-control border-start-0 bg-light"
              placeholder="Search brands..."
              value={search}
              onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ maxWidth: 160 }}
            value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {(search || status) && (
            <button className="btn btn-outline-secondary btn-sm"
              onClick={() => { setSearch(''); setStatus('') }}>
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
                <th>Brand</th>
                <th>Website</th>
                <th>Products</th>
                <th>Featured</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-5">
                    <div className="spinner-border" style={{ color: '#00b894' }} />
                  </td>
                </tr>
              ) : brands.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-muted">
                    <div style={{ fontSize: 40 }}>📦</div>
                    <p className="mt-2">No brands found.</p>
                  </td>
                </tr>
              ) : brands.map((brand, i) => (
                <tr key={brand.id}>
                  <td className="text-muted" style={{ fontSize: 12 }}>
                    {((page - 1) * 10) + i + 1}
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      {/* Logo */}
                      <div style={{
                        width: 44, height: 44, borderRadius: 8, overflow: 'hidden',
                        background: '#f3f4f6', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {brand.image_url
                          ? <img src={brand.image_url} alt={brand.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <span style={{ fontSize: 18 }}>🏷️</span>
                        }
                      </div>
                      <div>
                        <div className="fw-semibold">{brand.name}</div>
                        <small className="text-muted">{brand.slug}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    {brand.website
                      ? <a href={brand.website} target="_blank" rel="noreferrer"
                          className="text-primary" style={{ fontSize: 13 }}>
                          🔗 Visit
                        </a>
                      : <span className="text-muted">—</span>
                    }
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border">
                      {brand.active_products_count ?? brand.products_count ?? 0}
                    </span>
                  </td>
                  <td>
                    {brand.is_featured
                      ? <span className="badge" style={{ background: '#fef9c3', color: '#854d0e' }}>⭐ Yes</span>
                      : <span className="text-muted">—</span>
                    }
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="form-check form-switch mb-0">
                        <input className="form-check-input" type="checkbox"
                          checked={brand.status === 'Active'}
                          disabled={toggling === brand.id}
                          onChange={() => handleToggleStatus(brand.id)}
                          style={{ cursor: 'pointer' }} />
                      </div>
                      <span className={`badge ${brand.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}
                        style={{ fontSize: 11 }}>
                        {brand.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Link to={`/admin/brands/edit/${brand.id}`}
                        className="btn btn-sm btn-outline-primary" title="Edit">
                        ✏️
                      </Link>
                      <button className="btn btn-sm btn-outline-danger"
                        title="Delete"
                        onClick={() => setDeleteId(brand.id)}>
                        🗑
                      </button>
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
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}>‹</button>
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
                disabled={page === meta.last_page}
                onClick={() => setPage(p => p + 1)}>›</button>
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
                <div style={{ fontSize: 52 }}>🗑️</div>
                <h5 className="fw-bold mt-3 mb-2">Delete this brand?</h5>
                <p className="text-muted mb-4">
                  Brands with products cannot be deleted. This action moves it to trash.
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <button className="btn btn-light px-4"
                    onClick={() => setDeleteId(null)}>Cancel</button>
                  <button className="btn btn-danger px-4"
                    disabled={deleting}
                    onClick={handleDelete}>
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

export default AdminBrands