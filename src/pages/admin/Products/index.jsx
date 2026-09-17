import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import productService from '../../../services/productService'

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [status, setStatus]     = useState('')
  const [page, setPage]         = useState(1)
  const [meta, setMeta]         = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [toggling, setToggling] = useState(null)

  const fetchProducts = useCallback(() => {
    setLoading(true)
    productService.adminList({ search, status, page, per_page: 12 })
      .then(res => {
        setProducts(res.data.data?.data || [])
        setMeta(res.data.data?.meta || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, status, page])

  useEffect(() => { fetchProducts() }, [fetchProducts])
  useEffect(() => { setPage(1) }, [search, status])

  const handleStatus = async (id) => {
    setToggling(id)
    try { await productService.changeStatus(id); fetchProducts() }
    catch (_) {} finally { setToggling(null) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await productService.destroy(deleteId)
      setDeleteId(null); fetchProducts()
    } catch (err) {
      alert(err.response?.data?.message || 'Cannot delete.')
    } finally { setDeleting(false) }
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Products</h4>
          <small className="text-muted">Manage your product catalog</small>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/products/trash" className="btn btn-outline-secondary btn-sm">🗑 Trash</Link>
          <Link to="/admin/products/add"
            className="btn text-white fw-semibold px-3"
            style={{ background: '#00b894', borderRadius: 8 }}>
            + Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4 p-3" style={{ borderRadius: 12 }}>
        <div className="d-flex flex-wrap gap-2">
          <div className="input-group" style={{ maxWidth: 280 }}>
            <span className="input-group-text bg-light border-end-0">🔍</span>
            <input type="text" className="form-control border-start-0 bg-light"
              placeholder="Search name, SKU..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ maxWidth: 150 }}
            value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
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
                <th>#</th>
                <th>Product</th>
                <th>SKU</th>
                <th>Category / Brand</th>
                <th>Price</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-5">
                  <div className="spinner-border" style={{ color: '#00b894' }} />
                </td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-5 text-muted">
                  <div style={{ fontSize: 40 }}>📦</div>
                  <p className="mt-2">No products found.</p>
                </td></tr>
              ) : products.map((p, i) => (
                <tr key={p.id}>
                  <td className="text-muted" style={{ fontSize: 12 }}>
                    {((page - 1) * 12) + i + 1}
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <div style={{
                        width: 48, height: 48, borderRadius: 8,
                        overflow: 'hidden', background: '#f3f4f6', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {p.main_image
                          ? <img src={p.main_image} alt={p.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <span style={{ fontSize: 22 }}>📦</span>
                        }
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div className="fw-semibold text-truncate" style={{ maxWidth: 200 }}>
                          {p.name}
                          {p.model_number}
                        </div>
                        <div className="d-flex gap-1 mt-1 flex-wrap">
                          {p.is_featured   && <span className="badge" style={{ background: '#fef9c3', color: '#854d0e', fontSize: 10 }}>⭐</span>}
                          {p.is_new        && <span className="badge" style={{ background: '#dbeafe', color: '#1d4ed8', fontSize: 10 }}>🆕</span>}
                          {p.is_bestseller && <span className="badge" style={{ background: '#fce7f3', color: '#be185d', fontSize: 10 }}>🔥</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td><code style={{ fontSize: 12 }}>{p.sku}</code></td>
                  <td>
                    <div style={{ fontSize: 13 }}>
                      {p.category?.name && <span className="badge" style={{ background: '#00b89420', color: '#00b894', fontSize: 11 }}>{p.category.name}</span>}
                      {p.brand?.name && <div className="text-muted mt-1" style={{ fontSize: 12 }}>{p.brand.name}</div>}
                    </div>
                  </td>
                  <td>
                    <div className="fw-bold">${p.price}</div>
                    {p.is_on_sale && (
                      <small className="text-muted text-decoration-line-through">${p.compare_price}</small>
                    )}
                  </td>
                  <td>
                    {p.has_variants
                      ? <span className="badge bg-primary" style={{ fontSize: 11 }}>Variants ({p.variants_count})</span>
                      : <span className="badge bg-light text-dark border" style={{ fontSize: 11 }}>Simple</span>
                    }
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="form-check form-switch mb-0">
                        <input className="form-check-input" type="checkbox"
                          checked={p.status === 'Active'}
                          disabled={toggling === p.id}
                          onChange={() => handleStatus(p.id)}
                          style={{ cursor: 'pointer' }} />
                      </div>
                      <span className={`badge ${p.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}
                        style={{ fontSize: 11 }}>{p.status}</span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Link to={`/admin/products/edit/${p.id}`}
                        className="btn btn-sm btn-outline-primary">✏️</Link>
                      <button className="btn btn-sm btn-outline-danger"
                        onClick={() => setDeleteId(p.id)}>🗑</button>
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
              {Array.from({ length: meta.last_page }, (_, i) => i + 1)
                .filter(p => p === 1 || p === meta.last_page || Math.abs(p - page) <= 1)
                .map((p, idx, arr) => (
                  <React.Fragment key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && <span className="btn btn-sm disabled">…</span>}
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

      {deleteId && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,.5)', zIndex: 9999 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0" style={{ borderRadius: 12 }}>
              <div className="modal-body text-center p-5">
                <div style={{ fontSize: 52 }}>📦</div>
                <h5 className="fw-bold mt-3 mb-2">Delete this product?</h5>
                <p className="text-muted mb-4">Products with active orders cannot be deleted.</p>
                <div className="d-flex gap-3 justify-content-center">
                  <button className="btn btn-light px-4" onClick={() => setDeleteId(null)}>Cancel</button>
                  <button className="btn btn-danger px-4" disabled={deleting} onClick={handleDelete}>
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

export default AdminProducts