import { useMemo, useRef, useState } from 'react'
import SpeakButton, { speak } from '../../components/SpeakButton.jsx'
import { useAutoRead } from '../../a11y/accessibility.js'
import AnswerBox from '../AnswerBox.jsx'
import { alignTranscript, normalizeWord } from '../readAloud.js'
import { useSpeechCheck } from '../useSpeechCheck.js'
import { buildRounds, echoRounds, listenRounds, mapRound, pictureRounds, predictRounds, shuffle, trickyRounds, workshopRounds } from './gameData.js'

// Games for the four learning pathways. Every game:
//  - can be read aloud (🔊) and works with taps only, no typing needed,
//  - never ends on a mistake: kids get a gentle nudge and can keep trying,
//  - says what happened in words (✓ / ✗), not only in color,
//  - calls onDone({ correct, total }) when finished.

function Next({ onClick, children = 'Next →' }) {
  return (
    <div className="q-next">
      <button type="button" className="start" onClick={onClick}>
        {children}
      </button>
    </div>
  )
}

function Instructions({ text }) {
  useAutoRead(text, speak)
  return (
    <div className="game-instructions-row">
      <p className="game-instructions">{text}</p>
      <SpeakButton text={text} />
    </div>
  )
}

const LETTERS = ['A', 'B', 'C', 'D']

// ---------- 🖼️ Visual Explorer ----------

// 🖼️ Picture Match: hear a sentence from the story, pick the picture that shows it.
export function PictureMatch({ story, chapter, onDone }) {
  const rounds = useMemo(() => pictureRounds(story, chapter), [story, chapter])
  const [round, setRound] = useState(0)
  const [wrong, setWrong] = useState([])
  const [solved, setSolved] = useState(false)
  const [correct, setCorrect] = useState(0)
  const r = rounds[round]

  if (!r) return <GameEnd text="You found every picture!" onNext={() => onDone({ correct, total: rounds.length })} />

  const pick = (art) => {
    if (solved) return
    if (art === r.answer) {
      setSolved(true)
      if (!wrong.length) setCorrect((c) => c + 1)
    } else {
      setWrong([...wrong, art])
    }
  }

  return (
    <div className="game">
      <span className="case-label">{round + 1} of {rounds.length}</span>
      <Instructions text="Which picture shows this part of the story?" />
      <div className="case-file">
        <p className="claim">“{r.sentence}”</p>
        <SpeakButton text={r.sentence} />
      </div>
      <div className="picture-grid" role="group" aria-label="Pictures to choose from">
        {r.choices.map((art, i) => {
          const isWrong = wrong.includes(art)
          const isRight = solved && art === r.answer
          return (
            <button
              key={art}
              type="button"
              disabled={solved || isWrong}
              className={isRight ? 'picture-btn right' : isWrong ? 'picture-btn wrong' : 'picture-btn'}
              aria-label={`Picture ${LETTERS[i]}${isRight ? ', correct' : isWrong ? ', not this one' : ''}`}
              onClick={() => pick(art)}
            >
              <span className="picture-art" aria-hidden="true">{art}</span>
              <span className="picture-tag">{isRight ? '✓ Yes!' : isWrong ? 'Not this one' : LETTERS[i]}</span>
            </button>
          )
        })}
      </div>
      {wrong.length > 0 && !solved && <p className="feedback gentle" role="status">Look at the pictures again. Which one fits the words?</p>}
      {solved && (
        <div className="feedback good" role="status">
          <p>Yes! You matched the words to the picture.</p>
          <Next
            onClick={() => {
              setRound(round + 1)
              setWrong([])
              setSolved(false)
            }}
          />
        </div>
      )}
    </div>
  )
}

// How each map label sounds in a question: "What happens in the beginning?"
const WHEN = { Beginning: 'in the beginning', First: 'first' }

