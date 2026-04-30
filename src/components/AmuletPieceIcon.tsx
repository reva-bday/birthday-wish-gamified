import React from 'react';

export function AmuletPieceIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 150" className={className}>
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fdf098" />
          <stop offset="25%" stopColor="#eeb356" />
          <stop offset="50%" stopColor="#b47c23" />
          <stop offset="75%" stopColor="#eeb356" />
          <stop offset="100%" stopColor="#5c3f0b" />
        </linearGradient>
        <linearGradient id="goldHighlight" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#ca8a04" stopOpacity="0" />
          <stop offset="100%" stopColor="#a16207" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <g>
        {/* Solid Gold Wedge Base */}
        <path
          d="M 76.5 117.7 L 17.8 36.8 A 140 140 0 0 1 182.2 36.8 L 123.5 117.7 A 40 40 0 0 0 76.5 117.7 Z"
          fill="url(#goldGradient)"
          stroke="#5c3f0b"
          strokeWidth="1.5"
        />

        {/* Inner Decorative Ridge */}
        <path
          d="M 81.2 111.9 L 29.6 40.5 A 122 122 0 0 1 170.4 40.5 L 118.8 111.9 A 46 46 0 0 0 81.2 111.9 Z"
          fill="none"
          stroke="url(#goldHighlight)"
          strokeWidth="3"
        />

        {/* Intricate Engravings */}
        <path d="M 100 100 Q 75 75 100 45 Q 125 75 100 100 Z" fill="rgba(92, 63, 11, 0.4)" stroke="#fdf098" strokeWidth="1.5" />
        <path d="M 100 85 Q 85 65 100 55 Q 115 65 100 85 Z" fill="url(#goldGradient)" />

        <path d="M 60 80 Q 40 55 65 45" fill="none" stroke="url(#goldHighlight)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 140 80 Q 160 55 135 45" fill="none" stroke="url(#goldHighlight)" strokeWidth="2.5" strokeLinecap="round" />

        <circle cx="65" cy="45" r="3" fill="#a16207" stroke="#fdf098" strokeWidth="1" />
        <circle cx="135" cy="45" r="3" fill="#a16207" stroke="#fdf098" strokeWidth="1" />

        <polygon points="100,42 96,33 100,24 104,33" fill="#a16207" stroke="#fdf098" strokeWidth="1" />
        <polygon points="65,100 55,95 60,85 70,90" fill="rgba(92, 63, 11, 0.4)" stroke="#fdf098" strokeWidth="1" />
        <polygon points="135,100 145,95 140,85 130,90" fill="rgba(92, 63, 11, 0.4)" stroke="#fdf098" strokeWidth="1" />
      </g>
    </svg>
  );
}
