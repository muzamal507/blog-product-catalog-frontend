import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import blogPageService from '../../../services/blog/pageService'

const STATUS_COLORS = {
  Published: { bg: '#d1fae5', color: '#059669' },
  Draft:     { bg: '#f3f4f6', color: '#374151' },
  Scheduled: { bg: '#dbeafe', color: '#1d4ed8' },
  Archived:  { bg: '#fef9c3', color: '#854d0e' },
}

const TEMPLATE_ICONS = {
  Default:    '📄',
  'Full-Width': '📐',
  Contact:    '📞',
  Landing:    '🚀',
}

function AdminPages() {
  const [pages, setPages]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [status, setStatus]     = useState('')
  const [page, setPage]         = useState(1)
  const [meta, setMeta]         = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchPages = useCallback(() => {
    setLoading(true)
    blogPageService.getAll({ search, status, page, per_page: 10 })
      .then(res => {
        setPages(res.data.data?.data || res.data.data || [])
        setMeta(res.data.data?.meta || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, status, page])

  useEffect(() => { fetchPages() }, [fetchPages])
  useEffect(() => { setPage(1) }, [search, status])

  const handleChangeStatus = async (id, newStatus) => {
    try { await blogPageService.changeStatus(id, newStatus); fetchPages() }
    catch (_) {}
  }

  const handleDelete = async () => {
    setDeleting(true)
    try { await blogPageService.destroy(deleteId); setDeleteId(null); fetchPages() }
    catch (_) {} finally { setDeleting(false) }
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Pages</h4>
          <small className="text-muted">Manage static site pages</small>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/pages/trash" className="btn btn-outline-secondary btn-sm">🗑 Trash</Link>
          <Link to="/admin/pages/add"
            className="btn text-white fw-semibold px-3"
            style={{ background: '#00b894', borderRadius: 8 }}>
            + Add Page
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {Object.entries(STATUS_COLORS).map(([s, colors]) => (
          <div className="col-6 col-md-3" key={s}>
            <button
              onClick={() => setStatus(status === s ? '' : s)}
              className="card border-0 shadow-sm p-3 w-100 text-start"
              style={{ borderRadius: 12, border: 'none', cursor: 'pointer',
                background: status === s ? colors.bg : '#fff' }}>
              <div style={{ color: colors.color, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                {s.toUpperCase()}
              </div>
              <div className="fw-bold" style={{ fontSize: 20 }}>
                {pages.filter(p => p.status === s).length}
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4 p-3" style={{ borderRadius: 12 }}>
        <div className="d-flex flex-wrap gap-2">
          <div className="input-group" style={{ maxWidth: 280 }}>
            <span className="input-group-text bg-light border-end-0">🔍</span>
            <input type="text" className="form-control border-start-0 bg-light"
              placeholder="Search pages..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ maxWidth: 160 }}
            value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All Status</option>
            {Object.keys(STATUS_COLORS).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
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
                <th>Title</th>
                <th>Slug</th>
                <th>Template</th>
                <th>Status</th>
                <th>Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-5">
                  <div className="spinner-border" style={{ color: '#00b894' }} />
                </td></tr>
              ) : pages.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-5 text-muted">
                  <div style={{ fontSize: 40 }}>📄</div>
                  <p className="mt-2">No pages found.</p>
                </td></tr>
              ) : pages.map(pg => (
                <tr key={pg.id}>
                  <td>
                    <div className="fw-semibold">{pg.title}</div>
                    {pg.meta_description && (
                      <small className="text-muted text-truncate d-block" style={{ maxWidth: 220 }}>
                        {pg.meta_description}
                      </small>
                    )}
                  </td>
                  <td>
                    <code style={{ fontSize: 12, color: '#6b7280' }}>/{pg.slug}</code>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border" style={{ fontSize: 12 }}>
                      {TEMPLATE_ICONS[pg.template]} {pg.template}
                    </span>
                  </td>
                  <td>
                    <select className="form-select form-select-sm"
                      style={{
                        ...STATUS_COLORS[pg.status],
                        border: 'none', fontWeight: 600,
                        fontSize: 12, width: 120
                      }}
                      value={pg.status}
                      onChange={e => handleChangeStatus(pg.id, e.target.value)}>
                      {Object.keys(STATUS_COLORS).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="text-muted" style={{ fontSize: 12 }}>
                    {pg.published_at
                      ? new Date(pg.published_at).toLocaleDateString()
                      : '—'}
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Link to={`/page/${pg.slug}`} target="_blank"
                        className="btn btn-sm btn-outline-secondary">👁</Link>
                      <Link to={`/admin/pages/edit/${pg.id}`}
                        className="btn btn-sm btn-outline-primary">✏️</Link>
                      <button className="btn btn-sm btn-outline-danger"
                        onClick={() => setDeleteId(pg.id)}>🗑</button>
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
                <div style={{ fontSize: 52 }}>📄</div>
                <h5 className="fw-bold mt-3 mb-2">Delete this page?</h5>
                <p className="text-muted mb-4">It will be moved to trash.</p>
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

export default AdminPages