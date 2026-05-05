import React from 'react'
import './ActionButton.css'

export default function ActionButton({
  children,
  onClick,
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'ghost'
  loading = false,
  disabled = false,
  icon: Icon,
  fullWidth = false,
}) {
  return (
    <button
      className={`action-btn action-btn--${variant} ${fullWidth ? 'action-btn--full' : ''}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="btn-spinner" />
      ) : Icon ? (
        <Icon size={15} />
      ) : null}
      {children}
    </button>
  )
}
