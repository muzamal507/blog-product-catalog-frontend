import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import productService from '../../../services/productService'

function ProductTrash() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [restoring, setRestoring] = useState(null)
  const [deleting, setDeleting]   = useState(null)

  const fetchTrash = () => {
    setLoading(true)
    productService.trashedList()
      .then(res => setProducts(res.data.data?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTrash() }, [])

  const handleRestore = async (id) => {
    setRestoring(id)
    try { await productService.restore(id); fetchTrash() }
    catch (_) {} finally { setRestoring(null) }
  }

  const handleForce = async (id) => {
    if (!window.confirm('Permanently delete? Cannot be undone.')) return
    setDeleting(id)
    try { await productService.forceDelete(id); fetchTrash() }
    catch (_) {} finally { setDeleting(null) }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Product Trash</h4>
          <small className="text-muted">Restore or permanently delete products</small>
        </div>
        <Link to="/admin/products" className="btn btn-outline-secondary btn-sm">← Back</Link>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: 14 }}>
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Deleted At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-5">
                  <div className="spinner-border" style={{ color: '#00b894' }} />
                </td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-5 text-muted">
                  <div style={{ fontSize: 40 }}>🗑️</div>
                  <p className="mt-2">Trash is empty.</p>
                </td></tr>
              ) : products.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      {p.main_image && (
                        <img src={p.main_image} alt={p.name}
                          className="rounded-2" style={{ width: 36, height: 36, objectFit: 'cover' }} />
                      )}
                      <span className="fw-semibold">{p.name}</span>
                    </div>
                  </td>
                  <td><code style={{ fontSize: 12 }}>{p.sku}</code></td>
                  <td>{p.category || '—'}</td>
                  <td>{p.brand || '—'}</td>
                  <td className="text-muted" style={{ fontSize: 12 }}>{p.deleted_at}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-success"
                        disabled={restoring === p.id}
                        onClick={() => handleRestore(p.id)}>
                        {restoring === p.id ? <span className="spinner-border spinner-border-sm" /> : '♻️ Restore'}
                      </button>
                      <button className="btn btn-sm btn-outline-danger"
                        disabled={deleting === p.id}
                        onClick={() => handleForce(p.id)}>
                        {deleting === p.id ? <span className="spinner-border spinner-border-sm" /> : '🗑 Delete Forever'}
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

export default ProductTrash