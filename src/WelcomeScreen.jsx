import Poppy from './components/Poppy.jsx'
import { Logo } from './components/Art.jsx'

const TOTAL_STEPS = 7

export default function WelcomeScreen({ onStart }) {
  return (
    <main className="welcome bg-castle">
      <span className="blob blob-1" />
      <span className="blob blob-2" />
      <span className="blob blob-3" />

      <section className="card card-title">
        <div className="progress" aria-label={`Step 1 of ${TOTAL_STEPS}`}>
          <div className="dots">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <span key={i} className={i === 0 ? 'dot active' : 'dot'} />
            ))}
          </div>
          <span className="progress-text">Step 1 of {TOTAL_STEPS}</span>
        </div>

        <h1 className="title">
          <span className="sr-only">Kernel Quest</span>
          <Logo />
        </h1>

        <Poppy size="xl" />

        <p className="message">
          Hi, reader! I’m <strong>Poppy</strong>. Let’s read, think, and grow
          together—one story at a time!
        </p>

        <button className="start" onClick={onStart}>
          Start Adventure ✨
        </button>
      </section>
    </main>
  )
}
