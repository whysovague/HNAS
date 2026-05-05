import React, { useState } from 'react'
import { Play, RotateCcw, Router, Globe, Server } from 'lucide-react'
import ActionButton from '../components/ActionButton'
import DiagnosticTimeline from '../components/DiagnosticTimeline'
import { diagnosticSteps } from '../data/mockData'
import './Troubleshoot.css'

const failureMap = {
  fail: {
    category: 'DNS',
    icon: Server,
    color: 'var(--red)',
    title: 'DNS Issue Detected',
    description:
      'Your internet connection works, but domain names are not resolving. This is likely a DNS configuration problem.',
    steps: [
      'Open your router settings and check the DNS server addresses.',
      'Try switching to a public DNS: 8.8.8.8 (Google) or 1.1.1.1 (Cloudflare).',
      'Restart your router and modem.',
      'Contact your ISP if the issue persists.',
    ],
  },
  warning: {
    category: 'ISP',
    icon: Globe,
    color: 'var(--amber)',
    title: 'ISP Latency Detected',
    description: 'Your connection is working but high latency was found past your router. This may be an ISP issue.',
    steps: [
      'Run a speed test at fast.com or speedtest.net.',
      'Restart your modem (wait 30 seconds before powering back on).',
      'Check your ISP service status page for outages.',
      'Call your ISP if speeds are consistently below the plan rate.',
    ],
  },
}

export default function Troubleshoot() {
  const [runState, setRunState] = useState('idle') // idle | running | done
  const [steps, setSteps] = useState(diagnosticSteps.map(s => ({ ...s, status: 'idle' })))

  function handleRun() {
    setRunState('running')
    const results = diagnosticSteps
    let i = 0
    const interval = setInterval(() => {
      if (i >= results.length) {
        clearInterval(interval)
        setRunState('done')
        return
      }
      const result = results[i]
      setSteps(prev =>
        prev.map((s, idx) => idx === i ? { ...s, status: result.status, detail: result.detail } : s)
      )
      i++
    }, 900)
  }

  function handleReset() {
    setRunState('idle')
    setSteps(diagnosticSteps.map(s => ({ ...s, status: 'idle', detail: '' })))
  }

  const failure = runState === 'done'
    ? steps.find(s => s.status === 'fail') || steps.find(s => s.status === 'warning')
    : null
  const failureInfo = failure ? failureMap[failure.status] : null

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Troubleshoot</h1>
        <p className="page-subtitle">Diagnose connectivity issues step-by-step.</p>
      </div>

      <div className="trouble-layout">
        <div className="trouble-panel">
          <div className="trouble-panel-header">
            <span className="trouble-panel-title">Diagnostics</span>
            <div className="trouble-actions">
              {runState === 'idle' && (
                <ActionButton icon={Play} onClick={handleRun}>
                  Run Diagnostics
                </ActionButton>
              )}
              {runState === 'running' && (
                <ActionButton loading>Running...</ActionButton>
              )}
              {runState === 'done' && (
                <ActionButton icon={RotateCcw} variant="secondary" onClick={handleReset}>
                  Run Again
                </ActionButton>
              )}
            </div>
          </div>

          {runState === 'idle' ? (
            <div className="trouble-empty">
              <Play size={32} className="trouble-empty-icon" />
              <p>Click "Run Diagnostics" to test your connection.</p>
            </div>
          ) : (
            <DiagnosticTimeline
              steps={steps.map((s, i) => ({
                ...s,
                status:
                  runState === 'running' && s.status === 'idle'
                    ? i === steps.findIndex(x => x.status === 'idle') ? 'running' : 'idle'
                    : s.status,
              }))}
            />
          )}
        </div>

        {failureInfo && (
          <div className="trouble-result" style={{ borderColor: failureInfo.color + '40' }}>
            <div className="trouble-result-header" style={{ color: failureInfo.color }}>
              <failureInfo.icon size={18} />
              <span className="trouble-result-cat">{failureInfo.category} Problem</span>
            </div>
            <h3 className="trouble-result-title">{failureInfo.title}</h3>
            <p className="trouble-result-desc">{failureInfo.description}</p>
            <h4 className="trouble-result-steps-title">Suggested steps:</h4>
            <ol className="trouble-result-steps">
              {failureInfo.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>
        )}

        {runState === 'done' && !failureInfo && (
          <div className="trouble-result trouble-result--ok">
            <div className="trouble-result-header" style={{ color: 'var(--lime)' }}>
              All diagnostics passed
            </div>
            <p className="trouble-result-desc">
              Your network appears to be functioning normally. If you're still experiencing issues,
              try restarting your device.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
