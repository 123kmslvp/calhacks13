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
