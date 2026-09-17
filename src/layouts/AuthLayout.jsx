import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AuthLayout() {
  const { isAuthenticated } = useAuth()

  // Pehle se logged in hai toh dashboard pe bhejo
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  return <Outlet />
}

export default AuthLayout