import React from 'react';
import WeeklyEventCalendar from '../components/prophet/WeeklyEventCalendar';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function ProphetCalendar() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-6 pt-28">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-[#00e5ff]/10 rounded-sm border border-[#00e5ff]/20">
            <CalendarIcon className="w-6 h-6 text-[#00e5ff]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Prophet Calendar</h1>
            <p className="text-gray-400 text-sm">Volatility forecasting and event risk analysis</p>
          </div>
        </div>
        
        <WeeklyEventCalendar />
      </div>
    </div>
  );
}