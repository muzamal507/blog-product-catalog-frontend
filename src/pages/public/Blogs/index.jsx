import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const blogs = [
  {
    id: 1,
    slug: 'art-of-automatic-watches',
    category: 'Timepieces',
    title: 'The Art of Automatic Watches: Why Mechanical Still Wins',
    excerpt: 'In a world of smartwatches and digital precision, the mechanical automatic watch stands as a testament to human ingenuity. We explore why collectors still prefer the heartbeat of a rotor over a battery.',
    author: 'Marcus Vance',
    authorRole: 'Watch Curator',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    date: 'August 20, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    featured: true,
  },
  {
    id: 2,
    slug: 'mechanical-keyboards-guide',
    category: 'Peripherals',
    title: 'Mechanical Keyboards: A Complete Buyer\'s Guide for 2026',
    excerpt: 'From linear switches to tactile bumps — choosing a mechanical keyboard is more personal than you think. Here\'s everything you need to know before buying your first custom board.',
    author: 'Sarah Ahmed',
    authorRole: 'Tech Editor',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    date: 'August 15, 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    featured: false,
  },
  {
    id: 3,
    slug: 'anc-headphones-worth-it',
    category: 'Acoustics',
    title: 'Are ANC Headphones Worth It in 2026? Our Honest Review',
    excerpt: 'Active Noise Cancellation has come a long way. But is it worth the premium price tag? We test the Acoustics Studio Pro ANC in real-world conditions — from cafes to flights.',
    author: 'Bilal Sheikh',
    authorRole: 'Audio Specialist',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    date: 'August 10, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    featured: false,
  },
  {
    id: 4,
    slug: 'full-grain-leather-travel-gear',
    category: 'Travel Gear',
    title: 'Full-Grain Leather: Why It\'s the Only Travel Gear Worth Buying',
    excerpt: 'Not all leather is created equal. Full-grain leather ages beautifully, resists moisture, and outlasts synthetic alternatives by decades. Here\'s why we only stock the real thing.',
    author: 'Fatima Noor',
    authorRole: 'Gear Curator',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    date: 'August 5, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    featured: false,
  },
  {
    id: 5,
    slug: 'cash-on-delivery-trust',
    category: 'About Us',
    title: 'Why We Only Do Cash on Delivery — And Why That Builds Trust',
    excerpt: 'In an era of online fraud and counterfeit products, we made a bold decision: no online payments. Here\'s the philosophy behind our COD-only model and how it protects our buyers.',
    author: 'Marcus Vance',
    authorRole: 'Watch Curator',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    date: 'July 28, 2026',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    featured: false,
  },
  {
    id: 6,
    slug: 'titanium-vs-stainless-steel',
    category: 'Timepieces',
    title: 'Titanium vs Stainless Steel Watch Cases: What\'s the Difference?',
    excerpt: 'Both materials are premium, but they serve different wrists. We break down the weight, durability, finishing options, and long-term value of each material.',
    author: 'Sarah Ahmed',
    authorRole: 'Tech Editor',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    date: 'July 20, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=80',
    featured: false,
  },
]

const categories = ['All', 'Timepieces', 'Peripherals', 'Acoustics', 'Travel Gear', 'About Us']

