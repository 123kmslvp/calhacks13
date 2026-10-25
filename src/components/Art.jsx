// Our drawn artwork from /public. Most of the PNGs sit on a big transparent
// canvas with the drawing in the middle, so <Art> shows just the drawn part:
// it trims the empty margin only (never the drawing), keeps the original
// aspect ratio, and keeps the transparent background. Set the width with CSS
// (or `style`); the height follows.
//
// `box` is the drawing's bounding box on its canvas, in pixels: [left, top, right, bottom].
const ART = {
  kernel: { src: '/kernel.png', size: [1280, 1280], box: [24, 140, 1240, 624] },
  quest: { src: '/quest.png', size: [1280, 1280], box: [152, 700, 1012, 1092] },
  book: { src: '/book.png', size: [1280, 1280], box: [124, 156, 1156, 992] },
  egg: { src: '/egg.png', size: [1280, 1280], box: [216, 328, 952, 1208] },
  popcorn: { src: '/popcorn.png', size: [1280, 1280], box: [92, 160, 1096, 916] },
}
const MARGIN = 6 // a little breathing room around the measured box

export function Art({ name, className = '', style, label }) {
  const { src, size: [w, h], box } = ART[name]
  const x0 = Math.max(0, box[0] - MARGIN)
  const y0 = Math.max(0, box[1] - MARGIN)
  const x1 = Math.min(w, box[2] + MARGIN)
  const y1 = Math.min(h, box[3] + MARGIN)
  const bw = x1 - x0
  const bh = y1 - y0
  return (
    <span
      className={`art ${className}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{
        aspectRatio: `${bw} / ${bh}`,
        backgroundImage: `url(${src})`,
        backgroundSize: `${(w / bw) * 100}% auto`,
        backgroundPosition: `${bw === w ? 0 : (x0 / (w - bw)) * 100}% ${bh === h ? 0 : (y0 / (h - bh)) * 100}%`,
        ...style,
      }}
    />
  )
}

// Emoji that have a matching drawing become that drawing; every other emoji
// is left as it was.
const EMOJI_ART = { '📖': 'book', '📚': 'book', '🍿': 'popcorn' }

export function Icon({ e }) {
  const name = EMOJI_ART[e]
  return name ? <Art name={name} className="art-icon" /> : e
}

// "Kernel" over "Quest", from our two hand-lettered logo pieces.
export function Logo() {
  return (
    <div className="logo" role="img" aria-label="Kernel Quest">
      <Art name="kernel" className="logo-kernel" />
      <Art name="quest" className="logo-quest" />
    </div>
  )
}
