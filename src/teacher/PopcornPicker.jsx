import { useEffect, useMemo, useRef, useState } from 'react'
import { Art } from '../components/Art.jsx'
import { speak } from '../components/SpeakButton.jsx'

// Popcorn reading: every student's name goes into the popcorn dispenser as a
// kernel. "Pop a name!" runs the dispenser video, and when it finishes one name
// pops out in the middle of the screen with confetti. Names already called wait
// out until everyone has had a turn, so it is fair, and the teacher can take
// absent students out first.

const CONFETTI_COLORS = ['#f0b429', '#ff9f43', '#ff6b9d', '#35b8e8', '#7bd88f', '#a685e0']
const VIDEO_SRC = '/popcorn_dispenser.mp4'
const FALLBACK_MS = 2200 // popping time when the video can't play
const REDUCED_MS = 400 // popping time for students and teachers who asked for less motion
const MAX_WAIT_MS = 10000 // never wait longer than this for the video

// A fair draw that can't be predicted.
const randomIndex = (n) => {
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return buf[0] % n
}

// First name and last initial, so it is easy to read from the back of the room.
const shortName = (s) => (s.lastName ? `${s.firstName} ${s.lastName[0]}.` : s.firstName)

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const makeConfetti = () =>
  Array.from({ length: 56 }, (_, i) => {
    const angle = Math.random() * Math.PI * 2
    const dist = 240 + Math.random() * 360
    return {
      id: i,
      popcorn: i % 7 === 0,
      style: {
        '--x': `${Math.cos(angle) * dist}px`,
        '--y': `${Math.sin(angle) * dist * 0.8 + 140}px`,
        '--r': `${Math.round(Math.random() * 900 - 450)}deg`,
        '--d': `${(Math.random() * 0.25).toFixed(2)}s`,
        '--s': `${10 + Math.round(Math.random() * 10)}px`,
        '--c': CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      },
    }
  })

