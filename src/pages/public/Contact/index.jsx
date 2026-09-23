import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import contactService from '../../../services/contactService'
import { useSettings } from '../../../context/SettingContext'

const INITIAL = {
  name: '', email: '', phone: '',
  subject: '', message: '',
}

function ContactPage() {
  const { settings }    = useSettings()
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors]   = useState({})
  const [sending, setSending] = useState(false)
  const [sent, setSent]       = useState(false)
  const [serverError, setServerError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
    setServerError('')
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Name is required'
    if (!form.email.trim())   e.email   = 'Email is required'
    if (form.email && !/\S+@\S+\.\S+/.test(form.email))
      e.email = 'Enter a valid email'
    if (!form.subject.trim()) e.subject = 'Subject is required'
    if (!form.message.trim()) e.message = 'Message is required'
    if (form.message.trim().length < 10)
      e.message = 'Message must be at least 10 characters'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSending(true)
    try {
      await contactService.send(form)
      setSent(true)
      setForm(INITIAL)
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Something went wrong. Please try again.'
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      {/* Hero */}
      <div className="py-5 text-center"
        style={{ background: 'linear-gradient(135deg,#0d1b2a,#0f2d40)' }}>
        <small className="fw-bold text-uppercase"
          style={{ color: '#00b894', letterSpacing: 2, fontSize: 11 }}>
          GET IN TOUCH
        </small>
        <h1 className="fw-bold text-white mt-2 mb-2"
          style={{ fontSize: 'clamp(24px,4vw,40px)' }}>
          Contact Us
        </h1>
        <p style={{ color: '#8fa3b8', maxWidth: 480, margin: '0 auto' }}>
          Have questions? We're here to help. Reach out and we'll respond promptly.
        </p>
      </div>

      <div className="container py-5">
        <div className="row g-5">

          {/* LEFT — Info */}
          <div className="col-12 col-lg-5">

            {/* Contact Cards */}
            <div className="d-flex flex-column gap-3 mb-4">
              {[
                {
                  icon: '📞',
                  title: 'Phone',
                  value:  settings?.site_phone || '+1 (555) 019-2834',
                  sub: 'Mon–Fri: 9AM–6PM, Sat: 10AM–4PM',
                  href: `tel:${settings?.site_phone || '+15550192834'}`
                },
                {
                  icon: '✉',
                  title: 'Email',
                  value: settings?.site_email || 'info@aerolux.com',
                  sub: 'We reply within 24 hours',
                  href: `mailto:${settings?.site_email || 'info@aerolux.com'}`
                },
                {
                  icon: '📍',
                  title: 'Address',
                  value: settings?.site_address || 'Store Location',
                  sub: 'Visit us in-store',
                  href: null
                },
              ].map(info => (
                <div key={info.title}
                  className="card border-0 shadow-sm p-3"
                  style={{ borderRadius: 12 }}>
                  <div className="d-flex align-items-start gap-3">
                    <div style={{
                      width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                      background: '#00b89420', color: '#00b894',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 20
                    }}>
                      {info.icon}
                    </div>
                    <div>
                      <div className="fw-bold mb-1" style={{ fontSize: 14 }}>
                        {info.title}
                      </div>
                      {info.href ? (
                        <a href={info.href}
                          style={{ color: '#00b894', fontSize: 14, fontWeight: 500 }}>
                          {info.value}
                        </a>
                      ) : (
                        <div style={{ color: '#374151', fontSize: 14 }}>{info.value}</div>
                      )}
                      <small className="text-muted">{info.sub}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            {(settings?.facebook_url || settings?.instagram_url ||
              settings?.twitter_url  || settings?.youtube_url) && (
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
                <h6 className="fw-bold mb-3">Follow Us</h6>
                <div className="d-flex gap-3 flex-wrap">
                  {[
                    ['Facebook',  settings?.facebook_url,  '📘'],
                    ['Instagram', settings?.instagram_url, '📸'],
                    ['Twitter',   settings?.twitter_url,   '🐦'],
                    ['YouTube',   settings?.youtube_url,   '▶️'],
                    ['LinkedIn',  settings?.linkedin_url,  '💼'],
                  ].filter(([, url]) => url).map(([name, url, icon]) => (
                    <a key={name} href={url} target="_blank" rel="noreferrer"
                      className="btn btn-sm btn-light border"
                      style={{ fontSize: 13 }}>
                      {icon} {name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Business Hours */}
            <div className="card border-0 shadow-sm p-4 mt-3" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-3">🕐 Business Hours</h6>
              {[
                ['Monday – Sunday', '9:00 AM – 6:00 PM'],
              ].map(([day, hours]) => (
                <div key={day}
                  className="d-flex justify-content-between mb-2"
                  style={{ fontSize: 13 }}>
                  <span className="text-muted">{day}</span>
                  <span className="fw-semibold"
                    style={{ color: hours === 'Closed' ? '#dc2626' : '#1a1a2e' }}>
                    {hours}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Form */}
          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm p-4 p-md-5" style={{ borderRadius: 16 }}>
              <h4 className="fw-bold mb-1">Send us a Message</h4>
              <p className="text-muted mb-4" style={{ fontSize: 14 }}>
                Fill out the form and we'll get back to you as soon as possible.
              </p>

              {/* Success */}
              {sent && (
                <div className="alert d-flex align-items-center gap-3 mb-4"
                  style={{ background: '#f0fdf4', border: '1px solid #bbf7d0',
                    borderRadius: 10 }}>
                  <span style={{ fontSize: 28 }}>✅</span>
                  <div>
                    <div className="fw-bold" style={{ color: '#059669' }}>
                      Message sent successfully!
                    </div>
                    <small className="text-muted">
                      We'll respond within 24 hours.
                    </small>
                  </div>
                  <button className="btn-close ms-auto" onClick={() => setSent(false)} />
                </div>
              )}

              {/* Server Error */}
              {serverError && (
                <div className="alert alert-danger mb-4" style={{ fontSize: 13 }}>
                  ⚠ {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Name */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input type="text" name="name"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="Your full name"
                      value={form.name} onChange={handleChange} />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>

                  {/* Email */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input type="email" name="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="your@email.com"
                      value={form.email} onChange={handleChange} />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  {/* Phone */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                      Phone
                      <span className="text-muted fw-normal ms-1">(optional)</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">📞</span>
                      <input type="tel" name="phone"
                        className="form-control"
                        placeholder="+1 (555) 000-0000"
                        value={form.phone} onChange={handleChange} />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                      Subject <span className="text-danger">*</span>
                    </label>
                    <select name="subject"
                      className={`form-select ${errors.subject ? 'is-invalid' : ''}`}
                      value={form.subject} onChange={handleChange}>
                      <option value="">— Select subject —</option>
                      <option value="Product Inquiry">Product Inquiry</option>
                      <option value="Order Status">Order Status</option>
                      <option value="Return & Refund">Return & Refund</option>
                      <option value="Authenticity Verification">Authenticity Verification</option>
                      <option value="General Question">General Question</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                  </div>

                  {/* Message */}
                  <div className="col-12">
                    <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                      Message <span className="text-danger">*</span>
                    </label>
                    <textarea name="message" rows={5}
                      className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                      placeholder="Write your message here..."
                      value={form.message} onChange={handleChange} />
                    {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                    <small className="text-muted">{form.message.length}/1000 characters</small>
                  </div>

                  {/* Submit */}
                  <div className="col-12">
                    <button type="submit"
                      className="btn w-100 text-white fw-semibold py-3"
                      style={{ background: '#00b894', borderRadius: 8, fontSize: 15 }}
                      disabled={sending}>
                      {sending ? (
                        <><span className="spinner-border spinner-border-sm me-2" />Sending...</>
                      ) : (
                        '📨 Send Message'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage