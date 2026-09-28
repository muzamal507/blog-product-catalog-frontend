import React, { useState, useEffect } from 'react'
import settingService from '../../../services/settingService'

const INITIAL = {
  site_name:            '',
  site_tagline:         '',
  site_description:     '',
  site_email:           '',
  site_phone:           '',
  site_address:         '',
  facebook_url:         '',
  twitter_url:          '',
  instagram_url:        '',
  linkedin_url:         '',
  youtube_url:          '',
  copyright:            'Tahir Tech Solutions.',
  timezone:             'Asia/Karachi',
  language:             'English',
  posts_per_page:       10,
  allow_comments:       true,
  maintenance_mode:     false,
  default_post_status:  'Draft',
  google_analytics:     '',
  google_search_console:'',
}

function AdminSettings() {
  const [form, setForm]         = useState(INITIAL)
  const [logo, setLogo]         = useState(null)
  const [favicon, setFavicon]   = useState(null)
  const [logoPreview, setLogoPreview]     = useState(null)
  const [faviconPreview, setFaviconPreview] = useState(null)
  const [settingId, setSettingId]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  // Load existing settings
  useEffect(() => {
    settingService.getPublic()
      .then(res => {
        const data = res.data.data
        const s    = Array.isArray(data) ? data[0] : data
        if (s) {
          setSettingId(s.id)
          setForm({
            site_name:             s.site_name || '',
            site_tagline:          s.site_tagline || '',
            site_description:      s.site_description || '',
            site_email:            s.site_email || '',
            site_phone:            s.site_phone || '',
            site_address:          s.site_address || '',
            facebook_url:          s.facebook_url || '',
            twitter_url:           s.twitter_url || '',
            instagram_url:         s.instagram_url || '',
            linkedin_url:          s.linkedin_url || '',
            youtube_url:           s.youtube_url || '',
            copyright:             s.copyright || 'Tahir Tech Solutions.',
            timezone:              s.timezone || 'Asia/Karachi',
            language:              s.language || 'English',
            posts_per_page:        s.posts_per_page || 10,
            allow_comments:        s.allow_comments ?? true,
            maintenance_mode:      s.maintenance_mode ?? false,
            default_post_status:   s.default_post_status || 'Draft',
            google_analytics:      s.google_analytics || '',
            google_search_console: s.google_search_console || '',
          })
          if (s.logo_url)    setLogoPreview(s.logo_url)
          if (s.favicon_url) setFaviconPreview(s.favicon_url)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleLogo = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setLogo(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  const handleFavicon = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setFavicon(file)
    setFaviconPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => {
      if (typeof v === 'boolean') fd.append(k, v ? '1' : '0')
      else if (v !== null && v !== undefined) fd.append(k, v)
    })
    if (logo)    fd.append('logo', logo)
    if (favicon) fd.append('favicon', favicon)

    try {
      if (settingId) {
        await settingService.update(settingId, fd)
      } else {
        const res = await settingService.store(fd)
        setSettingId(res.data.data?.id)
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { key: 'general',  label: '⚙️ General'   },
    { key: 'contact',  label: '📞 Contact'   },
    { key: 'social',   label: '🔗 Social'    },
    { key: 'blog',     label: '✍️ Blog'       },
    { key: 'seo',      label: '🔍 SEO/Analytics' },
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
          <h4 className="fw-bold mb-1">Site Settings</h4>
          <small className="text-muted">Manage your site configuration</small>
        </div>
        {saved && (
          <span className="badge px-3 py-2"
            style={{ background: '#d1fae5', color: '#059669', fontSize: 13 }}>
            ✅ Settings saved!
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

            {/* GENERAL */}
            {activeTab === 'general' && (
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
                <h6 className="fw-bold mb-4">General Settings</h6>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Site Name <span className="text-danger">*</span>
                  </label>
                  <input type="text" name="site_name" className="form-control"
                    placeholder="AeroLux"
                    value={form.site_name} onChange={handleChange} />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Tagline</label>
                  <input type="text" name="site_tagline" className="form-control"
                    placeholder="Curated Premium Products"
                    value={form.site_tagline} onChange={handleChange} />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Site Description
                  </label>
                  <textarea name="site_description" rows={3} className="form-control"
                    placeholder="Describe your site..."
                    value={form.site_description} onChange={handleChange} />
                </div>

                {/* <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Copyright</label>
                  <input type="text" name="copyright" className="form-control"
                    placeholder="© 2026 AeroLux. All rights reserved."
                    value={form.copyright} onChange={handleChange} />
                </div> */}

                <div className="row g-3">
                  <div className="col-6">
                    <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Timezone</label>
                    <select name="timezone" className="form-select"
                      value={form.timezone} onChange={handleChange}>
                      <option value="Asia/Karachi">Asia/Karachi (PKT)</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Language</label>
                    <select name="language" className="form-select"
                      value={form.language} onChange={handleChange}>
                      <option value="English">English</option>
                      <option value="Urdu">Urdu</option>
                      <option value="Arabic">Arabic</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="checkbox"
                      name="maintenance_mode" id="maintenance"
                      checked={form.maintenance_mode} onChange={handleChange} />
                    <label className="form-check-label fw-semibold" htmlFor="maintenance"
                      style={{ fontSize: 13 }}>
                      🚧 Maintenance Mode
                      <small className="text-muted fw-normal ms-2">
                        Site will show maintenance page to visitors
                      </small>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* CONTACT */}
            {activeTab === 'contact' && (
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
                <h6 className="fw-bold mb-4">Contact Information</h6>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Site Email</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">✉</span>
                    <input type="email" name="site_email" className="form-control"
                      placeholder="info@yoursite.com"
                      value={form.site_email} onChange={handleChange} />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Phone</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">📞</span>
                    <input type="text" name="site_phone" className="form-control"
                      placeholder="+1 (555) 019-2834"
                      value={form.site_phone} onChange={handleChange} />
                  </div>
                </div>

                <div className="mb-0">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Address</label>
                  <textarea name="site_address" rows={3} className="form-control"
                    placeholder="Full business address..."
                    value={form.site_address} onChange={handleChange} />
                </div>
              </div>
            )}

            {/* SOCIAL */}
            {activeTab === 'social' && (
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
                <h6 className="fw-bold mb-4">Social Media Links</h6>
                {[
                  ['facebook_url',  'Facebook',  '📘'],
                  ['instagram_url', 'Instagram', '📸'],
                  ['twitter_url',   'Twitter/X', '🐦'],
                  ['youtube_url',   'YouTube',   '▶️'],
                  ['linkedin_url',  'LinkedIn',  '💼'],
                ].map(([name, label, icon]) => (
                  <div className="mb-3" key={name}>
                    <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                      {icon} {label}
                    </label>
                    <input type="url" name={name} className="form-control"
                      placeholder={`https://${label.toLowerCase().replace('/', '')}.com/yourpage`}
                      value={form[name]} onChange={handleChange} />
                  </div>
                ))}
              </div>
            )}

            {/* BLOG */}
            {activeTab === 'blog' && (
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
                <h6 className="fw-bold mb-4">Blog Settings</h6>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Posts Per Page
                  </label>
                  <input type="number" name="posts_per_page" className="form-control"
                    style={{ maxWidth: 120 }} min={1} max={50}
                    value={form.posts_per_page} onChange={handleChange} />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Default Post Status
                  </label>
                  <select name="default_post_status" className="form-select"
                    style={{ maxWidth: 200 }}
                    value={form.default_post_status} onChange={handleChange}>
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div className="form-check">
                  <input className="form-check-input" type="checkbox"
                    name="allow_comments" id="allow_comments"
                    checked={form.allow_comments} onChange={handleChange} />
                  <label className="form-check-label fw-semibold" htmlFor="allow_comments"
                    style={{ fontSize: 13 }}>
                    Allow Comments on Blog Posts
                  </label>
                </div>
              </div>
            )}

            {/* SEO */}
            {activeTab === 'seo' && (
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
                <h6 className="fw-bold mb-4">SEO & Analytics</h6>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Google Analytics Code
                  </label>
                  <textarea name="google_analytics" rows={4}
                    className="form-control font-monospace"
                    style={{ fontSize: 12 }}
                    placeholder="<!-- Google Analytics code here -->"
                    value={form.google_analytics} onChange={handleChange} />
                </div>

                <div className="mb-0">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Google Search Console
                  </label>
                  <textarea name="google_search_console" rows={3}
                    className="form-control font-monospace"
                    style={{ fontSize: 12 }}
                    placeholder="<meta name='google-site-verification' content='...' />"
                    value={form.google_search_console} onChange={handleChange} />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="col-12 col-lg-4">

            {/* Save */}
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 12 }}>
              <button type="submit"
                className="btn w-100 text-white fw-semibold py-2"
                style={{ background: '#00b894', borderRadius: 8 }}
                disabled={saving}>
                {saving
                  ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                  : saved ? '✅ Saved!' : '💾 Save Settings'}
              </button>
            </div>

            {/* Logo */}
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-3">Site Logo</h6>
              {logoPreview ? (
                <div className="position-relative mb-3">
                  <img src={logoPreview} alt="logo"
                    className="w-100 rounded-2"
                    style={{ height: 100, objectFit: 'contain', background: '#f9fafb' }} />
                  <button type="button"
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                    onClick={() => { setLogo(null); setLogoPreview(null) }}>✕</button>
                </div>
              ) : (
                <label htmlFor="logo-upload"
                  className="d-block text-center p-4 rounded-2 mb-3"
                  style={{ background: '#f9fafb', border: '2px dashed #e5e7eb', cursor: 'pointer' }}>
                  <div style={{ fontSize: 32 }}>🖼️</div>
                  <small className="text-muted d-block mt-1">Upload Logo</small>
                </label>
              )}
              <input type="file" id="logo-upload" className="d-none"
                accept="image/*" onChange={handleLogo} />
              <label htmlFor="logo-upload"
                className="btn btn-outline-secondary btn-sm w-100">
                📁 Choose Logo
              </label>
            </div>

            {/* Favicon */}
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-3">Favicon</h6>
              {faviconPreview ? (
                <div className="position-relative mb-3 text-center">
                  <img src={faviconPreview} alt="favicon"
                    style={{ width: 48, height: 48, objectFit: 'contain' }} />
                  <button type="button"
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                    onClick={() => { setFavicon(null); setFaviconPreview(null) }}>✕</button>
                </div>
              ) : (
                <label htmlFor="favicon-upload"
                  className="d-block text-center p-3 rounded-2 mb-3"
                  style={{ background: '#f9fafb', border: '2px dashed #e5e7eb', cursor: 'pointer' }}>
                  <div style={{ fontSize: 28 }}>🌐</div>
                  <small className="text-muted d-block mt-1">32×32 ICO/PNG</small>
                </label>
              )}
              <input type="file" id="favicon-upload" className="d-none"
                accept="image/*" onChange={handleFavicon} />
              <label htmlFor="favicon-upload"
                className="btn btn-outline-secondary btn-sm w-100">
                📁 Choose Favicon
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AdminSettings