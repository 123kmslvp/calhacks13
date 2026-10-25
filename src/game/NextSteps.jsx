import Poppy from '../components/Poppy.jsx'
import SpeakButton from '../components/SpeakButton.jsx'
import { STORIES, isWorldUnlocked, worldOf } from '../data/stories/index.js'
import { POPPY_ITEMS, isItemUnlocked, poppyGrowth } from '../data/progress.js'
import { recommendStory } from './AdventureMap.jsx'

// After a chapter: one clear next step, plus a few fun extras.
export default function NextSteps({ student, story, chapter, onAction }) {
  const index = story.chapters.findIndex((c) => c.id === chapter.id)
  const nextChapter = story.chapters[index + 1]
  const recommended = recommendStory(student).story
  const nextStory =
    recommended && recommended.id !== story.id
      ? recommended
      : STORIES.find((s) => s.id !== story.id && isWorldUnlocked(worldOf(s), student.points))
  const growth = poppyGrowth(student.points)
  const item = POPPY_ITEMS.find((i) => i.id === student.poppyItem && isItemUnlocked(i.id, student.points))
  const message = 'What next?'

  return (
    <section className="next-steps" aria-label="What's next">
      <div className="bubble">
        <Poppy size="small" stage={growth.stage} item={item} />
        <p className="message">{message}</p>
        <SpeakButton text={message} />
      </div>

      {nextChapter ? (
        <button type="button" className="next-card primary" onClick={() => onAction('chapter', nextChapter)}>
          <strong>Next chapter</strong>
        </button>
      ) : (
        nextStory && (
          <button type="button" className="next-card primary" onClick={() => onAction('story', nextStory)}>
            <span className="next-icon" aria-hidden="true">{nextStory.cover}</span>
            <strong>New story</strong>
          </button>
        )
      )}

      <div className="next-grid">
        <button type="button" className="next-card arcade-card" onClick={() => onAction('arcade')}>
          <span className="next-icon" aria-hidden="true">🎮</span>
          <strong>Games</strong>
        </button>
        <button type="button" className="next-card" onClick={() => onAction('draw')}>
          <span className="next-icon" aria-hidden="true">🎨</span>
          <strong>Draw</strong>
        </button>
        <button type="button" className="next-card" onClick={() => onAction('write')}>
          <span className="next-icon" aria-hidden="true">✍️</span>
          <strong>Write</strong>
        </button>
      </div>

      <div className="step-nav">
        <span />
        <button type="button" className="back" onClick={() => onAction('home')}>
          Home
        </button>
      </div>
    </section>
  )
}
