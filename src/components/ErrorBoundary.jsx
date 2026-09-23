import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info)
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container text-center py-5">
          <div style={{ fontSize: 72, marginBottom: 16 }}>⚠️</div>
          <h2 className="fw-bold mb-3">Something Went Wrong</h2>
          <p className="text-muted mb-4">
            An unexpected error occurred. Please try refreshing the page.
          </p>

          {import.meta.env.DEV && this.state.error && (
            <div className="mx-auto mb-4 text-start rounded-3 p-3"
              style={{ maxWidth: 560, background: '#fef2f2', border: '1px solid #fecaca' }}>
              <pre style={{ fontSize: 11, color: '#991b1b', margin: 0, overflowX: 'auto' }}>
                {this.state.error?.toString()}
              </pre>
            </div>
          )}

          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <button className="btn btn-outline-secondary px-4"
              onClick={() => window.location.reload()}>
              🔄 Reload Page
            </button>
            <button className="btn text-white fw-semibold px-4"
              style={{ background: '#00b894', borderRadius: 8 }}
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.href = '/'
              }}>
              🏠 Go to Home
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default ErrorBoundary