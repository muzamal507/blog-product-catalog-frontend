import React from 'react'
import { Link } from 'react-router-dom'
import StatsCard from '../../../components/admin/StatsCard'

const stats = [
  { icon: '📦', label: 'Total Products', value: '48',      change: 12,  color: '#00b894' },
  { icon: '🛒', label: 'Total Orders',   value: '134',     change: 8,   color: '#3b82f6' },
  { icon: '💰', label: 'Revenue',        value: '$24,580', change: 18,  color: '#a855f7' },
  { icon: '👥', label: 'Customers',      value: '89',      change: -3,  color: '#f59e0b' },
]

const recentOrders = [
  { id: '#ORD-001', customer: 'Ahmed Khan',   product: 'Chronos Titanium V1',      amount: '$1100', status: 'Delivered'  },
  { id: '#ORD-002', customer: 'Sara Malik',   product: 'Acoustics Studio Pro ANC', amount: '$299',  status: 'Pending'    },
  { id: '#ORD-003', customer: 'Usman Ali',    product: 'Hex Keys Apex-75',         amount: '$169',  status: 'Processing' },
  { id: '#ORD-004', customer: 'Fatima Noor',  product: 'Chronos Titanium V1',      amount: '$1100', status: 'Delivered'  },
  { id: '#ORD-005', customer: 'Bilal Sheikh', product: 'Acoustics Studio Pro ANC', amount: '$299',  status: 'Cancelled'  },
]

const topProducts = [
  { name: 'Chronos Titanium V1 Automatic',   sales: 34, revenue: '$37,400', stock: 12 },
  { name: 'Acoustics Studio Pro ANC',         sales: 28, revenue: '$8,372',  stock: 5  },
  { name: 'Hex Keys Apex-75',                 sales: 19, revenue: '$3,211',  stock: 20 },
  { name: 'Travel Leather Backpack Pro',      sales: 15, revenue: '$2,985',  stock: 8  },
]

const quickActions = [
  { icon: '📦', label: 'Add Product',      to: '/admin/products/add', color: '#00b894' },
  { icon: '🗂️', label: 'Add Category',    to: '/admin/categories',   color: '#3b82f6' },
  { icon: '✍️', label: 'Write Blog',       to: '/admin/blogs/add',    color: '#a855f7' },
  { icon: '🛒', label: 'View Orders',      to: '/admin/orders',       color: '#f59e0b' },
  { icon: '⭐', label: 'Testimonials',     to: '/admin/testimonials', color: '#ef4444' },
  { icon: '🌐', label: 'View Site',        to: '/',                   color: '#0d9488' },
]

const statusBadge = {
  Delivered:  'success',
  Pending:    'warning',
  Processing: 'primary',
  Cancelled:  'danger',
}

function Dashboard() {
  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-0 mb-2">
        <div>
          <h4 className="fw-bold mb-1">Dashboard</h4>
        </div>
      </div>

      {/* Stats — 2x2 mobile, 4x1 desktop */}
      <div className="row g-3 mb-4">
        {stats.map((s, i) => (
          <div className="col-6 col-xl-3" key={i}>
            <StatsCard {...s} />
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="card border-0 shadow-sm p-3 p-md-4 mb-4" style={{ borderRadius: 12 }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold mb-0">Recent Orders</h6>
          <Link to="/admin/orders" style={{ color: '#00b894', fontSize: 13 }}>View All →</Link>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: 13 }}>
            <thead className="table-light">
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th className="d-none d-md-table-cell">Product</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id}>
                  <td><strong style={{ fontSize: 12 }}>{o.id}</strong></td>
                  <td style={{ whiteSpace: 'nowrap' }}>{o.customer}</td>
                  <td className="d-none d-md-table-cell text-muted" style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {o.product}
                  </td>
                  <td><strong>{o.amount}</strong></td>
                  <td>
                    <span className={`badge bg-${statusBadge[o.status]}`}
                      style={{ fontSize: 11 }}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="row g-4">

        {/* Top Products */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm p-3 p-md-4 h-100" style={{ borderRadius: 12 }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0">Top Products</h6>
              <Link to="/admin/products" style={{ color: '#00b894', fontSize: 13 }}>View All →</Link>
            </div>
            <div className="d-flex flex-column gap-2">
              {topProducts.map((p, i) => (
                <div key={i}
                  className="d-flex align-items-center gap-3 p-2 rounded-3"
                  style={{ transition: 'background 0.15s' }}
                  onMouseOver={e => e.currentTarget.style.background = '#f9fafb'}
                  onMouseOut={e => e.currentTarget.style.background = ''}>
                  <div style={{
                    width: 26, height: 26, flexShrink: 0,
                    background: '#f0fdf4', color: '#00b894',
                    borderRadius: 8, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700
                  }}>
                    #{i + 1}
                  </div>
                  <div className="flex-fill" style={{ minWidth: 0 }}>
                    <div className="fw-semibold text-truncate" style={{ fontSize: 13 }}>{p.name}</div>
                    <small className="text-muted">{p.sales} sales · {p.revenue}</small>
                  </div>
                  <span className={`badge flex-shrink-0 ${p.stock <= 5 ? 'bg-danger' : 'bg-success'}`}
                    style={{ fontSize: 11 }}>
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm p-3 p-md-4 h-100" style={{ borderRadius: 12 }}>
            <h6 className="fw-bold mb-3">Quick Actions</h6>
            <div className="row g-2">
              {quickActions.map((a, i) => (
                <div className="col-6" key={i}>
                  <Link to={a.to}
                    target={a.label === 'View Site' ? '_blank' : undefined}
                    className="d-flex align-items-center gap-2 p-2 p-md-3 rounded-3 fw-semibold"
                    style={{
                      color: a.color,
                      background: a.color + '15',
                      border: `1px solid ${a.color}25`,
                      fontSize: 12, transition: 'all 0.2s',
                      textDecoration: 'none'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = a.color + '25'}
                    onMouseOut={e => e.currentTarget.style.background = a.color + '15'}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{a.icon}</span>
                    <span className="text-truncate">{a.label}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard