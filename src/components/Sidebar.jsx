import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Router,
  KeyRound,
  ShieldCheck,
  Wifi,
} from 'lucide-react'
import './Sidebar.css'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/router', icon: Router, label: 'Router Access' },
  { to: '/credentials', icon: KeyRound, label: 'Credentials' },
  { to: '/security', icon: ShieldCheck, label: 'Security' },
  { to: '/devices', icon: Wifi, label: 'Devices' },
]

export default function Sidebar({ isCollapsed, onToggle }) {
  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo">
        <span className="logo-bracket">[</span>
        <span className="logo-text">HNAS</span>
        <span className="logo-bracket">]</span>

        <button
          type="button"
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="sidebar-version">v1.0.0-alpha</span>
      </div>
    </aside>
  )
}
