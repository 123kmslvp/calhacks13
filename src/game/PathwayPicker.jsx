import SpeakButton from '../components/SpeakButton.jsx'
import { PATHWAYS } from './pathways.js'

// "How do you want to explore?" The choice shapes the activity Claude builds
// for each chapter, and a student can change it any time.
export default function PathwayPicker({ current, onPick, onBack }) {
  return (
    <section aria-labelledby="pathway-heading">
      <div className="section-head center">
        <h2 className="heading" id="pathway-heading">
          How do you want to explore?
        </h2>
        <SpeakButton text={`How do you want to explore? ${PATHWAYS.map((p) => `${p.name}. ${p.about}.`).join(' ')}`} />
      </div>
      <p className="note">Pick one. You can change it any time.</p>

      <div className="pref-list" role="group" aria-label="Ways to explore">
        {PATHWAYS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={current === p.id ? 'pref selected' : 'pref'}
            aria-pressed={current === p.id}
            onClick={() => onPick(p.id)}
          >
            <span className="pref-icon" aria-hidden="true">
              {p.icon}
            </span>
            <span>
              <strong>{p.name}</strong>
              <br />
              <span className="pref-about">{p.about}</span>
            </span>
          </button>
        ))}
      </div>

      {onBack && (
        <div className="step-nav">
          <button type="button" className="back" onClick={onBack}>
            ← Back
          </button>
        </div>
      )}
    </section>
  )
}
