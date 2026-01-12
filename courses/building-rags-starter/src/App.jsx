import React, { useEffect, useState } from 'react'

function cosine(a, b) {
  const n = Math.min(a.length, b.length)
  let dot = 0, na = 0, nb = 0
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  if (na === 0 || nb === 0) return 0
  return dot / (Math.sqrt(na) * Math.sqrt(nb))
}

// Simple deterministic embedding for demo purposes
function simpleEmbed(text, dim = 64) {
  const v = new Array(dim).fill(0)
  for (let i = 0; i < text.length; i++) {
    const idx = i % dim
    v[idx] += text.charCodeAt(i)
  }
  // normalize
  const max = Math.max(...v.map(Math.abs)) || 1
  return v.map((x) => x / max)
}

export default function App() {
  const [store, setStore] = useState(null)
  const [query, setQuery] = useState('What is the project about?')
  const [results, setResults] = useState([])

  useEffect(() => {
    fetch('/vectorstore.json')
      .then((r) => r.json())
      .then(setStore)
      .catch(() => setStore(null))
  }, [])

  function ask() {
    const qEmb = simpleEmbed(query)
    if (!store || !store.items) return
    const scored = store.items.map((it) => ({
      ...it,
      score: cosine(qEmb, it.embedding || simpleEmbed(it.text || ''))
    }))
    scored.sort((a, b) => b.score - a.score)
    setResults(scored.slice(0, 5))
  }

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: 24 }}>
      <h1>Building RAGs — Starter QA Demo</h1>
      <p>Load `vectorstore.json` (created by <code>npm run ingest</code>) and try asking a question.</p>

      <div style={{ marginTop: 12 }}>
        <input value={query} onChange={(e) => setQuery(e.target.value)} style={{ width: '70%', padding: 8 }} />
        <button onClick={ask} style={{ marginLeft: 8, padding: '8px 12px' }}>Ask</button>
      </div>

      <div style={{ marginTop: 18 }}>
        <h3>Top matches</h3>
        {!store && <div>vectorstore.json not found (run `npm run ingest`)</div>}
        {results.map((r, i) => (
          <div key={i} style={{ padding: 12, borderRadius: 8, background: 'rgba(0,0,0,0.03)', marginTop: 8 }}>
            <div style={{ fontWeight: 600 }}>{r.id} — score: {r.score.toFixed(3)}</div>
            <div style={{ fontSize: 14 }}>{r.text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
