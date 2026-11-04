/**
 * Theme configuration for the Jungle Cabin Lounge
 * Precision-mapped to the actual visual furniture, wooden chairs, tables, and kitchen range in public/jungle-cabin-bg.jpg.
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
      spawnOffsetX: 12,
      spawnOffsetY: 72
    },

    // Chef cooking hotspot coordinates (aligned to the actual stove and espresso bar)
    chefStation: {
      cooking: { x: 89, y: 66 }, // Right in front of the stove range
      break: { x: 78, y: 66 }     // At the coffee espresso counter
    },

    // Seating positions precisely aligned to each chair in public/jungle-cabin-bg.jpg
    seats: [
      // Table Cluster 1: Left Live-Edge Table (2 Wicker Armchairs)
      { id: 'seat-1', name: 'Left Wicker Armchair', x: 22.5, y: 74, table: 'Left Table' },
      { id: 'seat-2', name: 'Right Wicker Armchair', x: 35, y: 72, table: 'Left Table' },

      // Table Cluster 2: Center Long Dining Table (4 Wooden Chairs)
      { id: 'seat-3', name: 'Back-Left Dining Chair', x: 42.5, y: 68, table: 'Center Table' },
      { id: 'seat-4', name: 'Back-Right Dining Chair', x: 55.5, y: 68, table: 'Center Table' },
      { id: 'seat-5', name: 'Front-Left Dining Chair', x: 41.5, y: 84, table: 'Center Table' },
      { id: 'seat-6', name: 'Front-Right Dining Chair', x: 57, y: 84, table: 'Center Table' },

      // Table Cluster 3: Right Stump Lounge Area (3 Armchairs)
      { id: 'seat-7', name: 'Stump Lounge Left Chair', x: 60, y: 70, table: 'Right Table' },
      { id: 'seat-8', name: 'Stump Lounge Right Chair', x: 70, y: 70, table: 'Right Table' },
      { id: 'seat-9', name: 'Foreground Timber Armchair', x: 72, y: 85, table: 'Right Table' },

      // Kitchen Island Counter Bar Stool
      { id: 'seat-10', name: 'Kitchen Counter Stool', x: 89, y: 92, table: 'Kitchen Bar' }
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