// 🗺️ Story Map: put the pictured parts of the chapter in order on a map.
export function StoryMap({ chapter, onDone }) {
  const { labels, parts } = useMemo(() => mapRound(chapter), [chapter])
  const [cards] = useState(() => {
    let s = shuffle(parts)
    while (parts.length > 1 && s.every((c, i) => c.i === parts[i].i)) s = shuffle(parts)
    return s
  })
  const [placed, setPlaced] = useState([])
  const [shake, setShake] = useState(null)
  const [mistakes, setMistakes] = useState(0)
  const done = placed.length === parts.length

  if (parts.length < 2) return <GameEnd text="This chapter is one short scene!" onNext={() => onDone({ correct: 1, total: 1 })} />

  const tap = (card) => {
    if (card.i === parts[placed.length].i) {
      setPlaced([...placed, card])
    } else {
      setShake(card.i)
      setMistakes((m) => m + 1)
      setTimeout(() => setShake(null), 500)
    }
  }

  return (
    <div className="game">
      <Instructions text={`Tap the pictures in order to build your story map. What happens ${WHEN[labels[0]] ?? 'first'}?`} />
      <ol className="story-map" aria-label="Story map">
        {labels.map((label, i) => (
          <li key={label + i} className={placed[i] ? 'map-box filled' : i === placed.length ? 'map-box next' : 'map-box'}>
            <strong>{label}</strong>
            <span className="map-art" aria-hidden="true">{placed[i]?.art ?? '❔'}</span>
            <span className="map-text">{placed[i]?.text ?? (i === placed.length ? 'Pick the next picture' : '')}</span>
          </li>
        ))}
      </ol>
      {!done && (
        <div className="map-cards">
          {cards
            .filter((c) => !placed.includes(c))
            .map((c) => (
              <button key={c.i} type="button" className={shake === c.i ? 'map-card shake' : 'map-card'} onClick={() => tap(c)}>
                <span className="map-art" aria-hidden="true">{c.art}</span>
                <span>{c.text}</span>
              </button>
            ))}
        </div>
      )}
      {shake !== null && <p className="feedback gentle" role="status">Not yet. What happened first?</p>}
      {done && <GameEnd text="Your story map is done!" onNext={() => onDone({ correct: Math.max(1, parts.length - mistakes), total: parts.length })} />}
    </div>
  )
}

// ---------- 🎧 Listen and Speak ----------

// Shown when the microphone is blocked: games keep working without it.
function MicHelp() {
  return (
    <p className="mic-note" role="status">
      The microphone is turned off. Tap the lock or mic icon next to the web address and choose Allow. Or say it out loud and tap the button.
    </p>
  )
}

