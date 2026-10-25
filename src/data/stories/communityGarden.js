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
      text: `For as long as Jamal could remember, the lot on Maple Street had been empty. Broken bottles glittered in the weeds, and a rusty shopping cart leaned against the fence. Most neighbors walked past without even looking. But one Saturday, Jamal and his friend Priya stopped at the gate. "What if this place could grow something besides weeds?" Priya asked.

They brought their idea to a neighborhood meeting at the library. Grandpa Chen, who had grown vegetables in his village as a boy, offered to teach them. Abuela Rosa promised seeds from her own garden. The city agreed to let them use the lot if they cleaned it up first.

The next weekend, more than twenty volunteers arrived with gloves, rakes, and trash bags. They hauled away the shopping cart and filled thirty bags with garbage. By sunset, the lot was bare dirt, but it no longer looked forgotten. Jamal wiped his forehead and grinned. "Now comes the hard part," he said. "Deciding what to plant."`,
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
            'Neighbors work together to clean up an empty lot for a garden',
            'Jamal finds a rusty shopping cart',
            'Grandpa Chen tells stories about his village',
            'The library holds a book sale',
          ],
          answer: 0,
          evidence: 'The next weekend, more than twenty volunteers arrived with gloves, rakes, and trash bags.',
          hint: 'Think about how the lot changed from the beginning of the chapter to the end, and who helped.',
        },
        {
          id: 'community-garden-1-q2',
          type: 'inference',
          prompt: 'Why do you think most neighbors walked past the lot "without even looking"?',
          choices: [
            'It was messy and seemed like nobody cared about it',
            'They were not allowed to look at it',
            'It was too far away to see',
            'It was full of beautiful flowers already',
          ],
          answer: 0,
          evidence: 'Broken bottles glittered in the weeds, and a rusty shopping cart leaned against the fence.',
          hint: 'Reread how the lot is described at the very start. Would it be fun to look at?',
        },
        {
          id: 'community-garden-1-q3',
          type: 'prediction',
          prompt: 'Jamal says the hard part is "Deciding what to plant." What do you predict will happen next?',
          choices: [
            'The neighbors will have different ideas about what to grow',
            'The volunteers will put the garbage back',
            'The city will build a parking lot',
            'Jamal will move away',
          ],
          answer: 0,
          evidence: '"Deciding what to plant."',
          hint: 'Why would Jamal call deciding the "hard part" if everyone already agreed?',
        },
        {
          id: 'community-garden-1-q4',
          type: 'evidence',
          open: true,
          prompt: 'How did the community work together to make the garden possible? Give at least two examples from the text.',
          keywords: [
            ['grandpa', 'chen', 'teach', 'abuela', 'rosa', 'seeds', 'city', 'agreed'],
            ['volunteers', 'cleaned', 'clean', 'hauled', 'garbage', 'trash', 'bags', 'rakes'],
          ],
          evidence: [
            'Grandpa Chen, who had grown vegetables in his village as a boy, offered to teach them.',
            'Abuela Rosa promised seeds from her own garden.',
            'They hauled away the shopping cart and filled thirty bags with garbage.',
          ],
          sample: 'Many people helped in different ways. Grandpa Chen "offered to teach them," Abuela Rosa gave seeds, and volunteers "filled thirty bags with garbage."',
        },
      ],
    },
    {
      id: 'community-garden-2',
      title: 'Two Good Ideas',
      scene: '🌻🥕🐝',
      art: ['🌸🗣️🥕', '🧓✋🤝', '🍅🌻🐝'],
      text: `At the planning meeting, a disagreement sprouted faster than any seed. Priya wanted to fill the garden with flowers. "Flowers attract bees and butterflies, and they make people smile," she argued. Jamal shook his head. "We should grow vegetables. Some families on our street cannot always afford fresh food."

Their voices grew louder until Grandpa Chen raised his hand. "You both care about this neighborhood," he said calmly. "Before you decide, try to explain the other person's idea." Priya took a breath. "Jamal wants the garden to feed people." Jamal nodded slowly. "And Priya wants it to help pollinators and make our street beautiful."

Then Jamal had a thought. "Squash and many other vegetables need bees to help them grow food," he said. "Flowers could bring bees to our garden!" They agreed to plant rows of vegetables with flowers along the edges. By August, the garden overflowed with tomatoes, squash, sunflowers, and buzzing bees. Priya smiled. "This is the most beautiful place in the whole city."`,
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
          prompt: 'Jamal says some families "cannot always afford fresh food." What does afford mean?',
          choices: [
            'To have enough money to pay for something',
            'To cook something',
            'To grow something quickly',
            'To share something with a friend',
          ],
          answer: 0,
          evidence: 'Some families on our street cannot always afford fresh food.',
          hint: 'Think about what families need in order to buy fresh food at a store.',
        },
        {
          id: 'community-garden-2-q2',
          type: 'inference',
          prompt: 'Why did Grandpa Chen ask Priya and Jamal to explain the other person\'s idea?',
          choices: [
            'So they would listen and understand each other',
            'So he could pick the winner',
            'So the meeting would end faster',
            'So they would forget about the garden',
          ],
          answer: 0,
          evidence: '"Before you decide, try to explain the other person\'s idea."',
          hint: 'Their voices were getting louder. What happens when you have to repeat someone else\'s idea in your own words?',
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
          prompt: 'How did Priya and Jamal solve their disagreement respectfully? Use evidence from the text.',
          keywords: [
            ['explain', 'listen', 'listened', 'understand', 'other', 'calm', 'calmly', 'idea'],
            ['both', 'together', 'flowers', 'vegetables', 'edges', 'agreed', 'bees', 'compromise'],
          ],
          evidence: [
            '"Before you decide, try to explain the other person\'s idea."',
            'They agreed to plant rows of vegetables with flowers along the edges.',
            '"Jamal wants the garden to feed people."',
          ],
          sample: 'They each explained the other person\'s idea, and then found a way to use both. They "agreed to plant rows of vegetables with flowers along the edges."',
        },
      ],
    },
  ],
}
