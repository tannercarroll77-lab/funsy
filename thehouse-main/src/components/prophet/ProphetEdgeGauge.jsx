import React from 'react';
import { motion } from 'framer-motion';

export default function ProphetEdgeGauge({ score }) {
  const getColor = () => {
    if (score >= 80) return { from: '#10b981', to: '#00ffff', glow: 'rgba(0,255,255,0.5)' };
    if (score >= 60) return { from: '#00ffff', to: '#a855f7', glow: 'rgba(168,85,247,0.5)' };
    return { from: '#a855f7', to: '#ec4899', glow: 'rgba(236,72,153,0.5)' };
  };

  const color = getColor();
  const circumference = 2 * Math.PI * 120;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 280 280">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color.from} />
            <stop offset="100%" stopColor={color.to} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background circle */}
        <circle
          cx="140"
          cy="140"
          r="120"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="12"
        />

        {/* Animated progress circle */}
        <motion.circle
          cx="140"
          cy="140"
          r="120"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "easeOut" }}
          filter="url(#glow)"
        />

        {/* Pulsing outer ring */}
        <motion.circle
          cx="140"
          cy="140"
          r="130"
          fill="none"
          stroke={color.to}
          strokeWidth="2"
          opacity="0.6"
          animate={{
            r: [130, 135, 130],
            opacity: [0.6, 0.3, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          className="text-6xl font-bold"
          style={{
            background: `linear-gradient(135deg, ${color.from}, ${color.to})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: `drop-shadow(0 0 20px ${color.glow})`
          }}
        >
          {Math.round(score)}
        </motion.div>
        <div className="text-sm text-gray-400 uppercase tracking-wider mt-2">
          Prophet Score™
        </div>
      </div>
    </div>
  );
}