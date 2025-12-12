import React, { useEffect, useRef } from 'react';

export default function SparklineRiver({ data, height = 40, color = '#dc2626' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const canvasHeight = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, canvasHeight);

    // Find min and max for scaling
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    // Draw sparkline
    const stepX = width / (data.length - 1);
    
    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, `${color}40`);
    gradient.addColorStop(1, `${color}00`);

    ctx.beginPath();
    ctx.moveTo(0, canvasHeight);
    data.forEach((value, i) => {
      const x = i * stepX;
      const y = canvasHeight - ((value - min) / range) * canvasHeight;
      if (i === 0) {
        ctx.lineTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.lineTo(width, canvasHeight);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    data.forEach((value, i) => {
      const x = i * stepX;
      const y = canvasHeight - ((value - min) / range) * canvasHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.stroke();
    ctx.shadowBlur = 0;

  }, [data, color]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={height}
      className="w-full h-full"
    />
  );
}