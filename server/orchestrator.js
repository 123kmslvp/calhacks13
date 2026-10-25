import { storyAgent } from './agents/storyAgent.js'
import { socraticAgent } from './agents/socraticAgent.js'
import { fluencyAgent } from './agents/fluencyAgent.js'
import { teacherInsightAgent } from './agents/teacherInsightAgent.js'
import { MOCK_MODE, MODEL } from './claude.js'

// Kernel Quest Orchestrator. Runs the agents in the order a student meets them
// and hands each result to the next:
//
//   Story Adaptation -> Fluency -> Comprehension/Socratic -> Teacher Insight
//
// Each stage runs only when its input is present, so the same endpoint serves
// the start of a chapter, a read-aloud, a single answer, or a full wrap-up.

async function step(log, agent, fn) {
  const started = Date.now()
  const { data, source } = await fn()
  log.push({ agent, source, ms: Date.now() - started })
  return data
}

export async function runSession(input) {
  const agentsRun = []
  const result = {}
  const passage = input.passage ?? input.story.text
  const common = { grade: input.grade, pathway: input.pathway }

  // 1. Story Adaptation: the support plan for this story and pathway.
  result.story = await step(agentsRun, 'story', () =>
    storyAgent({ story: { ...input.story, text: input.story.text ?? input.passage }, grade: input.grade, difficulty: input.difficulty, pathway: input.pathway })
  )

  // 2. Fluency: only when the student read aloud.
  if (passage && input.transcript) {
    result.fluency = await step(agentsRun, 'fluency', () =>
      fluencyAgent({ passage, transcript: input.transcript, grade: input.grade, readingSeconds: input.readingSeconds })
    )
  }

  // 3. Socratic: only when there is a question and an answer. It sees the
  //    words the first two agents flagged so the follow-up can target them.
  if (passage && input.question && input.studentAnswer) {
    const focusWords = [
      ...(result.fluency?.wordsToPractice ?? []),
      ...result.story.vocabularySupport.map((v) => v.word),
    ].slice(0, 6)
    result.socratic = await step(agentsRun, 'socratic', () =>
      socraticAgent({
        ...common,
        passage,
        question: input.question,
        studentAnswer: input.studentAnswer,
        expectedAnswer: input.expectedAnswer,
        evidence: input.evidence,
        focusWords,
      })
    )
  }

  // 4. Teacher Insight: at the end of a chapter (finish) or when session data
  //    is supplied. It folds in everything produced above.
  if (input.finish || input.session) {
    const past = input.session ?? {}
    const answers = [...(past.answers ?? [])]
    if (result.socratic && input.question) {
      answers.push({
        question: input.question,
        studentAnswer: input.studentAnswer,
        isCorrect: result.socratic.isCorrect,
        skillPracticed: result.socratic.skillPracticed,
      })
    }
    const fluency = {
      ...past.fluency,
      readingSeconds: input.readingSeconds ?? past.fluency?.readingSeconds,
      wordsToPractice: result.fluency?.wordsToPractice ?? past.fluency?.wordsToPractice,
    }
    result.teacher = await step(agentsRun, 'teacher', () =>
      teacherInsightAgent({
        ...common,
        storyTitle: input.story.title,
        answers: answers.slice(-30),
        fluency,
        history: past.history ?? [],
        engagement: past.engagement,
      })
    )
  }

  return {
    mode: MOCK_MODE ? 'mock' : 'claude',
    model: MOCK_MODE ? null : MODEL,
    agentsRun,
    ...result,
  }
}
