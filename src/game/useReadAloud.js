import { useCallback, useEffect, useRef, useState } from 'react'

const SpeechRecognition =
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null

export const speechSupported = !!SpeechRecognition
export const audioSupported =
  typeof window !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && 'MediaRecorder' in window

// Records the student reading aloud and, where the browser supports it,
// transcribes what they say so the passage can follow along.
//
// Note: in Chrome, speech recognition is processed by Google's servers. The
// audio recording itself stays in the browser.
export function useReadAloud() {
  const [status, setStatus] = useState('idle') // idle | starting | recording | stopped
  const [transcript, setTranscript] = useState('')
  const [audioUrl, setAudioUrl] = useState(null)
  const [seconds, setSeconds] = useState(0)
  const [error, setError] = useState(null)

  const recordingRef = useRef(false)
  const pausedRef = useRef(false)
  const recognitionRef = useRef(null)
  const recorderRef = useRef(null)
  const streamRef = useRef(null)
  const chunksRef = useRef([])
  const finalRef = useRef('')
  const interimRef = useRef('')
  const startedAtRef = useRef(0)
  const timerRef = useRef(null)

  const cleanup = useCallback(() => {
    recordingRef.current = false
    clearInterval(timerRef.current)
    try {
      recognitionRef.current?.stop()
    } catch {
      // already stopped
    }
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
    streamRef.current?.getTracks().forEach((t) => t.stop())
  }, [])

  useEffect(() => cleanup, [cleanup])
  useEffect(() => () => audioUrl && URL.revokeObjectURL(audioUrl), [audioUrl])

  const startRecognition = () => {
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = true
    recognition.interimResults = true
    recognition.onresult = (event) => {
      if (pausedRef.current) return
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript
        if (event.results[i].isFinal) finalRef.current += ` ${text}`
        else interim += ` ${text}`
      }
      interimRef.current = interim
      setTranscript(`${finalRef.current} ${interim}`.trim())
    }
    recognition.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setError('mic')
      } else if (event.error === 'network') {
        setError('network')
      }
      // "no-speech" and "aborted" are normal pauses — keep listening.
    }
    // Chrome ends recognition after a pause; restart while still recording
    // (but not while word help has listening paused).
    recognition.onend = () => {
      if (recordingRef.current && !pausedRef.current) {
        try {
          recognition.start()
        } catch {
          // already restarting
        }
      }
    }
    recognitionRef.current = recognition
    recognition.start()
  }

  const start = useCallback(async () => {
    setError(null)
    setTranscript('')
    setSeconds(0)
    setAudioUrl(null)
    finalRef.current = ''
    interimRef.current = ''
    pausedRef.current = false
    chunksRef.current = []
    setStatus('starting')

    if (audioSupported) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        streamRef.current = stream
        const recorder = new MediaRecorder(stream)
        recorder.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data)
        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
          if (blob.size) setAudioUrl(URL.createObjectURL(blob))
        }
        recorder.start()
        recorderRef.current = recorder
      } catch {
        setError('mic')
        setStatus('idle')
        return
      }
    }

    recordingRef.current = true
    startedAtRef.current = Date.now()
    timerRef.current = setInterval(
      () => setSeconds(Math.round((Date.now() - startedAtRef.current) / 1000)),
      500
    )
    try {
      startRecognition()
    } catch {
      // Recognition unavailable — recording still works.
    }
    setStatus('recording')
  }, [])

  const stop = useCallback(() => {
    if (!recordingRef.current) return 0
    const elapsed = Math.round((Date.now() - startedAtRef.current) / 1000)
    setSeconds(elapsed)
    cleanup()
    setStatus('stopped')
    return elapsed
  }, [cleanup])

  // While word help is open, stop listening — otherwise Poppy saying the
  // word out loud would count as the student reading it. Words already heard
  // are kept; recognition is aborted so nothing heard during help leaks in.
  const pauseListening = useCallback(() => {
    if (!recordingRef.current || pausedRef.current) return
    pausedRef.current = true
    finalRef.current += ` ${interimRef.current}`
    interimRef.current = ''
    try {
      recognitionRef.current?.abort()
    } catch {
      // not running
    }
  }, [])

  // Small delay so the tail end of Poppy's voice isn't picked up.
  const resumeListening = useCallback(() => {
    setTimeout(() => {
      if (!pausedRef.current) return
      pausedRef.current = false
      if (!recordingRef.current) return
      try {
        recognitionRef.current?.start()
      } catch {
        // already running
      }
    }, 600)
  }, [])

  const reset = useCallback(() => {
    cleanup()
    setStatus('idle')
    setTranscript('')
    setSeconds(0)
    setAudioUrl(null)
    setError(null)
  }, [cleanup])

  return { status, transcript, audioUrl, seconds, error, start, stop, reset, pauseListening, resumeListening }
}
