export default {
  id: 'loudest-sneeze',
  world: 'funny',
  title: "The World's Loudest Sneeze",
  genre: 'Humor',
  grade: 3,
  difficulty: 'Medium',
  minutes: 4,
  cover: '🤧🥁🌼',
  summary: 'Leila has the loudest sneeze in Maple School, and she is sure it will ruin the school concert. When it happens at the worst moment, it turns into the best surprise of the night.',
  writingPrompt: 'Leila learned that laughing together is different from being laughed at. Write about a time something embarrassing turned into something funny and kind. Use lots of sound words!',
  chapters: [
    {
      id: 'loudest-sneeze-1',
      title: 'The Daisy Hat Problem',
      scene: '🤧🌼🎩',
      art: ['🤧🦆🕊️', '🌼🎩😬', '🤏👃😖'],
      text: `Leila Hassan had the loudest sneeze in all of Maple School. It sounded like a goose honking inside a trombone. When she sneezed, windows rattled, or shook with a clattering noise. Papers flew off desks.

The school concert was on Friday. Leila's class had to wear hats covered in fresh daisies. Daisies tickle noses. Leila stared at her hat and groaned, making a low, unhappy sound. She feared a sneeze would ruin the concert. "Please, nose," she begged, asking with all her heart. "Do not sneeze on Friday."

"Just hold it in," said her friend Omar. Leila pinched her nose. Her ears wiggled. "I will be fine," she squeaked. Her nose did not answer. It only tickled.`,
      vocab: [
        { word: 'rattled', definition: 'Shook and made a quick, clattering noise.', example: 'The thunder rattled the dishes in the cupboard.' },
        { word: 'groaned', definition: 'Made a low sound because you were unhappy or worried.', example: 'He groaned when he saw the huge pile of homework.' },
        { word: 'begged', definition: 'Asked in a very serious way, hoping so much for a yes.', example: 'The puppy begged for a bite of my sandwich.' },
      ],
      drawIdeas: 'Leila sneezing so hard that papers fly, the daisy hat, or Leila pinching her nose while her ears wiggle',
      questions: [
        {
          id: 'loudest-sneeze-1-q1',
          type: 'mainIdea',
          prompt: 'What is this chapter mostly about?',
          choices: [
            'Leila wins a prize for singing',
            'Omar learns how to grow daisies',
            'A pigeon visits Maple School',
            'Leila worries her loud sneeze will ruin the concert',
          ],
          answer: 3,
          evidence: 'She feared a sneeze would ruin the concert.',
          hint: 'Look at the second paragraph. What is Leila afraid will happen at the concert?',
        },
        {
          id: 'loudest-sneeze-1-q2',
          type: 'vocabulary',
          prompt: 'The story says windows "rattled, or shook with a clattering noise." What does rattled mean?',
          choices: ['Opened very slowly', 'Turned bright blue', 'Shook with a clattering noise', 'Fell silent'],
          answer: 2,
          evidence: 'When she sneezed, windows rattled, or shook with a clattering noise.',
          hint: 'Look at the words right after rattled in the same sentence.',
        },
        {
          id: 'loudest-sneeze-1-q3',
          type: 'inference',
          prompt: 'The story says, "Daisies tickle noses." Why does Leila groan when she looks at her hat?',
          choices: [
            'The hat is too small for her head',
            'She knows the daisies might make her sneeze',
            'She does not like the color of the hat',
            'She wants to wear a hat made of paper',
          ],
          answer: 1,
          evidence: 'Daisies tickle noses.',
          hint: 'Read the sentence right before she groans. What do daisies do to noses?',
        },
        {
          id: 'loudest-sneeze-1-q4',
          type: 'evidence',
          open: true,
          prompt: 'What two details show that Leila has a very loud sneeze? Use details from the story.',
          keywords: [
            ['loudest', 'goose', 'trombone', 'windows', 'rattled', 'pigeon', 'papers'],
            ['sneeze', 'sneezed', 'sounded', 'flew', 'fell'],
          ],
          evidence: [
            'Leila Hassan had the loudest sneeze in all of Maple School.',
            'It sounded like a goose honking inside a trombone.',
            'Papers flew off desks.',
          ],
          sample: 'Leila\'s sneeze is very loud. Her sneeze sounds like a goose in a trombone, and the story says, "Papers flew off desks."',
        },
      ],
    },
    {
      id: 'loudest-sneeze-2',
      title: 'AHCHOOOM!',
      scene: '🥁🤧🎉',
      art: ['🎶🤫🌼', '🤧💥🥁', '🎉🤣👏'],
      text: `On concert night, the class sang a quiet, sleepy song. The room was so still you could hear a mouse yawn. Then Leila's nose twitched, making a quick little move. "Ah... ah... ah..." she whispered. "AHCHOOOM!"

The sneeze blew daisy petals into the air like confetti, which is tiny bits of colored paper. Drummer Sam jumped, and CRASH! The cymbals clanged. Principal Dobbs's tall hat popped off and landed on the tuba. TOOT! The audience gasped, taking a quick breath of surprise. Then somebody giggled, and everyone laughed.

Leila's face turned red as a tomato. But Principal Dobbs laughed hardest of all. "Wonderful!" he shouted. Everyone was laughing with her, not at her. The crowd cheered. Leila grinned. Laughing together felt like a hug.`,
      vocab: [
        { word: 'twitched', definition: 'Made a quick little movement that you cannot control.', example: 'The rabbit\'s nose twitched when it smelled a carrot.' },
        { word: 'confetti', definition: 'Tiny bits of colored paper thrown to celebrate.', example: 'Confetti rained down at the parade.' },
        { word: 'gasped', definition: 'Took in a quick breath because of surprise.', example: 'We gasped when the lights suddenly went out.' },
      ],
      drawIdeas: 'Daisy petals flying like confetti, Principal Dobbs\'s hat on the tuba, or Leila grinning while the crowd cheers',
      questions: [
        {
          id: 'loudest-sneeze-2-q1',
          type: 'details',
          prompt: 'Where did Principal Dobbs\'s hat land?',
          choices: ['On the drum', 'On Leila\'s head', 'On the stage floor', 'On the tuba'],
          answer: 3,
          evidence: 'Principal Dobbs\'s tall hat popped off and landed on the tuba.',
          hint: 'Look in the second paragraph. What happens right before the TOOT?',
        },
        {
          id: 'loudest-sneeze-2-q2',
          type: 'inference',
          prompt: 'Leila\'s face turned red as a tomato. Why did she stop feeling embarrassed at the end?',
          choices: [
            'Everyone was laughing with her and cheering',
            'The audience went home early',
            'Nobody noticed the sneeze',
            'Her nose finally stopped tickling',
          ],
          answer: 0,
          evidence: 'Everyone was laughing with her, not at her.',
          hint: 'Look at the last paragraph. How was everyone laughing?',
        },
        {
          id: 'loudest-sneeze-2-q3',
          type: 'vocabulary',
          prompt: 'The petals flew "like confetti, which is tiny bits of colored paper." What is confetti?',
          choices: ['A kind of flower', 'A loud drum', 'A school hat', 'Tiny bits of colored paper for celebrating'],
          answer: 3,
          evidence: 'The sneeze blew daisy petals into the air like confetti.',
          hint: 'Read the words right after confetti in the same sentence.',
        },
        {
          id: 'loudest-sneeze-2-q4',
          type: 'evidence',
          open: true,
          prompt: 'What silly things happened after Leila sneezed? Name two of them. Use evidence from the story.',
          keywords: [
            ['cymbals', 'crash', 'drummer', 'hat', 'tuba', 'petals', 'toot'],
            ['jumped', 'clanged', 'popped', 'landed', 'blew', 'laughing', 'gasped'],
          ],
          evidence: [
            'Drummer Sam jumped, and CRASH!',
            'The cymbals clanged.',
            'Principal Dobbs\'s tall hat popped off and landed on the tuba.',
          ],
          sample: 'The sneeze made the drummer jump, and the cymbals crashed. Then the story says, "Principal Dobbs\'s tall hat popped off and landed on the tuba."',
        },
      ],
    },
  ],
}