// 🎤 Echo Reader: hear a sentence, then say it back like a storyteller.
export function EchoReader({ chapter, onDone }) {
  const rounds = useMemo(() => echoRounds(chapter), [chapter])
  const check = useSpeechCheck()
  const [round, setRound] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [live, setLive] = useState(new Set())
  const [passed, setPassed] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [correct, setCorrect] = useState(0)
  const r = rounds[round]

  if (!r) return <GameEnd text="You read like a storyteller!" onNext={() => onDone({ correct, total: Math.max(1, rounds.length) })} />

  const matchedFor = (alt) => new Set([...alignTranscript(r.words, alt).matched].map((i) => r.words[i].index))

  const sayIt = async () => {
    setFeedback('')
    setLive(new Set())
    window.speechSynthesis?.cancel() // don't let the mic hear Poppy
    const heard = await check.listen({ maxSeconds: 12, onPartial: (t) => setLive(matchedFor(t)) })
    const best = heard.map(matchedFor).reduce((a, b) => (b.size > a.size ? b : a), new Set())
    setLive(best)
    if (best.size / r.words.length >= 0.6) {
      setPassed(true)
      if (attempts === 0) setCorrect((c) => c + 1)
      setFeedback('Wonderful reading!')
    } else {
      setAttempts((a) => a + 1)
      setFeedback(heard.length ? 'Good try! Listen once more, then say it again.' : "I couldn't hear you. Tap the microphone and try again.")
    }
  }

  const advance = () => {
    setRound(round + 1)
    setAttempts(0)
    setLive(new Set())
    setPassed(false)
    setFeedback('')
  }

  return (
    <div className="game">
      <span className="case-label">{round + 1} of {rounds.length}</span>
      <Instructions text="Listen, then say the sentence out loud." />
      <p className="echo-sentence" aria-label={r.text}>
        {r.words.map((w) => (
          <span key={w.index} className={live.has(w.index) || passed ? 'w read' : 'w'}>
            {w.display}{' '}
          </span>
        ))}
      </p>
      <div className="word-help-actions">
        <button type="button" className="t-chip" onClick={() => speak(r.text, { rate: 0.9 })}>🔊 Hear it</button>
        <button type="button" className="t-chip" onClick={() => speak(r.text, { rate: 0.5 })}>🐢 Slowly</button>
      </div>
      {feedback && <p className={passed ? 'feedback good' : 'feedback gentle'} role="status">{feedback}</p>}
      {check.blocked && !passed && <MicHelp />}
      <div className="rescue-controls">
        {passed ? (
          <button type="button" className="start" onClick={advance}>Next →</button>
        ) : check.supported && !check.blocked ? (
          <button type="button" className={check.listening ? 'record-btn listening' : 'record-btn'} disabled={check.listening} onClick={sayIt}>
            🎤 {check.listening ? 'Listening…' : 'Say it'}
          </button>
        ) : (
          // No microphone support: the student says it out loud and taps.
          <button
            type="button"
            className="record-btn"
            onClick={() => {
              setPassed(true)
              if (attempts === 0) setCorrect((c) => c + 1)
              setFeedback('Wonderful reading!')
            }}
          >
            I said it out loud
          </button>
        )}
        {!passed && (
          <button type="button" className={attempts >= 2 ? 't-chip highlight' : 'back'} disabled={check.listening} onClick={advance}>
            {attempts >= 2 ? 'Keep going →' : 'Skip'}
          </button>
        )}
      </div>
    </div>
  )
}

// 👂 Sound Detective: hear what a word means, then tap the word.
export function SoundDetective({ story, onDone }) {
  const rounds = useMemo(() => listenRounds(story), [story])
  const [round, setRound] = useState(0)
  const [justListen, setJustListen] = useState(false)
  const [wrong, setWrong] = useState([])
  const [solved, setSolved] = useState(false)
  const [correct, setCorrect] = useState(0)
  const r = rounds[round]

  if (!r) return <GameEnd text="Great listening!" onNext={() => onDone({ correct, total: Math.max(1, rounds.length) })} />

  return (
    <div className="game">
      <span className="case-label">{round + 1} of {rounds.length}</span>
      <Instructions text="Listen to the clue. Which word is it?" />
      <div className="case-file">
        <button type="button" className="t-chip highlight" onClick={() => speak(r.definition)}>🔊 Hear the clue</button>
        <button type="button" className="t-chip" onClick={() => speak(r.definition, { rate: 0.5 })}>🐢 Slowly</button>
        <button type="button" className="t-chip" aria-pressed={justListen} onClick={() => setJustListen(!justListen)}>
          {justListen ? '👁 Show the clue' : '🙈 Just listen'}
        </button>
        {!justListen && <p className="claim">{r.definition}</p>}
      </div>
      <div className="cloze-choices">
        {r.choices.map((c) => (
          <button
            key={c}
            type="button"
            disabled={solved || wrong.includes(c)}
            className={solved && c === r.word ? 'choice-btn right' : wrong.includes(c) ? 'choice-btn wrong' : 'choice-btn'}
            onClick={() => {
              if (c === r.word) {
                setSolved(true)
                if (!wrong.length) setCorrect((n) => n + 1)
                speak(`${r.word}. ${r.example}`)
              } else {
                setWrong([...wrong, c])
                speak(c)
              }
            }}
          >
            {solved && c === r.word ? '✓ ' : ''}{c}
          </button>
        ))}
      </div>
      {wrong.length > 0 && !solved && <p className="feedback gentle" role="status">Not that one. Hear the clue again!</p>}
      {solved && (
        <div className="feedback good" role="status">
          <p>Yes! “{r.word}” — {r.example}</p>
          <Next
            onClick={() => {
              setRound(round + 1)
              setWrong([])
              setSolved(false)
            }}
          />
        </div>
      )}
    </div>
  )
}

