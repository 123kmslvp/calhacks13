import { useEffect, useState } from 'react'
import Poppy from '../components/Poppy.jsx'
import SpeakButton, { speak } from '../components/SpeakButton.jsx'
import { useAutoRead } from '../a11y/accessibility.js'
import { askAgent } from '../services/agents.js'
import AnswerBox from './AnswerBox.jsx'
import { PROMPT_LABELS } from './pathways.js'

// The learning activity Claude built for this student's pathway: a few prompts
// (visual clues, spoken answers, vocabulary and writing, predictions...). Each
// answer goes to the Socratic agent, which encourages the student and asks a
// follow-up question rather than giving the answer.
//
// `plan` is 'loading' while Claude is still writing it, an object when ready,
// or null if it couldn't be made (the student just moves on to the questions).
// Sentence starters per kind of prompt, so no one faces a blank box.
const STARTERS = {
  'visual-clue': ['I can see', 'It looks like', 'I picture'],
  'spoken-response': ['I heard', 'I think', 'The story is about'],
  vocabulary: ['The word means', 'I can use it when', 'My sentence:'],
  writing: ['My favorite part is', 'I liked it because', 'Next,'],
  prediction: ['I predict', 'Maybe', 'I think this because'],
  'choose-path': ['I would choose', 'I would stay because', 'I would try because'],
  'ask-question': ['Why', 'How', 'What if'],
  'check-claim': ['The wrong part is', 'The story says', 'I know because'],
}

const BOX_LABELS = ['Beginning', 'Middle', 'End']

// A three-box story map for "diagram" prompts: a picture per box, a few
// words in each. Students can say or type each part.
function DiagramBuilder({ art, parts, onChange }) {
  const set = (i, v) => onChange(parts.map((p, k) => (k === i ? v : p)))
  return (
    <ol className="diagram-boxes" aria-label="Story map">
      {BOX_LABELS.map((label, i) => (
        <li key={label} className="diagram-box">
          <strong>{label}</strong>
          <span className="map-art" aria-hidden="true">{art?.[i] ?? '❔'}</span>
          <AnswerBox value={parts[i]} onChange={(v) => set(i, v)} label={`${label}: what happens?`} rows={2} placeholder="What happens?" />
        </li>
      ))}
    </ol>
  )
}

