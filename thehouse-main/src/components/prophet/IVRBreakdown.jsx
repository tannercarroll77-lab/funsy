import React from 'react';
import { TerminalCard, SectionHeader, StatusBadge, DataRow } from './BloombergStyles';
import { Activity, TrendingUp, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function IVRBreakdown({ marketData }) {
  if (!marketData) return null;

  // Calculate derived metrics
  const iv = marketData.iv || 0;
  const ivRank = marketData.ivRank || marketData.ivPercentile || 0; // Fallback to percentile if rank missing
  const ivPercentile = marketData.ivPercentile || 0;
  const hv = marketData.realizedVol || 0;
  const volPremium = iv - hv;
  
  // Determine actionable signal
  let action = 'NEUTRAL';
  let actionColor = 'text-[#8b949e]';
  let badgeVariant = 'default';

  if (ivRank > 50) {
    if (volPremium > 5) {
      action = 'SELL PREMIUM';
      actionColor = 'text-[#f85149]'; // Red for shorting/selling
      badgeVariant = 'danger';
    } else {
      action = 'RNG BOUND';
      actionColor = 'text-[#c9d1d9]';
    }
  } else if (ivRank < 20) {
    if (volPremium < -2) {
      action = 'BUY PREMIUM';
      actionColor = 'text-[#3fb950]'; // Green for buying
      badgeVariant = 'success';
    } else {
      action = 'LONG VEGA';
      actionColor = 'text-[#3fb950]';
      badgeVariant = 'success';
    }
  }

  // IV Regime
  const regime = ivRank > 75 ? 'EXTREME HIGH' : 
                 ivRank > 50 ? 'ELEVATED' : 
                 ivRank > 25 ? 'NORMAL' : 'LOW VOL';

  const regimeColor = ivRank > 50 ? 'text-[#f85149]' : 
                      ivRank < 25 ? 'text-[#3fb950]' : 'text-[#00e5ff]';

  return (
    <div className="h-full flex flex-col bg-[#0d1117] border border-[#1a2332] rounded-[2px] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1a2332] bg-[#0d1117] shrink-0">
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3 text-[#a855f7]" />
          <span className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider">Volatility Engine</span>
        </div>
        <StatusBadge variant={badgeVariant}>{action}</StatusBadge>
      </div>

      <div className="flex-1 p-3 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
        {/* Primary Metric: IV Rank */}
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[10px] text-[#8b949e] uppercase tracking-wider mb-1">IV Rank</div>
            <div className={`text-3xl font-bold font-mono ${regimeColor}`}>
              {ivRank.toFixed(0)}
            </div>
          </div>
          <div className="text-right mb-1">
            <div className="text-[10px] text-[#8b949e] uppercase tracking-wider">Regime</div>
            <div className={`text-xs font-mono font-bold ${regimeColor}`}>{regime}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-[#1a2332] rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${
              ivRank > 50 ? 'bg-[#f85149]' : 'bg-[#3fb950]'
            }`}
            style={{ width: `${ivRank}%` }}
          />
        </div>

        {/* Detailed Metrics */}
        <div className="space-y-2">
          <div className="flex justify-between items-center py-1 border-b border-[#1a2332]/30">
            <span className="text-[10px] text-[#8b949e] font-mono">IV Percentile</span>
            <span className="text-[11px] font-mono text-[#c9d1d9]">{ivPercentile.toFixed(1)}%</span>
          </div>
          
          <div className="flex justify-between items-center py-1 border-b border-[#1a2332]/30">
            <span className="text-[10px] text-[#8b949e] font-mono">Implied Vol (IV)</span>
            <span className="text-[11px] font-mono text-[#a855f7]">{iv.toFixed(1)}%</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-[#1a2332]/30">
            <span className="text-[10px] text-[#8b949e] font-mono">Realized Vol (HV)</span>
            <span className="text-[11px] font-mono text-[#c9d1d9]">{hv.toFixed(1)}%</span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-[10px] text-[#8b949e] font-mono">Vol Risk Premium</span>
            <div className="flex items-center gap-1">
              {volPremium > 0 ? (
                <ArrowUpRight className="w-3 h-3 text-[#3fb950]" />
              ) : (
                <ArrowDownRight className="w-3 h-3 text-[#f85149]" />
              )}
              <span className={`text-[11px] font-mono font-bold ${volPremium > 0 ? 'text-[#3fb950]' : 'text-[#f85149]'}`}>
                {Math.abs(volPremium).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Action Box */}
        <div className={`mt-auto border border-dashed ${
          ivRank > 50 ? 'border-[#f85149]/30 bg-[#f85149]/5' : 'border-[#3fb950]/30 bg-[#3fb950]/5'
        } rounded p-2`}>
          <div className="flex items-start gap-2">
            <AlertCircle className={`w-3 h-3 mt-0.5 ${
              ivRank > 50 ? 'text-[#f85149]' : 'text-[#3fb950]'
            }`} />
            <div>
              <div className={`text-[10px] font-bold uppercase ${
                ivRank > 50 ? 'text-[#f85149]' : 'text-[#3fb950]'
              }`}>
                {ivRank > 50 ? 'Short Volatility' : 'Long Volatility'}
              </div>
              <div className="text-[9px] text-[#8b949e] leading-tight mt-1">
                {ivRank > 50 
                  ? "Premium is expensive relative to recent history. Consider credit spreads & iron condors." 
                  : "Premium is cheap. Consider debit spreads or buying optionality."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}