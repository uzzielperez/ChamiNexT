import React, { useState } from 'react'

export default function App() {
  const [prompt, setPrompt] = useState('Explain retrieval-augmented generation in one paragraph')
  const [resp, setResp] = useState(null)
  const [loading, setLoading] = useState(false)

  async function callApi() {
    setLoading(true)
    try {
      const r = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const data = await r.json()
      setResp(data)
    } catch (e) {
      setResp({ error: String(e) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <h1>Fullstack AI Starter</h1>
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} style={{ width: '100%', minHeight: 100 }} />
      <div style={{ marginTop: 8 }}>
        <button onClick={callApi} disabled={loading} style={{ padding: '8px 12px' }}>{loading ? 'Loading...' : 'Generate'}</button>
      </div>

      <div style={{ marginTop: 16 }}>
        <h3>Response</h3>
        <pre style={{ background: '#fff', padding: 12, border: '1px solid #eee' }}>{resp ? JSON.stringify(resp, null, 2) : 'No response yet'}</pre>
      </div>
    </div>
  )
}
