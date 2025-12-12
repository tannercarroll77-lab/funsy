import React, { useEffect, useRef } from 'react';

export default function MatrixLoading() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const columns = Math.floor(canvas.width / 20);
    const drops = Array(columns).fill(1);

    const chars = '01PROPHET$♠♦♣♥ΘΔΓV';

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff00';
      ctx.font = '14px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full bg-black/90 backdrop-blur-sm flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />
      <div className="relative z-10 text-center">
        <div className="text-2xl font-bold text-cyan-400 mb-2 animate-pulse">
          INITIALIZING PROPHET™
        </div>
        <div className="text-sm text-gray-500">
          Analyzing live market data...
        </div>
      </div>
    </div>
  );
}