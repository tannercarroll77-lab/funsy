import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay, parseISO } from 'date-fns';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Mic, 
  AlertCircle,
  Loader2,
  Briefcase,
  Folder
} from 'lucide-react';

export default function WeeklyEventCalendar() {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 })); // Start on Monday
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = async (startDate) => {
    setLoading(true);
    setError(null);
    try {
      const formattedDate = format(startDate, 'yyyy-MM-dd');
      const response = await base44.functions.invoke('getCalendarEvents', { startDate: formattedDate });
      if (response.data?.events) {
        setEvents(response.data.events);
      } else {
        setEvents([]); // Handle empty or malformed response
      }
    } catch (err) {
      console.error("Failed to fetch events", err);
      setError("Failed to load market events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(currentWeekStart);
  }, [currentWeekStart]);

  const navigateWeek = (direction) => {
    setCurrentWeekStart(prev => direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1));
  };

  const days = [0, 1, 2, 3, 4].map((offset) => addDays(currentWeekStart, offset));

  const getEventsForDay = (day) => {
    return events.filter(event => isSameDay(parseISO(event.date), day));
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'earnings': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'speech': return <Mic className="w-4 h-4 text-purple-400" />;
      case 'economic': return <Folder className="w-4 h-4 text-red-500 fill-red-500/20" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getEventColor = (type, impact) => {
    if (impact === 'High') return 'border-l-red-500 bg-red-950/10 hover:bg-red-900/20';
    if (impact === 'Medium') return 'border-l-orange-500 bg-orange-950/10 hover:bg-orange-900/20';
    
    switch (type) {
      case 'earnings': return 'border-l-green-500 bg-green-950/10 hover:bg-green-900/20';
      case 'speech': return 'border-l-blue-500 bg-blue-950/10 hover:bg-blue-900/20';
      case 'economic': return 'border-l-slate-500 bg-slate-800/30 hover:bg-slate-800/50';
      default: return 'border-l-gray-500 bg-gray-900/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header / Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#0b0e17] p-4 rounded-sm border border-white/10">
        <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white tracking-tight font-mono">
                {format(currentWeekStart, 'MMMM yyyy')}
            </h2>
            <div className="flex gap-1">
                <Button variant="outline" size="icon" onClick={() => navigateWeek('prev')} className="h-8 w-8 border-gray-700 hover:bg-white/5 hover:text-white">
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => navigateWeek('next')} className="h-8 w-8 border-gray-700 hover:bg-white/5 hover:text-white">
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
        
        <div className="flex gap-3 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm border-l-2 border-l-red-500 bg-white/5 text-gray-300">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span>High Impact</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm border-l-2 border-l-orange-500 bg-white/5 text-gray-300">
                <Briefcase className="w-3 h-3 text-orange-500" />
                <span>Medium Impact</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm border-l-2 border-l-green-500 bg-white/5 text-gray-300">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span>Earnings</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm border-l-2 border-l-blue-500 bg-white/5 text-gray-300">
                <Mic className="w-3 h-3 text-blue-500" />
                <span>Speeches</span>
            </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-px bg-gray-800/50 border border-gray-800 rounded-sm overflow-hidden">
        {days.map((day, index) => {
            const isToday = isSameDay(day, new Date());
            const dayEvents = getEventsForDay(day);
            
            return (
                <div 
                    key={index} 
                    className={`flex flex-col h-full bg-[#0b0e17] ${isToday ? 'bg-blue-950/20' : ''}`}
                >
                    {/* Day Header */}
                    <div className={`px-4 py-3 border-b border-gray-800 flex justify-between items-center ${isToday ? 'bg-blue-900/20 border-blue-800' : ''}`}>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {format(day, 'EEE')}
                        </span>
                        <span className={`text-sm font-mono font-bold ${isToday ? 'text-blue-400' : 'text-gray-300'}`}>
                            {format(day, 'MMM d')}
                        </span>
                    </div>

                    {/* Events List */}
                    <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[800px] custom-scrollbar">
                        {loading ? (
                            index === 0 && <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 text-gray-500 animate-spin" /></div>
                        ) : dayEvents.length > 0 ? (
                            dayEvents.map((event, idx) => (
                                <div 
                                    key={idx}
                                    className={`group relative p-3 rounded-sm border-l-2 bg-white/5 hover:bg-white/10 transition-colors ${getEventColor(event.type, event.impact)}`}
                                >
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-[10px] font-mono text-gray-400">
                                            {event.time}
                                        </span>
                                        {/* Impact Dot for quick scanning */}
                                        {event.impact === 'High' && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                                        {event.impact === 'Medium' && <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                                    </div>
                                    
                                    <h4 className="text-xs font-medium text-gray-200 leading-relaxed">
                                        {event.title}
                                    </h4>
                                    
                                    {event.ticker && (
                                        <div className="mt-1.5 inline-block px-1.5 py-0.5 rounded bg-black/40 text-[10px] font-mono text-gray-400 border border-white/5">
                                            {event.ticker}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            !loading && <div className="text-[10px] text-gray-700 text-center py-12">No events scheduled</div>
                        )}
                    </div>
                </div>
            );
        })}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}