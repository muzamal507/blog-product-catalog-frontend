import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import menuService from '../../../services/menuService'

function MenuTrash() {
  const [items, setItems]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [restoring, setRestoring] = useState(null)
  const [deleting, setDeleting]   = useState(null)

  const fetchTrash = () => {
    setLoading(true)
    menuService.trashedList()
      .then(res => setItems(res.data.menu || res.data.data?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTrash() }, [])

  const handleRestore = async (id) => {
    setRestoring(id)
    try { await menuService.restore(id); fetchTrash() }
    catch (_) {} finally { setRestoring(null) }
  }

  const handleForce = async (id) => {
    if (!window.confirm('Permanently delete? Cannot be undone.')) return
    setDeleting(id)
    try { await menuService.forceDelete(id); fetchTrash() }
    catch (_) {} finally { setDeleting(null) }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Menu Trash</h4>
          <small className="text-muted">Restore or permanently delete menus</small>
        </div>
        <Link to="/admin/menus" className="btn btn-outline-secondary btn-sm">← Back</Link>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: 14 }}>
            <thead className="table-light">
              <tr>
                <th>Menu Name</th>
                <th>Location</th>
                <th>Items</th>
                <th>Deleted At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-5">
                  <div className="spinner-border" style={{ color: '#00b894' }} />
                </td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-5 text-muted">
                  <div style={{ fontSize: 40 }}>🗑️</div>
                  <p className="mt-2">Trash is empty.</p>
                </td></tr>
              ) : items.map(menu => (
                <tr key={menu.id}>
                  <td><div className="fw-semibold">{menu.name}</div></td>
                  <td>
                    <span className="badge bg-light text-dark border" style={{ fontSize: 12 }}>
                      {menu.location}
                    </span>
                  </td>
                  <td>{menu.items?.length || 0} items</td>
                  <td className="text-muted" style={{ fontSize: 12 }}>
                    {new Date(menu.deleted_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-success"
                        disabled={restoring === menu.id}
                        onClick={() => handleRestore(menu.id)}>
                        {restoring === menu.id
                          ? <span className="spinner-border spinner-border-sm" />
                          : '♻️ Restore'}
                      </button>
                      <button className="btn btn-sm btn-outline-danger"
                        disabled={deleting === menu.id}
                        onClick={() => handleForce(menu.id)}>
                        {deleting === menu.id
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

export default MenuTrash