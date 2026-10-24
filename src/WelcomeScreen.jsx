import { useState } from 'react'

const TOTAL_STEPS = 7

export default function WelcomeScreen() {
  const [started, setStarted] = useState(false)

  return (
    <main className="welcome">
      <span className="blob blob-1" />
      <span className="blob blob-2" />
      <span className="blob blob-3" />

      <section className="card">
        <div className="progress" aria-label={`Step 1 of ${TOTAL_STEPS}`}>
          <div className="dots">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <span key={i} className={i === 0 ? 'dot active' : 'dot'} />
            ))}
          </div>
          <span className="progress-text">Step 1 of {TOTAL_STEPS}</span>
        </div>

        <h1 className="title">
          <span>Kernel</span> <span>Quest</span>
        </h1>

        <div className="poppy" role="img" aria-label="Poppy the popcorn kernel">
          <span className="poppy-emoji">🍿</span>
          <div className="poppy-face">
            <span className="eye" />
            <span className="eye" />
          </div>
        </div>

        <p className="message">
          Hi, I'm <strong>Poppy</strong>! 🎉 Come pop along with me on a
          super fun adventure to learn how computers think!
        </p>

        {started ? (
          <p className="placeholder" role="status">
            Profile setup coming next!
          </p>
        ) : (
          <button className="start" onClick={() => setStarted(true)}>
            Start Adventure ✨
          </button>
        )}
      </section>
    </main>
  )
}
