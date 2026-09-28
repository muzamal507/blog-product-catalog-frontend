import React, { useState, useEffect } from 'react'
import seoService from '../../../services/seoSettingService'

const INITIAL = {
  meta_title:          '',
  meta_description:    '',
  meta_keywords:       '',
  canonical_url:       '',
  robots:              'index, follow',
  og_title:            '',
  og_description:      '',
  twitter_title:       '',
  twitter_description: '',
  schema_markup:       '',
}

function AdminSeoSettings() {
  const [form, setForm]         = useState(INITIAL)
  const [seoId, setSeoId]       = useState(null)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  // OG + Twitter images
  const [ogImage, setOgImage]           = useState(null)
  const [twitterImage, setTwitterImage] = useState(null)
  const [ogPreview, setOgPreview]       = useState(null)
  const [twitterPreview, setTwitterPreview] = useState(null)

  useEffect(() => {
    seoService.getPublic()
      .then(res => {
        const s = res.data.data || res.data
        if (s?.id) {
          setSeoId(s.id)
          setForm({
            meta_title:          s.meta_title || '',
            meta_description:    s.meta_description || '',
            meta_keywords:       s.meta_keywords || '',
            canonical_url:       s.canonical_url || '',
            robots:              s.robots || 'index, follow',
            og_title:            s.og_title || '',
            og_description:      s.og_description || '',
            twitter_title:       s.twitter_title || '',
            twitter_description: s.twitter_description || '',
            schema_markup:       s.schema_markup || '',
          })
          if (s.og_image)      setOgPreview(s.og_image)
          if (s.twitter_image) setTwitterPreview(s.twitter_image)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== '') fd.append(k, v)
    })
    if (ogImage)      fd.append('og_image', ogImage)
    if (twitterImage) fd.append('twitter_image', twitterImage)

    try {
      if (seoId) {
        await seoService.update(seoId, fd)
      } else {
        const res = await seoService.store(fd)
        setSeoId(res.data.setting?.id || res.data.data?.id)
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save SEO settings.')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { key: 'basic',   label: '🔍 Basic SEO'    },
    { key: 'og',      label: '📘 Open Graph'   },
    { key: 'twitter', label: '🐦 Twitter Card' },
    { key: 'advanced',label: '⚙️ Advanced'     },
  ]

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border" style={{ color: '#00b894' }} />
    </div>
  )

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">SEO Settings</h4>
          <small className="text-muted">
            Manage global SEO meta tags and social sharing
          </small>
        </div>
        {saved && (
          <span className="badge px-3 py-2"
            style={{ background: '#d1fae5', color: '#059669', fontSize: 13 }}>
            ✅ SEO Settings saved!
          </span>
        )}
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        {tabs.map(tab => (
          <li className="nav-item" key={tab.key}>
            <button
              className={`nav-link ${activeTab === tab.key ? 'active fw-semibold' : ''}`}
              style={activeTab === tab.key
                ? { color: '#00b894', borderBottomColor: '#00b894' }
                : { color: '#6b7280' }}
              onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-12 col-lg-8">

            {/* BASIC SEO */}
            {activeTab === 'basic' && (
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
                <h6 className="fw-bold mb-4">Basic SEO Settings</h6>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Meta Title <span className="text-danger">*</span>
                  </label>
                  <input type="text" name="meta_title" className="form-control"
                    placeholder="Your Site Name | Tagline"
                    value={form.meta_title} onChange={handleChange} />
                  <div className="d-flex justify-content-between mt-1">
                    <small className="text-muted">Recommended: 50–60 chars</small>
                    <small className={form.meta_title.length > 60 ? 'text-danger' : 'text-muted'}>
                      {form.meta_title.length}/60
                    </small>
                  </div>
                  {/* Preview */}
                  {form.meta_title && (
                    <div className="mt-2 p-3 rounded-3" style={{ background: '#f9fafb' }}>
                      <div style={{ color: '#1a0dab', fontSize: 18 }}>{form.meta_title}</div>
                      <div style={{ color: '#006621', fontSize: 13 }}>
                        {form.canonical_url || 'https://yoursite.com'}
                      </div>
                      {form.meta_description && (
                        <div style={{ color: '#545454', fontSize: 13, marginTop: 4 }}>
                          {form.meta_description.slice(0, 160)}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Meta Description
                  </label>
                  <textarea name="meta_description" rows={3} className="form-control"
                    placeholder="Brief description of your site for search engines..."
                    value={form.meta_description} onChange={handleChange} />
                  <div className="d-flex justify-content-between mt-1">
                    <small className="text-muted">Recommended: 120–160 chars</small>
                    <small className={form.meta_description.length > 160 ? 'text-danger' : 'text-muted'}>
                      {form.meta_description.length}/160
                    </small>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Meta Keywords
                  </label>
                  <input type="text" name="meta_keywords" className="form-control"
                    placeholder="watches, luxury, premium, authentic..."
                    value={form.meta_keywords} onChange={handleChange} />
                  <small className="text-muted">Comma-separated keywords</small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Canonical URL
                  </label>
                  <input type="url" name="canonical_url" className="form-control"
                    placeholder="https://yoursite.com"
                    value={form.canonical_url} onChange={handleChange} />
                </div>

                <div className="mb-0">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Robots
                  </label>
                  <select name="robots" className="form-select"
                    value={form.robots} onChange={handleChange}>
                    <option value="index, follow">index, follow (Default — Allow all)</option>
                    <option value="noindex, follow">noindex, follow (Hide from search)</option>
                    <option value="index, nofollow">index, nofollow (Don't follow links)</option>
                    <option value="noindex, nofollow">noindex, nofollow (Block everything)</option>
                  </select>
                </div>
              </div>
            )}

            {/* OPEN GRAPH */}
            {activeTab === 'og' && (
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
                <h6 className="fw-bold mb-1">Open Graph Settings</h6>
                <p className="text-muted mb-4" style={{ fontSize: 13 }}>
                  Controls how your site looks when shared on Facebook, LinkedIn, WhatsApp etc.
                </p>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>OG Title</label>
                  <input type="text" name="og_title" className="form-control"
                    placeholder="AeroLux — Premium Authentic Products"
                    value={form.og_title} onChange={handleChange} />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>OG Description</label>
                  <textarea name="og_description" rows={3} className="form-control"
                    placeholder="Description shown when shared on social media..."
                    value={form.og_description} onChange={handleChange} />
                </div>

                {/* OG Image */}
                <div className="mb-0">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    OG Image
                    <small className="text-muted fw-normal ms-2">1200×630px recommended</small>
                  </label>
                  {ogPreview ? (
                    <div className="position-relative mb-3">
                      <img src={ogPreview} alt="OG preview"
                        className="w-100 rounded-3"
                        style={{ height: 200, objectFit: 'cover' }} />
                      <button type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                        onClick={() => { setOgPreview(null); setOgImage(null) }}>✕</button>
                    </div>
                  ) : (
                    <label htmlFor="og-img"
                      className="d-block text-center p-4 rounded-3 mb-2"
                      style={{ background: '#f9fafb', border: '2px dashed #e5e7eb', cursor: 'pointer' }}>
                      <div style={{ fontSize: 36 }}>🖼️</div>
                      <small className="text-muted d-block mt-1">Click to upload OG image</small>
                    </label>
                  )}
                  <input type="file" id="og-img" className="d-none"
                    accept="image/*"
                    onChange={e => {
                      const f = e.target.files[0]
                      if (f) { setOgImage(f); setOgPreview(URL.createObjectURL(f)) }
                    }} />
                  <label htmlFor="og-img" className="btn btn-outline-secondary btn-sm">
                    📁 Choose OG Image
                  </label>
                </div>
              </div>
            )}

            {/* TWITTER CARD */}
            {activeTab === 'twitter' && (
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
                <h6 className="fw-bold mb-1">Twitter Card Settings</h6>
                <p className="text-muted mb-4" style={{ fontSize: 13 }}>
                  Controls how your site looks when shared on Twitter/X.
                </p>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Twitter Title
                  </label>
                  <input type="text" name="twitter_title" className="form-control"
                    placeholder="AeroLux — Premium Authentic Products"
                    value={form.twitter_title} onChange={handleChange} />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Twitter Description
                  </label>
                  <textarea name="twitter_description" rows={3} className="form-control"
                    placeholder="Description shown on Twitter cards..."
                    value={form.twitter_description} onChange={handleChange} />
                </div>

                {/* Twitter Image */}
                <div className="mb-0">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Twitter Image
                    <small className="text-muted fw-normal ms-2">1200×600px recommended</small>
                  </label>
                  {twitterPreview ? (
                    <div className="position-relative mb-3">
                      <img src={twitterPreview} alt="Twitter preview"
                        className="w-100 rounded-3"
                        style={{ height: 200, objectFit: 'cover' }} />
                      <button type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                        onClick={() => { setTwitterPreview(null); setTwitterImage(null) }}>✕</button>
                    </div>
                  ) : (
                    <label htmlFor="twitter-img"
                      className="d-block text-center p-4 rounded-3 mb-2"
                      style={{ background: '#f9fafb', border: '2px dashed #e5e7eb', cursor: 'pointer' }}>
                      <div style={{ fontSize: 36 }}>🐦</div>
                      <small className="text-muted d-block mt-1">Click to upload Twitter image</small>
                    </label>
                  )}
                  <input type="file" id="twitter-img" className="d-none"
                    accept="image/*"
                    onChange={e => {
                      const f = e.target.files[0]
                      if (f) { setTwitterImage(f); setTwitterPreview(URL.createObjectURL(f)) }
                    }} />
                  <label htmlFor="twitter-img" className="btn btn-outline-secondary btn-sm">
                    📁 Choose Twitter Image
                  </label>
                </div>
              </div>
            )}

            {/* ADVANCED */}
            {activeTab === 'advanced' && (
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
                <h6 className="fw-bold mb-1">Advanced SEO</h6>
                <p className="text-muted mb-4" style={{ fontSize: 13 }}>
                  Schema markup helps search engines understand your content better.
                </p>

                <div className="mb-0">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Schema Markup (JSON-LD)
                  </label>
                  <textarea name="schema_markup" rows={12}
                    className="form-control font-monospace"
                    style={{ fontSize: 12, lineHeight: 1.7 }}
                    placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "AeroLux",\n  "url": "https://yoursite.com"\n}`}
                    value={form.schema_markup} onChange={handleChange} />
                  <small className="text-muted">
                    Valid JSON-LD schema. Will be injected into page head.
                  </small>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-4">Save Settings</h6>

              <div className="p-3 rounded-3 mb-4"
                style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <div className="fw-semibold mb-1" style={{ fontSize: 13, color: '#059669' }}>
                  {seoId ? '✅ Settings exist' : '🆕 New settings'}
                </div>
                <small className="text-muted">
                  {seoId
                    ? 'Changes will update existing settings.'
                    : 'This will create your SEO settings.'}
                </small>
              </div>

              {/* Checklist */}
              <div className="mb-4">
                <small className="fw-semibold text-muted d-block mb-2">SEO Checklist</small>
                {[
                  ['Meta Title',       form.meta_title.length >= 10],
                  ['Meta Description', form.meta_description.length >= 50],
                  ['Canonical URL',    Boolean(form.canonical_url)],
                  ['OG Title',         Boolean(form.og_title)],
                  ['OG Image',         Boolean(ogPreview)],
                  ['Twitter Title',    Boolean(form.twitter_title)],
                ].map(([label, done]) => (
                  <div key={label} className="d-flex align-items-center gap-2 mb-1">
                    <span style={{ color: done ? '#059669' : '#d1d5db', fontSize: 14 }}>
                      {done ? '✅' : '⭕'}
                    </span>
                    <small style={{ color: done ? '#059669' : '#9ca3af', fontSize: 12 }}>
                      {label}
                    </small>
                  </div>
                ))}
              </div>

              <button type="submit"
                className="btn w-100 text-white fw-semibold"
                style={{ background: '#00b894', borderRadius: 8 }}
                disabled={saving}>
                {saving
                  ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                  : saved ? '✅ Saved!'
                  : '💾 Save SEO Settings'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AdminSeoSettings