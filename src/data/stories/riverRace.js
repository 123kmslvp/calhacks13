export default {
  id: 'river-race',
  world: 'adventure',
  title: 'The Great River Race',
  genre: 'Adventure',
  grade: 4,
  difficulty: 'Medium',
  minutes: 5,
  cover: '🛶🌊🏁',
  summary: 'Poppy, Mateo, and Amara build a barrel raft and race down a roaring river, but winning might mean something different than they think.',
  writingPrompt: 'Design your own raft for the Great River Race! What is it made of, what is its name, and who is on your team?',
  chapters: [
    {
      id: 'river-race-1',
      title: 'Ready, Set, Paddle',
      scene: '🛶🌅🍿',
      art: ['🛢️🛶🌅', '🗺️🧭😬', '📯🌀😅'],
      text: `Every summer, the Kernel Kingdom held the Great River Race. Poppy's team had three kernels: Poppy, Mateo, and Amara. Their raft was made of old barrels tied together with strong rope. They called it the Butter Boat.

"Remember the plan," said Amara. She had studied the map all week. "I will steer from the back. That means I will control which way the raft goes. Mateo and Poppy, you paddle on opposite sides, one on the left and one on the right, so we go straight." Mateo nodded, but his hands were shaking. He had never raced before.

The horn blew, and forty rafts splashed forward at once. The Butter Boat spun in a slow circle because Mateo and Poppy were both paddling on the same side! "We are already losing," Mateo groaned. Poppy laughed kindly. "Every great journey, or long trip, starts with a wobble. Let's try again, together."`,
      vocab: [
        { word: 'steer', definition: 'To control which way something moves.', example: 'Dad let me steer the wagon down the sidewalk.' },
        { word: 'opposite', definition: 'On the other side, or as different as can be.', example: 'My house is on the opposite side of the street from the park.' },
        { word: 'journey', definition: 'A trip from one place to another, often a long one.', example: 'Our journey to Grandma\'s house took all day.' },
      ],
      drawIdeas: 'the Butter Boat made of barrels, all the rafts bobbing at the start, or the raft spinning in a circle',
      questions: [
        {
          id: 'river-race-1-q1',
          type: 'mainIdea',
          prompt: 'What is this chapter mostly about?',
          choices: [
            'A team starts a raft race and gets off to a wobbly start',
            'Amara draws a brand new map of the river',
            'Mateo wins the race by paddling very fast',
            'Poppy builds a house out of old barrels',
          ],
          answer: 0,
          evidence: 'The Butter Boat spun in a slow circle because Mateo and Poppy were both paddling on the same side!',
          hint: 'Think about what happened right after the horn blew, in the last paragraph.',
        },
        {
          id: 'river-race-1-q2',
          type: 'details',
          prompt: 'What was the Butter Boat made of?',
          choices: ['Popcorn and string', 'Old barrels tied with rope', 'Logs and leaves', 'A big wooden box'],
          answer: 1,
          evidence: 'Their raft was made of old barrels tied together with strong rope.',
          hint: 'Look in the first paragraph where the raft is described.',
        },
        {
          id: 'river-race-1-q3',
          type: 'vocabulary',
          prompt: 'Amara said, "Mateo and Poppy, you paddle on opposite sides, one on the left and one on the right." What does opposite mean here?',
          choices: ['On the same side', 'As fast as you can', 'Across from each other', 'Under the water'],
          answer: 2,
          evidence: 'Mateo and Poppy, you paddle on opposite sides, one on the left and one on the right, so we go straight.',
          hint: 'Look at the words right after opposite sides. Where does each paddler sit?',
        },
        {
          id: 'river-race-1-q4',
          type: 'evidence',
          open: true,
          prompt: 'Why did the Butter Boat spin in a circle? Use details from the story.',
          keywords: [
            ['same', 'side', 'both', 'one'],
            ['paddle', 'paddled', 'paddling', 'plan', 'opposite', 'straight'],
          ],
          evidence: [
            'The Butter Boat spun in a slow circle because Mateo and Poppy were both paddling on the same side!',
            'Mateo and Poppy, you paddle on opposite sides, one on the left and one on the right, so we go straight.',
          ],
          sample: 'They forgot the plan to paddle on opposite sides. The story says they "were both paddling on the same side!"',
        },
      ],
    },
    {
      id: 'river-race-2',
      title: 'The Rumble Rapids',
      scene: '🌊🪨🤝',
      art: ['🌊🪨😮', '🗺️🎵🛶', '🤝🪢🏁'],
      text: `Halfway down the river, the water began to roar. These were the Rumble Rapids, where the water rushes fast over rocks. They were the trickiest part of the race.

"Look at the map," Amara called. "There is a calm channel, a narrow path of water, on the left side of the big rock!" This time Mateo counted out loud, "Left, right, left, right." He counted so that he and Poppy could paddle in rhythm, with the same steady beat. The Butter Boat glided into the calm channel.

Then they spotted a team stuck on a sandbar. "We can help them," Mateo said. Together they tossed a rope and pulled the other raft free. Helping took time, so the Butter Boat crossed the finish line in tenth place. The crowd cheered loudest for them because they had helped another team. Mateo grinned. "That was the best race ever!"`,
      vocab: [
        { word: 'rapids', definition: 'A part of a river where the water moves very fast over rocks.', example: 'The kayak bounced through the rapids.' },
        { word: 'channel', definition: 'A narrow path of water.', example: 'The boat followed the deep channel to stay off the rocks.' },
        { word: 'rhythm', definition: 'A steady beat or pattern, like in music.', example: 'We clapped to the rhythm of the song.' },
      ],
      drawIdeas: 'the foamy Rumble Rapids, the team paddling in rhythm, or the rope pulling the stuck raft free',
      questions: [
        {
          id: 'river-race-2-q1',
          type: 'inference',
          prompt: 'Why did Mateo count "Left, right, left, right" out loud?',
          choices: [
            'He was practicing for a math test',
            'He wanted to scare the fish away',
            'He wanted to paddle with Poppy in a steady beat',
            'He forgot which side was left',
          ],
          answer: 2,
          evidence: 'He counted so that he and Poppy could paddle in rhythm, with the same steady beat.',
          hint: 'Look at the sentence right after Mateo counts. What did he want himself and Poppy to do?',
        },
        {
          id: 'river-race-2-q2',
          type: 'factOpinion',
          prompt: 'Is this a fact or an opinion? "That was the best race ever!"',
          choices: ['Fact', 'Opinion'],
          answer: 1,
          hint: 'Could everyone agree it was the BEST, or is it how Mateo feels?',
          explain: 'The word "best" shows what Mateo thinks and feels. Other racers might feel differently, so it is an opinion.',
        },
        {
          id: 'river-race-2-q3',
          type: 'inference',
          prompt: 'The Butter Boat came in tenth place. Why did the crowd cheer loudest for them?',
          choices: [
            'They helped a stuck team get free',
            'Their raft was the biggest one',
            'They finished the race first',
            'They had the loudest horn',
          ],
          answer: 0,
          evidence: 'The crowd cheered loudest for them because they had helped another team.',
          hint: 'Look at the sentence about the crowd in the last paragraph. It tells you the reason.',
        },
        {
          id: 'river-race-2-q4',
          type: 'evidence',
          open: true,
          prompt: 'What did Mateo do in this chapter to help his own team and another team? Use details from the story.',
          keywords: [
            ['count', 'counted', 'counting', 'left', 'rhythm', 'beat', 'together', 'paddle'],
            ['help', 'helped', 'rope', 'pulled', 'stuck', 'free', 'sandbar'],
          ],
          evidence: [
            'This time Mateo counted out loud, "Left, right, left, right."',
            '"We can help them," Mateo said.',
            'Together they tossed a rope and pulled the other raft free.',
          ],
          sample: 'Mateo counted out loud so he and Poppy could paddle in rhythm. Then he said, "We can help them," and they pulled the stuck raft free.',
        },
      ],
    },
  ],
}