// ---------- ✍️ Read and Write ----------

// 🔤 Sentence Builder: tap the words to put a sentence back together.
export function SentenceBuilder({ chapter, onDone }) {
  const rounds = useMemo(() => buildRounds(chapter), [chapter])
  const [round, setRound] = useState(0)
  const [placed, setPlaced] = useState([])
  const [helped, setHelped] = useState(false)
  const [correct, setCorrect] = useState(0)
  const r = rounds[round]

  if (!r) return <GameEnd text="You built every sentence!" onNext={() => onDone({ correct, total: Math.max(1, rounds.length) })} />

  const full = placed.length === r.words.length
  const right = full && placed.every((c, i) => c.display === r.words[i].display)

  const place = (card) => {
    const next = [...placed, card]
    setPlaced(next)
    if (next.length === r.words.length && next.every((c, i) => c.display === r.words[i].display)) {
      if (!helped) setCorrect((c) => c + 1)
      speak(r.text)
    }
  }

  const hint = () => {
    setHelped(true)
    const need = r.words[placed.length]
    // If an earlier word is out of place, take the wrong ones back first.
    const firstBad = placed.findIndex((c, i) => c.display !== r.words[i].display)
    if (firstBad >= 0) return setPlaced(placed.slice(0, firstBad))
    const card = r.cards.find((c) => !placed.includes(c) && c.display === need.display)
    if (card) place(card)
  }

  return (
    <div className="game">
      <span className="case-label">{round + 1} of {rounds.length}</span>
      <Instructions text="Tap the words in the right order to build the sentence." />
      <div className={right ? 'build-line right' : 'build-line'} aria-live="polite" aria-label="Your sentence">
        {placed.length === 0 && <span className="build-empty">Your sentence goes here</span>}
        {placed.map((c, i) => (
          <button key={c.i} type="button" className="build-word placed" disabled={right} onClick={() => setPlaced(placed.filter((_, k) => k < i))} aria-label={`${c.display}, tap to take it back`}>
            {c.display}
          </button>
        ))}
      </div>
      {!right && (
        <div className="build-bank">
          {r.cards
            .filter((c) => !placed.includes(c))
            .map((c) => (
              <button key={c.i} type="button" className="build-word" onClick={() => place(c)}>
                {c.display}
              </button>
            ))}
        </div>
      )}
      {full && !right && <p className="feedback gentle" role="status">Almost! Tap a word to take it out, along with the words after it, then try again. The 💡 hint can help.</p>}
      {!right && (
        <div className="word-help-actions">
          <button type="button" className="t-chip" onClick={() => speak(r.text)}>🔊 Hear the sentence</button>
          <button type="button" className="t-chip" onClick={hint}>💡 Hint</button>
        </div>
      )}
      {right && (
        <div className="feedback good" role="status">
          <p>✓ You built it! “{r.text}”</p>
          <Next
            onClick={() => {
              setRound(round + 1)
              setPlaced([])
              setHelped(false)
            }}
          />
        </div>
      )}
    </div>
  )
}

const usesWord = (text, word) => {
  const stem = normalizeWord(word).slice(0, Math.max(3, normalizeWord(word).length - 2))
  return text.split(/\s+/).some((w) => normalizeWord(w).startsWith(stem))
}

