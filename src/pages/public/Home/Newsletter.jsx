import React, { useState } from 'react'

function Newsletter() {
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

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
            <div className="fw-semibold text-center" style={{ color: '#00b894' }}>
              ✓ Subscribed! Thank you.
            </div>
          ) : (
            <div className="d-flex gap-2">
              <input type="email" className="form-control flex-fill"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,.08)',
                  border: '1px solid rgba(255,255,255,.15)',
                  color: '#fff', minWidth: 0
                }} />
              <button className="btn fw-semibold text-white px-3 text-nowrap"
                style={{ background: '#00b894', whiteSpace: 'nowrap', flexShrink: 0 }}
                onClick={() => email && setJoined(true)}>
                ✉ Join
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Newsletter