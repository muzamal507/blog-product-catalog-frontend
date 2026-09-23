import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import sliderService from '../../../services/sliderService'

function HeroSection() {
  const [slides, setSlides]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [current, setCurrent]   = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    sliderService.getAll({ status: 'Active' })
      .then(res => {
        const data = res.data.data?.data || res.data.data || []
        setSlides(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Auto-play
  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isPlaying, slides.length])

  const goTo = (idx) => {
    setCurrent(idx)
    setIsPlaying(false)
    setTimeout(() => setIsPlaying(true), 8000)
  }

  const prev = () => goTo((current - 1 + slides.length) % slides.length)
  const next = () => goTo((current + 1) % slides.length)

  // Fallback slide when no slider data
  const fallbackSlide = {
    title:       'The Art of Physical Permanence',
    subtitle:    'PREMIUM CURATION CATALOG',
    description: 'Explore limited run automatic watches, custom-milled peripherals, and full-grain travel gear.',
    button_text: 'Explore Collection',
    button_url:  '/catalog',
    image:       null,
  }

  const activeSlides = slides.length > 0 ? slides : [fallbackSlide]
  const slide        = activeSlides[current] || fallbackSlide

  if (loading) {
    return (
      <div style={{
        minHeight: 'clamp(340px,55vw,480px)',
        background: 'linear-gradient(120deg,#0d1b2a 55%,#1a2d40 100%)',
        display: 'flex', alignItems: 'center'
      }}>
        <div className="container-fluid px-3 px-md-5">
          <div style={{ height: 16, background: 'rgba(255,255,255,.1)',
            borderRadius: 20, width: 140, marginBottom: 20,
            animation: 'skeleton 1.5s infinite' }} />
          <div style={{ height: 40, background: 'rgba(255,255,255,.1)',
            borderRadius: 8, width: '60%', marginBottom: 12,
            animation: 'skeleton 1.5s infinite' }} />
          <div style={{ height: 40, background: 'rgba(255,255,255,.1)',
            borderRadius: 8, width: '45%', marginBottom: 24,
            animation: 'skeleton 1.5s infinite' }} />
          <div style={{ height: 44, background: 'rgba(255,255,255,.1)',
            borderRadius: 8, width: 160, animation: 'skeleton 1.5s infinite' }} />
        </div>
        <style>{`@keyframes skeleton{0%,100%{opacity:.8}50%{opacity:.3}}`}</style>
      </div>
    )
  }

  return (
    <section style={{
      background: 'linear-gradient(120deg,#0d1b2a 55%,#1a2d40 100%)',
      minHeight: 'clamp(340px,55vw,480px)',
      position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center'
    }}>
      {/* Background Image */}
      {slide.image ? (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${slide.image})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.25,
          transition: 'opacity 0.5s'
        }} />
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'url(https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1400&q=80) center/cover',
          opacity: 0.15
        }} />
      )}

      {/* Content */}
      <div className="container-fluid px-3 px-md-5 position-relative" style={{ zIndex: 2 }}>
        <div className="row">
          <div className="col-12 col-md-8 col-lg-6">

            {/* Badge */}
            {slide.subtitle && (
              <div className="d-inline-block mb-3 px-3 py-1"
                style={{
                  border: '1.5px solid #00b894', color: '#00b894',
                  borderRadius: 20, fontSize: 11,
                  fontWeight: 700, letterSpacing: 1
                }}>
                {slide.subtitle}
              </div>
            )}

            {/* Title */}
            <h1 className="fw-bold text-white mb-3"
              style={{
                fontSize: 'clamp(24px,5vw,52px)',
                lineHeight: 1.15,
                transition: 'all 0.4s'
              }}>
              {slide.title}
            </h1>

            {/* Description */}
            {slide.description && (
              <p className="mb-4 d-none d-sm-block"
                style={{ color: '#8fa3b8', fontSize: 'clamp(13px,2vw,15px)',
                  lineHeight: 1.8, maxWidth: 420 }}>
                {slide.description}
              </p>
            )}

            {/* Button */}
            {slide.button_text && (
              slide.button_url?.startsWith('http') ? (
                <a href={slide.button_url} target="_blank" rel="noreferrer"
                  className="btn px-4 py-2 fw-semibold text-white"
                  style={{ background: '#00b894', borderRadius: 6, fontSize: 14 }}>
                  {slide.button_text} →
                </a>
              ) : (
                <Link
                  to={slide.button_url || '/catalog'}
                  className="btn px-4 py-2 fw-semibold text-white"
                  style={{ background: '#00b894', borderRadius: 6, fontSize: 14 }}>
                  {slide.button_text} →
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="d-none d-md-flex position-absolute"
            style={{
              left: 16, top: '50%', transform: 'translateY(-50%)',
              width: 40, height: 40, borderRadius: '50%', zIndex: 3,
              background: 'rgba(255,255,255,.15)',
              border: '1px solid rgba(255,255,255,.3)',
              color: '#fff', fontSize: 18, cursor: 'pointer',
              alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,.3)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,.15)'}>
            ‹
          </button>

          <button
            onClick={next}
            className="d-none d-md-flex position-absolute"
            style={{
              right: 16, top: '50%', transform: 'translateY(-50%)',
              width: 40, height: 40, borderRadius: '50%', zIndex: 3,
              background: 'rgba(255,255,255,.15)',
              border: '1px solid rgba(255,255,255,.3)',
              color: '#fff', fontSize: 18, cursor: 'pointer',
              alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,.3)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,.15)'}>
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {activeSlides.length > 1 && (
        <div className="position-absolute d-flex gap-2"
          style={{ bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 3 }}>
          {activeSlides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              style={{
                width: i === current ? 24 : 8,
                height: 8, borderRadius: 4,
                background: i === current ? '#00b894' : 'rgba(255,255,255,.4)',
                border: 'none', cursor: 'pointer',
                transition: 'all 0.3s'
              }} />
          ))}
        </div>
      )}

      {/* Slide counter */}
      {activeSlides.length > 1 && (
        <div className="position-absolute"
          style={{ bottom: 20, right: 20, zIndex: 3,
            color: 'rgba(255,255,255,.5)', fontSize: 12 }}>
          {current + 1} / {activeSlides.length}
        </div>
      )}
    </section>
  )
}

export default HeroSection