import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MarketTicker() {
  const marketData = [
    { symbol: 'SPY', price: '481.25', change: '+0.82%', up: true },
    { symbol: 'QQQ', price: '412.80', change: '+1.24%', up: true },
    { symbol: 'NVDA', price: '485.60', change: '+2.15%', up: true },
    { symbol: 'TSLA', price: '342.90', change: '-0.45%', up: false },
    { symbol: 'AAPL', price: '189.50', change: '+0.65%', up: true },
    { symbol: 'MSFT', price: '378.20', change: '+0.92%', up: true },
    { symbol: 'AMZN', price: '178.35', change: '+1.12%', up: true },
    { symbol: 'META', price: '512.80', change: '-0.28%', up: false },
    { symbol: 'GOOGL', price: '142.65', change: '+0.73%', up: true },
    { symbol: 'AMD', price: '128.40', change: '+1.85%', up: true },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-8 bg-black/80 backdrop-blur-xl border-b border-[#00e5ff]/20 overflow-hidden">
      <div className="ticker-wrapper">
        <div className="ticker-track">
          {[...marketData, ...marketData].map((item, index) => (
            <div key={index} className="flex items-center gap-2 whitespace-nowrap px-4">
              <span className="text-xs font-bold text-white tracking-wider">{item.symbol}</span>
              <span className="text-xs text-gray-400">${item.price}</span>
              <span className={`text-xs font-semibold flex items-center gap-1 ${item.up ? 'text-green-400' : 'text-red-400'}`}>
                {item.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .ticker-wrapper {
          display: flex;
          width: 100%;
        }
        .ticker-track {
          display: flex;
          flex-shrink: 0;
          gap: 2rem;
          padding: 0.5rem 0;
          animation: ticker-scroll 40s linear infinite;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        @keyframes ticker-scroll {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
    </div>
  );
}