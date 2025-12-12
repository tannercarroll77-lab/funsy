import React, { useState, useEffect } from 'react';
import { TerminalCard, SectionHeader, StatusBadge, DataRow } from './BloombergStyles';
import { Trophy, TrendingUp, Zap, RefreshCw } from 'lucide-react';
import { generateSimulatedMarketData, generateSpotGammaData, generateUOAData, generateAllPossibleTrades, calculateProphetUltimateScore } from './ProphetUltimateEngine';

const POPULAR_TICKERS = [
  // Indices & ETFs
  'SPY', 'QQQ', 'IWM', 'GLD', 'TLT', 'XLF', 'SMH', 'ARKK',
  // Mag 7 + Big Tech
  'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'TSLA', 'NVDA', 'AMD', 'NFLX', 'ADBE', 'CRM', 'INTC', 'CSCO', 'ORCL',
  // Semis
  'AVGO', 'QCOM', 'TXN', 'MU', 'LRCX', 'AMAT', 'ADI', 'KLAC', 'MRVL', 'ARM', 'TSM',
  // High Growth / Volatile
  'PLTR', 'COIN', 'MSTR', 'HOOD', 'DKNG', 'ROKU', 'SQ', 'SHOP', 'U', 'ZM', 'NET', 'CRWD', 'PANW', 'ZS', 'DDOG', 'SNOW', 'PLUG',
  // Consumer / Bio / Other Liquid
  'COST', 'PEP', 'SBUX', 'TMUS', 'CMCSA', 'AMGN', 'GILD', 'VRTX', 'REGN', 'MRNA', 'PFE', 'XOM', 'CVX', 'BAC', 'JPM', 'C', 'WFC'
];

