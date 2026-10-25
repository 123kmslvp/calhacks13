import { useState } from 'react'
import SpeakButton from '../components/SpeakButton.jsx'
import AnswerBox from './AnswerBox.jsx'

const MIN_WORDS = 5

// A short creative writing activity about the story. Students can type or
// speak; there's no grading — just encouragement to share their ideas.
export default function WritingActivity({ story, preferSpeak, onSave, onCancel }) {
  const [text, setText] = useState('')
  const [spoken, setSpoken] = useState(false)
  const count = text.split(/\s+/).filter(Boolean).length

  return (
    <section className="writing" aria-labelledby="writing-heading">
      <div className="section-head">
        <h2 className="heading" id="writing-heading">
          Your turn to write
        </h2>
        <SpeakButton text={story.writingPrompt} />
      </div>
      <p className="writing-prompt">{story.writingPrompt}</p>
      <AnswerBox
        value={text}
        onChange={setText}
        onSpeak={() => setSpoken(true)}
        preferSpeak={preferSpeak}
        rows={7}
        label="Your writing"
        placeholder="Type or say your story"
        starters={[]}
      />
      <p className="note">
        {count < MIN_WORDS ? 'No wrong answers!' : `${count} words`}
      </p>
      <div className="step-nav">
        <button type="button" className="back" onClick={onCancel}>
          ← Back
        </button>
        <button
          type="button"
          className="start"
          disabled={count < MIN_WORDS}
          onClick={() => onSave(text.trim(), spoken ? 'spoken' : 'typed')}
        >
          Done
        </button>
      </div>
    </section>
  )
}
