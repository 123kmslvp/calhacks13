import { useState } from 'react'
import { PRACTICE_BELOW, SKILL_SHORT } from './classInsights.js'

// Charts for the class insights view. Like TrendChart: one hue per chart,
// a hover/focus tooltip on every mark, and a table view so nothing depends
// on hover or color alone.

const BAR = '#256abf'
// Ordinal blue ramp for the skill heatmap, light → dark (validated against
// the panel surface). Darker means a stronger score.
export const HEAT_BINS = [
  { min: 90, color: '#104281', label: '90% and up' },
  { min: 75, color: '#256abf', label: '75–89%' },
  { min: PRACTICE_BELOW, color: '#5598e7', label: `${PRACTICE_BELOW}–74%` },
  { min: 0, color: '#86b6ef', label: `Below ${PRACTICE_BELOW}% · needs practice` },
]
const heatColor = (v) => HEAT_BINS.find((b) => v >= b.min).color

// Rounds an axis maximum up to a friendly number.
function niceMax(v) {
  if (v <= 0) return 4
  const step = 10 ** Math.floor(Math.log10(v))
  const nice = [1, 2, 2.5, 5, 10].find((m) => m * step >= v)
  return nice * step
}

// Bar with a 4px rounded data end; the baseline end stays square.
function columnPath(x, y, w, h, r = 4) {
  if (h <= 0) return ''
  r = Math.min(r, h, w / 2)
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`
}
function rowPath(x, y, w, h, r = 4) {
  if (w <= 0) return ''
  r = Math.min(r, w, h / 2)
  return `M${x},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x}Z`
}

function TableToggle({ asTable, setAsTable, children }) {
  return (
    <div className="trend-head">
      {children ?? <span />}
      <button type="button" className="t-btn ghost small" onClick={() => setAsTable(!asTable)}>
        {asTable ? '📊 Show chart' : '🔢 Show as table'}
      </button>
    </div>
  )
}

// Keyboard support shared by the bar charts: arrows move between marks.
const arrowKeys = (count, setActive) => (e) => {
  const prev = ['ArrowLeft', 'ArrowUp'].includes(e.key)
  const next = ['ArrowRight', 'ArrowDown'].includes(e.key)
  if (!prev && !next) return
  e.preventDefault()
  setActive((a) => (prev ? Math.max(0, (a ?? count) - 1) : Math.min(count - 1, (a ?? -1) + 1)))
}

// ---------- Weekly reading sessions (columns) ----------

export function ActivityChart({ data, students, title }) {
  const [active, setActive] = useState(null)
  const [asTable, setAsTable] = useState(false)
  const W = 640
  const H = 220
  const PAD = { top: 16, right: 16, bottom: 30, left: 40 }
  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const yMax = niceMax(Math.max(...data.map((d) => d.sessions)))
  const slot = plotW / data.length
  const barW = Math.min(44, slot - 2)
  const x = (i) => PAD.left + i * slot + (slot - barW) / 2
  const y = (v) => PAD.top + plotH - (v / yMax) * plotH
  const ticks = [0, yMax / 2, yMax]

  return (
    <div className="trend">
      <TableToggle asTable={asTable} setAsTable={setAsTable} />
      {asTable ? (
        <div className="table-wrap">
          <table className="roster">
            <caption className="sr-only">{title}</caption>
            <thead>
              <tr>
                <th>Week ending</th>
                <th>Reading sessions</th>
                <th>Students who read</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td>{row.sessions}</td>
                  <td>{row.active} of {students}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="chart-wrap">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="chart"
            role="img"
            aria-label={`${title}. Use the table view for exact values.`}
            tabIndex={0}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(data.length - 1)}
            onBlur={() => setActive(null)}
            onKeyDown={arrowKeys(data.length, setActive)}
          >
            {ticks.map((t) => (
              <g key={t}>
                <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className={t === 0 ? 'baseline' : 'grid'} />
                <text x={PAD.left - 8} y={y(t) + 4} className="axis-label" textAnchor="end">
                  {t}
                </text>
              </g>
            ))}
            {data.map((row, i) => (
              <g key={row.label} onPointerEnter={() => setActive(i)}>
                {/* Hit target: the whole column, not just the bar. */}
                <rect x={PAD.left + i * slot} y={PAD.top} width={slot} height={plotH} fill="transparent" />
                <path
                  d={columnPath(x(i), y(row.sessions), barW, plotH + PAD.top - y(row.sessions))}
                  fill={BAR}
                  opacity={active === null || active === i ? 1 : 0.55}
                />
                {(i % 2 === (data.length - 1) % 2) && (
                  <text x={x(i) + barW / 2} y={H - 8} className="axis-label" textAnchor="middle">
                    {row.label}
                  </text>
                )}
              </g>
            ))}
            {/* Label only the latest week; the rest live in the tooltip and table. */}
            <text
              x={x(data.length - 1) + barW / 2}
              y={y(data.at(-1).sessions) - 6}
              className="end-label"
              textAnchor="middle"
            >
              {data.at(-1).sessions}
            </text>
          </svg>
          {active !== null && (
            <div className="chart-tip" style={{ left: `${((x(active) + barW / 2) / W) * 100}%` }} role="status">
              <span className="tip-title">Week ending {data[active].label}</span>
              <span className="tip-row">
                <span className="legend-swatch" style={{ background: BAR }} aria-hidden="true" />
                <strong>{data[active].sessions}</strong> reading {data[active].sessions === 1 ? 'session' : 'sessions'}
              </span>
              <span className="tip-row muted">
                {data[active].active} of {students} students read
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ---------- Class average by skill (horizontal bars) ----------

export function SkillBars({ skills, title }) {
  const [active, setActive] = useState(null)
  const [asTable, setAsTable] = useState(false)
  // Narrower than the other charts: it sits in a half-width panel.
  const W = 400
  const ROW = 34
  const PAD = { top: 8, right: 44, bottom: 26, left: 92 }
  const H = PAD.top + skills.length * ROW + PAD.bottom
  const plotW = W - PAD.left - PAD.right
  const barH = 18
  const x = (v) => PAD.left + (v / 100) * plotW
  const rowY = (i) => PAD.top + i * ROW + (ROW - barH) / 2
  const names = (list) => list.map((s) => s.firstName).join(', ')

  return (
    <div className="trend">
      <TableToggle asTable={asTable} setAsTable={setAsTable}>
        <span className="chart-note">
          Dashed line: {PRACTICE_BELOW}% practice line
        </span>
      </TableToggle>
      {asTable ? (
        <div className="table-wrap">
          <table className="roster">
            <caption className="sr-only">{title}</caption>
            <thead>
              <tr>
                <th>Skill</th>
                <th>Class average</th>
                <th>Students scored</th>
                <th>Below {PRACTICE_BELOW}%</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((s) => (
                <tr key={s.id}>
                  <td>{s.label}</td>
                  <td>{s.average === null ? '—' : `${s.average}%`}</td>
                  <td>{s.scored}</td>
                  <td>{s.practice.length ? names(s.practice) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="chart-wrap">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="chart"
            role="img"
            aria-label={`${title}. Use the table view for exact values.`}
            tabIndex={0}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(0)}
            onBlur={() => setActive(null)}
            onKeyDown={arrowKeys(skills.length, setActive)}
          >
            {[0, 50, 100].map((t) => (
              <g key={t}>
                <line x1={x(t)} x2={x(t)} y1={PAD.top} y2={H - PAD.bottom} className={t === 0 ? 'baseline' : 'grid'} />
                <text x={x(t)} y={H - 8} className="axis-label" textAnchor="middle">{t}%</text>
              </g>
            ))}
            <line
              x1={x(PRACTICE_BELOW)}
              x2={x(PRACTICE_BELOW)}
              y1={PAD.top}
              y2={H - PAD.bottom}
              className="crosshair"
            />
            {skills.map((s, i) => (
              <g key={s.id} onPointerEnter={() => setActive(i)}>
                <rect x={0} y={PAD.top + i * ROW} width={W} height={ROW} fill="transparent" />
                <text x={PAD.left - 10} y={rowY(i) + barH / 2 + 4} className="row-label" textAnchor="end">
                  {s.short}
                </text>
                {s.average === null ? (
                  <text x={x(0) + 6} y={rowY(i) + barH / 2 + 4} className="axis-label">Not started</text>
                ) : (
                  <>
                    <path
                      d={rowPath(x(0), rowY(i), x(s.average) - x(0), barH)}
                      fill={BAR}
                      opacity={active === null || active === i ? 1 : 0.55}
                    />
                    <text x={x(s.average) + 6} y={rowY(i) + barH / 2 + 4} className="end-label">
                      {s.average}%
                    </text>
                  </>
                )}
              </g>
            ))}
          </svg>
          {active !== null && (
            <div
              className="chart-tip"
              style={{ left: `${((PAD.left + plotW / 2) / W) * 100}%`, top: `${((rowY(active) + barH + 6) / H) * 100}%` }}
              role="status"
            >
              <span className="tip-title">{skills[active].label}</span>
              <span className="tip-row">
                <strong>{skills[active].average === null ? '—' : `${skills[active].average}%`}</strong> class average
                ({skills[active].scored} {skills[active].scored === 1 ? 'student' : 'students'})
              </span>
              <span className="tip-row muted">
                {skills[active].practice.length
                  ? `Below ${PRACTICE_BELOW}%: ${names(skills[active].practice)}`
                  : `Nobody below ${PRACTICE_BELOW}%`}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ---------- Student × skill heatmap ----------

export function SkillHeatmap({ roster, skills, onSelectStudent, title }) {
  const [active, setActive] = useState(null) // { id, skill }
  const [asTable, setAsTable] = useState(false)
  const students = [...roster].sort((a, b) => a.firstName.localeCompare(b.firstName))
  const pct = (v) => (v === null || v === undefined ? '—' : `${v}%`)

  return (
    <div className="trend">
      <TableToggle asTable={asTable} setAsTable={setAsTable}>
        <ul className="legend" aria-label="Legend">
          {[...HEAT_BINS].reverse().map((b) => (
            <li key={b.label}>
              <span className="legend-swatch" style={{ background: b.color }} aria-hidden="true" />
              {b.label}
            </li>
          ))}
          <li>
            <span className="legend-swatch empty" aria-hidden="true" />
            No answers yet
          </li>
        </ul>
      </TableToggle>
      <div className={asTable ? 'table-wrap' : 'heat-wrap'}>
        <table className={asTable ? 'roster' : 'heatmap'}>
          <caption className="sr-only">{title}</caption>
          <thead>
            <tr>
              <th>Student</th>
              {skills.map((k) => (
                <th key={k.id} title={k.label} scope="col">{SKILL_SHORT[k.id] ?? k.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <th scope="row">
                  <button className="link-btn" onClick={() => onSelectStudent(s.id)}>
                    <span className="row-avatar" aria-hidden="true">{s.avatar}</span>
                    {s.firstName} {s.lastName}
                  </button>
                </th>
                {skills.map((k) => {
                  const v = s.skills?.[k.id] ?? null
                  if (asTable) return <td key={k.id}>{pct(v)}</td>
                  const on = active?.id === s.id && active?.skill === k.id
                  return (
                    <td key={k.id} className="heat-td">
                      <span
                        className={v === null ? 'heat-cell empty' : 'heat-cell'}
                        style={v === null ? undefined : { background: heatColor(v) }}
                        tabIndex={0}
                        aria-label={`${s.firstName}, ${k.label}: ${v === null ? 'no answers yet' : `${v}%`}`}
                        onPointerEnter={() => setActive({ id: s.id, skill: k.id })}
                        onPointerLeave={() => setActive(null)}
                        onFocus={() => setActive({ id: s.id, skill: k.id })}
                        onBlur={() => setActive(null)}
                      />
                      {on && (
                        <span className="chart-tip heat-tip" role="status">
                          <span className="tip-title">{s.firstName} {s.lastName}</span>
                          <span className="tip-row">
                            <strong>{pct(v)}</strong> {k.label.toLowerCase()}
                          </span>
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
