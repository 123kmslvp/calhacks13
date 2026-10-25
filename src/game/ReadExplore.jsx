import { useEffect, useMemo, useRef, useState } from 'react'
import { alignTranscript, normalizeWord, scoreReading, tokenizePassage, trickyWords } from './readAloud.js'
import { speechSupported } from './useReadAloud.js'
import { narratorSupported, useNarrator } from './useNarrator.js'
import WordHelp from './WordHelp.jsx'

export const READ_MODES = [
  { id: 'read', icon: '📖', label: 'Read' },
  { id: 'listen', icon: '🎧', label: 'Listen' },
  { id: 'aloud', icon: '🎤', label: 'Read aloud' },
]

// The student's choices from their profile pick the starting mode — they can
// switch any time. Choices are ways in, not labels.
export function defaultMode(preferences) {
  if (preferences.includes('readAloud')) return 'aloud'
  if (preferences.includes('listen')) return 'listen'
  return 'read'
}

const stopTalking = () => window.speechSynthesis?.cancel()
const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

export default function ReadExplore({ story, chapter, preferences, initialMode, onModeChange, recorder, onFinish }) {
  const { paragraphs, words, sentences } = useMemo(() => tokenizePassage(chapter.text), [chapter])
  const vocab = useMemo(
    () => new Map(chapter.vocab.map((v) => [normalizeWord(v.word), v])),
    [chapter]
  )
  const [mode, setMode] = useState(() => initialMode ?? defaultMode(preferences))
  const [showPictures, setShowPictures] = useState(true)
  const [highlighter, setHighlighter] = useState(false)
  const [highlights, setHighlights] = useState(new Set()) // sentence indexes
  const [helpWord, setHelpWord] = useState(null)
  const [helped, setHelped] = useState([])
  const [tapDone, setTapDone] = useState(new Set())
  const [manualStart, setManualStart] = useState(null)
  const startedAtRef = useRef(Date.now())
  const finishedRef = useRef(false)
  const narrator = useNarrator(paragraphs)

  const { status, transcript, error, seconds } = recorder
  const recording = status === 'recording'
  const aloudStarted = recording || manualStart !== null
  const tapMode = !speechSupported || error === 'network' || manualStart !== null

  const aligned = useMemo(() => alignTranscript(words, transcript), [words, transcript])
  const matched = useMemo(() => {
    if (mode !== 'aloud') return new Set()
    if (tapMode) return new Set([...tapDone].flatMap((p) => paragraphs[p].map((w) => w.index)))
    return aligned.matched
  }, [mode, tapMode, tapDone, paragraphs, aligned])
  const position = mode === 'aloud' && !tapMode ? aligned.position : -1

  useEffect(() => () => stopTalking(), [])

  const switchMode = (m) => {
    narrator.stop()
    stopTalking()
    setMode(m)
    onModeChange?.(m)
  }

  const withSentenceText = (list) =>
    list.map((t) => ({ ...t, sentenceText: sentences[t.sentence].map((w) => w.display).join(' ') }))

  const finish = () => {
    if (finishedRef.current) return
    finishedRef.current = true
    narrator.stop()
    stopTalking()
    if (mode === 'aloud') {
      const elapsed = recording
        ? recorder.stop()
        : Math.round((Date.now() - (manualStart ?? Date.now())) / 1000)
      const score = scoreReading(words, matched, Math.max(elapsed, 1))
      onFinish({
        mode,
        seconds: score.seconds,
        aloud: {
          ...score,
          matched,
          matchedWords: new Set([...matched].map((i) => words[i].norm)),
          tapMode,
        },
        tricky: withSentenceText(trickyWords(words, matched, helped)),
        highlights,
        sentences,
        words,
      })
    } else {
      const all = new Set(words.map((w) => w.index))
      onFinish({
        mode,
        seconds: Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000)),
        aloud: null,
        tricky: withSentenceText(trickyWords(words, all, helped)),
        highlights,
        sentences,
        words,
      })
    }
  }

  // Read aloud: finish automatically at the last word.
  useEffect(() => {
    if (mode === 'aloud' && recording && !tapMode && !helpWord && position >= words.length) finish()
  })

  const onWord = (w) => {
    if (highlighter) {
      setHighlights((h) => {
        const next = new Set(h)
        next.has(w.sentence) ? next.delete(w.sentence) : next.add(w.sentence)
        return next
      })
      return
    }
    narrator.stop()
    recorder.pauseListening()
    setHelpWord(w)
    setHelped((h) => (h.includes(w.index) ? h : [...h, w.index]))
  }

  const closeHelp = () => {
    stopTalking()
    setHelpWord(null)
    recorder.resumeListening()
  }

  const wordClass = (w) =>
    [
      'w',
      matched.has(w.index) ? 'read' : '',
      w.index === position && recording ? 'current' : '',
      w.index === narrator.currentWord ? 'speaking' : '',
      highlights.has(w.sentence) ? 'hl' : '',
      vocab.has(w.norm) ? 'vocab' : '',
      helped.includes(w.index) ? 'helped' : '',
    ]
      .filter(Boolean)
      .join(' ')

  const percent = Math.round((matched.size / words.length) * 100)

  return (
    <section className="read-explore" aria-labelledby="chapter-heading">
      <div className="chapter-head">
        <div>
          <span className="chapter-num">
            {story.title} · Chapter {chapter.number ?? story.chapters.findIndex((c) => c.id === chapter.id) + 1} of{' '}
            {story.chapters.length}
          </span>
          <h2 className="heading" id="chapter-heading">
            {chapter.title}
          </h2>
        </div>
      </div>

      <div className="mode-tabs" role="tablist" aria-label="How do you want to read?">
        {READ_MODES.map((m) => (
          <button
            key={m.id}
            role="tab"
            type="button"
            aria-selected={mode === m.id}
            className={mode === m.id ? 'mode-tab active' : 'mode-tab'}
            disabled={recording || (m.id === 'listen' && !narratorSupported)}
            onClick={() => switchMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="read-tools" role="toolbar" aria-label="Reading tools">
        <button
          type="button"
          className={showPictures ? 'tool-chip on' : 'tool-chip'}
          aria-pressed={showPictures}
          onClick={() => setShowPictures(!showPictures)}
        >
          Pictures
        </button>
        <button
          type="button"
          className={highlighter ? 'tool-chip on hl-on' : 'tool-chip'}
          aria-pressed={highlighter}
          onClick={() => setHighlighter(!highlighter)}
        >
          Highlight
        </button>
        <span className="tool-hint">{highlighter ? 'Tap a sentence.' : 'Tap a word for help.'}</span>
      </div>

      {mode === 'listen' && (
        <div className="listen-bar">
          {narrator.status === 'idle' && (
            <button type="button" className="t-chip highlight" onClick={() => narrator.play(0, true)}>
              ▶ Play
            </button>
          )}
          {narrator.status === 'playing' && (
            <button type="button" className="t-chip highlight" onClick={narrator.pause}>
              Pause
            </button>
          )}
          {narrator.status === 'paused' && (
            <button type="button" className="t-chip highlight" onClick={narrator.resume}>
              ▶ Play
            </button>
          )}
          {narrator.status !== 'idle' && (
            <button type="button" className="t-chip" onClick={narrator.stop}>
              Stop
            </button>
          )}
          <button
            type="button"
            className={narrator.slow ? 'tool-chip on' : 'tool-chip'}
            aria-pressed={narrator.slow}
            onClick={() => narrator.setSlow(!narrator.slow)}
          >
            Slower
          </button>
        </div>
      )}

      {mode === 'aloud' && !aloudStarted && (
        <p className="note">
          Press <strong>Start</strong> and read out loud.
        </p>
      )}

      <div className={`passage${tapMode && aloudStarted && mode === 'aloud' ? ' tap-mode' : ''}${highlighter ? ' highlighting' : ''}`}>
        {paragraphs.map((para, p) => (
          <div key={p} className={narrator.currentPara === p ? 'para-block now-reading' : 'para-block'}>
            {showPictures && chapter.art?.[p] && (
              <div className="para-art" aria-hidden="true">
                {[...chapter.art[p].match(/\p{Extended_Pictographic}(‍\p{Extended_Pictographic}|[\u{1F3FB}-\u{1F3FF}️])*/gu) ?? []].map((e, i) => (
                  <span key={i} style={{ animationDelay: `${i * 0.4}s` }}>
                    {e}
                  </span>
                ))}
              </div>
            )}
            <p className={tapDone.has(p) ? 'para done' : 'para'}>
              {para.map((w) => (
                <span key={w.index}>
                  <button
                    type="button"
                    className={wordClass(w)}
                    aria-label={highlighter ? undefined : `${w.display.replace(/[^A-Za-z'’-]/g, '')}${vocab.has(w.norm) ? ' — tap for meaning' : ''}`}
                    onClick={() => onWord(w)}
                  >
                    {w.display}
                  </button>{' '}
                </span>
              ))}
              {mode === 'listen' && (
                <button
                  type="button"
                  className="replay-part"
                  aria-label={`Listen to part ${p + 1}${narrator.listened.has(p) ? ' again' : ''}`}
                  title="Listen to this part"
                  onClick={() => narrator.play(p, false)}
                >
                  {narrator.listened.has(p) ? '🔁' : '🔊'}
                </button>
              )}
              {mode === 'aloud' && tapMode && aloudStarted && (
                <button
                  type="button"
                  className="para-check"
                  aria-pressed={tapDone.has(p)}
                  aria-label={`I read part ${p + 1}`}
                  onClick={() =>
                    setTapDone((d) => {
                      const next = new Set(d)
                      next.has(p) ? next.delete(p) : next.add(p)
                      return next
                    })
                  }
                >
                  {tapDone.has(p) ? '✅' : '⬜'}
                </button>
              )}
            </p>
          </div>
        ))}
      </div>

      {mode === 'aloud' && error === 'mic' && !aloudStarted && (
        <div className="mic-help" role="alert">
          <p>Poppy can’t hear you. Ask your teacher for help.</p>
          <button type="button" className="t-chip" onClick={() => setManualStart(Date.now())}>
            Read without the mic
          </button>
        </div>
      )}
      {mode === 'aloud' && tapMode && aloudStarted && (
        <p className="note">Tap the box after each part.</p>
      )}
      {mode === 'aloud' && status === 'starting' && (
        <p className="note center-note">Click “Allow” if asked.</p>
      )}

      <div className="read-controls">
        {mode === 'aloud' ? (
          !aloudStarted ? (
            <button
              type="button"
              className="record-btn"
              disabled={status === 'starting'}
              onClick={() => {
                stopTalking()
                recorder.start()
              }}
            >
              🎤 {status === 'starting' ? 'Getting ready…' : 'Start'}
            </button>
          ) : (
            <>
              <div className="read-status">
                {recording && (
                  <span className="rec">
                    <span className="rec-dot" aria-hidden="true" /> Recording · {formatTime(seconds)}
                  </span>
                )}
                <div className="comp-meter" role="progressbar" aria-label="Words read" aria-valuemin={0} aria-valuemax={words.length} aria-valuenow={matched.size}>
                  <span style={{ width: `${percent}%` }} />
                </div>
                <span className="words-count">
                  {matched.size} of {words.length} words
                </span>
              </div>
              <button type="button" className="start" onClick={finish}>
                Done
              </button>
            </>
          )
        ) : (
          <button type="button" className="start" onClick={finish}>
            Done
          </button>
        )}
      </div>

      {helpWord && <WordHelp word={helpWord} meaning={vocab.get(helpWord.norm)} onClose={closeHelp} />}
    </section>
  )
}
