import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/admin/Sidebar'
import AdminNavbar from '../components/admin/AdminNavbar'

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Detect mobile
  const isMobile = window.innerWidth < 992

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6fa' }}>

      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,.5)',
            zIndex: 199
          }}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={isMobile ? mobileSidebarOpen : sidebarOpen}
        isMobile={isMobile}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: isMobile ? 0 : (sidebarOpen ? 250 : 70),
        transition: 'margin-left 0.3s',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0  // prevent overflow
      }}>
        <AdminNavbar
          onToggleSidebar={() => {
            if (isMobile) setMobileSidebarOpen(!mobileSidebarOpen)
            else setSidebarOpen(!sidebarOpen)
          }}
        />
        <main className="p-3 p-md-4 flex-fill" style={{ minWidth: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout