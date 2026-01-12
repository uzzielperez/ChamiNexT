import React, { useEffect, useState } from 'react'

export default function Candidates() {
  const [candidates, setCandidates] = useState([])
  const [name, setName] = useState('')
  const [role, setRole] = useState('')

  useEffect(() => {
    fetch('/api/candidates').then((r) => r.json()).then(setCandidates).catch(() => setCandidates([]))
  }, [])

  async function addCandidate(e) {
    e.preventDefault()
    const res = await fetch('/api/candidates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, role }) })
    const data = await res.json()
    setCandidates((c) => [data, ...c])
    setName('')
    setRole('')
  }

  return (
    <div>
      <h1>Talent Pipeline</h1>
      <form onSubmit={addCandidate} className="form-inline">
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Desired role" value={role} onChange={(e) => setRole(e.target.value)} />
        <button type="submit">Add</button>
      </form>

      <ul className="list">
        {candidates.map((c) => (
          <li key={c.id} className="list-item">
            <div className="title">{c.name}</div>
            <div className="muted">{c.role}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
