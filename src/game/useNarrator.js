import { useCallback, useEffect, useRef, useState } from 'react'
import { voiceSpeed } from '../a11y/accessibility.js'

const synth = typeof window !== 'undefined' ? window.speechSynthesis : null
export const narratorSupported = !!synth

// Reads the passage aloud one paragraph at a time, reporting the word being
// spoken so the screen can highlight along ("karaoke" reading). Supports
// pause / resume, replaying one part, and a slower speed.
//
// paragraphs: arrays of { display, index } words.
export function useNarrator(paragraphs) {
  const [status, setStatus] = useState('idle') // idle | playing | paused
  const [currentWord, setCurrentWord] = useState(-1)
  const [currentPara, setCurrentPara] = useState(-1)
  const [listened, setListened] = useState(new Set()) // paragraphs heard to the end
  const [slow, setSlow] = useState(false)
  const runRef = useRef(0) // bumps to cancel a running read-through

  const stop = useCallback(() => {
    runRef.current++
    synth?.cancel()
    setStatus('idle')
    setCurrentWord(-1)
    setCurrentPara(-1)
  }, [])

  useEffect(() => stop, [stop])

  const speakParagraph = (p, run, continueAfter) => {
    const words = paragraphs[p]
    const text = words.map((w) => w.display).join(' ')
    // Character offset where each word starts, to map boundary events.
    const starts = []
    let at = 0
    for (const w of words) {
      starts.push(at)
      at += w.display.length + 1
    }
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = (slow ? 0.65 : 0.92) * voiceSpeed()
    utterance.pitch = 1.1
    utterance.onboundary = (e) => {
      if (runRef.current !== run || e.name !== 'word') return
      let i = starts.length - 1
      while (i > 0 && starts[i] > e.charIndex) i--
      setCurrentWord(words[i].index)
    }
    utterance.onend = () => {
      if (runRef.current !== run) return
      setListened((l) => new Set(l).add(p))
      if (continueAfter && p + 1 < paragraphs.length) {
        speakParagraph(p + 1, run, true)
      } else {
        setStatus('idle')
        setCurrentWord(-1)
        setCurrentPara(-1)
      }
    }
    setCurrentPara(p)
    setCurrentWord(words[0]?.index ?? -1)
    synth.speak(utterance)
  }

  // Play from paragraph p; `all` keeps going to the end of the chapter.
  const play = useCallback(
    (p = 0, all = true) => {
      if (!synth) return
      runRef.current++
      const run = runRef.current
      synth.cancel()
      setStatus('playing')
      // Chrome sometimes drops an utterance queued right after cancel().
      setTimeout(() => runRef.current === run && speakParagraph(p, run, all), 60)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paragraphs, slow]
  )

  const pause = useCallback(() => {
    synth?.pause()
    setStatus('paused')
  }, [])

  const resume = useCallback(() => {
    synth?.resume()
    setStatus('playing')
  }, [])

  return { status, currentWord, currentPara, listened, slow, setSlow, play, pause, resume, stop }
}
