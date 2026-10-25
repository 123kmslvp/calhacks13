export default {
  id: 'hopper-bug',
  world: 'history',
  title: 'Grace Hopper and the Bug in the Machine',
  genre: 'Biography',
  grade: 5,
  difficulty: 'Challenge',
  minutes: 6,
  cover: '👩‍💻🪲⚓',
  summary: 'Grace Hopper took apart gadgets as a child and grew up to be a mathematician, a Navy officer, and a pioneer of computer programming. Learn how a moth in a machine and a new way of writing code made her famous.',
  writingPrompt: 'Grace Hopper was curious about how things work. Choose something you use every day and write about how you would take it apart and figure out what is inside.',
  chapters: [
    {
      id: 'hopper-bug-1',
      title: 'A Curious Mind',
      scene: '⏰🎓⚓',
      art: ['👧⏰🔧', '🎓📐🏛️', '⚓🖥️👩'],
      text: `Grace Hopper was born in nineteen oh six. She was curious about everything, which means she always wanted to learn more. As a young girl, she wondered how an alarm clock worked inside. So she took it apart to find out. Grace loved to see how the pieces fit together.

Grace grew up to be a gifted mathematician. She had a special talent for math. She earned a doctorate in mathematics from Yale. This was a great achievement, something important she reached through hard work. Then she became a teacher who helped students solve hard problems.

When the United States entered World War Two, Grace joined the Navy. The Navy sent her to work with some of the very first computers. These giant machines filled whole rooms and clicked and whirred all day. Grace worked on the Harvard Mark One and later the Mark Two. She learned how to give these huge calculators their instructions.`,
      vocab: [
        { word: 'curious', definition: 'Eager to learn or know more about something.', example: 'The curious puppy sniffed every corner of the yard.' },
        { word: 'gifted', definition: 'Having a special talent or ability.', example: 'My gifted cousin can play three instruments.' },
        { word: 'achievement', definition: 'Something important you succeed in doing, often through hard work.', example: 'Finishing the marathon was a great achievement.' },
      ],
      drawIdeas: 'Young Grace with the pieces of an alarm clock, Grace in her Navy uniform, or a giant computer filling a whole room',
      questions: [
        {
          id: 'hopper-bug-1-q1',
          type: 'mainIdea',
          prompt: 'What is this chapter mostly about?',
          choices: [
            'How Grace Hopper built the first alarm clock',
            'Why the Navy needed more teachers',
            'How a curious girl grew up to work with early computers',
            'How Yale started a new mathematics class',
          ],
          answer: 2,
          evidence: 'The Navy sent her to work with some of the very first computers.',
          hint: 'Think about the whole chapter. It starts with Grace as a girl and ends with her work in the Navy.',
        },
        {
          id: 'hopper-bug-1-q2',
          type: 'vocabulary',
          prompt: 'The text says Grace was a "gifted" mathematician. The next sentence says she "had a special talent for math." What does gifted mean?',
          choices: ['Having a special talent', 'Given a present', 'Very tall', 'Easily confused'],
          answer: 0,
          evidence: 'Grace grew up to be a gifted mathematician.',
          hint: 'Read the sentence right after the word gifted.',
        },
        {
          id: 'hopper-bug-1-q3',
          type: 'inference',
          prompt: 'The story says Grace "wondered how an alarm clock worked inside." Why did she take the clock apart?',
          choices: [
            'She was angry that it was broken',
            'Her teacher asked her to',
            'She wanted to sell the parts',
            'She wanted to understand how it worked',
          ],
          answer: 3,
          evidence: 'As a young girl, she wondered how an alarm clock worked inside.',
          hint: 'Look at the first paragraph. What did she wonder, and what does the word "So" tell you?',
        },
        {
          id: 'hopper-bug-1-q4',
          type: 'evidence',
          open: true,
          prompt: 'What is one detail that shows Grace was curious, and one detail that shows she was good at mathematics? Use evidence from the text.',
          keywords: [
            ['alarm clock', 'took it apart', 'wondered', 'pieces', 'curious'],
            ['doctorate', 'Yale', 'mathematician', 'mathematics', 'computers'],
          ],
          evidence: [
            'So she took it apart to find out.',
            'She earned a doctorate in mathematics from Yale.',
          ],
          sample: 'Grace was curious because she took apart an alarm clock to find out how it worked. She was also good at math, since "She earned a doctorate in mathematics from Yale."',
        },
      ],
    },
    {
      id: 'hopper-bug-2',
      title: 'Bugs and Better Code',
      scene: '🪲💻⭐',
      art: ['🪲🔌📓', '🗣️💻📝', '⭐⚓🏅'],
      text: `In nineteen forty seven, Grace's team was working on the Mark Two when it suddenly stopped. The workers searched the machine. They found a moth stuck in one of its relays. Relays are switches that turn electric signals on and off. Someone taped the moth into the logbook. That person wrote that it was the first actual case of a bug being found.

Grace also solved a bigger problem. Early computers only understood long strings of number codes. Writing these codes was slow and tiring. So in the early nineteen fifties, she created one of the first compilers. A compiler is a program that turns words people can read into number codes a computer can use. Because of compilers, programmers could write with English like words.

Her work helped make modern programming languages possible. Later in her career, Grace became a rear admiral in the Navy. Her example made others want to do their best. Many people believe she was the most inspiring computer scientist of her time.`,
      vocab: [
        { word: 'relays', definition: 'Switches in a machine that turn electric signals on and off.', example: 'Old telephone systems used thousands of relays to connect calls.' },
        { word: 'compilers', definition: 'Programs that change words people write into codes a computer can use.', example: 'Compilers let programmers write in words instead of long codes.' },
        { word: 'inspiring', definition: 'Making others want to do their best.', example: 'The coach gave an inspiring speech before the game.' },
      ],
      drawIdeas: 'The moth taped in the logbook, Grace writing words that a computer can read, or Grace in her rear admiral uniform',
      questions: [
        {
          id: 'hopper-bug-2-q1',
          type: 'details',
          prompt: 'What did the team find inside the Mark Two?',
          choices: [
            'A broken alarm clock',
            'A tiny spider',
            'A moth stuck in a relay',
            'A loose wire',
          ],
          answer: 2,
          evidence: 'They found a moth stuck in one of its relays.',
          hint: 'Look at the first paragraph. What did the workers find after they searched the machine?',
        },
        {
          id: 'hopper-bug-2-q2',
          type: 'inference',
          prompt: 'The story says writing number codes was slow and tiring. Why were compilers such an important idea?',
          choices: [
            'They made computers smaller and cheaper',
            'They let people write programs using words instead of only number codes',
            'They stopped moths from entering machines',
            'They turned computers into calculators',
          ],
          answer: 1,
          evidence: 'Because of compilers, programmers could write with English like words.',
          hint: 'Look at the second paragraph. What could programmers do because of compilers?',
        },
        {
          id: 'hopper-bug-2-q3',
          type: 'factOpinion',
          prompt: 'Is this a fact or an opinion? "Many people believe she was the most inspiring computer scientist of her time."',
          choices: ['Fact', 'Opinion'],
          answer: 1,
          hint: 'Can anyone prove who is the "most inspiring," or is it what people believe?',
          explain: 'The phrase "most inspiring" tells what people think and feel. It cannot be measured or proven, so it is an opinion.',
        },
        {
          id: 'hopper-bug-2-q4',
          type: 'evidence',
          open: true,
          prompt: 'What problem did early computers have, and how did Grace Hopper fix it? Use evidence from the text.',
          keywords: [
            ['compiler', 'compilers', 'words', 'English'],
            ['number codes', 'codes', 'slow', 'easier', 'programmers', 'programming'],
          ],
          evidence: [
            'Writing these codes was slow and tiring.',
            'So in the early nineteen fifties, she created one of the first compilers.',
            'Because of compilers, programmers could write with English like words.',
          ],
          sample: 'Writing number codes was slow and tiring. Grace fixed this because, as the text says, "she created one of the first compilers," so programmers could write with English like words.',
        },
      ],
    },
  ],
}
