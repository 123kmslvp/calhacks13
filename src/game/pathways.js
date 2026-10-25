// The four ways a student can explore a story. A pathway changes the learning
// activity itself (Claude builds different prompts for each), not just how the
// story looks. `tools` are the same reading and answering tools the rest of the
// app already understands, so each pathway starts in the right mode.
//
// The names are sent to the Claude story agent, which chooses the activity from
// them, so keep them in step with server/agents/storyAgent.js.
export const PATHWAYS = [
  {
    id: 'visual',
    name: 'Visual Explorer',
    icon: '🖼️',
    about: 'Hunt for clues in pictures and scenes',
    tools: ['visuals', 'read'],
  },
  {
    id: 'listenSpeak',
    name: 'Listen and Speak',
    icon: '🎧',
    about: 'Hear the story, then say what you think',
    tools: ['listen', 'speak'],
  },
  {
    id: 'readWrite',
    name: 'Read and Write',
    icon: '✍️',
    about: 'Read, learn new words, and write your ideas',
    tools: ['read', 'type'],
  },
  {
    id: 'interactive',
    name: 'Interactive Explorer',
    icon: '🧭',
    about: 'Predict, choose, and ask your own questions',
    tools: ['read', 'type'],
  },
]

export const pathwayById = (id) => PATHWAYS.find((p) => p.id === id) ?? null

// Kid-friendly names for the kinds of prompts Claude can write.
export const PROMPT_LABELS = {
  'visual-clue': 'Look for clues',
  diagram: 'Map it out',
  'read-aloud': 'Read aloud',
  'spoken-response': 'Say it',
  vocabulary: 'New word',
  writing: 'Write it',
  prediction: 'Predict',
  'choose-path': 'Choose your path',
  'ask-question': 'Ask a question',
  'check-claim': 'Fact-check it',
}
