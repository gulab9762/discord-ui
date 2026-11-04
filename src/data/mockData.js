export const INITIAL_SEATS = [
  // Table Cluster 1 (Left Lounge Table)
  { id: 'seat-1', name: 'Cedar Armchair', x: 18, y: 64, table: 'Left Table' },
  { id: 'seat-2', name: 'Wicker Chair', x: 30, y: 62, table: 'Left Table' },
  { id: 'seat-3', name: 'Floor Cushion', x: 24, y: 78, table: 'Left Table' },

  // Table Cluster 2 (Center Main Table)
  { id: 'seat-4', name: 'Timber Chair', x: 43, y: 56, table: 'Center Table' },
  { id: 'seat-5', name: 'Carved Wood Seat', x: 53, y: 56, table: 'Center Table' },
  { id: 'seat-6', name: 'Cozy Floor Pillow', x: 48, y: 76, table: 'Center Table' },

  // Table Cluster 3 (Right-Center Table)
  { id: 'seat-7', name: 'Rattan Armchair', x: 67, y: 63, table: 'Right Table' },
  { id: 'seat-8', name: 'Moss Lounge Seat', x: 77, y: 65, table: 'Right Table' }
];

export const INITIAL_MEMBERS = [];

export const INITIAL_STAFF = [
  {
    id: 'staff-1',
    name: 'Head Chef',
    avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
    role: 'You (Chef)',
    roleColor: '#faa61a',
    isActive: true, // Cooking at stove!
    isSpeaking: false,
    cookingDish: 'Campfire Skillet Stew 🥘',
    dishIcon: '🥘',
    status: 'online'
  },
  {
    id: 'staff-2',
    name: 'Lounge Barista',
    avatar: 'https://cdn.discordapp.com/embed/avatars/4.png',
    role: 'Admin',
    roleColor: '#5865f2',
    isActive: false, // At coffee counter
    isSpeaking: false,
    cookingDish: 'Grilled Jungle Salmon 🐟',
    dishIcon: '🐟',
    status: 'idle'
  }
];

export const COOKING_DISHES = [
  { name: 'Campfire Skillet Stew', icon: '🥘' },
  { name: 'Grilled Jungle Salmon', icon: '🐟' },
  { name: 'Rainforest Herb Tea', icon: '🍵' },
  { name: 'Roasted Spiced Corn', icon: '🌽' },
  { name: 'Hot Cocoa with Marshmallows', icon: '☕' },
  { name: 'Wild Berry Crumble', icon: '🫐' }
];
