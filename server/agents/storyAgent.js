import { PATHWAY_KINDS, PROMPT_TYPES, StoryResponse } from '../schemas.js'
import { clip, clipList, quote, runAgent } from '../claude.js'

// Story Adaptation Agent: plans the supports around a story (vocabulary help,
// pictures, audio, an activity). It does not rewrite the passage or anything
// the student writes.

const KINDS = PATHWAY_KINDS.join(', ')
const TYPES = PROMPT_TYPES.join(', ')

const SYSTEM = `ROLE: Story Adaptation Agent.
You receive a story, a grade (3-5), a difficulty (Gentle, Medium or Challenge) and the learning pathway the student chose (for example read-aloud, listening, drawing, or typing).
Return a support plan that helps this student read the story on their own:
- vocabularySupport: 3-5 words from the story that may be new, each with a kid-friendly meaning and a short example sentence that is NOT from the story.
- visualSuggestions: 2-3 picture or drawing ideas that match the pathway.
- audioSuggestions: 2-3 read-aloud or listening supports that match the pathway.
- activityPlan: a short title, 3-4 small steps, and estimatedMinutes (a number from 3 to 15).
Match the pathway: lean on audio for listening or read-aloud, on drawing and picture prompts for visual, on talking or typing prompts for response.
PATHWAYS. The learning pathway changes the ACTIVITY itself, not just the supports. Use the pathway name to fill pathwayActivity (kind, title, a one-sentence intro, and the prompts):
- "Visual Explorer" -> kind "visual", 3 prompts: a "visual-clue" (find a clue in the text and describe the picture it paints), a "diagram" (sketch or describe a simple map or a 3-box sequence of events), and one more "visual-clue" question about the setting or a character.
- "Listen and Speak" -> kind "listen-speak", 3 prompts: a "read-aloud" (choose one sentence from the story, quote it exactly, and ask the student to read it aloud with expression), then two "spoken-response" questions to answer out loud in full sentences.
- "Read and Write" -> kind "read-write", 3 prompts: a "vocabulary" prompt (use one new story word in their own sentence), a "writing" prompt tied to the story, and one more "writing" or "vocabulary" prompt.
- "Interactive Explorer" -> kind "interactive", 4 prompts: a "prediction" (what happens next and why), a "choose-path" (a choose-your-path dilemma for a character with two options; ask which and why), an "ask-question" (write one question they still wonder about the story), and a "check-claim" (write a short claim, as if an AI summary said it, that is subtly WRONG about the story, and ask the student to find the sentence that shows it is wrong; put the true facts in answerKey).
For every prompt except "check-claim", answerKey must be an empty string. Each prompt text is written to the student in 1-2 short sentences, fits the grade, points at something specific in THIS story, and can be answered from the story. If the pathway name matches none of these, use kind "read-write".
Valid kinds: ${KINDS}. Valid prompt types: ${TYPES}.

Do NOT rewrite, simplify or summarize the passage for the student, and do NOT write answers or any part of the student's work. Support the reading; leave the thinking to the student.`

const GENERIC_WORDS = ['adventure', 'curious', 'discover']

// Which activity to build for a pathway name (the model does the same from its prompt).
const kindOf = (pathway = '') =>
  /visual/i.test(pathway) ? 'visual' : /interactive/i.test(pathway) ? 'interactive' : /listen|speak/i.test(pathway) ? 'listen-speak' : 'read-write'

// Demo-mode activities. They are simple and built from the passage, but each
// pathway still gets a different kind of activity.
function mockActivity({ story, pathway }, word) {
  const sentences = (story.text ?? '').split(/(?<=[.!?])\s+/).map((x) => x.trim()).filter((x) => x.split(' ').length >= 5)
  const line = sentences[0] ?? `the beginning of "${story.title}"`
  const p = (type, text) => ({ type, text, answerKey: '' })
  const kind = kindOf(pathway)
  if (kind === 'visual')
    return {
      kind,
      title: 'Picture it',
      intro: 'Use your imagination to see the story like a movie.',
      prompts: [
        p('visual-clue', `Picture this: "${line}" What do you see? Describe two things in your picture.`),
        p('diagram', 'Make a map in your head with three boxes: beginning, middle, and end. What happens in each box?'),
        p('visual-clue', 'Which words in the story help you see where it happens? Name one and tell what it makes you picture.'),
      ],
    }
  if (kind === 'listen-speak')
    return {
      kind,
      title: 'Say it out loud',
      intro: 'Listen closely, then use your voice to share your thinking.',
      prompts: [
        p('read-aloud', `Read this sentence out loud like a storyteller: "${line}"`),
        p('spoken-response', 'Say in your own words: what is happening in this part of the story?'),
        p('spoken-response', 'Say one thing you heard that surprised you, and tell why.'),
      ],
    }
  if (kind === 'interactive')
    return {
      kind,
      title: 'Predict, choose, and wonder',
      intro: 'You are an explorer. Make guesses and ask big questions!',
      prompts: [
        p('prediction', `What do you think happens next in "${story.title}"? Tell why you think so.`),
        p('choose-path', 'If you were in this story, would you stay where you are or try something new? Pick one and tell why.'),
        p('ask-question', 'Write one question you still wonder about this story.'),
      ],
    }
  return {
    kind: 'read-write',
    title: 'Words and ideas',
    intro: 'Use new words and write down your thinking.',
    prompts: [
      p('vocabulary', `Use the word "${word}" in a sentence of your own.`),
      p('writing', `Write two sentences about your favorite part of "${story.title}".`),
      p('writing', 'Write one sentence that tells what you think will happen next.'),
    ],
  }
}

function mock({ story, pathway }) {
  const text = story.text ?? ''
  const words = [
    ...new Set(
      (text.toLowerCase().match(/[a-z]{7,}/g) ?? []).filter(
        // skip -ing/-ly words, and names that only ever appear capitalized
        (w) => !/ing$|ly$/.test(w) && text.includes(w)
      )
    ),
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
    pathwayActivity: mockActivity({ story, pathway }, picks[0]),
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
  pathwayActivity: {
    kind: d.pathwayActivity.kind,
    title: clip(d.pathwayActivity.title, 120),
    intro: clip(d.pathwayActivity.intro, 300),
    prompts: d.pathwayActivity.prompts
      .map((p) => ({ type: p.type, text: clip(p.text, 500), answerKey: clip(p.answerKey, 500) }))
      .filter((p) => p.text)
      .slice(0, 4),
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
