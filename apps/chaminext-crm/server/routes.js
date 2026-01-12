const express = require('express')
const router = express.Router()
const db = require('./data')

router.get('/stats', (req, res) => {
  res.json({ contacts: db.contacts.length, candidates: db.candidates.length, companies: db.companies.length })
})

router.get('/contacts', (req, res) => {
  res.json(db.contacts)
})

router.post('/contacts', (req, res) => {
  const { name, email, companyId } = req.body || {}
  const id = String(Date.now())
  const contact = { id, name: name || 'Unnamed', email: email || '', companyId: companyId || null }
  db.contacts.unshift(contact)
  res.json(contact)
})

router.get('/candidates', (req, res) => {
  res.json(db.candidates)
})

router.post('/candidates', (req, res) => {
  const { name, role } = req.body || {}
  const id = String(Date.now())
  const candidate = { id, name: name || 'Unnamed', role: role || '', stage: 'sourced' }
  db.candidates.unshift(candidate)
  res.json(candidate)
})

router.get('/companies', (req, res) => res.json(db.companies))

router.get('/pipeline', (req, res) => {
  // Simple pipeline summary grouped by stage
  const grouped = db.candidates.reduce((acc, c) => {
    acc[c.stage] = (acc[c.stage] || 0) + 1
    return acc
  }, {})
  res.json({ pipeline: grouped })
})

module.exports = router
