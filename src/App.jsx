import React from 'react'
import { Routes, Route } from 'react-router-dom'
import PublicRoutes from './routes/PublicRoutes'
import AdminRoutes from './routes/AdminRoutes'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/*" element={<PublicRoutes />} />

      {/* Admin Routes */}
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  )
}

export default App