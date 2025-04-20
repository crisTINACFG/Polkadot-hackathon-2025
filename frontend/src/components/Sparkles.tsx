import React, { useMemo } from 'react';

export function Sparkles() {
  // Generate sparkle configurations once and preserve them across re-renders
  const sparkles = useMemo(() => {
    return [...Array(60)].map(() => {
      return {
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 8,
        duration: Math.random() * 3 + 2,
        scale: Math.random() * 0.7 + 0.6,
        opacity: Math.random() * 0.5 + 0.4
      };
    });
  }, []); // Empty dependency array means this runs only once

  return (
    <div className="sparkles">
      {sparkles.map((sparkle, i) => (
        <div 
          key={i}
          className="sparkle"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
            transform: `scale(${sparkle.scale})`,
            opacity: sparkle.opacity
          }}
        >✨</div>
      ))}
    </div>
  );
} 