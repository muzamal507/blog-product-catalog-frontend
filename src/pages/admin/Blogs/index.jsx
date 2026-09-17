import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const initialBlogs = [
  { id: 1, title: 'The Art of Automatic Watches: Why Mechanical Still Wins', category: 'Timepieces',  author: 'Marcus Vance', date: 'Aug 20, 2026', status: 'Published', views: 342 },
  { id: 2, title: "Mechanical Keyboards: A Complete Buyer's Guide for 2026",  category: 'Peripherals', author: 'Sarah Ahmed',  date: 'Aug 15, 2026', status: 'Published', views: 218 },
  { id: 3, title: 'Are ANC Headphones Worth It in 2026?',                     category: 'Acoustics',   author: 'Bilal Sheikh', date: 'Aug 10, 2026', status: 'Published', views: 195 },
  { id: 4, title: "Full-Grain Leather: Why It's the Only Travel Gear Worth Buying", category: 'Travel Gear', author: 'Fatima Noor', date: 'Aug 5, 2026', status: 'Draft', views: 0 },
  { id: 5, title: 'Why We Only Do Cash on Delivery',                           category: 'About Us',    author: 'Marcus Vance', date: 'Jul 28, 2026', status: 'Published', views: 410 },
]

function AdminBlogs() {
  const [blogs, setBlogs] = useState(initialBlogs)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState(null)

  const filtered = blogs.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = (id) => {
    setBlogs(prev => prev.filter(b => b.id !== id))
    setDeleteId(null)
  }

  const toggleStatus = (id) => {
    setBlogs(prev => prev.map(b =>
      b.id === id
        ? { ...b, status: b.status === 'Published' ? 'Draft' : 'Published' }
        : b
    ))
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h4 className="fw-bold mb-1">Blogs</h4>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Blogs',    value: blogs.length,                                      color: '#00b894', icon: '✍️' },
          { label: 'Published',      value: blogs.filter(b => b.status === 'Published').length, color: '#3b82f6', icon: '✅' },
          { label: 'Drafts',         value: blogs.filter(b => b.status === 'Draft').length,     color: '#f59e0b', icon: '📝' },
          { label: 'Total Views',    value: blogs.reduce((s, b) => s + b.views, 0),             color: '#a855f7', icon: '👁' },
        ].map((s, i) => (
          <div className="col-6 col-md-3" key={i}>
            <div className="card border-0 shadow-sm p-3 d-flex flex-row align-items-center gap-3" style={{ borderRadius: 12 }}>
              <div style={{ width: 44, height: 44, background: s.color + '20', color: s.color, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div className="text-muted" style={{ fontSize: 12 }}>{s.label}</div>
                <div className="fw-bold" style={{ fontSize: 20 }}>{s.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
        {/* Search */}
        <div className="p-3 border-bottom d-flex gap-2">
          <div className="input-group" style={{ maxWidth: 320 }}>
            <span className="input-group-text bg-light border-end-0">🔍</span>
            <input type="text" className="form-control border-start-0 bg-light"
              placeholder="Search blogs..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: 14 }}>
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Date</th>
                <th>Views</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-5 text-muted">
                    No blogs found.
                  </td>
                </tr>
              ) : filtered.map((blog, i) => (
                <tr key={blog.id}>
                  <td className="text-muted">{i + 1}</td>
                  <td>
                    <div className="fw-semibold" style={{ maxWidth: 280, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {blog.title}
                    </div>
                  </td>
                  <td>
                    <span className="badge px-2 py-1" style={{ background: '#00b89420', color: '#00b894', fontSize: 11 }}>
                      {blog.category}
                    </span>
                  </td>
                  <td>{blog.author}</td>
                  <td className="text-muted">{blog.date}</td>
                  <td>👁 {blog.views}</td>
                  <td>
                    <div className="form-check form-switch mb-0 d-flex align-items-center gap-2">
                      <input className="form-check-input" type="checkbox"
                        checked={blog.status === 'Published'}
                        onChange={() => toggleStatus(blog.id)}
                        style={{ cursor: 'pointer' }} />
                      <span className={`badge ${blog.status === 'Published' ? 'bg-success' : 'bg-warning text-dark'}`}
                        style={{ fontSize: 11 }}>
                        {blog.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/blogs/${blog.id}`} target="_blank"
                        className="btn btn-sm btn-outline-secondary" title="View">
                        👁
                      </Link>
                      <Link to={`/admin/blogs/edit/${blog.id}`}
                        className="btn btn-sm btn-outline-primary" title="Edit">
                        ✏️
                      </Link>
                      <button className="btn btn-sm btn-outline-danger"
                        title="Delete" onClick={() => setDeleteId(blog.id)}>
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0" style={{ borderRadius: 12 }}>
              <div className="modal-body text-center p-5">
                <div style={{ fontSize: 48 }}>🗑️</div>
                <h5 className="fw-bold mt-3 mb-2">Delete this blog?</h5>
                <p className="text-muted mb-4">This action cannot be undone.</p>
                <div className="d-flex gap-3 justify-content-center">
                  <button className="btn btn-light px-4" onClick={() => setDeleteId(null)}>Cancel</button>
                  <button className="btn btn-danger px-4" onClick={() => handleDelete(deleteId)}>Yes, Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminBlogs