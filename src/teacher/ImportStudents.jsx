import { useState } from 'react'
import { GRADES, TEMPLATE_CSV, parseStudentList } from '../data/roster.js'
import { ordinal } from './shared.jsx'

const TEMPLATE_HREF = `data:text/csv;charset=utf-8,${encodeURIComponent(TEMPLATE_CSV)}`

export default function ImportStudents({ classId, students, onImport }) {
  const [text, setText] = useState('')
  const [draft, setDraft] = useState('')
  const [fileName, setFileName] = useState('')
  const [defaultGrade, setDefaultGrade] = useState(GRADES[0])

  const rows = text ? parseStudentList(text, { defaultGrade, classId, students }) : []
  const ready = rows.filter((r) => !r.problem)
  const skipped = rows.length - ready.length

  const readFile = (file) => {
    if (!file) return
    setFileName(file.name)
    file.text().then(setText)
  }

  const reset = () => {
    setText('')
    setDraft('')
    setFileName('')
  }

  return (
    <div className="import">
      <p className="panel-sub">
        Upload a CSV (in Excel or Google Sheets: <em>File → Download / Save as → CSV</em>) or paste
        names straight from a spreadsheet. Columns: first name, last name, grade, parent email (add a second parent email column if needed).{' '}
        <a href={TEMPLATE_HREF} download="kernel-quest-class-template.csv">
          Download a template
        </a>
      </p>

      {!text ? (
        <>
          <label
            className="dropzone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              readFile(e.dataTransfer.files[0])
            }}
          >
            <input
              type="file"
              accept=".csv,.tsv,.txt,text/csv,text/plain"
              onChange={(e) => readFile(e.target.files[0])}
            />
            <span className="dropzone-icon" aria-hidden="true">📄</span>
            <strong>Choose a file</strong> or drag it here
          </label>
          <textarea
            className="notes"
            rows={4}
            aria-label="Paste a class list"
            placeholder={'…or paste a list here, one student per line:\nMaya, Rivera, 3, rivera.family@example.com\nLeo, Kim, 4, jkim@example.com'}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className="import-actions">
            <button className="t-btn primary" disabled={!draft.trim()} onClick={() => setText(draft)}>
              Check list
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="import-bar">
            <span>
              {fileName ? <>📄 <strong>{fileName}</strong> — </> : null}
              {ready.length} ready{skipped > 0 && `, ${skipped} will be skipped`}
              {ready.some((r) => !r.parentEmails.length) &&
                ` · ${ready.filter((r) => !r.parentEmails.length).length} without a parent email`}
            </span>
            <label className="inline-field">
              Grade when blank:
              <select value={defaultGrade} onChange={(e) => setDefaultGrade(Number(e.target.value))}>
                {GRADES.map((g) => (
                  <option key={g} value={g}>{ordinal(g)}</option>
                ))}
              </select>
            </label>
          </div>

          {rows.length === 0 ? (
            <p className="empty">We couldn't find any names in that list.</p>
          ) : (
            <div className="table-wrap preview">
              <table className="roster">
                <thead>
                  <tr>
                    <th>First name</th>
                    <th>Last name</th>
                    <th>Grade</th>
                    <th>Parent email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className={r.problem ? 'row-skip' : undefined}>
                      <td>{r.firstName || '—'}</td>
                      <td>{r.lastName || '—'}</td>
                      <td>{GRADES.includes(r.grade) ? ordinal(r.grade) : '—'}</td>
                      <td className="emails-cell">{r.parentEmails.join(', ') || '—'}</td>
                      <td>
                        {r.problem ? `⚠️ ${r.problem} — skipped` : '✅ Ready'}
                        {!r.problem && r.emailNote && <div className="row-note">{r.emailNote}</div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="import-actions">
            <button className="t-btn ghost" onClick={reset}>
              Start over
            </button>
            <button
              className="t-btn primary"
              disabled={ready.length === 0}
              onClick={() => {
                onImport(
                  ready.map(({ firstName, lastName, grade, parentEmails }) => ({
                    firstName,
                    lastName,
                    grade,
                    parentEmails,
                  }))
                )
                reset()
              }}
            >
              Add {ready.length} {ready.length === 1 ? 'student' : 'students'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
