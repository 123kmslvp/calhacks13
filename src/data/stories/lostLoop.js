// Story format (every story file follows this shape — see
// scripts/validate-stories.mjs, which checks all of it):
//
// - text: paragraphs separated by a blank line. No numerals and no hyphens,
//   so speech recognition can match every word.
// - art: one emoji "picture" per paragraph.
// - vocab: words that appear in the text, with kid-friendly definitions.
// - questions: three multiple choice + one open "explain with evidence".
//   `evidence` strings are copied exactly from one sentence of the text.

export default {
  id: 'lost-loop',
  world: 'mystery',
  title: 'Poppy and the Lost Loop',
  genre: 'Mystery',
  grade: 3,
  difficulty: 'Gentle',
  minutes: 6,
  cover: '🔔🏰🍿',
  summary: 'Someone mixed up the bells of the Kernel Kingdom. Can Poppy follow the clues and fix the song?',
  writingPrompt: 'Who do you think mixed up the bells? Write a new chapter where Poppy finds out!',
  chapters: [
    {
      id: 'lost-loop-1',
      title: 'The Missing Pattern',
      scene: '🔔🏰🍿',
      art: ['🌅🔔🎶', '👂❓🔔', '🗼⚙️🔍'],
      text: `In the Kernel Kingdom, every morning started with a song. The corn bells rang ding, dong, ding, dong, all across the town. That was their pattern, the same sounds repeating again and again.

But one morning, Poppy heard something strange, or different from usual. The bells rang ding, dong, dong, ding! Poppy stopped and listened again. The pattern was broken!

Poppy looked up at the tall bell tower. A tiny gear was rolling down the steps. "That is our first clue, a hint to help solve this mystery," Poppy said. "Someone mixed up the bells, and this gear fell out. I will fix the pattern before the sun goes down."`,
      vocab: [
        { word: 'pattern', definition: 'Something that repeats the same way again and again.', example: 'Red, blue, red, blue is a color pattern.' },
        { word: 'clue', definition: 'A piece of information that helps you solve a mystery.', example: 'Muddy footprints were a clue that the dog went outside.' },
        { word: 'strange', definition: 'Different from usual, in a surprising way.', example: 'It was strange to see snow in summer.' },
      ],
      drawIdeas: 'the bell tower, the tiny gear rolling down the steps, or Poppy listening to the bells',
      questions: [
        {
          id: 'lost-loop-1-q1',
          type: 'mainIdea',
          prompt: 'What is this chapter mostly about?',
          choices: [
            'Poppy learns to sing a new song',
            'Poppy notices the bell pattern is broken and finds a clue',
            'The town builds a new bell tower',
            'Poppy goes to bed early',
          ],
          answer: 1,
          evidence: 'The pattern was broken!',
          hint: 'Look at the second paragraph. What was different about the bells this morning?',
        },
        {
          id: 'lost-loop-1-q2',
          type: 'vocabulary',
          prompt: 'The story says, "That was their pattern, the same sounds repeating again and again." What does pattern mean?',
          choices: ['A loud noise', 'A kind of bell', 'A secret note', 'Something that repeats the same way'],
          answer: 3,
          evidence: 'That was their pattern, the same sounds repeating again and again.',
          hint: 'Look at the first paragraph. What does the sentence say the bells did again and again?',
        },
        {
          id: 'lost-loop-1-q3',
          type: 'inference',
          prompt: 'A tiny gear was rolling down the tower steps. What does Poppy say about the gear?',
          choices: [
            'Poppy dropped it',
            'It was a toy for the town',
            'It fell out when someone mixed up the bells',
            'The sun pushed it',
          ],
          answer: 2,
          evidence: 'Someone mixed up the bells, and this gear fell out.',
          hint: 'Look at what Poppy says in the last paragraph, right after the words "first clue."',
        },
        {
          id: 'lost-loop-1-q4',
          type: 'evidence',
          open: true,
          prompt: 'How did Poppy know something was wrong in the Kernel Kingdom? Use details from the story.',
          keywords: [
            ['bell', 'bells', 'ding', 'dong', 'rang', 'song'],
            ['wrong', 'different', 'broken', 'strange', 'pattern', 'mixed', 'order'],
          ],
          evidence: [
            'The bells rang ding, dong, dong, ding!',
            'The pattern was broken!',
            'But one morning, Poppy heard something strange.',
          ],
          sample: 'The bells rang in the wrong order. The story says, "The pattern was broken!"',
        },
      ],
    },
    {
      id: 'lost-loop-2',
      title: 'Steps in Order',
      scene: '📜🪜🔔',
      art: ['🧗📜🔔', '✂️📄🤪', '🧩✅🔔'],
      text: `Poppy climbed the bell tower to look for more clues. At the top, Poppy found a note from the Bell Keeper. It listed three steps, or small actions to do one at a time. It said, "First wind the gear. Next pull the rope. Last ring the bell."

But the steps on the note were in the wrong sequence, or wrong order! Someone had cut the paper and mixed up the pieces.

Poppy laid the pieces on the floor. "First, next, last," Poppy said slowly. Poppy moved each piece until the steps were in order. Then Poppy tried them one by one, and the first bell rang just right. The other bells still needed fixing.`,
      vocab: [
        { word: 'sequence', definition: 'The order that things happen in.', example: 'The sequence of my morning is wake up, brush teeth, eat breakfast.' },
        { word: 'order', definition: 'The way things are arranged, like first, next, and last.', example: 'We lined up in order from shortest to tallest.' },
        { word: 'steps', definition: 'The small actions you do, one at a time, to finish a job.', example: 'Follow the steps to build the model.' },
      ],
      drawIdeas: 'Poppy at the top of the tower, the cut-up note, or the first bell ringing',
      questions: [
        {
          id: 'lost-loop-2-q1',
          type: 'details',
          prompt: "What did the Bell Keeper's note say to do first?",
          choices: ['Ring the bell', 'Pull the rope', 'Climb the tower', 'Wind the gear'],
          answer: 3,
          evidence: 'First wind the gear.',
          hint: 'Find the word "First" in the note.',
        },
        {
          id: 'lost-loop-2-q2',
          type: 'vocabulary',
          prompt: 'The story says, "the wrong sequence, or wrong order." What does sequence mean?',
          choices: ['A kind of rope', 'The order things happen in', 'A loud sound', 'A paper note'],
          answer: 1,
          evidence: 'But the steps on the note were in the wrong sequence, or wrong order!',
          hint: 'Read the words right after "sequence" in the second paragraph.',
        },
        {
          id: 'lost-loop-2-q3',
          type: 'prediction',
          prompt: 'At the end of the chapter, the first bell rings right and the other bells still need fixing. What will Poppy most likely do next?',
          choices: [
            "Fix Poppy's bedroom",
            'Fix the road into town',
            'Fix the other bells so the whole song plays again',
            'Give up and go home',
          ],
          answer: 2,
          evidence: 'The other bells still needed fixing.',
          hint: 'Look at the last two sentences of the chapter. What still needs to be done?',
        },
        {
          id: 'lost-loop-2-q4',
          type: 'evidence',
          open: true,
          prompt: 'Why did Poppy need to put the steps in order? Explain using the story.',
          keywords: [
            ['order', 'first', 'next', 'last', 'sequence', 'steps'],
            ['bell', 'ring', 'rang', 'work', 'right', 'fix'],
          ],
          evidence: [
            'Then Poppy tried them one by one, and the first bell rang just right.',
            'But the steps on the note were in the wrong sequence, or wrong order!',
            'Poppy moved each piece until the steps were in order.',
          ],
          sample: 'The bell only works if you do the steps in order. After Poppy fixed the order, "the first bell rang just right."',
        },
      ],
    },
    {
      id: 'lost-loop-3',
      title: 'Fixing the Loop',
      scene: '🔁🐛🎉',
      art: ['🔁🎶🔔', '🔔💥🐛', '⚙️🙌🎉'],
      text: `Now Poppy needed every bell to ring the same song again and again. "This is a loop," Poppy said. "A loop will repeat the same steps."

Poppy rang ding, dong, and then started over. Ding, dong, ding, dong! But on the third time, a bell went clunk. There was a bug in the loop!

Poppy looked closely and found the tiny gear from the stairs stuck in the bell. Poppy pulled it out and tried again. Ding, dong, ding, dong, all the way through. The whole town cheered. Finding and fixing a bug like that is called debugging!`,
      vocab: [
        { word: 'loop', definition: 'Steps that repeat again and again.', example: 'Our jump rope song is a loop: we sing it over and over.' },
        { word: 'repeat', definition: 'To do or say something again.', example: 'Please repeat the question so I can hear it.' },
        { word: 'debugging', definition: 'Finding a mistake and fixing it so things work.', example: 'I was debugging my tower when I moved the wobbly block.' },
      ],
      drawIdeas: 'Poppy finding the bug, the gear stuck in the bell, or the whole town cheering',
      questions: [
        {
          id: 'lost-loop-3-q1',
          type: 'mainIdea',
          prompt: 'What is the big idea of this chapter?',
          choices: [
            'The town throws a birthday party',
            'Poppy loses the tiny gear',
            'Bells are too loud',
            'Poppy finds and fixes a bug so the bells work again',
          ],
          answer: 3,
          evidence: 'Finding and fixing a bug like that is called debugging!',
          hint: 'Look at the last paragraph. What was wrong with the bell, and what did Poppy do about it?',
        },
        {
          id: 'lost-loop-3-q2',
          type: 'factOpinion',
          prompt: 'Is this a fact or an opinion? "Ding, dong is the best song in the whole world."',
          choices: ['Fact', 'Opinion'],
          answer: 1,
          hint: 'Could everyone agree it is the BEST song, or is it what someone thinks?',
          explain: 'Words like "best" tell what someone thinks or feels. That makes it an opinion.',
        },
        {
          id: 'lost-loop-3-q3',
          type: 'inference',
          prompt: 'The story says the whole town cheered after the bells rang right. How did the town feel?',
          choices: ['Angry', 'Happy', 'Sleepy', 'Scared'],
          answer: 1,
          evidence: 'The whole town cheered.',
          hint: 'Think about when people cheer. Do they cheer when they are upset or when they are glad?',
        },
        {
          id: 'lost-loop-3-q4',
          type: 'evidence',
          open: true,
          prompt: 'What is a loop? Use the story to explain.',
          keywords: [
            ['repeat', 'again', 'over', 'same'],
            ['steps', 'song', 'ding', 'dong', 'bell', 'bells'],
          ],
          evidence: [
            '"A loop will repeat the same steps."',
            'Poppy rang ding, dong, and then started over.',
            'Now Poppy needed every bell to ring the same song again and again.',
          ],
          sample: 'A loop repeats the same steps again and again. Poppy says, "A loop will repeat the same steps."',
        },
      ],
    },
  ],
}
