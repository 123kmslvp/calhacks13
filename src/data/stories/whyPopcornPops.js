export default {
  id: 'why-popcorn-pops',
  world: 'science',
  title: 'Poppy Asks: Why Does Popcorn Pop?',
  genre: 'Science',
  grade: 4,
  difficulty: 'Medium',
  minutes: 5,
  cover: '🍿🔬💥',
  summary: 'Poppy has always wondered what makes popcorn go POP, and a visit to the Science Lab reveals a tiny secret hidden inside every kernel.',
  writingPrompt: 'Pretend you are a popcorn kernel in a hot pot. Write a story about what you feel and hear, step by step, until you POP!',
  chapters: [
    {
      id: 'why-popcorn-pops-1',
      title: 'A Secret Inside',
      scene: '🔬🌽🍿',
      art: ['🍿❓🔬', '🌽🔍💧', '🛡️💧😄'],
      text: `Poppy bounced into the Science Lab with a big question. "Professor Ada, why does popcorn pop?" Professor Ada smiled and set a single kernel under her microscope. "Let's find out the way scientists do," she said. "First, we look closely."

Through the microscope, Poppy could see the important parts of the kernel. On the outside was a hard, shiny shell called the hull. Inside the hull was soft, white starch, which is food for a new corn plant. And hidden inside the starch was a tiny bit of water.

"That little bit of water is the secret," Professor Ada explained. "The hull is so tough that the water cannot easily escape. Not every kind of corn can pop. Popcorn is special because its hull is extra strong." Poppy tapped her own shell proudly. "So I have a secret inside me too!"`,
      vocab: [
        { word: 'microscope', definition: 'A tool that makes tiny things look much bigger so you can study them.', example: 'Under the microscope, the leaf looked like it had tiny windows.' },
        { word: 'hull', definition: 'The hard outer shell of a seed or kernel.', example: 'The hull of a popcorn kernel is shiny and tough.' },
        { word: 'starch', definition: 'A kind of food stored in plants like corn, rice, and potatoes.', example: 'Potatoes and bread are full of starch.' },
      ],
      drawIdeas: 'Poppy looking into the microscope, a big drawing of a kernel with the hull, starch, and water labeled, or Professor Ada in the lab',
      questions: [
        {
          id: 'why-popcorn-pops-1-q1',
          type: 'mainIdea',
          prompt: 'What is this chapter mostly about?',
          choices: [
            'Poppy learns what is inside a popcorn kernel',
            'Professor Ada buys a new microscope',
            'Poppy plants corn in a garden',
            'Popcorn tastes best with butter',
          ],
          answer: 0,
          evidence: 'Through the microscope, Poppy could see the important parts of the kernel.',
          hint: 'What did Poppy see when looking through the microscope?',
        },
        {
          id: 'why-popcorn-pops-1-q2',
          type: 'details',
          prompt: 'What is on the outside of a popcorn kernel?',
          choices: ['Soft white starch', 'A tiny bit of water', 'A hard, shiny hull', 'A layer of butter'],
          answer: 2,
          evidence: 'On the outside was a hard, shiny shell called the hull.',
          hint: 'Find the sentence that starts with "On the outside."',
        },
        {
          id: 'why-popcorn-pops-1-q3',
          type: 'vocabulary',
          prompt: 'What is the "hull" of a kernel?',
          choices: ['The water inside', 'The hard outer shell', 'The white fluffy part', 'The corn plant'],
          answer: 1,
          evidence: 'On the outside was a hard, shiny shell called the hull.',
          hint: 'Look for the words that come right before "called the hull."',
        },
        {
          id: 'why-popcorn-pops-1-q4',
          type: 'evidence',
          open: true,
          prompt: 'Why can popcorn pop when other kinds of corn cannot? Use details from the story.',
          keywords: [
            ['hull', 'shell', 'strong', 'tough', 'hard'],
            ['water', 'escape', 'trapped', 'inside', 'secret'],
          ],
          evidence: [
            'Popcorn is special because its hull is extra strong.',
            '"The hull is so tough that the water cannot easily escape.',
            '"That little bit of water is the secret," Professor Ada explained.',
          ],
          sample: 'Popcorn has an extra strong hull that keeps water inside. The story says, "The hull is so tough that the water cannot easily escape."',
        },
      ],
    },
    {
      id: 'why-popcorn-pops-2',
      title: 'Heat, Steam, Pop!',
      scene: '🔥💨💥',
      art: ['🍳🔥💨', '🌽💪🫧', '💥🍿🎉'],
      text: `Next, Professor Ada poured some kernels into a pot and turned on the heat. "When the kernels get very hot, the water inside them turns into steam," she said. "Steam takes up much more space than water. But the strong hull keeps it trapped inside."

Poppy watched the kernels wiggle and rattle. The steam pushed harder and harder against the hull. This pushing force is called pressure. Meanwhile, the heat was turning the starch soft and gooey, almost like melted marshmallow.

Suddenly, pop! The pressure grew too strong, and the hull burst open. The hot, gooey starch puffed out into a white foam that cooled and hardened in a flash. That fluffy shape is the popcorn we eat! A few kernels did not pop at all. "Those probably had too little water inside," Professor Ada said. Poppy cheered. "Science is the most delicious subject!"`,
      vocab: [
        { word: 'steam', definition: 'Water that has been heated so much it turns into a gas.', example: 'Steam rose from the hot soup.' },
        { word: 'pressure', definition: 'A force that pushes on something.', example: 'The pressure of the air inside made the balloon round.' },
        { word: 'burst', definition: 'Broke open suddenly.', example: 'The bubble burst when it touched the grass.' },
      ],
      drawIdeas: 'the kernels wiggling in the hot pot, steam pushing inside a kernel, or a kernel bursting into fluffy popcorn',
      questions: [
        {
          id: 'why-popcorn-pops-2-q1',
          type: 'inference',
          prompt: 'Why do you think the kernels started to wiggle and rattle in the pot?',
          choices: [
            'They were cold',
            'Steam inside was pushing on the hull',
            'Professor Ada was shaking the pot',
            'They were trying to escape the lab',
          ],
          answer: 1,
          evidence: 'The steam pushed harder and harder against the hull.',
          hint: 'Read what was happening inside the kernels while they wiggled.',
        },
        {
          id: 'why-popcorn-pops-2-q2',
          type: 'prediction',
          prompt: 'Imagine a kernel with a crack in its hull. What would probably happen when it got hot?',
          choices: [
            'It would pop extra big',
            'The steam would leak out, so it would not pop',
            'It would turn into water',
            'It would grow into a corn plant',
          ],
          answer: 1,
          evidence: 'But the strong hull keeps it trapped inside.',
          hint: 'Popping only happens when steam is trapped. What if it had a way out?',
        },
        {
          id: 'why-popcorn-pops-2-q3',
          type: 'factOpinion',
          prompt: 'Is this a fact or an opinion? "Science is the most delicious subject!"',
          choices: ['Fact', 'Opinion'],
          answer: 1,
          hint: 'Can you prove which subject is the most delicious?',
          explain: 'This tells how Poppy feels. Someone else might have a different favorite subject, so it is an opinion.',
        },
        {
          id: 'why-popcorn-pops-2-q4',
          type: 'evidence',
          open: true,
          prompt: 'Explain the steps that make a kernel pop. Use evidence from the story.',
          keywords: [
            ['steam', 'water', 'heat', 'hot'],
            ['pressure', 'burst', 'pushed', 'hull', 'open', 'puffed'],
          ],
          evidence: [
            '"When the kernels get very hot, the water inside them turns into steam," she said.',
            'The pressure grew too strong, and the hull burst open.',
            'The steam pushed harder and harder against the hull.',
          ],
          sample: 'First the heat turns the water into steam. The steam builds pressure until "the hull burst open" and the starch puffs out.',
        },
      ],
    },
  ],
}
