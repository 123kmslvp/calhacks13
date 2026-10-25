export default {
  id: 'community-garden',
  world: 'realworld',
  title: 'The Garden on Maple Street',
  genre: 'Real-world',
  grade: 5,
  difficulty: 'Challenge',
  minutes: 6,
  cover: '🌻🥕🏘️',
  summary: 'Jamal and Priya want to turn an empty lot full of trash into a garden, but first they have to solve a disagreement that could split the whole project.',
  writingPrompt: 'If your neighborhood had an empty lot, what would you turn it into? Write a plan and explain how you would get your neighbors to help.',
  chapters: [
    {
      id: 'community-garden-1',
      title: 'The Empty Lot',
      scene: '🏚️🚮🌱',
      art: ['🏚️🛒🌾', '📚🧓🌱', '🧤🗑️🌇'],
      text: `For as long as Jamal could remember, the lot on Maple Street had been empty. Broken bottles glittered in the weeds, and a rusty shopping cart leaned against the fence. The lot looked messy, so most neighbors walked past without even looking. But one Saturday, Jamal and his friend Priya stopped at the gate. "What if this place could grow something besides weeds?" Priya asked.

They brought their idea to a neighborhood meeting at the library. Grandpa Chen had grown vegetables in his village as a boy, and he offered to teach them. Abuela Rosa promised seeds from her own garden. The city agreed to let them use the lot if they cleaned it up first.

The next weekend, twenty volunteers arrived with gloves, rakes, and trash bags. Volunteers are people who choose to help without being paid. They hauled, or carried off, the shopping cart and filled thirty bags with garbage. By sunset, the lot was bare dirt, but it no longer looked forgotten, as if nobody cared about it. Jamal grinned. "Now comes the hard part," he said. "Deciding what to plant. Everyone has a different idea."`,
      vocab: [
        { word: 'volunteers', definition: 'People who choose to help without being paid.', example: 'Volunteers served lunch at the shelter on Sunday.' },
        { word: 'hauled', definition: 'Pulled or carried something heavy.', example: 'We hauled the heavy cooler down to the beach.' },
        { word: 'forgotten', definition: 'No longer remembered or cared for.', example: 'I found a forgotten toy under my bed.' },
      ],
      drawIdeas: 'the empty lot full of weeds, the volunteers cleaning up with rakes and bags, or the neighborhood meeting at the library',
      questions: [
        {
          id: 'community-garden-1-q1',
          type: 'mainIdea',
          prompt: 'What is the main idea of this chapter?',
          choices: [
            'Jamal and Priya fix up a rusty shopping cart',
            'Neighbors work together to clean up an empty lot for a garden',
            'Grandpa Chen teaches a class about his village',
            'The library holds a big book sale for the street',
          ],
          answer: 1,
          evidence: 'The next weekend, twenty volunteers arrived with gloves, rakes, and trash bags.',
          hint: 'Think about how the lot changed from the beginning of the chapter to the end, and who helped.',
        },
        {
          id: 'community-garden-1-q2',
          type: 'inference',
          prompt: 'Why did most neighbors walk past the lot "without even looking"?',
          choices: [
            'The lot looked messy, so they did not want to look at it',
            'They were not allowed to look at the lot',
            'The lot was too far away for them to see',
            'The lot was already full of beautiful flowers',
          ],
          answer: 0,
          evidence: 'The lot looked messy, so most neighbors walked past without even looking.',
          hint: 'Look at the sentence right after the broken bottles and the rusty cart. What does it say about the lot?',
        },
        {
          id: 'community-garden-1-q3',
          type: 'prediction',
          prompt: 'Jamal says the hard part is "Deciding what to plant. Everyone has a different idea." What do you predict will happen next?',
          choices: [
            'The volunteers will put the garbage back',
            'The city will build a parking lot there',
            'The neighbors will disagree about what to grow',
            'Jamal will move away from Maple Street',
          ],
          answer: 2,
          evidence: 'Everyone has a different idea',
          hint: 'Look at the last two sentences. If everyone has a different idea, what might happen at the next meeting?',
        },
        {
          id: 'community-garden-1-q4',
          type: 'evidence',
          open: true,
          prompt: 'What did Grandpa Chen, Abuela Rosa, and the volunteers each do to help make the garden possible? Use details from the story.',
          keywords: [
            ['grandpa', 'chen', 'teach', 'abuela', 'rosa', 'seeds', 'city', 'agreed'],
            ['volunteers', 'cleaned', 'clean', 'hauled', 'garbage', 'trash', 'bags', 'rakes'],
          ],
          evidence: [
            'Grandpa Chen had grown vegetables in his village as a boy, and he offered to teach them.',
            'Abuela Rosa promised seeds from her own garden.',
            'They hauled, or carried off, the shopping cart and filled thirty bags with garbage.',
          ],
          sample: 'Many people helped in different ways. Grandpa Chen "offered to teach them," Abuela Rosa promised seeds, and volunteers "filled thirty bags with garbage."',
        },
      ],
    },
    {
      id: 'community-garden-2',
      title: 'Two Good Ideas',
      scene: '🌻🥕🐝',
      art: ['🌸🗣️🥕', '🧓✋🤝', '🍅🌻🐝'],
      text: `At the planning meeting, a disagreement, or clash of ideas, sprouted faster than any seed. Priya wanted to fill the garden with flowers. "Flowers attract bees and butterflies, and they make people smile," she argued. Jamal shook his head. "We should grow vegetables. Some families on our street cannot always afford fresh food. They do not have enough money to buy it."

Their voices grew louder until Grandpa Chen raised his hand. "You both care about this neighborhood," he said calmly. "Before you decide, try to explain the other person's idea, so you can understand each other." Priya took a breath. "Jamal wants the garden to feed people." Jamal nodded slowly. "And Priya wants it to help pollinators, the bees and butterflies that carry pollen from flower to flower."

Jamal had a thought. "Squash and many other vegetables need bees to help them grow," he said. "Flowers could bring bees to our garden!" They agreed to plant rows of vegetables with flowers along the edges. By August, the garden overflowed with tomatoes, squash, sunflowers, and buzzing bees. Priya smiled. "This is the most beautiful place in the whole city."`,
      vocab: [
        { word: 'disagreement', definition: 'When people have different ideas or do not agree.', example: 'We had a disagreement about which game to play first.' },
        { word: 'afford', definition: 'To have enough money to pay for something.', example: 'We saved our allowance so we could afford a new ball.' },
        { word: 'pollinators', definition: 'Animals like bees and butterflies that carry pollen from flower to flower so plants can make fruit and seeds.', example: 'Hummingbirds and bees are pollinators.' },
      ],
      drawIdeas: 'Priya and Jamal sharing their ideas, Grandpa Chen raising his hand, or the finished garden full of vegetables, flowers, and bees',
      questions: [
        {
          id: 'community-garden-2-q1',
          type: 'vocabulary',
          prompt: 'Jamal says some families "cannot always afford fresh food." What does afford mean here?',
          choices: [
            'To cook something in a big pot',
            'To grow something very quickly',
            'To have enough money to pay for something',
            'To share something with a friend',
          ],
          answer: 2,
          evidence: 'They do not have enough money to buy it.',
          hint: 'Look at the sentence right after Jamal says families cannot afford fresh food.',
        },
        {
          id: 'community-garden-2-q2',
          type: 'inference',
          prompt: 'Why did Grandpa Chen ask Priya and Jamal to explain the other person\'s idea?',
          choices: [
            'So they could understand each other',
            'So he could pick the winner',
            'So the meeting would end faster',
            'So they would forget about the garden',
          ],
          answer: 0,
          evidence: '"Before you decide, try to explain the other person\'s idea, so you can understand each other."',
          hint: 'Find what Grandpa Chen says right after "You both care about this neighborhood." The words "so you can" give the reason.',
        },
        {
          id: 'community-garden-2-q3',
          type: 'factOpinion',
          prompt: 'Is this a fact or an opinion? "This is the most beautiful place in the whole city."',
          choices: ['Fact', 'Opinion'],
          answer: 1,
          hint: 'Can "most beautiful" be measured or proven, or is it a feeling?',
          explain: '"Most beautiful" is Priya\'s feeling about the garden. Other people might think a different place is most beautiful, so it is an opinion.',
        },
        {
          id: 'community-garden-2-q4',
          type: 'evidence',
          open: true,
          prompt: 'How did Priya and Jamal solve their disagreement respectfully? Give two things they did. Use details from the story.',
          keywords: [
            ['explain', 'listen', 'listened', 'understand', 'other', 'calm', 'calmly', 'idea'],
            ['both', 'together', 'flowers', 'vegetables', 'edges', 'agreed', 'bees', 'compromise'],
          ],
          evidence: [
            '"Before you decide, try to explain the other person\'s idea, so you can understand each other."',
            'They agreed to plant rows of vegetables with flowers along the edges.',
            '"Jamal wants the garden to feed people."',
          ],
          sample: 'They each explained the other person\'s idea, and then found a way to use both. They "agreed to plant rows of vegetables with flowers along the edges."',
        },
      ],
    },
  ],
}
