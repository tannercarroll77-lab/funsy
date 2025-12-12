import React, { useRef, useEffect } from 'react';

export default function ProphetPayoffDiagram({ trade, spotPrice }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Calculate price range
    const strikes = trade.legs.map(l => l.strike);
    const minStrike = Math.min(...strikes);
    const maxStrike = Math.max(...strikes);
    const range = maxStrike - minStrike;
    const padding = range * 0.5;
    const priceMin = minStrike - padding;
    const priceMax = maxStrike + padding;

    // Helper to convert price to x coordinate
    const priceToX = (price) => ((price - priceMin) / (priceMax - priceMin)) * (width - 60) + 30;
    const profitToY = (profit) => {
      const maxProfit = trade.credit;
      const maxLoss = -trade.maxLoss;
      const profitRange = maxProfit - maxLoss;
      return height - 40 - ((profit - maxLoss) / profitRange) * (height - 80);
    };

    // Draw grid
    ctx.strokeStyle = '#1a2332';
    ctx.lineWidth = 1;
    
    // Horizontal lines
    for (let i = 0; i <= 4; i++) {
      const y = 40 + (i / 4) * (height - 80);
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(width - 30, y);
      ctx.stroke();
    }

    // Draw zero line
    const zeroY = profitToY(0);
    ctx.strokeStyle = '#8b949e';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(30, zeroY);
    ctx.lineTo(width - 30, zeroY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Calculate payoff at each price point
    const calculatePayoff = (price) => {
      let payoff = trade.credit;

      trade.legs.forEach(leg => {
        const multiplier = leg.action === 'SELL' ? -1 : 1;
        
        if (leg.type === 'PUT') {
          const intrinsic = Math.max(0, leg.strike - price);
          payoff += multiplier * intrinsic;
        } else {
          const intrinsic = Math.max(0, price - leg.strike);
          payoff += multiplier * intrinsic;
        }
      });

      return payoff;
    };

    // Draw payoff curve
    ctx.beginPath();
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2;

    const points = [];
    for (let i = 0; i <= 100; i++) {
      const price = priceMin + (i / 100) * (priceMax - priceMin);
      const payoff = calculatePayoff(price);
      points.push({ x: priceToX(price), y: profitToY(payoff), payoff });
    }

    // Draw the line
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach((point, i) => {
      if (i > 0) ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();

    // Fill profit area (green) and loss area (red)
    points.forEach((point, i) => {
      if (i === 0) return;
      const prevPoint = points[i - 1];
      
      ctx.beginPath();
      ctx.moveTo(prevPoint.x, zeroY);
      ctx.lineTo(prevPoint.x, prevPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.lineTo(point.x, zeroY);
      ctx.closePath();
      
      if (point.payoff >= 0) {
        ctx.fillStyle = 'rgba(63, 185, 80, 0.2)';
      } else {
        ctx.fillStyle = 'rgba(248, 81, 73, 0.2)';
      }
      ctx.fill();
    });

    // Draw current price line
    const currentX = priceToX(spotPrice);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(currentX, 20);
    ctx.lineTo(currentX, height - 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw strike markers
    ctx.fillStyle = '#8b949e';
    ctx.font = '10px IBM Plex Mono';
    ctx.textAlign = 'center';

    trade.legs.forEach(leg => {
      const x = priceToX(leg.strike);
      ctx.beginPath();
      ctx.arc(x, profitToY(calculatePayoff(leg.strike)), 4, 0, Math.PI * 2);
      ctx.fillStyle = leg.action === 'SELL' ? '#f85149' : '#3fb950';
      ctx.fill();
      
      ctx.fillStyle = '#8b949e';
      ctx.fillText(`$${leg.strike}`, x, height - 10);
    });

    // Labels
    ctx.fillStyle = '#c9d1d9';
    ctx.font = 'bold 10px IBM Plex Mono';
    ctx.textAlign = 'left';
    ctx.fillText(`MAX PROFIT: $${trade.credit.toFixed(2)}`, 35, 25);
    ctx.fillStyle = '#f85149';
    ctx.fillText(`MAX LOSS: -$${trade.maxLoss.toFixed(2)}`, 35, 40);

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(`SPOT: $${spotPrice.toFixed(2)}`, currentX, 15);

  }, [trade, spotPrice]);

  return (
    <div className="bg-[#000000] border border-[#1a2332] rounded-[2px] p-2">
      <div className="text-[10px] text-[#8b949e] uppercase tracking-wider mb-2 font-mono">Payoff Diagram</div>
      <canvas 
        ref={canvasRef} 
        width={500} 
        height={200} 
        className="w-full"
        style={{ imageRendering: 'crisp-edges' }}
      />
    </div>
  );
}