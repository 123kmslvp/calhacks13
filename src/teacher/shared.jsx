import { CATEGORIES, daysSince } from '../data/roster.js'

export const ordinal = (n) => ({ 1: '1st', 2: '2nd', 3: '3rd' })[n] ?? `${n}th`

export function lastActiveText(iso) {
  const days = daysSince(iso)
  if (days === null) return 'Not yet'
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

export function CategoryChip({ id }) {
  const category = CATEGORIES.find((c) => c.id === id)
  return (
    <span className={`chip chip-${id}`}>
      {category.icon} {category.label}
    </span>
  )
}
