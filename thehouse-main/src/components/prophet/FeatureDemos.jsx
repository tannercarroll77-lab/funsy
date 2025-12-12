import React from 'react';
import { Activity, Zap, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';

// --- Gamma Exposure Demo ---
export function GammaDemo() {
  return (
    <div className="w-full h-full bg-[#0d1117] p-4 flex flex-col font-mono text-xs relative overflow-hidden select-none">
      <div className="flex justify-between items-center mb-4 border-b border-[#30363d] pb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#00e5ff]" />
          <span className="text-white font-bold">GEX PROFILE: SPX</span>
        </div>
        <span className="text-[#00e5ff]">LIVE</span>
      </div>
      
      <div className="flex-1 relative flex items-center justify-center">
        {/* Central Zero Line */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[#30363d]" />
        
        <div className="w-full space-y-1.5">
          {/* Mock Data Rows */}
          {[...Array(12)].map((_, i) => {
            // Generate some pseudo-random widths
            const isCall = i % 2 === 0;
            const width = 20 + (Math.sin(i) * 40 + 40); 
            const isPutWall = i === 8;
            const isCallWall = i === 3;
            
            return (
              <div key={i} className="flex items-center h-4 w-full relative group">
                <div className="w-1/2 flex justify-end pr-2">
                  {/* Put Gamma */}
                  {!isCall && (
                    <div 
                      className={`h-3 rounded-l-sm transition-all duration-1000 ${isPutWall ? 'bg-[#dc2626]' : 'bg-[#dc2626]/40'}`} 
                      style={{ width: `${width}%` }} 
                    />
                  )}
                </div>
                <div className="w-1/2 flex justify-start pl-2">
                  {/* Call Gamma */}
                  {isCall && (
                    <div 
                      className={`h-3 rounded-r-sm transition-all duration-1000 ${isCallWall ? 'bg-[#3fb950]' : 'bg-[#3fb950]/40'}`} 
                      style={{ width: `${width}%` }} 
                    />
                  )}
                </div>
                
                {/* Price Label */}
                <div className="absolute left-1/2 -translate-x-1/2 text-[9px] text-gray-500 bg-[#0d1117] px-1">
                  {4800 + (i * 10)}
                </div>

                {isCallWall && (
                  <div className="absolute right-4 top-0 text-[9px] text-[#3fb950] font-bold">CALL WALL</div>
                )}
                {isPutWall && (
                  <div className="absolute left-4 top-0 text-[9px] text-[#dc2626] font-bold">PUT WALL</div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Current Price Indicator */}
        <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-white/30 flex justify-between px-2">
          <span className="text-[9px] text-white bg-[#0d1117] -mt-2 px-1">SPOT: 4845.50</span>
        </div>
      </div>
    </div>
  );
}

// --- Advanced Analytics Demo ---
export function AnalyticsDemo() {
  return (
    <div className="w-full h-full bg-[#0d1117] p-4 flex flex-col font-mono text-xs relative overflow-hidden select-none">
      <div className="flex justify-between items-center mb-4 border-b border-[#30363d] pb-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#a855f7]" />
          <span className="text-white font-bold">PROPHET CALENDAR</span>
        </div>
        <span className="text-[#a855f7]">92% EDGE</span>
      </div>

      <div className="grid grid-cols-7 gap-1 h-full content-start">
        {['M','T','W','T','F','S','S'].map(d => (
          <div key={d} className="text-center text-[9px] text-gray-500 mb-1">{d}</div>
        ))}
        {[...Array(35)].map((_, i) => {
          const score = Math.abs(Math.sin(i * 123)) * 100;
          let color = 'bg-[#1a2332]';
          if (score > 90) color = 'bg-[#3fb950] shadow-[0_0_10px_rgba(63,185,80,0.3)]';
          else if (score > 70) color = 'bg-[#3fb950]/50';
          else if (score > 50) color = 'bg-[#3fb950]/20';
          
          return (
            <div key={i} className={`aspect-square rounded-[2px] ${color} relative group hover:scale-110 transition-transform`}>
              {score > 85 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white">{Math.floor(score)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 bg-[#1a2332]/50 rounded p-2 border border-[#30363d]">
        <div className="flex justify-between mb-1">
          <span className="text-gray-400">Top Ticker</span>
          <span className="text-white font-bold">NVDA</span>
        </div>
        <div className="w-full bg-[#0d1117] h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#a855f7] w-[87%] h-full" />
        </div>
      </div>
    </div>
  );
}

// --- 0DTE Pro Demo ---
export function ZeroDTEDemo() {
  return (
    <div className="w-full h-full bg-[#0d1117] p-4 flex flex-col font-mono text-xs relative overflow-hidden select-none">
      <div className="flex justify-between items-center mb-4 border-b border-[#30363d] pb-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#f59e0b]" />
          <span className="text-white font-bold">0DTE CONE</span>
        </div>
        <span className="text-[#f59e0b] animate-pulse">VOL SPIKE</span>
      </div>

      <div className="flex-1 relative flex items-end justify-center pb-8">
        {/* The Cone */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="coneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(245, 158, 11, 0.1)" />
              <stop offset="50%" stopColor="rgba(245, 158, 11, 0.3)" />
              <stop offset="100%" stopColor="rgba(245, 158, 11, 0.1)" />
            </linearGradient>
          </defs>
          {/* Upper Bound */}
          <path d="M 0,50 Q 150,50 300,20" stroke="#f59e0b" strokeWidth="1" fill="none" strokeDasharray="4 2" />
          {/* Lower Bound */}
          <path d="M 0,50 Q 150,50 300,80" stroke="#f59e0b" strokeWidth="1" fill="none" strokeDasharray="4 2" />
          {/* Fill */}
          <path d="M 0,50 Q 150,50 300,20 L 300,80 Q 150,50 0,50" fill="url(#coneGrad)" />
        </svg>

        {/* Candles simulating price action */}
        <div className="absolute inset-0 flex items-center px-8">
          <div className="w-full h-20 relative">
            {[...Array(15)].map((_, i) => {
              const height = Math.random() * 20 + 5;
              const isGreen = Math.random() > 0.4;
              return (
                <div 
                  key={i}
                  className={`absolute w-2 ${isGreen ? 'bg-[#3fb950]' : 'bg-[#dc2626]'} bottom-1/2`}
                  style={{ 
                    left: `${i * 7}%`, 
                    height: `${height}px`,
                    transform: `translateY(${Math.sin(i) * 10}px)`
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className="absolute top-10 right-10 bg-[#1a2332] border border-[#f59e0b] p-2 rounded shadow-lg">
          <div className="text-[9px] text-[#f59e0b] font-bold">TARGET HIT</div>
          <div className="text-white text-lg">4820.00</div>
        </div>
      </div>
    </div>
  );
}

// --- Full Access Demo ---
export function FullAccessDemo() {
  return (
    <div className="w-full h-full bg-[#050505] p-2 flex flex-col gap-2 relative overflow-hidden select-none">
      <div className="absolute inset-0 bg-gradient-to-br from-[#dc2626]/10 via-transparent to-[#dc2626]/5 animate-pulse" />
      
      {/* Header */}
      <div className="flex justify-between items-center px-2 py-1 border-b border-[#dc2626]/30">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#dc2626]" />
          <span className="text-white font-bold font-mono text-xs tracking-wider">PROPHET SUITE</span>
        </div>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-[#dc2626] animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-[#00e5ff]" />
          <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
        </div>
      </div>

      {/* Grid of Mini Dashboards */}
      <div className="flex-1 grid grid-cols-2 gap-2 p-1">
        {/* Mini GEX */}
        <div className="bg-[#0d1117] rounded border border-[#30363d] p-2 relative overflow-hidden">
          <div className="text-[8px] text-[#00e5ff] font-mono mb-1">GEX PROFILE</div>
          <div className="space-y-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-1 h-1.5">
                <div className="w-1/2 bg-[#3fb950]/40 rounded-l" style={{width: `${Math.random()*50}%`, marginLeft: 'auto'}} />
                <div className="w-1/2 bg-[#dc2626]/40 rounded-r" style={{width: `${Math.random()*50}%`}} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Mini Calendar */}
        <div className="bg-[#0d1117] rounded border border-[#30363d] p-2 relative overflow-hidden">
          <div className="text-[8px] text-[#a855f7] font-mono mb-1">HEAT MAP</div>
          <div className="grid grid-cols-5 gap-0.5">
            {[...Array(15)].map((_, i) => (
              <div key={i} className={`h-1.5 rounded-[1px] ${Math.random() > 0.7 ? 'bg-[#3fb950]' : 'bg-[#1a2332]'}`} />
            ))}
          </div>
        </div>
        
        {/* Mini Cone */}
        <div className="bg-[#0d1117] rounded border border-[#30363d] p-2 relative overflow-hidden col-span-2">
          <div className="flex justify-between text-[8px] font-mono mb-1">
            <span className="text-[#f59e0b]">0DTE CONE</span>
            <span className="text-white">SPX: 4850</span>
          </div>
          <div className="h-8 relative border-b border-white/10">
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <path d="M 0,30 Q 50,30 100,10 L 100,50 Q 50,30 0,30" fill="rgba(245, 158, 11, 0.2)" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}