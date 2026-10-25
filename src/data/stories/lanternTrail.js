export default {
  id: 'lantern-trail',
  world: 'adventure',
  title: 'Lost on Lantern Trail',
  genre: 'Adventure',
  grade: 4,
  difficulty: 'Gentle',
  minutes: 5,
  cover: '🥾🌲🧭',
  summary: 'Kofi and Ama wander off the trail while chasing a butterfly. By remembering the safety rule STOP, they stay calm, signal for help, and get found.',
  writingPrompt: 'Kofi and Ama used a safety plan to stay calm. Write about a time you needed to stay calm and make a plan. What steps did you take?',
  chapters: [
    {
      id: 'lantern-trail-1',
      title: 'The Blue Butterfly',
      scene: '🦋🌲🥾',
      art: ['🥾🌲👨‍👩‍👧‍👦', '🦋📸🏃', '🛑🤔🪵'],
      text: `Kofi Boateng was ten, and his sister Ama was eight. They were hiking Lantern Trail with their family and a small group. The air was cool, and the trees smelled like pine. Earlier, a ranger, or park worker, had taught everyone a safety rule called STOP.

Suddenly, Ama pointed. "Look! A blue butterfly!" She tiptoed after it, and Kofi followed with his camera. The butterfly fluttered over a log, flapping its wings quickly and lightly. Kofi snapped a photo. When he looked up, the group was gone. He could not see the orange trail markers anywhere.

Kofi's heart thumped. Ama's eyes filled with tears. Then Kofi took a slow breath. "Remember the ranger's rule?" he said. "S means Stop. The ranger said that staying in one place helps people find you. We will not wander off and walk around with no plan. Instead, we will sit on this log and think." Ama wiped her eyes and nodded.`,
      vocab: [
        { word: 'ranger', definition: 'A person who takes care of a park and helps visitors stay safe.', example: 'The ranger showed us where the deer like to rest.' },
        { word: 'fluttered', definition: 'Flew with quick, light flaps of the wings.', example: 'A moth fluttered around the porch light.' },
        { word: 'wander', definition: 'To walk around with no clear plan or direction.', example: 'Do not wander off in a crowded store.' },
      ],
      drawIdeas: 'The blue butterfly over the log, Kofi taking a photo, or the two siblings sitting on the log to think',
      questions: [
        {
          id: 'lantern-trail-1-q1',
          type: 'mainIdea',
          prompt: 'What is this chapter mostly about?',
          choices: [
            'Kofi wins a photo contest',
            'Two siblings get separated from their group and decide to stop and think',
            'A ranger teaches a class about butterflies',
            'Ama learns how to climb a tall tree',
          ],
          answer: 1,
          evidence: 'When he looked up, the group was gone.',
          hint: 'Look at the second and third paragraphs. What problem happens, and what do Kofi and Ama decide to do about it?',
        },
        {
          id: 'lantern-trail-1-q2',
          type: 'vocabulary',
          prompt: 'Kofi says, "We will not wander off and walk around with no plan." What does wander mean?',
          choices: ['Sing loudly', 'Run as fast as possible', 'Walk around without a plan', 'Fall asleep'],
          answer: 2,
          evidence: 'We will not wander off and walk around with no plan.',
          hint: 'Read the rest of Kofi\'s sentence. It tells you what wandering would look like.',
        },
        {
          id: 'lantern-trail-1-q3',
          type: 'inference',
          prompt: 'Kofi says, "The ranger said that staying in one place helps people find you." Why did Kofi say he and Ama should sit on the log?',
          choices: [
            'He wanted the group to be able to find them',
            'He was too tired to walk',
            'He wanted to take more photos',
            'He thought the butterfly would come back',
          ],
          answer: 0,
          evidence: 'The ranger said that staying in one place helps people find you.',
          hint: 'Look at what Kofi says in the last paragraph, right after "S means Stop."',
        },
        {
          id: 'lantern-trail-1-q4',
          type: 'evidence',
          open: true,
          prompt: 'What two things did Kofi do to stay calm when he was worried? Use details from the story.',
          keywords: [
            ['breath', 'remember', 'rule', 'stop', 'ranger', 'think'],
            ['calm', 'slow', 'sit', 'log', 'wander', 'nodded'],
          ],
          evidence: [
            'Then Kofi took a slow breath.',
            'Ama wiped her eyes and nodded.',
            'Instead, we will sit on this log and think.',
          ],
          sample: 'Kofi took a slow breath and remembered the ranger\'s rule. The story says, "Then Kofi took a slow breath."',
        },
      ],
    },
    {
      id: 'lantern-trail-2',
      title: 'Three Loud Blasts',
      scene: '📯🧥🧑‍🚒',
      art: ['🤔👀🗺️', '📯🧥🌲', '🧑‍🚒💧👏'],
      text: `Next came T for Think and O for Observe. To observe means to look carefully and notice things. "Walking farther could make us more lost," Kofi said. They looked around. Then came P for Plan. They would stay on the log so that searchers could see and hear them.

Kofi blew the whistle on his backpack three times. Each loud burst of sound was a blast. Then he paused and blew three more. "Three blasts means help," he remembered. Ama took off her bright yellow jacket and spread it wide on the ground, so searchers could spot it. Kofi waved his orange one in the air. They shared sips of water and waited.

Soon, footsteps crunched on the dry leaves with a crackling sound. "Hello?" called a ranger named Ms. Ruiz. "We are here!" Kofi shouted. "You two did everything right," she said. "Staying in one place made you easy to find." Their family hugged them tight.`,
      vocab: [
        { word: 'observe', definition: 'To look carefully and notice things around you.', example: 'We observe the birds from the window each morning.' },
        { word: 'blasts', definition: 'Strong, loud bursts of sound.', example: 'The train gave two long blasts of its horn.' },
        { word: 'crunched', definition: 'Made a crackling sound, like stepping on dry leaves.', example: 'The snow crunched under our boots.' },
      ],
      drawIdeas: 'Kofi blowing the whistle, Ama\'s yellow jacket spread on the ground, or Ms. Ruiz finding them',
      questions: [
        {
          id: 'lantern-trail-2-q1',
          type: 'details',
          prompt: 'How many times did Kofi blow the whistle the first time?',
          choices: ['Once', 'Two times', 'Five times', 'Three times'],
          answer: 3,
          evidence: 'Kofi blew the whistle on his backpack three times.',
          hint: 'Look at the first sentence of the second paragraph. Find the number word.',
        },
        {
          id: 'lantern-trail-2-q2',
          type: 'inference',
          prompt: 'Why did Ama spread her bright jacket on the ground?',
          choices: [
            'So searchers could spot it',
            'So she could rest on it',
            'Because she felt too warm',
            'So the ranger could not see them',
          ],
          answer: 0,
          evidence: 'Ama took off her bright yellow jacket and spread it wide on the ground, so searchers could spot it.',
          hint: 'Look at the second paragraph. The end of the sentence about the jacket tells you why.',
        },
        {
          id: 'lantern-trail-2-q3',
          type: 'vocabulary',
          prompt: 'The story says, "O for Observe." What does observe mean?',
          choices: ['To shout for help', 'To look carefully and notice things', 'To run away quickly', 'To eat a snack'],
          answer: 1,
          evidence: 'To observe means to look carefully and notice things.',
          hint: 'Read the sentence right after "O for Observe."',
        },
        {
          id: 'lantern-trail-2-q4',
          type: 'evidence',
          open: true,
          prompt: 'What two things did Kofi and Ama do so the searchers could find them? Use evidence from the story.',
          keywords: [
            ['whistle', 'jacket', 'waved', 'stay', 'stayed', 'put', 'blew'],
            ['three', 'bright', 'yellow', 'orange', 'see', 'seen', 'hear', 'ground'],
          ],
          evidence: [
            'Kofi blew the whistle on his backpack three times.',
            'Ama took off her bright yellow jacket and spread it wide on the ground, so searchers could spot it.',
            'Kofi waved his orange one in the air.',
          ],
          sample: 'They blew the whistle three times and used bright jackets. The story says, "Kofi blew the whistle on his backpack three times."',
        },
      ],
    },
  ],
}
