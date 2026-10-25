export default {
  id: 'bright-dragon',
  world: 'fantasy',
  title: 'Lumi and the Dark Forest',
  genre: 'Fantasy',
  grade: 3,
  difficulty: 'Gentle',
  minutes: 4,
  cover: '🐉🌙✨',
  summary: 'Lumi the little dragon is afraid of the dark, until one night in the forest Lumi discovers a glowing surprise.',
  writingPrompt: 'Lumi found beautiful things in the dark forest. Write about a new place Lumi and Poppy explore next, and what they discover there!',
  chapters: [
    {
      id: 'bright-dragon-1',
      title: 'Lumi and the Night',
      scene: '🐉🌲🌙',
      art: ['🐉☀️🍿', '🌙🌲😟', '🍿☕🤗'],
      text: `Deep in Fantasy Forest lived a small dragon named Lumi. Lumi had shiny green scales and tiny wings. Lumi loved sunny days, picnics, and Poppy's popcorn. But Lumi did not love the night.

When the sun went down, the forest grew dark and quiet. Long shadows stretched across the path. "What if something is hiding?" Lumi whispered. Lumi shivered and hid under a big leaf.

Poppy hopped over with a cup of warm cocoa. "It is okay to feel scared," Poppy said gently. "Lots of brave friends feel scared sometimes." Lumi peeked out. "Even you?" Poppy smiled. "Even me. Tomorrow night, let's explore the dark together."`,
      vocab: [
        { word: 'shadows', definition: 'Dark shapes made when something blocks the light.', example: 'Our shadows grew long when the sun went down.' },
        { word: 'shivered', definition: 'Shook a little because of cold or fear.', example: 'I shivered when I jumped into the cold pool.' },
        { word: 'explore', definition: 'To look around a place to learn about it.', example: 'We will explore the new playground after lunch.' },
      ],
      drawIdeas: 'Lumi hiding under a big leaf, the long shadows on the path, or Poppy bringing warm cocoa',
      questions: [
        {
          id: 'bright-dragon-1-q1',
          type: 'mainIdea',
          prompt: 'What is this chapter mostly about?',
          choices: [
            'Lumi learns to fly',
            'Lumi feels scared of the dark, and Poppy helps',
            'Poppy makes a new batch of popcorn',
            'Lumi has a picnic in the sun',
          ],
          answer: 1,
          evidence: 'But Lumi did not love the night.',
          hint: 'What problem does Lumi have, and who comes to help?',
        },
        {
          id: 'bright-dragon-1-q2',
          type: 'vocabulary',
          prompt: 'Lumi "shivered" and hid under a leaf. What does shivered mean?',
          choices: ['Laughed loudly', 'Shook a little from fear or cold', 'Fell asleep', 'Ate a snack'],
          answer: 1,
          evidence: 'Lumi shivered and hid under a big leaf.',
          hint: 'Lumi was scared. What might a scared body do?',
        },
        {
          id: 'bright-dragon-1-q3',
          type: 'prediction',
          prompt: 'What do you predict will happen tomorrow night?',
          choices: [
            'Lumi and Poppy will explore the dark forest together',
            'Lumi will move to a new forest',
            'Poppy will forget about Lumi',
            'The sun will never go down',
          ],
          answer: 0,
          evidence: "Tomorrow night, let's explore the dark together.",
          hint: 'Read the last thing Poppy says in the chapter.',
        },
        {
          id: 'bright-dragon-1-q4',
          type: 'evidence',
          open: true,
          prompt: 'How does Lumi feel about the night? Use details from the story.',
          keywords: [
            ['scared', 'afraid', 'fear', 'nervous', 'worried', 'shivered'],
            ['dark', 'night', 'shadows', 'hiding', 'hid', 'leaf'],
          ],
          evidence: [
            'But Lumi did not love the night.',
            'Lumi shivered and hid under a big leaf.',
            'Long shadows stretched across the path.',
          ],
          sample: 'Lumi feels scared of the night. The story says, "Lumi shivered and hid under a big leaf."',
        },
      ],
    },
    {
      id: 'bright-dragon-2',
      title: 'A Glow in the Night',
      scene: '🌙🔥✨',
      art: ['🦉🌲👋', '🌳💥🔥', '✨🌸🐉'],
      text: `The next night, Lumi and Poppy walked into the forest. An owl hooted, and Lumi jumped. "That is just Olive the owl saying hello," Poppy explained. Lumi waved a shaky claw.

Then the path grew so dark that Poppy could not see. Poppy bumped right into a tree. "Oops! I wish we had a light," Poppy said. Lumi wanted to help. Lumi took a deep breath and felt warm inside. A soft golden glow puffed out of Lumi's nose!

The glow lit up the whole path. Fireflies twinkled. Flowers sparkled with drops of dew. "The dark is full of beautiful things," Lumi said in amazement. Lumi was still a little scared, but now Lumi felt brave too.`,
      vocab: [
        { word: 'shaky', definition: 'Moving a little in a wobbly way, often because you are nervous.', example: 'My voice was shaky before I sang on stage.' },
        { word: 'glow', definition: 'A soft, steady light.', example: 'The night light gave the room a warm glow.' },
        { word: 'amazement', definition: 'A feeling of great surprise and wonder.', example: 'We stared in amazement at the giant rainbow.' },
      ],
      drawIdeas: 'Olive the owl saying hello, the golden glow from Lumi\'s nose, or the fireflies and sparkly flowers',
      questions: [
        {
          id: 'bright-dragon-2-q1',
          type: 'details',
          prompt: 'Who made the hooting sound that made Lumi jump?',
          choices: ['A firefly', 'Olive the owl', 'Poppy', 'A big tree'],
          answer: 1,
          evidence: '"That is just Olive the owl saying hello," Poppy explained.',
          hint: 'Look at what Poppy explains in the first paragraph.',
        },
        {
          id: 'bright-dragon-2-q2',
          type: 'inference',
          prompt: 'Why do you think Lumi made a glow?',
          choices: [
            'Lumi wanted to help Poppy see the path',
            'Lumi was trying to scare the owl',
            'Lumi was cooking popcorn',
            'Lumi sneezed by accident',
          ],
          answer: 0,
          evidence: 'Lumi wanted to help.',
          hint: 'What did Poppy wish for right before the glow appeared?',
        },
        {
          id: 'bright-dragon-2-q3',
          type: 'factOpinion',
          prompt: 'Is this a fact or an opinion? "The forest is the prettiest place in the whole world at night."',
          choices: ['Fact', 'Opinion'],
          answer: 1,
          hint: 'Is "prettiest" something you can prove, or is it how someone feels?',
          explain: 'The word "prettiest" tells what someone thinks. Other people might like a different place best, so it is an opinion.',
        },
        {
          id: 'bright-dragon-2-q4',
          type: 'evidence',
          open: true,
          prompt: 'How did Lumi show courage in this chapter? Use evidence from the story.',
          keywords: [
            ['help', 'helped', 'light', 'glow', 'breath', 'nose'],
            ['brave', 'courage', 'scared', 'still', 'beautiful'],
          ],
          evidence: [
            'Lumi took a deep breath and felt warm inside.',
            'Lumi was still a little scared, but now Lumi felt brave too.',
            'Lumi wanted to help.',
          ],
          sample: 'Lumi was still scared but made a glow to help Poppy. The story says, "Lumi was still a little scared, but now Lumi felt brave too."',
        },
      ],
    },
  ],
}
