import React, { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { base44 } from '@/api/base44Client';
import { TerminalCard, LoadingPulse } from '../prophet/BloombergStyles';
import { ChevronLeft, ChevronRight, Calendar, AlertTriangle, TrendingUp, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EarningsCalendar({ onSelect }) {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEarnings();
  }, [currentWeek]);

  const fetchEarnings = async () => {
    setLoading(true);
    setError(null);
    try {
      const startDate = format(currentWeek, 'yyyy-MM-dd');
      const endDate = format(endOfWeek(currentWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      
      const res = await base44.functions.invoke('getEarningsMismatches', { startDate, endDate });
      if (res.data.error) throw new Error(res.data.error);
      setEvents(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load earnings calendar.");
    } finally {
      setLoading(false);
    }
  };

  const navigateWeek = (direction) => {
    setCurrentWeek(prev => direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1));
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-4 shrink-0">
        <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#c9d1d9] font-mono tracking-tight flex items-center gap-2 md:gap-3">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-[#00e5ff]" />
                EARNINGS MISMATCH
            </h2>
            <p className="text-[10px] md:text-xs text-[#8b949e] font-mono mt-1 uppercase tracking-wider">
                Identifying IV Overpricing Events
            </p>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4 bg-[#0d1117] p-1 rounded-lg border border-[#1a2332] w-full md:w-auto justify-between md:justify-start">
            <Button variant="ghost" size="icon" onClick={() => navigateWeek('prev')} className="text-[#8b949e] hover:text-white">
                <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="text-sm font-mono font-bold min-w-[140px] text-center">
                {format(currentWeek, 'MMM d')} - {format(endOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM d, yyyy')}
            </span>
            <Button variant="ghost" size="icon" onClick={() => navigateWeek('next')} className="text-[#8b949e] hover:text-white">
                <ChevronRight className="w-5 h-5" />
            </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
            <div className="h-full flex flex-col items-center justify-center">
                <LoadingPulse />
                <span className="mt-4 text-xs text-[#8b949e] font-mono animate-pulse">SCANNING OPTIONS CHAINS...</span>
            </div>
        ) : error ? (
            <div className="h-full flex items-center justify-center text-[#f85149] font-mono text-sm">
                <AlertTriangle className="w-5 h-5 mr-2" /> {error}
            </div>
        ) : events.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[#8b949e]">
                <BarChart3 className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-mono text-sm">NO HIGH-EDGE EARNINGS FOUND THIS WEEK</p>
                <p className="text-xs mt-2">Try navigating to next week</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto h-full pb-20 custom-scrollbar">
                {events.map((event, i) => (
                    <TerminalCard 
                      key={i} 
                      onClick={() => onSelect && onSelect(event)}
                      className="relative overflow-hidden group hover:border-[#00e5ff] hover:shadow-[0_0_15px_rgba(0,229,255,0.1)] transition-all cursor-pointer active:scale-[0.98]"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded bg-[#1a2332] flex items-center justify-center font-bold text-white border border-[#1a2332] group-hover:border-[#00e5ff] transition-colors">
                                    {event.ticker}
                                </div>
                                <div>
                                    <div className="text-xs text-[#8b949e] font-mono">{event.date}</div>
                                    <div className="text-[10px] text-[#00e5ff] uppercase tracking-wider">{event.earnings_time}</div>
                                </div>
                            </div>
                            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
                                event.edge_score === 'High' ? 'bg-[#3fb950]/10 text-[#3fb950] border-[#3fb950]/30' :
                                event.edge_score === 'Medium' ? 'bg-[#e3b341]/10 text-[#e3b341] border-[#e3b341]/30' :
                                'bg-[#1a2332] text-[#8b949e] border-[#1a2332]'
                            }`}>
                                {event.edge_score} EDGE
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className="bg-[#000]/50 p-2 rounded border border-[#1a2332]">
                                <div className="text-[9px] text-[#8b949e] uppercase mb-1">Implied</div>
                                <div className="text-sm font-mono text-[#00e5ff] font-bold">{event.implied_move_pct.toFixed(1)}%</div>
                            </div>
                            <div className="bg-[#000]/50 p-2 rounded border border-[#1a2332]">
                                <div className="text-[9px] text-[#8b949e] uppercase mb-1">Historical</div>
                                <div className="text-sm font-mono text-[#f85149] font-bold">{event.historical_move_pct.toFixed(1)}%</div>
                            </div>
                            <div className="bg-[#000]/50 p-2 rounded border border-[#1a2332]">
                                <div className="text-[9px] text-[#8b949e] uppercase mb-1">Mismatch</div>
                                <div className="text-sm font-mono text-white font-bold">+{event.mismatch_pct.toFixed(1)}%</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-[#8b949e] font-mono border-t border-[#1a2332] pt-3">
                            <span>Prob. Profit</span>
                            <span className="text-[#3fb950] font-bold">{event.probability}%</span>
                        </div>
                    </TerminalCard>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}