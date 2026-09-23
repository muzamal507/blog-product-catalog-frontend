import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar    from '../components/admin/Sidebar'
import AdminNavbar from '../components/admin/AdminNavbar'

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#f4f6f9' }}>

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main */}
      <div className="flex-fill d-flex flex-column" style={{ minWidth: 0 }}>

        {/* Navbar */}
        <AdminNavbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content */}
        <main className="flex-fill p-3 p-md-4" style={{ overflowX: 'hidden' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout