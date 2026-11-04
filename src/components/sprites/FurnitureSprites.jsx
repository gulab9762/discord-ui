import React from 'react';

// ==========================================
// REALISTIC 2.5D VECTOR SPRITES & FURNITURE
// ==========================================

export function WindowSprite({ type = 'night' }) {
  return (
    <div className="cozy-window">
      <div className="window-frame">
        <div className="window-curtain curtain-left"></div>
        <div className="window-curtain curtain-right"></div>
        <div className="window-glass">
          {/* Animated Sky Backdrop: drifting clouds & twinkling stars */}
          <div className="sky-scene">
            <div className="celestial-moon"></div>
            <div className="star s1">✦</div>
            <div className="star s2">★</div>
            <div className="star s3">✦</div>
            <div className="star s4">★</div>
            <div className="cloud cloud-1"></div>
            <div className="cloud cloud-2"></div>
            {/* Soft raindrops or floating particles outside */}
            <div className="rain-drop r1"></div>
            <div className="rain-drop r2"></div>
            <div className="rain-drop r3"></div>
          </div>
          {/* Window Panes (Mullions) */}
          <div className="window-mullion-v"></div>
          <div className="window-mullion-h"></div>
        </div>
        <div className="window-sill">
          <span className="sill-plant">🪴</span>
          <span className="sill-candle">🕯️</span>
        </div>
        <div className="window-lightbeam"></div>
      </div>
    </div>
  );
}

export function DoorSprite({ isOpen = false }) {
  return (
    <div className="lounge-door-container">
      <div className="door-arch">
        <div className="door-frame">
          <div className={`door-panel ${isOpen ? 'open' : ''}`}>
            <div className="door-molding top">
              <div className="frosted-glass-pane">
                <span className="door-number">LOUNGE</span>
              </div>
            </div>
            <div className="door-molding bottom">
              <div className="brass-handle">
                <div className="keyhole"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="door-mat">
          <span>WELCOME</span>
        </div>
      </div>
    </div>
  );
}

export function KitchenServiceDoor() {
  return (
    <div className="kitchen-saloon-door">
      <div className="saloon-panel left-panel">
        <div className="porthole-window">
          <span className="porthole-glass">🍳</span>
        </div>
        <div className="push-plate"></div>
      </div>
      <div className="saloon-panel right-panel">
        <div className="porthole-window">
          <span className="porthole-glass">🧑‍🍳</span>
        </div>
        <div className="push-plate"></div>
      </div>
    </div>
  );
}

export function ArmchairSprite({ color = '#1a4731', isOccupied = false }) {
  return (
    <div className={`furniture-sprite armchair-sprite ${isOccupied ? 'cushion-pressed' : ''}`}>
      <div className="chair-shadow"></div>
      <div className="armchair-backrest" style={{ backgroundColor: color }}>
        <div className="tufting-grid">
          <span className="tuft"></span>
          <span className="tuft"></span>
          <span className="tuft"></span>
          <span className="tuft"></span>
        </div>
      </div>
      <div className="armrest left" style={{ backgroundColor: color }}></div>
      <div className="armrest right" style={{ backgroundColor: color }}></div>
      <div className="chair-cushion" style={{ backgroundColor: color }}>
        <div className="cushion-highlight"></div>
      </div>
      <div className="chair-legs">
        <span className="leg leg-l"></span>
        <span className="leg leg-r"></span>
      </div>
    </div>
  );
}

