import { useState } from 'react'
import Poppy from '../../components/Poppy.jsx'
import SpeakButton from '../../components/SpeakButton.jsx'
import { STORIES } from '../../data/stories/index.js'
import { applyGame, applyWordPractice } from '../../data/progress.js'
import { tokenizePassage } from '../readAloud.js'
import WordRescue from '../WordRescue.jsx'
import { EvidenceHunt, MissingWord, SequenceGame, VocabPop } from './Games.jsx'
import './arcade.css'

export const GAMES = [
  { id: 'sequence', icon: '🧩', name: 'Story Sequencer', skill: 'Retelling in order', about: 'Put the story events back in the right order.', perChapter: true, Component: SequenceGame },
  { id: 'vocab', icon: '🍿', name: 'Vocab Pop', skill: 'Word meanings', about: 'Match words to their meanings to pop the popcorn!', Component: VocabPop },
  { id: 'evidence', icon: '🔍', name: 'Evidence Detective', skill: 'Finding proof', about: 'Find the sentence in the story that proves each answer.', perChapter: true, Component: EvidenceHunt },
  { id: 'cloze', icon: '✏️', name: 'Missing Word', skill: 'Context clues', about: 'Pick the word that fits in the sentence.', Component: MissingWord },
]

// Story games: new ways to practice with the stories — each one builds a
// different reading skill. Starts with the story the student read last.
// Games only use what the student has actually read: stories with at least
// one finished chapter, and only those finished chapters.
export function readStories(student) {
  const stars = student.reading.chapterStars ?? {}
  return STORIES.map((s) => ({ ...s, chapters: s.chapters.filter((c) => (stars[c.id] ?? 0) > 0) })).filter(
    (s) => s.chapters.length > 0
  )
}

