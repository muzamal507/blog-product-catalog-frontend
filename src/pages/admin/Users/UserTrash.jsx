import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import userService from '../../../services/userService'

function UserTrash() {
  const [users, setUsers]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [restoring, setRestoring] = useState(null)
  const [deleting, setDeleting]   = useState(null)

  const fetchTrash = () => {
    setLoading(true)
    userService.trashedList()
      .then(res => setUsers(res.data.data?.data || res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTrash() }, [])

  const handleRestore = async (id) => {
    setRestoring(id)
    try { await userService.restore(id); fetchTrash() }
    catch (_) {} finally { setRestoring(null) }
  }

  const handleForce = async (id) => {
    if (!window.confirm('Permanently delete this user? Cannot be undone.')) return
    setDeleting(id)
    try { await userService.forceDelete(id); fetchTrash() }
    catch (_) {} finally { setDeleting(null) }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">User Trash</h4>
          <small className="text-muted">Restore or permanently delete users</small>
        </div>
        <Link to="/admin/users" className="btn btn-outline-secondary btn-sm">← Back</Link>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: 14 }}>
            <thead className="table-light">
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Deleted At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-5">
                  <div className="spinner-border" style={{ color: '#00b894' }} />
                </td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-5 text-muted">
                  <div style={{ fontSize: 40 }}>🗑️</div>
                  <p className="mt-2">Trash is empty.</p>
                </td></tr>
              ) : users.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: '#00b894', color: '#fff', flexShrink: 0,
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontWeight: 700, fontSize: 15
                      }}>
                        {user.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <div className="fw-semibold">{user.name}</div>
                        <small className="text-muted">{user.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border" style={{ fontSize: 12 }}>
                      {user.roles?.[0]?.name || 'User'}
                    </span>
                  </td>
                  <td className="text-muted">{user.phone || '—'}</td>
                  <td className="text-muted" style={{ fontSize: 12 }}>
                    {new Date(user.deleted_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-success"
                        disabled={restoring === user.id}
                        onClick={() => handleRestore(user.id)}>
                        {restoring === user.id
                          ? <span className="spinner-border spinner-border-sm" />
                          : '♻️ Restore'}
                      </button>
                      <button className="btn btn-sm btn-outline-danger"
                        disabled={deleting === user.id}
                        onClick={() => handleForce(user.id)}>
                        {deleting === user.id
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

export default UserTrash