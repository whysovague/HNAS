import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import './DashboardCard.css'

export default function DashboardCard({ icon: Icon, title, description, to, accent = 'cyan', badge }) {
  const navigate = useNavigate()
  return (
    <button
      className={`dash-card dash-card--${accent}`}
      onClick={() => navigate(to)}
    >
      <div className="dash-card-icon">
        <Icon size={24} />
      </div>
      <div className="dash-card-body">
        <div className="dash-card-title">
          {title}
          {badge && <span className="dash-card-badge">{badge}</span>}
        </div>
        <div className="dash-card-desc">{description}</div>
      </div>
      <ArrowRight size={16} className="dash-card-arrow" />
    </button>
  )
}