export default function ProphetLeaderboard({ onSelectTrade }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const generateLeaderboard = () => {
    setLoading(true);
    
    const allScoredTrades = [];

    POPULAR_TICKERS.forEach(ticker => {
      const spotPrice = getSimulatedSpotPrice(ticker);
      const marketData = generateSimulatedMarketData(ticker, spotPrice);
      const spotGammaData = generateSpotGammaData(spotPrice);
      const uoaData = generateUOAData();

      const trades = generateAllPossibleTrades(ticker, spotPrice, marketData);
      
      // Score each trade and keep top 3 per ticker
      const scoredTrades = trades.map(trade => ({
        ...trade,
        marketData,
        spotGammaData,
        uoaData,
        scoreData: calculateProphetUltimateScore(trade, marketData, spotGammaData, uoaData)
      })).sort((a, b) => b.scoreData.score - a.scoreData.score).slice(0, 3);

      allScoredTrades.push(...scoredTrades);
    });

    // Sort all trades by score and take top 10
    const top10 = allScoredTrades
      .sort((a, b) => b.scoreData.score - a.scoreData.score)
      .slice(0, 10);

    setLeaderboard(top10);
    setLastUpdate(new Date());
    setLoading(false);
  };

  useEffect(() => {
    generateLeaderboard();
    const interval = setInterval(generateLeaderboard, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const tierStyles = {
    GOD_TIER: 'text-[#00ff88]',
    HIGH_EDGE: 'text-[#00e5ff]',
    STRONG: 'text-[#3fb950]',
    MODERATE: 'text-[#8b949e]',
    WEAK: 'text-[#f85149]'
  };

  return (
    <TerminalCard>
      <SectionHeader 
        action={
          <div className="flex items-center gap-3">
            {lastUpdate && (
              <span className="text-[10px] text-[#8b949e] font-mono">
                Updated {lastUpdate.toLocaleTimeString()}
              </span>
            )}
            <button 
              onClick={generateLeaderboard}
              className="text-[#8b949e] hover:text-[#00e5ff] transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        }
      >
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#00e5ff]" />
          Top 10 Prophet Scores — Live
        </div>
      </SectionHeader>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-[#8b949e]">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span className="text-xs font-mono uppercase">Scanning all tickers...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((trade, i) => (
            <div 
              key={trade.id}
              onClick={() => onSelectTrade?.(trade)}
              className={`
                flex items-center justify-between p-3 rounded-[2px] cursor-pointer
                transition-all hover:bg-[#1a2332]/50
                ${i === 0 ? 'bg-gradient-to-r from-[#00ff88]/10 to-transparent border border-[#00ff88]/30' : 
                  i < 3 ? 'bg-gradient-to-r from-[#00e5ff]/5 to-transparent border border-[#1a2332]' : 
                  'border border-[#1a2332]'}
              `}
            >
              <div className="flex items-center gap-4">
                <div className={`text-xl font-bold font-mono ${i === 0 ? 'text-[#00ff88]' : i < 3 ? 'text-[#00e5ff]' : 'text-[#8b949e]'}`}>
                  #{i + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#c9d1d9] font-mono">{trade.ticker}</span>
                    <span className="text-xs text-[#8b949e]">{trade.name}</span>
                    <StatusBadge variant={trade.scoreData.tier === 'GOD_TIER' ? 'success' : 'active'}>
                      {trade.dte} DTE
                    </StatusBadge>
                  </div>
                  <div className="text-[10px] text-[#8b949e] font-mono mt-0.5">
                    {trade.legs.map(l => `${l.action[0]} ${l.strike}${l.type[0]}`).join(' / ')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xs text-[#8b949e]">Credit</div>
                  <div className="text-sm font-bold text-[#3fb950] font-mono">${trade.credit.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#8b949e]">POP</div>
                  <div className="text-sm font-bold text-[#c9d1d9] font-mono">{trade.pop.toFixed(0)}%</div>
                </div>
                <div className="text-right min-w-[60px]">
                  <div className={`text-2xl font-bold font-mono ${tierStyles[trade.scoreData.tier]}`}
                       style={{ textShadow: trade.scoreData.tier === 'GOD_TIER' ? '0 0 10px #00ff88' : 'none' }}>
                    {trade.scoreData.score}
                  </div>
                  <div className={`text-[9px] uppercase tracking-wider ${tierStyles[trade.scoreData.tier]}`}>
                    {trade.scoreData.tier.replace('_', ' ')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </TerminalCard>
  );
}

function getSimulatedSpotPrice(ticker) {
  // Base prices (approximate) + random noise
  const prices = {
    SPY: 595, QQQ: 515, IWM: 235, GLD: 245, TLT: 88, XLF: 48, SMH: 248, ARKK: 45,
    AAPL: 228, MSFT: 425, AMZN: 205, GOOGL: 175, META: 575, TSLA: 345, NVDA: 142, AMD: 138, 
    NFLX: 650, ADBE: 550, CRM: 260, INTC: 24, CSCO: 50, ORCL: 140,
    AVGO: 170, QCOM: 170, TXN: 200, MU: 110, LRCX: 800, AMAT: 210, ADI: 230, KLAC: 750, MRVL: 70, ARM: 140, TSM: 170,
    PLTR: 25, COIN: 220, MSTR: 1600, HOOD: 20, DKNG: 35, ROKU: 60, SQ: 65, SHOP: 65, U: 20, ZM: 60, NET: 80, 
    CRWD: 260, PANW: 340, ZS: 180, DDOG: 110, SNOW: 130, PLUG: 2,
    COST: 880, PEP: 170, SBUX: 95, TMUS: 190, CMCSA: 40, AMGN: 330, GILD: 70, VRTX: 480, REGN: 1000, 
    MRNA: 120, PFE: 28, XOM: 115, CVX: 150, BAC: 40, JPM: 210, C: 60, WFC: 55
  };
  
  const base = prices[ticker] || 100;
  // Add +/- 2% noise
  return base * (0.98 + Math.random() * 0.04);
}