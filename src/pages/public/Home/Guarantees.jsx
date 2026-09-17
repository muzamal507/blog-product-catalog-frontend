import React from 'react'

const guarantees = [
  { icon: '🛡️', title: '100% Genuine Items',    desc: 'No replicas. Every wristwatch movement or premium peripheral is physically tested.'     },
  { icon: '🚪', title: 'Doorstep Verification', desc: 'Open-box check authorized before parting with cash. Risk-free guarantee.'               },
  { icon: '🔄', title: '7-Day Local Refund',     desc: 'Calibration error within 7-days warrants instant, complimentary exchanges.'            },
  { icon: '👍', title: 'Zero Online Gateway',    desc: 'No card leaks. Complete security by holding your funds until physical receipt.'        },
]

function Guarantees() {
  return (
    <section className="py-4 py-md-5 px-3 px-md-4"
      style={{ background: '#0d1b2a' }}>
      <div className="text-center mb-4">
        <small className="fw-bold text-uppercase"
          style={{ color: '#00b894', letterSpacing: 2, fontSize: 11 }}>
          SECURITY & INTEGRITY
        </small>
        <h2 className="fw-bold text-white mt-1"
          style={{ fontSize: 'clamp(20px,4vw,32px)' }}>
          Our Operational Guarantees
        </h2>
        <p className="d-none d-sm-block"
          style={{ color: '#8fa3b8', fontSize: 14, maxWidth: 500, margin: '8px auto 0' }}>
          We source directly, verify physically, and dispatch safely under Cash on Delivery rules.
        </p>
      </div>

      {/* 1 col mobile, 2 tab, 4 desktop */}
      <div className="row g-3">
        {guarantees.map((g, i) => (
          <div className="col-12 col-sm-6 col-md-3" key={i}>
            <div className="text-center p-3 p-md-4 rounded-3 h-100"
              style={{ border: '1px solid rgba(255,255,255,.1)' }}>
              <div style={{ fontSize: 'clamp(28px,5vw,36px)' }} className="mb-2 mb-md-3">
                {g.icon}
              </div>
              <h6 className="text-white fw-semibold mb-2" style={{ fontSize: 14 }}>
                {g.title}
              </h6>
              <small style={{ color: '#8fa3b8', lineHeight: 1.7, fontSize: 12 }}>
                {g.desc}
              </small>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Guarantees