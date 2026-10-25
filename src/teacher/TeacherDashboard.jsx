import { useState } from 'react'
import {
  CATEGORIES,
  GRADES,
  TEACHER,
  categorize,
  createClass,
  createStudent,
  createStudents,
  parseEmails,
} from '../data/roster.js'
import { reportStatus } from '../data/reports.js'
import ClassInsights from './ClassInsights.jsx'
import ImportStudents from './ImportStudents.jsx'
import { studentInsights } from './insights.js'
import ParentReports from './ParentReports.jsx'
import StudentDetail from './StudentDetail.jsx'
import { CategoryChip, lastActiveText, ordinal } from './shared.jsx'
import './teacher.css'

export default function TeacherDashboard({ data, setData, onLogout, onResetDemo }) {
  const { classes, students } = data
  const [activeClassId, setActiveClassId] = useState(classes[0]?.id ?? null)
  const [selectedId, setSelectedId] = useState(null)
  const [filter, setFilter] = useState('all')
  const [showPasswords, setShowPasswords] = useState(false)
  const [tableView, setTableView] = useState('progress')
  const [view, setView] = useState('students')
  const [addMode, setAddMode] = useState('one')
  const [form, setForm] = useState({ firstName: '', lastName: '', grade: 3, parentEmail: '' })
  const [formError, setFormError] = useState('')
  const [justAdded, setJustAdded] = useState([])

  const activeClass = classes.find((c) => c.id === activeClassId) ?? classes[0]
  const roster = activeClass ? students.filter((s) => s.classId === activeClass.id) : []
  const selected = students.find((s) => s.id === selectedId)

  const setStudents = (fn) => setData((d) => ({ ...d, students: fn(d.students) }))
  const setClasses = (fn) => setData((d) => ({ ...d, classes: fn(d.classes) }))

  const updateStudent = (id, changes) =>
    setStudents((all) => all.map((s) => (s.id === id ? { ...s, ...changes } : s)))
  const updateStudentWith = (id, fn) =>
    setStudents((all) => all.map((s) => (s.id === id ? fn(s) : s)))

  const switchClass = (id) => {
    setActiveClassId(id)
    setFilter('all')
    setJustAdded([])
  }

  const classBar = (
    <ClassBar
      classes={classes}
      students={students}
      activeId={activeClass?.id}
      onSelect={switchClass}
      onCreate={(name) => {
        const created = createClass(name)
        setClasses((c) => [...c, created])
        switchClass(created.id)
      }}
    />
  )

  if (!activeClass) {
    return (
      <TeacherShell onLogout={onLogout}>
        {classBar}
        <section className="panel">
          <h2 className="panel-title">Create your first class</h2>
          <p className="panel-sub">Use “+ New class” above to get started.</p>
        </section>
      </TeacherShell>
    )
  }

  if (selected) {
    return (
      <TeacherShell onLogout={onLogout}>
        <StudentDetail
          student={selected}
          classes={classes}
          onOpenReports={() => {
            setSelectedId(null)
            setView('reports')
          }}
          onBack={() => setSelectedId(null)}
          onUpdate={(changes) => updateStudent(selected.id, changes)}
          onRemove={() => {
            setStudents((all) => all.filter((s) => s.id !== selected.id))
            setSelectedId(null)
          }}
        />
      </TeacherShell>
    )
  }

  const addStudent = (e) => {
    e.preventDefault()
    const { valid, invalid } = parseEmails(form.parentEmail)
    if (invalid.length) {
      setFormError(`"${invalid[0]}" doesn't look like an email.`)
      return
    }
    const student = createStudent(
      { ...form, classId: activeClass.id, parentEmails: valid.slice(0, 2) },
      students
    )
    setStudents((all) => [...all, student])
    setJustAdded([student])
    setForm({ firstName: '', lastName: '', grade: form.grade, parentEmail: '' })
  }

  const importStudents = (rows) => {
    const created = createStudents(rows, activeClass.id, students)
    setStudents((all) => [...all, ...created])
    setJustAdded(created)
  }

  const renameClass = () => {
    const name = window.prompt('New name for this class:', activeClass.name)
    if (name?.trim()) {
      setClasses((c) => c.map((x) => (x.id === activeClass.id ? { ...x, name: name.trim() } : x)))
    }
  }

  const deleteClass = () => {
    const message = roster.length
      ? `Delete ${activeClass.name} and its ${roster.length} students? Their logins will stop working.`
      : `Delete ${activeClass.name}?`
    if (!window.confirm(message)) return
    setData((d) => ({
      classes: d.classes.filter((c) => c.id !== activeClass.id),
      students: d.students.filter((s) => s.classId !== activeClass.id),
    }))
    switchClass(classes.find((c) => c.id !== activeClass.id)?.id ?? null)
  }

  const withCategory = roster.map((s) => ({ ...s, category: categorize(s) }))
  const counts = Object.fromEntries(
    CATEGORIES.map((c) => [c.id, withCategory.filter((s) => s.category === c.id).length])
  )
  const visible = withCategory
    .filter((s) => filter === 'all' || s.category === filter)
    .sort((a, b) => a.firstName.localeCompare(b.firstName))
  const reportsDue = roster.filter((s) => reportStatus(s) === 'due').length
  const missingEmails = roster.filter((s) => reportStatus(s) === 'noEmail').length

  const viewTabs = (
    <div className="seg view-tabs" role="tablist" aria-label={`${activeClass.name} sections`}>
      <button
        role="tab"
        aria-selected={view === 'students'}
        className={view === 'students' ? 'seg-btn active' : 'seg-btn'}
        onClick={() => setView('students')}
      >
        🎒 Students
      </button>
      <button
        role="tab"
        aria-selected={view === 'reports'}
        className={view === 'reports' ? 'seg-btn active' : 'seg-btn'}
        onClick={() => setView('reports')}
      >
        ✉️ Parent reports{reportsDue > 0 && <span className="badge">{reportsDue}</span>}
      </button>
      <button
        role="tab"
        aria-selected={view === 'insights'}
        className={view === 'insights' ? 'seg-btn active' : 'seg-btn'}
        onClick={() => setView('insights')}
      >
        📊 Class insights
      </button>
    </div>
  )

  if (view === 'insights') {
    return (
      <TeacherShell onLogout={onLogout}>
        {classBar}
        {viewTabs}
        <ClassInsights
          key={activeClass.id}
          roster={roster}
          className={activeClass.name}
          onSelectStudent={setSelectedId}
        />
      </TeacherShell>
    )
  }

  if (view === 'reports') {
    return (
      <TeacherShell onLogout={onLogout}>
        {classBar}
        {viewTabs}
        <ParentReports
          key={activeClass.id}
          roster={roster}
          className={activeClass.name}
          onUpdateStudent={updateStudentWith}
        />
      </TeacherShell>
    )
  }

  return (
    <TeacherShell onLogout={onLogout}>
      {classBar}
      {viewTabs}

      {(reportsDue > 0 || missingEmails > 0) && (
        <div className="report-banner">
          <span>
            ✉️{' '}
            {reportsDue > 0 && (
              <>
                This week's parent reports are ready for <strong>{reportsDue}</strong>{' '}
                {reportsDue === 1 ? 'family' : 'families'}.{' '}
              </>
            )}
            {missingEmails > 0 && (
              <>
                {missingEmails} {missingEmails === 1 ? 'student is' : 'students are'} missing a parent
                email.
              </>
            )}
          </span>
          <button className="t-btn primary small" onClick={() => setView('reports')}>
            Review &amp; send
          </button>
        </div>
      )}

      <section className="panel">
        <div className="panel-head">
          <h2 className="panel-title">Add students to {activeClass.name}</h2>
          <div className="seg" role="tablist" aria-label="How to add students">
            <button
              role="tab"
              aria-selected={addMode === 'one'}
              className={addMode === 'one' ? 'seg-btn active' : 'seg-btn'}
              onClick={() => setAddMode('one')}
            >
              One at a time
            </button>
            <button
              role="tab"
              aria-selected={addMode === 'upload'}
              className={addMode === 'upload' ? 'seg-btn active' : 'seg-btn'}
              onClick={() => setAddMode('upload')}
            >
              📄 Upload a list
            </button>
          </div>
        </div>

        {addMode === 'upload' ? (
          <ImportStudents classId={activeClass.id} students={students} onImport={importStudents} />
        ) : (
        <>
        <p className="panel-sub">
          Enter their name, grade, and a parent or guardian email for weekly progress reports.
          Kernel Quest makes a username and password for them.
        </p>
        <form className="add-form" onSubmit={addStudent}>
          <label>
            <span>First name</span>
            <input
              value={form.firstName}
              maxLength={30}
              required
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </label>
          <label>
            <span>Last name</span>
            <input
              value={form.lastName}
              maxLength={30}
              required
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </label>
          <label>
            <span>Grade</span>
            <select
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: Number(e.target.value) })}
            >
              {GRADES.map((g) => (
                <option key={g} value={g}>
                  {ordinal(g)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Parent / guardian email</span>
            <input
              type="text"
              inputMode="email"
              autoComplete="off"
              value={form.parentEmail}
              placeholder="parent@example.com"
              aria-invalid={!!formError}
              onChange={(e) => {
                setForm({ ...form, parentEmail: e.target.value })
                setFormError('')
              }}
            />
          </label>
          <button
            type="submit"
            className="t-btn primary"
            disabled={!form.firstName.trim() || !form.lastName.trim()}
          >
            + Add student
          </button>
        </form>
        {formError ? (
          <p className="field-error" role="alert">{formError}</p>
        ) : (
          <p className="field-hint">
            Two parents? Separate emails with a comma. No email yet? You can add it later.
          </p>
        )}
        </>
        )}

        {justAdded.length === 1 && (
          <div className="added" role="status">
            <span>
              ✅ Added <strong>{justAdded[0].firstName} {justAdded[0].lastName}</strong> — username{' '}
              <code>{justAdded[0].username}</code>, password <code>{justAdded[0].password}</code>
              {justAdded[0].parentEmails.length === 0 && ' · no parent email yet'}
            </span>
            <button className="t-btn ghost" onClick={() => setJustAdded([])} aria-label="Dismiss">
              ✕
            </button>
          </div>
        )}
        {justAdded.length > 1 && (
          <div className="added" role="status">
            <span>
              ✅ Added <strong>{justAdded.length} students</strong> to {activeClass.name}. Their
              logins are in the table below — use “Print login cards” to hand them out.
            </span>
            <button className="t-btn ghost" onClick={() => setJustAdded([])} aria-label="Dismiss">
              ✕
            </button>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2 className="panel-title">{activeClass.name} overview</h2>
          <div className="panel-actions">
            <span className="panel-sub">{roster.length} students</span>
            <button className="t-btn ghost small" onClick={renameClass}>✏️ Rename</button>
            <button className="t-btn ghost small" onClick={deleteClass}>🗑️ Delete class</button>
          </div>
        </div>
        <p className="panel-sub">
          Groups update as students play. They show where each student is right now, not a fixed label.
        </p>
        <div className="category-cards">
          <button
            className={filter === 'all' ? 'cat-card cat-all active' : 'cat-card cat-all'}
            aria-pressed={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            <span className="cat-count">{roster.length}</span>
            <span>Everyone</span>
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`cat-card cat-${c.id}${filter === c.id ? ' active' : ''}`}
              aria-pressed={filter === c.id}
              onClick={() => setFilter(c.id)}
            >
              <span className="cat-count">
                {c.icon} {counts[c.id]}
              </span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2 className="panel-title">Students</h2>
          <div className="seg" role="tablist" aria-label="Table view">
            <button
              role="tab"
              aria-selected={tableView === 'progress'}
              className={tableView === 'progress' ? 'seg-btn active' : 'seg-btn'}
              onClick={() => setTableView('progress')}
            >
              📈 Progress
            </button>
            <button
              role="tab"
              aria-selected={tableView === 'logins'}
              className={tableView === 'logins' ? 'seg-btn active' : 'seg-btn'}
              onClick={() => setTableView('logins')}
            >
              🔑 Logins
            </button>
          </div>
          <div className="panel-actions">
            {tableView === 'logins' && (
            <label className="toggle">
              <input
                type="checkbox"
                checked={showPasswords}
                onChange={(e) => setShowPasswords(e.target.checked)}
              />
              Show passwords
            </label>
            )}
            <button className="t-btn" onClick={() => window.print()} disabled={roster.length === 0}>
              🖨️ Print login cards
            </button>
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="empty">
            {roster.length === 0
              ? 'No students yet — add them above, one at a time or by uploading a list.'
              : 'No students in this group right now.'}
          </p>
        ) : tableView === 'progress' ? (
          <div className="table-wrap">
            <table className="roster">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Grade</th>
                  <th>Group</th>
                  <th title="Reading accuracy when reading aloud">Accuracy</th>
                  <th title="Words read correctly per minute">WCPM</th>
                  <th>Comprehension</th>
                  <th>This week</th>
                  <th>Tricky words</th>
                  <th>Last active</th>
                  <th>
                    <span className="sr-only">Details</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((s) => {
                  const info = studentInsights(s)
                  const tricky = (s.reading?.trickyWords ?? []).filter((w) => !w.rescuedOn).length
                  return (
                    <tr key={s.id}>
                      <td>
                        <span className="row-avatar" aria-hidden="true">{s.avatar}</span>
                        {s.firstName} {s.lastName}
                        {justAdded.some((n) => n.id === s.id) && <span className="new-tag">New</span>}
                      </td>
                      <td>{ordinal(s.grade)}</td>
                      <td><CategoryChip id={s.category} /></td>
                      <td>{info.accuracy === null ? '—' : `${info.accuracy}%`}</td>
                      <td>{info.wcpm ?? '—'}</td>
                      <td>
                        {info.comprehension === null ? '—' : `${info.comprehension}%`}
                        {info.comprehensionTrend > 0 && <span className="trend-up"> ▲</span>}
                      </td>
                      <td>
                        {info.sessionsThisWeek} {info.sessionsThisWeek === 1 ? 'session' : 'sessions'}
                      </td>
                      <td>{tricky || '—'}</td>
                      <td>{lastActiveText(s.lastActive)}</td>
                      <td>
                        <button className="t-btn" onClick={() => setSelectedId(s.id)}>
                          View →
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="roster">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Grade</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Group</th>
                  <th>Parent email</th>
                  <th>Last active</th>
                  <th>
                    <span className="sr-only">Details</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <span className="row-avatar" aria-hidden="true">{s.avatar}</span>
                      {s.firstName} {s.lastName}
                    </td>
                    <td>{ordinal(s.grade)}</td>
                    <td>
                      <code>{s.username}</code>
                      {justAdded.some((n) => n.id === s.id) && <span className="new-tag">New</span>}
                    </td>
                    <td><code>{showPasswords ? s.password : '••••••'}</code></td>
                    <td><CategoryChip id={s.category} /></td>
                    <td>
                      {s.parentEmails.length ? (
                        <span title={s.parentEmails.join(', ')}>✅ {s.parentEmails.length === 2 ? '2 emails' : 'Added'}</span>
                      ) : (
                        <button className="t-btn small warn" onClick={() => setSelectedId(s.id)}>
                          ⚠️ Add
                        </button>
                      )}
                    </td>
                    <td>{lastActiveText(s.lastActive)}</td>
                    <td>
                      <button className="t-btn" onClick={() => setSelectedId(s.id)}>
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="reset-demo">
        <button className="t-btn ghost" onClick={onResetDemo}>
          Reset demo classes
        </button>
      </p>

      <div className="print-cards" aria-hidden="true">
        {[...roster]
          .sort((a, b) => a.firstName.localeCompare(b.firstName))
          .map((s) => (
            <div className="login-card" key={s.id}>
              <div className="login-card-title">🍿 Kernel Quest · {activeClass.name}</div>
              <div className="login-card-name">
                {s.avatar} {s.firstName} {s.lastName}
              </div>
              <div>Username: <strong>{s.username}</strong></div>
              <div>Password: <strong>{s.password}</strong></div>
            </div>
          ))}
      </div>
    </TeacherShell>
  )
}

function TeacherShell({ onLogout, children }) {
  return (
    <div className="teacher">
      <header className="teacher-top">
        <div>
          <span className="teacher-brand">🍿 Kernel Quest</span>
          <span className="teacher-class">{TEACHER.name}</span>
        </div>
        <button className="t-btn" onClick={onLogout}>
          Log out
        </button>
      </header>
      <main className="teacher-main">{children}</main>
    </div>
  )
}

function ClassBar({ classes, students, activeId, onSelect, onCreate }) {
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')

  return (
    <nav className="class-bar" aria-label="Your classes">
      {classes.map((c) => (
        <button
          key={c.id}
          className={c.id === activeId ? 'class-tab active' : 'class-tab'}
          aria-current={c.id === activeId ? 'page' : undefined}
          onClick={() => onSelect(c.id)}
        >
          {c.name}
          <span className="class-count">{students.filter((s) => s.classId === c.id).length}</span>
        </button>
      ))}
      {creating ? (
        <form
          className="class-new"
          onSubmit={(e) => {
            e.preventDefault()
            onCreate(name)
            setName('')
            setCreating(false)
          }}
        >
          <input
            autoFocus
            value={name}
            maxLength={40}
            placeholder="Class name, e.g. Room 16"
            aria-label="New class name"
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && setCreating(false)}
          />
          <button type="submit" className="t-btn primary small" disabled={!name.trim()}>
            Create
          </button>
          <button type="button" className="t-btn ghost small" onClick={() => setCreating(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <button className="class-tab add" onClick={() => setCreating(true)}>
          + New class
        </button>
      )}
    </nav>
  )
}
