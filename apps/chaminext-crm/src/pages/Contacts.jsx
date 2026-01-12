import React, { useEffect, useState } from 'react'

export default function Contacts() {
  const [contacts, setContacts] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    fetch('/api/contacts').then((r) => r.json()).then(setContacts).catch(() => setContacts([]))
  }, [])

  async function addContact(e) {
    e.preventDefault()
    const res = await fetch('/api/contacts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email }) })
    const data = await res.json()
    setContacts((c) => [data, ...c])
    setName('')
    setEmail('')
  }

  return (
    <div>
      <h1>Contacts</h1>
      <form onSubmit={addContact} className="form-inline">
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">Add</button>
      </form>

      <ul className="list">
        {contacts.map((c) => (
          <li key={c.id} className="list-item">
            <div className="title">{c.name}</div>
            <div className="muted">{c.email}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
