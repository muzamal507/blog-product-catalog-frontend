import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import attributeService from '../../../services/attributeService'

const TYPE_COLORS = {
  Select: { bg: '#dbeafe', color: '#1d4ed8' },
  Color:  { bg: '#fce7f3', color: '#be185d' },
  Text:   { bg: '#d1fae5', color: '#059669' },
}

function AdminAttributes() {
  const [attributes, setAttributes] = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [page, setPage]             = useState(1)
  const [meta, setMeta]             = useState(null)
  const [deleteId, setDeleteId]     = useState(null)
  const [deleting, setDeleting]     = useState(false)
  const [toggling, setToggling]     = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  const fetchAttributes = useCallback(() => {
    setLoading(true)
    attributeService.adminList({ search, type: typeFilter, page, per_page: 10 })
      .then(res => {
        setAttributes(res.data.data?.data || [])
        setMeta(res.data.data?.meta || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, typeFilter, page])

  useEffect(() => { fetchAttributes() }, [fetchAttributes])
  useEffect(() => { setPage(1) }, [search, typeFilter])

  const handleToggle = async (id) => {
    setToggling(id)
    try { await attributeService.changeStatus(id); fetchAttributes() }
    catch (_) {} finally { setToggling(null) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await attributeService.destroy(deleteId)
      setDeleteId(null)
      fetchAttributes()
    } catch (err) {
      alert(err.response?.data?.message || 'Cannot delete.')
    } finally { setDeleting(false) }
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Attributes</h4>
          <small className="text-muted">Manage product attributes like Size, Color, Material</small>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/attributes/trash" className="btn btn-outline-secondary btn-sm">
            🗑 Trash
          </Link>
          <Link to="/admin/attributes/add"
            className="btn text-white fw-semibold px-3"
            style={{ background: '#00b894', borderRadius: 8 }}>
            + Add Attribute
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4 p-3" style={{ borderRadius: 12 }}>
        <div className="d-flex flex-wrap gap-2">
          <div className="input-group" style={{ maxWidth: 260 }}>
            <span className="input-group-text bg-light border-end-0">🔍</span>
            <input type="text" className="form-control border-start-0 bg-light"
              placeholder="Search attributes..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ maxWidth: 150 }}
            value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">All Types</option>
            <option value="Select">Select</option>
            <option value="Color">Color</option>
            <option value="Text">Text</option>
          </select>
          {(search || typeFilter) && (
            <button className="btn btn-outline-secondary btn-sm"
              onClick={() => { setSearch(''); setTypeFilter('') }}>
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
                <th>Attribute</th>
                <th>Type</th>
                <th>Values</th>
                <th>Filterable</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-5">
                  <div className="spinner-border" style={{ color: '#00b894' }} />
                </td></tr>
              ) : attributes.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-5 text-muted">
                  <div style={{ fontSize: 40 }}>🎨</div>
                  <p className="mt-2">No attributes found.</p>
                </td></tr>
              ) : attributes.map((attr, i) => (
                <React.Fragment key={attr.id}>
                  <tr>
                    <td className="text-muted" style={{ fontSize: 12 }}>
                      {((page - 1) * 10) + i + 1}
                    </td>
                    <td>
                      <div className="fw-semibold">{attr.name}</div>
                      <small className="text-muted">{attr.slug}</small>
                    </td>
                    <td>
                      <span className="badge px-2 py-1"
                        style={{ ...TYPE_COLORS[attr.type], fontSize: 12 }}>
                        {attr.type === 'Color'  && '🎨 '}
                        {attr.type === 'Select' && '📋 '}
                        {attr.type === 'Text'   && '✏️ '}
                        {attr.type}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-light border d-flex align-items-center gap-1"
                        onClick={() => setExpandedId(expandedId === attr.id ? null : attr.id)}>
                        <span className="badge" style={{ background: '#00b894', fontSize: 11 }}>
                          {attr.values_count ?? attr.values?.length ?? 0}
                        </span>
                        <span style={{ fontSize: 12 }}>values</span>
                        <span>{expandedId === attr.id ? '▲' : '▼'}</span>
                      </button>
                    </td>
                    <td>
                      {attr.is_filterable
                        ? <span className="badge bg-success" style={{ fontSize: 11 }}>Yes</span>
                        : <span className="badge bg-light text-muted border" style={{ fontSize: 11 }}>No</span>
                      }
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="form-check form-switch mb-0">
                          <input className="form-check-input" type="checkbox"
                            checked={attr.is_active}
                            disabled={toggling === attr.id}
                            onChange={() => handleToggle(attr.id)}
                            style={{ cursor: 'pointer' }} />
                        </div>
                        <span className={`badge ${attr.is_active ? 'bg-success' : 'bg-secondary'}`}
                          style={{ fontSize: 11 }}>
                          {attr.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Link to={`/admin/attributes/edit/${attr.id}`}
                          className="btn btn-sm btn-outline-primary">✏️</Link>
                        <button className="btn btn-sm btn-outline-danger"
                          onClick={() => setDeleteId(attr.id)}>🗑</button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Values Row */}
                  {expandedId === attr.id && (
                    <tr style={{ background: '#f9fafb' }}>
                      <td colSpan={7} className="px-4 py-3">
                        <div className="d-flex flex-wrap gap-2 align-items-center">
                          <small className="fw-semibold text-muted me-2">Values:</small>
                          {attr.values?.length > 0 ? attr.values.map(v => (
                            <span key={v.id}
                              className="badge d-flex align-items-center gap-1 px-2 py-1"
                              style={{ fontSize: 12, background: '#fff', border: '1px solid #e5e7eb', color: '#374151' }}>
                              {attr.type === 'Color' && v.color_code && (
                                <span style={{
                                  width: 12, height: 12,
                                  borderRadius: '50%',
                                  background: v.color_code,
                                  display: 'inline-block',
                                  border: '1px solid rgba(0,0,0,.15)'
                                }} />
                              )}
                              {v.value}
                            </span>
                          )) : (
                            <small className="text-muted">No values yet</small>
                          )}
                          <Link to={`/admin/attributes/edit/${attr.id}`}
                            className="btn btn-sm btn-outline-secondary ms-2"
                            style={{ fontSize: 11 }}>
                            + Add Values
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
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
                    {idx > 0 && arr[idx - 1] !== p - 1 &&
                      <span className="btn btn-sm disabled">…</span>}
                    <button
                      className={`btn btn-sm ${p === page ? 'text-white' : 'btn-outline-secondary'}`}
                      style={p === page ? { background: '#00b894', border: 'none' } : {}}
                      onClick={() => setPage(p)}>{p}
                    </button>
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
                <div style={{ fontSize: 52 }}>🎨</div>
                <h5 className="fw-bold mt-3 mb-2">Delete this attribute?</h5>
                <p className="text-muted mb-4">
                  Attributes used in product variants cannot be deleted.
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <button className="btn btn-light px-4" onClick={() => setDeleteId(null)}>
                    Cancel
                  </button>
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

export default AdminAttributes