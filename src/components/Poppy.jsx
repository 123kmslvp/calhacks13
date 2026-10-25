// Poppy the Kernel Quest chick, drawn from our artwork in /public.
//
// - Regular Poppy is chick_regular_sprite.png. At the last growth stage (Super
//   Poppy), or when the crown is picked, Poppy is the crowned sprite instead.
// - Poppy grows by size: each growth `stage` scales the chick up a little.
// - Accessories with artwork (bow, robe, scarf) are transparent layers drawn on
//   the same canvas as the chick, so they simply stack on top and line up.
//   Items without artwork yet (the ball cap) still show their emoji.
const ACCESSORY_ART = {
  bow: '/bow_accessory.png',
  robe: '/robe_accessory.png',
  scarf: '/scarf_accessory.png',
  glasses: '/sunglasses_accessory.png',
}

export default function Poppy({ size = 'large', stage, item }) {
  const crowned = stage?.id === 'super' || item?.id === 'crown'
  const accessory = ACCESSORY_ART[item?.id]
  const label = stage ? `Poppy, a ${stage.name}` : 'Poppy the Kernel Quest chick'

  return (
    <div
      className={`poppy poppy-grow poppy-${size}${stage ? ` stage-${stage.id}` : ''}`}
      role="img"
      aria-label={`${label}${item ? `, wearing ${/shades$/i.test(item.label) ? '' : 'a '}${item.label.toLowerCase()}` : ''}`}
    >
      <span className="poppy-sparkle" aria-hidden="true" />
      <span className="poppy-art">
        <img
          className={crowned ? 'poppy-body crowned' : 'poppy-body'}
          src={crowned ? '/chick_w_crown.png' : '/chick_regular_sprite.png'}
          alt=""
        />
        {accessory && <img className={`poppy-acc acc-${item.id}`} src={accessory} alt="" />}
        {item && !accessory && item.id !== 'crown' && (
          <span className={`poppy-item item-${item.id}`} aria-hidden="true">
            {item.icon}
          </span>
        )}
      </span>
    </div>
  )
}
