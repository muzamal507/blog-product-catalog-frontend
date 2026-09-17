import React from 'react'
import { Outlet } from 'react-router-dom'
import TopBar from '../components/common/TopBar'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

function PublicLayout() {
  return (
    <div className="public-layout">
      <TopBar />
      <Navbar />
      <main>
        <Outlet /> {/* Yahan public pages render honge */}
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout