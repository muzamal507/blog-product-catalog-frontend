import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import attributeService from '../../../services/attributeService'

function AttributeTrash() {
  const [attributes, setAttributes] = useState([])
  const [loading, setLoading]       = useState(true)
  const [restoring, setRestoring]   = useState(null)
  const [deleting, setDeleting]     = useState(null)

  const fetchTrash = () => {
    setLoading(true)
    attributeService.trashedList()
      .then(res => setAttributes(res.data.data?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTrash() }, [])

  const handleRestore = async (id) => {
    setRestoring(id)
    try { await attributeService.restore(id); fetchTrash() }
    catch (_) {} finally { setRestoring(null) }
  }

  const handleForce = async (id) => {
    if (!window.confirm('Permanently delete? This cannot be undone.')) return
    setDeleting(id)
    try { await attributeService.forceDelete(id); fetchTrash() }
    catch (_) {} finally { setDeleting(null) }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Attribute Trash</h4>
          <small className="text-muted">Restore or permanently delete attributes</small>
        </div>
        <Link to="/admin/attributes" className="btn btn-outline-secondary btn-sm">
          ← Back to Attributes
        </Link>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: 14 }}>
            <thead className="table-light">
              <tr>
                <th>Attribute</th>
                <th>Type</th>
                <th>Values</th>
                <th>Deleted At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-5">
                  <div className="spinner-border" style={{ color: '#00b894' }} />
                </td></tr>
              ) : attributes.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-5 text-muted">
                  <div style={{ fontSize: 40 }}>🗑️</div>
                  <p className="mt-2">Trash is empty.</p>
                </td></tr>
              ) : attributes.map(attr => (
                <tr key={attr.id}>
                  <td>
                    <div className="fw-semibold">{attr.name}</div>
                    <small className="text-muted">{attr.slug}</small>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border">{attr.type}</span>
                  </td>
                  <td>
                    <span className="badge" style={{ background: '#e5e7eb', color: '#374151' }}>
                      {attr.values_count ?? 0} values
                    </span>
                  </td>
                  <td className="text-muted" style={{ fontSize: 12 }}>
                    {new Date(attr.deleted_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-success"
                        disabled={restoring === attr.id}
                        onClick={() => handleRestore(attr.id)}>
                        {restoring === attr.id
                          ? <span className="spinner-border spinner-border-sm" />
                          : '♻️ Restore'}
                      </button>
                      <button className="btn btn-sm btn-outline-danger"
                        disabled={deleting === attr.id}
                        onClick={() => handleForce(attr.id)}>
                        {deleting === attr.id
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

export default AttributeTrash