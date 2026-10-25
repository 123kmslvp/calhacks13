import { SKILLS } from '../data/roster.js'
import { ActivityChart, SkillBars, SkillHeatmap } from './ClassCharts.jsx'
import { PRACTICE_BELOW, classCsv, classSummary, classWeeklySeries, skillBreakdown } from './classInsights.js'
import TrendChart from './TrendChart.jsx'

// Class-wide data for planning: how the class is reading, how that's changing,
// and which skills to reteach (and to whom).
export default function ClassInsights({ roster, className, onSelectStudent }) {
  if (roster.length === 0) {
    return (
      <section className="panel">
        <h2 className="panel-title">Class insights</h2>
        <p className="empty">Add students to {className} to see class charts here.</p>
      </section>
    )
  }

  const weeks = classWeeklySeries(roster)
  const summary = classSummary(roster, weeks)
  const skills = skillBreakdown(roster)
  const groups = skills.filter((s) => s.practice.length > 0)
  const wcpmMax = Math.max(150, ...weeks.map((w) => w.wcpm ?? 0)) + 10
  const hasReading = weeks.some((w) => w.sessions > 0)

  const downloadCsv = () => {
    const blob = new Blob([classCsv(roster)], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${className.replace(/\s+/g, '-').toLowerCase()}-class-data.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <section className="panel">
        <div className="panel-head">
          <h2 className="panel-title">{className} at a glance</h2>
          <div className="panel-actions">
            <button className="t-btn" onClick={downloadCsv}>⬇️ Download class data (CSV)</button>
          </div>
        </div>
        <p className="panel-sub">Averages across every student in the class. Changes compare the last four weeks with the four before.</p>
        <div className="kpis">
          <StatTile
            label="Students reading this week"
            value={`${summary.activeThisWeek} of ${summary.students}`}
            delta={summary.activeChange}
            period="last week"
          />
          <StatTile
            label="Reading sessions this week"
            value={summary.sessionsThisWeek}
            delta={summary.sessionsChange}
            period="last week"
            note={`about ${summary.minutesThisWeek} minutes in all`}
          />
          <StatTile label="Comprehension" value={pct(summary.comprehension)} delta={summary.comprehensionChange} unit=" pts" />
          <StatTile label="Reading accuracy" value={pct(summary.accuracy)} delta={summary.accuracyChange} unit=" pts" />
          <StatTile label="Words correct / min" value={summary.wcpm ?? '—'} delta={summary.wcpmChange} />
        </div>
      </section>

      {hasReading ? (
        <>
          <div className="detail-grid">
            <section className="panel full">
              <h3 className="panel-title">Class progress over time</h3>
              <p className="panel-sub">Weekly class averages for the last eight weeks. Gaps are weeks without that activity.</p>
              <TrendChart
                title={`${className} reading accuracy and comprehension by week`}
                data={weeks}
                series={[
                  { key: 'accuracy', label: 'Reading accuracy', short: 'Accuracy', color: '#1f9d6b' },
                  { key: 'comprehension', label: 'Comprehension questions', short: 'Comprehension', color: '#7a4cbe' },
                ]}
              />
              <h4 className="chart-subtitle">Words correct per minute (reading aloud)</h4>
              <TrendChart
                title={`${className} words correct per minute by week`}
                data={weeks}
                unit=""
                yMax={Math.round(wcpmMax / 10) * 10}
                series={[{ key: 'wcpm', label: 'Words correct per minute', short: 'WCPM', color: '#1f9d6b' }]}
              />
            </section>

            <section className="panel full">
              <h3 className="panel-title">Reading activity by week</h3>
              <p className="panel-sub">How many reading sessions the class finished each week.</p>
              <ActivityChart title={`${className} reading sessions by week`} data={weeks} students={roster.length} />
            </section>
          </div>

          <div className="detail-grid">
            <section className="panel">
              <h3 className="panel-title">Class average by skill</h3>
              <p className="panel-sub">Weakest skills first, so the top is a good place to start a mini-lesson.</p>
              <SkillBars title={`${className} average comprehension score by skill`} skills={skills} />
            </section>

            <section className="panel needs">
              <h3 className="panel-title">Small-group ideas</h3>
              <p className="panel-sub">Students below {PRACTICE_BELOW}% on a skill, grouped so you can reteach together.</p>
              {groups.length === 0 ? (
                <p className="empty">Everyone is at {PRACTICE_BELOW}% or above on every skill they've practiced. 🎉</p>
              ) : (
                <ul className="groups">
                  {groups.map((g) => (
                    <li key={g.id}>
                      <span className="group-skill">{g.label}</span>
                      <span className="group-students">
                        {g.practice.map((s) => (
                          <button key={s.id} className="t-btn small" onClick={() => onSelectStudent(s.id)}>
                            {s.avatar} {s.firstName} · {s.skills[g.id]}%
                          </button>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <section className="panel">
            <h3 className="panel-title">Skills by student</h3>
            <p className="panel-sub">Each square is one student's current score on one skill. Hover for the number, or click a name to open their page.</p>
            <SkillHeatmap
              title={`${className} comprehension scores by student and skill`}
              roster={roster}
              skills={SKILLS}
              onSelectStudent={onSelectStudent}
            />
          </section>
        </>
      ) : (
        <section className="panel">
          <p className="empty">No reading yet. Charts will fill in as students play.</p>
        </section>
      )}
    </>
  )
}

const pct = (v) => (v === null || v === undefined ? '—' : `${v}%`)

function StatTile({ label, value, delta, unit = '', period = 'previous 4 weeks', note }) {
  return (
    <div className="kpi">
      <span className="kpi-label">{label}</span>
      <span className="kpi-value">{value}</span>
      {delta !== null && delta !== undefined && (
        <span className={delta > 0 ? 'kpi-delta up' : delta < 0 ? 'kpi-delta down' : 'kpi-delta'}>
          {delta > 0 ? '▲ +' : delta < 0 ? '▼ ' : ''}
          {delta}
          {unit} vs {period}
        </span>
      )}
      {note && <span className="kpi-note">{note}</span>}
    </div>
  )
}
