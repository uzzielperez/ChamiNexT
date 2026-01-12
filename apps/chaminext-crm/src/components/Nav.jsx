import React from 'react'
import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="brand">ChamiNext CRM</div>
        <nav className="links">
          <Link to="/">Dashboard</Link>
          <Link to="/contacts">Contacts</Link>
          <Link to="/candidates">Talent</Link>
        </nav>
      </div>
    </header>
  )
}
