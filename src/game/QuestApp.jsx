import { useEffect, useState } from 'react'
import Poppy from '../components/Poppy.jsx'
import { storyOfChapter } from '../data/stories/index.js'
import {
  applyChapterSession,
  applyDrawing,
  applyWriting,
  rescuePoints,
} from '../data/progress.js'
import { saveDrawing } from '../data/drawings.js'
import { useReadAloud } from './useReadAloud.js'
import AdventureMap, { StoryIntro } from './AdventureMap.jsx'
import ReadExplore, { defaultMode } from './ReadExplore.jsx'
import ReadingFeedback from './ReadingFeedback.jsx'
import WordRescue from './WordRescue.jsx'
import Questions from './Questions.jsx'
import Rewards from './Rewards.jsx'
import NextSteps from './NextSteps.jsx'
import DrawingPad from './DrawingPad.jsx'
import WritingActivity from './WritingActivity.jsx'
import './game.css'

// A short title for each screen, so students always know where they are.
const TITLES = {
  map: 'Stories',
  intro: 'Stories',
  read: 'Read',
  feedback: 'Read',
  rescue: 'Tricky words',
  questions: 'Questions',
  rewards: 'Great job!',
  next: 'Next',
  draw: 'Draw',
  write: 'Write',
  celebrate: 'Great job!',
}

const stickersFor = (chapter) => [
  ...new Set([...(chapter.scene.match(/\p{Extended_Pictographic}/gu) ?? []), '🍿', '⭐', '❤️', '🌈', '☀️', '🌳']),
]

