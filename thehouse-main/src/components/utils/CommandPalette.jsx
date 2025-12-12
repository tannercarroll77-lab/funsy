import React, { useState, useEffect, useRef } from 'react';
import { createPageUrl } from '../../utils';
import { 
  Search, Home, BarChart3, Zap, User, Settings, Download, 
  RefreshCw, Plus, HelpCircle, Keyboard, X, ChevronRight
} from 'lucide-react';

const commands = [
  { id: 'home', label: 'Go to Home', icon: Home, action: 'navigate', path: 'Home', shortcut: '⌘H' },
  { id: 'dashboard', label: 'Go to Dashboard', icon: BarChart3, action: 'navigate', path: 'Dashboard', shortcut: '⌘D' },
  { id: 'prophet', label: 'Go to Prophet', icon: Zap, action: 'navigate', path: 'ProphetDashboard', shortcut: '⌘P' },
  { id: 'account', label: 'Go to Account', icon: User, action: 'navigate', path: 'Account', shortcut: '⌘A' },
  { id: 'divider1', type: 'divider' },
  { id: 'search', label: 'Search ticker...', icon: Search, action: 'search', shortcut: '/' },
  { id: 'newScan', label: 'New market scan', icon: Plus, action: 'scan', shortcut: '⌘N' },
  { id: 'refresh', label: 'Refresh data', icon: RefreshCw, action: 'refresh', shortcut: '⌘R' },
  { id: 'export', label: 'Export data', icon: Download, action: 'export', shortcut: '⌘E' },
  { id: 'divider2', type: 'divider' },
  { id: 'shortcuts', label: 'Keyboard shortcuts', icon: Keyboard, action: 'shortcuts', shortcut: '⌘⇧?' },
  { id: 'help', label: 'Help & support', icon: HelpCircle, action: 'help' },
  { id: 'settings', label: 'Settings', icon: Settings, action: 'settings' }
];

export default function CommandPalette({ isOpen, onClose, onAction }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const filteredCommands = commands.filter(cmd => {
    if (cmd.type === 'divider') return true;
    return cmd.label.toLowerCase().includes(query.toLowerCase());
  });

  const selectableCommands = filteredCommands.filter(cmd => cmd.type !== 'divider');

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, selectableCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = selectableCommands[selectedIndex];
        if (cmd) executeCommand(cmd);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, selectableCommands]);

  const executeCommand = (cmd) => {
    if (cmd.action === 'navigate') {
      window.location.href = createPageUrl(cmd.path);
    } else if (onAction) {
      onAction(cmd.action, cmd);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Palette */}
      <div className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm"
          />
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Commands list */}
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {filteredCommands.map((cmd, index) => {
            if (cmd.type === 'divider') {
              return <div key={cmd.id} className="h-px bg-white/5 my-2 mx-4" />;
            }

            const selectableIndex = selectableCommands.findIndex(c => c.id === cmd.id);
            const isSelected = selectableIndex === selectedIndex;
            const Icon = cmd.icon;

            return (
              <button
                key={cmd.id}
                onClick={() => executeCommand(cmd)}
                onMouseEnter={() => setSelectedIndex(selectableIndex)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${
                  isSelected ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-[#dc2626]' : 'bg-white/5'}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="flex-1 text-left text-sm text-white">{cmd.label}</span>
                {cmd.shortcut && (
                  <span className="text-xs text-gray-500 font-mono">{cmd.shortcut}</span>
                )}
                <ChevronRight className={`w-4 h-4 transition-opacity ${isSelected ? 'opacity-100 text-gray-400' : 'opacity-0'}`} />
              </button>
            );
          })}

          {selectableCommands.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">
              No commands found for "{query}"
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-white/5 flex items-center justify-between text-xs text-gray-600">
          <span>↑↓ to navigate</span>
          <span>↵ to select</span>
          <span>esc to close</span>
        </div>
      </div>
    </div>
  );
}