export default {
  id: 'hummingbird-drops',
  world: 'folktales',
  title: 'The Hummingbird and the Fire',
  genre: 'Folktale',
  grade: 4,
  difficulty: 'Medium',
  minutes: 5,
  cover: '🐦🔥💧',
  summary: 'This story comes from the Andes mountains of South America. When a fire sweeps through the forest, the smallest bird of all refuses to stand by and do nothing.',
  writingPrompt: 'The hummingbird did her part even though she was tiny. Write about a problem in your school or town and one small thing you could do to help.',
  chapters: [
    {
      id: 'hummingbird-drops-1',
      title: 'Fire in the Forest',
      scene: '🔥🌲🦜',
      art: ['🔥🌲💨', '🐆🦜🐒', '🐦💧🔥'],
      text: `High in the Andes mountains, a great forest stood green and quiet. Then one dry afternoon, a spark caught the grass. Soon the flames were roaring through the trees with a loud, deep sound. Thick smoke filled the sky.

The animals ran out of the forest as fast as they could. Jaguar, Parrot, Monkey, and Deer gathered at the edge of the river. They came together in one place and stared at the burning trees. "This is terrible," said Parrot. "The fire is too big for us. What can we do?" Nobody had an answer.

Then a tiny hummingbird zipped past them, moving very quickly. She dipped her beak into the river and took a single drop of water. Off she flew toward the flames. She let the drop fall on the fire, and then she raced back to the river for another.`,
      vocab: [
        { word: 'roaring', definition: 'Making a very loud, deep sound.', example: 'The roaring waterfall could be heard from far away.' },
        { word: 'gathered', definition: 'Came together in one place.', example: 'The class gathered on the rug for story time.' },
        { word: 'zipped', definition: 'Moved very quickly.', example: 'A little scooter zipped down the sidewalk.' },
      ],
      drawIdeas: 'The animals standing by the river, the hummingbird carrying a drop of water, or flames roaring through the trees',
      questions: [
        {
          id: 'hummingbird-drops-1-q1',
          type: 'mainIdea',
          prompt: 'What is this chapter mostly about?',
          choices: [
            'A forest fire starts, and a hummingbird begins to fight it',
            'The animals build a new home by the river',
            'A parrot learns how to speak',
            'Jaguar teaches the animals to swim',
          ],
          answer: 0,
          evidence: 'Off she flew toward the flames.',
          hint: 'Think about the big problem in the first paragraph and who acts in the last paragraph.',
        },
        {
          id: 'hummingbird-drops-1-q2',
          type: 'vocabulary',
          prompt: 'The story says the hummingbird "zipped past them, moving very quickly." What does zipped mean?',
          choices: ['Moved very slowly', 'Fell down', 'Moved very quickly', 'Stopped and rested'],
          answer: 2,
          evidence: 'Then a tiny hummingbird zipped past them.',
          hint: 'Look at the words right after zipped in the same sentence.',
        },
        {
          id: 'hummingbird-drops-1-q3',
          type: 'inference',
          prompt: 'Parrot says, "The fire is too big for us." Why did the big animals stand at the river and do nothing?',
          choices: [
            'They did not care about the forest',
            'They thought the fire was too big for them to stop',
            'They were waiting for the rain to start',
            'They were busy eating by the river',
          ],
          answer: 1,
          evidence: 'The fire is too big for us.',
          hint: 'Look at the second paragraph. What does Parrot say about the size of the fire?',
        },
        {
          id: 'hummingbird-drops-1-q4',
          type: 'evidence',
          open: true,
          prompt: 'What does the hummingbird do to try to help with the fire? Tell the two things she does with the water. Use details from the story.',
          keywords: [
            ['drop', 'water', 'beak', 'river'],
            ['fire', 'flames', 'back', 'another', 'again', 'flew'],
          ],
          evidence: [
            'She dipped her beak into the river and took a single drop of water.',
            'She let the drop fall on the fire, and then she raced back to the river for another.',
          ],
          sample: 'The hummingbird carries one drop of water at a time to the fire. The story says, "She dipped her beak into the river and took a single drop of water."',
        },
      ],
    },
    {
      id: 'hummingbird-drops-2',
      title: 'The Best She Could Do',
      scene: '🐦💧🐆',
      art: ['🐆😏🐦', '🐦🔥💪', '🦌🐒💧'],
      text: `Back and forth she flew, again and again. Jaguar watched with a smirk, a smile that says he thinks he is better than her. "Little bird, you are wasting your time," he said. "Your tiny drops will never put out such a huge fire, so all your work gets you nothing. You are far too small to matter. You are not important."

The hummingbird did not stop. Her wings were tired, and the heat made her feathers curl. "I know I am small," she called back. "But I am doing the best I can." Then she dipped her beak into the river once more.

The animals went quiet. They were sorry they had done nothing, because the tiny bird was trying harder than they were. Slowly, each one walked to the water. They carried what they could, in their mouths, in leaves, and in their paws. Jaguar went last, and he did not say a word.`,
      vocab: [
        { word: 'smirk', definition: 'A smile that shows you think you are better than someone.', example: 'He had a smirk on his face when he won the game.' },
        { word: 'wasting', definition: 'Using up time or effort without getting anything good from it.', example: 'Leaving the water running is wasting water.' },
        { word: 'matter', definition: 'To be important.', example: 'Every vote can matter in a close election.' },
      ],
      drawIdeas: 'Jaguar smirking at the hummingbird, the tired hummingbird still flying, or all the animals carrying water together',
      questions: [
        {
          id: 'hummingbird-drops-2-q1',
          type: 'details',
          prompt: 'What did the hummingbird say when Jaguar told her she was too small?',
          choices: [
            '"I am going to find help."',
            '"I am doing the best I can."',
            '"The fire is too big for me."',
            '"You should carry the water instead."',
          ],
          answer: 1,
          evidence: '"But I am doing the best I can."',
          hint: 'Look at the second paragraph. What does she call back after "I know I am small"?',
        },
        {
          id: 'hummingbird-drops-2-q2',
          type: 'inference',
          prompt: 'The story says the animals were sorry they had done nothing. Why did they walk to the water?',
          choices: [
            'They were thirsty from the heat',
            'Jaguar ordered them to go',
            'They wanted a bath in the river',
            'They saw her try so hard and wanted to help too',
          ],
          answer: 3,
          evidence: 'They were sorry they had done nothing, because the tiny bird was trying harder than they were.',
          hint: 'Look at the third paragraph. Why were the animals sorry?',
        },
        {
          id: 'hummingbird-drops-2-q3',
          type: 'mainIdea',
          prompt: 'What lesson does this story teach?',
          choices: [
            'Everyone can do their part, even if it seems small',
            'Only big animals can solve big problems',
            'Fires are always put out by rain',
            'It is best to run away from danger',
          ],
          answer: 0,
          evidence: 'Slowly, each one walked to the water.',
          hint: 'Think about what the small bird did and how the other animals acted afterward.',
        },
        {
          id: 'hummingbird-drops-2-q4',
          type: 'evidence',
          open: true,
          prompt: 'What did Jaguar say about the hummingbird, and how did she answer him? Use evidence from the story.',
          keywords: [
            ['small', 'tiny', 'wasting', 'mock', 'laughed', 'smirk', 'matter'],
            ['best', 'did not stop', 'kept', 'again', 'dipped', 'continued'],
          ],
          evidence: [
            'You are far too small to matter.',
            '"But I am doing the best I can."',
            'The hummingbird did not stop.',
          ],
          sample: 'Jaguar said, "You are far too small to matter," but she kept going. She said, "But I am doing the best I can."',
        },
      ],
    },
  ],
}
