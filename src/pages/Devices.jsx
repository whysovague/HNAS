import React, { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import DeviceCard from '../components/DeviceCard'
import ActionButton from '../components/ActionButton'
import './Devices.css'

export default function Devices() {
  const [devices, setDevices] = useState([])
  const [scanning, setScanning] = useState(false)

  async function handleScan() {
    setScanning(true)
    try {
      if (window.hnasAPI) {
        const liveDevices = await window.hnasAPI.scanDevices()
        setDevices(liveDevices)
      }
    } catch (error) {
      console.error("Failed to scan network:", error)
    } finally {
      setScanning(false)
    }
  }

  // Run a scan automatically when the page loads
  useEffect(() => {
    handleScan()
  }, [])

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