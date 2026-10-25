import { useMemo, useRef, useState } from 'react'
import SpeakButton from '../components/SpeakButton.jsx'
import { askAgent } from '../services/agents.js'
import AnswerBox from './AnswerBox.jsx'
import {
  QUESTION_TYPES,
  choiceScore,
  evaluateOpen,
  findSentence,
  followUpFor,
  openQuality,
  openScore,
  praiseFor,
} from './questions.js'

const sentenceText = (s) => s.map((w) => w.display).join(' ')

// Comprehension questions for one chapter. Multiple choice gives a hint and
// points back to the story after a miss; open questions ask the student to
// explain with evidence and get one follow-up question to stretch their
// thinking. Open answers go to the Claude Socratic agent (via our backend);
// if it isn't available, the built-in rules below take over.
export default function Questions({ chapter, sentences, highlights, preferSpeak, grade, pathway, onDone }) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const startedRef = useRef(Date.now())
  const question = chapter.questions[index]

  const record = (answer) => {
    const all = [...answers, answer]
    setAnswers(all)
    if (index + 1 < chapter.questions.length) setIndex(index + 1)
    else onDone(all, Math.round((Date.now() - startedRef.current) / 1000))
  }

  const type = QUESTION_TYPES[question.type]
  return (
    <section className="questions" aria-labelledby="q-heading">
      <div className="q-top">
        <span className="q-type">
          {type.kid}
        </span>
        <span className="rescue-count">
          Question {index + 1} of {chapter.questions.length}
        </span>
      </div>
      <div className="q-dots" aria-hidden="true">
        {chapter.questions.map((q, i) => (
          <span key={q.id} className={i < index ? 'q-dot done' : i === index ? 'q-dot now' : 'q-dot'} />
        ))}
      </div>

      <div className="section-head">
        <h2 className="heading q-prompt" id="q-heading">
          {question.prompt}
        </h2>
        <SpeakButton text={question.prompt + (question.choices ? ` ${question.choices.join('. ')}.` : '')} />
      </div>

      <LookBack sentences={sentences} highlights={highlights} />

      {question.open ? (
        <OpenQuestion
          key={question.id}
          question={question}
          sentences={sentences}
          highlights={highlights}
          preferSpeak={preferSpeak}
          passage={chapter.text}
          grade={grade}
          pathway={pathway}
          onAnswer={record}
        />
      ) : (
        <ChoiceQuestion key={question.id} question={question} sentences={sentences} onAnswer={record} />
      )}
    </section>
  )
}

