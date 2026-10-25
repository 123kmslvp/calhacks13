import { useEffect, useRef, useState } from 'react'
import { buildReport, markReported, reportStatus, reportWeek } from '../data/reports.js'
import { sendReportEmail } from '../services/email.js'
import EmailField from './EmailField.jsx'
import { lastActiveText } from './shared.jsx'

const STATUS = {
  due: { label: 'Ready to send', className: 'chip chip-progressing' },
  sent: { label: 'Sent this week', className: 'chip chip-strong' },
  noEmail: { label: 'No parent email', className: 'chip chip-support' },
}

export default function ParentReports({ roster, className, onUpdateStudent }) {
  const [previewId, setPreviewId] = useState(null)
  const [copied, setCopied] = useState(false)
  const previewRef = useRef(null)

  useEffect(() => {
    if (previewId) previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [previewId])

  const students = [...roster].sort((a, b) => a.firstName.localeCompare(b.firstName))
  const withStatus = students.map((s) => ({ ...s, status: reportStatus(s) }))
  const due = withStatus.filter((s) => s.status === 'due')
  const sent = withStatus.filter((s) => s.status === 'sent')
  const missing = withStatus.filter((s) => s.status === 'noEmail')
  const preview = withStatus.find((s) => s.id === previewId)
  const report = preview && buildReport(preview, className)

  const open = (id) => {
    setPreviewId(id)
    setCopied(false)
  }

  const send = (student) => {
    const r = buildReport(student, className)
    sendReportEmail({ to: student.parentEmails, subject: r.subject, body: r.text })
    onUpdateStudent(student.id, markReported)
    // Move straight on to the next family so a whole class goes quickly.
    const next = due.find((s) => s.id !== student.id)
    open(next ? next.id : null)
  }

  return (
    <>
      <section className="panel">
        <div className="panel-head">
          <h2 className="panel-title">Weekly parent reports · {reportWeek()}</h2>
          {due.length > 0 && (
            <button className="t-btn primary" onClick={() => open(due[0].id)}>
              ✉️ Send reports ({due.length} ready)
            </button>
          )}
        </div>
        <p className="panel-sub">
          Each family gets a friendly summary: how often their child played, a strength to
          celebrate, skill progress, and one idea to try at home. Teacher-only groups are never
          shared. Reports open in your email app, ready to send.
        </p>
        <div className="report-stats">
          <span className="chip chip-progressing">{due.length} ready to send</span>
          <span className="chip chip-strong">{sent.length} sent this week</span>
          <span className="chip chip-support">{missing.length} missing an email</span>
        </div>
      </section>

      {preview && report && (
        <section ref={previewRef} className="panel email-preview" aria-label={`Report preview for ${preview.firstName}`}>
          <div className="panel-head">
            <h3 className="panel-title">Preview</h3>
            <button className="t-btn ghost small" onClick={() => open(null)} aria-label="Close preview">
              ✕
            </button>
          </div>
          <dl className="email-meta">
            <div><dt>To</dt><dd>{preview.parentEmails.join(', ') || '—'}</dd></div>
            <div><dt>Subject</dt><dd>{report.subject}</dd></div>
          </dl>
          <div className="email-body">
            <p>Hello!</p>
            <p>
              Here's {preview.firstName}'s week in Kernel Quest, where {className} is learning how
              computers think through stories and puzzles.
            </p>
            <h4>This week</h4>
            <p>{report.activity}</p>
            {report.tools.length > 0 && (
              <p>
                Favorite ways to learn:{' '}
                {report.tools.map((t) => `${t.icon} ${t.phrase}`).join(' and ')}
              </p>
            )}
            <h4>Something to celebrate 🎉</h4>
            <p>{report.celebrate}</p>
            <h4>Skills</h4>
            <ul className="skills">
              {report.skills.map((s) => (
                <li key={s.id}>
                  <div className="skill-row">
                    <span>{s.label}</span>
                    <span className="skill-score">
                      {s.score === null ? 'Not started' : `${s.score}%`}
                      {s.change > 0 && <span className="up"> ▲ {s.change}%</span>}
                    </span>
                  </div>
                  <div className="meter" aria-hidden="true">
                    <span className="fill-progressing" style={{ width: `${s.score ?? 0}%` }} />
                  </div>
                </li>
              ))}
            </ul>
            {report.nextStep && (
              <>
                <h4>What we're working on next</h4>
                <p>"{report.nextStep.label}"</p>
              </>
            )}
            <h4>Try this at home</h4>
            <p>{report.homeTip}</p>
          </div>
          <div className="import-actions">
            <button
              className="t-btn"
              onClick={() =>
                navigator.clipboard?.writeText(`${report.subject}\n\n${report.text}`).then(() => setCopied(true))
              }
            >
              {copied ? '✅ Copied' : '📋 Copy text'}
            </button>
            <button
              className="t-btn primary"
              disabled={preview.status === 'noEmail'}
              onClick={() => send(preview)}
            >
              {preview.status === 'sent' ? 'Send again ✉️' : 'Open in email app ✉️'}
            </button>
          </div>
        </section>
      )}

      {missing.length > 0 && (
        <section className="panel missing">
          <h3 className="panel-title">📬 Add missing parent emails</h3>
          <p className="panel-sub">These families won't get a weekly report until you add an email.</p>
          <ul className="missing-list">
            {missing.map((s) => (
              <li key={s.id}>
                <span className="missing-name">
                  {s.avatar} {s.firstName} {s.lastName}
                </span>
                <EmailField
                  emails={[]}
                  showSave
                  label={`Email for ${s.firstName}'s family`}
                  onSave={(parentEmails) => onUpdateStudent(s.id, (st) => ({ ...st, parentEmails }))}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="panel">
        <h3 className="panel-title">Families</h3>
        <div className="table-wrap">
          <table className="roster">
            <thead>
              <tr>
                <th>Student</th>
                <th>Parent email</th>
                <th>Last active</th>
                <th>Report</th>
                <th><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {withStatus.map((s) => (
                <tr key={s.id} className={s.id === previewId ? 'row-active' : undefined}>
                  <td>
                    <span className="row-avatar" aria-hidden="true">{s.avatar}</span>
                    {s.firstName} {s.lastName}
                  </td>
                  <td className="emails-cell">{s.parentEmails.join(', ') || '—'}</td>
                  <td>{lastActiveText(s.lastActive)}</td>
                  <td><span className={STATUS[s.status].className}>{STATUS[s.status].label}</span></td>
                  <td>
                    <button className="t-btn" onClick={() => open(s.id)}>
                      Preview
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
