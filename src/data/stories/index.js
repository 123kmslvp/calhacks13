import { DIFFICULTIES, WORLDS } from './worlds.js'

export { WORLDS, DIFFICULTIES }

// Every story file in this folder (except index/worlds) is picked up
// automatically — add a story by adding a file.
const modules = import.meta.glob(['./*.js', '!./index.js', '!./worlds.js'], { eager: true })

const worldOrder = (id) => WORLDS.findIndex((w) => w.id === id)

export const STORIES = Object.values(modules)
  .map((m) => m.default)
  .filter(Boolean)
  .sort(
    (a, b) =>
      worldOrder(a.world) - worldOrder(b.world) ||
      a.grade - b.grade ||
      DIFFICULTIES.indexOf(a.difficulty) - DIFFICULTIES.indexOf(b.difficulty)
  )

export const ALL_CHAPTERS = STORIES.flatMap((story) =>
  story.chapters.map((chapter, index) => ({ ...chapter, story, number: index + 1 }))
)

export const findStory = (id) => STORIES.find((s) => s.id === id)
export const storyOfChapter = (chapterId) => STORIES.find((s) => s.chapters.some((c) => c.id === chapterId))
export const worldOf = (story) => WORLDS.find((w) => w.id === story.world)

export const isWorldUnlocked = (world, points) => !world.unlockAt || points >= world.unlockAt

// A rough "how hard" number for recommending a harder or gentler story.
export const storyLevel = (story) => story.grade * 3 + DIFFICULTIES.indexOf(story.difficulty)