export default function PopcornPicker({ roster, className }) {
  const [here, setHere] = useState(() => new Set(roster.map((s) => s.id))) // who is in the machine
  const [called, setCalled] = useState([]) // ids already called, in order
  const [phase, setPhase] = useState('ready') // ready | popping | picked
  const [picked, setPicked] = useState(null)
  const [confetti, setConfetti] = useState([])
  const [videoOk, setVideoOk] = useState(true)
  const video = useRef(null)
  const pending = useRef(null) // the student chosen, waiting for the dispenser to finish
  const timers = useRef([])

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  useEffect(() => clearTimers, [])

  const sorted = useMemo(() => [...roster].sort((a, b) => a.firstName.localeCompare(b.firstName)), [roster])
  const inMachine = sorted.filter((s) => here.has(s.id))
  const waiting = inMachine.filter((s) => !called.includes(s.id))
  const alreadyRead = called.map((id) => roster.find((s) => s.id === id)).filter((s) => s && here.has(s.id))

  // The dispenser has finished: pop the chosen name out in the middle of the screen.
  const reveal = () => {
    const choice = pending.current
    if (!choice) return
    pending.current = null
    clearTimers()
    setPicked(choice)
    setCalled((c) => [...c, choice.id])
    setConfetti(makeConfetti())
    setPhase('picked')
  }

  const pop = () => {
    if (phase === 'popping' || waiting.length === 0) return
    pending.current = waiting[randomIndex(waiting.length)]
    setPicked(null)
    setPhase('popping')

    const el = video.current
    if (prefersReducedMotion()) {
      timers.current.push(setTimeout(reveal, REDUCED_MS))
    } else if (el && videoOk) {
      el.currentTime = 0
      el.play().catch(() => {
        // Blocked or failed: fall back to a short pause so the pick still happens.
        setVideoOk(false)
        timers.current.push(setTimeout(reveal, FALLBACK_MS))
      })
      timers.current.push(setTimeout(reveal, MAX_WAIT_MS)) // safety net; the video's end normally reveals first
    } else {
      timers.current.push(setTimeout(reveal, FALLBACK_MS))
    }
  }

  const closeReveal = () => {
    setPhase('ready')
    if (video.current) video.current.currentTime = 0 // back to the first frame, ready for the next pop
  }

  useEffect(() => {
    if (phase !== 'picked') return
    const onKey = (e) => e.key === 'Escape' && closeReveal()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase])

  const toggle = (id) =>
    setHere((h) => {
      const next = new Set(h)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  if (roster.length === 0) {
    return (
      <section className="panel">
        <h2 className="panel-title">Popcorn reading</h2>
        <p className="panel-sub">Add students to {className} first, then their names can go in the popcorn machine.</p>
      </section>
    )
  }

  return (
    <section className="panel popper" aria-labelledby="popper-title">
      <svg className="svg-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="pop-thin-outline" x="-4%" y="-4%" width="108%" height="108%" colorInterpolationFilters="sRGB">
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.2 -1.2 -1.2 0 1.6" result="dark" />
            <feComposite in="dark" in2="SourceAlpha" operator="in" result="outline" />
            <feMorphology in="outline" operator="erode" radius="3" result="thinOutline" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.4 2.4 2.4 0 -3.6" result="light" />
            <feComposite in="SourceGraphic" in2="light" operator="in" result="popcorn" />
            <feMorphology in="popcorn" operator="dilate" radius="4" result="popcornSpread" />
            <feFlood floodColor="#000" result="ink" />
            <feComposite in="ink" in2="thinOutline" operator="in" result="line" />
            <feMerge>
              <feMergeNode in="popcornSpread" />
              <feMergeNode in="line" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <div>
        <h2 className="panel-title" id="popper-title">
          Popcorn reading · {className}
        </h2>
        <p className="panel-sub">
          Every name is a kernel. Pop one to see who reads next. Nobody is called twice until everyone has had a turn.
        </p>
      </div>

      <div className="popper-machine">
        <video
          ref={video}
          className="popper-video"
          src={`${VIDEO_SRC}#t=0.001`}
          muted
          playsInline
          preload="auto"
          aria-label="The popcorn dispenser"
          // Show the machine (not a blank panel) before the first pop.
          onLoadedData={(e) => {
            if (phase !== 'popping') e.currentTarget.currentTime = 0.05
          }}
          onEnded={reveal}
          onError={() => setVideoOk(false)}
        />
        <div className={phase === 'popping' ? 'popper-kernels popping' : 'popper-kernels'}>
          {waiting.length === 0 ? (
            <p className="popper-empty">
              {inMachine.length === 0 ? 'No kernels in the machine. Add students below.' : 'Everyone has had a turn! 🎉'}
            </p>
          ) : (
            waiting.map((s, i) => (
              <span key={s.id} className="kernel-chip" style={{ '--i': i }}>
                {shortName(s)}
              </span>
            ))
          )}
        </div>
      </div>

      <div className="popper-actions">
        <button type="button" className="t-btn primary big" disabled={phase === 'popping' || waiting.length === 0} onClick={pop}>
          {phase === 'popping' ? 'Popping…' : 'Pop a name!'}
        </button>
        {called.length > 0 && (
          <button type="button" className="t-btn" onClick={() => setCalled([])}>
            Start over
          </button>
        )}
        <span className="popper-count">
          {alreadyRead.length} of {inMachine.length} have read
        </span>
      </div>

      {alreadyRead.length > 0 && (
        <div className="popper-done">
          <span className="popper-label">Already read:</span>
          {alreadyRead.map((s) => (
            <span key={s.id} className="done-chip">
              {shortName(s)}
            </span>
          ))}
        </div>
      )}

      <div className="popper-here">
        <span className="popper-label">Who’s here today? Tap a name to take it out or put it back.</span>
        <div className="here-list">
          {sorted.map((s) => (
            <button
              key={s.id}
              type="button"
              className={here.has(s.id) ? 'here-chip on' : 'here-chip'}
              aria-pressed={here.has(s.id)}
              onClick={() => toggle(s.id)}
            >
              {shortName(s)}
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {phase === 'picked' && picked ? `${shortName(picked)}, you're up!` : ''}
      </p>

      {phase === 'picked' && picked && (
        <div className="pop-overlay" role="dialog" aria-modal="true" aria-label={`${shortName(picked)} is up`} onClick={closeReveal}>
          <div className="confetti-layer" aria-hidden="true">
            {confetti.map((c) =>
              c.popcorn ? (
                <span key={c.id} className="confetti piece-popcorn" style={c.style}>
                  <Art name="popcorn" />
                </span>
              ) : (
                <span key={c.id} className="confetti" style={c.style} />
              )
            )}
          </div>
          <div className="pop-card" onClick={(e) => e.stopPropagation()}>
            <div className="pop-popcorn">
              <Art name="popcorn" />
              <span className="pop-name">{shortName(picked)}</span>
            </div>
            <p className="pop-sub">You’re up! Time to read.</p>
            <div className="pop-actions">
              <button type="button" className="t-btn" onClick={() => speak(picked.firstName)}>
                🔊 Say name
              </button>
              <button type="button" className="t-btn primary big" autoFocus onClick={pop} disabled={waiting.length === 0}>
                Pop another
              </button>
              <button type="button" className="t-btn" onClick={closeReveal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
