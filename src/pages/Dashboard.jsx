import React from 'react'
import { Router, KeyRound, ShieldCheck, Wifi } from 'lucide-react'
import DashboardCard from '../components/DashboardCard'
import StatusBadge from '../components/StatusBadge'
import { networkStatus, connectedDevices, securityChecklist } from '../data/mockData'
import './Dashboard.css'

const cards = [
  {
    icon: Router,
    title: 'Router Access',
    description: 'Open your router settings page',
    to: '/router',
    accent: 'cyan',
  },
  {
    icon: KeyRound,
    title: 'Get Credentials',
    description: 'Retrieve Wi-Fi password or router defaults',
    to: '/credentials',
    accent: 'violet',
  },
  {
    icon: ShieldCheck,
    title: 'Security',
    description: 'Review reminders and security checklist',
    to: '/security',
    accent: 'lime',
  },
  {
    icon: Wifi,
    title: 'Scan Network',
    description: 'See all devices on your network',
    to: '/devices',
    accent: 'cyan',
  },
]

export default function Dashboard() {
  const secDone = securityChecklist.filter(i => i.checked).length
  const { ssid, status, encryptionType, signalStrength } = networkStatus

  return (
    <div className="page dashboard-page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome to HNAS — your home network assistant.</p>
      </div>

      {/* Network Summary */}
      <div className="network-summary">
        <div className="summary-item">
          <span className="summary-label">Status</span>
          <StatusBadge status={status} />
        </div>
        <div className="summary-item">
          <span className="summary-label">Network</span>
          <span className="summary-value">{ssid}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Encryption</span>
          <span className="summary-value summary-value--green">{encryptionType}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Signal</span>
          <div className="signal-bar">
            <div className="signal-fill" style={{ width: `${signalStrength}%` }} />
          </div>
          <span className="summary-value">{signalStrength}%</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Security</span>
          <span className="summary-value">{secDone}/{securityChecklist.length} checks passed</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dash-grid">
        {cards.map(card => (
          <DashboardCard key={card.to} {...card} />
        ))}
      </div>
    </div>
  )
}
