import React from 'react'
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react'
import './DiagnosticTimeline.css'

const icons = {
  success: <CheckCircle2 size={18} className="diag-icon diag-icon--success" />,
  fail: <XCircle size={18} className="diag-icon diag-icon--fail" />,
  warning: <AlertCircle size={18} className="diag-icon diag-icon--warning" />,
  running: <Loader2 size={18} className="diag-icon diag-icon--running spin" />,
  idle: <div className="diag-dot" />,
}

export default function DiagnosticTimeline({ steps }) {
  return (
    <ol className="diag-timeline">
      {steps.map((step, i) => (
        <li key={step.id} className={`diag-step diag-step--${step.status}`}>
          <div className="diag-marker">
            {icons[step.status] ?? icons.idle}
            {i < steps.length - 1 && <div className="diag-line" />}
          </div>
          <div className="diag-content">
            <div className="diag-header">
              <span className="diag-label">{step.label}</span>
              <span className="diag-detail">{step.detail}</span>
            </div>
            <p className="diag-desc">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
