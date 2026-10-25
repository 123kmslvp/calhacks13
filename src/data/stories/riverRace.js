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
      text: `Every summer, the Kernel Kingdom held the Great River Race. Rafts of every shape bobbed along the muddy bank. Poppy's team was Mateo, Amara, and Poppy. Their raft was made of old barrels tied together with strong rope, and they called it the Butter Boat.

"Remember the plan," said Amara, who had studied the river map all week. "I will steer from the back. Mateo and Poppy, you paddle on opposite sides so we go straight." Mateo nodded, but his hands were shaking. He had never been in a race before.

The horn blew, and forty rafts splashed forward at once. The Butter Boat spun in a slow circle, because Mateo and Poppy were both paddling on the same side! Other teams zoomed ahead. "We are already losing," Mateo groaned. Poppy laughed kindly. "Every great journey starts with a wobble. Let's try again, together."`,
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
            'Amara draws a new map of the river',
            'Mateo wins the race easily',
            'Poppy builds a house out of barrels',
          ],
          answer: 0,
          evidence: 'The Butter Boat spun in a slow circle',
          hint: 'Think about what happened right after the horn blew.',
        },
        {
          id: 'river-race-1-q2',
          type: 'details',
          prompt: 'What was the Butter Boat made of?',
          choices: ['Popcorn and string', 'Old barrels tied with rope', 'Logs and leaves', 'A big wooden box'],
          answer: 1,
          evidence: 'Their raft was made of old barrels tied together with strong rope',
          hint: 'Look in the first paragraph where the raft is described.',
        },
        {
          id: 'river-race-1-q3',
          type: 'vocabulary',
          prompt: 'Amara told them to paddle on "opposite" sides. What does opposite mean here?',
          choices: ['The same side', 'Very fast', 'The other side from each other', 'Under the water'],
          answer: 2,
          evidence: 'Mateo and Poppy, you paddle on opposite sides so we go straight.',
          hint: 'What went wrong when they both paddled on the same side?',
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
            'The Butter Boat spun in a slow circle, because Mateo and Poppy were both paddling on the same side!',
            'Mateo and Poppy, you paddle on opposite sides so we go straight.',
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
      text: `Halfway down the river, the water began to roar. White foam crashed over the rocks ahead. These were the Rumble Rapids, the trickiest part of the race.

"Look at the map," Amara called. "There is a calm channel on the left side of the big rock!" Mateo took a deep breath. This time he counted out loud, "Left, right, left, right," so he and Poppy could paddle in rhythm. The Butter Boat glided past the rock into the calm channel.

Then they spotted a team stuck on a sandbar. Their raft would not budge. Mateo looked at the finish line, then at the stuck team. "We can help them," he said. Together they tossed a rope and pulled the other raft free. The Butter Boat crossed the finish line in tenth place, but the crowd cheered loudest for them. Mateo grinned. "That was the best race ever!"`,
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
            'He wanted to help the team paddle together and not spin again',
            'He was trying to scare the fish',
            'He forgot which hand was which',
          ],
          answer: 1,
          evidence: 'This time he counted out loud, "Left, right, left, right," so he and Poppy could paddle in rhythm.',
          hint: 'Think back to what went wrong in Chapter One. Why would counting help?',
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
          prompt: 'The Butter Boat came in tenth place. Why do you think the crowd cheered loudest for them?',
          choices: [
            'Their raft was the biggest',
            'They stopped to help another team that was stuck',
            'They finished first',
            'They had the loudest horn',
          ],
          answer: 1,
          evidence: 'Together they tossed a rope and pulled the other raft free.',
          hint: 'What did the team do on the way to the finish line that other teams might not have done?',
        },
        {
          id: 'river-race-2-q4',
          type: 'evidence',
          open: true,
          prompt: 'How did Mateo change from the start of the race to the end? Use evidence from both chapters if you can.',
          keywords: [
            ['nervous', 'scared', 'shaking', 'worried', 'losing', 'groaned'],
            ['brave', 'confident', 'help', 'helped', 'leader', 'grinned', 'counted', 'happy', 'kind'],
          ],
          evidence: [
            'Mateo took a deep breath.',
            '"We can help them," he said.',
            'Mateo grinned.',
          ],
          sample: 'At first Mateo was nervous and thought they were losing. By the end he led the team and chose to help others. He said, "We can help them."',
        },
      ],
    },
  ],
}
