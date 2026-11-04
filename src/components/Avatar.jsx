import React, { useState } from 'react';

const PALETTES = [
  ['#5865F2', '#3B428A'], // Discord Blurple
  ['#22C55E', '#15803D'], // Jungle Green
  ['#F59E0B', '#B45309'], // Warm Gold
  ['#EC4899', '#9D174D'], // Pink
  ['#EF4444', '#991B1B'], // Crimson
  ['#06B6D4', '#0E7490'], // Cyan
  ['#8B5CF6', '#5B21B6'], // Violet
  ['#F97316', '#C2410C']  // Amber Orange
];

function getHash(str = 'User') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

/**
 * Avatar component:
 * Renders the user's actual Discord avatar from CDN (`cdn.discordapp.com`).
 * If no image is provided or if network fails, falls back gracefully to a clean initials badge.
 */
export default function Avatar({ src, name = 'User', size = 50, className = '' }) {
  const [imgFailed, setImgFailed] = useState(false);

  // If image fails to load or no src provided, render clean initials SVG fallback
  if (imgFailed || !src) {
    const hash = getHash(name);
    const [bg1, bg2] = PALETTES[hash % PALETTES.length];
    const cleanName = name.replace(/\[.*?\]/g, '').replace(/[^a-zA-Z0-9]/g, '').trim();
    const initials = (cleanName.slice(0, 2) || name.slice(0, 2) || 'U').toUpperCase();
    const gradId = `avatar-grad-${hash}-${size}`;

    return (
      <svg
        className={`avatar-svg ${className}`}
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
          borderRadius: '50%',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.45)',
          border: '2px solid rgba(255, 255, 255, 0.25)',
          display: 'block',
          flexShrink: 0
        }}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={bg1} />
            <stop offset="100%" stopColor={bg2} />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill={`url(#${gradId})`} />
        <circle cx="36" cy="46" r="4.5" fill="#ffffff" opacity="0.8" />
        <circle cx="64" cy="46" r="4.5" fill="#ffffff" opacity="0.8" />
        <path
          d="M 38 62 Q 50 74 62 62"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
        <text
          x="50"
          y="30"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="18"
          fontWeight="bold"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="1"
        >
          {initials}
        </text>
      </svg>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setImgFailed(true)}
      className={`avatar-img-element ${className}`}
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        borderRadius: '50%',
        objectFit: 'cover',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        display: 'block',
        flexShrink: 0
      }}
    />
  );
}
