import { useDictation } from './useDictation.js'

// A text answer the student can type or speak. `preferSpeak` puts the
// microphone button first for students who chose "Say my answers".
export default function AnswerBox({ value, onChange, onSpeak, placeholder, preferSpeak, rows = 3, label, starters = [] }) {
  const dictation = useDictation(onChange)

  const speakButton = dictation.supported && (
    <button
      type="button"
      className={dictation.listening ? 'speak-answer listening' : 'speak-answer'}
      aria-pressed={dictation.listening}
      onClick={() => {
        if (dictation.listening) return dictation.stop()
        onSpeak?.()
        dictation.start(value)
      }}
    >
      {dictation.listening ? '⏹ Stop' : '🎤 Say it'}
    </button>
  )

  return (
    <div className="answer-box">
      {starters.length > 0 && (
        <div className="starters" aria-label="Sentence starters">
          {starters.map((s) => (
            <button
              key={s}
              type="button"
              className="starter"
              onClick={() => onChange(value.trim() ? `${value.trim()} ${s}` : s)}
            >
              {s}…
            </button>
          ))}
        </div>
      )}
      {preferSpeak && !dictation.supported && (
        <p className="mic-note" role="status">This browser can't listen to you. Type your answer, or open Kernel Quest in Chrome, Edge, or Safari to talk instead.</p>
      )}
      {dictation.problem && (
        <p className="mic-note" role="status">
          {dictation.problem === 'blocked'
            ? 'The microphone is turned off. Tap the lock or mic icon next to the web address and choose Allow. You can also type your answer.'
            : 'The microphone could not connect to the internet. Try again, or type your answer.'}
        </p>
      )}
      <div className={preferSpeak ? 'answer-row speak-first' : 'answer-row'}>
        <textarea
          className="answer-input"
          rows={rows}
          value={value}
          aria-label={label}
          placeholder={dictation.listening ? 'Listening… say your answer!' : placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        {speakButton}
      </div>
    </div>
  )
}
