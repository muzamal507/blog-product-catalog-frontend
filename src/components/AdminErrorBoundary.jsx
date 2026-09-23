import React from 'react'

class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('[AdminErrorBoundary]', error, info)
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="d-flex align-items-center justify-content-center"
        style={{ minHeight: '60vh' }}>
        <div className="text-center p-5">
          <div style={{ fontSize: 56 }}>💥</div>
          <h4 className="fw-bold mt-3 mb-2">Page Error</h4>
          <p className="text-muted mb-4" style={{ maxWidth: 360, margin: '0 auto 16px' }}>
            This section encountered an error. Try refreshing or going back to dashboard.
          </p>

          {import.meta.env.DEV && this.state.error && (
            <div className="mb-4 text-start rounded-3 p-3"
              style={{ background: '#fef2f2', border: '1px solid #fecaca', maxWidth: 480 }}>
              <pre style={{ fontSize: 11, color: '#991b1b', margin: 0, overflowX: 'auto' }}>
                {this.state.error?.toString()}
              </pre>
            </div>
          )}

          <div className="d-flex gap-3 justify-content-center">
            <button className="btn btn-outline-secondary btn-sm"
              onClick={() => this.setState({ hasError: false, error: null })}>
              🔄 Try Again
            </button>
            <a href="/admin" className="btn btn-sm text-white"
              style={{ background: '#00b894', borderRadius: 6 }}>
              📊 Dashboard
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default AdminErrorBoundary