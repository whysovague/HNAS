import React, { useState, useEffect } from 'react'
import { Router, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react'
import ActionButton from '../components/ActionButton'
import './RouterAccess.css'

export default function RouterAccess() {
  const [launchState, setLaunchState] = useState('idle') // idle | loading | success | fail
  const [gatewayIP, setGatewayIP] = useState('Detecting...')

  // Fetch the real gateway IP from the Electron backend on load
  useEffect(() => {
    async function fetchGateway() {
      try {
        const status = await window.hnasAPI.getNetworkStatus()
        setGatewayIP(status.gatewayIP || 'Unknown')
      } catch (error) {
        console.error('Failed to fetch gateway IP:', error)
        setGatewayIP('Error detecting IP')
      }
    }
    fetchGateway()
  }, [])

  function handleOpen() {
    setLaunchState('loading')
    
    try {
      // Call the IPC bridge to open the browser
      if (gatewayIP && gatewayIP !== 'Detecting...' && gatewayIP !== 'Error detecting IP') {
        window.hnasAPI.openRouter(gatewayIP)
        
        // Brief artificial delay for UX feedback before showing success
        setTimeout(() => {
          setLaunchState('success')
        }, 800)
      } else {
        setLaunchState('fail')
      }
    } catch (error) {
      console.error('Failed to open router:', error)
      setLaunchState('fail')
    }
  }

  function handleReset() {
    setLaunchState('idle')
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Router Access</h1>
        <p className="page-subtitle">Open your router's settings page directly from here.</p>
      </div>

      <div className="ra-card">
        <div className="ra-icon">
          <Router size={32} />
        </div>
        <div className="ra-info">
          <div className="ra-detail-row">
            <span className="ra-detail-label">Detected Gateway IP</span>
            <span className="ra-ip">{gatewayIP}</span>
          </div>
          <p className="ra-help">
            Your router's settings are typically accessible at this address.
            Clicking the button below will open it in your default browser.
          </p>
        </div>

        {launchState === 'idle' && (
          <ActionButton icon={ExternalLink} onClick={handleOpen} fullWidth>
            Open Router Page
          </ActionButton>
        )}

        {launchState === 'loading' && (
          <ActionButton loading fullWidth>
            Launching...
          </ActionButton>
        )}

        {launchState === 'success' && (
          <div className="ra-result ra-result--success">
            <CheckCircle2 size={18} />
            <span>Router page opened in your browser!</span>
            <button className="ra-reset" onClick={handleReset}>Try again</button>
          </div>
        )}

        {launchState === 'fail' && (
          <div className="ra-result ra-result--fail">
            <AlertCircle size={18} />
            <span>Could not open router page.</span>
            <button className="ra-reset" onClick={handleReset}>Retry</button>
          </div>
        )}
      </div>

      {/* Fallback instructions — always visible */}
      <div className="ra-fallback">
        <h3 className="ra-fallback-title">
          <AlertCircle size={15} />
          Can't access the page?
        </h3>
        <ol className="ra-steps">
          <li>Open your browser manually (Chrome, Firefox, Edge, etc.)</li>
          <li>Type <code>{gatewayIP !== 'Detecting...' ? gatewayIP : '192.168.1.1'}</code> in the address bar and press Enter</li>
          <li>Log in using your router credentials (see <em>Get Credentials</em>)</li>
          <li>
            If that doesn't work, try <code>192.168.0.1</code> or <code>10.0.0.1</code>
          </li>
          <li>Check the label on the back of your router for the correct address</li>
        </ol>
      </div>
    </div>
  )
}