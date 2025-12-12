import React, { useState, useEffect } from 'react';
import { TerminalCard, SectionHeader, StatusBadge } from './BloombergStyles';
import { Calendar, TrendingUp, Zap, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProphetHeatCalendar() {
  const [calendarData, setCalendarData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    generateCalendarData();
  }, []);

  const generateCalendarData = () => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      // Generate score based on various factors
      let baseScore = 65 + Math.random() * 25;

      // Monthly options expiration (3rd Friday) - higher scores
      const thirdFriday = getThirdFriday(date.getFullYear(), date.getMonth());
      if (date.getDate() === thirdFriday.getDate() && date.getMonth() === thirdFriday.getMonth()) {
        baseScore += 10;
      }

      // Weekly expiration (Fridays) - slightly higher
      if (date.getDay() === 5) {
        baseScore += 5;
      }

      // Monday/Tuesday after expiration - lower IV typically
      if (date.getDay() === 1 || date.getDay() === 2) {
        baseScore -= 3;
      }

      // FOMC dates (simulated - typically mid-month)
      if (date.getDate() >= 14 && date.getDate() <= 16) {
        baseScore += 8; // Higher IV around FOMC
      }

      // Earnings season boost (Jan, Apr, Jul, Oct)
      const earningsMonths = [0, 3, 6, 9];
      if (earningsMonths.includes(date.getMonth()) && date.getDate() >= 15) {
        baseScore += 6;
      }

      const score = Math.min(Math.round(baseScore), 100);

      days.push({
        date,
        score,
        tier: score >= 90 ? 'PRIME' : score >= 82 ? 'HIGH' : score >= 72 ? 'MODERATE' : score >= 60 ? 'LOW' : 'MINIMAL',
        events: generateDayEvents(date, score),
        topTickers: generateTopTickers(score),
        analysis: generateDailyAnalysis(score, generateDayEvents(date, score))
      });
    }

    setCalendarData(days);
  };

  const generateDailyAnalysis = (score, events) => {
    const eventNames = events.map(e => e.label).join(', ');
    if (score >= 90) return `Exceptional volatility environment detected. ${eventNames ? `Driven by ${eventNames}.` : ''} Implied volatility is significantly mispriced relative to historical moves. Prime conditions for short premium strategies on high-beta tickers.`;
    if (score >= 80) return `Strong edge identified in the options chain. ${eventNames ? `Catalyzed by ${eventNames}.` : ''} Look for credit spreads on major indices. The skew indicates a bullish bias with overpriced puts.`;
    if (score >= 70) return `Moderate opportunity available. Market maker gamma exposure is neutral. ${eventNames} suggest potential intraday reversals. Focus on defined risk trades.`;
    return `Low probability environment. Heavy institutional hedging detected. Theta decay is likely to be slow. Recommend sitting on hands or very small position sizing.`;
  };

  const generateDayEvents = (date, score) => {
    const events = [];
    
    // Monthly expiration
    const thirdFriday = getThirdFriday(date.getFullYear(), date.getMonth());
    if (date.getDate() === thirdFriday.getDate() && date.getMonth() === thirdFriday.getMonth()) {
      events.push({ type: 'MONTHLY_OPEX', label: 'Monthly OpEx' });
    }

    // Weekly expiration
    if (date.getDay() === 5) {
      events.push({ type: 'WEEKLY_OPEX', label: 'Weekly OpEx' });
    }

    // FOMC
    if (date.getDate() >= 14 && date.getDate() <= 16 && date.getDay() === 3) {
      events.push({ type: 'FOMC', label: 'FOMC Meeting' });
    }

    // High score days
    if (score >= 88) {
      events.push({ type: 'PRIME_OPP', label: 'High Probability Day' });
    }

    return events;
  };

  const generateTopTickers = (score) => {
    const allTickers = ['SPY', 'QQQ', 'TSLA', 'NVDA', 'AAPL', 'AMD', 'MSFT', 'META', 'AMZN', 'IWM'];
    const count = score >= 85 ? 5 : score >= 75 ? 3 : 2;
    return allTickers.slice(0, count).map(ticker => ({
      ticker,
      score: Math.round(score - 5 + Math.random() * 15)
    }));
  };

  const getThirdFriday = (year, month) => {
    const firstDay = new Date(year, month, 1);
    let fridayCount = 0;
    let day = 1;
    
    while (fridayCount < 3) {
      const date = new Date(year, month, day);
      if (date.getDay() === 5) fridayCount++;
      if (fridayCount < 3) day++;
    }
    
    return new Date(year, month, day);
  };

  const getScoreColor = (score, tier) => {
    if (tier === 'PRIME') return 'bg-[#00ff88]';
    if (tier === 'HIGH') return 'bg-[#00e5ff]';
    if (tier === 'MODERATE') return 'bg-[#3fb950]';
    if (tier === 'LOW') return 'bg-[#8b949e]';
    return 'bg-[#f85149]';
  };

  const getScoreOpacity = (score) => {
    return 0.3 + (score / 100) * 0.7;
  };

  return (
    <TerminalCard>
      <SectionHeader action={<StatusBadge variant="active">WEEKLY OUTLOOK</StatusBadge>}>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#00e5ff]" />
          Prophet Heat Calendar
        </div>
      </SectionHeader>

      <div className="flex items-center gap-4 mb-6 text-[10px] font-mono">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-[#00ff88]" />
          <span className="text-[#8b949e]">90+ PRIME</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-[#00e5ff]" />
          <span className="text-[#8b949e]">82+ HIGH</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-[#3fb950]" />
          <span className="text-[#8b949e]">72+ MODERATE</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-[#8b949e]" />
          <span className="text-[#8b949e]">60+ LOW</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
        {calendarData.map((day, i) => (
          <div 
            key={i}
            onClick={() => setSelectedDay(day)}
            className={`
               w-full p-4 rounded-[4px] cursor-pointer transition-all relative overflow-hidden group
               flex items-center justify-between border 
               ${selectedDay?.date.getTime() === day.date.getTime() ? 'border-[#00e5ff] bg-[#1a2332]' : 'border-[#1a2332] bg-[#0d1117] hover:border-[#00e5ff]/50 hover:bg-[#1a2332]/50'}
            `}
          >
            {/* Color Bar Indicator */}
            <div 
              className="absolute left-0 top-0 bottom-0 w-1 transition-all group-hover:w-1.5"
              style={{ backgroundColor: getScoreColor(day.score, day.tier).replace('bg-', '').replace('[', '').replace(']', '') }} 
            />

            {/* Date Info */}
            <div className="pl-4 flex items-center gap-4">
               <div>
                  <div className="text-sm font-bold text-[#c9d1d9] font-mono group-hover:text-white transition-colors">
                     {day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  {day.events.length > 0 && (
                    <div className="flex gap-2 mt-1.5">
                       {day.events.map((e, idx) => (
                          <span key={idx} className="text-[9px] bg-[#1a2332] text-[#8b949e] px-1.5 py-0.5 rounded border border-[#30363d] uppercase tracking-wider">
                             {e.label}
                          </span>
                       ))}
                    </div>
                  )}
               </div>
            </div>

            {/* Score & Tickers */}
            <div className="flex items-center gap-8">
               <div className="hidden md:flex gap-2">
                  {day.topTickers.slice(0, 3).map((t, idx) => (
                     <div key={idx} className="flex items-center gap-1.5">
                       <span className="text-xs font-mono text-[#8b949e]">{t.ticker}</span>
                       <span className={`text-[10px] font-mono ${t.score >= 80 ? 'text-[#00e5ff]' : 'text-[#3fb950]'}`}>{t.score}</span>
                     </div>
                  ))}
               </div>
               <div className="text-right min-w-[60px]">
                  <div className={`text-2xl font-bold font-mono ${
                     day.score >= 90 ? 'text-[#00ff88]' : 
                     day.score >= 82 ? 'text-[#00e5ff]' : 
                     day.score >= 72 ? 'text-[#3fb950]' : 'text-[#8b949e]'
                  }`}>
                     {day.score}
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0d1117;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1a2332;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #30363d;
        }
      `}</style>
      
      {/* Selected Day Details */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="mt-4 overflow-hidden"
          >
            <div className="p-5 bg-[#0a0a0a] border border-[#1a2332] rounded-[4px] relative shadow-2xl">
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedDay(null); }}
                className="absolute top-2 right-2 text-[#8b949e] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-sm ${
                      selectedDay.tier === 'PRIME' ? 'bg-[#00ff88]/10 text-[#00ff88]' : 
                      selectedDay.tier === 'HIGH' ? 'bg-[#00e5ff]/10 text-[#00e5ff]' : 
                      'bg-[#3fb950]/10 text-[#3fb950]'
                    }`}>
                      <Info className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#c9d1d9] font-mono leading-none">
                        {selectedDay.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </h3>
                      <p className="text-xs text-[#8b949e] font-mono mt-1">PROPHET AI ANALYSIS</p>
                    </div>
                  </div>

                  <p className="text-sm text-[#c9d1d9] font-mono leading-relaxed mb-4 border-l-2 border-[#1a2332] pl-4">
                    {selectedDay.analysis}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {selectedDay.events.map((event, i) => (
                      <StatusBadge key={i} variant={event.type === 'PRIME_OPP' ? 'success' : 'active'}>
                        {event.label}
                      </StatusBadge>
                    ))}
                  </div>
                </div>

                <div className="md:w-64 shrink-0 border-t md:border-t-0 md:border-l border-[#1a2332] pt-4 md:pt-0 md:pl-6 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-[#8b949e] uppercase font-bold">Confidence Score</span>
                    <span className={`text-2xl font-bold font-mono ${
                      selectedDay.score >= 80 ? 'text-[#00e5ff]' : 'text-[#3fb950]'
                    }`}>{selectedDay.score}/100</span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[10px] text-[#8b949e] uppercase tracking-wider mb-1">Top Tickers</div>
                    {selectedDay.topTickers.slice(0, 3).map((t, i) => (
                      <div key={i} className="flex justify-between items-center bg-[#0d1117] px-3 py-2 rounded-[2px] border border-[#1a2332]">
                        <span className="font-bold text-sm text-[#c9d1d9]">{t.ticker}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-12 bg-[#1a2332] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#00e5ff]" 
                              style={{ width: `${t.score}%` }} 
                            />
                          </div>
                          <span className="text-xs font-mono text-[#00e5ff]">{t.score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </TerminalCard>
  );
}