import React from 'react'
import { useParams, Link } from 'react-router-dom'

const blogs = [
  {
    id: 1,
    slug: 'art-of-automatic-watches',
    category: 'Timepieces',
    title: 'The Art of Automatic Watches: Why Mechanical Still Wins',
    author: 'Marcus Vance',
    authorRole: 'Watch Curator',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    date: 'August 20, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80',
    content: `
      In a world dominated by smartwatches and digital precision, the mechanical automatic watch stands as a remarkable testament to centuries of human ingenuity. There's something deeply satisfying about a device that powers itself through the natural motion of the wearer's wrist.

      ## What Makes a Watch "Automatic"?

      An automatic watch, also called a self-winding watch, uses a weighted rotor that spins with the motion of the wrist. This rotor winds the mainspring, which stores energy to power the movement. No batteries, no charging cables — just physics and craftsmanship working in harmony.

      ## The Collector's Perspective

      For serious collectors, an automatic watch is never just a timekeeping device. It's a mechanical sculpture — a window into a tradition that predates the industrial revolution. The sound of the escapement ticking, the sweep of the seconds hand, the visible exhibition case back — these are experiences that no digital device can replicate.

      ## Why Chronos Chose Titanium

      The Chronos Titanium V1 Automatic uses grade-5 titanium for its case — the same material used in aerospace applications. It's 40% lighter than stainless steel while being equally strong. Combined with a sapphire crystal and 100m water resistance, it's built to last a lifetime.

      ## The Investment Argument

      Unlike electronics that depreciate rapidly, a well-maintained mechanical watch retains and often appreciates in value. Limited run watches especially — produced in small quantities with meticulous finishing — have consistently outperformed traditional investments over decades.

      ## Our Verdict

      If you've never owned an automatic watch, the Chronos Titanium V1 is the perfect entry point into the world of mechanical horology. It's not just a purchase — it's the beginning of a relationship with an object built to outlast you.
    `,
    tags: ['Watches', 'Automatic', 'Titanium', 'Chronos', 'Horology'],
  },
]

function BlogDetail() {
  const { slug } = useParams()
  const blog = blogs.find(b => b.slug === slug)

  if (!blog) {
    return (
      <div className="text-center py-5">
        <div style={{ fontSize: 64 }}>📄</div>
        <h4 className="mt-3">Article not found</h4>
        <Link to="/blogs" className="btn mt-3 text-white" style={{ background: '#00b894' }}>
          ← Back to Blogs
        </Link>
      </div>
    )
  }

  // Convert markdown-style content to paragraphs
  const renderContent = (text) => {
    return text.trim().split('\n\n').map((block, i) => {
      if (block.startsWith('## ')) {
        return <h4 key={i} className="fw-bold mt-4 mb-2">{block.replace('## ', '')}</h4>
      }
      return <p key={i} className="text-muted" style={{ fontSize: 15, lineHeight: 1.9 }}>{block.trim()}</p>
    })
  }

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg,#0d1b2a,#0f2d40)',
        padding: '60px 20px 80px'
      }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <Link to="/blogs" className="d-inline-flex align-items-center gap-2 mb-4"
            style={{ color: '#8fa3b8', fontSize: 14, textDecoration: 'none' }}>
            ← Back to Blogs
          </Link>
          <span className="badge px-3 py-2 mb-3 d-block w-auto d-inline-block"
            style={{ background: '#00b89430', color: '#00b894', fontSize: 12 }}>
            {blog.category}
          </span>
          <h1 className="fw-bold text-white mb-4" style={{ fontSize: 32, lineHeight: 1.3 }}>
            {blog.title}
          </h1>
          <div className="d-flex align-items-center gap-3">
            <img src={blog.avatar} alt={blog.author}
              className="rounded-circle" style={{ width: 44, height: 44, objectFit: 'cover' }} />
            <div>
              <div className="text-white fw-semibold" style={{ fontSize: 14 }}>{blog.author}</div>
              <small style={{ color: '#8fa3b8' }}>{blog.authorRole} · {blog.date} · {blog.readTime}</small>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="container" style={{ maxWidth: 760, marginTop: -40 }}>
        <img src={blog.image} alt={blog.title}
          className="w-100 shadow" style={{ borderRadius: 12, height: 380, objectFit: 'cover' }} />
      </div>

      {/* Content */}
      <div className="container py-5" style={{ maxWidth: 760 }}>
        <div className="mb-5">
          {renderContent(blog.content)}
        </div>

        {/* Tags */}
        <div className="d-flex flex-wrap gap-2 mb-5 pt-4" style={{ borderTop: '1px solid #f0f0f0' }}>
          {blog.tags.map(tag => (
            <span key={tag} className="badge px-3 py-2"
              style={{ background: '#f3f4f6', color: '#374151', fontWeight: 500, fontSize: 12 }}>
              #{tag}
            </span>
          ))}
        </div>

        {/* Author Card */}
        <div className="card border-0 p-4 mb-5" style={{ background: '#f9fafb', borderRadius: 12 }}>
          <div className="d-flex align-items-center gap-3">
            <img src={blog.avatar} alt={blog.author}
              className="rounded-circle" style={{ width: 60, height: 60, objectFit: 'cover' }} />
            <div>
              <div className="fw-bold mb-1">{blog.author}</div>
              <div className="text-muted mb-2" style={{ fontSize: 13 }}>{blog.authorRole}</div>
              <small className="text-muted">
                Curator at AeroLux with over 10 years of experience in premium physical product curation and authentication.
              </small>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Link to="/blogs" className="btn text-white fw-semibold px-4"
            style={{ background: '#00b894', borderRadius: 8 }}>
            ← Browse More Articles
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BlogDetail