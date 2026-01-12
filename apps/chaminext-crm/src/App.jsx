import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Dashboard from './pages/Dashboard'
import Contacts from './pages/Contacts'
import Candidates from './pages/Candidates'

export default function App() {
  return (
    <div className="app-root">
      <Nav />
      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/candidates" element={<Candidates />} />
        </Routes>
      </main>
    </div>
  )
}
