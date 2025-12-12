import { useEffect, useCallback, useState } from 'react';

// Command palette keyboard shortcuts system
const shortcuts = [
  { key: 'k', meta: true, action: 'openCommandPalette', description: 'Open command palette' },
  { key: 's', meta: true, action: 'search', description: 'Search tickers' },
  { key: 'd', meta: true, action: 'dashboard', description: 'Go to Dashboard' },
  { key: 'p', meta: true, action: 'prophet', description: 'Go to Prophet' },
  { key: 'a', meta: true, action: 'account', description: 'Go to Account' },
  { key: 'h', meta: true, action: 'home', description: 'Go to Home' },
  { key: 'r', meta: true, action: 'refresh', description: 'Refresh data' },
  { key: 'n', meta: true, action: 'newScan', description: 'New scan' },
  { key: 'e', meta: true, action: 'export', description: 'Export data' },
  { key: '/', meta: false, action: 'focusSearch', description: 'Focus search' },
  { key: 'Escape', meta: false, action: 'close', description: 'Close modal/palette' },
  { key: '1', meta: true, action: 'tab1', description: 'First tab' },
  { key: '2', meta: true, action: 'tab2', description: 'Second tab' },
  { key: '3', meta: true, action: 'tab3', description: 'Third tab' },
  { key: '?', meta: true, shift: true, action: 'showShortcuts', description: 'Show shortcuts' }
];

export function useKeyboardShortcuts(handlers = {}) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const handleKeyDown = useCallback((event) => {
    const isMeta = event.metaKey || event.ctrlKey;
    const isShift = event.shiftKey;

    for (const shortcut of shortcuts) {
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const metaMatch = shortcut.meta ? isMeta : !isMeta;
      const shiftMatch = shortcut.shift ? isShift : true;

      if (keyMatch && metaMatch && shiftMatch) {
        // Don't trigger if typing in input
        if (['INPUT', 'TEXTAREA'].includes(event.target.tagName) && shortcut.key !== 'Escape') {
          continue;
        }

        event.preventDefault();

        if (shortcut.action === 'openCommandPalette') {
          setCommandPaletteOpen(prev => !prev);
          return;
        }

        if (handlers[shortcut.action]) {
          handlers[shortcut.action]();
        }
        return;
      }
    }
  }, [handlers]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    shortcuts,
    commandPaletteOpen,
    setCommandPaletteOpen
  };
}

export function getShortcutLabel(action) {
  const shortcut = shortcuts.find(s => s.action === action);
  if (!shortcut) return null;

  const isMac = typeof navigator !== 'undefined' && navigator.platform.includes('Mac');
  const metaKey = isMac ? '⌘' : 'Ctrl';

  let label = '';
  if (shortcut.meta) label += metaKey + '+';
  if (shortcut.shift) label += '⇧+';
  label += shortcut.key.toUpperCase();

  return label;
}

export default useKeyboardShortcuts;