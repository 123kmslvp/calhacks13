import { useEffect, useState } from 'react'
import Poppy from '../components/Poppy.jsx'
import SpeakButton from '../components/SpeakButton.jsx'
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
export default function PathwayActivity({ plan, pathway, passage, grade, preferSpeak, onDone }) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [phase, setPhase] = useState('answer') // answer | thinking | feedback
  const [reply, setReply] = useState(null)

  useEffect(() => {
    if (!plan) onDone()
  }, [plan, onDone])

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

  const check = async () => {
    setPhase('thinking')
    const res = await askAgent('socratic', {
      passage,
      question: prompt.text,
      studentAnswer: text.trim().slice(0, 1500),
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
              <strong>{v.word}</strong>: {v.studentFriendlyMeaning}
            </li>
          ))}
        </ul>
      )}

      <div className="section-head">
        <h2 className="heading q-prompt" id="activity-heading">
          {prompt.text}
        </h2>
        <SpeakButton text={prompt.text} />
      </div>

      {phase === 'answer' && (
        <>
          <AnswerBox
            value={text}
            onChange={setText}
            preferSpeak={speaking}
            label="Your answer"
            placeholder={speaking ? 'Say it, or type it' : 'Type your answer'}
            starters={[]}
          />
          <div className="q-next">
            <button type="button" className="back" onClick={next}>
              Skip
            </button>
            <button type="button" className="start" disabled={!text.trim()} onClick={check}>
              Check
            </button>
          </div>
        </>
      )}

      {phase === 'thinking' && (
        <>
          <div className="your-answer">“{text}”</div>
          <div className="feedback gentle poppy-thinking" role="status" aria-live="polite">
            <Poppy size="chip" />
            <p>Poppy is thinking about your answer…</p>
          </div>
        </>
      )}

      {phase === 'feedback' && (
        <>
          <div className="your-answer">“{text}”</div>
          {reply ? (
            <>
              <div className={reply.isCorrect ? 'feedback good' : 'feedback gentle'} role="status">
                <p>
                  <strong>{reply.encouragement}</strong>
                </p>
                <p>{reply.feedback}</p>
                <p className="agent-meta">
                  <span className="agent-chip">Skill: {reply.skillPracticed}</span>
                  <span className="agent-chip">⭐ {reply.points} thinking points</span>
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
