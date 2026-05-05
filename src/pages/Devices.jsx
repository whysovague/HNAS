import React, { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import DeviceCard from '../components/DeviceCard'
import ActionButton from '../components/ActionButton'
import { connectedDevices } from '../data/mockData'
import './Devices.css'

export default function Devices() {
  const [devices] = useState(connectedDevices)
  const [scanning, setScanning] = useState(false)

  function handleScan() {
    setScanning(true)
    // TODO: Replace with Electron IPC → Node.js ARP scan
    setTimeout(() => setScanning(false), 2000)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Connected Devices</h1>
        <p className="page-subtitle">
          {devices.length} device{devices.length !== 1 ? 's' : ''} found on your local network.
        </p>
      </div>

      <div className="devices-toolbar">
        <ActionButton
          icon={RefreshCw}
          variant="secondary"
          onClick={handleScan}
          loading={scanning}
        >
          {scanning ? 'Scanning...' : 'Rescan'}
        </ActionButton>
      </div>

      <div className="devices-grid">
        {devices.map(device => (
          <DeviceCard key={device.id} device={device} />
        ))}
      </div>
    </div>
  )
}
