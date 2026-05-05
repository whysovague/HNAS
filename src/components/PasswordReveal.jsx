import React, { useState } from 'react'
import { Eye, EyeOff, Copy, Check } from 'lucide-react'
import './PasswordReveal.css'

export default function PasswordReveal({ password, label = 'Password' }) {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="pw-reveal">
      <span className="pw-label">{label}</span>
      <div className="pw-box">
        <span className="pw-value">
          {visible ? password : '•'.repeat(Math.min(password.length, 20))}
        </span>
        <div className="pw-actions">
          <button
            className="pw-btn"
            onClick={() => setVisible(v => !v)}
            title={visible ? 'Hide' : 'Show'}
          >
            {visible ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
          <button
            className="pw-btn"
            onClick={handleCopy}
            title="Copy to clipboard"
          >
            {copied ? <Check size={15} style={{ color: 'var(--lime)' }} /> : <Copy size={15} />}
          </button>
        </div>
      </div>
    </div>
  )
}
