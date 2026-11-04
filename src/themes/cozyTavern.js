/**
 * Theme configuration for the Warm Hearth Tavern
 */
export const cozyTavernTheme = {
  id: 'cozy-tavern',
  name: 'Warm Hearth Tavern',
  icon: '🪵',
  background: '/jungle-cabin-bg.jpg', // can share backdrop or have dedicated image
  weather: '18°C Mountain Evening • Crackling Hearth 🔥',

  themeVars: {
    '--theme-primary': '#f59e0b',
    '--theme-primary-hover': '#d97706',
    '--theme-accent': '#ef4444',
    '--theme-bg-gradient': 'radial-gradient(circle at 20% 20%, #26160c 0%, #120904 100%)',
    '--theme-header-bg': 'rgba(34, 20, 12, 0.94)',
    '--theme-border': 'rgba(245, 158, 11, 0.25)',
    '--theme-border-glow': 'rgba(245, 158, 11, 0.45)',
    '--theme-vignette': 'radial-gradient(circle at 50% 50%, transparent 45%, rgba(20, 10, 5, 0.45) 100%)'
  },

  layout: {
    door: {
      x: 6,
      y: 24,
      spawnOffsetX: 7,
      spawnOffsetY: 38
    },
    chefStation: {
      cooking: { x: 88, y: 48 },
      break: { x: 88, y: 72 }
    },
    seats: [
      { id: 'seat-1', name: 'Oak Hearth Chair', x: 20, y: 65, table: 'Fireplace Table' },
      { id: 'seat-2', name: 'Leather Bench', x: 32, y: 62, table: 'Fireplace Table' },
      { id: 'seat-3', name: 'Wool Footstool', x: 26, y: 80, table: 'Fireplace Table' },
      { id: 'seat-4', name: 'Tavern Longbench L', x: 44, y: 56, table: 'Feast Hall' },
      { id: 'seat-5', name: 'Tavern Longbench R', x: 54, y: 56, table: 'Feast Hall' },
      { id: 'seat-6', name: 'Bar Stool Center', x: 49, y: 76, table: 'Feast Hall' },
      { id: 'seat-7', name: 'Corner Booth Left', x: 68, y: 64, table: 'Corner Booth' },
      { id: 'seat-8', name: 'Corner Booth Right', x: 78, y: 66, table: 'Corner Booth' }
    ]
  },

  dishes: [
    { name: 'Hearty Beef Stew', icon: '🍲' },
    { name: 'Spiced Mulled Cider', icon: '🍺' },
    { name: 'Wood-Fired Sourdough', icon: '🍞' },
    { name: 'Smoked Honey Ham', icon: '🍖' },
    { name: 'Warm Apple Tart', icon: '🥧' }
  ]
};
