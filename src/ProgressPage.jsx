import Poppy from './components/Poppy.jsx'
import SpeakButton from './components/SpeakButton.jsx'
import { COMPREHENSION } from './data/roster.js'
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

export default function ProgressPage({ student, onBack, onSelectItem }) {
  const { reading, points } = student
  const growth = poppyGrowth(points)
  const { stage, next, toNext } = growth
  const time = readingTime(reading)
  const messages = encouragements(student)
  const item = POPPY_ITEMS.find((i) => i.id === student.poppyItem && isItemUnlocked(i.id, points))
  const mastered = reading.words.filter((w) => w.mastered).length
  const drawings = loadDrawings(student.id)

  const growthText = next
    ? `${toNext} more Pop Points until Poppy becomes a ${next.name}!`
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
        <section className="poppy-hero" aria-labelledby="poppy-heading">
          <Poppy size="xl" stage={stage} item={item} />
          <div className="poppy-hero-text">
            <h2 className="heading" id="poppy-heading">
              Poppy is a {stage.name}!
            </h2>
            <p className="poppy-about">{stage.about}</p>
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
              {next?.item && <> It unlocks a {next.item.icon} {next.item.label.toLowerCase()}.</>}
            </p>
          </div>
        </section>

        <ol className="stage-path" aria-label="Poppy's growth stages">
          {POPPY_STAGES.map((s, i) => {
            const state = i < growth.index ? 'done' : i === growth.index ? 'current' : 'locked'
            return (
              <li key={s.id} className={`stage-step ${state}`}>
                <span className="stage-dot" aria-hidden="true">
                  {state === 'locked' ? '🔒' : state === 'done' ? '✓' : '⭐'}
                </span>
                <span className="stage-name">{s.name}</span>
                <span className="stage-min">{s.min} pts</span>
              </li>
            )
          })}
        </ol>

        <section className="why-points" aria-labelledby="why-heading">
          <div className="section-head">
            <h2 className="heading" id="why-heading">Why collect Pop Points?</h2>
            <SpeakButton text="Pop Points are Poppy's energy! Every story you read and every question you answer warms Poppy up until Poppy grows. Each new stage unlocks something fun to dress Poppy up with. Your points never go away, so Poppy only ever grows!" />
          </div>
          <p className="note">
            Pop Points are Poppy's energy! Reading warms Poppy up until — <strong>POP!</strong> —
            Poppy grows. Each new stage unlocks something to dress Poppy up. Your points never go
            away, so Poppy only ever grows.
          </p>
          <ul className="earn-list">
            {POINT_RULES.map((r) => (
              <li key={r.label}>
                <span aria-hidden="true">{r.icon}</span>
                <span>{r.label}</span>
                <strong>+{r.points}</strong>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="dress-heading">
          <h2 className="heading" id="dress-heading">Dress up Poppy</h2>
          <div className="dress-grid">
            <button
              type="button"
              className={!item ? 'dress-item selected' : 'dress-item'}
              aria-pressed={!item}
              onClick={() => onSelectItem(null)}
            >
              <span className="dress-icon" aria-hidden="true">🍿</span>
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
                  <span className="dress-icon" aria-hidden="true">{unlocked ? i.icon : '🔒'}</span>
                  {unlocked ? i.label : `${i.min} pts`}
                </button>
              )
            })}
          </div>
        </section>

        <section className="cheer" aria-labelledby="cheer-heading">
          <div className="section-head">
            <h2 className="heading" id="cheer-heading">Poppy says…</h2>
            <SpeakButton text={messages.join(' ')} />
          </div>
          <ul className="cheer-list">
            {messages.map((m) => (
              <li key={m}>🎉 {m}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="stats-heading">
          <h2 className="heading" id="stats-heading">What I've done</h2>
          <div className="stat-tiles">
            <div className="stat-tile">
              <span className="stat-icon" aria-hidden="true">📚</span>
              <span className="stat-value">{reading.storiesCompleted}</span>
              <span className="stat-label">
                {reading.storiesCompleted === 1 ? 'Story completed' : 'Stories completed'}
              </span>
            </div>
            <div className="stat-tile">
              <span className="stat-icon" aria-hidden="true">⏱️</span>
              <span className="stat-value">
                {time.minutesToday}
                <small> min</small>
              </span>
              <span className="stat-label">Reading today</span>
              <span className="stat-sub">{time.minutesWeek} min this week</span>
            </div>
            <div className="stat-tile">
              <span className="stat-icon" aria-hidden="true">⭐</span>
              <span className="stat-value">{points}</span>
              <span className="stat-label">Pop Points earned</span>
            </div>
            <div className="stat-tile">
              <span className="stat-icon" aria-hidden="true">🔤</span>
              <span className="stat-value">{reading.words.length}</span>
              <span className="stat-label">Words practiced</span>
              <span className="stat-sub">{mastered} mastered</span>
            </div>
          </div>

          {reading.words.length > 0 && (
            <ul className="word-chips" aria-label="Words I practiced">
              {reading.words.map((w) => (
                <li key={w.word} className={w.mastered ? 'word mastered' : 'word'}>
                  {w.mastered && <span aria-label="mastered">✓ </span>}
                  {w.word}
                </li>
              ))}
            </ul>
          )}

          {(reading.trickyWords ?? []).length > 0 && (
            <>
              <h3 className="heading small tricky-heading">🛟 Tricky words I'm rescuing</h3>
              <ul className="word-chips" aria-label="Tricky words">
                {reading.trickyWords.map((w) => (
                  <li key={w.word} className={w.rescuedOn ? 'word mastered' : 'word'}>
                    {w.rescuedOn && <span aria-label="rescued">🛟 </span>}
                    {w.display}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        {drawings.length > 0 && (
          <section aria-labelledby="gallery-heading">
            <h2 className="heading" id="gallery-heading">My drawings 🎨</h2>
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

        <section aria-labelledby="comp-heading">
          <h2 className="heading" id="comp-heading">Understanding stories</h2>
          <ul className="comp-list">
            {COMPREHENSION.map((c) => {
              const score = reading.comprehension[c.id]
              const level = comprehensionLevel(score)
              return (
                <li key={c.id}>
                  <div className="comp-row">
                    <span>
                      <strong>{c.label}</strong>
                      <span className="comp-hint">{c.hint}</span>
                    </span>
                    <span className="comp-level">
                      <span aria-hidden="true">{'★'.repeat(level.stars)}{'☆'.repeat(3 - level.stars)} </span>
                      {level.label}
                    </span>
                  </div>
                  <div
                    className="comp-meter"
                    role="progressbar"
                    aria-label={c.label}
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
      </section>
    </main>
  )
}
