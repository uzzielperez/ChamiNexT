import React, { useState } from 'react'
import { tools } from './tools'

// Very small agent loop: plan -> choose tool -> execute -> append observations
function simplePlanner(task) {
  // naive planner: if contains math, use calc; if contains "search" or "find", use search
  const t = task.toLowerCase()
  if (t.match(/\b(what|who|where|when|search|find)\b/)) return [{ tool: 'search', input: task }]
  if (t.match(/[0-9]+\s*[+\-*/]/)) return [{ tool: 'calc', input: task }]
  return [{ tool: 'echo', input: task }]
}

export default function App() {
  const [task, setTask] = useState('Find information about the quick brown fox')
  const [log, setLog] = useState([])

  async function runAgent() {
    setLog((l) => [...l, { role: 'system', text: `Task: ${task}` }])
    const plan = simplePlanner(task)
    setLog((l) => [...l, { role: 'agent', text: `Plan: ${JSON.stringify(plan)}` }])

    for (const step of plan) {
      setLog((l) => [...l, { role: 'agent', text: `Calling tool ${step.tool}(${step.input})` }])
      try {
        const out = await tools[step.tool](step.input)
        setLog((l) => [...l, { role: 'tool', text: JSON.stringify(out) }])
      } catch (e) {
        setLog((l) => [...l, { role: 'tool', text: `Error: ${String(e)}` }])
      }
    }
  }

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: 20 }}>
      <h1>AI Agents Starter</h1>
      <p>Simple planner + mock tools demo.</p>

      <div style={{ marginTop: 12 }}>
        <input value={task} onChange={(e) => setTask(e.target.value)} style={{ width: '70%', padding: 8 }} />
        <button onClick={runAgent} style={{ marginLeft: 8, padding: '8px 12px' }}>Run Agent</button>
      </div>

      <div style={{ marginTop: 18 }}>
        <h3>Log</h3>
        <div style={{ maxHeight: 360, overflow: 'auto', background: '#fff', border: '1px solid #eee', padding: 12 }}>
          {log.map((entry, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: '#666' }}>{entry.role}</div>
              <div>{entry.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
