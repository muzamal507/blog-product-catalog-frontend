import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import menuService from '../../../services/menuService'

const LOCATION_COLORS = {
  Header:  { bg: '#dbeafe', color: '#1d4ed8' },
  Footer:  { bg: '#f3f4f6', color: '#374151' },
  Sidebar: { bg: '#ede9fe', color: '#6d28d9' },
  Mobile:  { bg: '#d1fae5', color: '#059669' },
}

function AdminMenus() {
  const [menus, setMenus]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [status, setStatus]     = useState('')
  const [page, setPage]         = useState(1)
  const [meta, setMeta]         = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [toggling, setToggling] = useState(null)

  const fetchMenus = useCallback(() => {
    setLoading(true)
    menuService.getAll({ search, status, page, per_page: 10 })
      .then(res => {
        setMenus(res.data.data?.data || res.data.data || [])
        setMeta(res.data.data?.meta || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, status, page])

  useEffect(() => { fetchMenus() }, [fetchMenus])
  useEffect(() => { setPage(1) }, [search, status])

  const handleToggle = async (id, currentStatus) => {
    setToggling(id)
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active'
    try { await menuService.changeStatus(id, newStatus); fetchMenus() }
    catch (_) {} finally { setToggling(null) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try { await menuService.destroy(deleteId); setDeleteId(null); fetchMenus() }
    catch (_) {} finally { setDeleting(false) }
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Navigation Menus</h4>
          <small className="text-muted">Manage site navigation menus</small>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/menus/trash" className="btn btn-outline-secondary btn-sm">
            🗑 Trash
          </Link>
          <Link to="/admin/menus/add"
            className="btn text-white fw-semibold px-3"
            style={{ background: '#00b894', borderRadius: 8 }}>
            + Add Menu
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {Object.entries(LOCATION_COLORS).map(([loc, colors]) => (
          <div className="col-6 col-md-3" key={loc}>
            <div className="card border-0 shadow-sm p-3 text-center" style={{ borderRadius: 12 }}>
              <div style={{ color: colors.color, fontSize: 11,
                fontWeight: 700, marginBottom: 4 }}>
                {loc.toUpperCase()}
              </div>
              <div className="fw-bold" style={{ fontSize: 22 }}>
                {menus.filter(m => m.location === loc).length}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4 p-3" style={{ borderRadius: 12 }}>
        <div className="d-flex flex-wrap gap-2">
          <div className="input-group" style={{ maxWidth: 280 }}>
            <span className="input-group-text bg-light border-end-0">🔍</span>
            <input type="text" className="form-control border-start-0 bg-light"
              placeholder="Search menus..."
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

      {/* Table */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: 14 }}>
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Menu Name</th>
                <th>Location</th>
                <th>Items</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-5">
                  <div className="spinner-border" style={{ color: '#00b894' }} />
                </td></tr>
              ) : menus.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-5 text-muted">
                  <div style={{ fontSize: 40 }}>🗺️</div>
                  <p className="mt-2">No menus found.</p>
                </td></tr>
              ) : menus.map((menu, i) => (
                <tr key={menu.id}>
                  <td className="text-muted" style={{ fontSize: 12 }}>
                    {((page - 1) * 10) + i + 1}
                  </td>
                  <td>
                    <div className="fw-semibold">{menu.name}</div>
                  </td>
                  <td>
                    <span className="badge px-2 py-1"
                      style={{
                        background: LOCATION_COLORS[menu.location]?.bg || '#f3f4f6',
                        color: LOCATION_COLORS[menu.location]?.color || '#374151',
                        fontSize: 12
                      }}>
                      {menu.location}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border">
                      {menu.items?.length || 0} items
                    </span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="form-check form-switch mb-0">
                        <input className="form-check-input" type="checkbox"
                          checked={menu.status === 'Active'}
                          disabled={toggling === menu.id}
                          onChange={() => handleToggle(menu.id, menu.status)}
                          style={{ cursor: 'pointer' }} />
                      </div>
                      <span className={`badge ${menu.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}
                        style={{ fontSize: 11 }}>
                        {menu.status}
                      </span>
                    </div>
                  </td>
                  <td className="text-muted" style={{ fontSize: 12 }}>
                    {new Date(menu.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Link to={`/admin/menus/edit/${menu.id}`}
                        className="btn btn-sm btn-outline-primary">✏️</Link>
                      <button className="btn btn-sm btn-outline-danger"
                        onClick={() => setDeleteId(menu.id)}>🗑</button>
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
                    {idx > 0 && arr[idx-1] !== p-1 &&
                      <span className="btn btn-sm disabled">…</span>}
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
                <div style={{ fontSize: 52 }}>🗺️</div>
                <h5 className="fw-bold mt-3 mb-2">Delete this menu?</h5>
                <p className="text-muted mb-4">
                  All menu items will also be deleted.
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

export default AdminMenus