export default function QuestApp({ student, preferences, onSaveStudent, onExit, onProgress, onArcade }) {
  const [step, setStep] = useState('map')
  const [story, setStory] = useState(null)
  const [chapter, setChapter] = useState(null)
  const [session, setSession] = useState(null) // the chapter in progress
  const [result, setResult] = useState(null) // saved chapter session
  const [celebration, setCelebration] = useState(null) // drawing / writing / practice
  const [mode, setMode] = useState(() => defaultMode(preferences))
  const [readKey, setReadKey] = useState(0)
  const recorder = useReadAloud()
  const preferSpeak = preferences.includes('speak') && !preferences.includes('type')

  useEffect(() => () => window.speechSynthesis?.cancel(), [])
  useEffect(() => {
    window.scrollTo?.({ top: 0, behavior: 'smooth' })
  }, [step])

  const openStory = (s) => {
    setStory(s)
    setStep('intro')
  }

  const readChapter = (c) => {
    const s = storyOfChapter(c.id)
    recorder.reset()
    setStory(s)
    setChapter({ ...c, number: s.chapters.findIndex((x) => x.id === c.id) + 1 })
    setSession(null)
    setResult(null)
    setReadKey((k) => k + 1)
    setStep('read')
  }

  const finishReading = (reading) => {
    const next = { story, chapter, ...reading, rescued: [], answers: [] }
    setSession(next)
    setStep(reading.aloud ? 'feedback' : 'questions')
  }

  const finishQuestions = (answers, questionSeconds) => {
    const full = { ...session, answers, questionSeconds, questionCount: chapter.questions.length }
    const applied = applyChapterSession(student, full)
    onSaveStudent(applied.student)
    setSession(full)
    setResult(applied)
    setStep('rewards')
  }

  const celebrate = (applied, title, extra) => {
    onSaveStudent(applied.student)
    setCelebration({ ...applied, title, ...extra })
    setStep('celebrate')
  }

  const onNextAction = (action, payload) => {
    switch (action) {
      case 'chapter':
        return readChapter(payload)
      case 'story':
        return openStory(payload)
      case 'write':
        return setStep('write')
      case 'draw':
        return setStep('draw')
      case 'map':
        return setStep('map')
      case 'progress':
        return onProgress()
      case 'arcade':
        return onArcade(story?.id)
      default:
        return onExit()
    }
  }

  const inChapter = ['read', 'feedback', 'rescue', 'questions'].includes(step)
  const back = () => {
    if (inChapter && !window.confirm('Leave this chapter? You can come back to it any time.')) return
    recorder.reset()
    window.speechSynthesis?.cancel()
    if (step === 'map') return onExit()
    if (step === 'intro') return setStep('map')
    if (inChapter) return setStep('intro')
    if (['draw', 'write', 'celebrate'].includes(step) && chapter) return setStep('next')
    return setStep('map')
  }

  return (
    <main className="welcome">
      <span className="blob blob-1" />
      <span className="blob blob-2" />
      <span className="blob blob-3" />

      <section className="card card-game">
        <div className="progress-top">
          <button type="button" className="back" onClick={back}>
            ← {step === 'map' ? 'Home' : 'Back'}
          </button>
          <span className="game-title">{TITLES[step]}</span>
          <span className="header-actions">
            <button
              type="button"
              className="t-chip small-chip"
              onClick={() => {
                if (inChapter && !window.confirm('Leave this chapter to play games? You can come back any time.')) return
                recorder.reset()
                window.speechSynthesis?.cancel()
                onArcade(story?.id)
              }}
            >
              Games
            </button>
            <span className="points" aria-label={`${student.points} Pop Points`}>
              ⭐ {student.points}
            </span>
          </span>
        </div>

        {step === 'map' && <AdventureMap student={student} onPick={openStory} />}

        {step === 'intro' && story && (
          <StoryIntro
            student={student}
            story={story}
            onStart={readChapter}
            onBack={() => setStep('map')}
            onGames={() => onArcade(story.id)}
          />
        )}

        {step === 'read' && chapter && (
          <ReadExplore
            key={readKey}
            story={story}
            chapter={chapter}
            preferences={preferences}
            initialMode={mode}
            onModeChange={setMode}
            recorder={recorder}
            onFinish={finishReading}
          />
        )}

        {step === 'feedback' && session && (
          <ReadingFeedback
            chapter={chapter}
            result={session}
            grade={student.grade}
            audioUrl={recorder.audioUrl}
            onRetry={() => readChapter(chapter)}
            onNext={() => setStep(session.tricky.length ? 'rescue' : 'questions')}
          />
        )}

        {step === 'rescue' && session && (
          <WordRescue
            tricky={session.tricky}
            sentences={session.sentences}
            continueLabel="Answer questions →"
            onComplete={({ rescued }) => {
              setSession((s) => ({ ...s, rescued }))
              return { total: rescuePoints(student, rescued) }
            }}
            onContinue={() => setStep('questions')}
          />
        )}

        {step === 'questions' && session && (
          <Questions
            chapter={chapter}
            sentences={session.sentences}
            highlights={session.highlights}
            preferSpeak={preferSpeak}
            onDone={finishQuestions}
          />
        )}

        {step === 'rewards' && result && (
          <Rewards result={result} session={session} onContinue={() => setStep('next')} />
        )}

        {step === 'next' && chapter && (
          <NextSteps
            student={student}
            story={story}
            chapter={chapter}
            session={session}
            onAction={onNextAction}
          />
        )}

        {step === 'draw' && chapter && (
          <section aria-labelledby="draw-heading">
            <h2 className="heading" id="draw-heading">
              Draw your favorite part!
            </h2>
            <DrawingPad
              stickers={stickersFor(chapter)}
              onSave={(dataUrl) => {
                const saved = saveDrawing(student.id, { chapterId: chapter.id, chapterTitle: chapter.title, dataUrl })
                celebrate(applyDrawing(student), 'Great drawing!', { image: dataUrl, saved })
              }}
            />
          </section>
        )}

        {step === 'write' && story && (
          <WritingActivity
            story={story}
            preferSpeak={preferSpeak}
            onCancel={() => setStep(chapter ? 'next' : 'map')}
            onSave={(text, how) =>
              celebrate(applyWriting(student, { story, prompt: story.writingPrompt, text, mode: how }), 'Great writing!', { text })
            }
          />
        )}

        {step === 'celebrate' && celebration && (
          <section className="done" aria-labelledby="celebrate-heading">
            <h2 className="heading" id="celebrate-heading">
              {celebration.title}
            </h2>
            {celebration.image && (
              <img className="saved-drawing" src={celebration.image} alt="Your drawing" />
            )}
            {celebration.text && <blockquote className="writing-show">{celebration.text}</blockquote>}
            <p className="earned-line">+{celebration.total} points</p>
            {celebration.grewTo && (
              <div className="grew" role="status">
                <Poppy size="small" stage={celebration.grewTo} />
                <strong>POP! Poppy grew into a {celebration.grewTo.name}!</strong>
              </div>
            )}
            {celebration.badges?.map((b) => (
              <div key={b.id} className="badge-card new inline">
                <span className="badge-icon" aria-hidden="true">{b.icon}</span>
                <strong>New badge: {b.name}</strong> <span>{b.about}</span>
              </div>
            ))}
            {celebration.saved === false && (
              <p className="note">Your drawing couldn’t be saved — this device is out of space.</p>
            )}
            <div className="done-actions">
              <button type="button" className="start" onClick={() => setStep(chapter ? 'next' : 'map')}>
                Next →
              </button>
            </div>
          </section>
        )}
      </section>
    </main>
  )
}
