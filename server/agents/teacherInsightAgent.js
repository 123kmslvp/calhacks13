import { TeacherResponse } from '../schemas.js'
import { clip, clipList, isSafeText, runAgent } from '../claude.js'

// Teacher Insight Agent: turns one student's session data into a short,
// supportive summary for the teacher. Its output is for the teacher view;
// the frontend should not show it to students.

const SYSTEM = `ROLE: Teacher Insight Agent.
You receive one student's session data: their grade (3-5), learning pathway, comprehension answers (with the skill each practiced and whether it was right), reading-aloud data, engagement, and recent activity history. The student is anonymous; do not invent a name.
Return a structured summary for the classroom teacher:
- strengths: 2-4 specific strengths backed by the data.
- skillsToPractice: 1-3 skills that would benefit from more practice (for example "finding text evidence", "vocabulary in context"). Phrase as skills to build, never as labels about the child.
- engagementSummary: 1-2 sentences about effort and engagement, including which ways of exploring they chose.
- recommendedNextActivity: ONE concrete next activity the teacher or student could do.
- teacherSummary: 3-4 sentences a busy teacher can read in ten seconds.
Use supportive, strengths-based language. Avoid discouraging labels such as "struggling", "behind", "weak", or "low", because summaries may be shared with families. Do NOT diagnose or speculate about any speech, language, learning or attention condition, and never recommend an evaluation.
Base everything on the data provided. If data is thin, say what you could see and suggest gathering more, instead of guessing.`

function mock({ grade, pathway, storyTitle, answers, fluency, engagement }) {
  const done = answers.filter((a) => a.isCorrect !== undefined)
  const right = done.filter((a) => a.isCorrect).length
  const skills = [...new Set(answers.map((a) => a.skillPracticed).filter(Boolean))]
  const needs = [...new Set(done.filter((a) => !a.isCorrect).map((a) => a.skillPracticed).filter(Boolean))]
  const practiceWords = fluency?.wordsToPractice ?? []
  return {
    strengths: [
      done.length ? `Answered ${done.length} comprehension question${done.length === 1 ? '' : 's'}${done.length ? `, ${right} on track` : ''}` : 'Showed up and explored the story',
      fluency?.wcpm ? `Read aloud at about ${Math.round(fluency.wcpm)} words per minute` : 'Willing to try new ways of exploring',
    ],
    skillsToPractice: needs.length ? needs.slice(0, 3).map((s) => `${s} (more practice with text evidence)`) : practiceWords.length ? ['Reading tricky words aloud'] : ['Explaining thinking with evidence from the text'],
    engagementSummary: `${engagement?.minutes ? `Spent about ${Math.round(engagement.minutes)} minutes` : 'Took part'} on ${storyTitle ?? 'the story'} using the ${pathway ?? 'chosen'} pathway${engagement?.toolsUsed?.length ? ` and tried ${engagement.toolsUsed.join(', ')}` : ''}.`,
    recommendedNextActivity: practiceWords.length
      ? `Practice these words in a quick word game: ${practiceWords.slice(0, 3).join(', ')}.`
      : skills.includes('evidence')
        ? 'Read the next chapter and underline one sentence that proves each answer.'
        : 'Read the next chapter and answer one question by pointing to a sentence in the story.',
    teacherSummary: `A grade ${grade} student worked through ${storyTitle ?? 'a story'} with the ${pathway ?? 'chosen'} pathway. ${done.length ? `${right} of ${done.length} answers were on track. ` : ''}${practiceWords.length ? `A few words are worth another look (${practiceWords.slice(0, 3).join(', ')}). ` : ''}A good next step is to keep practicing explaining answers with evidence.`,
  }
}

const finalize = (d) => ({
  strengths: clipList(d.strengths, 4, 200),
  skillsToPractice: clipList(d.skillsToPractice, 3, 200),
  engagementSummary: clip(d.engagementSummary, 400),
  recommendedNextActivity: clip(d.recommendedNextActivity, 300),
  teacherSummary: clip(d.teacherSummary, 700),
})

export function teacherInsightAgent(input) {
  const user = `Grade: ${input.grade}
Learning pathway: ${input.pathway ?? 'not specified'}
Story: ${input.storyTitle ?? 'not specified'}

Session data (JSON):
${JSON.stringify({
    answers: input.answers,
    fluency: input.fluency ?? null,
    engagement: input.engagement ?? null,
    history: input.history,
  })}`

  return runAgent({
    name: 'teacher',
    system: SYSTEM,
    user,
    schema: TeacherResponse,
    mock: () => mock(input),
    finalize,
    screen: (d) => isSafeText(d.strengths, d.skillsToPractice, d.engagementSummary, d.recommendedNextActivity, d.teacherSummary),
  })
}