// 📝 Word Workshop: use a story word in a sentence of your own (type or say it).
export function WordWorkshop({ story, onDone }) {
  const rounds = useMemo(() => workshopRounds(story), [story])
  const [round, setRound] = useState(0)
  const [text, setText] = useState('')
  const [tries, setTries] = useState(0)
  const [state, setState] = useState('write') // write | nudge | good
  const [correct, setCorrect] = useState(0)
  const r = rounds[round]

  if (!r) return <GameEnd text="You used every word!" onNext={() => onDone({ correct, total: Math.max(1, rounds.length) })} />

  const check = () => {
    const long = text.trim().split(/\s+/).length >= 3
    if (usesWord(text, r.word) && long) {
      setState('good')
      setCorrect((c) => c + 1)
    } else {
      setTries((t) => t + 1)
      setState('nudge')
    }
  }

  const advance = () => {
    setRound(round + 1)
    setText('')
    setTries(0)
    setState('write')
  }

  return (
    <div className="game">
      <span className="case-label">{round + 1} of {rounds.length}</span>
      <Instructions text={`Use the word “${r.word}” in a sentence of your own.`} />
      <div className="case-file">
        <strong className="workshop-word">{r.word}</strong>
        <SpeakButton text={`${r.word}. ${r.definition}`} />
        <p className="claim">{r.definition}</p>
        <p className="note">Example: {r.example}</p>
      </div>
      {state !== 'good' ? (
        <>
          <AnswerBox value={text} onChange={setText} label="Your sentence" placeholder="Type it, or tap 🎤 and say it" starters={['I', 'The', 'My friend']} />
          {state === 'nudge' && (
            <p className="feedback gentle" role="status">
              Almost! Try a sentence with at least three words that has “{r.word}” in it.
            </p>
          )}
          <div className="q-next">
            <button type="button" className={tries >= 2 ? 't-chip highlight' : 'back'} onClick={advance}>
              {tries >= 2 ? 'Keep going →' : 'Skip'}
            </button>
            <button type="button" className="start" disabled={!text.trim()} onClick={check}>
              Check
            </button>
          </div>
        </>
      ) : (
        <div className="feedback good" role="status">
          <p>✓ Great sentence!</p>
          <p className="your-answer">“{text.trim()}”</p>
          <SpeakButton text={text} />
          <Next onClick={advance} />
        </div>
      )}
    </div>
  )
}

// ---------- 🧭 Interactive Explorer ----------

// 🔮 Predict & Peek: guess what happens next, then peek to see.
export function PredictPeek({ chapter, onDone }) {
  const rounds = useMemo(() => predictRounds(chapter), [chapter])
  const [round, setRound] = useState(0)
  const [phase, setPhase] = useState('predict') // predict | peek
  const [pic, setPic] = useState(null)
  const [text, setText] = useState('')
  const [rated, setRated] = useState(null)
  const r = rounds[round]
  const ratedCount = useRef(0)

  if (!r) {
    return <GameEnd text="You thought like a story detective!" onNext={() => onDone({ correct: Math.max(1, ratedCount.current), total: Math.max(1, rounds.length) })} />
  }

  const options = [...new Set(r.pics.filter((p) => p !== r.now.art))]
  const ready = pic || text.trim().length > 2

  const advance = (rating) => {
    ratedCount.current += 1
    setRated(rating)
  }

  return (
    <div className="game">
      <span className="case-label">{round + 1} of {rounds.length}</span>
      <div className="case-file">
        <span className="picture-art small" aria-hidden="true">{r.now.art}</span>
        <p className="claim">{r.now.text}</p>
        <SpeakButton text={r.now.text} />
      </div>

      {phase === 'predict' ? (
        <>
          <Instructions text="What do you think happens next? There are no wrong guesses!" />
          <p className="note">Pick a picture, say it, or type it.</p>
          <div className="picture-grid" role="group" aria-label="Which picture might come next?">
            {options.map((art, i) => (
              <button key={art} type="button" aria-pressed={pic === art} aria-label={`Picture ${LETTERS[i]}`} className={pic === art ? 'picture-btn picked' : 'picture-btn'} onClick={() => setPic(pic === art ? null : art)}>
                <span className="picture-art" aria-hidden="true">{art}</span>
                <span className="picture-tag">{pic === art ? '✓ My guess' : LETTERS[i]}</span>
              </button>
            ))}
          </div>
          <AnswerBox value={text} onChange={setText} label="My prediction" rows={2} placeholder="I think… (you can say it with 🎤)" starters={['I think', 'Maybe', 'I wonder if']} />
          <div className="q-next">
            <button type="button" className="start" disabled={!ready} onClick={() => setPhase('peek')}>
              👀 Peek!
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="feedback good peek" role="status">
            <span className="picture-art small" aria-hidden="true">{r.next.art}</span>
            <p>{r.next.text}</p>
            <SpeakButton text={r.next.text} />
          </div>
          {rated === null ? (
            <>
              <Instructions text="How close was your guess?" />
              <div className="rate-row">
                <button type="button" className="choice-btn" onClick={() => advance('close')}>🎯 Spot on!</button>
                <button type="button" className="choice-btn" onClick={() => advance('some')}>👍 Kind of</button>
                <button type="button" className="choice-btn" onClick={() => advance('surprise')}>😮 A surprise!</button>
              </div>
            </>
          ) : (
            <>
              <p className="feedback gentle" role="status">
                {rated === 'surprise' ? 'Surprises make stories fun. Good thinking!' : 'Nice predicting! Good readers guess, then check.'}
              </p>
              <Next
                onClick={() => {
                  setRound(round + 1)
                  setPhase('predict')
                  setPic(null)
                  setText('')
                  setRated(null)
                }}
              />
            </>
          )}
        </>
      )}
    </div>
  )
}

