import { useEffect, useRef, useState } from 'react'

const WIDTH = 960
const HEIGHT = 600
const MAX_UNDO = 25

const COLORS = [
  { hex: '#2b1a3f', name: 'Black' },
  { hex: '#ffffff', name: 'White' },
  { hex: '#e8364f', name: 'Red' },
  { hex: '#ff8a1f', name: 'Orange' },
  { hex: '#ffd23f', name: 'Yellow' },
  { hex: '#3fbf5a', name: 'Green' },
  { hex: '#35b8e8', name: 'Sky blue' },
  { hex: '#2f5bd8', name: 'Blue' },
  { hex: '#8a4fd8', name: 'Purple' },
  { hex: '#ff6fa8', name: 'Pink' },
  { hex: '#8b5a2b', name: 'Brown' },
  { hex: '#9aa0a6', name: 'Gray' },
]

const SIZES = [
  { px: 6, label: 'Thin' },
  { px: 14, label: 'Medium' },
  { px: 30, label: 'Thick' },
]

// A simple drawing canvas for kids: brush, eraser, stickers, undo, clear.
// Works with mouse, finger, and stylus.
export default function DrawingPad({ stickers, onSave, saving }) {
  const canvasRef = useRef(null)
  const drawingRef = useRef(false)
  const lastRef = useRef(null)
  const undoRef = useRef([])
  const [color, setColor] = useState(COLORS[7].hex)
  const [size, setSize] = useState(SIZES[1].px)
  const [tool, setTool] = useState('brush') // brush | eraser | sticker
  const [sticker, setSticker] = useState(stickers[0])
  const [canUndo, setCanUndo] = useState(false)
  const [isBlank, setIsBlank] = useState(true)

  const ctx = () => canvasRef.current.getContext('2d')

  const fillWhite = () => {
    const c = ctx()
    c.fillStyle = '#ffffff'
    c.fillRect(0, 0, WIDTH, HEIGHT)
  }

  useEffect(fillWhite, [])

  const pushUndo = () => {
    undoRef.current.push(ctx().getImageData(0, 0, WIDTH, HEIGHT))
    if (undoRef.current.length > MAX_UNDO) undoRef.current.shift()
    setCanUndo(true)
  }

  const undo = () => {
    const snapshot = undoRef.current.pop()
    if (snapshot) ctx().putImageData(snapshot, 0, 0)
    setCanUndo(undoRef.current.length > 0)
  }

  const clear = () => {
    pushUndo()
    fillWhite()
    setIsBlank(true)
  }

  // Converts a pointer event to canvas coordinates.
  const point = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * WIDTH,
      y: ((e.clientY - rect.top) / rect.height) * HEIGHT,
    }
  }

  const stroke = (from, to) => {
    const c = ctx()
    c.strokeStyle = tool === 'eraser' ? '#ffffff' : color
    c.lineWidth = tool === 'eraser' ? size * 2 : size
    c.lineCap = 'round'
    c.lineJoin = 'round'
    c.beginPath()
    c.moveTo(from.x, from.y)
    c.lineTo(to.x, to.y)
    c.stroke()
  }

  const onPointerDown = (e) => {
    e.preventDefault()
    canvasRef.current.setPointerCapture(e.pointerId)
    pushUndo()
    setIsBlank(false)
    const p = point(e)
    if (tool === 'sticker') {
      const c = ctx()
      c.font = `${size * 5}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`
      c.textAlign = 'center'
      c.textBaseline = 'middle'
      c.fillText(sticker, p.x, p.y)
      return
    }
    drawingRef.current = true
    lastRef.current = p
    stroke(p, p)
  }

  const onPointerMove = (e) => {
    if (!drawingRef.current) return
    const p = point(e)
    stroke(lastRef.current, p)
    lastRef.current = p
  }

  const endStroke = () => {
    drawingRef.current = false
  }

  return (
    <div className="drawing-pad">
      <div className="draw-tools" role="toolbar" aria-label="Drawing tools">
        <div className="tool-group" role="group" aria-label="Tool">
          {[
            { id: 'brush', icon: '🖍️', label: 'Brush' },
            { id: 'eraser', icon: '🧽', label: 'Eraser' },
            { id: 'sticker', icon: '⭐', label: 'Stickers' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              className={tool === t.id ? 'tool-btn active' : 'tool-btn'}
              aria-pressed={tool === t.id}
              onClick={() => setTool(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="tool-group" role="group" aria-label="Size">
          {SIZES.map((s) => (
            <button
              key={s.px}
              type="button"
              className={size === s.px ? 'size-btn active' : 'size-btn'}
              aria-pressed={size === s.px}
              aria-label={s.label}
              title={s.label}
              onClick={() => setSize(s.px)}
            >
              <span className="size-dot" style={{ width: s.px / 1.5 + 4, height: s.px / 1.5 + 4 }} />
            </button>
          ))}
        </div>

        <div className="tool-group" role="group" aria-label="Undo and clear">
          <button type="button" className="tool-btn" onClick={undo} disabled={!canUndo}>
            Undo
          </button>
          <button type="button" className="tool-btn" onClick={clear} disabled={isBlank}>
            Clear
          </button>
        </div>
      </div>

      {tool === 'sticker' ? (
        <div className="swatches" role="group" aria-label="Stickers">
          {stickers.map((s) => (
            <button
              key={s}
              type="button"
              className={sticker === s ? 'sticker active' : 'sticker'}
              aria-pressed={sticker === s}
              onClick={() => setSticker(s)}
            >
              {s}
            </button>
          ))}
        </div>
      ) : (
        <div className="swatches" role="group" aria-label="Colors">
          {COLORS.map((c) => (
            <button
              key={c.hex}
              type="button"
              className={color === c.hex && tool === 'brush' ? 'swatch active' : 'swatch'}
              style={{ background: c.hex }}
              aria-label={c.name}
              aria-pressed={color === c.hex}
              title={c.name}
              onClick={() => {
                setColor(c.hex)
                setTool('brush')
              }}
            />
          ))}
        </div>
      )}

      <canvas
        ref={canvasRef}
        className={`canvas tool-${tool}`}
        width={WIDTH}
        height={HEIGHT}
        aria-label="Drawing area"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endStroke}
        onPointerCancel={endStroke}
        onPointerLeave={endStroke}
      />

      <div className="step-nav">
        <span />
        <button
          type="button"
          className="start"
          disabled={isBlank || saving}
          onClick={() => onSave(canvasRef.current.toDataURL('image/jpeg', 0.8))}
        >
          Save
        </button>
      </div>
    </div>
  )
}
