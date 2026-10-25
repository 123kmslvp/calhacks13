import { useEffect, useMemo, useRef, useState } from 'react'
import Poppy from '../components/Poppy.jsx'
import SpeakButton, { speak } from '../components/SpeakButton.jsx'
import { STORIES } from '../data/stories.js'
import { POPPY_ITEMS, applyDrawing, applyReadAloud, applyWordRescue, isItemUnlocked, poppyGrowth } from '../data/progress.js'
import { saveDrawing } from '../data/drawings.js'
import { alignTranscript, scoreReading, tokenizePassage, trickyWords } from './readAloud.js'
import { speechSupported, useReadAloud } from './useReadAloud.js'
import DrawingPad from './DrawingPad.jsx'
import WordHelp from './WordHelp.jsx'
import WordRescue from './WordRescue.jsx'
import './game.css'

const STAR_MESSAGES = [
  'Great try! Every time you read, you get stronger.',
  'Nice reading! You got started — keep going!',
  'Awesome job! You read most of the chapter!',
  'WOW! You read almost every word! Superstar reader!',
]

const stopTalking = () => window.speechSynthesis?.cancel()

export default function ReadAloudGame({ student, preferences = [], onSaveStudent, onExit, onProgress }) {
  const [step, setStep] = useState('choose') // choose | read | results | rescue | draw | done
  const [chapter, setChapter] = useState(null)
  const [result, setResult] = useState(null)
  const [drawing, setDrawing] = useState(null)
  const recorder = useReadAloud()

  useEffect(() => stopTalking, [])

  const growth = poppyGrowth(student.points)
  const poppyItem = POPPY_ITEMS.find((i) => i.id === student.poppyItem && isItemUnlocked(i.id, student.points))

  const chooseChapter = (c) => {
    recorder.reset()
    setChapter(c)
    setResult(null)
    setDrawing(null)
    setStep('read')
  }

  const finishReading = ({ matched, seconds, words, sentences, helped }) => {
    const score = scoreReading(words, matched, seconds)
    const matchedWords = new Set([...matched].map((i) => words[i].norm))
    const tricky = trickyWords(words, matched, helped)
    const applied = applyReadAloud(student, { chapter, score, matchedWords, tricky })
    onSaveStudent(applied.student)
    setResult({ score, words, sentences, tricky, ...applied })
    setStep('results')
  }

  const finishRescue = ({ rescued }) => {
    const applied = applyWordRescue(student, { rescued })
    onSaveStudent(applied.student)
    return applied
  }

  const finishDrawing = (dataUrl) => {
    const saved = saveDrawing(student.id, { chapterId: chapter.id, chapterTitle: chapter.title, dataUrl })
    const applied = applyDrawing(student)
    onSaveStudent(applied.student)
    setDrawing({ dataUrl, saved, ...applied })
    setStep('done')
  }

  return (
    <main className="welcome">
      <span className="blob blob-1" />
      <span className="blob blob-2" />
      <span className="blob blob-3" />

      <section className="card card-game">
        <div className="progress-top">
          <button
            type="button"
            className="back"
            onClick={() => {
              recorder.reset()
              stopTalking()
              step === 'choose' ? onExit() : setStep('choose')
            }}
          >
            ← {step === 'choose' ? 'My page' : 'Chapters'}
          </button>
          <span className="game-title">🎤 Read Aloud</span>
          <span className="points" aria-label={`${student.points} Pop Points`}>
            ⭐ {student.points}
          </span>
        </div>

        {step === 'choose' && (
          <ChooseChapter student={student} growth={growth} poppyItem={poppyItem} onChoose={chooseChapter} />
        )}
        {step === 'read' && chapter && (
          <ReadChapter
            key={chapter.id}
            chapter={chapter}
            recorder={recorder}
            showPictures={preferences.includes('visuals')}
            suggestListen={preferences.includes('listen')}
            onFinish={finishReading}
          />
        )}
        {step === 'results' && result && (
          <Results
            chapter={chapter}
            result={result}
            audioUrl={recorder.audioUrl}
            onRetry={() => chooseChapter(chapter)}
            onRescue={() => setStep('rescue')}
            onDraw={() => setStep('draw')}
          />
        )}
        {step === 'rescue' && result && (
          <WordRescue
            tricky={result.tricky}
            sentences={result.sentences}
            onComplete={finishRescue}
            onContinue={() => setStep('draw')}
          />
        )}
        {step === 'draw' && (
          <section aria-labelledby="draw-heading">
            <div className="section-head">
              <h2 className="heading" id="draw-heading">
                Draw your favorite scene from “{chapter.title}”!
              </h2>
              <SpeakButton text={`Draw your favorite scene from ${chapter.title}! Need an idea? Try ${chapter.drawIdeas}.`} />
            </div>
            <p className="note">Need an idea? Try {chapter.drawIdeas}.</p>
            <DrawingPad stickers={stickersFor(chapter)} onSave={finishDrawing} />
          </section>
        )}
        {step === 'done' && drawing && (
          <section className="done" aria-labelledby="done-heading">
            <h2 className="heading" id="done-heading">Beautiful! 🎨</h2>
            <img className="saved-drawing" src={drawing.dataUrl} alt={`Your drawing of ${chapter.title}`} />
            <p className="earned-line">+{drawing.total} Pop Points for Poppy!</p>
            {drawing.grewTo && <GrewBanner stage={drawing.grewTo} />}
            <p className="note">
              {drawing.saved
                ? 'Saved to “My drawings” on your progress page.'
                : "Your drawing couldn't be saved — this device is out of space. Ask your teacher for help."}
            </p>
            <div className="done-actions">
              <button type="button" className="t-chip" onClick={() => setStep('choose')}>
                📚 Read another chapter
              </button>
              <button type="button" className="t-chip" onClick={onProgress}>
                ⭐ See my progress
              </button>
              <button type="button" className="start" onClick={onExit}>
                All done! 🎉
              </button>
            </div>
          </section>
        )}
      </section>
    </main>
  )
}

