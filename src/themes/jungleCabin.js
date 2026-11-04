/**
 * Theme configuration for the Jungle Cabin Lounge
 * Encapsulates all layout coordinates, assets, seating pinpoints, and recipes.
 */
export const jungleCabinTheme = {
  id: 'jungle-cabin',
  name: 'Jungle Cabin Lounge',
  icon: '🌴',
  background: '/jungle-cabin-bg.jpg',
  weather: '24°C Rainforest Canopy • Gentle Rain 🌧️',
  
  // Theme styling tokens (CSS custom properties)
  themeVars: {
    '--theme-primary': '#22c55e',
    '--theme-primary-hover': '#16a34a',
    '--theme-accent': '#f59e0b',
    '--theme-bg-gradient': 'radial-gradient(circle at 20% 20%, #172317 0%, #0d140e 100%)',
    '--theme-header-bg': 'rgba(18, 28, 19, 0.94)',
    '--theme-border': 'rgba(74, 222, 128, 0.2)',
    '--theme-border-glow': 'rgba(34, 197, 94, 0.4)',
    '--theme-vignette': 'radial-gradient(circle at 50% 50%, transparent 50%, rgba(13, 20, 14, 0.35) 100%)'
  },

  // Layout coordinate mappings (percentages 0-100)
  layout: {
    // Entrance Door placement & walking guest spawn vector
    door: {
      x: 6,
      y: 24,
      spawnOffsetX: 7,
      spawnOffsetY: 38
    },

    // Chef cooking hotspot coordinates
    chefStation: {
      cooking: { x: 88, y: 48 },
      break: { x: 88, y: 72 }
    },

    // Seating positions mapped across the scene
    seats: [
      // Table Cluster 1 (Left Timber Table)
      { id: 'seat-1', name: 'Cedar Armchair', x: 18, y: 64, table: 'Left Table' },
      { id: 'seat-2', name: 'Wicker Chair', x: 30, y: 62, table: 'Left Table' },
      { id: 'seat-3', name: 'Floor Cushion', x: 24, y: 78, table: 'Left Table' },

      // Table Cluster 2 (Center Low Table)
      { id: 'seat-4', name: 'Timber Chair', x: 43, y: 56, table: 'Center Table' },
      { id: 'seat-5', name: 'Carved Wood Seat', x: 53, y: 56, table: 'Center Table' },
      { id: 'seat-6', name: 'Cozy Floor Pillow', x: 48, y: 76, table: 'Center Table' },

      // Table Cluster 3 (Right Lounge Area)
      { id: 'seat-7', name: 'Rattan Armchair', x: 67, y: 63, table: 'Right Table' },
      { id: 'seat-8', name: 'Moss Lounge Seat', x: 77, y: 65, table: 'Right Table' }
    ]
  },

  // Kitchen recipes unique to this theme
  dishes: [
    { name: 'Campfire Skillet Stew', icon: '🥘' },
    { name: 'Grilled Jungle Salmon', icon: '🐟' },
    { name: 'Rainforest Herb Tea', icon: '🍵' },
    { name: 'Roasted Spiced Corn', icon: '🌽' },
    { name: 'Hot Cocoa with Marshmallows', icon: '☕' },
    { name: 'Wild Berry Crumble', icon: '🫐' }
  ]
};
