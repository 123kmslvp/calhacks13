import { useMemo, useState } from 'react'
import SpeakButton, { speak } from '../../components/SpeakButton.jsx'
import { tokenizePassage } from '../readAloud.js'
import { clozeRounds, evidenceRounds, sequenceRound, shuffle, vocabRound } from './gameData.js'

// Each game calls onDone({ correct, total }) when finished. Mistakes never
// end a game — kids get a nudge and keep trying.

// 🧩 Story Sequencer: tap the events in the order they happened.
export function SequenceGame({ chapter, onDone }) {
  const events = useMemo(() => sequenceRound(chapter), [chapter])
  const [cards] = useState(() => {
    let s = shuffle(events)
    while (events.length > 1 && s.every((c, i) => c.i === events[i].i)) s = shuffle(events)
    return s
  })
  const [placed, setPlaced] = useState([])
  const [shake, setShake] = useState(null)
  const [mistakes, setMistakes] = useState(0)
  const done = placed.length === events.length

  const tap = (card) => {
    if (card.i === events[placed.length].i) {
      setPlaced([...placed, card])
    } else {
      setShake(card.i)
      setMistakes((m) => m + 1)
      setTimeout(() => setShake(null), 500)
    }
  }

  return (
    <div className="game">
      <p className="game-instructions">
        Tap them in order. What came first?
      </p>
      <ol className="sequence-slots">
        {events.map((_, i) => (
          <li key={i} className={placed[i] ? 'slot filled' : i === placed.length ? 'slot next' : 'slot'}>
            <span className="slot-num">{i + 1}</span>
            {placed[i]?.text ?? ''}
          </li>
        ))}
      </ol>
      {!done && (
        <div className="sequence-cards">
          {cards
            .filter((c) => !placed.includes(c))
            .map((c) => (
              <button key={c.i} type="button" className={shake === c.i ? 'event-card shake' : 'event-card'} onClick={() => tap(c)}>
                {c.text}
              </button>
            ))}
        </div>
      )}
      {shake !== null && <p className="feedback" role="status">Not yet!</p>}
      {done && (
        <GameEnd
          text="You did it!"
          onNext={() => onDone({ correct: Math.max(1, events.length - mistakes), total: events.length })}
        />
      )}
    </div>
  )
}

// 🍿 Vocab Pop: tap a word kernel, then its meaning. Match = POP!
export function VocabPop({ story, onDone }) {
  const words = useMemo(() => vocabRound(story), [story])
  const [meanings] = useState(() => shuffle(words))
  const [picked, setPicked] = useState(null)
  const [popped, setPopped] = useState([])
  const [wrong, setWrong] = useState(null)
  const [firstTry, setFirstTry] = useState(new Set(words.map((w) => w.word)))
  const done = popped.length === words.length

  const chooseMeaning = (m) => {
    if (!picked) return
    if (m.word === picked) {
      setPopped([...popped, picked])
      speak(picked)
      setPicked(null)
    } else {
      setWrong(m.word)
      setFirstTry((f) => {
        const n = new Set(f)
        n.delete(picked)
        return n
      })
      setTimeout(() => setWrong(null), 500)
    }
  }

  return (
    <div className="game">
      <p className="game-instructions">Tap a word, then its meaning.</p>
      <div className="kernels">
        {words.map((w) => (
          <button
            key={w.word}
            type="button"
            disabled={popped.includes(w.word)}
            className={popped.includes(w.word) ? 'kernel-word popped' : picked === w.word ? 'kernel-word picked' : 'kernel-word'}
            onClick={() => setPicked(w.word)}
          >
            {w.word}
          </button>
        ))}
      </div>
      <div className="meanings">
        {meanings.map((m) => (
          <button
            key={m.word}
            type="button"
            disabled={popped.includes(m.word)}
            className={popped.includes(m.word) ? 'meaning matched' : wrong === m.word ? 'meaning shake' : 'meaning'}
            onClick={() => chooseMeaning(m)}
          >
            {m.definition}
          </button>
        ))}
      </div>
      {done && <GameEnd text="You did it!" onNext={() => onDone({ correct: firstTry.size, total: words.length })} />}
    </div>
  )
}

