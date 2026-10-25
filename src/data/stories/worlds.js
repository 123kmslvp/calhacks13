// Story worlds students choose from. `unlockAt` worlds are a reward: they
// open when Poppy grows (by Pop Points), so effort unlocks new places to
// explore. Every core world is always open.
export const WORLDS = [
  { id: 'mystery', name: 'Mystery Manor', icon: '🔍', genre: 'Mystery', color: '#7a4cbe', tint: '#f1e8ff' },
  { id: 'adventure', name: 'Adventure Cove', icon: '🧭', genre: 'Adventure', color: '#d9622b', tint: '#fff0e3' },
  { id: 'fantasy', name: 'Fantasy Forest', icon: '🐉', genre: 'Fantasy', color: '#2f8f5b', tint: '#e2f8ee' },
  { id: 'animals', name: 'Animal Valley', icon: '🐾', genre: 'Animals', color: '#a0662a', tint: '#fff4e0' },
  { id: 'science', name: 'Science Lab', icon: '🔬', genre: 'Science', color: '#1f7fb8', tint: '#e5f6ff' },
  { id: 'realworld', name: 'Hometown', icon: '🏘️', genre: 'Real-world', color: '#c23f74', tint: '#fff0f6' },
  { id: 'space', name: 'Star Station', icon: '🚀', genre: 'Science fiction', color: '#3d3d9e', tint: '#ecebff', unlockAt: 250, bonus: true },
]

export const DIFFICULTIES = ['Gentle', 'Medium', 'Challenge']
