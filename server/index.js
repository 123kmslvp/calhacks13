import { createServer } from 'node:http'
import { storyAgent } from './agents/storyAgent.js'
import { socraticAgent } from './agents/socraticAgent.js'
import { fluencyAgent } from './agents/fluencyAgent.js'
import { teacherInsightAgent } from './agents/teacherInsightAgent.js'
import { runSession } from './orchestrator.js'
import { MOCK_MODE, MODEL } from './claude.js'
import {
  FluencyRequest,
  SessionRequest,
  SocraticRequest,
  StoryRequest,
  TeacherRequest,
  issuesOf,
} from './schemas.js'

// Small API server for the Claude agents. The Vite dev server proxies /api
// here, so the browser only ever talks to this server, never to Anthropic.

const PORT = Number(process.env.PORT) || 8791
const MAX_BODY = 200 * 1024 // bytes
const RATE_LIMIT = { windowMs: 60_000, max: 60 } // requests per IP per window

// Single-agent endpoints answer with the agent's output plus a small `meta`.
const single = (agent) => async (input) => {
  const { data, source } = await agent(input)
  return { ...data, meta: { source } }
}

const ROUTES = {
  '/api/agents/story': [StoryRequest, single(storyAgent)],
  '/api/agents/socratic': [SocraticRequest, single(socraticAgent)],
  '/api/agents/fluency': [FluencyRequest, single(fluencyAgent)],
  '/api/agents/teacher': [TeacherRequest, single(teacherInsightAgent)],
  '/api/agents/session': [SessionRequest, runSession],
}

const hits = new Map()
function limited(ip) {
  const now = Date.now()
  const entry = hits.get(ip)
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + RATE_LIMIT.windowMs })
    return false
  }
  return ++entry.count > RATE_LIMIT.max
}
setInterval(() => {
  const now = Date.now()
  for (const [ip, e] of hits) if (now > e.reset) hits.delete(ip)
}, RATE_LIMIT.windowMs).unref()

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
  res.end(JSON.stringify(body))
}

class HttpError extends Error {
  constructor(status, code, issues) {
    super(code)
    this.status = status
    this.code = code
    this.issues = issues
  }
}

async function readJson(req) {
  if (!/^application\/json\b/i.test(req.headers['content-type'] ?? '')) {
    throw new HttpError(415, 'content_type_must_be_json')
  }
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > MAX_BODY) throw new HttpError(413, 'request_too_large')
    chunks.push(chunk)
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw new HttpError(400, 'invalid_json')
  }
}

const server = createServer(async (req, res) => {
  try {
    const path = new URL(req.url, 'http://localhost').pathname

    if (path === '/api/health') {
      return send(res, 200, { ok: true, mode: MOCK_MODE ? 'mock' : 'claude', model: MOCK_MODE ? null : MODEL })
    }

    const route = ROUTES[path]
    if (!route) throw new HttpError(404, 'not_found')
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      throw new HttpError(405, 'method_not_allowed')
    }
    if (limited(req.socket.remoteAddress ?? 'unknown')) throw new HttpError(429, 'too_many_requests')

    const [schema, handler] = route
    const parsed = schema.safeParse(await readJson(req))
    if (!parsed.success) throw new HttpError(400, 'invalid_request', issuesOf(parsed.error))

    send(res, 200, await handler(parsed.data))
  } catch (err) {
    if (err instanceof HttpError) {
      return send(res, err.status, { error: err.code, ...(err.issues && { issues: err.issues }) })
    }
    // Anything unexpected: log the kind of error, tell the client nothing else.
    console.error('Unhandled server error:', err?.name ?? 'Error')
    send(res, 500, { error: 'server_error' })
  }
})

server.listen(PORT, () => {
  console.log(
    MOCK_MODE
      ? `Kernel Quest agents on http://localhost:${PORT} - MOCK mode (no ANTHROPIC_API_KEY in server/.env)`
      : `Kernel Quest agents on http://localhost:${PORT} - Claude mode (${MODEL})`
  )
})
