import React, { useState } from 'react'
import { KeyRound, Wifi, Router, Tag, ChevronDown, ChevronUp } from 'lucide-react'
import ActionButton from '../components/ActionButton'
import PasswordReveal from '../components/PasswordReveal'
import './Credentials.css'

export default function Credentials({ networkData }) {
  const [wifiState, setWifiState] = useState('idle') 
  const [actualWifiPassword, setActualWifiPassword] = useState('')
  
  const [defaultState, setDefaultState] = useState('idle') // idle | loading | matched-standard | matched-sticker | no-match
  const [match, setMatch] = useState(null)
  
  // UI Expansion States
  const [labelExpanded, setLabelExpanded] = useState(false)
  const [resetExpanded, setResetExpanded] = useState(false)

  const ssid = networkData?.ssid || 'Unknown'
  const gatewayIP = networkData?.gatewayIP || 'Unknown'

  async function handleGetWifi() {
    setWifiState('loading')
    try {
      const password = await window.hnasAPI.getWifiPassword(ssid)
      if (password) {
        setActualWifiPassword(password)
        setWifiState('revealed')
      } else {
        setWifiState('error')
      }
    } catch (error) {
      console.error(error)
      setWifiState('error')
    }
  }

  async function handleGetDefaults() {
    setDefaultState('loading')
    setResetExpanded(false) // Reset the UI expansion on new search
    setLabelExpanded(false)

    try {
      const result = await window.hnasAPI.getGatewayCredentials()
      
      if (result && result.type === 'standard') {
        setMatch(result)
        setDefaultState('matched-standard')
      } else if (result && result.type === 'sticker') {
        setMatch(result)
        setDefaultState('matched-sticker')
      } else {
        setDefaultState('no-match')
      }
    } catch (error) {
      console.error("Failed to fetch gateway credentials:", error)
      setDefaultState('no-match')
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Credentials</h1>
        <p className="page-subtitle">Retrieve your Wi-Fi password or find router default credentials.</p>
      </div>

      <div className="cred-grid">
        {/* Wi-Fi Password */}
        <div className="cred-panel">
          <div className="cred-panel-header">
            <div className="cred-panel-icon cred-panel-icon--violet">
              <Wifi size={20} />
            </div>
            <div>
              <div className="cred-panel-title">Current Wi-Fi Password</div>
              <div className="cred-panel-sub">For network: {ssid}</div>
            </div>
          </div>

          {wifiState === 'idle' && (
            <>
              <p className="cred-info">
                This will read your saved Wi-Fi password from the operating system.
                No data is sent anywhere.
              </p>
              <ActionButton icon={KeyRound} onClick={handleGetWifi} fullWidth disabled={ssid === 'Unknown' || ssid === 'Wired / Unknown'}>
                Retrieve Password
              </ActionButton>
            </>
          )}

          {wifiState === 'loading' && (
            <ActionButton loading fullWidth>Reading from OS...</ActionButton>
          )}

          {wifiState === 'revealed' && (
            <PasswordReveal
              password={actualWifiPassword}
              label={`Password for "${ssid}"`}
            />
          )}

          {wifiState === 'error' && (
            <div className="cred-info" style={{ color: 'var(--red)', border: '1px solid var(--red-bg)' }}>
              Could not retrieve the password. You may not be on Wi-Fi, or you lack administrator permissions.
              <button onClick={() => setWifiState('idle')} style={{ display: 'block', marginTop: '10px', background: 'none', border: 'none', color: 'var(--text-primary)', textDecoration: 'underline' }}>Try again</button>
            </div>
          )}
        </div>

        {/* Router Default Credentials */}
        <div className="cred-panel">
          <div className="cred-panel-header">
            <div className="cred-panel-icon cred-panel-icon--cyan">
              <Router size={20} />
            </div>
            <div>
              <div className="cred-panel-title">Router Default Credentials</div>
              <div className="cred-panel-sub">Gateway: {gatewayIP}</div>
            </div>
          </div>

          {defaultState === 'idle' && (
            <>
              <p className="cred-info">
                This checks your router's MAC address against a database of common
                manufacturer defaults.
              </p>
              <ActionButton icon={KeyRound} onClick={handleGetDefaults} fullWidth>
                Look Up Defaults
              </ActionButton>
            </>
          )}

          {defaultState === 'loading' && (
            <ActionButton loading fullWidth>Analyzing Gateway...</ActionButton>
          )}

          {/* Render Standard Router */}
          {defaultState === 'matched-standard' && match && (
            <div className="cred-result">
              <div className="cred-vendor">
                <Tag size={13} />
                {match.vendor} Router Detected
              </div>
              <PasswordReveal password={match.username} label="Default Username" />
              <PasswordReveal password={match.password} label="Default Password" />
              <p className="cred-warning">
                These are factory defaults — only valid if you haven't changed them yet.
              </p>

              {/* Factory Reset Instructions */}
              <button
                className="cred-expand-btn"
                onClick={() => setResetExpanded(v => !v)}
                style={{ marginTop: '10px' }}
              >
                {resetExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                Password changed? How to factory reset
              </button>

              {resetExpanded && (
                <div className="cred-info" style={{ marginTop: '10px', background: '#1e1e1e', padding: '12px', borderRadius: '6px', color: 'var(--text-primary)' }}>
                  <strong style={{ color: 'var(--red)' }}>Warning: This erases all custom settings and Wi-Fi configurations!</strong>
                  <ol className="cred-label-steps" style={{ marginTop: '8px', paddingLeft: '16px' }}>
                    <li>Find the small "Reset" pinhole on the back of your router.</li>
                    <li>Use a paperclip to press and hold the button inside for 10-15 seconds.</li>
                    <li>Wait 2-3 minutes for the router lights to stabilize.</li>
                    <li>Log in using the default credentials above.</li>
                  </ol>
                </div>
              )}
            </div>
          )}

          {/* Render Modern Sticker Router */}
          {defaultState === 'matched-sticker' && match && (
            <div className="cred-result">
              <div className="cred-vendor">
                <Tag size={13} />
                {match.vendor} Router Detected
              </div>
              
              <div className="cred-info" style={{ background: '#1e1e1e', padding: '12px', borderRadius: '6px', color: 'var(--text-primary)' }}>
                <strong>Unique Credentials Required:</strong><br/>
                {match.message}
              </div>

              <button
                className="cred-expand-btn"
                onClick={() => setLabelExpanded(v => !v)}
                style={{ marginTop: '10px' }}
              >
                {labelExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                How to locate the sticker
              </button>

              {labelExpanded && (
                <ol className="cred-label-steps">
                  <li>Turn your router over to see the bottom or back panel.</li>
                  <li>Look for a sticker labeled "Admin Password", "Device Access Code", or "Router GUI Password".</li>
                  <li>Note: This is often different from your Wi-Fi password.</li>
                </ol>
              )}

              {/* Factory Reset Instructions */}
              <button
                className="cred-expand-btn"
                onClick={() => setResetExpanded(v => !v)}
                style={{ marginTop: '10px' }}
              >
                {resetExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                Password changed? How to factory reset
              </button>

              {resetExpanded && (
                <div className="cred-info" style={{ marginTop: '10px', background: '#1e1e1e', padding: '12px', borderRadius: '6px', color: 'var(--text-primary)' }}>
                  <strong style={{ color: 'var(--red)' }}>Warning: This erases all custom settings and Wi-Fi configurations!</strong>
                  <ol className="cred-label-steps" style={{ marginTop: '8px', paddingLeft: '16px' }}>
                    <li>Find the small "Reset" pinhole on the back of your router.</li>
                    <li>Use a paperclip to press and hold the button inside for 10-15 seconds.</li>
                    <li>Wait 2-3 minutes for the router lights to stabilize.</li>
                    <li>The sticker credentials will now work again.</li>
                  </ol>
                </div>
              )}
            </div>
          )}

          {defaultState === 'no-match' && (
            <div className="cred-no-match">
              <p>Could not detect gateway hardware or identify the manufacturer.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}