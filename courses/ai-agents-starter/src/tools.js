// Mock tools for the AI Agents starter

exports.tools = {
  search: async (q) => {
    // simple static results
    return [{ id: 'doc1', text: `Result for ${q}: the quick brown fox.` }]
  },
  calc: async (expr) => {
    try {
      // very unsafe eval for demo only
      // eslint-disable-next-line no-eval
      const res = eval(expr)
      return { result: String(res) }
    } catch (e) {
      return { error: String(e) }
    }
  },
  echo: async (text) => ({ text }),
}
