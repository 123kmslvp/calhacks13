import { z } from 'zod'

// Request schemas validate everything the browser sends. Unknown fields are
// stripped, so things like a student's name never reach a prompt.
// Response schemas describe what Claude must return; the same shapes are what
// the mock mode produces, so the frontend can rely on them either way.

const text = (max) => z.string().trim().min(1).max(max)
const optionalText = (max) => z.string().trim().max(max).optional()

const grade = z.coerce.number().int().min(1).max(8)
const difficulty = optionalText(30)
const pathway = text(60)

const storyInfo = z
  .union([
    text(120).transform((title) => ({ title })),
    z.object({
      id: optionalText(80),
      title: text(120),
      summary: optionalText(600),
      genre: optionalText(60),
      text: optionalText(8000),
    }),
  ])

// ---------- Requests ----------

export const StoryRequest = z.object({
  story: storyInfo,
  grade,
  difficulty,
  pathway,
})

export const SocraticRequest = z.object({
  passage: text(8000),
  question: text(600),
  studentAnswer: text(1500),
  grade,
  pathway: optionalText(60),
  // Optional teacher-side hints. They help Claude judge the answer but must
  // never be revealed to the student.
  expectedAnswer: optionalText(600),
  evidence: optionalText(600),
  // Words worth weaving into the follow-up (the orchestrator fills this from
  // the Story and Fluency agents).
  focusWords: z.array(text(40)).max(10).optional(),
})

export const FluencyRequest = z.object({
  passage: text(8000),
  transcript: text(8000),
  grade,
  readingSeconds: z.coerce.number().min(0).max(3600).optional(),
})

const answerRecord = z.object({
  question: optionalText(600),
  studentAnswer: optionalText(1500),
  isCorrect: z.boolean().optional(),
  skillPracticed: optionalText(80),
})

export const TeacherRequest = z.object({
  grade,
  pathway: optionalText(60),
  storyTitle: optionalText(120),
  answers: z.array(answerRecord).max(30).default([]),
  fluency: z
    .object({
      wcpm: z.coerce.number().min(0).max(400).optional(),
      accuracy: z.coerce.number().min(0).max(100).optional(),
      wordsToPractice: z.array(text(40)).max(20).optional(),
      readingSeconds: z.coerce.number().min(0).max(3600).optional(),
    })
    .optional(),
  history: z
    .array(
      z.object({
        date: optionalText(40),
        activity: optionalText(80),
        score: z.coerce.number().min(0).max(100).optional(),
        minutes: z.coerce.number().min(0).max(600).optional(),
      })
    )
    .max(40)
    .default([]),
  engagement: z
    .object({
      minutes: z.coerce.number().min(0).max(600).optional(),
      toolsUsed: z.array(text(40)).max(10).optional(),
      pointsEarned: z.coerce.number().min(0).max(10000).optional(),
    })
    .optional(),
})

export const SessionRequest = z.object({
  story: storyInfo,
  grade,
  difficulty,
  pathway,
  passage: optionalText(8000),
  question: optionalText(600),
  studentAnswer: optionalText(1500),
  expectedAnswer: optionalText(600),
  evidence: optionalText(600),
  transcript: optionalText(8000),
  readingSeconds: z.coerce.number().min(0).max(3600).optional(),
  // Past answers, fluency numbers and history for the teacher summary.
  session: TeacherRequest.omit({ grade: true, pathway: true, storyTitle: true }).partial().optional(),
  // Set true at the end of a chapter to also run the Teacher Insight Agent.
  finish: z.boolean().optional(),
})

// ---------- Claude responses ----------

export const StoryResponse = z.object({
  vocabularySupport: z.array(
    z.object({ word: z.string(), studentFriendlyMeaning: z.string(), example: z.string() })
  ),
  visualSuggestions: z.array(z.string()),
  audioSuggestions: z.array(z.string()),
  activityPlan: z.object({
    title: z.string(),
    steps: z.array(z.string()),
    estimatedMinutes: z.number(),
  }),
})

export const SocraticResponse = z.object({
  isCorrect: z.boolean(),
  encouragement: z.string(),
  feedback: z.string(),
  followUpQuestion: z.string(),
  skillPracticed: z.string(),
  points: z.number(),
})

export const FluencyResponse = z.object({
  encouragement: z.string(),
  wordsToPractice: z.array(z.string()),
  strengths: z.array(z.string()),
  practiceTip: z.string(),
})

export const TeacherResponse = z.object({
  strengths: z.array(z.string()),
  skillsToPractice: z.array(z.string()),
  engagementSummary: z.string(),
  recommendedNextActivity: z.string(),
  teacherSummary: z.string(),
})

// Turns a zod error into a short list that is safe to send back to the browser.
export const issuesOf = (error) =>
  error.issues.slice(0, 10).map((i) => ({ path: i.path.join('.'), message: i.message }))
