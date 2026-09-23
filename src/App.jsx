import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ErrorBoundary      from './components/ErrorBoundary'
import AdminErrorBoundary from './components/AdminErrorBoundary'
import PublicRoutes       from './routes/PublicRoutes'
import AdminRoutes        from './routes/AdminRoutes'

function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route path="/*" element={
        <ErrorBoundary>
          <PublicRoutes />
        </ErrorBoundary>
      } />

      {/* Admin panel */}
      <Route path="/admin/*" element={
        <AdminErrorBoundary>
          <AdminRoutes />
        </AdminErrorBoundary>
      } />
    </Routes>
  )
}

export default App