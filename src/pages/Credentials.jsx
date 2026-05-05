import React, { useState } from 'react'
import { KeyRound, Wifi, Router, Tag, ChevronDown, ChevronUp } from 'lucide-react'
import ActionButton from '../components/ActionButton'
import PasswordReveal from '../components/PasswordReveal'
import { networkStatus, defaultCredentialDB } from '../data/mockData'
import './Credentials.css'

export default function Credentials() {
  const [wifiState, setWifiState] = useState('idle') // idle | loading | revealed
  const [defaultState, setDefaultState] = useState('idle') // idle | loading | matched | no-match
  const [match, setMatch] = useState(null)
  const [labelExpanded, setLabelExpanded] = useState(false)

  const { ssid, gatewayIP } = networkStatus

  // Mock: Wi-Fi password retrieve from OS
  // TODO: Replace with Electron IPC → exec('netsh wlan show profile ... key=clear') on Windows
  function handleGetWifi() {
    setWifiState('loading')
    setTimeout(() => setWifiState('revealed'), 1500)
  }

  // Mock: look up MAC OUI in local DB
  // TODO: Replace with real ARP table lookup + MAC OUI lookup
  function handleGetDefaults() {
    setDefaultState('loading')
    setTimeout(() => {
      const oui = 'A4:83:E7'
      const found = defaultCredentialDB[oui]
      if (found) {
        setMatch(found)
        setDefaultState('matched')
      } else {
        setDefaultState('no-match')
      }
    }, 1500)
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
              <ActionButton icon={KeyRound} onClick={handleGetWifi} fullWidth>
                Retrieve Password
              </ActionButton>
            </>
          )}

          {wifiState === 'loading' && (
            <ActionButton loading fullWidth>Reading from OS...</ActionButton>
          )}

          {wifiState === 'revealed' && (
            <PasswordReveal
              password="MySecureWifi2024!"
              label={`Password for "${ssid}"`}
            />
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
                manufacturer defaults. Results may not apply if credentials were changed.
              </p>
              <ActionButton icon={KeyRound} onClick={handleGetDefaults} fullWidth>
                Look Up Defaults
              </ActionButton>
            </>
          )}

          {defaultState === 'loading' && (
            <ActionButton loading fullWidth>Scanning MAC address...</ActionButton>
          )}

          {defaultState === 'matched' && match && (
            <div className="cred-result">
              <div className="cred-vendor">
                <Tag size={13} />
                {match.vendor}
              </div>
              <PasswordReveal password={match.username} label="Default Username" />
              <PasswordReveal password={match.password} label="Default Password" />
              <p className="cred-warning">
                These are factory defaults — only valid if you haven't changed them yet.
              </p>
            </div>
          )}

          {defaultState === 'no-match' && (
            <div className="cred-no-match">
              <p>No match found in our local database.</p>
              <button
                className="cred-expand-btn"
                onClick={() => setLabelExpanded(v => !v)}
              >
                {labelExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                How to find credentials on your router label
              </button>
              {labelExpanded && (
                <ol className="cred-label-steps">
                  <li>Turn your router over to see the bottom or back.</li>
                  <li>Look for a sticker labeled "Username", "Password", or "Admin".</li>
                  <li>The default network name (SSID) and password are usually there too.</li>
                  <li>Common defaults include <code>admin / admin</code> or <code>admin / password</code>.</li>
                </ol>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
