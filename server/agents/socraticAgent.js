import { SocraticResponse } from '../schemas.js'
import { clip, isSafeText, quote, runAgent } from '../claude.js'

// Comprehension/Socratic Agent: judges a student's answer, then asks a
// personalized follow-up that pushes them to explain and cite the text. It
// guides; it does not hand over the answer.

const SYSTEM = `ROLE: Comprehension/Socratic Agent.
You receive a passage, a comprehension question, the student's answer, their grade (3-5), and their learning pathway.
Optionally you receive a teacher's expected answer and text evidence. Use them only to judge the answer. NEVER quote, reveal or paraphrase them to the student.
Return:
- isCorrect: true if the answer shows the key idea, even if the wording is different or incomplete-but-on-track; false otherwise.
- encouragement: one short, specific, warm sentence praising something real in their effort or thinking.
- feedback: 1-2 sentences about their thinking. If they are on track, name what they did well. If not, point them toward the part of the story to look at again. Do NOT state the correct answer.
- followUpQuestion: ONE personalized question that builds on what they actually wrote and asks them to explain their reasoning or find evidence in the story (for example "Which sentence helped you decide that?" or "What would change if...?"). Never answer it for them. If focus words are given and one fits naturally, you may use it to ask about its meaning in the story.
- skillPracticed: one of main idea, details, vocabulary, inference, evidence, sequence, character, or theme.
- points: a whole number 1-10. Give 1-3 for a try that is off track, 4-7 for a reasonable answer, 8-10 for a strong answer with reasoning or evidence.
Match your wording to the learning pathway: "Visual Explorer" -> mention what they picture or see in the story; "Listen and Speak" -> short, easy-to-hear sentences; "Read and Write" -> encourage adding written detail or a new word; "Interactive Explorer" -> invite predictions and big questions.
Some "questions" are activity prompts, not quiz questions. If the prompt asks the student to read a sentence aloud, comment on their effort and expression and ask what that sentence tells us. If it asks them to write their own question, praise a question that digs into the story, then ask which part made them wonder. If the expected answer says the prompt contains a claim that is WRONG, judge whether the student found what is actually wrong, and guide them to the sentence that proves it without stating the fix.
Be age-appropriate. Never say the student is wrong in a harsh way; say "not quite yet" or "let's look again".`

const STOP = new Set('the a an and or but of to in on at is was were it that this he she they his her with for as by from be are had has'.split(' '))
const words = (s) => (s.toLowerCase().match(/[a-z']+/g) ?? []).filter((w) => w.length > 2 && !STOP.has(w))

// Simple, honest heuristic for demo mode: does the answer share key words
// with the expected answer (or, failing that, with the passage)?
function mock({ passage, question, studentAnswer, expectedAnswer, evidence }) {
  const answer = new Set(words(studentAnswer))
  const target = words(`${expectedAnswer ?? ''} ${evidence ?? ''}`)
  const pool = target.length ? target : words(passage)
  const hits = pool.filter((w) => answer.has(w)).length
  const isCorrect = target.length ? hits >= Math.min(2, target.length) : answer.size >= 4 && hits >= 2
  const wrote = answer.size >= 6
  return {
    isCorrect,
    encouragement: wrote ? 'I love how much thought you put into your answer!' : 'Thanks for giving that a try!',
    feedback: isCorrect
      ? 'You found an important idea from the story. Nice reading!'
      : 'Not quite yet. Look back at the story and see which part connects to the question.',
    followUpQuestion: isCorrect
      ? 'Which sentence in the story helped you decide that?'
      : `Read the story once more. What part helps you answer: "${clip(question, 160)}"?`,
    skillPracticed: /mean|word/i.test(question) ? 'vocabulary' : /why|how come|feel/i.test(question) ? 'inference' : 'details',
    points: isCorrect ? (wrote ? 8 : 6) : wrote ? 3 : 2,
  }
}

const finalize = (d) => ({
  isCorrect: d.isCorrect,
  encouragement: clip(d.encouragement, 300),
  feedback: clip(d.feedback, 500),
  followUpQuestion: clip(d.followUpQuestion, 400),
  skillPracticed: clip(d.skillPracticed, 40) || 'details',
  // The model suggests; the server decides the range.
  points: Math.min(10, Math.max(0, Math.round(d.points) || 0)),
})

export function socraticAgent(input) {
  const { passage, question, studentAnswer, grade, pathway, expectedAnswer, evidence, focusWords } = input
  const user = `Grade: ${grade}
Learning pathway: ${pathway ?? 'not specified'}
Focus words: ${focusWords?.length ? focusWords.join(', ') : 'none'}
Passage:
${quote(passage)}

Question: ${question}
Teacher's expected answer (do NOT reveal): ${expectedAnswer ?? 'not provided'}
Text evidence (do NOT reveal): ${evidence ?? 'not provided'}

Student's answer:
${quote(studentAnswer)}`

  return runAgent({
    name: 'socratic',
    system: SYSTEM,
    user,
    schema: SocraticResponse,
    mock: () => mock(input),
    finalize,
    screen: (d) =>
      isSafeText(d.encouragement, d.feedback, d.followUpQuestion) &&
      // Don't let the model leak the hidden expected answer verbatim.
      !(expectedAnswer && expectedAnswer.length > 8 && `${d.feedback} ${d.followUpQuestion}`.toLowerCase().includes(expectedAnswer.toLowerCase())),
  })
}
