import SpeakButton, { speak } from '../components/SpeakButton.jsx'
import { paceMessage } from '../data/progress.js'

const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

function cheer(completion) {
  if (completion >= 0.9) return 'Wow! You read almost every word!'
  if (completion >= 0.7) return 'Great reading!'
  if (completion >= 0.4) return 'Nice work! Keep going!'
  return 'Great try!'
}

// Supportive feedback after reading aloud: words read correctly, words that
// may need another try, reading pace (in kid words), and their recording.
export default function ReadingFeedback({ chapter, result, grade, audioUrl, coach, onNext, onRetry }) {
  const { aloud, tricky } = result
  const pace = !aloud.tapMode && aloud.seconds > 10 ? paceMessage(aloud.wcpm, grade) : null
  const message = cheer(aloud.completion)

  return (
    <section className="results" aria-labelledby="results-heading">
      <h2 className="heading" id="results-heading">
        You did it!
      </h2>
      <div className="section-head center">
        <p className="result-message">{message}</p>
        <SpeakButton text={`${message} ${pace ? pace.text : ''}`} />
      </div>

      <div className="read-meter-big" aria-label={`${Math.round(aloud.completion * 100)} percent of the words`}>
        <span style={{ width: `${Math.max(4, aloud.completion * 100)}%` }} />
      </div>

      <div className="stat-tiles three">
        <div className="stat-tile">
          <span className="stat-value">{aloud.read}</span>
          <span className="stat-label">{aloud.read === 1 ? 'word' : 'words'}</span>
        </div>
        <div className="stat-tile">
          <span className="stat-value">{Math.round(aloud.completion * 100)}%</span>
          <span className="stat-label">read</span>
        </div>
        <div className="stat-tile">
          <span className="stat-value">{formatTime(aloud.seconds)}</span>
          <span className="stat-label">time</span>
        </div>
      </div>

      {pace && (
        <p className="pace">
          {pace.text}
        </p>
      )}

      {audioUrl && (
        <div className="playback">
          <span>Hear yourself:</span>
          <audio controls src={audioUrl} />
        </div>
      )}

      {coach === 'loading' && <p className="note">Poppy is listening back to your reading…</p>}
      {coach && coach !== 'loading' && (
        <div className="feedback good coach" role="status">
          <p>
            <strong>{coach.encouragement}</strong>
          </p>
          {coach.strengths.length > 0 && (
            <ul className="coach-list">
              {coach.strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          )}
          {coach.wordsToPractice.length > 0 && (
            <p>
              Let’s practice: <strong>{coach.wordsToPractice.join(', ')}</strong>
            </p>
          )}
          <p>{coach.practiceTip}</p>
          <p className="agent-meta">
            <span className="agent-chip claude">Personalized by Claude</span>
          </p>
          <SpeakButton text={`${coach.encouragement} ${coach.practiceTip}`} />
        </div>
      )}

      {tricky.length > 0 && (
        <div className="practice">
          <h3 className="heading small">Tricky words</h3>
          <div className="word-chips">
            {tricky.map((t) => (
              <button key={t.word} type="button" className="word practice-word" onClick={() => speak(t.display)}>
                🔊 {t.display}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="fine-print">
        This is reading practice. Kernel Quest doesn’t replace a speech-language professional.
      </p>

      <div className="step-nav">
        <button type="button" className="back" onClick={onRetry}>
          Read again
        </button>
        <button type="button" className="start" onClick={onNext}>
          Next →
        </button>
      </div>
    </section>
  )
}
