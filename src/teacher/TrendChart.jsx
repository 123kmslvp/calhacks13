import { useState } from 'react'

const W = 640
const H = 220
const PAD = { top: 16, right: 110, bottom: 30, left: 40 }

// A small line chart for weekly trends. One shared y-axis (series must use
// the same unit). Crosshair + tooltip on hover/focus, direct end labels, a
// legend, and a table view so nothing depends on hover or color alone.
export default function TrendChart({ data, series, yMax = 100, unit = '%', title }) {
  const [active, setActive] = useState(null)
  const [asTable, setAsTable] = useState(false)
  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const x = (i) => PAD.left + (data.length === 1 ? plotW / 2 : (i / (data.length - 1)) * plotW)
  const y = (v) => PAD.top + plotH - (v / yMax) * plotH
  const ticks = [0, yMax / 2, yMax]

  // Draw each series as separate segments so empty weeks leave a gap.
  const paths = series.map((s) => {
    let d = ''
    let pen = false
    data.forEach((row, i) => {
      const v = row[s.key]
      if (v === null || v === undefined) {
        pen = false
        return
      }
      d += `${pen ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)} `
      pen = true
    })
    return d
  })

  const lastPoint = (key) => {
    for (let i = data.length - 1; i >= 0; i--) if (data[i][key] !== null && data[i][key] !== undefined) return i
    return -1
  }

  const nearest = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * W
    let best = 0
    data.forEach((_, i) => {
      if (Math.abs(x(i) - px) < Math.abs(x(best) - px)) best = i
    })
    setActive(best)
  }

  // End-of-line labels, nudged apart when two lines finish close together.
  const labelY = series.map((s) => {
    const i = lastPoint(s.key)
    return i >= 0 ? y(data[i][s.key]) + 4 : null
  })
  for (let a = 1; a < labelY.length; a++) {
    for (let b = 0; b < a; b++) {
      if (labelY[a] !== null && labelY[b] !== null && Math.abs(labelY[a] - labelY[b]) < 14) {
        labelY[a] = labelY[b] + (labelY[a] >= labelY[b] ? 14 : -14)
      }
    }
  }

  const fmt = (v) => (v === null || v === undefined ? '—' : `${v}${unit}`)

  return (
    <div className="trend">
      <div className="trend-head">
        <ul className="legend" aria-label="Legend">
          {series.map((s) => (
            <li key={s.key}>
              <span className="legend-line" style={{ background: s.color }} aria-hidden="true" />
              {s.label}
            </li>
          ))}
        </ul>
        <button type="button" className="t-btn ghost small" onClick={() => setAsTable(!asTable)}>
          {asTable ? '📈 Show chart' : '🔢 Show as table'}
        </button>
      </div>

      {asTable ? (
        <div className="table-wrap">
          <table className="roster">
            <caption className="sr-only">{title}</caption>
            <thead>
              <tr>
                <th>Week ending</th>
                {series.map((s) => (
                  <th key={s.key}>{s.label}</th>
                ))}
                <th>Sessions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  {series.map((s) => (
                    <td key={s.key}>{fmt(row[s.key])}</td>
                  ))}
                  <td>{row.sessions}</td>
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
            onPointerMove={nearest}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(data.length - 1)}
            onBlur={() => setActive(null)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') setActive((a) => Math.max(0, (a ?? data.length) - 1))
              if (e.key === 'ArrowRight') setActive((a) => Math.min(data.length - 1, (a ?? -1) + 1))
            }}
          >
            {ticks.map((t) => (
              <g key={t}>
                <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className="grid" />
                <text x={PAD.left - 8} y={y(t) + 4} className="axis-label" textAnchor="end">
                  {t}
                  {unit === '%' ? '%' : ''}
                </text>
              </g>
            ))}
            {data.map((row, i) =>
              i % 2 === (data.length - 1) % 2 ? (
                <text key={row.label} x={x(i)} y={H - 8} className="axis-label" textAnchor="middle">
                  {row.label}
                </text>
              ) : null
            )}
            {active !== null && <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={PAD.top + plotH} className="crosshair" />}
            {series.map((s, si) => (
              <g key={s.key}>
                <path d={paths[si]} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                {data.map((row, i) =>
                  row[s.key] === null || row[s.key] === undefined ? null : (
                    <circle
                      key={i}
                      cx={x(i)}
                      cy={y(row[s.key])}
                      r={active === i ? 5 : 3.5}
                      fill={s.color}
                      stroke="#fffdf8"
                      strokeWidth="2"
                    />
                  )
                )}
                {lastPoint(s.key) >= 0 && (
                  <text
                    x={x(lastPoint(s.key)) + 10}
                    y={labelY[si]}
                    className="end-label"
                  >
                    {s.short ?? s.label} {fmt(data[lastPoint(s.key)][s.key])}
                  </text>
                )}
              </g>
            ))}
          </svg>
          {active !== null && (
            <div
              className="chart-tip"
              style={{ left: `${(x(active) / W) * 100}%` }}
              role="status"
            >
              <span className="tip-title">Week ending {data[active].label}</span>
              {series.map((s) => (
                <span key={s.key} className="tip-row">
                  <span className="legend-line" style={{ background: s.color }} aria-hidden="true" />
                  <strong>{fmt(data[active][s.key])}</strong> {s.label}
                </span>
              ))}
              <span className="tip-row muted">
                {data[active].sessions} {data[active].sessions === 1 ? 'session' : 'sessions'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
