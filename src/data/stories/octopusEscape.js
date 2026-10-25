export default {
  id: 'octopus-escape',
  world: 'animals',
  title: 'The Octopus Escape Artist',
  genre: 'Nonfiction',
  grade: 5,
  difficulty: 'Medium',
  minutes: 6,
  cover: '🐙💙🌊',
  summary: 'Octopuses have no bones, three hearts, and blue blood. Learn how these clever animals squeeze, hide, solve puzzles, and even escape from an aquarium.',
  writingPrompt: 'If you could be any sea creature for one day, which would you choose? Use two facts you learned about octopuses to explain what would make your day interesting.',
  chapters: [
    {
      id: 'octopus-escape-1',
      title: 'A Body Like No Other',
      scene: '🐙💙🧠',
      art: ['🐙🕳️🌊', '💙❤️❤️', '🧠🐙✋'],
      text: `An octopus has no bones in its body. Its only hard part is a small beak, shaped a bit like a parrot's. A beak is the hard, pointed part of a mouth. Because of this, an octopus can squeeze through any opening that is bigger than its beak. A large octopus can flow through a gap that looks far too small.

The inside of an octopus is just as unusual. It has three hearts. Two hearts pump blood past the gills, where the animal takes in oxygen, a gas it needs to breathe. The third heart sends blood to the rest of the body. An octopus also has blue blood, because its blood uses copper to carry oxygen instead of the iron that human blood uses.

An octopus also has a large brain. Many of its neurons are spread through its arms. Neurons are cells that carry messages. Each arm can touch and taste whatever it wraps around. It can act almost like a helper with a mind of its own.`,
      vocab: [
        { word: 'beak', definition: 'The hard, pointed mouth part of some animals.', example: 'The bird picked up a seed with its beak.' },
        { word: 'oxygen', definition: 'A gas in air and water that living things need to breathe.', example: 'Fish take oxygen from the water through their gills.' },
        { word: 'neurons', definition: 'Special cells that carry messages in the brain and body.', example: 'Neurons help your brain tell your hand to move.' },
      ],
      drawIdeas: 'An octopus squeezing through a small hole, three hearts with blue blood, or an arm touching and tasting a shell',
      questions: [
        {
          id: 'octopus-escape-1-q1',
          type: 'mainIdea',
          prompt: 'What is this chapter mostly about?',
          choices: [
            'How octopuses find food in the ocean',
            'The unusual body parts that make an octopus special',
            'Why octopuses live alone in caves',
            'How octopuses are like parrots',
          ],
          answer: 1,
          evidence: 'The inside of an octopus is just as unusual.',
          hint: 'Each paragraph describes a different part of an octopus\'s body. What do they all have in common?',
        },
        {
          id: 'octopus-escape-1-q2',
          type: 'details',
          prompt: 'Why does an octopus have blue blood?',
          choices: [
            'Its blood uses iron to carry oxygen',
            'It lives in blue ocean water',
            'Its blood uses copper to carry oxygen',
            'It has three hearts',
          ],
          answer: 2,
          evidence: 'An octopus also has blue blood, because its blood uses copper to carry oxygen instead of the iron that human blood uses.',
          hint: 'Find the sentence about blue blood in the second paragraph and look for the word because.',
        },
        {
          id: 'octopus-escape-1-q3',
          type: 'inference',
          prompt: 'The article says an octopus can squeeze through any opening that is bigger than its beak. What does that tell you about an octopus in a tight space?',
          choices: [
            'It cannot fit if its arms are longer than the gap',
            'It must break the rock to get inside',
            'It will only fit if it first loses its beak',
            'It can fit if the gap is bigger than its hard beak',
          ],
          answer: 3,
          evidence: 'Because of this, an octopus can squeeze through any opening that is bigger than its beak.',
          hint: 'Look at the first paragraph. The beak is the only hard part of the octopus.',
        },
        {
          id: 'octopus-escape-1-q4',
          type: 'evidence',
          open: true,
          prompt: 'Name two unusual things about the body of an octopus. Use details from the article.',
          keywords: [
            ['bones', 'beak', 'squeeze', 'three hearts', 'hearts', 'blue blood', 'blood'],
            ['brain', 'neurons', 'arms', 'taste', 'touch', 'copper', 'gills'],
          ],
          evidence: [
            'An octopus has no bones in its body.',
            'It has three hearts.',
            'Each arm can touch and taste whatever it wraps around.',
          ],
          sample: 'An octopus has no bones, so it can squeeze through small gaps. It also has three hearts. The article says, "It has three hearts."',
        },
      ],
    },
    {
      id: 'octopus-escape-2',
      title: 'Color, Ink, and Escape',
      scene: '🎨🫙🌊',
      art: ['🐙🎨🪸', '🫙🧩🐙', '🏢🐙🌊'],
      text: `An octopus can change the color and texture of its skin in a moment. Texture is how a surface feels, such as rough or smooth. Special cells called chromatophores hold colored spots that can grow or shrink. This lets the octopus use camouflage, which means blending in with rocks or coral. A predator is an animal that hunts other animals. If a predator still notices it, the octopus can squirt a cloud of dark ink and jet away.

Octopuses are also good problem solvers. Scientists have watched them solve puzzles and unscrew the lids of jars to reach food inside. Many people say octopuses are the most amazing animals in the ocean, but that is an opinion. It is a fact that they can learn from experience.

One famous story comes from the National Aquarium of New Zealand. As widely reported, an octopus named Inky slipped out of his tank in twenty sixteen. He crossed the floor and squeezed into a drain pipe that led to the sea. Workers never saw Inky again.`,
      vocab: [
        { word: 'camouflage', definition: 'Colors or patterns that help an animal blend in with its surroundings.', example: 'The green frog used camouflage to hide among the leaves.' },
        { word: 'predator', definition: 'An animal that hunts and eats other animals.', example: 'A hawk is a predator that hunts mice.' },
        { word: 'texture', definition: 'How the surface of something feels, such as rough or smooth.', example: 'The texture of the tree bark was rough.' },
      ],
      drawIdeas: 'An octopus blending in with coral, an octopus opening a jar, or Inky sliding toward the drain pipe',
      questions: [
        {
          id: 'octopus-escape-2-q1',
          type: 'vocabulary',
          prompt: 'The article says an octopus can use "camouflage." What does camouflage mean?',
          choices: [
            'Blending in with the places around you',
            'Swimming very fast away from danger',
            'Hunting for food at night',
            'Making a loud noise to scare enemies',
          ],
          answer: 0,
          evidence: 'This lets the octopus use camouflage, which means blending in with rocks or coral.',
          hint: 'The sentence itself explains the word after the comma.',
        },
        {
          id: 'octopus-escape-2-q2',
          type: 'factOpinion',
          prompt: 'Is this a fact or an opinion? "Octopuses are the most amazing animals in the ocean."',
          choices: ['Fact', 'Opinion'],
          answer: 1,
          hint: 'Look at the second paragraph. Can anyone prove that one animal is the most amazing, or is it what a person thinks?',
          explain: 'The words "most amazing" show what someone feels. Other people might pick dolphins or whales, so it is an opinion. A fact, like "An octopus can squirt ink," can be checked.',
        },
        {
          id: 'octopus-escape-2-q3',
          type: 'inference',
          prompt: 'Inky slipped out of his tank, crossed the floor, and squeezed into a drain pipe. What does this story suggest about octopuses?',
          choices: [
            'They are always unhappy in aquariums',
            'They cannot live outside the sea at all',
            'They can find a way out of tricky places',
            'They like to be found by people',
          ],
          answer: 2,
          evidence: 'He crossed the floor and squeezed into a drain pipe that led to the sea.',
          hint: 'Look at the last paragraph. Think about how Inky got out of his tank and where the pipe led.',
        },
        {
          id: 'octopus-escape-2-q4',
          type: 'evidence',
          open: true,
          prompt: 'What two things can an octopus do to protect itself from predators? Use evidence from the article.',
          keywords: [
            ['camouflage', 'color', 'change', 'blend', 'chromatophores', 'texture'],
            ['ink', 'squirt', 'cloud', 'jet', 'away', 'predator'],
          ],
          evidence: [
            'An octopus can change the color and texture of its skin in a moment.',
            'If a predator still notices it, the octopus can squirt a cloud of dark ink and jet away.',
          ],
          sample: 'An octopus can change its skin color to blend in. If that fails, "the octopus can squirt a cloud of dark ink and jet away."',
        },
      ],
    },
  ],
}
