import React, { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import blogPostService     from '../../../services/blog/postService'
import blogCategoryService from '../../../services/blog/categoryService'
import blogTagService      from '../../../services/blog/tagService'

function Blogs() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [posts, setPosts]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [meta, setMeta]             = useState(null)
  const [categories, setCategories] = useState([])
  const [tags, setTags]             = useState([])
  const [recentPosts, setRecentPosts] = useState([])

  const [search, setSearch]         = useState(searchParams.get('search') || '')
  const [categoryId, setCategoryId] = useState(searchParams.get('category_id') || '')
  const [tagId, setTagId]           = useState(searchParams.get('tag_id') || '')
  const [page, setPage]             = useState(1)

  // Load sidebar data
  useEffect(() => {
    blogCategoryService.getAll({ status: 'Active' })
      .then(res => setCategories(res.data.data?.data || res.data.data || []))
      .catch(() => {})

    blogTagService.getAll({ status: 'Active' })
      .then(res => setTags(res.data.data?.data || res.data.data || []))
      .catch(() => {})

    blogPostService.getRecent(5)
      .then(res => setRecentPosts(res.data.data?.data || res.data.data || []))
      .catch(() => {})
  }, [])

  const fetchPosts = useCallback(() => {
    setLoading(true)
    blogPostService.getAll({
      search, category_id: categoryId, tag_id: tagId,
      status: 'Published', sort: 'latest', per_page: 6, page
    })
      .then(res => {
        setPosts(res.data.data?.data || res.data.data || [])
        setMeta(res.data.data?.meta || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, categoryId, tagId, page])

  useEffect(() => { fetchPosts() }, [fetchPosts])
  useEffect(() => { setPage(1) }, [search, categoryId, tagId])

  // Sync URL
  useEffect(() => {
    const params = {}
    if (search)     params.search      = search
    if (categoryId) params.category_id = categoryId
    if (tagId)      params.tag_id      = tagId
    setSearchParams(params)
  }, [search, categoryId, tagId])

  return (
    <div>
      {/* Hero */}
      <div className="py-5 text-center"
        style={{ background: 'linear-gradient(135deg,#0d1b2a,#0f2d40)' }}>
        <small className="fw-bold text-uppercase"
          style={{ color: '#00b894', letterSpacing: 2, fontSize: 11 }}>
          CHRONICLES
        </small>
        <h1 className="fw-bold text-white mt-2 mb-2"
          style={{ fontSize: 'clamp(22px,4vw,38px)' }}>
          Vision & Knowledge Blog
        </h1>
        <p style={{ color: '#8fa3b8', maxWidth: 500, margin: '0 auto 24px' }}>
          Deep dives into watches, peripherals, travel gear, and premium physical products.
        </p>

        {/* Search */}
        <div className="mx-auto" style={{ maxWidth: 440, padding: '0 16px' }}>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">🔍</span>
            <input type="text" className="form-control border-start-0"
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)} />
            {search && (
              <button className="input-group-text bg-white border-start-0"
                onClick={() => setSearch('')}>✕</button>
            )}
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-5">

          {/* LEFT — Posts */}
          <div className="col-12 col-lg-8">

            {/* Active filters */}
            {(categoryId || tagId) && (
              <div className="d-flex flex-wrap gap-2 mb-4">
                {categoryId && (
                  <span className="badge d-flex align-items-center gap-1 px-3 py-2"
                    style={{ background: '#00b89420', color: '#00b894', fontSize: 13 }}>
                    📂 {categories.find(c => c.id === parseInt(categoryId))?.name || 'Category'}
                    <button onClick={() => setCategoryId('')}
                      style={{ background: 'none', border: 'none', color: '#00b894',
                        cursor: 'pointer', padding: 0 }}>✕</button>
                  </span>
                )}
                {tagId && (
                  <span className="badge d-flex align-items-center gap-1 px-3 py-2"
                    style={{ background: '#00b89420', color: '#00b894', fontSize: 13 }}>
                    🏷️ {tags.find(t => t.id === parseInt(tagId))?.name || 'Tag'}
                    <button onClick={() => setTagId('')}
                      style={{ background: 'none', border: 'none', color: '#00b894',
                        cursor: 'pointer', padding: 0 }}>✕</button>
                  </span>
                )}
              </div>
            )}

            {/* Posts Grid */}
            {loading ? (
              <div className="row g-4">
                {[1,2,3,4,5,6].map(i => (
                  <div className="col-12 col-md-6" key={i}>
                    <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
                      <div style={{ height: 200, background: '#f0f0f0',
                        borderRadius: '12px 12px 0 0', animation: 'skeleton 1.5s infinite' }} />
                      <div className="p-3">
                        <div style={{ height: 12, background: '#f0f0f0', borderRadius: 4, width: '40%', marginBottom: 8 }} />
                        <div style={{ height: 16, background: '#f0f0f0', borderRadius: 4, marginBottom: 6 }} />
                        <div style={{ height: 16, background: '#f0f0f0', borderRadius: 4, width: '70%' }} />
                      </div>
                      <style>{`@keyframes skeleton{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <div style={{ fontSize: 56 }}>📭</div>
                <h5 className="fw-bold mt-3">No articles found</h5>
                <p>Try a different search or category.</p>
                <button className="btn btn-outline-secondary btn-sm"
                  onClick={() => { setSearch(''); setCategoryId(''); setTagId('') }}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {posts.map(post => (
                  <div className="col-12 col-md-6" key={post.id}>
                    <div className="card border-0 shadow-sm h-100"
                      style={{ borderRadius: 12, transition: 'transform 0.2s, box-shadow 0.2s' }}
                      onMouseOver={e => {
                        e.currentTarget.style.transform = 'translateY(-4px)'
                        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,.1)'
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.transform = ''
                        e.currentTarget.style.boxShadow = ''
                      }}>

                      {/* Image */}
                      <Link to={`/blogs/${post.slug}`} className="text-decoration-none">
                        <div className="overflow-hidden"
                          style={{ borderRadius: '12px 12px 0 0', height: 200 }}>
                          {post.featured_image ? (
                            <img src={post.featured_image} alt={post.title}
                              className="w-100 h-100"
                              style={{ objectFit: 'cover', transition: 'transform 0.4s' }}
                              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                              onMouseOut={e => e.currentTarget.style.transform = ''} />
                          ) : (
                            <div className="w-100 h-100 d-flex align-items-center justify-content-center"
                              style={{ background: 'linear-gradient(135deg,#0d1b2a,#0f2d40)' }}>
                              <span style={{ fontSize: 48, opacity: 0.4 }}>✍️</span>
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="card-body d-flex flex-column p-4">
                        {/* Category */}
                        {post.category?.name && (
                          <button
                            onClick={() => setCategoryId(String(post.category.id))}
                            className="badge mb-2 align-self-start border-0"
                            style={{ background: '#00b89420', color: '#00b894',
                              fontSize: 11, cursor: 'pointer' }}>
                            {post.category.name}
                          </button>
                        )}

                        {/* Title */}
                        <Link to={`/blogs/${post.slug}`} className="text-decoration-none text-dark">
                          <h6 className="fw-bold mb-2"
                            style={{ fontSize: 16, lineHeight: 1.5,
                              display: '-webkit-box', WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {post.title}
                          </h6>
                        </Link>

                        {/* Excerpt */}
                        <p className="text-muted flex-fill mb-3"
                          style={{ fontSize: 13, lineHeight: 1.7,
                            display: '-webkit-box', WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {post.excerpt}
                        </p>

                        {/* Footer */}
                        <div className="d-flex align-items-center justify-content-between mt-auto pt-3"
                          style={{ borderTop: '1px solid #f0f0f0' }}>
                          <div className="d-flex align-items-center gap-2">
                            <div style={{
                              width: 28, height: 28, borderRadius: '50%',
                              background: '#00b894', color: '#fff',
                              display: 'flex', alignItems: 'center',
                              justifyContent: 'center', fontSize: 12, fontWeight: 700
                            }}>
                              {post.author?.name?.charAt(0) || 'A'}
                            </div>
                            <div>
                              <div className="fw-semibold" style={{ fontSize: 12 }}>
                                {post.author?.name || 'Admin'}
                              </div>
                              <small className="text-muted" style={{ fontSize: 11 }}>
                                {post.views || 0} views
                              </small>
                            </div>
                          </div>
                          <Link to={`/blogs/${post.slug}`}
                            className="btn btn-sm fw-semibold text-decoration-none"
                            style={{ color: '#00b894', background: '#00b89415',
                              borderRadius: 8, fontSize: 12 }}>
                            Read →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
              <div className="d-flex justify-content-center gap-2 mt-5">
                <button className="btn btn-outline-secondary btn-sm"
                  disabled={page === 1} onClick={() => { setPage(p => p - 1); window.scrollTo(0,0) }}>
                  ‹ Prev
                </button>
                {Array.from({ length: meta.last_page }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === meta.last_page || Math.abs(p - page) <= 1)
                  .map((p, idx, arr) => (
                    <React.Fragment key={p}>
                      {idx > 0 && arr[idx-1] !== p-1 && <span className="btn btn-sm disabled">…</span>}
                      <button
                        className={`btn btn-sm ${p === page ? 'text-white' : 'btn-outline-secondary'}`}
                        style={p === page ? { background: '#00b894', border: 'none' } : {}}
                        onClick={() => { setPage(p); window.scrollTo(0,0) }}>{p}</button>
                    </React.Fragment>
                  ))}
                <button className="btn btn-outline-secondary btn-sm"
                  disabled={page === meta.last_page}
                  onClick={() => { setPage(p => p + 1); window.scrollTo(0,0) }}>
                  Next ›
                </button>
              </div>
            )}
          </div>

          {/* RIGHT — Sidebar */}
          <div className="col-12 col-lg-4">

            {/* Categories */}
            {categories.length > 0 && (
              <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 12 }}>
                <h6 className="fw-bold mb-3">📂 Categories</h6>
                <div className="d-flex flex-column gap-1">
                  <button
                    onClick={() => setCategoryId('')}
                    className="btn btn-sm text-start px-2 py-1"
                    style={{
                      borderRadius: 6, fontSize: 13, border: 'none',
                      background: !categoryId ? '#00b89415' : 'transparent',
                      color: !categoryId ? '#00b894' : '#374151',
                      fontWeight: !categoryId ? 600 : 400
                    }}>
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button key={cat.id}
                      onClick={() => setCategoryId(String(cat.id))}
                      className="btn btn-sm text-start px-2 py-1 w-100"
                      style={{
                        borderRadius: 6, fontSize: 13, border: 'none',
                        background: categoryId === String(cat.id) ? '#00b89415' : 'transparent',
                        color: categoryId === String(cat.id) ? '#00b894' : '#374151',
                        fontWeight: categoryId === String(cat.id) ? 600 : 400
                      }}>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Posts */}
            {recentPosts.length > 0 && (
              <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 12 }}>
                <h6 className="fw-bold mb-3">🕐 Recent Posts</h6>
                <div className="d-flex flex-column gap-3">
                  {recentPosts.map(post => (
                    <Link key={post.id} to={`/blogs/${post.slug}`}
                      className="d-flex gap-3 text-decoration-none">
                      <div style={{
                        width: 56, height: 56, borderRadius: 8, flexShrink: 0,
                        overflow: 'hidden', background: '#f3f4f6'
                      }}>
                        {post.featured_image ? (
                          <img src={post.featured_image} alt={post.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div className="w-100 h-100 d-flex align-items-center justify-content-center"
                            style={{ fontSize: 22 }}>✍️</div>
                        )}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div className="fw-semibold text-dark text-truncate"
                          style={{ fontSize: 13, lineHeight: 1.4 }}>
                          {post.title}
                        </div>
                        <small className="text-muted" style={{ fontSize: 11 }}>
                          {post.views || 0} views
                        </small>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
                <h6 className="fw-bold mb-3">🏷️ Tags</h6>
                <div className="d-flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button key={tag.id}
                      onClick={() => setTagId(tagId === String(tag.id) ? '' : String(tag.id))}
                      className="btn btn-sm"
                      style={{
                        borderRadius: 20, fontSize: 12,
                        background: tagId === String(tag.id) ? '#00b894' : '#f3f4f6',
                        color: tagId === String(tag.id) ? '#fff' : '#374151',
                        border: 'none'
                      }}>
                      # {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blogs