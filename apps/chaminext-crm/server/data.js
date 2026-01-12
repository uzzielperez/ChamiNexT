// In-memory seed data for the CRM
const { v4: uuidv4 } = require('uuid')

const companies = [
  { id: uuidv4(), name: 'Acme Labs' },
  { id: uuidv4(), name: 'Startup Co' }
]

const contacts = [
  { id: uuidv4(), name: 'Alice Johnson', email: 'alice@acme.com', companyId: companies[0].id },
  { id: uuidv4(), name: 'Bob Smith', email: 'bob@startup.com', companyId: companies[1].id }
]

const candidates = [
  { id: uuidv4(), name: 'Charlie Candidate', role: 'Frontend Engineer', stage: 'sourced' }
]

module.exports = { companies, contacts, candidates }
