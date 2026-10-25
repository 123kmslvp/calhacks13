# Kernel Quest

Kernel Quest is a literacy learning app for students in grades 3–5. Students read interactive stories, practice comprehension and vocabulary, and earn rewards as they progress. Teachers can use the classroom dashboard to review student activity and reading skills.

## Features

### Student experience

- Choose a student profile and enter the reading quest.
- Read illustrated, grade-leveled stories across multiple worlds and chapters.
- Practice comprehension skills such as main idea, details, vocabulary, prediction, inference, fact versus opinion, and using evidence.
- Use reading supports and activities, including read-aloud, word help, writing, drawing, and Word Rescue.
- Play story-related arcade activities.
- Earn Pop Points, stars, badges, and Poppy customizations; view reading history and progress.

### Teacher experience

- View class-level reading insights, charts, and trends, then inspect individual student progress.
- Create classes, add students individually, or import a student list.
- View suggested next steps and prepare parent progress reports. Report delivery opens the teacher's email app with a draft; the app does not send email automatically.
- Explore the demo with sample classes and students, or reset the data to the sample roster.

## Requirements

- Node.js 22 or newer (the server command uses Node's `--env-file-if-exists` option).
- npm (included with Node.js).
- A modern browser. Read-aloud and speech input use browser speech APIs, whose availability can vary by browser and device.
- Optional: an Anthropic API key to enable Claude-powered story, tutoring, fluency, and teacher insight agents. The app can run without this key using mock agent responses and built-in rule-based fallbacks.

## Install and run

From the repository root:

```bash
npm install
```

Start the frontend and the API server in separate terminals:

```bash
npm run dev
```

```bash
npm run server
```

Open the local URL printed by Vite (usually `http://localhost:5173`). The Vite development server forwards `/api` requests to the agent server on port `8791`.

### Enable Claude agents (optional)

Copy `server/.env.example` to `server/.env` and set `ANTHROPIC_API_KEY`:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

Then restart `npm run server`. Without a key, the server starts in mock mode. You can also set `CLAUDE_MODEL`, `CLAUDE_EFFORT`, and `PORT` in `server/.env`; see the example file for defaults. Keep the API key in the server environment and do not put it in frontend code. The server file is ignored by Git.

## Build

Create the production frontend bundle:

```bash
npm run build
```

Preview the built frontend locally:

```bash
npm run preview
```

The build output is written to `dist/`. The agent API is a separate Node server; `npm run preview` only serves the frontend bundle.

## Project layout

```text
src/
  components/     Shared student-facing UI components
  data/           Story library, roster, progress, rewards, and reports
  game/           Reading quest, learning activities, and arcade games
  teacher/        Teacher dashboard, imports, charts, and reports
  services/       Browser-side API and email helpers
server/
  agents/         Story, tutoring, fluency, and teacher insight agents
  index.js        HTTP API server and request validation
  orchestrator.js Coordinates multi-agent session requests
scripts/          Story data validation utility
public/           App images and animation assets
```

Class and student data is stored in the browser's `localStorage` for this demo; it is not backed by a database. Use the teacher dashboard's reset option to restore sample data in the current browser.

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite frontend development server |
| `npm run server` | Start the local agent API server |
| `npm run build` | Build the production frontend bundle |
| `npm run preview` | Preview the production frontend bundle locally |
| `node scripts/validate-stories.mjs` | Check story files for required content and structure |
