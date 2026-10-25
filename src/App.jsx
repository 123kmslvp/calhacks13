import { useEffect, useState } from 'react'
import WelcomeScreen from './WelcomeScreen.jsx'
import LoginPage from './LoginPage.jsx'
import StudentPage from './StudentPage.jsx'
import ProgressPage from './ProgressPage.jsx'
import ReadAloudGame from './game/ReadAloudGame.jsx'
import TeacherLogin from './teacher/TeacherLogin.jsx'
import TeacherDashboard from './teacher/TeacherDashboard.jsx'
import { loadData, resetData, saveData } from './data/roster.js'

export default function App() {
  const [page, setPage] = useState('welcome')
  const [data, setData] = useState(loadData)
  const [studentId, setStudentId] = useState(null)
  const [preferences, setPreferences] = useState([])

  useEffect(() => saveData(data), [data])

  const student = data.students.find((s) => s.id === studentId)
  const studentClass = data.classes.find((c) => c.id === student?.classId)

  if (page === 'welcome') {
    return <WelcomeScreen onStart={() => setPage('login')} />
  }

  if (page === 'teacherLogin') {
    return <TeacherLogin onBack={() => setPage('login')} onLogin={() => setPage('teacher')} />
  }

  if (page === 'teacher') {
    return (
      <TeacherDashboard
        data={data}
        setData={setData}
        onLogout={() => setPage('login')}
        onResetDemo={() => {
          if (window.confirm('Reset all classes back to the sample students?')) setData(resetData())
        }}
      />
    )
  }

  if (page === 'login' || !student) {
    return (
      <LoginPage
        students={data.students}
        onBack={() => setPage('welcome')}
        onTeacher={() => setPage('teacherLogin')}
        onLogin={(s) => {
          setStudentId(s.id)
          setPage('student')
        }}
      />
    )
  }

  if (page === 'student') {
    return (
      <StudentPage
        student={student}
        className={studentClass?.name}
        onProgress={() => setPage('progress')}
        onLogout={() => {
          setStudentId(null)
          setPage('login')
        }}
        onStart={({ preferences }) => {
          setPreferences(preferences)
          // Record the session so the teacher dashboard stays up to date.
          setData((d) => ({
            ...d,
            students: d.students.map((s) => {
              if (s.id !== student.id) return s
              const toolsUsed = { ...s.toolsUsed }
              preferences.forEach((p) => (toolsUsed[p] = (toolsUsed[p] ?? 0) + 1))
              return { ...s, sessions: s.sessions + 1, lastActive: new Date().toISOString(), toolsUsed }
            }),
          }))
          setPage('game')
        }}
      />
    )
  }

  if (page === 'progress') {
    return (
      <ProgressPage
        student={student}
        onBack={() => setPage('student')}
        onSelectItem={(poppyItem) =>
          setData((d) => ({
            ...d,
            students: d.students.map((s) => (s.id === student.id ? { ...s, poppyItem } : s)),
          }))
        }
      />
    )
  }

  const saveStudent = (updated) =>
    setData((d) => ({
      ...d,
      students: d.students.map((s) => (s.id === updated.id ? updated : s)),
    }))

  return (
    <ReadAloudGame
      student={student}
      preferences={preferences}
      onSaveStudent={saveStudent}
      onExit={() => setPage('student')}
      onProgress={() => setPage('progress')}
    />
  )
}