export default function PathwayActivity({ plan, pathway, passage, grade, preferSpeak, art, onDone }) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [phase, setPhase] = useState('answer') // answer | thinking | feedback
  const [reply, setReply] = useState(null)
  const [parts, setParts] = useState(['', '', ''])

  useEffect(() => {
    if (!plan) onDone()
  }, [plan, onDone])

  // "Read to me" reads each prompt. Listen and Speak always does: that pathway is
  // built around hearing the story first.
  const promptText = plan && plan !== 'loading' ? plan.prompts[index]?.text : ''
  const alwaysRead = plan && plan !== 'loading' && plan.kind === 'listen-speak'
  useAutoRead(promptText, speak, `${index}-${promptText}`, alwaysRead)

  if (plan === 'loading') {
    return (
      <div className="feedback gentle poppy-thinking" role="status" aria-live="polite">
        <img className="poppy-img poppy-img-small" src="/chick_regular_sprite.png" alt="Poppy the Kernel Quest chick" />
        <p>Poppy is getting your {pathway.name} activity ready…</p>
      </div>
    )
  }
  if (!plan) return null

  const prompts = plan.prompts
  const prompt = prompts[index]
  const last = index === prompts.length - 1
  const speaking = preferSpeak || plan.kind === 'listen-speak'
  const isDiagram = prompt.type === 'diagram'
  const diagramText = BOX_LABELS.map((l, i) => `${l}: ${parts[i].trim()}`).join('. ')
  const answerText = isDiagram ? (parts.every((p) => p.trim()) ? diagramText : '') : text

  const check = async () => {
    setPhase('thinking')
    const res = await askAgent('socratic', {
      passage,
      question: prompt.text,
      studentAnswer: answerText.trim().slice(0, 1500),
      grade,
      pathway: pathway.name,
      // Hidden from the student: only helps Claude judge the answer.
      expectedAnswer: prompt.answerKey || undefined,
    })
    setReply(res?.feedback && res?.followUpQuestion ? res : null)
    setPhase('feedback')
  }

  const next = () => {
    if (last) return onDone()
    setIndex(index + 1)
    setText('')
    setParts(['', '', ''])
    setReply(null)
    setPhase('answer')
  }

  return (
    <section className="pathway-activity" aria-labelledby="activity-heading">
      <div className="q-top">
        <span className="q-type">{PROMPT_LABELS[prompt.type] ?? 'Explore'}</span>
        <span className="rescue-count">
          {index + 1} of {prompts.length}
        </span>
      </div>
      <div className="q-dots" aria-hidden="true">
        {prompts.map((p, i) => (
          <span key={i} className={i < index ? 'q-dot done' : i === index ? 'q-dot now' : 'q-dot'} />
        ))}
      </div>

      {index === 0 && (
        <p className="note pathway-intro">
          <strong>{plan.title}.</strong> {plan.intro}
          {plan.source === 'claude' && <span className="agent-chip claude">Made by Claude for you</span>}
        </p>
      )}

      {index === 0 && plan.kind === 'read-write' && plan.vocab?.length > 0 && (
        <ul className="word-chips" aria-label="Words to know">
          {plan.vocab.map((v) => (
            <li key={v.word}>
              <strong>{v.word}</strong>: {v.studentFriendlyMeaning} <SpeakButton text={`${v.word}. ${v.studentFriendlyMeaning}`} />
            </li>
          ))}
        </ul>
      )}

      {plan.kind === 'visual' && art?.length > 0 && !isDiagram && (
        <div className="scene-strip" role="group" aria-label="Pictures from this part of the story">
          {art.map((a, i) => (
            <span key={i} className="scene-card" aria-hidden="true">{a}</span>
          ))}
        </div>
      )}

      <div className="section-head">
        <h2 className="heading q-prompt" id="activity-heading">
          {prompt.text}
        </h2>
        <SpeakButton text={prompt.text} />
        <button type="button" className="speak speak-slow" onClick={() => speak(prompt.text, { rate: 0.5 })} aria-label="Hear it slowly" title="Hear it slowly">
          🐢
        </button>
      </div>

      {phase === 'answer' && (
        <>
          {isDiagram ? (
            <DiagramBuilder art={art} parts={parts} onChange={setParts} />
          ) : (
            <AnswerBox
              value={text}
              onChange={setText}
              preferSpeak={speaking}
              label="Your answer"
              placeholder={speaking ? 'Say it, or type it' : 'Type your answer'}
              starters={STARTERS[prompt.type] ?? []}
            />
          )}
          <div className="q-next">
            <button type="button" className="back" onClick={next}>
              Skip
            </button>
            <button type="button" className="start" disabled={!answerText.trim()} onClick={check}>
              Check
            </button>
          </div>
        </>
      )}

      {phase === 'thinking' && (
        <>
          <div className="your-answer">“{answerText}”</div>
          <div className="feedback gentle poppy-thinking" role="status" aria-live="polite">
            <Poppy size="chip" />
            <p>Poppy is thinking about your answer…</p>
          </div>
        </>
      )}

      {phase === 'feedback' && (
        <>
          <div className="your-answer">“{answerText}”</div>
          {reply ? (
            <>
              <div className={reply.isCorrect ? 'feedback good' : 'feedback gentle'} role="status">
                <p>
                  <strong>{reply.encouragement}</strong>
                </p>
                <p>{reply.feedback}</p>
                <p className="agent-meta">
                  <span className="agent-chip">Skill: {reply.skillPracticed}</span>
                  <span className="agent-chip">⭐ {reply.points} thinking {reply.points === 1 ? 'point' : 'points'}</span>
                  {reply.meta?.source === 'claude' && <span className="agent-chip claude">Personalized by Claude</span>}
                </p>
                <SpeakButton text={`${reply.encouragement} ${reply.feedback}`} />
              </div>
              <div className="follow-up" role="status">
                <p>{reply.followUpQuestion}</p>
                <SpeakButton text={reply.followUpQuestion} />
              </div>
            </>
          ) : (
            <div className="feedback gentle" role="status">
              <p>
                <strong>Thanks for sharing your thinking!</strong>
              </p>
            </div>
          )}
          <div className="q-next">
            <button type="button" className="start" onClick={next}>
              {last ? 'On to the questions →' : 'Next →'}
            </button>
          </div>
        </>
      )}
    </section>
  )
}