// 🕵️ True or Tricky?: does the statement match the story, or is it a sneaky mix-up?
export function TrueOrTricky({ chapter, onDone }) {
  const rounds = useMemo(() => trickyRounds(chapter), [chapter])
  const [round, setRound] = useState(0)
  const [answer, setAnswer] = useState(null) // 'true' | 'tricky'
  const [correct, setCorrect] = useState(0)
  const r = rounds[round]

  if (!r) return <GameEnd text="Nothing tricky gets past you!" onNext={() => onDone({ correct, total: Math.max(1, rounds.length) })} />

  const statement = `${r.question} → “${r.shown}”`
  const choose = (a) => {
    if (answer) return
    setAnswer(a)
    if ((a === 'tricky') === r.tricky) setCorrect((c) => c + 1)
  }
  const wasRight = answer && (answer === 'tricky') === r.tricky

  return (
    <div className="game">
      <span className="case-label">{round + 1} of {rounds.length}</span>
      <Instructions text="Does this match the story, or is it tricky?" />
      <div className="case-file">
        <p className="claim">{statement}</p>
        <SpeakButton text={statement.replace('→', '. The answer says')} />
      </div>
      <div className="rate-row">
        <button type="button" className={answer === 'true' ? 'choice-btn picked' : 'choice-btn'} disabled={!!answer} onClick={() => choose('true')}>✅ Matches the story</button>
        <button type="button" className={answer === 'tricky' ? 'choice-btn picked' : 'choice-btn'} disabled={!!answer} onClick={() => choose('tricky')}>🤔 Tricky! Not quite</button>
      </div>
      {answer && (
        <div className={wasRight ? 'feedback good' : 'feedback gentle'} role="status">
          <p>
            <strong>{wasRight ? '✓ You spotted it!' : 'Good try! Let’s look at the story.'}</strong>{' '}
            {r.tricky ? `This one was tricky. The story says: “${r.truth}”.` : 'This one matches the story.'}
          </p>
          <p className="evidence-quote">Proof: {r.proof}</p>
          <SpeakButton text={r.proof} />
          <Next
            onClick={() => {
              setRound(round + 1)
              setAnswer(null)
            }}
          />
        </div>
      )}
    </div>
  )
}

function GameEnd({ text, onNext }) {
  return (
    <div className="game-end" role="status">
      <p className="result-message">{text}</p>
      <button type="button" className="start" onClick={onNext}>
        Next →
      </button>
    </div>
  )
}
