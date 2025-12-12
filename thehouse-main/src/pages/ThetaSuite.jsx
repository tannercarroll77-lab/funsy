import React, { useState } from 'react';
import EarningsCalendar from '../components/theta/EarningsCalendar';
import ThetaSimulator from '../components/theta/ThetaSimulator';
import ThetaSimulationTab from '../components/theta/ThetaSimulationTab';
import { Calendar, Activity } from 'lucide-react';

export default function ThetaSuite() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const openSimulator = (event) => {
    setSelectedEvent(event);
    setSimulatorOpen(true);
  };

  return (
    <div className="h-screen bg-[#000000] text-[#c9d1d9] flex flex-col pt-20 md:pt-24">
      
      {/* Tab Navigation */}
        <div className="px-6 border-b border-[#1a2332] flex gap-4 bg-[#000000]">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-mono font-bold border-b-2 transition-colors ${
              activeTab === 'calendar' 
                ? 'text-[#00e5ff] border-[#00e5ff]' 
                : 'text-[#8b949e] border-transparent hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            EARNINGS MISMATCH
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-mono font-bold border-b-2 transition-colors ${
              activeTab === 'simulator' 
                ? 'text-[#00e5ff] border-[#00e5ff]' 
                : 'text-[#8b949e] border-transparent hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            THETA SIMULATOR
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="flex-1 bg-[#050505] relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="relative z-10 h-full flex flex-col">
              {activeTab === 'calendar' ? (
                <EarningsCalendar onSelect={openSimulator} />
              ) : (
                <ThetaSimulationTab />
              )}
            </div>
          </div>
        </div>

        {/* Simulator Modal (Only for Calendar) */}
        {simulatorOpen && selectedEvent && (
          <ThetaSimulator 
            ticker={selectedEvent.ticker} 
            date={selectedEvent.date} 
            onClose={() => setSimulatorOpen(false)} 
          />
        )}

      </div>
  );
}