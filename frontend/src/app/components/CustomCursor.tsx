import { useState, useEffect } from 'react';

export default function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    if (!isTouch) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999] will-change-transform"
      style={{
        left: mousePos.x - 20,
        top: mousePos.y - 20,
        transform: 'translate3d(0, 0, 0)',
      }}
    >
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="steeringWheelShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="1" stdDeviation="2.5" floodColor="rgba(0,0,0,0.7)" floodOpacity="1" />
          </filter>
        </defs>
        <g filter="url(#steeringWheelShadow)">
          {/* Outer rim */}
          <circle cx="20" cy="20" r="16" stroke="white" strokeWidth="2.8" fill="none" />
          {/* Spoke top (12 o'clock) */}
          <line x1="20" y1="15" x2="20" y2="4" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          {/* Spoke bottom-right (4 o'clock) */}
          <line x1="24.3" y1="22.5" x2="33.9" y2="28" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          {/* Spoke bottom-left (8 o'clock) */}
          <line x1="15.7" y1="22.5" x2="6.1" y2="28" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          {/* Center hub */}
          <circle cx="20" cy="20" r="4.5" fill="#E10600" />
          <circle cx="20" cy="20" r="1.8" fill="rgba(255,255,255,0.8)" />
        </g>
      </svg>
    </div>
  );
}
