import { FluencyResponse } from '../schemas.js'
import { clip, clipList, isSafeText, quote, runAgent } from '../claude.js'

// Fluency and Response Agent: supportive reading-practice feedback from a
// read-aloud transcript. Reading practice only; no speech or learning
// diagnosis of any kind.

const SYSTEM = `ROLE: Fluency and Response Agent.
You receive a passage, the transcript of a student reading it aloud (produced by speech recognition, so it can contain recognition mistakes), their grade (3-5), and how long the reading took.
Compare the transcript to the passage and return supportive reading-practice feedback:
- encouragement: one warm, specific sentence that celebrates effort.
- strengths: 1-3 things they did well (for example "kept going through long sentences", "read describing words clearly").
- wordsToPractice: up to 5 words FROM THE PASSAGE that were skipped, changed, or hard to follow in the transcript. Prefer meaningful words over tiny ones like "the" or "a". Use the passage spelling. Use an empty array if none.
- practiceTip: one friendly tip they can try next time (for example "Point to each word as you read" or "Read the tricky word slowly, then the whole sentence").
Remember the transcript may be wrong, not the child. Speech recognition often misses words, names and quiet speech, so keep wording gentle: "let's practice" and "try again".
Reading-practice feedback ONLY. Do NOT diagnose or suggest any speech, language, hearing, or learning disorder or condition. Do NOT act as a speech therapist, comment on how a child's voice or accent sounds, or recommend therapy or evaluation.`

const STOP = new Set('the a an and or but of to in on at is was were it that this he she they his her with for as by from be are had has would could there their about which when then'.split(' '))
const norm = (w) => w.toLowerCase().replace(/[^a-z']/g, '')

function mock({ passage, transcript }) {
  const said = new Set((transcript.match(/[A-Za-z']+/g) ?? []).map(norm))
  const passageWords = passage.match(/[A-Za-z']+/g) ?? []
  const missed = [...new Set(passageWords.map(norm))]
    .filter((w) => w.length >= 5 && !STOP.has(w) && !said.has(w))
    .slice(0, 4)
  const coverage = passageWords.length ? passageWords.filter((w) => said.has(norm(w))).length / passageWords.length : 0
  return {
    encouragement: coverage >= 0.7 ? 'Great reading! You kept going all the way through.' : 'Nice try! Reading out loud takes courage.',
    wordsToPractice: missed,
    strengths: [coverage >= 0.7 ? 'Read most of the story out loud' : 'Gave reading aloud a try', 'Stayed with the story'],
    practiceTip: missed.length
      ? `Try reading "${missed[0]}" slowly, then read the whole sentence again.`
      : 'Try reading the story again with more expression, like a storyteller.',
  }
}

const finalize = (d) => ({
  encouragement: clip(d.encouragement, 300),
  wordsToPractice: clipList(d.wordsToPractice, 5, 40),
  strengths: clipList(d.strengths, 3),
  practiceTip: clip(d.practiceTip, 300),
})

export function fluencyAgent(input) {
  const { passage, transcript, grade, readingSeconds } = input
  const user = `Grade: ${grade}
Reading time: ${readingSeconds != null ? `${Math.round(readingSeconds)} seconds` : 'not provided'}
Passage:
${quote(passage)}

Read-aloud transcript:
${quote(transcript)}`

  return runAgent({
    name: 'fluency',
    system: SYSTEM,
    user,
    schema: FluencyResponse,
    mock: () => mock(input),
    finalize,
    screen: (d) => isSafeText(d.encouragement, d.strengths, d.practiceTip),
  })
}
