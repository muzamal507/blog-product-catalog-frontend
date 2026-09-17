import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import testimonialService from '../../../services/testimonialService'

const StarRating = ({ rating, size = 14 }) => (
  <span style={{ color: '#f59e0b', fontSize: size }}>
    {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
  </span>
)

function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState('')
  const [status, setStatus]             = useState('')
  const [ratingFilter, setRatingFilter] = useState('')
  const [page, setPage]                 = useState(1)
  const [meta, setMeta]                 = useState(null)
  const [deleteId, setDeleteId]         = useState(null)
  const [deleting, setDeleting]         = useState(false)
  const [toggling, setToggling]         = useState(null)
  const [featuring, setFeaturing]       = useState(null)

  const fetchTestimonials = useCallback(() => {
    setLoading(true)
    testimonialService.adminList({
      search, status, rating: ratingFilter, page, per_page: 10
    })
      .then(res => {
        setTestimonials(res.data.data?.data || [])
        setMeta(res.data.data?.meta || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, status, ratingFilter, page])

  useEffect(() => { fetchTestimonials() }, [fetchTestimonials])
  useEffect(() => { setPage(1) }, [search, status, ratingFilter])

  const handleToggleStatus = async (id) => {
    setToggling(id)
    try { await testimonialService.changeStatus(id); fetchTestimonials() }
    catch (_) {} finally { setToggling(null) }
  }

  const handleToggleFeatured = async (id) => {
    setFeaturing(id)
    try { await testimonialService.toggleFeatured(id); fetchTestimonials() }
    catch (_) {} finally { setFeaturing(null) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await testimonialService.destroy(deleteId)
      setDeleteId(null)
      fetchTestimonials()
    } catch (_) {}
    finally { setDeleting(false) }
  }

  // Stats
  const total    = meta?.total ?? testimonials.length
  const featured = testimonials.filter(t => t.is_featured).length
  const avgRating = testimonials.length
    ? (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)
    : '—'

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Testimonials</h4>
          <small className="text-muted">Manage customer reviews and testimonials</small>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/testimonials/trash"
            className="btn btn-outline-secondary btn-sm">🗑 Trash</Link>
          <Link to="/admin/testimonials/add"
            className="btn text-white fw-semibold px-3"
            style={{ background: '#00b894', borderRadius: 8 }}>
            + Add Testimonial
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { icon: '⭐', label: 'Total Reviews',    value: total,      color: '#00b894' },
          { icon: '🏆', label: 'Featured',         value: featured,   color: '#f59e0b' },
          { icon: '📊', label: 'Avg Rating',       value: avgRating,  color: '#a855f7' },
          { icon: '✅', label: 'Active',
            value: testimonials.filter(t => t.status === 'Active').length,
            color: '#3b82f6' },
        ].map((s, i) => (
          <div className="col-6 col-md-3" key={i}>
            <div className="card border-0 shadow-sm p-3 d-flex flex-row align-items-center gap-3"
              style={{ borderRadius: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: s.color + '20', color: s.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0
              }}>{s.icon}</div>
              <div>
                <div className="text-muted" style={{ fontSize: 12 }}>{s.label}</div>
                <div className="fw-bold" style={{ fontSize: 22 }}>{s.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4 p-3" style={{ borderRadius: 12 }}>
        <div className="d-flex flex-wrap gap-2">
          <div className="input-group" style={{ maxWidth: 260 }}>
            <span className="input-group-text bg-light border-end-0">🔍</span>
            <input type="text" className="form-control border-start-0 bg-light"
              placeholder="Search name, company..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ maxWidth: 150 }}
            value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select className="form-select" style={{ maxWidth: 150 }}
            value={ratingFilter} onChange={e => setRatingFilter(e.target.value)}>
            <option value="">All Ratings</option>
            {[5, 4, 3, 2, 1].map(r => (
              <option key={r} value={r}>{'★'.repeat(r)} {r} Stars</option>
            ))}
          </select>
          {(search || status || ratingFilter) && (
            <button className="btn btn-outline-secondary btn-sm"
              onClick={() => { setSearch(''); setStatus(''); setRatingFilter('') }}>
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: '#00b894' }} />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <div style={{ fontSize: 48 }}>⭐</div>
          <p className="mt-3">No testimonials found.</p>
        </div>
      ) : (
        <div className="row g-3 mb-4">
          {testimonials.map(t => (
            <div className="col-12 col-md-6 col-xl-4" key={t.id}>
              <div className="card border-0 shadow-sm h-100"
                style={{
                  borderRadius: 12,
                  borderLeft: t.is_featured ? '3px solid #f59e0b' : '3px solid transparent'
                }}>
                <div className="card-body p-4">
                  {/* Top row */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <StarRating rating={t.rating} />
                    <div className="d-flex gap-1">
                      {t.is_featured && (
                        <span className="badge"
                          style={{ background: '#fef9c3', color: '#854d0e', fontSize: 11 }}>
                          ⭐ Featured
                        </span>
                      )}
                      <span className={`badge ${t.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}
                        style={{ fontSize: 11 }}>
                        {t.status}
                      </span>
                    </div>
                  </div>

                  {/* Message */}
                  <p className="text-muted mb-3 fst-italic"
                    style={{
                      fontSize: 13, lineHeight: 1.7,
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                    "{t.message}"
                  </p>

                  {/* Author */}
                  <div className="d-flex align-items-center gap-3 mb-3">
                    {t.image_url ? (
                      <img src={t.image_url} alt={t.name}
                        className="rounded-circle"
                        style={{ width: 44, height: 44, objectFit: 'cover', flexShrink: 0 }} />
                    ) : (
                      <div style={{
                        width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                        background: '#00b894', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 18
                      }}>
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div style={{ minWidth: 0 }}>
                      <div className="fw-semibold text-truncate" style={{ fontSize: 14 }}>
                        {t.name}
                      </div>
                      {(t.designation || t.company) && (
                        <small className="text-muted text-truncate d-block" style={{ fontSize: 12 }}>
                          {[t.designation, t.company].filter(Boolean).join(', ')}
                        </small>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="d-flex gap-2 pt-3"
                    style={{ borderTop: '1px solid #f0f0f0' }}>
                    {/* Status Toggle */}
                    <div className="form-check form-switch mb-0 d-flex align-items-center gap-2">
                      <input className="form-check-input" type="checkbox"
                        checked={t.status === 'Active'}
                        disabled={toggling === t.id}
                        onChange={() => handleToggleStatus(t.id)}
                        style={{ cursor: 'pointer' }} />
                    </div>

                    {/* Featured Toggle */}
                    <button
                      className="btn btn-sm"
                      style={{
                        fontSize: 12,
                        background: t.is_featured ? '#fef9c3' : '#f3f4f6',
                        color: t.is_featured ? '#854d0e' : '#6b7280',
                        border: 'none'
                      }}
                      disabled={featuring === t.id}
                      onClick={() => handleToggleFeatured(t.id)}>
                      {featuring === t.id
                        ? <span className="spinner-border spinner-border-sm" />
                        : t.is_featured ? '⭐ Featured' : '☆ Feature'}
                    </button>

                    <div className="ms-auto d-flex gap-1">
                      <Link to={`/admin/testimonials/edit/${t.id}`}
                        className="btn btn-sm btn-outline-primary">✏️</Link>
                      <button className="btn btn-sm btn-outline-danger"
                        onClick={() => setDeleteId(t.id)}>🗑</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="d-flex justify-content-between align-items-center">
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
                    onClick={() => setPage(p)}>{p}</button>
                </React.Fragment>
              ))}
            <button className="btn btn-sm btn-outline-secondary"
              disabled={page === meta.last_page} onClick={() => setPage(p => p + 1)}>›</button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,.5)', zIndex: 9999 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0" style={{ borderRadius: 12 }}>
              <div className="modal-body text-center p-5">
                <div style={{ fontSize: 52 }}>⭐</div>
                <h5 className="fw-bold mt-3 mb-2">Delete this testimonial?</h5>
                <p className="text-muted mb-4">It will be moved to trash.</p>
                <div className="d-flex gap-3 justify-content-center">
                  <button className="btn btn-light px-4" onClick={() => setDeleteId(null)}>
                    Cancel
                  </button>
                  <button className="btn btn-danger px-4"
                    disabled={deleting} onClick={handleDelete}>
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

export default AdminTestimonials