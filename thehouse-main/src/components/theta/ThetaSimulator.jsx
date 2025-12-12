import React, { useState, useEffect } from 'react';
import { X, Play, RotateCcw, TrendingUp, Activity, DollarSign } from 'lucide-react';
import { TerminalCard, TerminalInput, TerminalSelect, GhostButton } from '../prophet/BloombergStyles';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { base44 } from '@/api/base44Client';

export default function ThetaSimulator({ ticker, date, onClose }) {
  const [strategy, setStrategy] = useState('short_straddle');
  const [ivCrush, setIvCrush] = useState(20);
  const [underlyingMove, setUnderlyingMove] = useState(0);
  const [pnl, setPnl] = useState(0);
  const [strikes, setStrikes] = useState([]);
  const [selectedStrike, setSelectedStrike] = useState('');
  const [loadingStrikes, setLoadingStrikes] = useState(false);

  useEffect(() => {
    if (ticker) {
      setLoadingStrikes(true);
      // Fetch options chain to get available strikes
      base44.functions.invoke('fetchOptionsChain', { ticker })
        .then(res => {
          // Assuming response structure, robust handling
          const data = res.data.strikes || res.data.results || [];
          const extractedStrikes = Array.isArray(data) 
            ? data.map(d => typeof d === 'object' ? d.strike_price : d)
            : [];
          
          const uniqueStrikes = [...new Set(extractedStrikes)]
            .filter(s => typeof s === 'number' && !isNaN(s))
            .sort((a, b) => a - b);
            
          setStrikes(uniqueStrikes);
          
          if (uniqueStrikes.length > 0) {
            // Default to middle strike (ATMish)
            setSelectedStrike(uniqueStrikes[Math.floor(uniqueStrikes.length / 2)]);
          }
        })
        .catch(err => console.error("Failed to fetch strikes:", err))
        .finally(() => setLoadingStrikes(false));
    }
  }, [ticker]);

  // Simulation logic (simplified for UI demo)
  useEffect(() => {
    // Mock PnL calculation: 
    // Short Vol wins if move is small and IV crush is high
    const moveImpact = Math.abs(underlyingMove) * -50; // Loss as stock moves
    const volImpact = ivCrush * 10; // Profit as IV drops
    setPnl(Math.round(volImpact + moveImpact));
  }, [strategy, ivCrush, underlyingMove]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl bg-[#0a0a0a] border border-[#1a2332] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-[#1a2332] flex justify-between items-center bg-[#0d1117]">
          <div>
            <h2 className="text-xl font-bold text-[#c9d1d9] font-mono flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#00e5ff]" />
              THETA SIMULATOR <span className="text-[#8b949e]">// {ticker}</span>
            </h2>
            <p className="text-xs text-[#8b949e] font-mono">Event Date: {date}</p>
          </div>
          <button onClick={onClose} className="text-[#8b949e] hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Controls */}
          <div className="w-full md:w-1/3 p-6 border-r border-[#1a2332] overflow-y-auto bg-[#0a0a0a]">
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-[#8b949e] mb-2 block uppercase">Strategy</label>
                <TerminalSelect 
                  value={strategy} 
                  onChange={(e) => setStrategy(e.target.value)}
                  className="w-full"
                >
                  <option value="short_straddle">Short Straddle</option>
                  <option value="short_strangle">Short Strangle</option>
                  <option value="iron_condor">Iron Condor</option>
                </TerminalSelect>
              </div>

              <div>
                <label className="text-xs font-bold text-[#8b949e] mb-2 block uppercase flex justify-between">
                  <span>Strike Price</span>
                  {loadingStrikes && <span className="text-[#00e5ff] animate-pulse">SCANNING...</span>}
                </label>
                <TerminalSelect 
                  value={selectedStrike} 
                  onChange={(e) => setSelectedStrike(e.target.value)}
                  className="w-full"
                  disabled={loadingStrikes || strikes.length === 0}
                >
                  {strikes.length === 0 && !loadingStrikes && <option>No strikes available</option>}
                  {strikes.map(s => (
                    <option key={s} value={s}>${s}</option>
                  ))}
                </TerminalSelect>
              </div>

              <div>
                <label className="text-xs font-bold text-[#8b949e] mb-4 block uppercase flex justify-between">
                  <span>Projected IV Crush</span>
                  <span className="text-[#00e5ff]">{ivCrush}%</span>
                </label>
                <Slider 
                  value={[ivCrush]} 
                  max={100} 
                  step={1} 
                  onValueChange={(v) => setIvCrush(v[0])}
                  className="mb-2"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#8b949e] mb-4 block uppercase flex justify-between">
                  <span>Actual Move</span>
                  <span className="text-[#f85149]">{underlyingMove > 0 ? '+' : ''}{underlyingMove}%</span>
                </label>
                <Slider 
                  value={[underlyingMove]} 
                  min={-20}
                  max={20} 
                  step={0.5} 
                  onValueChange={(v) => setUnderlyingMove(v[0])}
                  className="mb-2"
                />
              </div>

              <div className="pt-4 border-t border-[#1a2332]">
                <Button className="w-full bg-[#00e5ff] text-black hover:bg-[#00e5ff]/90 font-bold font-mono">
                  <Play className="w-4 h-4 mr-2" /> RUN SIMULATION
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 p-6 bg-[#050505] flex flex-col items-center justify-center">
            <div className="text-center mb-8">
              <h3 className="text-sm font-bold text-[#8b949e] uppercase tracking-widest mb-2">Estimated P&L</h3>
              <div className={`text-6xl font-bold font-mono tracking-tighter ${pnl >= 0 ? 'text-[#3fb950]' : 'text-[#f85149]'}`}>
                {pnl >= 0 ? '+' : '-'}${Math.abs(pnl)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <TerminalCard className="text-center py-4">
                <div className="text-xs text-[#8b949e] uppercase mb-1">Theta Collected</div>
                <div className="text-xl font-mono text-[#00e5ff]">$240</div>
              </TerminalCard>
              <TerminalCard className="text-center py-4">
                <div className="text-xs text-[#8b949e] uppercase mb-1">Vega Profit</div>
                <div className="text-xl font-mono text-[#3fb950]">+${ivCrush * 5}</div>
              </TerminalCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}