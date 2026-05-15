import React from 'react'
import { Wifi, WifiOff } from 'lucide-react'
import './TopBar.css'

export default function TopBar({ networkData }) {
  // Fallback to avoid crashes if data is missing during initial load
  const { ssid, status } = networkData || { ssid: 'Loading...', status: 'disconnected' }

  return (
    <div className="topbar">
      <div className="topbar-network" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {status === 'connected' ? (
          <Wifi size={16} className={`status-icon status-${status}`} style={{ color: 'var(--green, #4ade80)' }} />
        ) : (
          <WifiOff size={16} className="status-icon" style={{ color: 'var(--text-muted, #64748b)' }} />
        )}
        <span className="topbar-ssid" style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>
          {ssid}
        </span>
      </div>
    </div>
  )
}