import React from 'react'
import { Link } from 'react-router-dom'
import { useSettings } from '../../../context/SettingContext'

function AboutPage() {
  const { settings } = useSettings()

  return (
    <div>
      {/* Hero */}
      <div className="py-5 text-center position-relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#0d1b2a,#0f2d40)', minHeight: 320,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06,
          background: 'url(https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1400&q=80) center/cover' }} />
        <div className="position-relative" style={{ zIndex: 2 }}>
          <small className="fw-bold text-uppercase"
            style={{ color: '#00b894', letterSpacing: 2, fontSize: 11 }}>
            OUR STORY
          </small>
          <h1 className="fw-bold text-white mt-2 mb-3"
            style={{ fontSize: 'clamp(26px,4vw,48px)' }}>
            {settings?.site_name || 'AeroLux'}
          </h1>
          <p style={{ color: '#8fa3b8', maxWidth: 560, margin: '0 auto',
            fontSize: 16, lineHeight: 1.8 }}>
            {settings?.site_tagline || 'Curated limited edition runs of premium physical products'}
          </p>
        </div>
      </div>

      <div className="container py-5">

        {/* Mission */}
        <div className="row g-5 align-items-center mb-5">
          <div className="col-12 col-md-6">
            <div className="rounded-3 overflow-hidden" style={{ height: 380 }}>
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"
                alt="Our Mission"
                className="w-100 h-100"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <small className="fw-bold text-uppercase"
              style={{ color: '#00b894', letterSpacing: 2, fontSize: 11 }}>
              OUR MISSION
            </small>
            <h2 className="fw-bold mt-2 mb-4"
              style={{ fontSize: 'clamp(22px,3vw,34px)', color: '#1a1a2e' }}>
              The Art of Physical Permanence
            </h2>
            <p className="text-muted mb-3" style={{ fontSize: 15, lineHeight: 1.9 }}>
              {settings?.site_description ||
                `We believe in the enduring value of physical objects crafted with intention.
                In a world of disposable products and digital noise, we curate things that last —
                automatic watches that outlive their owners, keyboards built to survive decades,
                and leather goods that improve with age.`}
            </p>
            <p className="text-muted mb-4" style={{ fontSize: 15, lineHeight: 1.9 }}>
              Every product in our catalog has been physically handled, tested, and verified
              by our team before it reaches you. No replicas. No compromises.
            </p>
            <div className="d-flex gap-3">
              <Link to="/catalog"
                className="btn text-white fw-semibold px-4"
                style={{ background: '#00b894', borderRadius: 8 }}>
                Browse Catalog →
              </Link>
              <Link to="/contact"
                className="btn btn-outline-secondary px-4"
                style={{ borderRadius: 8 }}>
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-5">
          {[
            { icon: '📦', value: '500+',   label: 'Curated Products'      },
            { icon: '✅', value: '100%',   label: 'Authenticity Rate'     },
            { icon: '⭐', value: '4.9/5',  label: 'Customer Satisfaction' },
            { icon: '🔄', value: '7-Day',  label: 'Return Policy'         },
          ].map(s => (
            <div className="col-6 col-md-3" key={s.label}>
              <div className="card border-0 shadow-sm p-4 text-center h-100"
                style={{ borderRadius: 12 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{s.icon}</div>
                <div className="fw-bold mb-1"
                  style={{ fontSize: 28, color: '#00b894' }}>{s.value}</div>
                <small className="text-muted">{s.label}</small>
              </div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="py-5 px-4 rounded-3 mb-5"
          style={{ background: '#0d1b2a' }}>
          <div className="text-center mb-4">
            <small className="fw-bold text-uppercase"
              style={{ color: '#00b894', letterSpacing: 2, fontSize: 11 }}>
              WHAT WE STAND FOR
            </small>
            <h2 className="fw-bold text-white mt-2"
              style={{ fontSize: 'clamp(20px,3vw,30px)' }}>
              Our Core Values
            </h2>
          </div>
          <div className="row g-4">
            {[
              {
                icon: '🛡️',
                title: 'Authenticity',
                desc: 'Every single product is physically verified. We handle it ourselves before it reaches you. No exceptions.'
              },
              {
                icon: '🚪',
                title: 'Transparency',
                desc: 'Cash on Delivery only. Open the box, inspect the product, then pay. We have nothing to hide.'
              },
              {
                icon: '🔬',
                title: 'Curation',
                desc: 'We don\'t sell everything — we sell the right things. Limited runs, verified quality, permanent value.'
              },
              {
                icon: '🤝',
                title: 'Trust',
                desc: 'Your satisfaction is guaranteed. If something isn\'t right, our 7-day return policy protects you.'
              },
            ].map(v => (
              <div className="col-12 col-sm-6 col-lg-3" key={v.title}>
                <div className="text-center p-3 rounded-3"
                  style={{ border: '1px solid rgba(255,255,255,.08)' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{v.icon}</div>
                  <h6 className="fw-bold text-white mb-2">{v.title}</h6>
                  <small style={{ color: '#8fa3b8', lineHeight: 1.7 }}>{v.desc}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-5">
          <div className="text-center mb-4">
            <small className="fw-bold text-uppercase"
              style={{ color: '#00b894', letterSpacing: 2, fontSize: 11 }}>
              THE PROCESS
            </small>
            <h2 className="fw-bold mt-2"
              style={{ fontSize: 'clamp(20px,3vw,30px)', color: '#1a1a2e' }}>
              How We Work
            </h2>
          </div>

          <div className="row g-4">
            {[
              {
                step: '01',
                icon: '🔍',
                title: 'Source & Verify',
                desc: 'We source directly from manufacturers and trusted suppliers. Every product is physically inspected by our team.'
              },
              {
                step: '02',
                icon: '📦',
                title: 'List & Describe',
                desc: 'We photograph and describe each product honestly — including any limitations. What you see is what you get.'
              },
              {
                step: '03',
                icon: '🚚',
                title: 'Deliver & Verify',
                desc: 'We deliver to your doorstep. You open and inspect the product in front of our delivery agent before paying.'
              },
              {
                step: '04',
                icon: '💵',
                title: 'Pay on Receipt',
                desc: 'Only after you\'re satisfied do you pay. Cash on delivery — the safest way to buy premium products online.'
              },
            ].map((item, i) => (
              <div className="col-12 col-sm-6 col-lg-3" key={item.step}>
                <div className="card border-0 shadow-sm p-4 h-100 text-center"
                  style={{ borderRadius: 12 }}>
                  <div className="fw-bold mb-2"
                    style={{ color: '#00b894', fontSize: 12, letterSpacing: 2 }}>
                    STEP {item.step}
                  </div>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>{item.icon}</div>
                  <h6 className="fw-bold mb-2">{item.title}</h6>
                  <p className="text-muted mb-0" style={{ fontSize: 13, lineHeight: 1.7 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-5">
          <div className="text-center mb-4">
            <small className="fw-bold text-uppercase"
              style={{ color: '#00b894', letterSpacing: 2, fontSize: 11 }}>
              THE PEOPLE
            </small>
            <h2 className="fw-bold mt-2"
              style={{ fontSize: 'clamp(20px,3vw,30px)', color: '#1a1a2e' }}>
              Our Team
            </h2>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              {
                name: 'Marcus Vance',
                role: 'Watch Curator & Founder',
                avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                bio: '10+ years in horology. Certified watchmaker.'
              },
              {
                name: 'Sarah Ahmed',
                role: 'Tech Peripherals Editor',
                avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                bio: 'Former product designer. Keyboard enthusiast.'
              },
              {
                name: 'Bilal Sheikh',
                role: 'Audio Specialist',
                avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
                bio: 'Sound engineer turned audio gear curator.'
              },
            ].map(member => (
              <div className="col-12 col-sm-6 col-md-4" key={member.name}>
                <div className="card border-0 shadow-sm p-4 text-center h-100"
                  style={{ borderRadius: 12 }}>
                  <img src={member.avatar} alt={member.name}
                    className="rounded-circle mx-auto mb-3"
                    style={{ width: 80, height: 80, objectFit: 'cover',
                      border: '3px solid #00b894' }} />
                  <h6 className="fw-bold mb-1">{member.name}</h6>
                  <div className="mb-2" style={{ color: '#00b894', fontSize: 13, fontWeight: 600 }}>
                    {member.role}
                  </div>
                  <small className="text-muted">{member.bio}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="py-5 px-4 px-md-5 rounded-3 text-center"
          style={{ background: 'linear-gradient(135deg,#0d1b2a,#0f2d40)' }}>
          <h3 className="fw-bold text-white mb-2"
            style={{ fontSize: 'clamp(20px,3vw,28px)' }}>
            Ready to Experience the Difference?
          </h3>
          <p style={{ color: '#8fa3b8', marginBottom: 24 }}>
            Browse our curated catalog — every product verified, every purchase protected.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/catalog"
              className="btn text-white fw-semibold px-5 py-2"
              style={{ background: '#00b894', borderRadius: 8 }}>
              Explore Catalog →
            </Link>
            <Link to="/contact"
              className="btn fw-semibold px-5 py-2"
              style={{ border: '2px solid rgba(255,255,255,.3)',
                color: '#fff', borderRadius: 8, background: 'transparent' }}>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage