import React, { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, BarChart3, User, Settings, Zap, Command } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function CommandBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const commands = [
    { icon: Search, label: 'Search NVDA Options', shortcut: 'S', action: 'search' },
    { icon: TrendingUp, label: 'View Top Edge Plays', shortcut: 'E', action: 'edge' },
    { icon: BarChart3, label: 'Open Scanner', shortcut: 'C', action: 'scanner' },
    { icon: User, label: 'Account Settings', shortcut: 'A', action: 'account' },
    { icon: Zap, label: 'Recent Briefings', shortcut: 'B', action: 'briefings' },
    { icon: Settings, label: 'Preferences', shortcut: 'P', action: 'settings' },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
      
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        }
        if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
          e.preventDefault();
          console.log('Execute:', filteredCommands[selectedIndex].action);
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-start justify-center pt-32 animate-in fade-in duration-200">
      <Card className="w-full max-w-2xl bg-[#0b0e17]/95 backdrop-blur-2xl border-2 border-[#dc2626]/30 shadow-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#dc2626]/20 to-[#7f1d1d]/20 flex items-center justify-center">
              <Command className="w-5 h-5 text-[#dc2626]" />
            </div>
            <Input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type a command or search..."
              className="bg-transparent border-none text-white text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <kbd className="px-2 py-1 text-xs bg-white/5 border border-white/10 rounded">ESC</kbd>
          </div>

          <div className="space-y-1 max-h-96 overflow-y-auto">
            {filteredCommands.map((cmd, index) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={index}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                    selectedIndex === index
                      ? 'bg-[#dc2626]/20 border border-[#dc2626]/50 shadow-lg'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                  onClick={() => {
                    console.log('Execute:', cmd.action);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-[#dc2626]" />
                    <span className="text-white font-medium">{cmd.label}</span>
                  </div>
                  <kbd className="px-2 py-1 text-xs bg-white/5 border border-white/10 rounded">
                    {cmd.shortcut}
                  </kbd>
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">↵</kbd>
                Select
              </span>
            </div>
            <span className="flex items-center gap-1">
              <Command className="w-3 h-3" />K to open
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}