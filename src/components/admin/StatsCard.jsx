import React from 'react'

function StatsCard({ icon, label, value, change, color }) {
  const isPositive = change >= 0
  return (
    <div className="card border-0 shadow-sm p-4 d-flex flex-row align-items-center gap-3 h-100" style={{ borderRadius: 12, borderColor: '#f0f0f0' }}>
      <div style={{ width: 52, height: 52, borderRadius: 12, background: color + '20', color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div className="text-muted mb-1" style={{ fontSize: 12, fontWeight: 500 }}>{label}</div>
        <div className="fw-bold mb-1" style={{ fontSize: 24, color: '#1a1a2e' }}>{value}</div>
        <div style={{ fontSize: 11, fontWeight: 500, color: isPositive ? '#059669' : '#dc2626' }}>
          {isPositive ? '↑' : '↓'} {Math.abs(change)}% this month
        </div>
      </div>
    </div>
  )
}

export default StatsCard