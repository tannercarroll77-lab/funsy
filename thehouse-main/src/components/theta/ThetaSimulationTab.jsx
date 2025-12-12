import React, { useState, useEffect } from 'react';
import { Play, Plus, Trash2, TrendingUp, Activity, ChevronDown, Search } from 'lucide-react';
import { TerminalCard, TerminalInput, TerminalSelect, GhostButton } from '../prophet/BloombergStyles';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STRATEGIES = [
  { value: 'long_call', label: 'Long Call', legs: [{ type: 'call', quantity: 1, strike: 'atm', iv: 0.2 }] },
  { value: 'long_put', label: 'Long Put', legs: [{ type: 'put', quantity: 1, strike: 'atm', iv: 0.2 }] },
  { value: 'short_call', label: 'Short Call', legs: [{ type: 'call', quantity: -1, strike: 'otm', iv: 0.2 }] },
  { value: 'short_put', label: 'Short Put', legs: [{ type: 'put', quantity: -1, strike: 'otm', iv: 0.2 }] },
  { value: 'covered_call', label: 'Covered Call', legs: [{ type: 'stock', quantity: 100, strike: 'atm', iv: 0 }, { type: 'call', quantity: -1, strike: 'otm', iv: 0.2 }] },
  { value: 'protective_put', label: 'Protective Put', legs: [{ type: 'stock', quantity: 100, strike: 'atm', iv: 0 }, { type: 'put', quantity: 1, strike: 'itm', iv: 0.2 }] },
  { value: 'bull_call_spread', label: 'Bull Call Spread', legs: [{ type: 'call', quantity: 1, strike: 'itm', iv: 0.2 }, { type: 'call', quantity: -1, strike: 'otm', iv: 0.2 }] },
  { value: 'bear_put_spread', label: 'Bear Put Spread', legs: [{ type: 'put', quantity: 1, strike: 'otm', iv: 0.2 }, { type: 'put', quantity: -1, strike: 'itm', iv: 0.2 }] },
  { value: 'straddle', label: 'Straddle', legs: [{ type: 'call', quantity: 1, strike: 'atm', iv: 0.2 }, { type: 'put', quantity: 1, strike: 'atm', iv: 0.2 }] },
  { value: 'strangle', label: 'Strangle', legs: [{ type: 'call', quantity: 1, strike: 'otm', iv: 0.2 }, { type: 'put', quantity: 1, strike: 'otm', iv: 0.2 }] },
  { value: 'iron_condor', label: 'Iron Condor', legs: [{ type: 'call', quantity: -1, strike: 'otm_near', iv: 0.2 }, { type: 'call', quantity: 1, strike: 'otm_far', iv: 0.2 }, { type: 'put', quantity: -1, strike: 'otm_near', iv: 0.2 }, { type: 'put', quantity: 1, strike: 'otm_far', iv: 0.2 }] },
  { value: 'butterfly_spread', label: 'Butterfly Spread', legs: [{ type: 'call', quantity: 1, strike: 'itm', iv: 0.2 }, { type: 'call', quantity: -2, strike: 'atm', iv: 0.2 }, { type: 'call', quantity: 1, strike: 'otm', iv: 0.2 }] },
];

