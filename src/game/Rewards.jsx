import Poppy from '../components/Poppy.jsx'
import SpeakButton from '../components/SpeakButton.jsx'

const STAR_REASONS = ['Read', 'Answered', 'Explained']

export default function Rewards({ result, session, onContinue }) {
  const { stars, starsBefore, earned, total, badges, grewTo, unlockedWorlds, storyJustFinished, student } = result
  const headline = storyJustFinished ? 'You finished the story!' : 'Great job!'

  return (
    <section className="rewards" aria-labelledby="rewards-heading">
      <h2 className="heading" id="rewards-heading">
        {headline}
      </h2>

      <ul className="reward-stars" aria-label={`${stars} of 3 stars`}>
        {STAR_REASONS.map((reason, i) => (
          <li key={reason} className={i < stars ? 'earned-star' : ''}>
            <span className={i < stars ? 'star on' : 'star'} style={{ animationDelay: `${i * 0.3}s` }} aria-hidden="true">
              ★
            </span>
            <span className="star-reason">{reason}</span>
            {i < stars && i >= starsBefore && <span className="new-chip">NEW</span>}
          </li>
        ))}
      </ul>

      <p className="earned-big">+{total} points</p>

      {grewTo && (
        <div className="grew" role="status">
          <Poppy size="small" stage={grewTo} />
          <div>
            <strong>POP! Poppy grew into a {grewTo.name}!</strong>
            {grewTo.item && (
              <span>
                {' '}
                New: {grewTo.item.icon}
              </span>
            )}
          </div>
        </div>
      )}

      {unlockedWorlds.map((w) => (
        <div key={w.id} className="grew world-unlock" role="status">
          <span className="unlock-icon" aria-hidden="true">{w.icon}</span>
          <div>
            <strong>New stories: {w.name}!</strong>
          </div>
        </div>
      ))}

      {badges.length > 0 && (
        <div className="new-badges">
          <h3 className="heading small">New badge!</h3>
          <ul className="badge-list">
            {badges.map((b) => (
              <li key={b.id} className="badge-card new">
                <span className="badge-icon" aria-hidden="true">{b.icon}</span>
                <strong>{b.name}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="step-nav">
        <span />
        <button type="button" className="start" onClick={onContinue}>
          Next →
        </button>
      </div>
    </section>
  )
}
