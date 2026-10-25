// Stories for the read-aloud game. Written for grades 3–5: short sentences,
// no numerals (so speech recognition can match every word), and a few
// computer-thinking vocabulary words per chapter.

export const STORIES = [
  {
    id: 'lost-loop',
    title: 'Poppy and the Lost Loop',
    chapters: [
      {
        id: 'lost-loop-1',
        title: 'The Missing Pattern',
        scene: '🔔🏰🍿',
        vocab: ['pattern', 'clue', 'strange'],
        drawIdeas: 'the bell tower, the tiny gear rolling down the steps, or Poppy listening to the bells',
        text: `In the Kernel Kingdom, every morning started with a song. The corn bells rang ding, dong, ding, dong, all across the town.

But one morning, Poppy heard something strange. The bells rang ding, dong, dong, ding! Poppy stopped and listened again. The pattern was broken!

Poppy looked up at the tall bell tower. A tiny gear was rolling down the steps. "That is our first clue," Poppy said. "Someone mixed up the bells. I will fix the pattern before the sun goes down."`,
      },
      {
        id: 'lost-loop-2',
        title: 'Steps in Order',
        scene: '📜🪜🔔',
        vocab: ['sequence', 'order', 'steps'],
        drawIdeas: 'Poppy at the top of the tower, the torn-up note, or the first bell ringing',
        text: `Poppy climbed the bell tower to look for more clues. At the top, Poppy found a note from the Bell Keeper. It said, "First wind the gear. Next pull the rope. Last ring the bell."

But the steps on the note were in the wrong sequence! Someone had cut the paper and put the pieces back in a silly order.

Poppy laid the pieces on the floor. "First, next, last," Poppy said slowly. Poppy moved each piece until the steps were in order. Then Poppy tried them one by one, and the first bell rang just right.`,
      },
      {
        id: 'lost-loop-3',
        title: 'Fixing the Loop',
        scene: '🔁🐛🎉',
        vocab: ['loop', 'repeat', 'debugging'],
        drawIdeas: 'Poppy finding the bug, the gear stuck in the bell, or the whole town cheering',
        text: `Now Poppy needed every bell to ring the same song again and again. "This is a loop," Poppy said. "A loop will repeat the same steps."

Poppy rang ding, dong, and then started over. Ding, dong, ding, dong! But on the third time, a bell went clunk. There was a bug in the loop!

Poppy looked closely and found the tiny gear from the stairs stuck in the bell. Poppy pulled it out and tried again. Ding, dong, ding, dong, all the way through. The whole town cheered. Fixing a bug like that is called debugging!`,
      },
    ],
  },
]

export const ALL_CHAPTERS = STORIES.flatMap((story) =>
  story.chapters.map((chapter, index) => ({ ...chapter, story, number: index + 1 }))
)
