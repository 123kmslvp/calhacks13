import { useCallback, useEffect, useRef, useState } from 'react'

const SpeechRecognition =
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null

// Listens for one short thing the student says — a single word or a
// sentence — and reports every way the recognizer heard it. Used by Word
// Rescue. `listen` resolves with an array of alternative transcripts.
export function useSpeechCheck() {
  const [listening, setListening] = useState(false)
  const [heard, setHeard] = useState('')
  const recognitionRef = useRef(null)

  const stop = useCallback(() => {
    try {
      recognitionRef.current?.stop()
    } catch {
      // already stopped
    }
  }, [])

  useEffect(() => stop, [stop])

  const listen = useCallback(
    ({ maxSeconds = 6, onPartial } = {}) =>
      new Promise((resolve) => {
        if (!SpeechRecognition) return resolve([])
        const recognition = new SpeechRecognition()
        recognition.lang = 'en-US'
        recognition.continuous = false
        recognition.interimResults = true
        recognition.maxAlternatives = 5
        const alternatives = new Set()
        let done = false

        const finish = () => {
          if (done) return
          done = true
          clearTimeout(timer)
          setListening(false)
          resolve([...alternatives])
        }
        const timer = setTimeout(() => {
          stop()
          finish()
        }, maxSeconds * 1000)

        recognition.onresult = (event) => {
          let best = ''
          for (let i = 0; i < event.results.length; i++) {
            const result = event.results[i]
            best += ` ${result[0].transcript}`
            for (let a = 0; a < result.length; a++) alternatives.add(result[a].transcript.trim())
          }
          setHeard(best.trim())
          onPartial?.(best.trim())
        }
        recognition.onerror = finish
        recognition.onend = finish

        setHeard('')
        setListening(true)
        recognitionRef.current = recognition
        try {
          recognition.start()
        } catch {
          finish()
        }
      }),
    [stop]
  )

  return { listen, listening, heard, stop, supported: !!SpeechRecognition }
}
