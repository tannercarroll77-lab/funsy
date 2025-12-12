import React from 'react';

// Bloomberg Terminal Design System
export const COLORS = {
  bg: '#000000',
  cardBg: '#0d1117',
  border: '#1a2332',
  accent: '#00e5ff',
  textPrimary: '#c9d1d9',
  textSecondary: '#8b949e',
  success: '#3fb950',
  danger: '#f85149',
};

// Flat Card Component
export function TerminalCard({ children, className = '', noPadding = false, ...props }) {
  return (
    <div
      className={`
        bg-[#0d1117] border border-[#1a2332] rounded-xl shadow-lg
        ${noPadding ? '' : 'p-5'}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

// Section Header
export function SectionHeader({ children, action, className = '' }) {
  return (
    <div className={`flex items-center justify-between border-b border-[#1a2332] pb-2 mb-4 ${className}`}>
      <h3 
        className="text-xs font-bold text-[#8b949e] uppercase tracking-[0.15em]"
        style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" }}
      >
        {children}
      </h3>
      {action}
    </div>
  );
}

// Mono Number Display
export function MonoValue({ value, label, size = 'md', positive, className = '' }) {
  const sizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-3xl',
    xl: 'text-5xl',
  };

  const color = positive === true ? 'text-[#3fb950]' : positive === false ? 'text-[#f85149]' : 'text-[#c9d1d9]';

  return (
    <div className={className}>
      {label && (
        <div className="text-[10px] text-[#8b949e] uppercase tracking-[0.1em] mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
          {label}
        </div>
      )}
      <div 
        className={`font-mono font-semibold tabular-nums ${sizes[size]} ${color}`}
        style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace", fontFeatureSettings: "'tnum'" }}
      >
        {value}
      </div>
    </div>
  );
}

// Ghost Button
export function GhostButton({ children, active, className = '', ...props }) {
  return (
    <button
      className={`
        px-3 py-1.5 text-xs font-medium uppercase tracking-wider
        transition-colors duration-150
        ${active 
          ? 'text-[#00e5ff] border-b-2 border-[#00e5ff]' 
          : 'text-[#8b949e] hover:text-[#c9d1d9] border-b-2 border-transparent hover:border-[#8b949e]'
        }
        ${className}
      `}
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      {...props}
    >
      {children}
    </button>
  );
}

// Status Badge
export function StatusBadge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'text-[#8b949e] border-[#1a2332]',
    active: 'text-[#00e5ff] border-[#00e5ff]/30',
    success: 'text-[#3fb950] border-[#3fb950]/30',
    danger: 'text-[#f85149] border-[#f85149]/30',
  };

  return (
    <span 
      className={`
        inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider
        border rounded-[2px]
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

// Data Row
export function DataRow({ label, value, color, className = '' }) {
  return (
    <div className={`flex justify-between items-center py-1.5 border-b border-[#1a2332]/50 last:border-0 ${className}`}>
      <span className="text-[11px] text-[#8b949e] uppercase tracking-wide" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
        {label}
      </span>
      <span 
        className={`text-[11px] font-mono tabular-nums ${color || 'text-[#c9d1d9]'}`}
        style={{ fontFeatureSettings: "'tnum'" }}
      >
        {value}
      </span>
    </div>
  );
}

// Terminal Input
export function TerminalInput({ className = '', ...props }) {
  return (
    <input
      className={`
        w-full bg-[#000000] border border-[#1a2332] rounded-[2px]
        px-3 py-2 text-sm text-[#c9d1d9] font-mono
        placeholder:text-[#8b949e]/50
        focus:outline-none focus:border-[#00e5ff]/50
        transition-colors duration-150
        ${className}
      `}
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      {...props}
    />
  );
}

// Terminal Select
export function TerminalSelect({ children, className = '', ...props }) {
  return (
    <select
      className={`
        bg-[#000000] border border-[#1a2332] rounded-[2px]
        px-3 py-2 text-xs text-[#c9d1d9] font-mono
        focus:outline-none focus:border-[#00e5ff]/50
        transition-colors duration-150
        ${className}
      `}
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      {...props}
    >
      {children}
    </select>
  );
}

// Top Status Bar
export function StatusBar() {
  const [time, setTime] = React.useState(new Date());
  
  React.useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-6 bg-[#000000] border-b border-[#1a2332] px-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <span className="text-[10px] font-mono text-[#8b949e]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
          PROPHET™ TERMINAL
        </span>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#3fb950]" />
          <span className="text-[10px] font-mono text-[#8b949e]">CONNECTED</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-[10px] font-mono text-[#8b949e]">
          NYSE {time.toLocaleTimeString('en-US', { hour12: false })}
        </span>
        <span className="text-[10px] font-mono text-[#8b949e]">
          {time.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()}
        </span>
      </div>
    </div>
  );
}

// Loading Pulse
export function LoadingPulse({ className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="w-2 h-2 bg-[#8b949e] rounded-full animate-pulse" />
    </div>
  );
}