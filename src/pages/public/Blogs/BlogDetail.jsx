import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import blogPostService from '../../../services/blog/postService'

function BlogDetail() {
  const { slug }   = useParams()
  const navigate   = useNavigate()

  const [post, setPost]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [notFound, setNotFound]   = useState(false)
  const [related, setRelated]     = useState([])
  const [navigation, setNavigation] = useState(null)

  useEffect(() => {
    setLoading(true)
    setPost(null)

    blogPostService.getBySlug(slug)
      .then(res => {
        const p = res.data.data || res.data
        if (!p) { setNotFound(true); return }
        setPost(p)

        // Load related + navigation
        if (p.category?.id) {
          blogPostService.getRelated(p.category.id, p.id)
            .then(r => setRelated(r.data.data || r.data || []))
            .catch(() => {})
        }

        if (p.id) {
          blogPostService.getNavigation(p.id)
            .then(r => setNavigation(r.data || r))
            .catch(() => {})
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  // Render content — handle newlines
  const renderContent = (content) => {
    if (!content) return ''
    return content
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>')
      .replace(/## (.+)/g, '<h4 class="fw-bold mt-4 mb-2">$1</h4>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  }

  if (loading) return (
    <div className="container py-5" style={{ maxWidth: 800 }}>
      <div style={{ height: 300, background: '#f0f0f0', borderRadius: 12, marginBottom: 32,
        animation: 'skeleton 1.5s infinite' }} />
      {[100, 60, 80, 60, 90, 70, 80].map((w, i) => (
        <div key={i} style={{ height: 16, background: '#f0f0f0', borderRadius: 4,
          width: `${w}%`, marginBottom: 12, animation: 'skeleton 1.5s infinite' }} />
      ))}
      <style>{`@keyframes skeleton{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  )

  if (notFound || !post) return (
    <div className="container text-center py-5">
      <div style={{ fontSize: 72 }}>📄</div>
      <h4 className="fw-bold mt-3 mb-2">Article Not Found</h4>
      <Link to="/blogs" className="btn text-white px-4"
        style={{ background: '#00b894', borderRadius: 8 }}>
        ← Back to Blog
      </Link>
    </div>
  )

  return (
    <div>
      {/* Hero */}
      <div className="py-5 text-center"
        style={{ background: 'linear-gradient(135deg,#0d1b2a,#0f2d40)' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <Link to="/blogs" className="d-inline-flex align-items-center gap-2 mb-4 text-decoration-none"
            style={{ color: '#8fa3b8', fontSize: 14 }}>
            ← Back to Blog
          </Link>
          {post.category?.name && (
            <div className="mb-3">
              <span className="badge px-3 py-2"
                style={{ background: '#00b89430', color: '#00b894', fontSize: 12 }}>
                {post.category.name}
              </span>
            </div>
          )}
          <h1 className="fw-bold text-white mb-4"
            style={{ fontSize: 'clamp(20px,4vw,34px)', lineHeight: 1.3 }}>
            {post.title}
          </h1>
          <div className="d-flex align-items-center justify-content-center gap-3">
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: '#00b894', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 16
            }}>
              {post.author?.name?.charAt(0) || 'A'}
            </div>
            <div className="text-start">
              <div className="text-white fw-semibold" style={{ fontSize: 14 }}>
                {post.author?.name || 'Admin'}
              </div>
              <small style={{ color: '#8fa3b8' }}>
                {post.published_at
                  ? new Date(post.published_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })
                  : new Date(post.created_at).toLocaleDateString()} · {post.views || 0} views
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="container mt-4" style={{ maxWidth: 760 }}>
          <img src={post.featured_image} alt={post.title}
            className="w-100 shadow"
            style={{ borderRadius: 12, height: 'clamp(200px,40vw,380px)',
              objectFit: 'cover' }} />
        </div>
      )}

      {/* Content */}
      <div className="container py-5" style={{ maxWidth: 760 }}>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="lead text-muted mb-4 pb-4"
            style={{ borderBottom: '1px solid #e5e7eb', fontSize: 17, lineHeight: 1.8 }}>
            {post.excerpt}
          </p>
        )}

        {/* Main content */}
        <div
          style={{ fontSize: 16, lineHeight: 1.9, color: '#374151' }}
          dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
        />

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mt-5 pt-4"
            style={{ borderTop: '1px solid #e5e7eb' }}>
            <small className="text-muted fw-semibold me-1">Tags:</small>
            {post.tags.map(tag => (
              <Link key={tag.id} to={`/blogs?tag_id=${tag.id}`}
                className="badge text-decoration-none px-3 py-1"
                style={{ background: '#f3f4f6', color: '#374151', fontSize: 12 }}>
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Author Card */}
        <div className="card border-0 p-4 mt-5" style={{ borderRadius: 12, background: '#f9fafb' }}>
          <div className="d-flex align-items-center gap-3">
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'linear-gradient(135deg,#00b894,#0d9488)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 22, flexShrink: 0
            }}>
              {post.author?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <div className="fw-bold mb-1">{post.author?.name || 'Admin'}</div>
              <small className="text-muted">
                Content curator at AeroLux — covering premium physical products and authentic craftsmanship.
              </small>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {navigation && (navigation.previous || navigation.next) && (
          <div className="row g-3 mt-4">
            {navigation.previous && (
              <div className="col-6">
                <Link to={`/blogs/${navigation.previous.slug}`}
                  className="card border-0 shadow-sm p-3 text-decoration-none h-100"
                  style={{ borderRadius: 10, display: 'block' }}>
                  <small className="text-muted d-block mb-1">← Previous</small>
                  <div className="fw-semibold text-dark"
                    style={{ fontSize: 13, lineHeight: 1.4,
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {navigation.previous.title}
                  </div>
                </Link>
              </div>
            )}
            {navigation.next && (
              <div className={`col-6 ${!navigation.previous ? 'offset-6' : ''}`}>
                <Link to={`/blogs/${navigation.next.slug}`}
                  className="card border-0 shadow-sm p-3 text-decoration-none h-100 text-end"
                  style={{ borderRadius: 10, display: 'block' }}>
                  <small className="text-muted d-block mb-1">Next →</small>
                  <div className="fw-semibold text-dark"
                    style={{ fontSize: 13, lineHeight: 1.4,
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {navigation.next.title}
                  </div>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="mt-5 pt-4" style={{ borderTop: '1px solid #e5e7eb' }}>
            <h5 className="fw-bold mb-4">Related Articles</h5>
            <div className="row g-3">
              {related.slice(0, 3).map(p => (
                <div className="col-12 col-md-4" key={p.id}>
                  <Link to={`/blogs/${p.slug}`} className="text-decoration-none">
                    <div className="card border-0 shadow-sm h-100"
                      style={{ borderRadius: 10, transition: 'transform 0.2s' }}
                      onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseOut={e => e.currentTarget.style.transform = ''}>
                      <div style={{ height: 140, background: '#f3f4f6',
                        borderRadius: '10px 10px 0 0', overflow: 'hidden' }}>
                        {p.featured_image ? (
                          <img src={p.featured_image} alt={p.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div className="w-100 h-100 d-flex align-items-center justify-content-center"
                            style={{ fontSize: 32, opacity: 0.3 }}>✍️</div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="fw-semibold text-dark mb-0"
                          style={{ fontSize: 13, lineHeight: 1.4,
                            display: '-webkit-box', WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {p.title}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back to blog */}
        <div className="text-center mt-5">
          <Link to="/blogs" className="btn text-white fw-semibold px-4"
            style={{ background: '#00b894', borderRadius: 8 }}>
            ← Browse All Articles
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BlogDetail