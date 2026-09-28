import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import notificationService from '../services/notificationService'
import { useAuth } from './AuthContext'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchUnreadCount = useCallback(() => {
    if (!isAuthenticated) return
    notificationService.unreadCount()
      .then(res => setUnreadCount(res.data.count || 0))
      .catch(() => {})
  }, [isAuthenticated])

  const fetchRecent = useCallback(() => {
    if (!isAuthenticated) return
    setLoading(true)
    notificationService.getAll({ per_page: 8 })
      .then(res => setNotifications(res.data.data?.data || res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  // Poll every 30 seconds
  useEffect(() => {
    fetchUnreadCount()
    const timer = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(timer)
  }, [fetchUnreadCount])

  const markRead = async (id) => {
    await notificationService.markRead(id)
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    )
    setUnreadCount(c => Math.max(0, c - 1))
  }

  const markAllRead = async () => {
    await notificationService.markAllRead()
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setUnreadCount(0)
  }

  const clearAll = async () => {
    await notificationService.clearAll()
    setNotifications([])
    setUnreadCount(0)
  }

  const refresh = () => {
    fetchUnreadCount()
    fetchRecent()
  }

  return (
    <NotificationContext.Provider value={{
      unreadCount, notifications, loading,
      fetchRecent, markRead, markAllRead, clearAll, refresh
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  return useContext(NotificationContext)
}