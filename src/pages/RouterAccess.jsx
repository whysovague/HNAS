import React, { useState } from 'react'
import { Router, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react'
import ActionButton from '../components/ActionButton'
import './RouterAccess.css'

export default function RouterAccess({ networkData }) {
  const [launchState, setLaunchState] = useState('idle') 
  const [debugError, setDebugError] = useState(null)
  
  // Get IP directly from props
  const gatewayIP = networkData?.gatewayIP || 'Detecting...'

  function handleOpen() {
    setLaunchState('loading')
    try {
      if (!window.hnasAPI) {
        throw new Error("window.hnasAPI is undefined. Preload script missing.")
      }

      if (gatewayIP && gatewayIP !== 'Detecting...' && gatewayIP !== '192.168.1.1' && gatewayIP !== 'Unknown') {
        window.hnasAPI.openRouter(gatewayIP)
        setTimeout(() => setLaunchState('success'), 800)
      } else {
        // Safe fallback if it's struggling to detect
        window.hnasAPI.openRouter('192.168.1.1')
        setTimeout(() => setLaunchState('success'), 800)
      }
    } catch (error) {
      console.error('Failed to open router:', error)
      setDebugError(error.message)
      setLaunchState('fail')
    }
  }

  function handleReset() {
    setLaunchState('idle')
    setDebugError(null)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Router Access</h1>
        <p className="page-subtitle">Open your router's settings page directly from here.</p>
      </div>

      {debugError && (
        <div style={{ background: '#3b0000', color: '#ffaaaa', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid red' }}>
          <strong>Error:</strong><br/>
          {debugError}
        </div>
      )}

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

      <div className="ra-fallback">
        <h3 className="ra-fallback-title">
          <AlertCircle size={15} />
          Can't access the page?
        </h3>
        <ol className="ra-steps">
          <li>Open your browser manually</li>
          <li>Type <code>{gatewayIP !== 'Detecting...' ? gatewayIP : '192.168.1.1'}</code> in the address bar and press Enter</li>
          <li>Log in using your router credentials</li>
          <li>If that doesn't work, try <code>192.168.0.1</code> or <code>10.0.0.1</code></li>
        </ol>
      </div>
    </div>
  )
}