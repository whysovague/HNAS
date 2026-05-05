import React from 'react'
import './StatusBadge.css'

const configs = {
  connected: { label: 'Connected', cls: 'badge-green' },
  limited: { label: 'Limited', cls: 'badge-amber' },
  disconnected: { label: 'Offline', cls: 'badge-red' },
  success: { label: 'Success', cls: 'badge-green' },
  fail: { label: 'Failed', cls: 'badge-red' },
  warning: { label: 'Warning', cls: 'badge-amber' },
  running: { label: 'Running...', cls: 'badge-cyan' },
  idle: { label: 'Idle', cls: 'badge-muted' },
}

export default function StatusBadge({ status }) {
  const cfg = configs[status] ?? { label: status, cls: 'badge-muted' }
  return (
    <span className={`status-badge ${cfg.cls}`}>
      <span className="badge-dot" />
      {cfg.label}
    </span>
  )
}
