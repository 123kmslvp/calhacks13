import { useEffect, useSyncExternalStore } from 'react'

// Comfort settings every learner can change from the Aa button: bigger text,
// an easier-to-read font, more spacing, high contrast, calmer motion, slower
// speech, and having Poppy read prompts aloud. They are saved on this device
// and applied as data attributes on <html>, so every screen follows them.

const KEY = 'kernel-quest-comfort'

export const DEFAULTS = {
  textSize: 'normal', // normal | large | xlarge
  font: 'playful', // playful | clear | dyslexia
  spacing: false,
  contrast: false,
  calm: false,
  slowVoice: false,
  readAloud: false,
}

const reducedMotionAsked = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function load() {
  try {
    return { ...DEFAULTS, calm: reducedMotionAsked(), ...JSON.parse(localStorage.getItem(KEY) ?? '{}') }
  } catch {
    return { ...DEFAULTS, calm: reducedMotionAsked() }
  }
}

let prefs = load()
const listeners = new Set()

export function applyPrefs(p = prefs) {
  const root = document.documentElement
  root.dataset.text = p.textSize
  root.dataset.font = p.font
  root.dataset.spacing = String(p.spacing)
  root.dataset.contrast = String(p.contrast)
  root.dataset.calm = String(p.calm)
}

export function setPref(name, value) {
  prefs = { ...prefs, [name]: value }
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs))
  } catch {
    // private mode: the setting still works until the page closes
  }
  applyPrefs()
  listeners.forEach((l) => l())
}

export function resetPrefs() {
  prefs = { ...DEFAULTS }
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
  applyPrefs()
  listeners.forEach((l) => l())
}

export const getPrefs = () => prefs
const subscribe = (l) => (listeners.add(l), () => listeners.delete(l))

export const usePrefs = () => useSyncExternalStore(subscribe, getPrefs, getPrefs)

// Multiplier applied to every spoken voice's rate.
export const voiceSpeed = () => (prefs.slowVoice ? 0.75 : 1)

// Speaks `text` once when a screen appears, if the student turned on
// "Read to me". `key` re-triggers it for a new prompt.
export function useAutoRead(text, speakFn, key = text, always = false) {
  const { readAloud } = usePrefs()
  const on = readAloud || always
  useEffect(() => {
    if (!on || !text) return
    const t = setTimeout(() => speakFn(text), 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, key])
}

applyPrefs()
