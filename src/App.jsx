import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Dashboard from './pages/Dashboard'
import RouterAccess from './pages/RouterAccess'
import Credentials from './pages/Credentials'
import Security from './pages/Security'
import Devices from './pages/Devices'
import './App.css'

export default function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev)
  }

  return (
    <div className="app-shell">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={handleToggleSidebar}
      />
      <div className="app-main">
        <TopBar />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/router" element={<RouterAccess />} />
            <Route path="/credentials" element={<Credentials />} />
            <Route path="/security" element={<Security />} />
            <Route path="/devices" element={<Devices />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
