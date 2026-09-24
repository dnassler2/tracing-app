import React from 'react';
import { GridConfig, GridColor } from '../types/tracer';

interface GridOverlayProps {
  config: GridConfig;
}

const COLOR_MAP: Record<GridColor, string> = {
  white: '#ffffff',
  black: '#000000',
  cyan: '#06b6d4',
  yellow: '#eab308',
  red: '#ef4444',
};

export const GridOverlay: React.FC<GridOverlayProps> = ({ config }) => {
  if (config.type === 'none') return null;

  const strokeColor = COLOR_MAP[config.color] || '#ffffff';
  const strokeWidth = config.thickness;
  const opacity = config.opacity;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      {/* 1. RULE OF THIRDS */}
      {config.type === 'thirds' && (
        <g stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round">
          {/* Vertical lines */}
          <line x1="33.333%" y1="0%" x2="33.333%" y2="100%" />
          <line x1="66.666%" y1="0%" x2="66.666%" y2="100%" />
          {/* Horizontal lines */}
          <line x1="0%" y1="33.333%" x2="100%" y2="33.333%" />
          <line x1="0%" y1="66.666%" x2="100%" y2="66.666%" />

          {/* Focal power points (intersections) */}
          <circle cx="33.333%" cy="33.333%" r="5" fill="none" strokeWidth={strokeWidth + 1} />
          <circle cx="66.666%" cy="33.333%" r="5" fill="none" strokeWidth={strokeWidth + 1} />
          <circle cx="33.333%" cy="66.666%" r="5" fill="none" strokeWidth={strokeWidth + 1} />
          <circle cx="66.666%" cy="66.666%" r="5" fill="none" strokeWidth={strokeWidth + 1} />

          {/* Focal dot centers */}
          <circle cx="33.333%" cy="33.333%" r="2" fill={strokeColor} />
          <circle cx="66.666%" cy="33.333%" r="2" fill={strokeColor} />
          <circle cx="33.333%" cy="66.666%" r="2" fill={strokeColor} />
          <circle cx="66.666%" cy="66.666%" r="2" fill={strokeColor} />
        </g>
      )}

      {/* 2. DENSE MULTI-BOX GRID (Grid Transfer Method) */}
      {config.type === 'dense' && (
        <g stroke={strokeColor} strokeWidth={strokeWidth}>
          {Array.from({ length: config.denseDivisions - 1 }).map((_, idx) => {
            const pct = ((idx + 1) / config.denseDivisions) * 100;
            return (
              <React.Fragment key={idx}>
                {/* Vertical line */}
                <line x1={`${pct}%`} y1="0%" x2={`${pct}%`} y2="100%" />
                {/* Horizontal line */}
                <line x1="0%" y1={`${pct}%`} x2="100%" y2={`${pct}%`} />
              </React.Fragment>
            );
          })}

          {/* Optional coordinate labels (A-H, 1-8) along edges */}
          {config.showCoordinates && (
            <g
              fill={strokeColor}
              fontSize="11"
              fontFamily="monospace"
              fontWeight="600"
              stroke="none"
              opacity="0.85"
            >
              {Array.from({ length: config.denseDivisions }).map((_, idx) => {
                const char = String.fromCharCode(65 + idx);
                const step = 100 / config.denseDivisions;
                const midX = (idx + 0.5) * step;
                const midY = (idx + 0.5) * step;
                return (
                  <React.Fragment key={`coord-${idx}`}>
                    {/* Top column labels */}
                    <text x={`${midX}%`} y="18" textAnchor="middle">
                      {char}
                    </text>
                    {/* Left row numbers */}
                    <text x="14" y={`${midY}%`} textAnchor="middle" dominantBaseline="middle">
                      {idx + 1}
                    </text>
                  </React.Fragment>
                );
              })}
            </g>
          )}
        </g>
      )}

      {/* 3. DIAGONAL CROSSHAIRS */}
      {config.type === 'diagonal' && (
        <g stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round">
          {/* Corner-to-corner diagonal X */}
          <line x1="0%" y1="0%" x2="100%" y2="100%" />
          <line x1="100%" y1="0%" x2="0%" y2="100%" />
          {/* Central cross */}
          <line x1="50%" y1="0%" x2="50%" y2="100%" />
          <line x1="0%" y1="50%" x2="100%" y2="50%" />
          {/* Diamond harmonic diamond */}
          <polygon
            points="50%,0 100%,50% 50%,100% 0,50%"
            fill="none"
            strokeWidth={Math.max(1, strokeWidth - 0.5)}
            strokeDasharray="4,4"
          />
        </g>
      )}

      {/* 4. GOLDEN RATIO / SPIRAL GUIDE */}
      {config.type === 'golden' && (
        <g stroke={strokeColor} strokeWidth={strokeWidth}>
          {/* Phi lines ~38.2% and 61.8% */}
          <line x1="38.2%" y1="0%" x2="38.2%" y2="100%" />
          <line x1="61.8%" y1="0%" x2="61.8%" y2="100%" />
          <line x1="0%" y1="38.2%" x2="100%" y2="38.2%" />
          <line x1="0%" y1="61.8%" x2="100%" y2="61.8%" />
          {/* Golden section circles */}
          <circle cx="38.2%" cy="38.2%" r="6" fill="none" strokeWidth={strokeWidth + 1} />
          <circle cx="61.8%" cy="38.2%" r="6" fill="none" strokeWidth={strokeWidth + 1} />
          <circle cx="38.2%" cy="61.8%" r="6" fill="none" strokeWidth={strokeWidth + 1} />
          <circle cx="61.8%" cy="61.8%" r="6" fill="none" strokeWidth={strokeWidth + 1} />
        </g>
      )}

      {/* Center crosshair accent if enabled */}
      {config.showCenterCross && (
        <g stroke={strokeColor} strokeWidth={Math.max(2, strokeWidth + 0.5)}>
          <line x1="calc(50% - 16px)" y1="50%" x2="calc(50% + 16px)" y2="50%" />
          <line x1="50%" y1="calc(50% - 16px)" x2="50%" y2="calc(50% + 16px)" />
          <circle cx="50%" cy="50%" r="2.5" fill={strokeColor} />
        </g>
      )}
    </svg>
  );
};
