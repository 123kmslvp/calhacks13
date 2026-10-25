export default {
  id: 'otter-pup',
  world: 'animals',
  title: 'Kai the Otter Pup',
  genre: 'Animals',
  grade: 3,
  difficulty: 'Gentle',
  minutes: 4,
  cover: '🦦🌊🐚',
  summary: 'Kai is a fluffy sea otter pup who cannot even sink, but he has a lot to learn before he can find his own snack.',
  writingPrompt: 'Imagine you spent one day as a sea otter. Write about what you would eat, how you would stay warm, and who you would float with!',
  chapters: [
    {
      id: 'otter-pup-1',
      title: 'Floating on Mom',
      scene: '🦦🌊☀️',
      art: ['🦦🌊☁️', '🧼🦦💨', '🌿🦦🦀'],
      text: `In the cool water of Monterey Bay, a baby sea otter named Kai floated on his mother's belly. His fur was so fluffy that he bobbed like a cork. He could not sink!

Sea otters do not have a thick layer of fat like whales do. Instead, they have the thickest fur of any animal on Earth. Kai's mother spent a long time grooming him, licking and fluffing his fur. Grooming traps tiny bubbles of air that help keep an otter warm.

When his mother dove for food, she wrapped Kai in a long strand of kelp. The seaweed worked like a seat belt so he would not drift away. Kai squeaked until she popped up with a crab.`,
      vocab: [
        { word: 'grooming', definition: 'Cleaning and brushing fur or hair to keep it in good shape.', example: 'The cat spent the morning grooming her kittens.' },
        { word: 'kelp', definition: 'A very long, tall kind of seaweed that grows in the ocean.', example: 'Fish swam between the tall kelp plants.' },
        { word: 'drift', definition: 'To be carried slowly by water or wind.', example: 'We watched the leaf drift down the stream.' },
      ],
      drawIdeas: 'Kai floating on his mother\'s belly, Kai wrapped in kelp, or his mother popping up with a crab',
      questions: [
        {
          id: 'otter-pup-1-q1',
          type: 'mainIdea',
          prompt: 'What is this chapter mostly about?',
          choices: [
            'How a mother sea otter takes care of her pup',
            'How whales stay warm',
            'How to catch a crab',
            'Why kelp is green',
          ],
          answer: 0,
          evidence: "Kai's mother spent a long time grooming him, licking and fluffing his fur.",
          hint: 'Think about all the things Kai\'s mother does for him.',
        },
        {
          id: 'otter-pup-1-q2',
          type: 'details',
          prompt: 'Why did Kai\'s mother wrap him in kelp?',
          choices: [
            'So he would stay clean',
            'So he would not drift away',
            'So he could eat it',
            'So he could hide from the crab',
          ],
          answer: 1,
          evidence: 'The seaweed worked like a seat belt so he would not drift away.',
          hint: 'The kelp worked like a seat belt. What does a seat belt do?',
        },
        {
          id: 'otter-pup-1-q3',
          type: 'vocabulary',
          prompt: 'Kai might "drift" away. What does drift mean?',
          choices: ['To swim very fast', 'To be carried slowly by the water', 'To dive down deep', 'To fall asleep'],
          answer: 1,
          evidence: 'The seaweed worked like a seat belt so he would not drift away.',
          hint: 'Kai was floating and could not swim well yet. What could the water do to him?',
        },
        {
          id: 'otter-pup-1-q4',
          type: 'evidence',
          open: true,
          prompt: 'How do sea otters stay warm in cool water? Use facts from the story.',
          keywords: [
            ['fur', 'thick', 'thickest', 'fluffy'],
            ['grooming', 'groom', 'air', 'bubbles', 'licking', 'fluffing'],
          ],
          evidence: [
            'Instead, they have the thickest fur of any animal on Earth.',
            'Grooming traps tiny bubbles of air that help keep an otter warm.',
            'Sea otters do not have a thick layer of fat like whales do.',
          ],
          sample: 'Sea otters have very thick fur and they groom it. The story says, "Grooming traps tiny bubbles of air that help keep an otter warm."',
        },
      ],
    },
    {
      id: 'otter-pup-2',
      title: 'The Rock Trick',
      scene: '🦦🪨🐚',
      art: ['🦦⬇️🐚', '🪨🐚💥', '🦦🤝🦦'],
      text: `As Kai grew bigger, his fluffy baby fur changed into sleek adult fur. Now he could finally dive! He paddled to the sandy bottom and grabbed a clam. But the shell was shut tight.

Kai's mother floated on her back and showed him a trick. She placed a flat rock on her chest. Then she banged the clam against the rock, again and again, until the shell cracked open. Sea otters are one of the few animals that use tools!

Kai tried it himself. Bonk, bonk, crack! He slurped up his snack. That night, Kai and his mother rested in a group called a raft. Some held paws so they would not drift apart while they slept.`,
      vocab: [
        { word: 'sleek', definition: 'Smooth and shiny.', example: 'The seal had sleek, wet fur.' },
        { word: 'tools', definition: 'Objects used to help do a job.', example: 'A hammer and a shovel are both tools.' },
        { word: 'raft', definition: 'A group of sea otters floating together. It can also mean a flat boat.', example: 'A raft of otters floated near the rocks.' },
      ],
      drawIdeas: 'Kai diving for a clam, his mother cracking a shell on a rock, or a raft of otters holding paws',
      questions: [
        {
          id: 'otter-pup-2-q1',
          type: 'inference',
          prompt: 'Why could Kai finally dive in this chapter, but not when he was a tiny pup?',
          choices: [
            'His fluffy baby fur made him float, and now it changed',
            'His mother finally let him swim',
            'The water got warmer',
            'He found a heavy rock to hold',
          ],
          answer: 0,
          evidence: 'As Kai grew bigger, his fluffy baby fur changed into sleek adult fur.',
          hint: 'Remember Chapter One: what made baby Kai bob like a cork?',
        },
        {
          id: 'otter-pup-2-q2',
          type: 'factOpinion',
          prompt: 'Is this a fact or an opinion? "Sea otters are one of the few animals that use tools."',
          choices: ['Fact', 'Opinion'],
          answer: 0,
          hint: 'Could scientists watch otters and check if this is true?',
          explain: 'Scientists have watched sea otters use rocks to open shells, so this can be proven. It is a fact.',
        },
        {
          id: 'otter-pup-2-q3',
          type: 'prediction',
          prompt: 'What will Kai most likely do the next time he finds a clam?',
          choices: [
            'Throw it back',
            'Use a rock to crack it open',
            'Give it to a whale',
            'Wrap it in kelp',
          ],
          answer: 1,
          evidence: 'Kai tried it himself.',
          hint: 'Think about the trick Kai just learned and how well it worked.',
        },
        {
          id: 'otter-pup-2-q4',
          type: 'evidence',
          open: true,
          prompt: 'How did Kai learn to open a clam? Explain using the story.',
          keywords: [
            ['mother', 'mom', 'showed', 'watched', 'trick', 'learned'],
            ['rock', 'tool', 'tools', 'banged', 'cracked', 'crack'],
          ],
          evidence: [
            "Kai's mother floated on her back and showed him a trick.",
            'Then she banged the clam against the rock, again and again, until the shell cracked open.',
            'Kai tried it himself.',
          ],
          sample: 'His mother showed him how. She "banged the clam against the rock" until it cracked, and then Kai tried it himself.',
        },
      ],
    },
  ],
}
