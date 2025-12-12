import React from 'react';

// Edgeful 2025 Design System Constants
export const COLORS = {
  bg: '#0b0e17',
  cardBg: '#11131a',
  cardBgAlpha: 'rgba(17,19,26,0.75)',
  neonCyan: '#00ffea',
  electricPurple: '#8b5cf6',
  textPrimary: '#e2e8f0',
  textSecondary: '#94a3b8',
  border: 'rgba(0,255,234,0.15)',
  borderHover: 'rgba(0,255,234,0.5)',
  glow: '0 0 30px rgba(0,255,234,0.3)',
  glowStrong: '0 0 60px rgba(0,255,234,0.5)',
};

// Glassmorphic Card Component
export function GlassCard({ children, className = '', hover = true, glow = false, ...props }) {
  return (
    <div
      className={`
        relative overflow-hidden
        bg-[#11131a]/75 backdrop-blur-[20px]
        border border-[#00ffea]/10
        rounded-[20px]
        transition-all duration-500 ease-out
        ${hover ? 'hover:border-[#00ffea]/40 hover:shadow-[0_0_40px_rgba(0,255,234,0.15)] hover:scale-[1.01] hover:-translate-y-1' : ''}
        ${glow ? 'shadow-[0_0_30px_rgba(0,255,234,0.2)]' : 'shadow-[0_8px_32px_rgba(0,0,0,0.4)]'}
        ${className}
      `}
      {...props}
    >
      {/* Inner highlight */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00ffea]/5 via-transparent to-[#8b5cf6]/5 pointer-events-none" />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Neon Stat Display
export function NeonStat({ label, value, unit = '', color = 'cyan', size = 'lg' }) {
  const colorClasses = {
    cyan: 'text-[#00ffea]',
    purple: 'text-[#8b5cf6]',
    green: 'text-emerald-400',
    red: 'text-red-400',
    white: 'text-white',
  };

  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-5xl',
    xl: 'text-7xl',
  };

  return (
    <div className="flex flex-col">
      <span className="text-[#94a3b8] text-xs uppercase tracking-[0.2em] mb-2 font-medium">{label}</span>
      <div className="flex items-baseline gap-1">
        <span 
          className={`font-mono font-black ${sizeClasses[size]} ${colorClasses[color]} tracking-tight`}
          style={{ 
            textShadow: color === 'cyan' ? '0 0 20px rgba(0,255,234,0.5), 0 0 40px rgba(0,255,234,0.3)' : 
                        color === 'purple' ? '0 0 20px rgba(139,92,246,0.5)' : 'none'
          }}
        >
          {value}
        </span>
        {unit && <span className="text-[#94a3b8] text-sm font-medium">{unit}</span>}
      </div>
    </div>
  );
}

// Animated Border Card
export function AnimatedBorderCard({ children, className = '', active = false }) {
  return (
    <div className={`relative group ${className}`}>
      {/* Animated gradient border */}
      <div 
        className={`absolute -inset-[1px] rounded-[21px] bg-gradient-to-r from-[#00ffea] via-[#8b5cf6] to-[#00ffea] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${active ? 'opacity-100' : ''}`}
        style={{ 
          backgroundSize: '200% 100%',
          animation: 'borderSweep 3s linear infinite'
        }}
      />
      <div className="relative bg-[#11131a] rounded-[20px] h-full">
        {children}
      </div>
      <style>{`
        @keyframes borderSweep {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </div>
  );
}

// Edgeful Button
export function EdgefulButton({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const variants = {
    primary: 'bg-gradient-to-r from-[#00ffea] to-[#8b5cf6] text-[#0b0e17] font-bold hover:shadow-[0_0_40px_rgba(0,255,234,0.5)] hover:scale-105',
    secondary: 'bg-[#11131a]/80 border border-[#00ffea]/30 text-[#00ffea] hover:border-[#00ffea] hover:shadow-[0_0_30px_rgba(0,255,234,0.3)]',
    ghost: 'bg-transparent text-[#94a3b8] hover:text-[#00ffea] hover:bg-[#00ffea]/10',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-xl',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-10 py-4 text-lg rounded-2xl',
  };

  return (
    <button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        transition-all duration-300 ease-out
        font-semibold tracking-wide
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

// Shimmer Loading
export function CyanShimmer({ className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-[#11131a] rounded-xl ${className}`}>
      <div 
        className="absolute inset-0 -translate-x-full"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,255,234,0.1), rgba(0,255,234,0.2), rgba(0,255,234,0.1), transparent)',
          animation: 'shimmer 2s infinite'
        }}
      />
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

// Data Grid Background
export function DataGridBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[#0b0e17]" />
      
      {/* Animated gradient orbs */}
      <div 
        className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,234,0.15) 0%, transparent 70%)',
          animation: 'float 20s ease-in-out infinite',
        }}
      />
      <div 
        className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
          animation: 'float 25s ease-in-out infinite reverse',
        }}
      />
      
      {/* Grid lines */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,234,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,234,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          animation: 'gridMove 60s linear infinite',
        }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#00ffea]/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `particle ${10 + Math.random() * 20}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(100px, 100px); }
        }
        @keyframes particle {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// Section Title
export function SectionTitle({ children, subtitle, className = '' }) {
  return (
    <div className={`mb-8 ${className}`}>
      <h2 
        className="text-4xl md:text-5xl font-black text-[#e2e8f0] tracking-tight mb-2"
        style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
      >
        {children}
      </h2>
      {subtitle && (
        <p className="text-[#94a3b8] text-lg tracking-wide">{subtitle}</p>
      )}
    </div>
  );
}

// Glowing Badge
export function GlowBadge({ children, color = 'cyan', className = '' }) {
  const colors = {
    cyan: 'bg-[#00ffea]/10 text-[#00ffea] border-[#00ffea]/30 shadow-[0_0_20px_rgba(0,255,234,0.2)]',
    purple: 'bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/30 shadow-[0_0_20px_rgba(139,92,246,0.2)]',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    red: 'bg-red-500/10 text-red-400 border-red-500/30',
  };

  return (
    <span className={`
      inline-flex items-center gap-2 px-4 py-1.5 
      rounded-full border text-sm font-semibold tracking-wide
      ${colors[color]}
      ${className}
    `}>
      {children}
    </span>
  );
}