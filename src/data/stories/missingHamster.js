export default {
  id: 'missing-hamster',
  world: 'mystery',
  title: 'The Case of the Missing Hamster',
  genre: 'Mystery',
  grade: 4,
  difficulty: 'Medium',
  minutes: 5,
  cover: '🐹🔍🌻',
  summary: 'Biscuit the class hamster has vanished from his cage! Priya and Mateo gather clues, avoid blaming the wrong person, and solve the mystery by putting the evidence together.',
  writingPrompt: 'Priya and Mateo solved the case by noticing small clues. Write your own mini mystery about something that goes missing at school. What clues would a detective find?',
  chapters: [
    {
      id: 'missing-hamster-1',
      title: 'The Empty Cage',
      scene: '🐹🔓🌻',
      art: ['🏫🐹😮', '🌻🔍🔓', '🧑🤔💬'],
      text: `Priya Nair and Mateo Reyes were the first students in Room Nine on Monday morning. Priya hurried to the cage to say hello to Biscuit, the class hamster. The little door hung open, and the cage was empty.

"Do not panic," said Mateo. "Stay calm so you can think clearly. Detectives look for clues." Priya spotted a trail of sunflower seeds on the floor. The seeds lay in a line, one after another. Mateo checked the latch, the small catch that keeps the door closed. It was open. Near the cabinet, he saw tiny scratches on the wood. "Something small was here," he said.

Just then, Noah, the new student, walked in. "Why is everyone staring at me?" he asked. Priya whispered, "He was the last to leave on Friday. Maybe he left the cage open." Mateo shook his head. "Maybe. But we need more clues before we decide anything."`,
      vocab: [
        { word: 'panic', definition: 'To feel so scared or worried that you cannot think clearly.', example: 'Do not panic if you lose your pencil; look in your bag first.' },
        { word: 'trail', definition: 'A line of marks or things left behind that you can follow.', example: 'The muddy trail led from the door to the kitchen.' },
        { word: 'latch', definition: 'A small catch that keeps a door or gate closed.', example: 'Dad fixed the latch on the garden gate.' },
      ],
      drawIdeas: 'The open cage, the trail of sunflower seeds, or Priya and Mateo looking at the scratches by the cabinet',
      questions: [
        {
          id: 'missing-hamster-1-q1',
          type: 'mainIdea',
          prompt: 'What is this chapter mostly about?',
          choices: [
            'Noah makes friends on his first day of school',
            'Priya and Mateo clean the class hamster cage',
            'Biscuit has disappeared, and two friends start looking for clues',
            'Mateo teaches the class about sunflower seeds',
          ],
          answer: 2,
          evidence: 'The little door hung open, and the cage was empty.',
          hint: 'What problem do Priya and Mateo find in the first paragraph, and what do they look for after that?',
        },
        {
          id: 'missing-hamster-1-q2',
          type: 'vocabulary',
          prompt: 'The story says Priya spotted a "trail" of sunflower seeds, and "the seeds lay in a line, one after another." What does trail mean here?',
          choices: ['A line of things left behind that you can follow', 'A big, loud noise', 'A very tall cabinet', 'A kind of hamster food'],
          answer: 0,
          evidence: 'Priya spotted a trail of sunflower seeds on the floor.',
          hint: 'Read the sentence right after the word trail. How are the seeds lying?',
        },
        {
          id: 'missing-hamster-1-q3',
          type: 'inference',
          prompt: 'Priya guesses that Noah left the cage open. Mateo answers, "We need more clues before we decide anything." Why does Mateo say this?',
          choices: [
            'He wants to blame Noah right away',
            'He knows a guess is not proof that Noah did it',
            'He thinks the hamster is not really missing',
            'He is too tired to keep on looking',
          ],
          answer: 1,
          evidence: 'But we need more clues before we decide anything.',
          hint: 'Look at the last paragraph. Priya says "Maybe he left the cage open." What does Mateo say back?',
        },
        {
          id: 'missing-hamster-1-q4',
          type: 'evidence',
          open: true,
          prompt: 'What three clues show that something small left the cage? Use details from the story.',
          keywords: [
            ['seeds', 'scratches', 'latch', 'trail', 'cabinet'],
            ['open', 'small', 'floor', 'tiny', 'wood'],
          ],
          evidence: [
            'Priya spotted a trail of sunflower seeds on the floor.',
            'Mateo checked the latch, the small catch that keeps the door closed.',
            'Near the cabinet, he saw tiny scratches on the wood.',
          ],
          sample: 'The clues are seeds on the floor, an open latch, and tiny scratches. The story says, "Near the cabinet, he saw tiny scratches on the wood."',
        },
      ],
    },
    {
      id: 'missing-hamster-2',
      title: 'Following the Clues',
      scene: '🐹🧤📦',
      art: ['📓🔥🔍', '🌻📚📦', '🐹🧤😴'],
      text: `Priya and Mateo wrote the clues in a notebook. Open latch. Seeds. Scratches. Then Priya touched the floor in the reading corner. "The heater makes it warm here," she said. "Hamsters like warm places to sleep." Mateo pointed at the seeds. "They lead to this corner. Noah's cubby, where he keeps his coat, is across the room. The clues point away from him."

Mateo followed the seeds to the lost and found box. "Wait," said Priya. "On Friday, a red glove sat on top of this box. Now it is gone." They lifted out a scarf and peeked inside.

At the bottom, the red glove was tucked into a corner, pushed in neatly like a tiny bed. Biscuit lay curled up inside, rolled into a round ball. He was sound asleep, with seeds all around him. "He opened the latch himself!" Mateo laughed. Priya turned to Noah. "I am sorry we blamed you." Noah smiled. "That is okay."`,
      vocab: [
        { word: 'cubby', definition: 'A small space where a student keeps coats and bags.', example: 'I hung my raincoat in my cubby.' },
        { word: 'tucked', definition: 'Pushed neatly into a small space.', example: 'She tucked the letter into her pocket.' },
        { word: 'curled', definition: 'Bent or rolled into a round shape.', example: 'The kitten curled up on the warm blanket.' },
      ],
      drawIdeas: 'Biscuit asleep in the red glove, the lost and found box, or Priya and Mateo reading their notebook of clues',
      questions: [
        {
          id: 'missing-hamster-2-q1',
          type: 'inference',
          prompt: 'Priya says, "Hamsters like warm places to sleep." Why did Biscuit most likely go to the lost and found box?',
          choices: [
            'He wanted to hide from Noah',
            'He was trying to find his way outside',
            'He wanted a warm place to sleep',
            'He wanted to eat the scarf',
          ],
          answer: 2,
          evidence: 'Hamsters like warm places to sleep.',
          hint: 'Look at the first paragraph. What does Priya say about the heater and about hamsters? Then see how Biscuit is found.',
        },
        {
          id: 'missing-hamster-2-q2',
          type: 'vocabulary',
          prompt: 'The glove was "tucked into a corner, pushed in neatly like a tiny bed." What does tucked mean?',
          choices: ['Pushed neatly into a small space', 'Thrown far away', 'Washed with soap', 'Cut into pieces'],
          answer: 0,
          evidence: 'At the bottom, the red glove was tucked into a corner, pushed in neatly like a tiny bed.',
          hint: 'Look at the words right after tucked in the same sentence.',
        },
        {
          id: 'missing-hamster-2-q3',
          type: 'factOpinion',
          prompt: 'Is this a fact or an opinion? "Biscuit is the cutest hamster in the whole world."',
          choices: ['Fact', 'Opinion'],
          answer: 1,
          hint: 'Can anyone prove "cutest," or is it how a person feels?',
          explain: 'The word "cutest" tells what someone thinks. Other people might pick a different hamster, so it is an opinion.',
        },
        {
          id: 'missing-hamster-2-q4',
          type: 'evidence',
          open: true,
          prompt: 'How do the clues show that Noah did not take Biscuit? Give two pieces of evidence from the story.',
          keywords: [
            ['seeds', 'corner', 'cubby', 'latch', 'himself', 'glove'],
            ['away', 'other side', 'lead', 'point', 'opened', 'asleep'],
          ],
          evidence: [
            'The clues point away from him.',
            'Noah\'s cubby, where he keeps his coat, is across the room.',
            'He opened the latch himself!',
          ],
          sample: 'The seeds lead to the reading corner, away from Noah\'s cubby. The story says, "The clues point away from him."',
        },
      ],
    },
  ],
}
