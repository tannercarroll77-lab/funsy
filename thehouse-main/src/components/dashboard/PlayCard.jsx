import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';

export default function PlayCard({ play, onClick }) {
  const getEdgeColor = (score) => {
    if (score >= 90) return 'text-[#dc2626]';
    if (score >= 85) return 'text-green-500';
    return 'text-blue-500';
  };

  const getStrategyIcon = (type) => {
    switch(type) {
      case 'earnings_play': return '💰';
      case 'short_strangle': return '🎯';
      case 'iron_condor': return '🦅';
      default: return '📈';
    }
  };

  return (
    <Card 
      onClick={onClick}
      className="bg-white/5 border-2 border-gray-800 hover:border-[#dc2626] p-6 cursor-pointer transition-all hover:bg-white/10 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{getStrategyIcon(play.strategy_type)}</div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-[#dc2626] text-white font-mono">
                {play.ticker}
              </Badge>
              <span className="text-xs text-gray-500">
                {play.days_to_expiration}DTE
              </span>
            </div>
            <h3 className="text-lg font-bold group-hover:text-[#dc2626] transition-colors">
              {play.strategy_name}
            </h3>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {play.strategy_type.replace(/_/g, ' ')}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-4xl font-bold ${getEdgeColor(play.edge_score)}`}>
            {play.edge_score}
          </div>
          <div className="text-xs text-gray-500">Edge Score</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
        <div>
          <div className="text-xs text-gray-500 mb-1">Expected Credit</div>
          <div className="text-lg font-bold text-[#dc2626]">
            ${play.expected_credit}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">IV Rank</div>
          <div className="text-lg font-bold">
            {play.iv_rank || play.iv_percentile}
          </div>
        </div>
      </div>

      {play.avg_iv_crush > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-[#dc2626]" />
            <span className="text-gray-400">
              Avg IV Crush: <span className="text-[#dc2626] font-semibold">{play.avg_iv_crush}%</span>
            </span>
          </div>
        </div>
      )}

      {play.notes && (
        <div className="mt-4 p-3 bg-[#dc2626]/10 border border-[#dc2626]/30 rounded-lg">
          <p className="text-xs text-gray-300 italic">"{play.notes.slice(0, 120)}{play.notes.length > 120 ? '...' : ''}"</p>
        </div>
      )}
    </Card>
  );
}