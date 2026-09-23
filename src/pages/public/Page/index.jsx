import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import blogPageService from '../../../services/blog/pageService'

function PublicPage() {
  const { slug }                  = useParams()
  const [page, setPage]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [notFound, setNotFound]   = useState(false)

  useEffect(() => {
    setLoading(true)
    blogPageService.getBySlug(slug)
      .then(res => {
        const data  = res.data?.data || res.data
        const pages = Array.isArray(data) ? data : data?.data || []
        const found = Array.isArray(pages) ? pages[0] : pages
        if (!found) { setNotFound(true); return }
        setPage(found)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  const renderContent = (content) => {
    if (!content) return ''
    return content
      .replace(/## (.+)/g, '<h4 class="fw-bold mt-4 mb-2">$1</h4>')
      .replace(/# (.+)/g,  '<h3 class="fw-bold mt-4 mb-2">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g,     '<em>$1</em>')
      .replace(/\n\n/g, '</p><p class="mb-3">')
      .replace(/\n/g,   '<br/>')
      .replace(/^/,     '<p class="mb-3">')
      .replace(/$/,     '</p>')
  }

  if (loading) return (
    <div className="container py-5" style={{ maxWidth: 800 }}>
      {[100, 50, 80, 60, 90, 70].map((w, i) => (
        <div key={i} style={{ height: i === 0 ? 36 : 16, background: '#f0f0f0',
          borderRadius: 6, width: `${w}%`, marginBottom: 16,
          animation: 'skeleton 1.5s infinite' }} />
      ))}
      <style>{`@keyframes skeleton{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  )

  if (notFound || !page) return (
    <div className="container text-center py-5">
      <div style={{ fontSize: 72 }}>📄</div>
      <h4 className="fw-bold mt-3 mb-2">Page Not Found</h4>
      <Link to="/" className="btn text-white px-4"
        style={{ background: '#00b894', borderRadius: 8 }}>
        Back to Home
      </Link>
    </div>
  )

  return (
    <div>
      {/* Hero */}
      <div className="py-5 text-center"
        style={{ background: 'linear-gradient(135deg,#0d1b2a,#0f2d40)' }}>
        <div className="container" style={{ maxWidth: 700 }}>
          {page.image && (
            <img src={page.image} alt={page.title}
              className="rounded-circle mb-4"
              style={{ width: 80, height: 80, objectFit: 'cover',
                border: '3px solid #00b894' }} />
          )}
          <h1 className="fw-bold text-white mb-3"
            style={{ fontSize: 'clamp(24px,4vw,40px)' }}>
            {page.title}
          </h1>
          {page.meta_description && (
            <p style={{ color: '#8fa3b8', maxWidth: 500, margin: '0 auto' }}>
              {page.meta_description}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container py-5" style={{ maxWidth: 800 }}>

        {/* Full-Width check */}
        {page.template === 'Full-Width' ? (
          <div
            style={{ fontSize: 15, lineHeight: 1.9, color: '#374151' }}
            dangerouslySetInnerHTML={{ __html: renderContent(page.content) }}
          />
        ) : (
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              <div className="card border-0 shadow-sm p-4 p-md-5" style={{ borderRadius: 12 }}>
                <div
                  style={{ fontSize: 15, lineHeight: 1.9, color: '#374151' }}
                  dangerouslySetInnerHTML={{ __html: renderContent(page.content) }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Back */}
        <div className="text-center mt-5">
          <Link to="/" className="btn btn-outline-secondary px-4">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PublicPage