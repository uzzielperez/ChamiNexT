const fs = require('fs')
const path = require('path')

function chunkText(text, size = 800) {
  const chunks = []
  for (let i = 0; i < text.length; i += size) chunks.push(text.slice(i, i + size))
  return chunks
}

function simpleEmbed(text, dim = 64) {
  const v = new Array(dim).fill(0)
  for (let i = 0; i < text.length; i++) {
    const idx = i % dim
    v[idx] += text.charCodeAt(i)
  }
  const max = Math.max(...v.map(Math.abs)) || 1
  return v.map((x) => x / max)
}

async function run() {
  const docsDir = path.join(__dirname, 'docs')
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir)

  // ensure a sample doc
  const samplePath = path.join(docsDir, 'sample.txt')
  if (!fs.existsSync(samplePath)) {
    fs.writeFileSync(samplePath, 'This is a sample document for the Building RAGs starter. It explains the demo and how retrieval works.')
  }

  const files = fs.readdirSync(docsDir).filter((f) => f.endsWith('.txt'))
  const items = []
  for (const f of files) {
    const txt = fs.readFileSync(path.join(docsDir, f), 'utf8')
    const chunks = chunkText(txt, 600)
    for (let i = 0; i < chunks.length; i++) {
      items.push({ id: `${f}#${i}`, text: chunks[i], embedding: simpleEmbed(chunks[i]) })
    }
  }

  const store = { created: new Date().toISOString(), items }
  fs.writeFileSync(path.join(__dirname, 'vectorstore.json'), JSON.stringify(store, null, 2))
  console.log('Wrote vectorstore.json with', items.length, 'items')
}

run().catch((err) => { console.error(err); process.exit(1) })
