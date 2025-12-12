import React, { useState, useEffect } from 'react';

export default function CRTOverlay({ enabled = true }) {
  const [flicker, setFlicker] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    
    const flickerInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        setFlicker(true);
        setTimeout(() => setFlicker(false), 50);
      }
    }, 100);

    return () => clearInterval(flickerInterval);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Scan lines */}
      <div 
        className="fixed inset-0 pointer-events-none z-[90] opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
          animation: 'scanline 8s linear infinite'
        }}
      />

      {/* Vignette */}
      <div 
        className="fixed inset-0 pointer-events-none z-[90] opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.8) 100%)'
        }}
      />

      {/* Flicker effect */}
      {flicker && (
        <div className="fixed inset-0 bg-white/5 pointer-events-none z-[90] animate-pulse" />
      )}

      {/* Screen glow */}
      <div 
        className="fixed inset-0 pointer-events-none z-[90] opacity-10"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(220,38,38,0.1) 0%, transparent 70%)',
          mixBlendMode: 'screen'
        }}
      />

      <style jsx>{`
        @keyframes scanline {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(10px);
          }
        }
      `}</style>
    </>
  );
}