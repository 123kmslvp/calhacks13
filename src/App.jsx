import { useEffect, useState } from 'react'
import WelcomeScreen from './WelcomeScreen.jsx'
import LoginPage from './LoginPage.jsx'
import StudentPage from './StudentPage.jsx'
import ProgressPage from './ProgressPage.jsx'
import QuestApp from './game/QuestApp.jsx'
import Arcade from './game/arcade/Arcade.jsx'
import TeacherLogin from './teacher/TeacherLogin.jsx'
import TeacherDashboard from './teacher/TeacherDashboard.jsx'
import AccessibilityPanel from './a11y/AccessibilityPanel.jsx'
import { loadData, resetData, saveData } from './data/roster.js'

export default function App() {
  return (
    <>
      <AppScreens />
      <AccessibilityPanel />
    </>
  )
}

function AppScreens() {
  const [page, setPage] = useState('welcome')
  const [data, setData] = useState(loadData)
  const [studentId, setStudentId] = useState(null)
  const [preferences, setPreferences] = useState([])
  const [progressFrom, setProgressFrom] = useState('student')
  const [arcadeStory, setArcadeStory] = useState(null)

  useEffect(() => {
    saveData(data)
  }, [data])

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
        onProgress={() => {
          setProgressFrom('student')
          setPage('progress')
        }}
        onArcade={() => {
          setProgressFrom('student')
          setArcadeStory(null)
          setPage('arcade')
        }}
        onUpdate={(changes) =>
          setData((d) => ({
            ...d,
            students: d.students.map((s) => (s.id === student.id ? { ...s, ...changes } : s)),
          }))
        }
        onLogout={() => {
          setStudentId(null)
          setPage('login')
        }}
        onStart={({ preferences }) => {
          setPreferences(preferences)
          // Remember which ways of exploring they chose, for the teacher.
          setData((d) => ({
            ...d,
            students: d.students.map((s) => {
              if (s.id !== student.id) return s
              const toolsUsed = { ...s.toolsUsed }
              preferences.forEach((p) => (toolsUsed[p] = (toolsUsed[p] ?? 0) + 1))
              return { ...s, lastActive: new Date().toISOString(), toolsUsed }
            }),
          }))
          setPage('game')
        }}
      />
    )
  }

  const saveStudent = (updated) =>
    setData((d) => ({
      ...d,
      students: d.students.map((s) => (s.id === updated.id ? updated : s)),
    }))

  const overlay =
    page === 'progress' ? (
      <ProgressPage
        student={student}
        onBack={() => setPage(progressFrom)}
        onSelectItem={(poppyItem) => saveStudent({ ...student, poppyItem })}
        onRead={() => setPage('game')}
        onArcade={() => {
          setArcadeStory(null)
          setPage('arcade')
        }}
      />
    ) : page === 'arcade' ? (
      <Arcade
        student={student}
        initialStoryId={arcadeStory}
        exitLabel={progressFrom === 'game' ? 'Back to story' : 'Home'}
        onRead={() => setPage('game')}
        onSaveStudent={saveStudent}
        onExit={() => setPage(progressFrom)}
      />
    ) : null
  if (overlay && progressFrom !== 'game') return overlay

  // The quest stays mounted while the progress page is open, so the student
  // comes back to exactly where they were.
  return (
    <>
      {overlay}
      <div hidden={!!overlay}>
        <QuestApp
          student={student}
          preferences={preferences}
          onSaveStudent={saveStudent}
          onExit={() => setPage('student')}
          onProgress={() => {
            setProgressFrom('game')
            setPage('progress')
          }}
          onArcade={(storyId) => {
            setProgressFrom('game')
            setArcadeStory(storyId)
            setPage('arcade')
          }}
        />
      </div>
    </>
  )
}
