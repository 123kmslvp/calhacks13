export default function Poppy({ size = 'large' }) {
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
