import { useEffect, useState } from 'react'
import WelcomeScreen from './WelcomeScreen.jsx'
import LoginPage from './LoginPage.jsx'
import StudentPage from './StudentPage.jsx'
import TeacherLogin from './teacher/TeacherLogin.jsx'
import TeacherDashboard from './teacher/TeacherDashboard.jsx'
import { loadData, resetData, saveData } from './data/roster.js'

export default function App() {
  const [page, setPage] = useState('welcome')
  const [data, setData] = useState(loadData)
  const [studentId, setStudentId] = useState(null)

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
        onLogout={() => {
          setStudentId(null)
          setPage('login')
        }}
        onStart={({ preferences }) => {
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
          setPage('story')
        }}
      />
    )
  }

  // Placeholder until the storyline page exists.
  return (
    <main className="welcome">
      <section className="card">
        <p className="placeholder" role="status">
          📖 Storyline coming next!
        </p>
        <p>
          <button className="back" onClick={() => setPage('student')}>
            ← Back to my page
          </button>
        </p>
      </section>
    </main>
  )
}
