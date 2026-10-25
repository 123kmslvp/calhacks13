import { useState } from 'react'
import Poppy from './components/Poppy.jsx'
import { Art, Icon } from './components/Art.jsx'
import SpeakButton from './components/SpeakButton.jsx'
import { SKILLS } from './data/roster.js'
import { BADGES } from './data/badges.js'
import { loadDrawings } from './data/drawings.js'
import {
  POINT_RULES,
  POPPY_ITEMS,
  POPPY_STAGES,
  comprehensionLevel,
  encouragements,
  isItemUnlocked,
  poppyGrowth,
  readingTime,
} from './data/progress.js'

const TABS = [
  { id: 'poppy', icon: <Poppy size="chip" />, label: 'Poppy' },
  { id: 'badges', icon: '🏅', label: 'Badges' },
  { id: 'art', icon: '🎨', label: 'Drawings' },
  { id: 'skills', icon: '📈', label: 'Skills' },
]

export default function ProgressPage({ student, onBack, onSelectItem, onRead, onArcade }) {
  const { reading, points } = student
  const [tab, setTab] = useState('poppy')
  const growth = poppyGrowth(points)
  const { stage, next, toNext } = growth
  const time = readingTime(reading)
  const messages = encouragements(student).slice(0, 2)
  const item = POPPY_ITEMS.find((i) => i.id === student.poppyItem && isItemUnlocked(i.id, points))
  const mastered = reading.words.filter((w) => w.mastered).length
  const drawings = loadDrawings(student.id)

  const growthText = next
    ? `${toNext} more Pop ${toNext === 1 ? 'Point' : 'Points'} until Poppy becomes a ${next.name}!`
    : 'Poppy is fully grown. You did it!'

  return (
    <main className="welcome">
      <span className="blob blob-1" />
      <span className="blob blob-2" />
      <span className="blob blob-3" />

      <section className="card card-progress">
        <div className="progress-top">
          <button type="button" className="back" onClick={onBack}>
            ← Back
          </button>
          <h1 className="heading">My Progress</h1>
          <span className="points" aria-label={`${points} Pop Points`}>
            ⭐ {points}
          </span>
        </div>

        {/* Poppy's growth: the reason Pop Points matter */}
        <div className="progress-tabs" role="tablist" aria-label="My progress">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={tab === t.id ? 'progress-tab active' : 'progress-tab'}
              onClick={() => setTab(t.id)}
            >
              <span className="progress-tab-icon" aria-hidden="true">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'poppy' && (
          <>
        <section className="poppy-hero" aria-labelledby="poppy-heading">
          <Poppy size="xl" stage={stage} item={item} />
          <div className="poppy-hero-text">
            <h2 className="heading" id="poppy-heading">
              Poppy is a {stage.name}!
            </h2>
            <div
              className="grow-meter"
              role="progressbar"
              aria-label="Poppy's growth to the next stage"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(growth.progress * 100)}
            >
              <span style={{ width: `${Math.max(growth.progress * 100, 4)}%` }} />
            </div>
            <p className="grow-text">
              {growthText}
            </p>
          </div>
        </section>

        <ol className="stage-path" aria-label="Poppy's growth stages">
          {POPPY_STAGES.map((s, i) => {
            const state = i < growth.index ? 'done' : i === growth.index ? 'current' : 'locked'
            return (
              <li key={s.id} className={`stage-step ${state}`}>
                <span className="stage-dot" aria-hidden="true">
                  {state === 'locked' ? <Art name="egg" /> : state === 'done' ? <Art name="popcorn" /> : <Poppy size="chip" />}
                </span>
                <span className="stage-name">{s.name}</span>
                <span className="stage-min">{s.min} pts</span>
              </li>
            )
          })}
        </ol>

        <section aria-labelledby="dress-heading">
          <h2 className="heading" id="dress-heading">Dress up Poppy</h2>
          <div className="dress-grid">
            <button
              type="button"
              className={!item ? 'dress-item selected' : 'dress-item'}
              aria-pressed={!item}
              onClick={() => onSelectItem(null)}
            >
              <span className="dress-icon" aria-hidden="true"><Poppy size="thumb" /></span>
              Just Poppy
            </button>
            {POPPY_ITEMS.map((i) => {
              const unlocked = points >= i.min
              const selected = item?.id === i.id
              return (
                <button
                  key={i.id}
                  type="button"
                  className={`dress-item${selected ? ' selected' : ''}${unlocked ? '' : ' locked'}`}
                  aria-pressed={selected}
                  disabled={!unlocked}
                  onClick={() => onSelectItem(i.id)}
                >
                  <span className="dress-icon" aria-hidden="true"><Poppy size="thumb" item={i} /></span>
                  {unlocked ? i.label : `${i.min} pts`}
                </button>
              )
            })}
          </div>
        </section>

        <section className="cheer" aria-labelledby="cheer-heading">
          <div className="section-head">
            <h2 className="heading" id="cheer-heading">Poppy says</h2>
            <SpeakButton text={messages.join(' ')} />
          </div>
          <ul className="cheer-list">
            {messages.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </section>

          </>
        )}
        {tab === 'badges' && (
          <>
        <section aria-labelledby="badges-heading">
          <h2 className="heading" id="badges-heading">
            My badges <span className="count-chip">{(student.badges ?? []).length} of {BADGES.length}</span>
          </h2>
          <ul className="badge-list">
            {BADGES.map((b) => {
              const have = (student.badges ?? []).some((x) => x.id === b.id)
              return (
                <li key={b.id} className={have ? 'badge-card' : 'badge-card locked'}>
                  <span className="badge-icon" aria-hidden="true">{have ? <Icon e={b.icon} /> : '🔒'}</span>
                  <strong>{b.name}</strong>
                  {have && <span>{b.about}</span>}
                </li>
              )
            })}
          </ul>
        </section>

          </>
        )}
        {tab === 'art' && (
          <>
        {drawings.length > 0 && (
          <section aria-labelledby="gallery-heading">
            <h2 className="heading" id="gallery-heading">My drawings</h2>
            <ul className="gallery">
              {drawings.map((d) => (
                <li key={d.id}>
                  <figure>
                    <img src={d.dataUrl} alt={`My drawing of ${d.chapterTitle}`} />
                    <figcaption>{d.chapterTitle}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </section>
        )}

        {(student.writings ?? []).length > 0 && (
          <section aria-labelledby="writing-heading">
            <h2 className="heading" id="writing-heading">My writing</h2>
            <ul className="writing-list">
              {student.writings.map((w) => (
                <li key={w.id}>
                  <span className="comp-hint">{w.storyTitle}</span>
                  <p>{w.text}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

          {drawings.length === 0 && (student.writings ?? []).length === 0 && (
            <p className="empty-note">No drawings yet. Finish a chapter, then pick Draw!</p>
          )}
          </>
        )}
        {tab === 'skills' && (
          <>
        <section aria-labelledby="stats-heading">
          <h2 className="heading" id="stats-heading">What I did</h2>
          <div className="stat-tiles">
            <div className="stat-tile">
              <span className="stat-value">{reading.storiesCompleted}</span>
              <span className="stat-label">
                {reading.storiesCompleted === 1 ? 'Story completed' : 'Stories completed'}
              </span>
            </div>
            <div className="stat-tile">
              <span className="stat-value">
                {time.minutesToday}
                <small> min</small>
              </span>
              <span className="stat-label">Reading today</span>
              <span className="stat-sub">{time.minutesWeek} min this week</span>
            </div>
            <div className="stat-tile">
              <span className="stat-value">{points}</span>
              <span className="stat-label">Pop Points earned</span>
            </div>
            <div className="stat-tile">
              <span className="stat-value">{reading.words.length}</span>
              <span className="stat-label">Words practiced</span>
              <span className="stat-sub">{mastered} mastered</span>
            </div>
          </div>

        </section>

        <section aria-labelledby="comp-heading">
          <h2 className="heading" id="comp-heading">My reading skills</h2>
          <ul className="comp-list">
            {[
              { id: 'accuracy', kid: 'Reading words correctly', hint: 'When you read out loud', score: reading.accuracy ?? null },
              ...SKILLS.map((k) => ({ ...k, score: student.skills[k.id] ?? null })),
            ].map((c) => {
              const score = c.score
              const level = comprehensionLevel(score)
              return (
                <li key={c.id}>
                  <div className="comp-row">
                    <span>
                      <strong>{c.kid}</strong>
                      
                    </span>
                    <span className="comp-level">
                      <span aria-hidden="true">{'★'.repeat(level.stars)}{'☆'.repeat(3 - level.stars)} </span>
                      {level.label}
                    </span>
                  </div>
                  <div
                    className="comp-meter"
                    role="progressbar"
                    aria-label={c.kid}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={score ?? 0}
                    aria-valuetext={level.label}
                  >
                    <span style={{ width: `${score ?? 0}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
          </>
        )}
        <div className="home-choices progress-nav">
          <button type="button" className="home-card home-read" onClick={onRead}>
            <span className="home-icon" aria-hidden="true"><Icon e="📚" /></span>
            <strong>Read a story</strong>
          </button>
          <button type="button" className="home-card home-play" onClick={onArcade}>
            <span className="home-icon" aria-hidden="true">🎮</span>
            <strong>Play games</strong>
          </button>
        </div>
      </section>
    </main>
  )
}
