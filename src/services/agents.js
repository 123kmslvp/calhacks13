// Calls a Kernel Quest agent on the local server. Returns null if the server
// isn't running or the agent fails, so callers can fall back to the built-in
// rule-based logic and the app keeps working.
export async function askAgent(name, input) {
  try {
    const res = await fetch(`/api/agents/${name}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(20000),
    })
    return res.ok ? await res.json() : null
  } catch {
    return null
  }
}
