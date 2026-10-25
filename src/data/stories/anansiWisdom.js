export default {
  id: 'anansi-wisdom',
  world: 'folktales',
  title: 'Anansi and the Pot of Wisdom',
  genre: 'Folktale',
  grade: 3,
  difficulty: 'Gentle',
  minutes: 4,
  cover: '🕷️🏺🌳',
  summary: 'In this tale told in Ghana, Anansi the spider tries to keep all the wisdom in the world for himself, until his young son shows him something important.',
  writingPrompt: 'Anansi learned that nobody has all the wisdom. Write about a time when someone younger or smaller than you had a really good idea.',
  chapters: [
    {
      id: 'anansi-wisdom-1',
      title: 'The Greedy Plan',
      scene: '🕷️🏺🌳',
      art: ['🕷️💭😏', '🏺💡📜', '🌳🕷️🏺'],
      text: `Long ago in Ghana, Anansi the spider thought he was very clever. He had a greedy idea, because he wanted much more than his fair share. "I will gather all the wisdom in the world," he said. "Then nobody else will have any, and everyone will need me."

Wisdom is good understanding and smart choices. He collected wise sayings, good ideas, and clever tricks. He pushed them all into a big clay pot.

"Now where can I hide it?" Anansi asked. "The top of the tallest tree!" He tied the pot in front of his belly and began to climb. But the pot kept bumping against the trunk, the thick main part of the tree. Anansi slid back down again and again because the pot was in the way.`,
      vocab: [
        { word: 'wisdom', definition: 'Good understanding and the smart choices that come from it.', example: 'Grandma shared her wisdom about being a kind friend.' },
        { word: 'greedy', definition: 'Wanting much more than your fair share.', example: 'The greedy raccoon wanted every berry in the bush.' },
        { word: 'trunk', definition: 'The thick main stem of a tree.', example: 'A squirrel ran up the trunk of the oak.' },
      ],
      drawIdeas: 'Anansi pushing wise sayings into the clay pot, or Anansi sliding down the tree with the pot on his belly',
      questions: [
        {
          id: 'anansi-wisdom-1-q1',
          type: 'mainIdea',
          prompt: 'What is this chapter mostly about?',
          choices: [
            'Anansi tries to keep all the wisdom for himself',
            'Anansi shares his wisdom with the village',
            'Anansi builds a house in a tall tree',
            'Anansi learns how to make a clay pot',
          ],
          answer: 0,
          evidence: '"I will gather all the wisdom in the world," he said.',
          hint: 'What does Anansi say he will do with all the wisdom?',
        },
        {
          id: 'anansi-wisdom-1-q2',
          type: 'vocabulary',
          prompt: 'The story says Anansi had a "greedy" idea. What does greedy mean?',
          choices: ['Very sleepy', 'Wanting much more than your share', 'Kind and giving', 'Quiet and shy'],
          answer: 1,
          evidence: 'He had a greedy idea, because he wanted much more than his fair share.',
          hint: 'Look at the words after the comma in that sentence. They tell why the idea was greedy.',
        },
        {
          id: 'anansi-wisdom-1-q3',
          type: 'inference',
          prompt: 'Why did Anansi slide back down the tree again and again?',
          choices: [
            'He was afraid of heights',
            'He wanted to show off to his son',
            'The pot on his belly was in the way',
            'The tree was too short to climb',
          ],
          answer: 2,
          evidence: 'Anansi slid back down again and again because the pot was in the way.',
          hint: 'Where did Anansi tie the pot, and what did it keep bumping into?',
        },
        {
          id: 'anansi-wisdom-1-q4',
          type: 'evidence',
          open: true,
          prompt: 'Why does Anansi want to collect all the wisdom? Use details from the story.',
          keywords: [
            ['everyone', 'nobody', 'no one', 'others', 'need'],
            ['clever', 'greedy', 'himself', 'keep', 'all', 'more'],
          ],
          evidence: [
            'He had a greedy idea, because he wanted much more than his fair share.',
            '"Then nobody else will have any, and everyone will need me."',
          ],
          sample: 'Anansi is greedy and wants everyone to need him. The story says, "Then nobody else will have any, and everyone will need me."',
        },
      ],
    },
    {
      id: 'anansi-wisdom-2',
      title: 'A Better Idea',
      scene: '👦🕷️💨',
      art: ['👦🌳📣', '🕷️😳💭', '🏺💥🌬️'],
      text: `Anansi's young son, Ntikuma, watched from the ground. "Father, why don't you tie the pot on your back?" he called. "Then your arms and legs will be free to climb."

Anansi stopped. The boy was right! Anansi muttered in a low, quiet voice, "I thought I had gathered all the wisdom. Yet my little son has a better idea than mine." His face grew hot with embarrassment, a shy and uncomfortable feeling.

In his anger, Anansi flung the pot, or threw it hard, to the ground. It cracked open, and the wisdom spilled out. The wind carried it over the fields and villages, and every person found a little piece. That is why wisdom belongs to everyone.`,
      vocab: [
        { word: 'muttered', definition: 'Spoke in a low, quiet voice, often when annoyed.', example: 'Dad muttered under his breath when he lost his keys.' },
        { word: 'embarrassment', definition: 'A shy, uncomfortable feeling when you think you look foolish.', example: 'She felt embarrassment when she tripped in front of the class.' },
        { word: 'flung', definition: 'Threw something hard and fast.', example: 'He flung his coat onto the chair.' },
      ],
      drawIdeas: 'Ntikuma calling up to his father, the pot cracking open, or wisdom floating over the villages on the wind',
      questions: [
        {
          id: 'anansi-wisdom-2-q1',
          type: 'details',
          prompt: 'What did Ntikuma suggest?',
          choices: [
            'Giving the pot to the villagers',
            'Climbing a shorter tree',
            'Asking the wind for help',
            'Tying the pot on his back',
          ],
          answer: 3,
          evidence: 'Father, why don\'t you tie the pot on your back?',
          hint: 'Look at what Ntikuma calls up from the ground in the first paragraph.',
        },
        {
          id: 'anansi-wisdom-2-q2',
          type: 'inference',
          prompt: 'Anansi said, "Yet my little son has a better idea than mine." Why did he feel embarrassment?',
          choices: [
            'He saw that he did not have all the wisdom after all',
            'His son climbed the tree before him',
            'The villagers laughed at his pot',
            'He forgot where he put the pot',
          ],
          answer: 0,
          evidence: 'Yet my little son has a better idea than mine.',
          hint: 'Anansi thought he had every good idea. Who just had a better one?',
        },
        {
          id: 'anansi-wisdom-2-q3',
          type: 'mainIdea',
          prompt: 'What is the main message of the story?',
          choices: [
            'Spiders are the best climbers',
            'Wisdom belongs to everyone, and anyone can have a good idea',
            'Clay pots break very easily',
            'Children should always listen quietly',
          ],
          answer: 1,
          evidence: 'That is why wisdom belongs to everyone.',
          hint: 'Read the last sentence of the story.',
        },
        {
          id: 'anansi-wisdom-2-q4',
          type: 'evidence',
          open: true,
          prompt: 'What happened to the wisdom at the end? Use evidence from the story.',
          keywords: [
            ['spilled', 'cracked', 'broke', 'flung', 'dropped'],
            ['wind', 'everyone', 'every person', 'villages', 'fields', 'spread', 'shared'],
          ],
          evidence: [
            'It cracked open, and the wisdom spilled out.',
            'The wind carried it over the fields and villages, and every person found a little piece.',
          ],
          sample: 'The pot cracked and the wisdom spilled out. The story says, "The wind carried it over the fields and villages, and every person found a little piece."',
        },
      ],
    },
  ],
}