function ChooseChapter({ student, growth, poppyItem, onChoose }) {
  const stars = student.reading.chapterStars ?? {}

  return (
    <>
      <div className="bubble">
        <Poppy size="small" stage={growth.stage} item={poppyItem} />
        <p className="message">
          Read a chapter out loud to me! I'll listen and follow along. Then you can draw your favorite part!
        </p>
        <SpeakButton text="Read a chapter out loud to me! I'll listen and follow along. Then you can draw your favorite part!" />
      </div>

      {STORIES.map((story) => {
        const nextUp = story.chapters.find((c) => !(stars[c.id] > 0))
        return (
          <section key={story.id} aria-labelledby={`${story.id}-title`}>
            <h2 className="heading story-title" id={`${story.id}-title`}>
              📖 {story.title}
            </h2>
            <ul className="chapter-list">
              {story.chapters.map((c, i) => (
                <li key={c.id}>
                  <button type="button" className="chapter" onClick={() => onChoose(c)}>
                    <span className="chapter-scene" aria-hidden="true">{c.scene}</span>
                    <span className="chapter-body">
                      <span className="chapter-num">Chapter {i + 1}</span>
                      <strong>{c.title}</strong>
                    </span>
                    <span className="chapter-stars" aria-label={`${stars[c.id] ?? 0} of 3 stars`}>
                      {c === nextUp && <span className="tag">Next up!</span>}
                      <span aria-hidden="true">
                        {'★'.repeat(stars[c.id] ?? 0)}
                        {'☆'.repeat(3 - (stars[c.id] ?? 0))}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </>
  )
}

function ReadChapter({ chapter, recorder, showPictures, suggestListen, onFinish }) {
  const { paragraphs, words, sentences } = useMemo(() => tokenizePassage(chapter.text), [chapter])
  const [tapDone, setTapDone] = useState(new Set()) // paragraph indexes, for tap mode
  const [helpWord, setHelpWord] = useState(null)
  const [helped, setHelped] = useState([]) // word indexes the reader asked help with
  const [manualStart, setManualStart] = useState(null) // timer when there's no mic
  const finishedRef = useRef(false)

  const { status, transcript, error, seconds } = recorder
  const recording = status === 'recording'
  const tapMode = !speechSupported || error === 'network' || manualStart !== null
  const started = recording || manualStart !== null

  const matched = useMemo(() => {
    if (tapMode) {
      return new Set(
        [...tapDone].flatMap((p) => paragraphs[p].map((w) => w.index))
      )
    }
    return alignTranscript(words, transcript).matched
  }, [tapMode, tapDone, paragraphs, words, transcript])
  const position = tapMode ? -1 : alignTranscript(words, transcript).position

  const finish = () => {
    if (finishedRef.current) return
    finishedRef.current = true
    const elapsed = recording ? recorder.stop() : Math.round((Date.now() - (manualStart ?? Date.now())) / 1000)
    onFinish({ matched, seconds: Math.max(elapsed, 1), words, sentences, helped })
  }

  const openHelp = (w) => {
    recorder.pauseListening()
    setHelpWord(w)
    setHelped((h) => (h.includes(w.index) ? h : [...h, w.index]))
  }

  const closeHelp = () => {
    stopTalking()
    setHelpWord(null)
    recorder.resumeListening()
  }

  const toggleParagraph = (p) =>
    setTapDone((d) => {
      const next = new Set(d)
      next.has(p) ? next.delete(p) : next.add(p)
      return next
    })

  // Finish automatically once the reader reaches the last word.
  useEffect(() => {
    if (recording && !tapMode && !helpWord && position >= words.length) finish()
  })

  const start = () => {
    stopTalking() // don't let the mic hear the read-aloud voice
    recorder.start()
  }

  const percent = Math.round((matched.size / words.length) * 100)

  return (
    <section aria-labelledby="chapter-heading">
      <div className="section-head">
        <h2 className="heading" id="chapter-heading">
          {chapter.title}
        </h2>
        <span className="chapter-scene-sm" aria-hidden="true">{chapter.scene}</span>
      </div>

      {showPictures && (
        <div className="scene-banner" aria-hidden="true">
          {chapter.scene}
        </div>
      )}

      {!started && (
        <div className="before-read">
          <p className="note">
            Press <strong>Start reading</strong>, then read the story out loud. Words turn green as Poppy hears
            them! Stuck on a word? <strong>Tap it</strong> for help.
          </p>
          <button
            type="button"
            className={suggestListen ? 't-chip highlight' : 't-chip'}
            onClick={() => speak(chapter.text)}
          >
            🎧 Hear it first
          </button>
        </div>
      )}

      <div className={`passage${tapMode && started ? ' tap-mode' : ''}`} aria-live="off">
        {paragraphs.map((para, p) => (
          <p key={p} className={tapDone.has(p) ? 'para done' : 'para'}>
            {para.map((w) => (
              <span key={w.index}>
                <button
                  type="button"
                  className={[
                    'w',
                    matched.has(w.index) ? 'read' : w.index === position && recording ? 'current' : '',
                    helped.includes(w.index) ? 'helped' : '',
                  ].join(' ')}
                  aria-label={`${w.display.replace(/[^A-Za-z'’-]/g, '')} — tap for help`}
                  onClick={() => openHelp(w)}
                >
                  {w.display}
                </button>{' '}
              </span>
            ))}
            {tapMode && started && (
              <button
                type="button"
                className="para-check"
                aria-pressed={tapDone.has(p)}
                aria-label={`I read part ${p + 1}`}
                onClick={() => toggleParagraph(p)}
              >
                {tapDone.has(p) ? '✅' : '⬜'}
              </button>
            )}
          </p>
        ))}
      </div>

      {error === 'mic' && !started && (
        <div className="mic-help" role="alert">
          <p>
            🎙️ Poppy can't hear you! Your microphone might be blocked. Ask your teacher to allow the
            microphone, then try again.
          </p>
          <button type="button" className="t-chip" onClick={() => setManualStart(Date.now())}>
            Read without the microphone
          </button>
        </div>
      )}
      {tapMode && started && (
        <p className="note">Tap the box next to each part of the story after you read it out loud.</p>
      )}
      {status === 'starting' && (
        <p className="note center-note">If your browser asks to use the microphone, click “Allow”.</p>
      )}

      <div className="read-controls">
        {!started ? (
          <button type="button" className="record-btn" onClick={start} disabled={status === 'starting'}>
            🎤 {status === 'starting' ? 'Getting ready…' : 'Start reading'}
          </button>
        ) : (
          <>
            <div className="read-status">
              {recording && (
                <span className="rec">
                  <span className="rec-dot" aria-hidden="true" /> Recording · {formatTime(seconds)}
                </span>
              )}
              <div
                className="comp-meter"
                role="progressbar"
                aria-label="Words read"
                aria-valuemin={0}
                aria-valuemax={words.length}
                aria-valuenow={matched.size}
              >
                <span style={{ width: `${percent}%` }} />
              </div>
              <span className="words-count">
                {matched.size} of {words.length} words
              </span>
            </div>
            <button type="button" className="start" onClick={finish}>
              ⏹ I'm done!
            </button>
          </>
        )}
      </div>

      {helpWord && <WordHelp word={helpWord} onClose={closeHelp} />}
    </section>
  )
}

function Results({ chapter, result, audioUrl, onRetry, onRescue, onDraw }) {
  const { score, tricky, earned, total, grewTo } = result
  const message = STAR_MESSAGES[score.stars]

  return (
    <section className="results" aria-labelledby="results-heading">
      <h2 className="heading" id="results-heading">
        You read “{chapter.title}”!
      </h2>
      <div className="big-stars" aria-label={`${score.stars} out of 3 stars`}>
        {[0, 1, 2].map((i) => (
          <span key={i} className={i < score.stars ? 'star on' : 'star'} style={{ animationDelay: `${i * 0.25}s` }}>
            ★
          </span>
        ))}
      </div>
      <div className="section-head center">
        <p className="result-message">{message}</p>
        <SpeakButton text={message} />
      </div>

      <div className="stat-tiles three">
        <div className="stat-tile">
          <span className="stat-value">{Math.round(score.completion * 100)}%</span>
          <span className="stat-label">of the chapter</span>
        </div>
        <div className="stat-tile">
          <span className="stat-value">{score.read}</span>
          <span className="stat-label">words read</span>
        </div>
        <div className="stat-tile">
          <span className="stat-value">{formatTime(score.seconds)}</span>
          <span className="stat-label">reading time</span>
        </div>
      </div>

      <ul className="earned">
        {earned.map((e) => (
          <li key={e.label}>
            <span>{e.label}</span>
            <strong>+{e.points}</strong>
          </li>
        ))}
        <li className="earned-total">
          <span>Pop Points for Poppy</span>
          <strong>+{total} ⭐</strong>
        </li>
      </ul>
      {grewTo && <GrewBanner stage={grewTo} />}

      {audioUrl && (
        <div className="playback">
          <span>🎧 Listen to yourself read:</span>
          <audio controls src={audioUrl} />
        </div>
      )}

      {tricky.length > 0 && (
        <div className="practice">
          <h3 className="heading small">🛟 Tricky words to rescue</h3>
          <p className="note">
            Say each one out loud, then read it again in the story — and earn Pop Points for every word you
            rescue!
          </p>
          <div className="word-chips">
            {tricky.map((t) => (
              <button key={t.word} type="button" className="word practice-word" onClick={() => speak(t.display)}>
                🔊 {t.display}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="step-nav">
        <button type="button" className="back" onClick={onRetry}>
          🔁 Read again
        </button>
        {tricky.length > 0 ? (
          <span className="nav-right">
            <button type="button" className="back" onClick={onDraw}>
              Skip to drawing
            </button>
            <button type="button" className="start" onClick={onRescue}>
              Start Word Rescue 🛟
            </button>
          </span>
        ) : (
          <button type="button" className="start" onClick={onDraw}>
            Draw my favorite scene 🎨
          </button>
        )}
      </div>
    </section>
  )
}

function GrewBanner({ stage }) {
  return (
    <div className="grew" role="status">
      <Poppy size="small" stage={stage} />
      <div>
        <strong>POP! Poppy grew into a {stage.name}!</strong>
        {stage.item && (
          <span>
            {' '}
            You unlocked a {stage.item.icon} {stage.item.label.toLowerCase()} — dress up Poppy on your progress page!
          </span>
        )}
      </div>
    </div>
  )
}

const stickersFor = (chapter) => [
  ...new Set([...(chapter.scene.match(/\p{Extended_Pictographic}/gu) ?? []), '🍿', '⭐', '❤️', '🌈', '☀️', '🌳']),
]

const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
