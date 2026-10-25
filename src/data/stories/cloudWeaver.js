export default {
  id: 'cloud-weaver',
  world: 'fantasy',
  title: 'The Cloud Weaver of Sundar Valley',
  genre: 'Fantasy',
  grade: 5,
  difficulty: 'Challenge',
  minutes: 6,
  cover: '☁️🧵🌧️',
  summary: 'When a long drought dries up Sundar Valley, Meera inherits her grandfather\'s loom that weaves clouds. She must learn that patience and listening matter more than speed.',
  writingPrompt: 'Meera learned to ask instead of command. Write about a time when listening or waiting patiently helped you. What did you learn from it?',
  chapters: [
    {
      id: 'cloud-weaver-1',
      title: 'The Silver Loom',
      scene: '☀️🧵☁️',
      art: ['☀️🌾🪣', '🧶🏚️✨', '☁️😤💨'],
      text: `In Sundar Valley, no rain had fallen for a long season. The rice fields cracked like old pottery, which is made of baked clay. Without rain, the village wells sank lower each morning. Meera carried her small copper pot to the well and heard it scrape against the stones.

That evening, she climbed to her grandfather's attic. Dada had been the cloud weaver, and now his loom stood waiting under a faded shawl. "Weave patiently, and listen to the wind," he had told her before he passed away. Meera unwrapped the silver thread, and it shimmered like moonlight, which means it shone with a soft, trembling light.

She worked quickly, throwing the shuttle back and forth. She did not listen to the wind. A cloud puffed up, but it was thin and dry as paper, and the wind tore it to shreds. She tried again, and again. "It is useless!" she cried, flinging the thread down. She felt that nothing she did could do any good. Outside, the dry wind sighed as if it were trying to speak.`,
      vocab: [
        { word: 'pottery', definition: 'Pots and bowls made from baked clay.', example: 'The museum had pottery that was thousands of years old.' },
        { word: 'shimmered', definition: 'Shone with a soft, trembling light.', example: 'The lake shimmered under the evening sky.' },
        { word: 'useless', definition: 'Not able to do any good.', example: 'The umbrella was useless against the strong wind.' },
      ],
      drawIdeas: 'The cracked rice fields, Meera unwrapping the silver thread, or a thin cloud being torn apart by the wind',
      questions: [
        {
          id: 'cloud-weaver-1-q1',
          type: 'mainIdea',
          prompt: 'What is the main idea of this chapter?',
          choices: [
            'Meera finds her grandfather\'s loom, but her rushed weaving fails',
            'Meera wins a contest for the best weaving',
            'Meera moves away from Sundar Valley',
            'Meera learns to carry water from far away',
          ],
          answer: 0,
          evidence: 'A cloud puffed up, but it was thin and dry as paper, and the wind tore it to shreds.',
          hint: 'Think about the problem in the first paragraph and what happens when Meera uses the loom in the third paragraph.',
        },
        {
          id: 'cloud-weaver-1-q2',
          type: 'vocabulary',
          prompt: 'The thread "shimmered like moonlight." What does shimmered mean?',
          choices: ['Made a loud noise', 'Felt rough and heavy', 'Shone with a soft, trembling light', 'Broke into pieces'],
          answer: 2,
          evidence: 'Meera unwrapped the silver thread, and it shimmered like moonlight, which means it shone with a soft, trembling light.',
          hint: 'Read the words after "which means" in the second paragraph.',
        },
        {
          id: 'cloud-weaver-1-q3',
          type: 'inference',
          prompt: 'Dada told Meera, "Weave patiently, and listen to the wind." Why did her first clouds fail?',
          choices: [
            'The thread was too old to use',
            'She did not have enough thread',
            'The attic was too dark to see',
            'She worked too fast and did not listen to the wind',
          ],
          answer: 3,
          evidence: 'She worked quickly, throwing the shuttle back and forth.',
          hint: 'Look at the third paragraph. Compare how she worked with what Dada told her to do.',
        },
        {
          id: 'cloud-weaver-1-q4',
          type: 'evidence',
          open: true,
          prompt: 'Name two things in the story that show Meera feels frustrated. Use details from the story.',
          keywords: [
            ['useless', 'cried', 'flinging', 'again', 'tried', 'failed', 'thin', 'dry', 'good'],
            ['thread', 'cloud', 'wind', 'loom', 'shreds', 'quickly', 'nothing'],
          ],
          evidence: [
            'She tried again, and again.',
            'She felt that nothing she did could do any good.',
            'A cloud puffed up, but it was thin and dry as paper, and the wind tore it to shreds.',
          ],
          sample: 'Meera feels frustrated because her clouds keep failing. She cries, "It is useless!" and flings the thread down.',
        },
      ],
    },
    {
      id: 'cloud-weaver-2',
      title: 'Asking the Wind',
      scene: '🌬️🧵🌧️',
      art: ['🧘‍♀️🌬️👂', '🧵☁️🙏', '🌧️💧🏡'],
      text: `Meera sat quietly until her anger faded. She closed her eyes and listened. The wind did not howl. It whispered about faraway mountains where the rain was resting. "I have been commanding you," she realized. "I have been giving orders. I should have been asking."

She lifted the thread and wove slowly, one gentle row at a time. "Please, wind, will you carry my cloud?" she murmured in a soft, low voice. The wind curled around the loom, and the silver strands thickened into a deep gray cloud. The cloud rolled out through the window and rose above the valley.

Rain fell that night, and the villagers danced in the lanes. Meera smiled, though her eyes were wet, for she wished Dada could see it. The cloud drifted, moving slowly and gently, over every field and well, giving each an equal share. Meera understood the lesson at last. Water, like patience, was meant to be shared.`,
      vocab: [
        { word: 'commanding', definition: 'Giving orders and expecting them to be obeyed.', example: 'The captain was commanding the crew to raise the sails.' },
        { word: 'murmured', definition: 'Spoke in a soft, low voice.', example: 'She murmured a goodnight to her sleepy brother.' },
        { word: 'drifted', definition: 'Moved slowly and gently along.', example: 'The boat drifted across the calm pond.' },
      ],
      drawIdeas: 'Meera listening with closed eyes, the gray cloud rising from the loom, or villagers dancing in the rain',
      questions: [
        {
          id: 'cloud-weaver-2-q1',
          type: 'inference',
          prompt: 'The story says Meera "smiled, though her eyes were wet." Why were her eyes wet?',
          choices: [
            'She was happy about the rain but missed Dada',
            'She was angry that the rain came too late',
            'She was afraid the cloud would disappear',
            'She was tired from weaving all night',
          ],
          answer: 0,
          evidence: 'Meera smiled, though her eyes were wet, for she wished Dada could see it.',
          hint: 'Read the end of the same sentence to find the reason.',
        },
        {
          id: 'cloud-weaver-2-q2',
          type: 'vocabulary',
          prompt: 'Meera says, "I have been commanding you." Then she says, "I have been giving orders." What does commanding mean?',
          choices: ['Singing softly to', 'Giving orders to', 'Running away from', 'Waiting patiently for'],
          answer: 1,
          evidence: 'I have been giving orders.',
          hint: 'Look at the first paragraph. The sentence right after "commanding" says the same thing in other words.',
        },
        {
          id: 'cloud-weaver-2-q3',
          type: 'mainIdea',
          prompt: 'What is the main idea of this chapter?',
          choices: [
            'Fast work is always the best work',
            'Only grandparents can use magic',
            'Meera learns to ask and listen, and her cloud brings rain for all',
            'Rain is more important than rice',
          ],
          answer: 2,
          evidence: 'Water, like patience, was meant to be shared.',
          hint: 'Think about what changed in Meera\'s weaving and what the cloud did for the valley.',
        },
        {
          id: 'cloud-weaver-2-q4',
          type: 'evidence',
          open: true,
          prompt: 'What does Meera do differently the second time she weaves, and what happens because of it? Use evidence from the story.',
          keywords: [
            ['slowly', 'listened', 'asking', 'ask', 'please', 'gentle', 'quietly', 'patient'],
            ['rain', 'cloud', 'wind', 'valley', 'villagers', 'shared', 'share'],
          ],
          evidence: [
            'She lifted the thread and wove slowly, one gentle row at a time.',
            'Rain fell that night, and the villagers danced in the lanes.',
            'The cloud drifted, moving slowly and gently, over every field and well, giving each an equal share.',
          ],
          sample: 'Meera listens and asks the wind politely. The story says, "She lifted the thread and wove slowly," and then "Rain fell that night."',
        },
      ],
    },
  ],
}
