const KERNEL_STAGES = ['kernel', 'warm', 'sizzle']

// Poppy the popcorn kernel. With no `stage`, Poppy looks like the classic
// welcome-screen mascot. With a growth `stage` (from POPPY_STAGES), Poppy
// grows from a tiny kernel into popcorn, optionally wearing an `item`.
export default function Poppy({ size = 'large', stage, item }) {
  if (!stage) {
    return (
      <div
        className={size === 'small' ? 'poppy poppy-small' : 'poppy'}
        role="img"
        aria-label="Poppy the popcorn kernel"
      >
        <span className="poppy-emoji">🍿</span>
        <div className="poppy-face">
          <span className="eye" />
          <span className="eye" />
        </div>
      </div>
    )
  }

  const isKernel = KERNEL_STAGES.includes(stage.id)
  const face = (
    <span className="poppy-face">
      <span className="eye" />
      <span className="eye" />
    </span>
  )

  return (
    <div
      className={`poppy poppy-grow poppy-${size} stage-${stage.id}`}
      role="img"
      aria-label={`Poppy, a ${stage.name}${item ? `, wearing a ${item.label.toLowerCase()}` : ''}`}
    >
      {isKernel ? (
        <span className="kernel">{face}</span>
      ) : (
        <span className="pop-body">
          <span className="poppy-emoji">🍿</span>
          {face}
        </span>
      )}
      {stage.id === 'sizzle' && <span className="sizzle" aria-hidden="true">✨</span>}
      {stage.id === 'super' && <span className="sparkle" aria-hidden="true">🌟</span>}
      {item && (
        <span className={`poppy-item item-${item.id}`} aria-hidden="true">
          {item.icon}
        </span>
      )}
    </div>
  )
}