export default function ThetaSimulationTab() {
  const [ticker, setTicker] = useState('SPY');
  const [expiry, setExpiry] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [legs, setLegs] = useState(STRATEGIES[8].legs); // Default Straddle
  const [selectedStrategy, setSelectedStrategy] = useState(STRATEGIES[8]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (ticker && legs.length > 0 && expiry) {
        runSimulation();
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [ticker, legs, expiry]);

  const handleStrategySelect = (strategy) => {
    setSelectedStrategy(strategy);
    setLegs(strategy.legs);
  };

  const addLeg = () => {
    setLegs([...legs, { type: 'call', strike: 'atm', iv: 0.2, quantity: 1 }]);
  };

  const removeLeg = (index) => {
    setLegs(legs.filter((_, i) => i !== index));
  };

  const updateLeg = (index, field, value) => {
    const newLegs = [...legs];
    newLegs[index] = { ...newLegs[index], [field]: value };
    setLegs(newLegs);
  };

  const runSimulation = async () => {
    setLoading(true);
    try {
      const response = await base44.functions.invoke('simulateTheta', {
        strategy: {
          ticker,
          expiry,
          legs
        }
      });
      setResults(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 p-4 border-b border-[#1a2332] bg-[#0d1117]">
        <div className="relative w-full md:w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b949e]" />
          <TerminalInput 
            value={ticker} 
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            className="pl-9 py-2"
            placeholder="Search Ticker"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-56 justify-between bg-[#000] border-[#1a2332] text-[#c9d1d9] hover:bg-[#1a2332] font-mono">
              {selectedStrategy ? selectedStrategy.label : 'Select Strategy'}
              <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-[#0d1117] border-[#1a2332] text-[#c9d1d9]">
            {STRATEGIES.map((strat) => (
              <DropdownMenuItem 
                key={strat.value}
                onClick={() => handleStrategySelect(strat)}
                className="focus:bg-[#1a2332] focus:text-[#00e5ff] cursor-pointer font-mono text-xs"
              >
                {strat.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-full md:w-40">
          <TerminalInput 
            type="date"
            value={expiry} 
            onChange={(e) => setExpiry(e.target.value)} 
          />
        </div>

        <Button 
          onClick={runSimulation} 
          disabled={loading}
          className="w-full md:w-auto ml-auto bg-[#3fb950] text-black hover:bg-[#3fb950]/90 font-bold font-mono"
        >
          {loading ? <Activity className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          SIMULATE
        </Button>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Builder */}
        <div className="w-full lg:w-1/3 p-4 border-r border-[#1a2332] overflow-y-auto bg-[#000000]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-[#8b949e] uppercase tracking-widest">
              Strategy Legs
            </h3>
            <button onClick={addLeg} className="text-[#00e5ff] text-xs hover:text-white flex items-center gap-1">
              <Plus className="w-3 h-3" /> ADD LEG
            </button>
          </div>

          <div className="space-y-3">
            {legs.map((leg, i) => (
              <TerminalCard key={i} className="p-3 space-y-3 group hover:border-[#1a2332]" noPadding>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-mono font-bold text-[#00e5ff]">
                     {leg.quantity > 0 ? 'LONG' : 'SHORT'} {leg.type.toUpperCase()}
                  </span>
                  <button onClick={() => removeLeg(i)} className="text-[#8b949e] hover:text-[#f85149] opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[9px] text-[#8b949e] uppercase block mb-1">Strike</label>
                    <TerminalInput 
                      type="text" 
                      value={leg.strike}
                      onChange={(e) => updateLeg(i, 'strike', e.target.value)}
                      className="text-xs py-1"
                    />
                  </div>
                  <div>
                     <label className="text-[9px] text-[#8b949e] uppercase block mb-1">Qty</label>
                     <TerminalInput 
                      type="number" 
                      value={leg.quantity}
                      onChange={(e) => updateLeg(i, 'quantity', parseFloat(e.target.value))}
                      className="text-xs py-1"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-[#8b949e] uppercase block mb-1">Type</label>
                    <TerminalSelect 
                      value={leg.type}
                      onChange={(e) => updateLeg(i, 'type', e.target.value)}
                      className="text-xs py-1 w-full h-[34px]"
                    >
                      <option value="call">Call</option>
                      <option value="put">Put</option>
                      <option value="stock">Stock</option>
                    </TerminalSelect>
                  </div>
                </div>
              </TerminalCard>
            ))}
          </div>
        </div>

        {/* Right: Chart */}
        <div className="flex-1 p-4 bg-[#050505] flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-[#c9d1d9] uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00e5ff]" />
              P/L Simulation
            </h3>
            {results && (
              <div className="flex gap-4 bg-[#0d1117] px-3 py-1.5 rounded border border-[#1a2332]">
                <div className="text-right border-r border-[#1a2332] pr-4">
                  <div className="text-[9px] text-[#8b949e] uppercase">Net Theta</div>
                  <div className="text-xs font-mono text-[#3fb950] font-bold">${results.metrics.netTheta.toFixed(2)}</div>
                </div>
                <div className="text-right pl-1">
                  <div className="text-[9px] text-[#8b949e] uppercase">Prob. Profit</div>
                  <div className="text-xs font-mono text-[#00e5ff] font-bold">{results.metrics.pop}%</div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 w-full min-h-0 border border-[#1a2332] bg-[#000000] rounded-lg relative">
            {results ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={results.curve} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2332" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    stroke="#8b949e" 
                    tick={{fontSize: 10, fontFamily: 'monospace'}}
                    tickFormatter={(val) => `Day ${val}`}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#8b949e" 
                    tick={{fontSize: 10, fontFamily: 'monospace'}}
                    tickFormatter={(val) => `$${val}`}
                    domain={['auto', 'auto']}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#0d1117', borderColor: '#1a2332', color: '#c9d1d9', fontSize: '12px', fontFamily: 'monospace'}}
                    itemStyle={{color: '#10B981'}}
                    labelStyle={{color: '#8b949e', marginBottom: '0.25rem'}}
                    cursor={{stroke: '#00e5ff', strokeWidth: 1, strokeDasharray: '4 4'}}
                  />
                  <ReferenceLine y={0} stroke="#8b949e" strokeDasharray="3 3" strokeOpacity={0.5} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10B981" 
                    strokeWidth={2} 
                    dot={false} 
                    activeDot={{r: 4, fill: '#10B981'}}
                    name="P/L"
                    animationDuration={500}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-[#8b949e] gap-2">
                <Activity className="w-8 h-8 opacity-20" />
                <span className="font-mono text-xs">RUNNING SIMULATION...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}