function Blogs() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  const featured = blogs.find(b => b.featured)
  const filtered = blogs.filter(b => {
    const matchCat = activeCategory === 'All' || b.category === activeCategory
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch && !b.featured
  })

  return (
    <div>
      {/* Hero Banner */}
      <div className="py-5 text-center" style={{ background: 'linear-gradient(135deg, #0d1b2a, #0f2d40)' }}>
        <small className="fw-bold text-uppercase" style={{ color: '#00b894', letterSpacing: 2 }}>
          CHRONICLES
        </small>
        <h1 className="fw-bold text-white mt-2 mb-2">Vision & Knowledge Blog</h1>
        <p style={{ color: '#8fa3b8', maxWidth: 500, margin: '0 auto 28px' }}>
          Deep dives into watches, peripherals, travel gear, and the philosophy behind premium physical products.
        </p>
        {/* Search */}
        <div className="mx-auto" style={{ maxWidth: 420 }}>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">🔍</span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container py-5">

        {/* Featured Post */}
        {featured && activeCategory === 'All' && !search && (
          <div className="mb-5">
            <small className="fw-bold text-uppercase" style={{ color: '#00b894', letterSpacing: 2 }}>
              FEATURED POST
            </small>
            <div className="card border-0 shadow-sm overflow-hidden mt-2" style={{ borderRadius: 16 }}>
              <div className="row g-0">
                <div className="col-md-6">
                  <img src={featured.image} alt={featured.title}
                    className="w-100 h-100 object-fit-cover" style={{ minHeight: 300 }} />
                </div>
                <div className="col-md-6 d-flex align-items-center p-4 p-lg-5">
                  <div>
                    <span className="badge mb-3 px-3 py-2" style={{ background: '#00b89420', color: '#00b894', fontSize: 12 }}>
                      {featured.category}
                    </span>
                    <h2 className="fw-bold mb-3" style={{ fontSize: 24, lineHeight: 1.3 }}>
                      {featured.title}
                    </h2>
                    <p className="text-muted mb-4" style={{ fontSize: 14, lineHeight: 1.8 }}>
                      {featured.excerpt}
                    </p>
                    <div className="d-flex align-items-center gap-3 mb-4">
                      <img src={featured.avatar} alt={featured.author}
                        className="rounded-circle" style={{ width: 38, height: 38, objectFit: 'cover' }} />
                      <div>
                        <div className="fw-semibold" style={{ fontSize: 13 }}>{featured.author}</div>
                        <small className="text-muted">{featured.date} · {featured.readTime}</small>
                      </div>
                    </div>
                    <Link to={`/blogs/${featured.slug}`}
                      className="btn text-white fw-semibold px-4"
                      style={{ background: '#00b894', borderRadius: 8 }}>
                      Read Article →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="d-flex gap-2 flex-wrap mb-4">
          {categories.map(cat => (
            <button key={cat}
              onClick={() => setActiveCategory(cat)}
              className="btn btn-sm fw-semibold px-3"
              style={{
                borderRadius: 20,
                background: activeCategory === cat ? '#00b894' : '#f3f4f6',
                color: activeCategory === cat ? '#fff' : '#374151',
                border: 'none',
                transition: 'all 0.2s'
              }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <div style={{ fontSize: 48 }}>📭</div>
            <p className="mt-3">No articles found. Try a different search or category.</p>
          </div>
        ) : (
          <div className="row g-4">
            {filtered.map(blog => (
              <div className="col-12 col-md-6 col-lg-4" key={blog.id}>
                <div className="card border-0 shadow-sm h-100"
                  style={{ borderRadius: 12, transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,.12)'
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = ''
                    e.currentTarget.style.boxShadow = ''
                  }}>
                  {/* Image */}
                  <div className="overflow-hidden" style={{ borderRadius: '12px 12px 0 0', aspectRatio: '16/9' }}>
                    <img src={blog.image} alt={blog.title}
                      className="w-100 h-100 object-fit-cover"
                      style={{ transition: 'transform 0.4s' }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={e => e.currentTarget.style.transform = ''} />
                  </div>

                  <div className="card-body d-flex flex-column p-4">
                    {/* Category */}
                    <span className="badge mb-2 px-2 py-1 align-self-start"
                      style={{ background: '#00b89420', color: '#00b894', fontSize: 11 }}>
                      {blog.category}
                    </span>

                    {/* Title */}
                    <h6 className="fw-bold mb-2" style={{ fontSize: 15, lineHeight: 1.5 }}>
                      {blog.title}
                    </h6>

                    {/* Excerpt */}
                    <p className="text-muted flex-fill mb-3"
                      style={{ fontSize: 13, lineHeight: 1.7,
                        display: '-webkit-box', WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {blog.excerpt}
                    </p>

                    {/* Author + Read */}
                    <div className="d-flex align-items-center justify-content-between mt-auto pt-3"
                      style={{ borderTop: '1px solid #f0f0f0' }}>
                      <div className="d-flex align-items-center gap-2">
                        <img src={blog.avatar} alt={blog.author}
                          className="rounded-circle" style={{ width: 30, height: 30, objectFit: 'cover' }} />
                        <div>
                          <div className="fw-semibold" style={{ fontSize: 12 }}>{blog.author}</div>
                          <small className="text-muted" style={{ fontSize: 11 }}>{blog.readTime}</small>
                        </div>
                      </div>
                      <Link to={`/blogs/${blog.slug}`}
                        className="btn btn-sm fw-semibold"
                        style={{ color: '#00b894', background: '#00b89415', borderRadius: 8, fontSize: 12 }}>
                        Read →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Blogs