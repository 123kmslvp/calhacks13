export default {
  id: 'wheelchair-hoops',
  world: 'realworld',
  title: 'Sam Joins the Team',
  genre: 'Real-world',
  grade: 4,
  difficulty: 'Medium',
  minutes: 5,
  cover: '♿🏀🌟',
  summary: 'Sam Okoye joins a wheelchair basketball team for the first time. With practice, patience, and great teammates, Sam learns that teamwork can be as exciting as scoring.',
  writingPrompt: 'Think of something new you tried that felt hard at first. What happened, how did you feel, and who helped you keep going?',
  chapters: [
    {
      id: 'wheelchair-hoops-1',
      title: 'The First Practice',
      scene: '♿🏀🏟️',
      art: ['🏟️♿😬', '👩‍🦽🏀👏', '🏀😳💪'],
      text: `Sam Okoye rolled into the gym and felt a flutter, or quick shaky feeling, in his stomach. Today was his first practice with the Riverside Rollers, a wheelchair basketball team. His new sports chair sat low, and its big wheels tilted inward. It felt strange, but also exciting.

Coach Dana rolled over with a wide smile. She used a wheelchair too. "Rule one," she said. "You may push twice. Then you must dribble, pass, or shoot." To dribble is to bounce the ball again and again. Sam pushed, pushed, and bounced the ball. It rolled away. His teammates cheered anyway, because everyone on the team had once been new.

Then Sam tried a shot. The ball bounced off the rim, the metal ring of the hoop. He tried again and missed again. His cheeks felt hot. "Every player misses," Coach Dana told him. "Keep your eyes on the hoop." Sam took a deep breath. He was not ready to quit.`,
      vocab: [
        { word: 'flutter', definition: 'A quick, light, shaky feeling or movement.', example: 'I felt a flutter of nerves before my piano show.' },
        { word: 'dribble', definition: 'To bounce a ball again and again while moving.', example: 'She learned to dribble the ball with her left hand.' },
        { word: 'rim', definition: 'The metal ring of a basketball hoop.', example: 'The ball spun around the rim before it dropped in.' },
      ],
      drawIdeas: 'Sam rolling into the gym, Coach Dana explaining the push twice rule, or Sam aiming a shot at the hoop',
      questions: [
        {
          id: 'wheelchair-hoops-1-q1',
          type: 'mainIdea',
          prompt: 'What is this chapter mostly about?',
          choices: [
            'Sam wins a big game on his first day',
            'Sam wants to leave the team after one practice',
            'Sam starts learning wheelchair basketball and keeps trying',
            'Sam teaches the coach how to dribble a ball',
          ],
          answer: 2,
          evidence: 'Today was his first practice with the Riverside Rollers, a wheelchair basketball team.',
          hint: 'Think about what Sam does at his first practice and what he does when his shots miss.',
        },
        {
          id: 'wheelchair-hoops-1-q2',
          type: 'vocabulary',
          prompt: 'The story says Sam felt "a flutter" in his stomach. What does flutter mean here?',
          choices: ['A quick, shaky feeling of nerves', 'A sharp pain', 'A loud rumble of hunger', 'A feeling of being sleepy'],
          answer: 0,
          evidence: 'Sam Okoye rolled into the gym and felt a flutter, or quick shaky feeling, in his stomach.',
          hint: 'Look at the first sentence. The words between the commas explain flutter.',
        },
        {
          id: 'wheelchair-hoops-1-q3',
          type: 'inference',
          prompt: 'The ball rolled away, but Sam\'s teammates cheered anyway. Why did they cheer?',
          choices: [
            'They did not see what happened',
            'They thought he had scored a basket',
            'They were making fun of him',
            'They knew what it felt like to be new',
          ],
          answer: 3,
          evidence: 'His teammates cheered anyway, because everyone on the team had once been new.',
          hint: 'Look at the second paragraph. The word because points to the reason.',
        },
        {
          id: 'wheelchair-hoops-1-q4',
          type: 'evidence',
          open: true,
          prompt: 'What did Sam do after he missed his shots? Name two things. Use details from the story.',
          keywords: [
            ['missed', 'miss', 'shot', 'tried', 'again', 'rim'],
            ['quit', 'breath', 'keep', 'determined', 'hoop', 'not ready'],
          ],
          evidence: [
            'He tried again and missed again.',
            'Sam took a deep breath.',
            'He was not ready to quit.',
          ],
          sample: 'Sam tried again and took a deep breath. The story says, "He was not ready to quit."',
        },
      ],
    },
    {
      id: 'wheelchair-hoops-2',
      title: 'The First Game',
      scene: '🏀🤝🏆',
      art: ['🧡🔄♿', '🏟️🏀🤝', '🏀🎉🌟'],
      text: `All week, Sam practiced after school. He learned to push hard, then tuck in his arms to spin his chair around the cones. Coach Dana taught the team to be patient, which means to wait calmly and not rush. "Do not rush a shot," she said. "Look for an open teammate first."

On Saturday, the Rollers played their first game. Early on, Sam spotted, or saw, Marcus alone near the hoop. Sam pushed twice, then fired a fast pass. Marcus caught it and scored! That pass was an assist, a pass that helps a teammate score. Sam grinned from ear to ear. He had helped his team without scoring himself.

In the final minutes, Rosa passed the ball to Sam. He remembered to stay patient. He pushed twice, dribbled, aimed, and shot. Swish! The ball dropped through the net, and his teammates roared. Sam knew the best part was not only the basket. It was playing together.`,
      vocab: [
        { word: 'patient', definition: 'Able to wait calmly without rushing.', example: 'Be patient while the cookies finish baking.' },
        { word: 'assist', definition: 'A pass that helps a teammate score.', example: 'Her assist let her friend make the winning basket.' },
        { word: 'spotted', definition: 'Noticed or saw something.', example: 'We spotted a deer at the edge of the woods.' },
      ],
      drawIdeas: 'Sam spinning around the cones, Sam passing to Marcus, or the ball dropping through the net',
      questions: [
        {
          id: 'wheelchair-hoops-2-q1',
          type: 'details',
          prompt: 'Sam spotted Marcus alone near the hoop. What did Sam do next to help Marcus score?',
          choices: ['He blocked the other team', 'He made a fast pass', 'He took the ball and shot', 'He asked the coach for a break'],
          answer: 1,
          evidence: 'Sam pushed twice, then fired a fast pass.',
          hint: 'Look at the second paragraph. What happens right after Sam sees Marcus?',
        },
        {
          id: 'wheelchair-hoops-2-q2',
          type: 'vocabulary',
          prompt: 'The story says that pass was an "assist." What is an assist?',
          choices: ['A shot that misses the hoop', 'A rule about pushing the chair', 'A pass that helps a teammate score', 'A time out called by the coach'],
          answer: 2,
          evidence: 'That pass was an assist, a pass that helps a teammate score.',
          hint: 'Read the words after the comma in the sentence that uses assist.',
        },
        {
          id: 'wheelchair-hoops-2-q3',
          type: 'mainIdea',
          prompt: 'Which sentence tells the main idea of this chapter?',
          choices: [
            'Sam learns to be patient and play as a team, and it pays off',
            'Sam wins the game all by himself',
            'Sam learns that cones are hard to spin around',
            'Sam stops practicing after the first game',
          ],
          answer: 0,
          evidence: 'Sam knew the best part was not only the basket.',
          hint: 'Think about the lesson from Coach Dana in the first paragraph and how the game ends in the last paragraph.',
        },
        {
          id: 'wheelchair-hoops-2-q4',
          type: 'evidence',
          open: true,
          prompt: 'What did Sam do in the game that shows he learned Coach Dana\'s lesson about patience? Use evidence from the story.',
          keywords: [
            ['patient', 'patience', 'wait', 'rush', 'remembered', 'passed', 'pass'],
            ['teammate', 'Marcus', 'basket', 'shot', 'scored', 'assist', 'together'],
          ],
          evidence: [
            'Look for an open teammate first.',
            'Sam spotted, or saw, Marcus alone near the hoop.',
            'He remembered to stay patient.',
          ],
          sample: 'Sam looked for an open teammate and passed to Marcus. Later, "He remembered to stay patient," and then he made his shot.',
        },
      ],
    },
  ],
}
