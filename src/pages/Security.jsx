import React, { useState } from 'react'
import { Bell, Mail, MessageSquare, ShieldCheck } from 'lucide-react'
import SecurityChecklist from '../components/SecurityChecklist'
import ActionButton from '../components/ActionButton'
import { securityChecklist, networkStatus } from '../data/mockData'
import './Security.css'

const intervals = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'semi-annual', label: 'Every 6 months' },
  { value: 'annual', label: 'Yearly' },
]

export default function Security() {
  const [interval, setInterval] = useState('semi-annual')
  const [notifType, setNotifType] = useState('email')
  const [contact, setContact] = useState('')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    // TODO: persist via Electron store / IPC
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Security</h1>
        <p className="page-subtitle">Set up reminders and track your security health.</p>
      </div>

      <div className="sec-layout">
        {/* Reminder config */}
        <div className="sec-panel">
          <div className="sec-panel-title">
            <Bell size={16} />
            Security Reminders
          </div>

          <div className="sec-field">
            <label className="sec-label">Reminder Interval</label>
            <div className="sec-toggle-group">
              {intervals.map(opt => (
                <button
                  key={opt.value}
                  className={`sec-toggle ${interval === opt.value ? 'sec-toggle--active' : ''}`}
                  onClick={() => setInterval(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="sec-field">
            <label className="sec-label">Notification Method</label>
            <div className="sec-toggle-group">
              <button
                className={`sec-toggle ${notifType === 'email' ? 'sec-toggle--active' : ''}`}
                onClick={() => setNotifType('email')}
              >
                <Mail size={13} /> Email
              </button>
              <button
                className={`sec-toggle ${notifType === 'sms' ? 'sec-toggle--active' : ''}`}
                onClick={() => setNotifType('sms')}
              >
                <MessageSquare size={13} /> SMS
              </button>
            </div>
          </div>

          <div className="sec-field">
            <label className="sec-label">
              {notifType === 'email' ? 'Email Address' : 'Phone Number'}
            </label>
            <input
              className="sec-input"
              type={notifType === 'email' ? 'email' : 'tel'}
              placeholder={notifType === 'email' ? 'you@example.com' : '+1 555 000 0000'}
              value={contact}
              onChange={e => setContact(e.target.value)}
            />
          </div>

          <ActionButton
            icon={Bell}
            onClick={handleSave}
            disabled={!contact.trim()}
            fullWidth
          >
            {saved ? 'Reminder Saved!' : 'Save Reminder'}
          </ActionButton>

          <p className="sec-note">
            Reminders include prompts to change your Wi-Fi password, update firmware,
            and review connected devices.
          </p>
        </div>

        {/* Security checklist */}
        <div className="sec-panel">
          <div className="sec-panel-title">
            <ShieldCheck size={16} />
            Security Checklist
          </div>
          <p className="sec-checklist-intro">
            Track important security tasks for your home network. Click each item to mark it done.
          </p>
          <SecurityChecklist items={securityChecklist} />
          <div className="sec-enc">
            <span className="sec-enc-label">Detected encryption</span>
            <span className="sec-enc-value">{networkStatus.encryptionType}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
