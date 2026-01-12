import React, { useEffect, useState } from 'react'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  useEffect(() => {
    fetch('/api/stats').then((r) => r.json()).then(setStats).catch(() => setStats(null))
  }, [])

  return (
    <div>
      <h1>Dashboard</h1>
      {stats ? (
        <div className="stats">
          <div className="stat">Contacts: <strong>{stats.contacts}</strong></div>
          <div className="stat">Candidates: <strong>{stats.candidates}</strong></div>
          <div className="stat">Companies: <strong>{stats.companies}</strong></div>
        </div>
      ) : (
        <div>Loading stats...</div>
      )}
    </div>
  )
}
