import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import brandService from '../../../services/brandService'

function BrandTrash() {
  const [brands, setBrands]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [restoring, setRestoring] = useState(null)
  const [deleting, setDeleting]   = useState(null)

  const fetchTrash = () => {
    setLoading(true)
    brandService.trashedList()
      .then(res => setBrands(res.data.data?.data || res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTrash() }, [])

  const handleRestore = async (id) => {
    setRestoring(id)
    try { await brandService.restore(id); fetchTrash() }
    catch (_) {} finally { setRestoring(null) }
  }

  const handleForce = async (id) => {
    if (!window.confirm('Permanently delete? This cannot be undone.')) return
    setDeleting(id)
    try { await brandService.forceDelete(id); fetchTrash() }
    catch (_) {} finally { setDeleting(null) }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Brand Trash</h4>
          <small className="text-muted">Deleted brands — restore or permanently delete</small>
        </div>
        <Link to="/admin/brands" className="btn btn-outline-secondary btn-sm">← Back to Brands</Link>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: 14 }}>
            <thead className="table-light">
              <tr>
                <th>Brand</th>
                <th>Status</th>
                <th>Deleted At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="text-center py-5">
                  <div className="spinner-border" style={{ color: '#00b894' }} />
                </td></tr>
              ) : brands.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-5 text-muted">
                  <div style={{ fontSize: 40 }}>🗑️</div>
                  <p className="mt-2">Trash is empty.</p>
                </td></tr>
              ) : brands.map(brand => (
                <tr key={brand.id}>
                  <td>
                    <div className="fw-semibold">{brand.name}</div>
                    <small className="text-muted">{brand.slug}</small>
                  </td>
                  <td>
                    <span className="badge bg-secondary">{brand.status}</span>
                  </td>
                  <td className="text-muted" style={{ fontSize: 12 }}>
                    {new Date(brand.deleted_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-success"
                        disabled={restoring === brand.id}
                        onClick={() => handleRestore(brand.id)}>
                        {restoring === brand.id
                          ? <span className="spinner-border spinner-border-sm" />
                          : '♻️ Restore'}
                      </button>
                      <button className="btn btn-sm btn-outline-danger"
                        disabled={deleting === brand.id}
                        onClick={() => handleForce(brand.id)}>
                        {deleting === brand.id
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

export default BrandTrash