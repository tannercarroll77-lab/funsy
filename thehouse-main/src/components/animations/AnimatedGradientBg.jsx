import React from 'react';

export default function AnimatedGradientBg() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Moving gradient mesh */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/30 via-purple-500/20 to-transparent rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-purple-500/30 via-pink-500/20 to-transparent rounded-full blur-3xl animate-float-slower" />
        <div className="absolute bottom-0 left-1/4 w-[550px] h-[550px] bg-gradient-to-tr from-[#dc2626]/30 via-[#7f1d1d]/20 to-transparent rounded-full blur-3xl animate-float-slowest" />
      </div>

      {/* Grain texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  );
}