// 🔍 Evidence Detective: find the sentence that proves the claim.
export function EvidenceHunt({ chapter, onDone }) {
  const rounds = useMemo(() => evidenceRounds(chapter), [chapter])
  const texts = useMemo(() => tokenizePassage(chapter.text).sentences.map((s) => s.map((w) => w.display).join(' ')), [chapter])
  const [round, setRound] = useState(0)
  const [wrong, setWrong] = useState([])
  const [found, setFound] = useState(false)
  const [correct, setCorrect] = useState(0)
  const r = rounds[round]

  if (!r) return <GameEnd text="You did it!" onNext={() => onDone({ correct, total: rounds.length })} />

  const tap = (i) => {
    if (found) return
    if (i === r.answer) {
      setFound(true)
      if (wrong.length === 0) setCorrect((c) => c + 1)
    } else {
      setWrong([...wrong, i])
    }
  }

  return (
    <div className="game">
      <div className="case-file">
        <span className="case-label">{round + 1} of {rounds.length}</span>
        <p className="claim">{r.claim}</p>
        <SpeakButton text={r.claim.replace('→', '. The answer is')} />
      </div>
      <p className="game-instructions">Tap the sentence that proves it.</p>
      {wrong.length > 0 && !found && <p className="feedback">Not that one. {r.hint}</p>}
      <ul className="sentence-list tall">
        {texts.map((t, i) => (
          <li key={i}>
            <button
              type="button"
              className={found && i === r.answer ? 'sentence-btn proof' : wrong.includes(i) ? 'sentence-btn nope' : 'sentence-btn'}
              disabled={wrong.includes(i)}
              onClick={() => tap(i)}
            >
              {t}
            </button>
          </li>
        ))}
      </ul>
      {found && (
        <div className="feedback good">
          <p>Yes!</p>
          <div className="q-next">
            <button
              type="button"
              className="start"
              onClick={() => {
                setRound(round + 1)
                setWrong([])
                setFound(false)
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ✏️ Missing Word: pick the word that fits, using the sentence as a clue.
export function MissingWord({ story, onDone }) {
  const rounds = useMemo(() => clozeRounds(story), [story])
  const [round, setRound] = useState(0)
  const [wrong, setWrong] = useState([])
  const [solved, setSolved] = useState(false)
  const [correct, setCorrect] = useState(0)
  const r = rounds[round]

  if (!r) return <GameEnd text="You did it!" onNext={() => onDone({ correct, total: rounds.length })} />

  return (
    <div className="game">
      <span className="case-label">{round + 1} of {rounds.length}</span>
      <p className="cloze">
        {r.before}{' '}
        <span className={solved ? 'blank filled' : 'blank'}>{solved ? r.answer : '_____'}</span>
        {r.punctuation} {r.after}
      </p>
      <p className="game-instructions">Which word fits?</p>
      <div className="cloze-choices">
        {r.choices.map((c) => (
          <button
            key={c}
            type="button"
            disabled={solved || wrong.includes(c)}
            className={solved && c === r.answer ? 'choice-btn right' : wrong.includes(c) ? 'choice-btn wrong' : 'choice-btn'}
            onClick={() => {
              if (c === r.answer) {
                setSolved(true)
                if (!wrong.length) setCorrect((n) => n + 1)
                speak(r.sentence)
              } else setWrong([...wrong, c])
            }}
          >
            {c}
          </button>
        ))}
      </div>
      {wrong.length > 0 && !solved && <p className="feedback">Try another!</p>}
      {solved && (
        <div className="q-next">
          <button
            type="button"
            className="start"
            onClick={() => {
              setRound(round + 1)
              setWrong([])
              setSolved(false)
            }}
          >
            Next →
          </button>
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
