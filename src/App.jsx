import React, { useState, useEffect } from 'react'
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
  
  // Global network state
  const [networkData, setNetworkData] = useState({
    ssid: 'Detecting...',
    status: 'disconnected',
    gatewayIP: 'Detecting...',
    localIP: 'Detecting...',
    signalStrength: 0,
    encryptionType: 'Unknown'
  })

  // Fetch from Electron backend
  const fetchNetworkStatus = async () => {
    if (window.hnasAPI) {
      try {
        const status = await window.hnasAPI.getNetworkStatus()
        setNetworkData(status)
      } catch (error) {
        console.error('Failed to fetch network status:', error)
      }
    }
  }

  // Run on startup and when Windows network changes
  useEffect(() => {
    fetchNetworkStatus()
    window.addEventListener('online', fetchNetworkStatus)
    window.addEventListener('offline', fetchNetworkStatus)

    return () => {
      window.removeEventListener('online', fetchNetworkStatus)
      window.removeEventListener('offline', fetchNetworkStatus)
    }
  }, [])

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
        {/* Pass data to TopBar */}
        <TopBar networkData={networkData} />
        <div className="app-content">
          <Routes>
            {/* Pass data to pages that need it */}
            <Route path="/" element={<Dashboard networkData={networkData} />} />
            <Route path="/router" element={<RouterAccess networkData={networkData} />} />
            <Route path="/credentials" element={<Credentials />} />
            <Route path="/security" element={<Security />} />
            <Route path="/devices" element={<Devices />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}