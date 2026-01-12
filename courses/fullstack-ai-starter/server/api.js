// Mock generate handler — replace with real model integration

exports.generate = async (req, res) => {
  const { prompt } = req.body || {}
  // simple deterministic mock response
  const answer = `Mock model response for prompt: ${prompt.slice(0, 200)}`
  res.json({ answer, timestamp: new Date().toISOString() })
}
