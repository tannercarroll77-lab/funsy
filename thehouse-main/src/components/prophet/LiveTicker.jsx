import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function LiveTicker() {
  const signals = [
    { ticker: 'SPY', signal: 'Iron Condor 95', user: 'Dealer #127' },
    { ticker: 'QQQ', signal: 'Bull Put Spread 88', user: 'Dealer #042' },
    { ticker: 'NVDA', signal: 'Short Strangle 92', user: 'Dealer #183' },
    { ticker: 'TSLA', signal: 'Bear Call Spread 78', user: 'Dealer #056' },
    { ticker: 'AAPL', signal: 'Credit Spread 85', user: 'Dealer #199' },
  ];

  return (
    <div className="bg-gradient-to-r from-purple-900/20 via-cyan-900/20 to-purple-900/20 border-y border-cyan-500/30 py-2 overflow-hidden">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="flex gap-8 whitespace-nowrap"
      >
        {[...signals, ...signals].map((sig, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span className="text-cyan-400 font-bold">{sig.ticker}</span>
            <span className="text-gray-400">•</span>
            <span className="text-white">{sig.signal}</span>
            <span className="text-gray-500 text-xs">({sig.user})</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}