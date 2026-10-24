import { useState } from 'react'
import WelcomeScreen from './WelcomeScreen.jsx'
import LoginPage from './LoginPage.jsx'
import StudentPage from './StudentPage.jsx'

export default function App() {
  const [page, setPage] = useState('welcome')
  const [student, setStudent] = useState(null)
  const [session, setSession] = useState(null)

  if (page === 'welcome') {
    return <WelcomeScreen onStart={() => setPage('login')} />
  }

  if (page === 'login' || !student) {
    return (
      <LoginPage
        onBack={() => setPage('welcome')}
        onLogin={(s) => {
          setStudent(s)
          setPage('student')
        }}
      />
    )
  }

  if (page === 'student') {
    return (
      <StudentPage
        student={student}
        onLogout={() => {
          setStudent(null)
          setPage('login')
        }}
        onStart={(choices) => {
          setSession(choices)
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
