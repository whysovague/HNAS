import React, { useState } from 'react'
import { Check, X } from 'lucide-react'
import './SecurityChecklist.css'

export default function SecurityChecklist({ items: initialItems }) {
  const [items, setItems] = useState(initialItems)

  function toggle(id) {
    setItems(prev =>
      prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    )
  }

  const done = items.filter(i => i.checked).length

  return (
    <div className="checklist">
      <div className="checklist-progress">
        <span className="checklist-score">{done}/{items.length} completed</span>
        <div className="checklist-bar">
          <div
            className="checklist-fill"
            style={{ width: `${(done / items.length) * 100}%` }}
          />
        </div>
      </div>
      <ul className="checklist-list">
        {items.map(item => (
          <li
            key={item.id}
            className={`checklist-item ${item.checked ? 'checked' : ''}`}
            onClick={() => toggle(item.id)}
          >
            <span className="checklist-box">
              {item.checked ? <Check size={12} /> : <X size={12} />}
            </span>
            <span className="checklist-label">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
