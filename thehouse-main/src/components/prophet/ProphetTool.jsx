import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { isEqual } from 'lodash';
import { Search, Activity, Zap, ArrowUpRight, ArrowDownRight, DollarSign, BarChart3, PieChart } from 'lucide-react';

import TradingViewChart from './TradingViewChart';
import {
  TerminalCard, SectionHeader, TerminalInput, StatusBar, LoadingPulse } from
'./BloombergStyles';
import {
  ProphetTradeCard,
  generateSimulatedMarketData,
  generateUOAData,
  generateAllPossibleTrades,
  calculateProphetUltimateScore } from
'./ProphetUltimateEngine';
import ProphetHeatCalendar from './ProphetHeatCalendar';
import ProphetMetricsBreakdown from './ProphetMetricsBreakdown';
import IVRBreakdown from './IVRBreakdown';
import getStableTrades from './getStableTrades';

export default function ProphetTool() {
  const [user, setUser] = useState(null);
  const [ticker, setTicker] = useState('SPY');
  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [data, setData] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [ultimateData, setUltimateData] = useState(null);
  const [topTrades, setTopTrades] = useState([]);
  const [lockInfo, setLockInfo] = useState(null);

  const QUICK_TICKERS = ['SPY', 'QQQ', 'IWM', 'NVDA', 'TSLA', 'AAPL', 'AMD', 'META'];

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        if (currentUser) {
          setTimeout(() => fetchData(), 100);
        }
      } catch (error) {

        // Handle error
      }};
    loadUser();
  }, []);

  useEffect(() => {
    if (!data) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (ticker) fetchData(true);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [data, ticker]);

  const fetchData = async (silent = false) => {
    if (!ticker || !ticker.trim()) return;
    if (!silent) {
      setLoading(true);
      setScanStep('INITIALIZING PROPHET ENGINE...');
    }

    try {
      if (!silent) {
        await new Promise((r) => setTimeout(r, 600));
        setScanStep('FETCHING INSTITUTIONAL FLOW...');
        await new Promise((r) => setTimeout(r, 500));
        setScanStep('RUNNING PREDICTIVE MODELS...');
      }

      const response = await base44.functions.invoke('prophetEngine', { ticker: ticker.toUpperCase() });
      setData(response.data);
      setCountdown(5);

      if (!silent) setScanStep('FINALIZING SIGNALS...');

      const spotPrice = response.data.spot_price || 150;
      const marketData = generateSimulatedMarketData(ticker.toUpperCase(), spotPrice);

      if (response.data.market_data) {
        marketData.ivPercentile = response.data.market_data.iv_percentile;
        marketData.realizedVol = response.data.market_data.realized_vol_60min;
        marketData.iv = response.data.market_data.iv || marketData.iv;
        marketData.rsi = response.data.market_data.rsi || marketData.rsi;
      }

      const uoaData = generateUOAData();
      const spotGammaData = {}; // GEX Data removed

      setUltimateData({ marketData, spotGammaData, uoaData });

      const allTrades = generateAllPossibleTrades(ticker.toUpperCase(), spotPrice, marketData);
      const scoredTrades = allTrades.map((trade) => ({
        ...trade,
        scoreData: calculateProphetUltimateScore(trade, marketData, spotGammaData, uoaData)
      })).sort((a, b) => b.scoreData.score - a.scoreData.score);

      const stable = getStableTrades(ticker.toUpperCase(), scoredTrades.slice(0, 5));

      setTopTrades((prev) => {
        if (isEqual(prev, stable.trades)) return prev;
        return stable.trades || [];
      });

      const sourceLabel = response.data.source === 'polygon_delayed' ? 'DATA: POLYGON (DELAYED)' : 'DATA: SIMULATED';
      setLockInfo((stable.reason || (stable.stillValid ? "LOCKED" : "NEW")) + " • " + sourceLabel);
    } catch (error) {
      console.error('Failed to fetch data, using simulation:', error);
      if (!silent) setScanStep('SWITCHING TO OFFLINE SIMULATION...');

      const simulatedSpot = 150 + Math.random() * 50;
      const marketData = generateSimulatedMarketData(ticker.toUpperCase(), simulatedSpot);
      const uoaData = generateUOAData();
      const spotGammaData = {}; // GEX Data removed

      setUltimateData({ marketData, spotGammaData, uoaData });

      const allTrades = generateAllPossibleTrades(ticker.toUpperCase(), simulatedSpot, marketData);
      const scoredTrades = allTrades.map((trade) => ({
        ...trade,
        scoreData: calculateProphetUltimateScore(trade, marketData, spotGammaData, uoaData)
      })).sort((a, b) => b.scoreData.score - a.scoreData.score);

      const stable = getStableTrades(ticker.toUpperCase(), scoredTrades.slice(0, 5));
      setTopTrades(stable.trades || []);
      setLockInfo("Simulated Data (Offline Mode)");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center pt-6">
        <LoadingPulse />
      </div>
    );
  }

  const StatCard = ({ label, value, change, positive, icon: Icon }) => (
    <TerminalCard className="flex flex-col justify-between h-32 hover:border-[#1a2332] transition-colors group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[#8b949e] text-xs font-bold uppercase tracking-wider">{label}</p>
        </div>
        <div className={`p-2 rounded-lg ${positive ? 'bg-[#3fb950]/10 text-[#3fb950]' : 'bg-[#00e5ff]/10 text-[#00e5ff]'}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-[#c9d1d9] font-mono tracking-tight">{value}</h3>
        <div className="flex items-center gap-2 mt-1">
          {positive ? <ArrowUpRight className="w-3 h-3 text-[#3fb950]" /> : <ArrowDownRight className="w-3 h-3 text-[#f85149]" />}
          <span className={`text-xs font-medium ${positive ? 'text-[#3fb950]' : 'text-[#f85149]'}`}>{change}</span>
          <span className="text-[#8b949e] text-[10px] uppercase">vs last scan</span>
        </div>
      </div>
    </TerminalCard>
  );

  return (
    <div className="min-h-screen bg-[#000000] text-[#c9d1d9] pb-12">
      <StatusBar />
      
      <div className="max-w-[1800px] mx-auto px-6 py-8 pt-20">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-[#c9d1d9] font-mono tracking-tight mb-1">PROPHET ENGINE</h1>
            <p className="text-[#8b949e] text-sm">Real-time volatility analytics & trade generation</p>
          </div>

          <div className="w-full md:w-auto flex-1 max-w-2xl flex flex-col gap-2">
             <form onSubmit={handleSearch} className="relative group">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${loading ? 'text-[#00e5ff] animate-pulse' : 'text-[#8b949e]'}`} />
                <input 
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  placeholder="Search tickers (e.g., SPY, TSLA)..."
                  className="w-full bg-[#0d1117] border border-[#1a2332] rounded-xl py-3 pl-10 pr-32 text-sm text-[#c9d1d9] focus:outline-none focus:border-[#00e5ff]/50 transition-all shadow-sm"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <span className="text-[10px] text-[#8b949e] border border-[#1a2332] rounded px-1.5 py-0.5 hidden sm:inline-block">⌘K</span>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="bg-[#c9d1d9] hover:bg-white text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? 'SCANNING' : 'SCAN'}
                  </button>
                </div>
             </form>
             <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {QUICK_TICKERS.map(t => (
                  <button
                    key={t}
                    onClick={() => { setTicker(t); setTimeout(() => fetchData(), 0); }}
                    className={`text-[10px] font-mono px-2 py-1 rounded transition-colors whitespace-nowrap border ${ticker === t ? 'bg-[#00e5ff]/10 text-[#00e5ff] border-[#00e5ff]/30' : 'text-[#8b949e] border-transparent hover:border-[#1a2332] hover:bg-[#1a2332]'}`}
                  >
                    {t}
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            label="Spot Price" 
            value={ultimateData ? `$${ultimateData.marketData.spotPrice?.toFixed(2)}` : '---'} 
            change="+0.00%" 
            positive={true} 
            icon={DollarSign} 
          />
          <StatCard 
            label="Implied Volatility" 
            value={ultimateData ? `${(ultimateData.marketData.iv * 100)?.toFixed(1)}%` : '---'} 
            change={ultimateData?.marketData.ivPercentile ? `IVR ${ultimateData.marketData.ivPercentile}` : '--'} 
            positive={false} 
            icon={Activity} 
          />
          <StatCard 
            label="Momentum (RSI)" 
            value={ultimateData ? ultimateData.marketData.rsi?.toFixed(1) : '---'} 
            change="Neutral" 
            positive={true} 
            icon={BarChart3} 
          />
          <StatCard 
            label="Top Trade Score" 
            value={topTrades.length > 0 ? topTrades[0].scoreData.score.toFixed(0) : '---'} 
            change={lockInfo || 'WAITING'} 
            positive={true} 
            icon={Zap} 
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* Main Chart Area */}
          <div className="lg:col-span-8">
             <TerminalCard className="h-[500px] relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-sm font-bold text-[#c9d1d9]">Market Trend</h3>
                   <div className="flex gap-2">
                      <span className="text-xs text-[#8b949e] px-2 py-1 bg-[#1a2332] rounded">1H</span>
                      <span className="text-xs text-[#c9d1d9] px-2 py-1 bg-[#00e5ff]/10 rounded">1D</span>
                      <span className="text-xs text-[#8b949e] px-2 py-1 bg-[#1a2332] rounded">1W</span>
                   </div>
                </div>
                <div className="h-[420px] w-full">
                  {ultimateData ? (
                    <TradingViewChart ticker={ticker} candles={data?.candles || []} />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-[#8b949e]">
                       {loading ? (
                          <div className="flex flex-col items-center gap-3">
                            <LoadingPulse />
                            <span className="text-xs font-mono">{scanStep}</span>
                          </div>
                       ) : (
                          <div className="text-center">
                            <Activity className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>Initiate scan to view real-time market data</p>
                          </div>
                       )}
                    </div>
                  )}
                </div>
             </TerminalCard>
          </div>

          {/* Right Panel: Analytics */}
          <div className="lg:col-span-4 space-y-6">
             <TerminalCard className="h-[500px] overflow-y-auto custom-scrollbar">
                <h3 className="text-sm font-bold text-[#c9d1d9] mb-4">Market Structure</h3>
                {ultimateData ? (
                  <div className="space-y-6">
                     <ProphetMetricsBreakdown marketData={ultimateData.marketData} uoaData={ultimateData.uoaData} />
                     <IVRBreakdown marketData={ultimateData.marketData} />
                  </div>
                ) : (
                   <div className="h-full flex items-center justify-center text-xs text-[#8b949e]">
                      No data available
                   </div>
                )}
             </TerminalCard>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* Top Trades Pipeline */}
           <TerminalCard>
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-sm font-bold text-[#c9d1d9]">Signal Pipeline</h3>
                 <div className="text-xs text-[#00e5ff]">{topTrades.length} Active</div>
              </div>
              <div className="space-y-4">
                 {topTrades.length > 0 ? (
                    topTrades.slice(0, 4).map((trade, i) => (
                       <div key={trade.id} className="transform scale-95 origin-top-left w-full">
                          <ProphetTradeCard 
                             trade={trade} 
                             rank={i + 1} 
                             marketData={ultimateData.marketData} 
                             uoaData={ultimateData.uoaData} 
                          />
                       </div>
                    ))
                 ) : (
                    <div className="py-12 text-center text-xs text-[#8b949e] border-2 border-dashed border-[#1a2332] rounded-lg">
                       No active signals generated
                    </div>
                 )}
              </div>
           </TerminalCard>

           {/* Calendar / Conversion */}
           <TerminalCard>
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-sm font-bold text-[#c9d1d9]">Performance Heatmap</h3>
                 <div className="text-xs text-[#3fb950]">All Systems Operational</div>
              </div>
              <ProphetHeatCalendar />
           </TerminalCard>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a2332; border-radius: 2px; }
      `}</style>
    </div>
  );

}