import React from 'react'
import { Wifi, WifiOff, Globe } from 'lucide-react'
import { networkStatus } from '../data/mockData'
import StatusBadge from './StatusBadge'
import './TopBar.css'

export default function TopBar() {
  const { ssid, status, gatewayIP, signalStrength } = networkStatus

  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="topbar-label">Network</span>
        <span className="topbar-ssid">{ssid}</span>
      </div>

      <div className="topbar-center">
        <StatusBadge status={status} />
      </div>

      <div className="topbar-right">
        <span className="topbar-meta">
          <Globe size={13} />
          Gateway: <strong>{gatewayIP}</strong>
        </span>
        <span className="topbar-meta">
          <Wifi size={13} />
          Signal: <strong>{signalStrength}%</strong>
        </span>
      </div>
    </header>
  )
}
