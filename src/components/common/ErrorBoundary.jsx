import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError:  false,
      error:     null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    // Log to console in dev
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container text-center py-5">

          {/* Icon */}
          <div style={{ fontSize: 72, marginBottom: 16 }}>⚠️</div>

          <h2 className="fw-bold mb-3" style={{ color: '#1a1a2e' }}>
            Something Went Wrong
          </h2>

          <p className="text-muted mb-2" style={{ maxWidth: 480, margin: '0 auto 8px' }}>
            An unexpected error occurred. This has been noted and we're working to fix it.
          </p>

          {/* Error details — dev only */}
          {import.meta.env.DEV && this.state.error && (
            <div className="mx-auto mb-4 text-start"
              style={{ maxWidth: 600 }}>
              <details className="rounded-3 p-3"
                style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                <summary className="fw-semibold text-danger" style={{ cursor: 'pointer', fontSize: 13 }}>
                  🐛 Error Details (dev only)
                </summary>
                <pre className="mt-3 mb-0 text-start overflow-auto"
                  style={{ fontSize: 11, color: '#991b1b', maxHeight: 200 }}>
                  {this.state.error?.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            </div>
          )}

          {/* Actions */}
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <button className="btn btn-outline-secondary px-4"
              onClick={() => window.location.reload()}>
              🔄 Reload Page
            </button>
            <button
              className="btn text-white fw-semibold px-4"
              style={{ background: '#00b894', borderRadius: 8 }}
              onClick={() => {
                this.handleReset()
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