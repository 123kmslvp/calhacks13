export default {
  id: 'moon-mission',
  world: 'space',
  title: 'Mission to the Shadow Crater',
  genre: 'Science fiction',
  grade: 5,
  difficulty: 'Challenge',
  minutes: 6,
  cover: '🌕🚀👩🏾‍🚀',
  summary: 'Junior astronaut Zara and Poppy bounce across the Moon on their first moonwalk, then drive into a dark crater to investigate a mysterious signal.',
  writingPrompt: 'Zara wonders what else the Moon is hiding. Write the next mission: where do Zara and Poppy go, and what do they discover?',
  chapters: [
    {
      id: 'moon-mission-1',
      title: 'First Moonwalk',
      scene: '🌕👩🏾‍🚀🍿',
      art: ['🪟🌍🌕', '🦘🌑☀️', '👣📻❗'],
      text: `Zara Okafor pressed her nose against the window of Moon Base Artemis and stared at the gray, dusty hills. Low in the black sky hung a blue and white marble. It was Earth, nearly four hundred thousand kilometers away. Poppy bounced beside her in a tiny spacesuit made for a kernel. "Today is our first moonwalk," Zara said. "Remember, the Moon has no air, so we have to talk by radio."

When the airlock opened, Zara took one step and sailed upward. The Moon's gravity is only about one sixth as strong as Earth's, so every step became a giant, floating hop. Poppy giggled over the radio. Even though the Sun was shining, the sky was completely black, because there is no air to scatter the sunlight and make it look blue.

Zara knelt and pressed her boot into the powdery soil. "Without wind or rain, this footprint could last for millions of years," she said. Then her radio crackled. "Zara, this is Commander Reyes. Our sensors detected something unusual in the crater nearby. We need you to investigate."`,
      vocab: [
        { word: 'gravity', definition: 'The force that pulls things toward a planet or moon.', example: 'Gravity is the reason a dropped ball falls to the ground.' },
        { word: 'scatter', definition: 'To spread out in many directions.', example: 'The wind made the leaves scatter across the yard.' },
        { word: 'investigate', definition: 'To look closely at something to find out the truth about it.', example: 'The detective came to investigate the missing cookies.' },
      ],
      drawIdeas: 'Earth hanging in the black sky, Zara and Poppy taking giant hops, or a footprint in the moon dust',
      questions: [
        {
          id: 'moon-mission-1-q1',
          type: 'mainIdea',
          prompt: 'What is this chapter mostly about?',
          choices: [
            'Zara and Poppy take their first moonwalk and learn how the Moon is different from Earth',
            'Zara builds a new moon base',
            'Poppy flies a rocket back to Earth',
            'Commander Reyes plants a garden',
          ],
          answer: 0,
          evidence: '"Today is our first moonwalk," Zara said.',
          hint: 'Think about what Zara and Poppy do and notice outside the base.',
        },
        {
          id: 'moon-mission-1-q2',
          type: 'vocabulary',
          prompt: 'On Earth, air can "scatter" sunlight and make the sky look blue. What does scatter mean?',
          choices: ['To spread out in many directions', 'To turn off', 'To get hotter', 'To stay in one place'],
          answer: 0,
          evidence: 'there is no air to scatter the sunlight and make it look blue',
          hint: 'Picture what happens when you drop a handful of marbles on the floor.',
        },
        {
          id: 'moon-mission-1-q3',
          type: 'prediction',
          prompt: 'What do you predict Zara and Poppy will do next?',
          choices: [
            'Go to the nearby crater to find out what the sensors detected',
            'Go back to sleep',
            'Fly home to Earth right away',
            'Ignore the message and keep hopping',
          ],
          answer: 0,
          evidence: 'We need you to investigate.',
          hint: 'Reread the message from Commander Reyes at the end of the chapter.',
        },
        {
          id: 'moon-mission-1-q4',
          type: 'evidence',
          open: true,
          prompt: 'Describe two ways the Moon is different from Earth. Support your answer with facts from the text.',
          keywords: [
            ['gravity', 'hop', 'hops', 'jump', 'float', 'floating', 'sixth', 'weaker'],
            ['air', 'black', 'sky', 'radio', 'wind', 'rain', 'footprint'],
          ],
          evidence: [
            "The Moon's gravity is only about one sixth as strong as Earth's, so every step became a giant, floating hop.",
            'Even though the Sun was shining, the sky was completely black, because there is no air to scatter the sunlight and make it look blue.',
            '"Without wind or rain, this footprint could last for millions of years," she said.',
          ],
          sample: 'The Moon has weaker gravity, so "every step became a giant, floating hop." It also has no air, so the sky looks black even when the Sun is shining.',
        },
      ],
    },
    {
      id: 'moon-mission-2',
      title: 'Ice in the Shadows',
      scene: '🌑🔦🧊',
      art: ['🚙🌑🔦', '🧊✨🔬', '💧🌱🎉'],
      text: `Zara and Poppy rode the rover to the edge of a deep crater near the Moon's south pole. Sunlight never reaches the bottom of some of these craters, so they are among the coldest places in our solar system. Zara switched on the rover's bright lights and slowly drove down the steep slope.

At the bottom, something sparkled in the beam. Zara used a drill to collect a sample and placed it in the rover's scanner. "Water ice!" she shouted. Scientists had predicted that frozen water might be hidden in these dark craters, and now Zara was seeing it with her own eyes.

Back at the base, Commander Reyes explained why the discovery mattered. "Water is heavy and expensive to launch from Earth," she said. "If we can melt this ice, astronauts can drink it, grow plants with it, and even split it apart to make oxygen to breathe." Poppy did a happy hop. "I think this is the most exciting discovery ever!" Zara laughed. "Then let's go find out what else the Moon is hiding."`,
      vocab: [
        { word: 'crater', definition: 'A large, bowl shaped hole in the ground, often made when a space rock crashes into it.', example: 'The Moon is covered with craters of all sizes.' },
        { word: 'sample', definition: 'A small piece of something that scientists collect to study.', example: 'The doctor took a sample to test in the lab.' },
        { word: 'discovery', definition: 'Something found or learned for the first time.', example: 'Finding the dinosaur bone was an amazing discovery.' },
      ],
      drawIdeas: 'the rover driving into the dark crater, sparkling ice in the rover\'s lights, or astronauts using the water to grow plants',
      questions: [
        {
          id: 'moon-mission-2-q1',
          type: 'details',
          prompt: 'According to Commander Reyes, which is one way astronauts could use the ice?',
          choices: [
            'To build a snowman',
            'To make oxygen to breathe',
            'To fuel the rover\'s lights',
            'To cool down the Sun',
          ],
          answer: 1,
          evidence: '"If we can melt this ice, astronauts can drink it, grow plants with it, and even split it apart to make oxygen to breathe."',
          hint: 'Find the list of uses Commander Reyes gives in the last paragraph.',
        },
        {
          id: 'moon-mission-2-q2',
          type: 'inference',
          prompt: 'Why did Zara need to switch on the rover\'s bright lights?',
          choices: [
            'The bottom of the crater never gets sunlight, so it is very dark',
            'She wanted to signal Earth',
            'The rover\'s lights keep it warm',
            'Poppy asked for a light show',
          ],
          answer: 0,
          evidence: 'Sunlight never reaches the bottom of some of these craters, so they are among the coldest places in our solar system.',
          hint: 'Reread what the text says about sunlight in these craters.',
        },
        {
          id: 'moon-mission-2-q3',
          type: 'factOpinion',
          prompt: 'Is this a fact or an opinion? "I think this is the most exciting discovery ever!"',
          choices: ['Fact', 'Opinion'],
          answer: 1,
          hint: 'Look for clue words like "I think" and "most exciting."',
          explain: '"I think" and "most exciting" show Poppy\'s feelings. Not everyone has to agree, so it is an opinion.',
        },
        {
          id: 'moon-mission-2-q4',
          type: 'evidence',
          open: true,
          prompt: 'Why was finding water ice on the Moon such an important discovery? Use evidence from the text.',
          keywords: [
            ['heavy', 'expensive', 'launch', 'earth', 'bring', 'carry'],
            ['drink', 'plants', 'grow', 'oxygen', 'breathe', 'astronauts'],
          ],
          evidence: [
            '"Water is heavy and expensive to launch from Earth," she said.',
            '"If we can melt this ice, astronauts can drink it, grow plants with it, and even split it apart to make oxygen to breathe."',
          ],
          sample: 'Water is "heavy and expensive to launch from Earth," so finding it on the Moon helps. Astronauts could drink it, grow plants, and make oxygen.',
        },
      ],
    },
  ],
}
