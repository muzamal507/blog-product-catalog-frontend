import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSettings } from '../../context/SettingContext'
import newsletterService from '../../services/newsletterService'

function Footer() {
  const { settings } = useSettings()

  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)
  const [newsletterError, setNewsletterError] = useState('')
  const [newsletterLoading, setNewsletterLoading] = useState(false)

  const siteName = settings?.site_name || "Tahir Electronics"
  const siteDescription = settings?.site_description ||
    'Your trusted home appliance showroom for quality products and reliable service.'

  const sitePhone = settings?.site_phone || '+92 333 0437507'
  const siteEmail = settings?.site_email || 'info@example.com'

  const siteAddress =settings?.site_address || 'Sheikhupura, Punjab, Pakistan'



  // --------------------------------------------------
  // Newsletter
  // --------------------------------------------------
  const handleNewsletter = async () => {
    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setNewsletterError('Please enter your email address.')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(trimmedEmail)) {
      setNewsletterError('Please enter a valid email address.')
      return
    }

    setNewsletterError('')
    setNewsletterLoading(true)

    try {
      await newsletterService.subscribe(trimmedEmail)

      setJoined(true)
      setEmail('')

    } catch (error) {

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Something went wrong. Please try again.'

      setNewsletterError(message)

    } finally {
      setNewsletterLoading(false)
    }
  }

  // --------------------------------------------------
  // Social Links
  // --------------------------------------------------
  const socialLinks = [
    [settings?.facebook_url, '📘', 'Facebook'],
    [settings?.instagram_url, '📸', 'Instagram'],
    [settings?.twitter_url, '🐦', 'Twitter'],
    [settings?.youtube_url, '▶️', 'YouTube'],
    [settings?.linkedin_url, '💼', 'LinkedIn'],
  ].filter(([url]) => url)


  // --------------------------------------------------
  // Navigation Links
  // --------------------------------------------------
  const navigationLinks = [
    ['/', 'Home'],
    ['/catalog', 'Catalog'],
    ['/categories', 'Categories'],
    ['/brands', 'Brands'],
    ['/testimonials', 'Reviews'],
    ['/blogs', 'Blogs'],
  ]


  // --------------------------------------------------
  // Company Links
  // --------------------------------------------------

  const companyLinks = [
    ['/about', 'About Us'],
    ['/contact', 'Contact'],
  ]


  // --------------------------------------------------
  // Legal Links
  // --------------------------------------------------

  const legalLinks = [
    ['/page/privacy-policy', 'Privacy Policy'],
    ['/page/terms-of-service', 'Terms of Service'],
    ['/page/return-policy', 'Return Policy'],
    ['/page/shipping-policy', 'Shipping Policy'],
  ]


  return (

    <footer style={{background: '#0d1b2a'}} className="pt-4 pt-md-5 pb-3 px-3 px-md-4" >

      {/* =====================================================
          MAIN FOOTER
      ====================================================== */}

      <div className="row g-4 pb-4 mb-3"
        style={{borderBottom: '1px solid rgba(255,255,255,.08)'}}
      >

        {/* =================================================
            BRAND
        ================================================== */}

        <div className="col-12 col-md-3">

          <div className="fw-bold text-white mb-2" style={{fontSize: 20}} >
            {siteName}
          </div>

          <p className="mb-3" style={{color: '#8fa3b8', fontSize: 13,
              lineHeight: 1.8}} >
            {siteDescription}
          </p>


          {/* Social Links */}

          {socialLinks.length > 0 && (

            <div className="d-flex gap-2 flex-wrap">
              {socialLinks.map(
                ([url, icon, name]) => (
                  <a key={name} href={url} target="_blank" rel="noreferrer" title={name}
                    className="btn btn-sm" style={{background: 'rgba(255,255,255,.08)',
                      color: '#fff', border: 'none', fontSize: 16, padding: '4px 8px'}}
                  >
                    {icon}
                  </a>
                )
              )}
            </div>
          )}

        </div>

        {/* =================================================
            NAVIGATION
        ================================================== */}

        <div className="col-6 col-md-2">
          <p className="fw-bold text-uppercase mb-3"
            style={{color: '#00b894', fontSize: 11, letterSpacing: 1.5}}
          >
            NAVIGATION
          </p>

          <ul className="list-unstyled mb-0">
            {navigationLinks.map(
              ([to, label]) => (
                <li key={to} className="mb-2" >
                  <Link to={to} className="text-decoration-none"
                    style={{color: '#8fa3b8', fontSize: 13}} >
                    {label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>

        {/* =================================================
            COMPANY
        ================================================== */}

        <div className="col-6 col-md-2">
          <p className="fw-bold text-uppercase mb-3"
            style={{color: '#00b894', fontSize: 11, letterSpacing: 1.5}}
          >
            COMPANY
          </p>

          <ul className="list-unstyled mb-0">
            {companyLinks.map(
              ([to, label]) => (
                <li key={to} className="mb-2" >
                  <Link to={to} className="text-decoration-none"
                    style={{color: '#8fa3b8', fontSize: 13}}
                  >
                    {label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>

        {/* =================================================
            LEGAL
        ================================================== */}
        <div className="col-6 col-md-2">
          <p className="fw-bold text-uppercase mb-3"
            style={{color: '#00b894', fontSize: 11, letterSpacing: 1.5}} >
            LEGAL
          </p>

          <ul className="list-unstyled mb-0">
            {legalLinks.map(
              ([to, label]) => (
                <li key={to} className="mb-2" >
                  <Link to={to} className="text-decoration-none"
                    style={{color: '#8fa3b8', fontSize: 13}} >
                    {label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>

        {/* =================================================
            CONTACT / NEWSLETTER
        ================================================== */}
        <div className="col-12 col-md-3">
          <p className="fw-bold text-uppercase mb-3"
            style={{color: '#00b894', fontSize: 11, letterSpacing: 1.5}} >
            STAY UPDATED
          </p>

          {/* Newsletter */}
          {joined ? (
            <div className="mb-3" style={{color: '#00b894', fontWeight: 600,
                fontSize: 14}} >
              ✓ Subscribed! Thank you.
            </div>
          ) : (
            <div className="mb-3">
              <div className="d-flex gap-2">
                <input type="email" className="form-control form-control-sm" 
                  placeholder="your@email.com" value={email} disabled={newsletterLoading}
                  onChange={(e) => { setEmail(e.target.value), setNewsletterError('')}}
                  onKeyDown={(e) => {if (e.key === 'Enter') {handleNewsletter()} }}
                  style={{background: 'rgba(255,255,255,.08)', color: '#fff',
                    border: '1px solid rgba(255,255,255,.15)'}}
                />

                <button type="button" className="btn btn-sm text-white fw-semibold text-nowrap"
                  disabled={newsletterLoading} onClick={handleNewsletter}
                  style={{background: '#00b894', flexShrink: 0, minWidth: 60}} 
                >
                  {newsletterLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1"
                        role="status" aria-hidden="true" />
                      ...
                    </>
                  ) : (
                    'Join'
                  )}
                </button>
              </div>

              {newsletterError && (
                <small className="d-block mt-2" style={{color: '#ff6b6b', fontSize: 12}} >
                  {newsletterError}
                </small>
              )}
            </div>
          )}

          {/* Phone */}
          {sitePhone && (
            <div className="d-flex align-items-center gap-2 mb-2"
              style={{color: '#8fa3b8', fontSize: 13}} >
              <span>📞</span>
              <a href={`tel:${sitePhone}`} className="text-decoration-none"
                style={{color: '#8fa3b8'}} >
                {sitePhone}
              </a>
            </div>
          )}

          {/* Email */}
          {siteEmail && (
            <div className="d-flex align-items-center gap-2 mb-2"
              style={{color: '#8fa3b8', fontSize: 13}} >
              <span>✉</span>
              <a href={`mailto:${siteEmail}`} className="text-decoration-none"
                style={{color: '#8fa3b8'}} >
                {siteEmail}
              </a>
            </div>
          )}

          {/* Address */}
          {siteAddress && (
            <div className="d-flex align-items-start gap-2"
              style={{color: '#8fa3b8', fontSize: 13}} >
              <span>📍</span>
              <span>{siteAddress}</span>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          COPYRIGHT
      ====================================================== */}
      <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-1 text-center">
        <small style={{color: '#687585'}} >
          &copy; Copyright - All Rights Reserved by Tahir's Tech Solutions. 
        </small>
      </div>

    </footer>

  )
}
 
export default Footer