export function SofaSprite({ color = '#4a2512', isOccupied = false }) {
  return (
    <div className={`furniture-sprite sofa-sprite ${isOccupied ? 'cushion-pressed' : ''}`}>
      <div className="sofa-shadow"></div>
      <div className="sofa-backrest" style={{ backgroundColor: color }}>
        <div className="tufting-grid-sofa">
          <span className="tuft"></span>
          <span className="tuft"></span>
          <span className="tuft"></span>
          <span className="tuft"></span>
          <span className="tuft"></span>
          <span className="tuft"></span>
        </div>
      </div>
      <div className="sofa-armrest left" style={{ backgroundColor: color }}></div>
      <div className="sofa-armrest right" style={{ backgroundColor: color }}></div>
      <div className="sofa-cushion" style={{ backgroundColor: color }}>
        <div className="cushion-divider"></div>
        <div className="cushion-highlight"></div>
      </div>
      <div className="sofa-legs">
        <span className="leg leg-l"></span>
        <span className="leg leg-m"></span>
        <span className="leg leg-r"></span>
      </div>
    </div>
  );
}

export function BeanBagSprite({ color = '#7a3121', isOccupied = false }) {
  return (
    <div className={`furniture-sprite beanbag-sprite ${isOccupied ? 'cushion-pressed' : ''}`}>
      <div className="beanbag-shadow"></div>
      <div className="beanbag-body" style={{ backgroundColor: color }}>
        <div className="beanbag-creases"></div>
        <div className="beanbag-tag">LOUNGE</div>
      </div>
    </div>
  );
}

// 1. Center Fireplace Coffee Table
export function CoffeeTableSprite() {
  return (
    <div className="table-wrapper coffee-table-wrapper">
      <div className="coffee-table-sprite">
        <div className="table-shadow"></div>
        <div className="table-top">
          <div className="table-specular"></div>
          <div className="table-props">
            {/* Animated Steaming Cup */}
            <div className="steaming-cup" title="Freshly brewed latte">
              <span className="cup-body">☕</span>
              <div className="cup-steam">
                <span className="steam-line s1">~</span>
                <span className="steam-line s2">~</span>
              </div>
            </div>
            {/* Vintage Open Book */}
            <div className="open-book">
              <div className="book-page left-page"></div>
              <div className="book-page right-page flutter"></div>
            </div>
            {/* Ambient Candle */}
            <div className="table-candle">
              <div className="candle-flame"></div>
            </div>
          </div>
        </div>
        <div className="table-legs">
          <div className="table-leg leg-1"></div>
          <div className="table-leg leg-2"></div>
          <div className="table-leg leg-3"></div>
          <div className="table-leg leg-4"></div>
        </div>
      </div>
      <span className="table-label">Fireplace Table</span>
    </div>
  );
}

// 2. Round Bistro Cafe Table
export function BistroTableSprite() {
  return (
    <div className="table-wrapper bistro-table-wrapper">
      <div className="bistro-table-sprite">
        <div className="bistro-shadow"></div>
        <div className="bistro-top">
          <div className="bistro-specular"></div>
          <div className="table-props">
            <span className="croissant-plate" title="Warm butter croissant">🥐</span>
            <div className="steaming-cup tea-cup" title="Matcha Green Tea">
              <span className="cup-body">🍵</span>
              <div className="cup-steam">
                <span className="steam-line s1">~</span>
                <span className="steam-line s2">~</span>
              </div>
            </div>
            <span className="flower-vase" title="Fresh daisies">🌼</span>
          </div>
        </div>
        <div className="bistro-pedestal">
          <div className="pedestal-column"></div>
          <div className="pedestal-base"></div>
        </div>
      </div>
      <span className="table-label">Cafe Bistro Table</span>
    </div>
  );
}

// 3. Side Game & Reading Table
export function SideTableSprite() {
  return (
    <div className="table-wrapper side-table-wrapper">
      <div className="side-table-sprite">
        <div className="side-shadow"></div>
        <div className="side-top">
          <div className="side-specular"></div>
          <div className="table-props">
            <span className="chess-pieces" title="Chess & Board Games">♟️🎲</span>
            <span className="table-lantern" title="Warm brass lantern">🏮</span>
          </div>
        </div>
        <div className="side-legs">
          <div className="side-leg"></div>
          <div className="side-leg"></div>
        </div>
      </div>
      <span className="table-label">Game & Lounge Table</span>
    </div>
  );
}
