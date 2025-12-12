import React from 'react';
import { TerminalCard, SectionHeader, DataRow, StatusBadge } from './BloombergStyles';
import { BarChart3, TrendingUp, Shield, Target, Activity, Zap, AlertTriangle, Calendar, BarChart2 } from 'lucide-react';

export default function ProphetMetricsBreakdown({ marketData, uoaData }) {
  const spotGammaData = {}; // GEX Removed
  if (!marketData) return null;

  const metrics = [
  {
    category: 'Volatility Metrics',
    icon: TrendingUp,
    items: [
    { label: 'IV Percentile', value: `${marketData.ivPercentile?.toFixed(1)}%`, weight: '20%', score: Math.min(marketData.ivPercentile, 100) },
    { label: 'Current IV', value: `${marketData.iv?.toFixed(1)}%`, weight: '-', score: null },
    { label: 'Realized Vol', value: `${marketData.realizedVol?.toFixed(1)}%`, weight: '-', score: null },
    { label: 'VIX', value: marketData.vix?.toFixed(2), weight: '-', score: null }]

  },

  {
    category: 'Flow & Sentiment',
    icon: Activity,
    items: [
    { label: 'UOA Sentiment', value: uoaData?.sentiment, weight: '5%', score: 100 - Math.abs(uoaData?.sentiment || 0) },
    { label: 'Put/Call Ratio', value: marketData.putCallRatio?.toFixed(2), weight: '5%', score: 100 - Math.abs((marketData.putCallRatio || 1) - 1) * 50 },
    { label: 'Bullish Flow', value: formatFlow(uoaData?.bullishFlow), weight: '-', score: null },
    { label: 'Bearish Flow', value: formatFlow(uoaData?.bearishFlow), weight: '-', score: null },
    { label: 'Unusual Trades', value: uoaData?.unusualTrades, weight: '-', score: null }]

  },
  {
    category: 'Structure & Events',
    icon: Calendar,
    items: [
    { label: 'Term Structure', value: marketData.termStructureSlope > 0 ? 'Contango' : 'Backwardation', weight: '8%', score: marketData.termStructureSlope > 0 ? 80 + marketData.termStructureSlope * 20 : 50 },
    { label: 'Days to Earnings', value: marketData.daysToEarnings, weight: '2%', score: marketData.daysToEarnings > 7 ? 100 : marketData.daysToEarnings * 14 },
    { label: 'OTM Put Skew', value: `${marketData.skew?.otmPutIV?.toFixed(1)}%`, weight: '-', score: null },
    { label: 'OTM Call Skew', value: `${marketData.skew?.otmCallIV?.toFixed(1)}%`, weight: '-', score: null }]

  },
  {
    category: 'Technical Bonus',
    icon: BarChart2,
    items: [
    { label: 'RSI', value: marketData.rsi?.toFixed(1), weight: '+3pts', score: marketData.rsi >= 40 && marketData.rsi <= 60 ? 100 : 0 },
    { label: 'Price in BB', value: marketData.priceInBollingerBands ? 'YES' : 'NO', weight: '+2pts', score: marketData.priceInBollingerBands ? 100 : 0 }]

  }];


  return (
    <div className="h-full flex flex-col bg-[#0d1117] border border-[#1a2332] rounded-[2px] overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1a2332] bg-[#0d1117] shrink-0">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-3 h-3 text-[#00e5ff]" />
          <span className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider">Prophet Algo</span>
        </div>
        <StatusBadge variant="active">12 METRICS</StatusBadge>
      </div>

      <div className="overflow-y-auto flex-1 p-0 custom-scrollbar relative">
        {metrics.map((category, catIndex) => {
          const Icon = category.icon;
          return (
            <div key={catIndex} className="border-b border-[#1a2332] last:border-0">
              <div className="px-3 py-1.5 bg-[#161b22] flex items-center gap-2 sticky top-0 z-10 border-b border-[#1a2332]/50">
                <Icon className="w-3 h-3 text-[#8b949e]" />
                <span className="text-[9px] font-bold text-[#c9d1d9] uppercase tracking-wider">{category.category}</span>
              </div>
              <div className="px-3 py-1">
                {category.items.map((item, itemIndex) =>
                <div key={itemIndex} className="flex items-center justify-between py-1 border-b border-[#1a2332]/30 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[#8b949e] text-sm font-mono tracking-wide">{item.label}</span>
                      {item.weight !== '-' &&
                    <span className="text-[8px] text-[#00e5ff] bg-[#00e5ff]/10 px-1 rounded">{item.weight}</span>
                    }
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold ${item.score >= 80 ? 'text-[#3fb950]' : 'text-[#c9d1d9]'}`}>
                        {item.value}
                      </span>
                      {item.score !== null &&
                    <div className="w-8 h-1 bg-[#1a2332] rounded-full overflow-hidden">
                          <div
                        className={`h-full rounded-full ${
                        item.score >= 80 ? 'bg-[#3fb950]' :
                        item.score >= 50 ? 'bg-[#00e5ff]' : 'bg-[#f85149]'}`
                        }
                        style={{ width: `${item.score}%` }} />

                        </div>
                    }
                    </div>
                  </div>
                )}
              </div>
            </div>);

        })}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0d1117;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1a2332;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #30363d;
        }
      `}</style>
    </div>);

}



function formatFlow(flow) {
  if (!flow) return '-';
  if (flow >= 1e6) return `$${(flow / 1e6).toFixed(1)}M`;
  if (flow >= 1e3) return `$${(flow / 1e3).toFixed(0)}K`;
  return `$${flow}`;
}