// "Look back at the story" — students can always reread while answering.
function LookBack({ sentences, highlights }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="look-back">
      <button type="button" className="t-chip small-chip" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? 'Hide story' : 'See story'}
      </button>
      {open && (
        <div className="look-back-text">
          {sentences.map((s, i) => (
            <span key={i} className={highlights.has(i) ? 'lb-sentence highlighted' : 'lb-sentence'}>
              {sentenceText(s)}{' '}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function ChoiceQuestion({ question, sentences, onAnswer }) {
  const [tries, setTries] = useState(0)
  const [wrong, setWrong] = useState([])
  const [done, setDone] = useState(null) // { correct }
  const evidenceIndex = findSentence(sentences, question.evidence)
  const evidence = evidenceIndex >= 0 ? sentenceText(sentences[evidenceIndex]) : null

  const choose = (i) => {
    const attempt = tries + 1
    setTries(attempt)
    if (i === question.answer) {
      setDone({ correct: true })
    } else if (attempt >= 2) {
      setWrong([...wrong, i])
      setDone({ correct: false })
    } else {
      setWrong([...wrong, i])
    }
  }

  const missedOnce = tries === 1 && !done
  return (
    <>
      <div className="choices" role="group" aria-label="Answer choices">
        {question.choices.map((c, i) => {
          const isAnswer = i === question.answer
          const state = done && isAnswer ? 'right' : wrong.includes(i) ? 'wrong' : ''
          return (
            <button
              key={c}
              type="button"
              className={`choice-btn ${state}`}
              disabled={!!done || wrong.includes(i)}
              onClick={() => choose(i)}
            >
              <span className="choice-letter" aria-hidden="true">{String.fromCharCode(65 + i)}</span>
              {c}
              {state === 'right' && <span aria-label="correct"> ✅</span>}
            </button>
          )
        })}
      </div>

      {missedOnce && (
        <div className="feedback hint-box" role="status">
          <p>
            <strong>Not quite.</strong> {question.hint}
          </p>
          {evidence && (
            <p className="evidence-quote">
              “{evidence}”
            </p>
          )}
          <SpeakButton text={`Not quite, let's look again. ${question.hint}${evidence ? ` The story says: ${evidence}` : ''}`} />
        </div>
      )}

      {done && (
        <div className={done.correct ? 'feedback good' : 'feedback'} role="status">
          <p>
            {done.correct
              ? tries === 1
                ? 'Yes!'
                : 'You got it!'
              : `The answer is “${question.choices[question.answer]}.”`}
          </p>
          {question.explain && <p>{question.explain}</p>}
          {evidence && (
            <p className="evidence-quote">
              “{evidence}”
            </p>
          )}
          <div className="q-next">
            <button
              type="button"
              className="start"
              onClick={() =>
                onAnswer({
                  questionId: question.id,
                  type: question.type,
                  prompt: question.prompt,
                  tries,
                  correct: done.correct,
                  score: choiceScore(done.correct, tries),
                })
              }
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// Claude's verdict, expressed in the quality levels the rest of the app
// already understands (so Pop Points and teacher charts keep working).
const agentQuality = (a) => (a.isCorrect && a.points >= 8 ? 'strong' : a.isCorrect || a.points >= 4 ? 'partial' : 'short')

function OpenQuestion({ question, sentences, highlights, preferSpeak, passage, grade, pathway, onAnswer }) {
  const [text, setText] = useState('')
  const [evidence, setEvidence] = useState(null) // sentence index
  // answer | thinking | agent (Claude's feedback) | followUp | done (built-in rules)
  const [phase, setPhase] = useState('answer')
  const [agent, setAgent] = useState(null) // Socratic agent response
  const [followUp, setFollowUp] = useState(null)
  const [followText, setFollowText] = useState('')
  const [result, setResult] = useState(null)
  const [answerData, setAnswerData] = useState(null)
  const usedSpeech = useRef(false)
  const markSpoken = () => {
    usedSpeech.current = true
  }

  const sentenceStrings = useMemo(() => sentences.map(sentenceText), [sentences])
  // Highlighted sentences first, so the student's own highlights become evidence.
  const order = useMemo(
    () => [...sentences.keys()].sort((a, b) => (highlights.has(b) ? 1 : 0) - (highlights.has(a) ? 1 : 0)),
    [sentences, highlights]
  )

  const evaluate = (answerText) =>
    evaluateOpen(question, answerText, evidence !== null ? sentenceStrings[evidence] : null, sentenceStrings)

  // Built-in rules: used whenever the Claude agent can't answer.
  const checkLocally = () => {
    const evaluation = evaluate(text)
    const next = followUpFor(question, evaluation)
    if (next) {
      setFollowUp(next)
      setPhase('followUp')
    } else {
      finish(evaluation, null)
    }
  }

  const submit = async () => {
    setPhase('thinking')
    const pickedSentence = evidence !== null ? sentenceStrings[evidence] : null
    const reply = await askAgent('socratic', {
      passage,
      question: question.prompt,
      studentAnswer: (pickedSentence ? `${text.trim()} (The sentence I picked as proof: "${pickedSentence}")` : text.trim()).slice(0, 1500),
      grade,
      pathway,
      // Hidden from the student; the agent uses them only to judge the answer.
      expectedAnswer: question.sample?.slice(0, 600),
      evidence: question.evidence?.join(' ').slice(0, 600),
    })
    // Only a real Claude answer replaces the built-in check. Demo or fallback
    // replies from the server are less detailed than our own rules.
    if (reply?.meta?.source === 'claude' && reply.feedback && reply.followUpQuestion) {
      setAgent(reply)
      setPhase('agent')
    } else {
      checkLocally()
    }
  }

  const finishWithAgent = () => {
    const quality = agentQuality(agent)
    const followAnswer = followText.trim() || null
    onAnswer({
      questionId: question.id,
      type: 'evidence',
      open: true,
      prompt: question.prompt,
      text,
      evidence: evidence !== null ? sentenceStrings[evidence] : null,
      followUp: agent.followUpQuestion,
      followUpAnswer: followAnswer,
      quality,
      mode: usedSpeech.current ? 'spoken' : 'typed',
      tries: 1,
      score: openScore(quality, !!followAnswer),
    })
  }

  const finish = (evaluation, followAnswer) => {
    const quality = openQuality(evaluation)
    setResult({ quality, evaluation, praise: praiseFor(evaluation, quality) })
    setPhase('done')
    setAnswerData({
      questionId: question.id,
      type: 'evidence',
      open: true,
      prompt: question.prompt,
      text,
      evidence: evidence !== null ? sentenceStrings[evidence] : null,
      followUp: followUp?.prompt ?? null,
      followUpAnswer: followAnswer,
      quality,
      mode: usedSpeech.current ? 'spoken' : 'typed',
      tries: 1,
      score: openScore(quality, !!followAnswer),
    })
  }
  const submitFollowUp = () => {
    // Judge the whole explanation: first answer + follow-up together.
    const evaluation = evaluate(`${text} ${followText}`)
    finish(evaluation, followText.trim() || null)
  }

  const evidencePicker = (
    <div className="evidence-picker">
      <p className="note">
        Tap the sentence that proves it.
      </p>
      <ul className="sentence-list">
        {order.map((i) => (
          <li key={i}>
            <button
              type="button"
              className={evidence === i ? 'sentence-btn picked' : 'sentence-btn'}
              aria-pressed={evidence === i}
              onClick={() => setEvidence(evidence === i ? null : i)}
            >
              {sentenceStrings[i]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <div className="open-q">
      {phase === 'answer' && (
        <>
          <AnswerBox
            value={text}
            onChange={setText}
            onSpeak={markSpoken}
            preferSpeak={preferSpeak}
            label="Your answer"
            placeholder="Type or say your answer"
            starters={[]}
          />
          {evidencePicker}
          <div className="q-next">
            <button type="button" className="start" disabled={!text.trim()} onClick={submit}>
              Check
            </button>
          </div>
        </>
      )}

      {phase === 'thinking' && (
        <>
          <div className="your-answer">
            “{text}”
          </div>
          <div className="feedback gentle poppy-thinking" role="status" aria-live="polite">
            <img className="poppy-img poppy-img-small" src="/chick_regular_sprite.png" alt="Poppy the Kernel Quest chick" />
            <p>Poppy is thinking about your answer…</p>
          </div>
        </>
      )}

      {phase === 'agent' && agent && (
        <>
          <div className="your-answer">
            “{text}”
          </div>
          <div className={agent.isCorrect ? 'feedback good' : 'feedback gentle'} role="status">
            <p>
              <strong>{agent.encouragement}</strong>
            </p>
            <p>{agent.feedback}</p>
            <p className="agent-meta">
              <span className="agent-chip">Skill: {agent.skillPracticed}</span>
              <span className="agent-chip">⭐ {agent.points} thinking {agent.points === 1 ? 'point' : 'points'}</span>
              {agent.meta?.source === 'claude' && <span className="agent-chip claude">Personalized by Claude</span>}
            </p>
            <SpeakButton text={`${agent.encouragement} ${agent.feedback}`} />
          </div>
          <div className="follow-up" role="status">
            <p>{agent.followUpQuestion}</p>
            <SpeakButton text={agent.followUpQuestion} />
          </div>
          <AnswerBox
            value={followText}
            onChange={setFollowText}
            onSpeak={markSpoken}
            preferSpeak={preferSpeak}
            label="Tell me more"
            placeholder="Tell me more… (you can skip this)"
            starters={[]}
          />
          <div className="q-next">
            <button type="button" className="start" onClick={finishWithAgent}>
              Next →
            </button>
          </div>
        </>
      )}

      {phase === 'followUp' && followUp && (
        <>
          <div className="your-answer">
            “{text}”
          </div>
          <div className="follow-up" role="status">
            <p>{followUp.prompt}</p>
            <SpeakButton text={followUp.prompt} />
          </div>
          {followUp.kind === 'evidence' && evidencePicker}
          <AnswerBox
            value={followText}
            onChange={setFollowText}
            onSpeak={markSpoken}
            preferSpeak={preferSpeak}
            label="Tell me more"
            placeholder="Tell me more…"
            starters={[]}
          />
          <div className="q-next">
            <button type="button" className="back" onClick={() => finish(evaluate(text), null)}>
              Skip
            </button>
            <button
              type="button"
              className="start"
              disabled={!followText.trim() && evidence === null}
              onClick={submitFollowUp}
            >
              Done
            </button>
          </div>
        </>
      )}

      {phase === 'done' && result && (
        <div className={result.quality === 'strong' ? 'feedback good' : 'feedback gentle'} role="status">
          <p>
            <strong>{result.praise}</strong>
          </p>
          <p className="model-answer">
            <span className="note">One way to say it:</span> {question.sample}
          </p>
          <div className="q-next">
            <button type="button" className="start" onClick={() => onAnswer(answerData)}>
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
