// Students' drawings, kept apart from the main roster because images are
// large. Stored in localStorage for now; move to real storage with a backend.

const STORAGE_KEY = 'kernelquest.drawings.v1'
const MAX_PER_STUDENT = 12

function loadAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}

export function loadDrawings(studentId) {
  return loadAll()[studentId] ?? []
}

// Returns false if the browser's storage is full.
export function saveDrawing(studentId, { chapterId, chapterTitle, dataUrl }) {
  const all = loadAll()
  const mine = [
    { id: `${Date.now()}`, chapterId, chapterTitle, dataUrl, date: new Date().toISOString() },
    ...(all[studentId] ?? []),
  ].slice(0, MAX_PER_STUDENT)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...all, [studentId]: mine }))
    return true
  } catch {
    return false
  }
}
