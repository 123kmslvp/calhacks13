import { StoryResponse } from '../schemas.js'
import { clip, clipList, quote, runAgent } from '../claude.js'

// Story Adaptation Agent: plans the supports around a story (vocabulary help,
// pictures, audio, an activity). It does not rewrite the passage or anything
// the student writes.

const SYSTEM = `ROLE: Story Adaptation Agent.
You receive a story, a grade (3-5), a difficulty (Gentle, Medium or Challenge) and the learning pathway the student chose (for example read-aloud, listening, drawing, or typing).
Return a support plan that helps this student read the story on their own:
- vocabularySupport: 3-5 words from the story that may be new, each with a kid-friendly meaning and a short example sentence that is NOT from the story.
- visualSuggestions: 2-3 picture or drawing ideas that match the pathway.
- audioSuggestions: 2-3 read-aloud or listening supports that match the pathway.
- activityPlan: a short title, 3-4 small steps, and estimatedMinutes (a number from 3 to 15).
Match the pathway: lean on audio for listening or read-aloud, on drawing and picture prompts for visual, on talking or typing prompts for response.
Do NOT rewrite, simplify or summarize the passage for the student, and do NOT write answers or any part of the student's work. Support the reading; leave the thinking to the student.`

const GENERIC_WORDS = ['adventure', 'curious', 'discover']

function mock({ story, pathway }) {
  const words = [
    ...new Set((story.text?.toLowerCase().match(/[a-z]{7,}/g) ?? []).filter((w) => !/ing$|ly$/.test(w))),
  ].slice(0, 3)
  const picks = words.length ? words : GENERIC_WORDS
  return {
    vocabularySupport: picks.map((word) => ({
      word,
      studentFriendlyMeaning: `Look for "${word}" in the story. Read the sentence around it. What do you think it means?`,
      example: `Can you use "${word}" in a sentence of your own?`,
    })),
    visualSuggestions: [
      `Picture the setting of "${story.title}" in your mind before you read.`,
      'Draw your favorite part after each paragraph.',
    ],
    audioSuggestions: [
      /listen|audio|speak|aloud/i.test(pathway) ? 'Press the speaker button to hear each paragraph, then read it back.' : 'Press the speaker button any time you want to hear a sentence.',
      'Read one sentence out loud, then listen to it again.',
    ],
    activityPlan: {
      title: `Explore "${story.title}"`,
      steps: ['Look at the title and guess what happens.', 'Read one paragraph at a time.', 'Stop to check any tricky word.', 'Tell a friend your favorite part.'],
      estimatedMinutes: 8,
    },
  }
}

const finalize = (d) => ({
  vocabularySupport: d.vocabularySupport.slice(0, 6).map((v) => ({
    word: clip(v.word, 40),
    studentFriendlyMeaning: clip(v.studentFriendlyMeaning, 300),
    example: clip(v.example, 300),
  })),
  visualSuggestions: clipList(d.visualSuggestions, 4),
  audioSuggestions: clipList(d.audioSuggestions, 4),
  activityPlan: {
    title: clip(d.activityPlan.title, 120),
    steps: clipList(d.activityPlan.steps, 6),
    estimatedMinutes: Math.min(15, Math.max(3, Math.round(d.activityPlan.estimatedMinutes) || 8)),
  },
})

export function storyAgent(input) {
  const { story, grade, difficulty, pathway } = input
  const user = `Story title: ${story.title}
Genre: ${story.genre ?? 'unknown'}
Summary: ${story.summary ?? 'none'}
Grade: ${grade}
Difficulty: ${difficulty ?? 'Medium'}
Learning pathway: ${pathway}
Story text:
${quote(story.text ?? '(not provided; use the title and summary)')}`

  return runAgent({
    name: 'story',
    system: SYSTEM,
    user,
    schema: StoryResponse,
    mock: () => mock(input),
    finalize,
  })
}
