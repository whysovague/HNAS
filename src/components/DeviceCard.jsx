import React from 'react'
import './DeviceCard.css'

export default function DeviceCard({ device }) {
  const { name, ip, mac } = device

  return (
    <div className="device-card">
      <div className="device-info">
        <div className="device-name">{name}</div>
        <div className="device-meta">
          <span>IP: {ip}</span>
          <span className="device-sep">·</span>
          <span>MAC: {mac}</span>
        </div>
      </div>
    </div>
  )
}
