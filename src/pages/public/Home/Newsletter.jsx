import React, { useState } from 'react'
import newsletterService from '../../../services/newsletterService'

function Newsletter() {
  const [email, setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [joined, setJoined] = useState(false)
  const [error, setError]   = useState('')

  const validate = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleJoin = async () => {
    setError('')
    if (!email.trim()) { setError('Please enter your email.'); return }
    if (!validate(email)) { setError('Please enter a valid email address.'); return }

    setLoading(true)
    try {
      await newsletterService.subscribe(email)
      setJoined(true)
      setEmail('')
    } catch (err) {
      const msg = err.response?.data?.message || ''
      if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('unique')) {
        setError('This email is already subscribed.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleJoin()
  }

  return (
    <div className="mx-3 mx-md-4 my-4 my-md-5 p-4 p-md-5 rounded-3"
      style={{ background: '#0d1b2a' }}>
      <div className="row align-items-center g-4">
        <div className="col-12 col-md-7">
          <h4 className="fw-bold text-white mb-1"
            style={{ fontSize: 'clamp(16px,3vw,22px)' }}>
            Stay Vetted in Small-Batches
          </h4>
          <small style={{ color: '#8fa3b8' }}>
            Be the first to receive notifications on limited edition luxury watches and gear drops.
          </small>
        </div>
        <div className="col-12 col-md-5">
          {joined ? (
            <div className="text-center py-2">
              <div style={{ fontSize: 32 }}>🎉</div>
              <div className="fw-semibold mt-1" style={{ color: '#00b894' }}>
                You're in! Thank you for subscribing.
              </div>
            </div>
          ) : (
            <div>
              <div className="d-flex gap-2">
                <input type="email"
                  className="form-control flex-fill"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  onKeyDown={handleKeyDown}
                  style={{
                    background: 'rgba(255,255,255,.08)',
                    border: error
                      ? '1px solid #dc2626'
                      : '1px solid rgba(255,255,255,.15)',
                    color: '#fff', minWidth: 0
                  }} />
                <button
                  className="btn fw-semibold text-white px-3 text-nowrap"
                  style={{ background: '#00b894', flexShrink: 0 }}
                  disabled={loading}
                  onClick={handleJoin}>
                  {loading
                    ? <span className="spinner-border spinner-border-sm" />
                    : '✉ Join'}
                </button>
              </div>
              {error && (
                <small className="d-block mt-1" style={{ color: '#f87171' }}>
                  ⚠ {error}
                </small>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Newsletter