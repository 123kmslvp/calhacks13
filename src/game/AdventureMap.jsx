import { useState } from 'react'
import SpeakButton from '../components/SpeakButton.jsx'
import { STORIES, WORLDS, isWorldUnlocked, storyLevel, worldOf } from '../data/stories/index.js'
import { POPPY_STAGES } from '../data/progress.js'

const DIFFICULTY_ICON = { Gentle: '☁️', Medium: '⛰️', Challenge: '🏔️' }
const ordinal = (n) => ({ 1: '1st', 2: '2nd', 3: '3rd' })[n] ?? `${n}th`

export const storyProgress = (student, story) => {
  const stars = student.reading.chapterStars ?? {}
  const done = story.chapters.filter((c) => (stars[c.id] ?? 0) > 0).length
  return { done, total: story.chapters.length, stars: story.chapters.map((c) => stars[c.id] ?? 0) }
}

// A story that fits: keep going with one in progress, otherwise a new one
// near the student's grade.
export function recommendStory(student) {
  const open = STORIES.filter((s) => isWorldUnlocked(worldOf(s), student.points))
  const inProgress = open.find((s) => {
    const p = storyProgress(student, s)
    return p.done > 0 && p.done < p.total
  })
  if (inProgress) return { story: inProgress, reason: 'Keep going!' }
  const fresh = open.filter((s) => storyProgress(student, s).done === 0)
  const target = student.grade * 3 + 1
  const pick = [...fresh].sort((a, b) => Math.abs(storyLevel(a) - target) - Math.abs(storyLevel(b) - target))[0]
  return pick ? { story: pick, reason: 'Picked for you' } : { story: open[0], reason: 'Read it again' }
}

export default function AdventureMap({ student, onPick }) {
  const [worldId, setWorldId] = useState('all')
  const recommended = recommendStory(student)
  const stories = STORIES.filter((s) => worldId === 'all' || s.world === worldId)

  return (
    <section aria-labelledby="map-heading">
      <div className="section-head">
        <h2 className="heading" id="map-heading">
          Pick a story
        </h2>
        <SpeakButton text="Pick a story. Pick a world, then pick a story." />
      </div>

      {recommended.story && (
        <button type="button" className="recommended" onClick={() => onPick(recommended.story)}>
          <span className="rec-cover" aria-hidden="true">{recommended.story.cover}</span>
          <span className="rec-body">
            <span className="tag">For you</span>
            <strong>{recommended.story.title}</strong>
          </span>
          <span className="teaser-go">→</span>
        </button>
      )}

      <div className="world-tabs" role="tablist" aria-label="Story worlds">
        <button
          role="tab"
          type="button"
          aria-selected={worldId === 'all'}
          className={worldId === 'all' ? 'world-tab active' : 'world-tab'}
          onClick={() => setWorldId('all')}
        >
          All
        </button>
        {WORLDS.map((w) => {
          const unlocked = isWorldUnlocked(w, student.points)
          return (
            <button
              key={w.id}
              role="tab"
              type="button"
              aria-selected={worldId === w.id}
              className={`world-tab${worldId === w.id ? ' active' : ''}${unlocked ? '' : ' locked'}`}
              style={{ '--world': w.color, '--tint': w.tint }}
              onClick={() => setWorldId(w.id)}
            >
              {w.name}{unlocked ? '' : ' 🔒'}
            </button>
          )
        })}
      </div>

      <ul className="story-grid">
        {stories.map((story) => {
          const world = worldOf(story)
          const unlocked = isWorldUnlocked(world, student.points)
          const progress = storyProgress(student, story)
          const stage = POPPY_STAGES.find((s) => s.min >= (world.unlockAt ?? 0))
          return (
            <li key={story.id}>
              <button
                type="button"
                className={unlocked ? 'story-card' : 'story-card locked'}
                style={{ '--world': world.color, '--tint': world.tint }}
                disabled={!unlocked}
                onClick={() => onPick(story)}
              >
                <span className="story-cover" aria-hidden="true">
                  {story.cover}
                  {!unlocked && <span className="lock-badge">🔒</span>}
                </span>
                <span className="story-world">{world.name}</span>
                <strong className="story-title">{story.title}</strong>
                <span className="story-meta">
                  <span className="meta-chip">{story.minutes} min</span>
                  <span className="meta-chip">{story.difficulty}</span>
                </span>
                {unlocked ? (
                  <span className="story-progress" aria-label={`${progress.done} of ${progress.total} chapters done`}>
                    {progress.stars.map((st, i) => (
                      <span key={i} className={st ? 'ch-pip done' : 'ch-pip'} aria-hidden="true">
                        {'★'.repeat(st) || '·'}
                      </span>
                    ))}
                    <span className="ch-count">
                      {progress.done === progress.total ? 'Done!' : `${progress.done}/${progress.total}`}
                    </span>
                  </span>
                ) : (
                  <span className="unlock-note">
                    Opens at {world.unlockAt} points
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export function StoryIntro({ student, story, onStart, onBack, onGames }) {
  const progress = storyProgress(student, story)
  const world = worldOf(story)
  const next = story.chapters.find((c) => !(student.reading.chapterStars?.[c.id] > 0)) ?? story.chapters[0]

  return (
    <section className="story-intro" aria-labelledby="story-heading" style={{ '--world': world.color, '--tint': world.tint }}>
      <div className="intro-cover" aria-hidden="true">
        {story.cover}
      </div>
      <span className="story-world">
        {world.name}
      </span>
      <div className="section-head center">
        <h2 className="heading" id="story-heading">
          {story.title}
        </h2>
        <SpeakButton text={`${story.title}. ${story.summary}`} />
      </div>
      <p className="intro-summary">{story.summary}</p>

      <ol className="chapter-list">
        {story.chapters.map((c, i) => (
          <li key={c.id}>
            <button type="button" className="chapter" onClick={() => onStart(c)}>
              <span className="chapter-body">
                <span className="chapter-num">Chapter {i + 1}</span>
                <strong>{c.title}</strong>
              </span>
              <span className="chapter-stars" aria-label={`${progress.stars[i]} of 3 stars`}>
                {c === next && progress.done < progress.total && <span className="tag">Next</span>}
                <span aria-hidden="true">
                  {'★'.repeat(progress.stars[i])}
                  {'☆'.repeat(3 - progress.stars[i])}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>

      <button type="button" className="arcade-teaser" onClick={onGames}>
        <span className="teaser-text">
          <strong>Play games with this story</strong>
        </span>
        <span className="teaser-go">→</span>
      </button>

      <div className="step-nav">
        <button type="button" className="back" onClick={onBack}>
          ← Back
        </button>
        <button type="button" className="start" onClick={() => onStart(next)}>
          {progress.done === 0 ? 'Start' : progress.done < progress.total ? 'Keep reading' : 'Read again'}
        </button>
      </div>
    </section>
  )
}
