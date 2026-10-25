export default function Progress({ step, total }) {
  return (
    <div className="progress" aria-label={`Step ${step} of ${total}`}>
      <div className="dots">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={i === step - 1 ? 'dot active' : i < step - 1 ? 'dot done' : 'dot'}
          />
        ))}
      </div>
      <span className="progress-text">Step {step} of {total}</span>
    </div>
  )
}
