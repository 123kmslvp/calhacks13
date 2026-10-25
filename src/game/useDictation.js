import { useCallback, useEffect, useRef, useState } from 'react'

const SpeechRecognition =
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null

export const dictationSupported = !!SpeechRecognition

// "Speak your answer": turns what the student says into text. `onText` gets
// the full text so far (what was there before + what they've said).
export function useDictation(onText) {
  const [listening, setListening] = useState(false)
  const [problem, setProblem] = useState(null) // null | 'blocked' | 'network'
  const recognitionRef = useRef(null)
  const onTextRef = useRef(onText)
  onTextRef.current = onText

  const stop = useCallback(() => {
    try {
      recognitionRef.current?.stop()
    } catch {
      // already stopped
    }
    recognitionRef.current = null
    setListening(false)
  }, [])

  useEffect(() => stop, [stop])

  const start = useCallback(
    (existingText = '') => {
      if (!SpeechRecognition) return
      setProblem(null)
      window.speechSynthesis?.cancel()
      const recognition = new SpeechRecognition()
      recognition.lang = 'en-US'
      recognition.continuous = true
      recognition.interimResults = true
      let finalText = ''
      recognition.onresult = (event) => {
        let interim = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const t = event.results[i][0].transcript
          if (event.results[i].isFinal) finalText += ` ${t}`
          else interim += ` ${t}`
        }
        const spoken = `${finalText} ${interim}`.trim()
        const joined = [existingText.trim(), spoken].filter(Boolean).join(' ')
        // Capitalize the first letter so it reads like a sentence.
        onTextRef.current(joined.charAt(0).toUpperCase() + joined.slice(1))
      }
      recognition.onerror = (event) => {
        if (['not-allowed', 'service-not-allowed', 'audio-capture'].includes(event.error)) setProblem('blocked')
        else if (event.error === 'network') setProblem('network')
        stop()
      }
      recognition.onend = () => setListening(false)
      recognitionRef.current = recognition
      try {
        recognition.start()
        setListening(true)
      } catch {
        setListening(false)
      }
    },
    [stop]
  )

  return { start, stop, listening, problem, supported: dictationSupported }
}
