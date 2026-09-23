import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import sliderService from '../../../services/sliderService'

function AdminSliders() {
  const [sliders, setSliders]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [toggling, setToggling] = useState(null)

  const fetchSliders = () => {
    setLoading(true)
    sliderService.getAll()
      .then(res => setSliders(res.data.data?.data || res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchSliders() }, [])

  const handleToggle = async (id) => {
    setToggling(id)
    try { await sliderService.changeStatus(id); fetchSliders() }
    catch (_) {} finally { setToggling(null) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try { await sliderService.destroy(deleteId); setDeleteId(null); fetchSliders() }
    catch (_) {} finally { setDeleting(false) }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Hero Sliders</h4>
          <small className="text-muted">Manage homepage hero slider</small>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/sliders/trash" className="btn btn-outline-secondary btn-sm">
            🗑 Trash
          </Link>
          <Link to="/admin/sliders/add"
            className="btn text-white fw-semibold px-3"
            style={{ background: '#00b894', borderRadius: 8 }}>
            + Add Slide
          </Link>
        </div>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: 14 }}>
            <thead className="table-light">
              <tr>
                <th>Order</th>
                <th>Slide</th>
                <th>Button</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-5">
                  <div className="spinner-border" style={{ color: '#00b894' }} />
                </td></tr>
              ) : sliders.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-5 text-muted">
                  <div style={{ fontSize: 40 }}>🖼️</div>
                  <p className="mt-2">No sliders yet. Add your first slide!</p>
                </td></tr>
              ) : sliders.map(slider => (
                <tr key={slider.id}>
                  <td>
                    <span className="badge bg-light text-dark border">
                      #{slider.sort_order}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <div style={{
                        width: 72, height: 48, borderRadius: 6,
                        overflow: 'hidden', background: '#f3f4f6', flexShrink: 0
                      }}>
                        {slider.image ? (
                          <img src={slider.image} alt={slider.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div className="w-100 h-100 d-flex align-items-center justify-content-center"
                            style={{ background: 'linear-gradient(135deg,#0d1b2a,#1a2d40)' }}>
                            <span style={{ color: '#fff', fontSize: 18 }}>🖼</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="fw-semibold" style={{ fontSize: 14 }}>
                          {slider.title}
                        </div>
                        {slider.subtitle && (
                          <small className="text-muted">{slider.subtitle}</small>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    {slider.button_text ? (
                      <div>
                        <div className="fw-semibold" style={{ fontSize: 13 }}>
                          {slider.button_text}
                        </div>
                        <small className="text-muted">{slider.button_url}</small>
                      </div>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="form-check form-switch mb-0">
                        <input className="form-check-input" type="checkbox"
                          checked={slider.status === 'Active'}
                          disabled={toggling === slider.id}
                          onChange={() => handleToggle(slider.id)}
                          style={{ cursor: 'pointer' }} />
                      </div>
                      <span className={`badge ${slider.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}
                        style={{ fontSize: 11 }}>
                        {slider.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Link to={`/admin/sliders/edit/${slider.id}`}
                        className="btn btn-sm btn-outline-primary">✏️</Link>
                      <button className="btn btn-sm btn-outline-danger"
                        onClick={() => setDeleteId(slider.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {deleteId && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,.5)', zIndex: 9999 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0" style={{ borderRadius: 12 }}>
              <div className="modal-body text-center p-5">
                <div style={{ fontSize: 52 }}>🖼️</div>
                <h5 className="fw-bold mt-3 mb-2">Delete this slide?</h5>
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

export default AdminSliders