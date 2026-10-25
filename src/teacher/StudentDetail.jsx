import { useState } from 'react'
import {
  GRADES,
  SKILLS,
  TOOLS,
  averageSkill,
  categorize,
  generatePassword,
  suggestions,
} from '../data/roster.js'
import { reportStatus } from '../data/reports.js'
import EmailField from './EmailField.jsx'
import { CategoryChip, lastActiveText, ordinal } from './shared.jsx'

export default function StudentDetail({ student, classes, onBack, onUpdate, onRemove, onOpenReports }) {
  const [showPassword, setShowPassword] = useState(false)
  const category = categorize(student)
  const avg = averageSkill(student)
  const toolsUsed = TOOLS.filter((t) => student.toolsUsed[t.id])
  const totalToolUses = toolsUsed.reduce((sum, t) => sum + student.toolsUsed[t.id], 0)

  return (
    <>
      <button className="t-btn ghost back-link" onClick={onBack}>
        ← All students
      </button>

      <section className="panel detail-head">
        <span className="detail-avatar" aria-hidden="true">{student.avatar}</span>
        <div className="detail-name">
          <h2 className="panel-title">
            {student.firstName} {student.lastName}
          </h2>
          <CategoryChip id={category} />
        </div>
        <dl className="stats">
          <div><dt>Points</dt><dd>⭐ {student.points}</dd></div>
          <div><dt>Sessions</dt><dd>{student.sessions}</dd></div>
          <div><dt>Average skill</dt><dd>{avg === null ? '—' : `${avg}%`}</dd></div>
          <div><dt>Last active</dt><dd>{lastActiveText(student.lastActive)}</dd></div>
        </dl>
      </section>

      <div className="detail-grid">
        <section className="panel needs">
          <h3 className="panel-title">What {student.firstName} needs right now</h3>
          <ul className="tips">
            {suggestions(student).map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <h3 className="panel-title">Login</h3>
          <dl className="login-info">
            <div><dt>Username</dt><dd><code>{student.username}</code></dd></div>
            <div>
              <dt>Password</dt>
              <dd>
                <code>{showPassword ? student.password : '••••••'}</code>
                <button className="t-btn ghost small" onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </dd>
            </div>
          </dl>
          <button
            className="t-btn"
            onClick={() => {
              onUpdate({ password: generatePassword() })
              setShowPassword(true)
            }}
          >
            🔄 Make new password
          </button>
          <label className="detail-field">
            <span>Grade</span>
            <select
              value={student.grade}
              onChange={(e) => onUpdate({ grade: Number(e.target.value) })}
            >
              {GRADES.map((g) => (
                <option key={g} value={g}>{ordinal(g)}</option>
              ))}
            </select>
          </label>
          <label className="detail-field">
            <span>Class</span>
            <select value={student.classId} onChange={(e) => onUpdate({ classId: e.target.value })}>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
        </section>

        <section className="panel">
          <h3 className="panel-title">Skills</h3>
          <ul className="skills">
            {SKILLS.map((skill) => {
              const score = student.skills[skill.id]
              return (
                <li key={skill.id}>
                  <div className="skill-row">
                    <span>{skill.label}</span>
                    <span className="skill-score">{score === null ? 'Not started' : `${score}%`}</span>
                  </div>
                  <div className="meter" aria-hidden="true">
                    <span className={`fill-${scoreBand(score)}`} style={{ width: `${score ?? 0}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="panel">
          <h3 className="panel-title">Tools {student.firstName} has chosen</h3>
          <p className="panel-sub">
            Students pick these each day. They show what helps them access the story, not a label.
          </p>
          {toolsUsed.length === 0 ? (
            <p className="empty">No sessions yet.</p>
          ) : (
            <ul className="tool-list">
              {toolsUsed
                .sort((a, b) => student.toolsUsed[b.id] - student.toolsUsed[a.id])
                .map((t) => (
                  <li key={t.id}>
                    <span>{t.icon} {t.label}</span>
                    <span className="skill-score">
                      {Math.round((student.toolsUsed[t.id] / totalToolUses) * 100)}%
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </section>

        <section className="panel full">
          <div className="panel-head">
            <h3 className="panel-title">Family contact</h3>
            <button className="t-btn small" onClick={onOpenReports}>
              ✉️ Parent reports
            </button>
          </div>
          <p className="panel-sub">
            {{
              noEmail: `Add an email so ${student.firstName}'s family gets weekly progress reports.`,
              due: `This week's report is ready to send.`,
              sent: `This week's report was sent ${lastActiveText(student.lastReport?.sentAt).toLowerCase()}.`,
            }[reportStatus(student)]}
          </p>
          <EmailField
            key={student.id}
            emails={student.parentEmails}
            onSave={(parentEmails) => onUpdate({ parentEmails })}
          />
        </section>

        <section className="panel full">
          <h3 className="panel-title">Tricky words</h3>
          <p className="panel-sub">
            Words {student.firstName} asked for help with or skipped while reading aloud, and whether they
            rescued them afterward by saying the word and reading it again.
          </p>
          {(student.reading?.trickyWords ?? []).length === 0 ? (
            <p className="empty">No tricky words yet.</p>
          ) : (
            <div className="table-wrap">
              <table className="roster">
                <thead>
                  <tr>
                    <th>Word</th>
                    <th>Asked for help</th>
                    <th>Skipped</th>
                    <th>Rescued</th>
                  </tr>
                </thead>
                <tbody>
                  {[...student.reading.trickyWords]
                    .sort((a, b) => b.helps + b.misses - (a.helps + a.misses))
                    .map((w) => (
                      <tr key={w.word}>
                        <td><strong>{w.display}</strong></td>
                        <td>{w.helps}×</td>
                        <td>{w.misses}×</td>
                        <td>{w.rescuedOn ? `✅ ${lastActiveText(`${w.rescuedOn}T00:00:00`)}` : 'Not yet'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="panel full">
          <h3 className="panel-title">My notes</h3>
          <textarea
            className="notes"
            rows={4}
            placeholder={`Anything to remember about ${student.firstName}? (Only you can see this.)`}
            value={student.notes}
            onChange={(e) => onUpdate({ notes: e.target.value })}
          />
        </section>
      </div>

      <p className="reset-demo">
        <button
          className="t-btn danger"
          onClick={() => {
            if (window.confirm(`Remove ${student.firstName} ${student.lastName} from your class?`)) onRemove()
          }}
        >
          Remove student
        </button>
      </p>
    </>
  )
}

function scoreBand(score) {
  if (score === null) return 'none'
  if (score < 50) return 'support'
  if (score < 80) return 'progressing'
  return 'strong'
}