export default function Arcade({ student, initialStoryId, onSaveStudent, onExit, onRead, exitLabel = 'Home' }) {
  const stories = readStories(student)
  const lastStory = initialStoryId ?? student.history?.at(-1)?.storyId
  const [game, setGame] = useState(null)
  const [storyId, setStoryId] = useState(() => (stories.some((s) => s.id === lastStory) ? lastStory : stories[0]?.id))
  const [chapterIndex, setChapterIndex] = useState(0)
  const [playKey, setPlayKey] = useState(0)
  const [result, setResult] = useState(null)
  const story = stories.find((s) => s.id === storyId) ?? stories[0]
  const chapter = story?.chapters[chapterIndex] ?? story?.chapters[0]
  // Tricky words saved from reading aloud, for the Word Rescue game.
  const tricky = (student.reading.trickyWords ?? [])
    .filter((w) => !w.rescuedOn)
    .slice(0, 6)
    .map((w, i) => ({ word: w.word, display: w.display, sentence: i, sentenceText: w.sentenceText || w.display }))

  const finish = ({ correct, total }) => {
    const applied = applyGame(student, { game: game.name, correct, total })
    onSaveStudent(applied.student)
    setResult(applied)
  }

  const replay = () => {
    setResult(null)
    setPlayKey((k) => k + 1)
  }

  return (
    <main className="welcome">
      <span className="blob blob-1" />
      <span className="blob blob-2" />
      <span className="blob blob-3" />
      <section className="card card-game">
        <div className="progress-top">
          <button type="button" className="back" onClick={() => (game ? (setGame(null), setResult(null)) : onExit())}>
            ← {game ? 'All games' : exitLabel}
          </button>
          <span className="game-title">Games</span>
          <span className="points" aria-label={`${student.points} Pop Points`}>⭐ {student.points}</span>
        </div>

        {!story && (
          <>
            <div className="bubble">
              <Poppy size="small" />
              <p className="message">Read a story first to open the games!</p>
              <SpeakButton text="Read a story first to open the games!" />
            </div>
            <div className="game-grid">
              {GAMES.map((g) => (
                <div key={g.id} className={`game-card game-${g.id} locked`} aria-label={`${g.name}, locked`}>
                  <strong>{g.name}</strong>
                  <span className="game-lock" aria-hidden="true">🔒</span>
                </div>
              ))}
            </div>
            <div className="done-actions">
              <button type="button" className="start" onClick={onRead}>
                Read a story
              </button>
            </div>
          </>
        )}

        {story && !game && (
          <>
            <div className="bubble">
              <Poppy size="small" />
              <p className="message">Pick a game!</p>
              <SpeakButton text="Pick a game!" />
            </div>
            <label className="story-pick">
              <span>Story:</span>
              <select
                value={story.id}
                onChange={(e) => {
                  setStoryId(e.target.value)
                  setChapterIndex(0)
                }}
              >
                {STORIES.map((s) => {
                  const read = stories.some((r) => r.id === s.id)
                  return (
                    <option key={s.id} value={s.id} disabled={!read}>
                      {read ? s.title : `🔒 ${s.title}`}
                    </option>
                  )
                })}
              </select>
            </label>
            <div className="game-grid">
              {tricky.length > 0 ? (
                <button type="button" className="game-card game-rescue" onClick={() => setGame({ id: 'rescue', icon: '🛟', name: 'Word Rescue' })}>
                  <strong>Word Rescue</strong>
                </button>
              ) : (
                <div className="game-card game-rescue locked" aria-label="Word Rescue, locked">
                  <strong>Word Rescue</strong>
                  <span>Read aloud to unlock</span>
                  <span className="game-lock" aria-hidden="true">🔒</span>
                </div>
              )}
              {GAMES.map((g) => (
                <button key={g.id} type="button" className={`game-card game-${g.id}`} onClick={() => setGame(g)}>
                  <strong>{g.name}</strong>
                </button>
              ))}
            </div>
          </>
        )}

        {game?.id === 'rescue' && (
          <WordRescue
            tricky={tricky}
            sentences={tricky.map((t) => tokenizePassage(t.sentenceText).words)}
            continueLabel="Back to games →"
            onComplete={({ rescued }) => {
              const applied = applyWordPractice(student, { rescued })
              onSaveStudent(applied.student)
              return applied
            }}
            onContinue={() => setGame(null)}
          />
        )}

        {game && game.id !== 'rescue' && !result && (
          <section aria-labelledby="game-heading">
            <div className="game-head">
              <h2 className="heading" id="game-heading">
                {game.name}
              </h2>
              <span className="note">{story.title}</span>
            </div>
            {game.perChapter && story.chapters.length > 1 && (
              <div className="mode-tabs" role="tablist" aria-label="Chapter">
                {story.chapters.map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={i === chapterIndex}
                    className={i === chapterIndex ? 'mode-tab active' : 'mode-tab'}
                    onClick={() => {
                      setChapterIndex(i)
                      setPlayKey((k) => k + 1)
                    }}
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            )}
            <game.Component key={`${playKey}-${story.id}-${chapterIndex}`} story={story} chapter={chapter} onDone={finish} />
          </section>
        )}

        {result && (
          <section className="done" aria-labelledby="game-done">
            <h2 className="heading" id="game-done">Great job!</h2>
            <ul className="earned">
              {result.earned.map((e) => (
                <li key={e.label}>
                  <span>{e.label}</span>
                  <strong>+{e.points}</strong>
                </li>
              ))}
              <li className="earned-total">
                <span>Pop Points for Poppy</span>
                <strong>+{result.total}</strong>
              </li>
            </ul>
            {result.grewTo && <p className="earned-line">POP! Poppy grew into a {result.grewTo.name}!</p>}
            {result.badges.map((b) => (
              <div key={b.id} className="badge-card new inline">
                <span className="badge-icon" aria-hidden="true">{b.icon}</span>
                <strong>New badge: {b.name}</strong>
              </div>
            ))}
            <div className="done-actions">
              <button type="button" className="t-chip" onClick={replay}>Play again</button>
              <button type="button" className="t-chip" onClick={() => (setGame(null), setResult(null))}>More games</button>
              <button type="button" className="start" onClick={onExit}>Done</button>
            </div>
          </section>
        )}
      </section>
    </main>
  )
}
