/**
 * Theme configuration for the Warm Hearth Tavern
 */
export const cozyTavernTheme = {
  id: 'cozy-tavern',
  name: 'Warm Hearth Tavern',
  icon: '🪵',
  background: '/jungle-cabin-bg.jpg',
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
      spawnOffsetX: 12,
      spawnOffsetY: 72
    },
    chefStation: {
      cooking: { x: 89, y: 66 },
      break: { x: 78, y: 66 }
    },
    seats: [
      { id: 'seat-1', name: 'Oak Hearth Chair', x: 21.5, y: 74, table: 'Fireplace Table' },
      { id: 'seat-2', name: 'Wicker Fireside Seat', x: 35, y: 72, table: 'Fireplace Table' },
      { id: 'seat-3', name: 'Tavern Longbench Left', x: 42.5, y: 68, table: 'Feast Hall' },
      { id: 'seat-4', name: 'Tavern Longbench Right', x: 55.5, y: 68, table: 'Feast Hall' },
      { id: 'seat-5', name: 'Front Pew Left', x: 41.5, y: 84, table: 'Feast Hall' },
      { id: 'seat-6', name: 'Front Pew Right', x: 57, y: 84, table: 'Feast Hall' },
      { id: 'seat-7', name: 'Corner Booth Seat A', x: 60, y: 70, table: 'Corner Booth' },
      { id: 'seat-8', name: 'Corner Booth Seat B', x: 70, y: 70, table: 'Corner Booth' },
      { id: 'seat-9', name: 'Tavern Master Chair', x: 72, y: 85, table: 'Corner Booth' },
      { id: 'seat-10', name: 'Taproom Bar Stool', x: 89, y: 92, table: 'Taproom Bar' }
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
