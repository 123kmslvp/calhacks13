import { useState } from 'react'
import { speak } from '../components/SpeakButton.jsx'
import Poppy from '../components/Poppy.jsx'
import { alignTranscript, normalizeWord, wordsMatch } from './readAloud.js'
import { syllables } from './syllables.js'
import { useSpeechCheck } from './useSpeechCheck.js'

const SENTENCE_PASS = 0.7

// alignTranscript reports positions within the array it's given; convert
// them to the passage-wide word indexes the sentence's words carry.
const matchedInSentence = (sentence, transcript) =>
  new Set([...alignTranscript(sentence, transcript).matched].map((i) => sentence[i].index))

// Word Rescue: for each tricky word, the student ① hears it and says it out
// loud, then ② reads it again in its sentence from the story.
export default function WordRescue({ tricky, sentences, onComplete, onContinue }) {
  const check = useSpeechCheck()
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState('word') // word | sentence | rescued
  const [attempts, setAttempts] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [sentenceHeard, setSentenceHeard] = useState('')
  const [rescued, setRescued] = useState([])
  const [summary, setSummary] = useState(null)

  const item = tricky[index]

  const next = (wasRescued) => {
    const done = wasRescued ? [...rescued, item.word] : rescued
    setRescued(done)
    setFeedback(null)
    setAttempts(0)
    setSentenceHeard('')
    if (index + 1 < tricky.length) {
      setIndex(index + 1)
      setPhase('word')
    } else {
      setSummary({ ...onComplete({ rescued: done, tried: tricky.map((t) => t.word) }), count: done.length })
    }
  }

  if (summary) {
    return (
      <section className="rescue" aria-labelledby="rescue-done">
        <Poppy size="small" />
        <h2 className="heading" id="rescue-done">
          You rescued {summary.count} of {tricky.length} tricky {tricky.length === 1 ? 'word' : 'words'}! 🛟
        </h2>
        {summary.total > 0 ? (
          <p className="earned-line">+{summary.total} Pop Points for Poppy!</p>
        ) : (
          <p className="note">Tricky words get easier every time you practice them.</p>
        )}
        <div className="step-nav">
          <span />
          <button type="button" className="start" onClick={onContinue}>
            Draw my favorite scene 🎨
          </button>
        </div>
      </section>
    )
  }

  const sentence = sentences[item.sentence]
  const label = item.display
  const parts = syllables(label)

  const sayWord = async () => {
    setFeedback(null)
    window.speechSynthesis?.cancel() // don't let the mic hear Poppy's voice
    const heard = await check.listen({ maxSeconds: 5 })
    const gotIt = heard.some((alt) => alt.split(/\s+/).some((w) => wordsMatch(normalizeWord(w), item.word, { strict: true })))
    if (gotIt) {
      setFeedback({ good: true, text: `Yes! “${label}”! Now read it in the sentence.` })
      setAttempts(0)
      setPhase('sentence')
    } else {
      setAttempts((a) => a + 1)
      setFeedback({
        good: false,
        text: heard.length
          ? `Almost! I heard “${heard[0]}”. Listen and try again!`
          : "I didn't hear anything. Press the button and say the word!",
      })
    }
  }

  const readSentence = async () => {
    setFeedback(null)
    setSentenceHeard('')
    window.speechSynthesis?.cancel()
    const heard = await check.listen({ maxSeconds: 12, onPartial: setSentenceHeard })
    // Use whichever way the recognizer heard it that matches the most words.
    const matched = heard
      .map((alt) => matchedInSentence(sentence, alt))
      .reduce((best, m) => (m.size > best.size ? m : best), new Set())
    const share = matched.size / sentence.length
    const wordRead = sentence.some((w) => w.norm === item.word && matched.has(w.index))
    if (share >= SENTENCE_PASS || (wordRead && share >= 0.5)) {
      setPhase('rescued')
      setFeedback({ good: true, text: 'Rescued! 🛟 Great reading!' })
    } else {
      setAttempts((a) => a + 1)
      setFeedback({ good: false, text: "Good try! Let's read the sentence one more time." })
    }
  }

  const liveMatched = phase === 'sentence' ? matchedInSentence(sentence, sentenceHeard) : new Set()

  return (
    <section className="rescue" aria-labelledby="rescue-heading">
      <div className="rescue-head">
        <h2 className="heading" id="rescue-heading">
          Word Rescue 🛟
        </h2>
        <span className="rescue-count">
          Word {index + 1} of {tricky.length}
        </span>
      </div>
      <ol className="rescue-steps" aria-label="Steps">
        <li className={phase === 'word' ? 'active' : 'done'}>① Say the word</li>
        <li className={phase === 'sentence' ? 'active' : phase === 'rescued' ? 'done' : ''}>
          ② Read it in the sentence
        </li>
      </ol>

      <div className={`rescue-card${phase === 'rescued' ? ' rescued' : ''}`}>
        <p className="rescue-word">{label}</p>
        {parts.length > 1 && (
          <div className="part-row">
            {parts.map((part, i) => (
              <button key={i} type="button" className="part" onClick={() => speak(part, { rate: 0.6 })}>
                {part}
              </button>
            ))}
          </div>
        )}
        <div className="word-help-actions">
          <button type="button" className="t-chip" onClick={() => speak(label, { rate: 0.9 })}>
            🔊 Hear it
          </button>
          <button type="button" className="t-chip" onClick={() => speak(label, { rate: 0.45 })}>
            🐢 Slowly
          </button>
        </div>

        {phase !== 'word' && (
          <p className="rescue-sentence">
            {sentence.map((w) => (
              <span
                key={w.index}
                className={[
                  'w',
                  w.norm === item.word ? 'target' : '',
                  liveMatched.has(w.index) || phase === 'rescued' ? 'read' : '',
                ].join(' ')}
              >
                {w.display}{' '}
              </span>
            ))}
          </p>
        )}
      </div>

      {feedback && (
        <p className={feedback.good ? 'feedback good' : 'feedback'} role="status">
          {feedback.text}
        </p>
      )}

      <div className="rescue-controls">
        {phase === 'rescued' ? (
          <button type="button" className="start" onClick={() => next(true)}>
            {index + 1 < tricky.length ? 'Next word →' : 'Finish ✨'}
          </button>
        ) : check.supported ? (
          <button
            type="button"
            className={check.listening ? 'record-btn listening' : 'record-btn'}
            disabled={check.listening}
            onClick={phase === 'word' ? sayWord : readSentence}
          >
            🎤 {check.listening ? 'Listening…' : phase === 'word' ? 'Say the word' : 'Read the sentence'}
          </button>
        ) : (
          // No speech recognition: the student says it and taps to confirm.
          <button
            type="button"
            className="record-btn"
            onClick={() => (phase === 'word' ? setPhase('sentence') : setPhase('rescued'))}
          >
            ✋ {phase === 'word' ? 'I said it!' : 'I read it!'}
          </button>
        )}
        <button
          type="button"
          className={attempts >= 2 ? 't-chip highlight' : 'back'}
          onClick={() => next(false)}
          disabled={check.listening}
        >
          {attempts >= 2 ? 'Skip for now — try it next time' : 'Skip'}
        </button>
      </div>
    </section>
  )
}
