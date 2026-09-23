import React, { useState, useEffect, useCallback } from 'react'
import contactService from '../../../services/contactService'

function AdminContactMessages() {
  const [messages, setMessages]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [filter, setFilter]       = useState('all')
  const [page, setPage]           = useState(1)
  const [meta, setMeta]           = useState(null)
  const [selected, setSelected]   = useState(null) // detail modal
  const [reply, setReply]         = useState('')
  const [replying, setReplying]   = useState(false)
  const [deleting, setDeleting]   = useState(null)

  const fetchMessages = useCallback(() => {
    setLoading(true)
    contactService.getAll({
      search, page, per_page: 15,
      ...(filter === 'unread' ? { is_read: 0 } : {}),
      ...(filter === 'read'   ? { is_read: 1 } : {}),
    })
      .then(res => {
        setMessages(res.data.data?.data || res.data.data || [])
        setMeta(res.data.data?.meta || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, filter, page])

  useEffect(() => { fetchMessages() }, [fetchMessages])
  useEffect(() => { setPage(1) }, [search, filter])

  const openMessage = async (msg) => {
    setSelected(msg)
    setReply(msg.reply || '')
    // Mark as read
    if (!msg.is_read) {
      try {
        await contactService.markRead(msg.id)
        setMessages(prev =>
          prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m)
        )
      } catch {}
    }
  }

  const handleReply = async () => {
    if (!reply.trim() || !selected) return
    setReplying(true)
    try {
      await contactService.reply(selected.id, { reply })
      setSelected(prev => ({ ...prev, reply, replied_at: new Date().toISOString() }))
      fetchMessages()
    } catch {}
    finally { setReplying(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return
    setDeleting(id)
    try {
      await contactService.destroy(id)
      if (selected?.id === id) setSelected(null)
      fetchMessages()
    } catch {}
    finally { setDeleting(null) }
  }

  const unreadCount = messages.filter(m => !m.is_read).length

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">
            Contact Messages
            {unreadCount > 0 && (
              <span className="badge ms-2" style={{ background: '#dc2626', fontSize: 12 }}>
                {unreadCount} new
              </span>
            )}
          </h4>
          <small className="text-muted">Customer inquiries and support messages</small>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4 p-3" style={{ borderRadius: 12 }}>
        <div className="d-flex flex-wrap gap-2">
          <div className="input-group" style={{ maxWidth: 280 }}>
            <span className="input-group-text bg-light border-end-0">🔍</span>
            <input type="text" className="form-control border-start-0 bg-light"
              placeholder="Search messages..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {['all', 'unread', 'read'].map(f => (
            <button key={f}
              className="btn btn-sm fw-semibold"
              style={{
                borderRadius: 20,
                background: filter === f ? '#00b894' : '#f3f4f6',
                color: filter === f ? '#fff' : '#374151',
                border: 'none'
              }}
              onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f === 'unread' ? '🔴 Unread' : '✅ Read'}
            </button>
          ))}
        </div>
      </div>

      <div className="row g-4">

        {/* LEFT — Message List */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" style={{ color: '#00b894' }} />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <div style={{ fontSize: 40 }}>📭</div>
                <p className="mt-2">No messages found.</p>
              </div>
            ) : (
              <div className="d-flex flex-column">
                {messages.map((msg, i) => (
                  <div key={msg.id}
                    onClick={() => openMessage(msg)}
                    className="p-3"
                    style={{
                      cursor: 'pointer',
                      borderBottom: i < messages.length - 1 ? '1px solid #f0f0f0' : 'none',
                      background: selected?.id === msg.id ? '#f0fdf4' : '',
                      transition: 'background 0.15s'
                    }}
                    onMouseOver={e => {
                      if (selected?.id !== msg.id)
                        e.currentTarget.style.background = '#f9fafb'
                    }}
                    onMouseOut={e => {
                      if (selected?.id !== msg.id)
                        e.currentTarget.style.background = ''
                    }}>
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <div className="d-flex align-items-start gap-2 flex-fill" style={{ minWidth: 0 }}>
                        {/* Unread dot */}
                        <div style={{
                          width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 5,
                          background: msg.is_read ? 'transparent' : '#dc2626'
                        }} />
                        <div style={{ minWidth: 0 }}>
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="fw-semibold text-truncate" style={{ fontSize: 14 }}>
                              {msg.name}
                            </span>
                            {msg.reply && (
                              <span className="badge"
                                style={{ background: '#d1fae5', color: '#059669', fontSize: 10 }}>
                                Replied
                              </span>
                            )}
                          </div>
                          <div className="fw-semibold text-truncate"
                            style={{ fontSize: 13, color: '#374151' }}>
                            {msg.subject}
                          </div>
                          <div className="text-muted text-truncate" style={{ fontSize: 12 }}>
                            {msg.message}
                          </div>
                        </div>
                      </div>
                      <div style={{ flexShrink: 0, textAlign: 'right' }}>
                        <small className="text-muted d-block" style={{ fontSize: 11 }}>
                          {new Date(msg.created_at).toLocaleDateString()}
                        </small>
                        <button
                          className="btn btn-sm btn-outline-danger mt-1"
                          style={{ fontSize: 10, padding: '1px 6px' }}
                          disabled={deleting === msg.id}
                          onClick={e => { e.stopPropagation(); handleDelete(msg.id) }}>
                          🗑
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
              <div className="p-3 d-flex justify-content-center gap-1 border-top">
                <button className="btn btn-sm btn-outline-secondary"
                  disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                <span className="btn btn-sm disabled">{page}/{meta.last_page}</span>
                <button className="btn btn-sm btn-outline-secondary"
                  disabled={page === meta.last_page} onClick={() => setPage(p => p + 1)}>›</button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Message Detail */}
        <div className="col-12 col-lg-7">
          {!selected ? (
            <div className="card border-0 shadow-sm p-5 text-center"
              style={{ borderRadius: 12, minHeight: 400,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 56, opacity: 0.3 }}>📬</div>
              <p className="text-muted mt-3">Select a message to read</p>
            </div>
          ) : (
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
              {/* Header */}
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h5 className="fw-bold mb-1">{selected.subject}</h5>
                  <div className="d-flex flex-wrap gap-2">
                    <small className="text-muted">
                      👤 <strong>{selected.name}</strong>
                    </small>
                    <small className="text-muted">
                      ✉ {selected.email}
                    </small>
                    {selected.phone && (
                      <small className="text-muted">
                        📞 {selected.phone}
                      </small>
                    )}
                  </div>
                  <small className="text-muted">
                    🕐 {new Date(selected.created_at).toLocaleString()}
                  </small>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={async () => {
                      try {
                        if (selected.is_read) {
                          await contactService.markUnread(selected.id)
                          setSelected(prev => ({ ...prev, is_read: false }))
                        } else {
                          await contactService.markRead(selected.id)
                          setSelected(prev => ({ ...prev, is_read: true }))
                        }
                        fetchMessages()
                      } catch {}
                    }}>
                    {selected.is_read ? '🔴 Mark Unread' : '✅ Mark Read'}
                  </button>
                  <button className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(selected.id)}>
                    🗑 Delete
                  </button>
                </div>
              </div>

              {/* Message */}
              <div className="p-4 rounded-3 mb-4"
                style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                <p style={{ fontSize: 14, lineHeight: 1.9, whiteSpace: 'pre-wrap', margin: 0 }}>
                  {selected.message}
                </p>
              </div>

              {/* Previous Reply */}
              {selected.reply && (
                <div className="p-4 rounded-3 mb-4"
                  style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span style={{ fontSize: 14, color: '#059669', fontWeight: 700 }}>
                      ✅ Previous Reply
                    </span>
                    {selected.replied_at && (
                      <small className="text-muted">
                        — {new Date(selected.replied_at).toLocaleString()}
                      </small>
                    )}
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.9,
                    whiteSpace: 'pre-wrap', margin: 0, color: '#374151' }}>
                    {selected.reply}
                  </p>
                </div>
              )}

              {/* Reply Box */}
              <div>
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                  {selected.reply ? '✏️ Update Reply' : '💬 Send Reply'}
                </label>
                <textarea rows={4} className="form-control mb-2"
                  placeholder={`Reply to ${selected.name}...`}
                  value={reply}
                  onChange={e => setReply(e.target.value)} />
                <button
                  className="btn text-white fw-semibold px-4"
                  style={{ background: '#00b894', borderRadius: 8 }}
                  disabled={replying || !reply.trim()}
                  onClick={handleReply}>
                  {replying
                    ? <><span className="spinner-border spinner-border-sm me-2" />Sending...</>
                    : '📨 Send Reply'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminContactMessages