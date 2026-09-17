import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()

  // Auth check ho raha ho toh loader dikhao
  if (loading) {
    return <div style={{ 
      display: 'flex', alignItems: 'center', 
      justifyContent: 'center', minHeight: '100vh' 
    }}>Loading...</div>
  }

  // Login nahi hy toh admin/login pe bhejo
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute