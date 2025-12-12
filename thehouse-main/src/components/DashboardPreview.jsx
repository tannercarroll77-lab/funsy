import React from 'react';
import { 
  TerminalCard, 
  SectionHeader, 
  MonoValue, 
  StatusBadge, 
  DataRow, 
  TerminalInput 
} from './prophet/BloombergStyles';
import { 
  Activity, 
  Zap, 
  TrendingUp, 
  Lock, 
  Search, 
  BarChart3, 
  AlertTriangle,
  Target,
  Waves,
  ArrowUpRight,
  ArrowDownRight,
  GitCommit
} from 'lucide-react';

export default function DashboardPreview() {
  return (
    <div className="bg-[#000000] text-[#c9d1d9] p-4 lg:p-6 font-mono rounded-sm overflow-hidden border border-[#1a2332] shadow-2xl transform transition-all hover:scale-[1.002]">
      {/* Simulated Status Bar */}
      <div className="flex items-center justify-between mb-6 border-b border-[#1a2332] pb-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-[#3fb950] rounded-full animate-pulse" />
             <span className="text-[10px] font-bold text-[#8b949e] tracking-widest">PROPHET™ ENGINE v4.2</span>
          </div>
          <div className="hidden sm:flex gap-3 text-[10px] text-[#8b949e] font-mono">
            <span>LATENCY: 12ms</span>
            <span className="text-[#3fb950]">CONNECTED</span>
          </div>
        </div>
        <div className="flex gap-4 text-[10px] font-mono">
           <span className="text-[#c9d1d9]">ES_F: <span className="text-[#3fb950]">4,452.50</span></span>
           <span className="text-[#c9d1d9]">VIX: <span className="text-[#f85149]">18.42</span></span>
           <span className="text-[#8b949e]">NYSE LIVE</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: MAIN ENGINE & SCANNER */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Header & Metrics */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1 tracking-tight flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#00e5ff]" />
                Market Scanner
              </h2>
              <div className="text-xs text-[#00e5ff] uppercase tracking-wider flex gap-2">
                <span>Institutional Intelligence</span>
                <span className="text-[#1a2332]">|</span>
                <span>Scanning 4,291 Tickers</span>
              </div>
            </div>
            <div className="flex gap-2">
               <StatusBadge variant="active" className="bg-[#00e5ff]/5">VOL REGIME: HIGH</StatusBadge>
               <StatusBadge variant="danger" className="bg-[#f85149]/5">SKEW: STEEP</StatusBadge>
            </div>
          </div>

          {/* Command Line / Search */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00e5ff]/20 to-[#3fb950]/20 rounded blur opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative flex items-center bg-[#0d1117] border border-[#1a2332] rounded-[2px]">
              <div className="pl-4 pr-2 text-[#8b949e]">
                <Search className="h-4 w-4" />
              </div>
              <TerminalInput 
                className="py-3 text-lg bg-transparent border-none focus:ring-0 pl-0" 
                placeholder="COMMAND..." 
                readOnly 
                value="ANALYZE $TSLA --STRATEGY=STRANGLE"
              />
              <div className="pr-4 flex items-center gap-3">
                 <span className="text-[10px] text-[#8b949e] font-mono border border-[#1a2332] px-1.5 py-0.5 rounded">CMD+K</span>
                 <span className="text-xs text-[#3fb950] animate-pulse">● LIVE</span>
              </div>
            </div>
          </div>

          {/* MAIN TRADE CARD */}
          <TerminalCard className="border-[#00e5ff] bg-gradient-to-br from-[#00e5ff]/5 via-[#0d1117] to-[#0d1117] relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-3 flex gap-2">
                <div className="text-[10px] font-bold text-[#00e5ff] bg-[#00e5ff]/10 border border-[#00e5ff] px-2 py-0.5 rounded tracking-widest shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                  HOUSE ALPHA
                </div>
             </div>
             
             <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                <div>
                   <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl font-bold text-white tracking-tight">TSLA</span>
                      <span className="text-xs font-bold text-[#000000] bg-[#c9d1d9] px-1.5 py-0.5 rounded-[2px]">SHORT STRANGLE</span>
                   </div>
                   <div className="flex flex-wrap gap-3 text-xs text-[#8b949e] font-mono">
                      <span className="flex items-center gap-1"><ArrowDownRight className="w-3 h-3 text-[#f85149]" /> SELL 240 PUT</span>
                      <span className="flex items-center gap-1"><ArrowDownRight className="w-3 h-3 text-[#f85149]" /> SELL 280 CALL</span>
                      <span className="text-[#1a2332]">|</span>
                      <span className="text-[#c9d1d9]">7 DTE</span>
                   </div>
                </div>
                <div className="text-left sm:text-right pr-0 sm:pr-24">
                   <div className="text-5xl font-bold text-[#00e5ff] tracking-tighter drop-shadow-[0_0_15px_rgba(0,229,255,0.3)]">98.4</div>
                   <div className="text-[10px] text-[#00e5ff] uppercase tracking-wider font-bold">Prophet Score</div>
                </div>
             </div>

             {/* Analytics Grid */}
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#1a2332] border border-[#1a2332] rounded-[2px] overflow-hidden mb-4">
                <div className="bg-[#0d1117] p-3 hover:bg-[#161b22] transition-colors">
                   <div className="text-[10px] text-[#8b949e] uppercase mb-1">Total Credit</div>
                   <div className="text-xl font-bold text-[#3fb950]">$4.25</div>
                </div>
                <div className="bg-[#0d1117] p-3 hover:bg-[#161b22] transition-colors">
                   <div className="text-[10px] text-[#8b949e] uppercase mb-1">Prob. Profit</div>
                   <div className="text-xl font-bold text-[#c9d1d9]">88.2%</div>
                </div>
                <div className="bg-[#0d1117] p-3 hover:bg-[#161b22] transition-colors">
                   <div className="text-[10px] text-[#8b949e] uppercase mb-1">IV Rank</div>
                   <div className="text-xl font-bold text-[#f85149]">92%</div>
                </div>
                <div className="bg-[#0d1117] p-3 hover:bg-[#161b22] transition-colors">
                   <div className="text-[10px] text-[#8b949e] uppercase mb-1">Theta/Day</div>
                   <div className="text-xl font-bold text-[#00e5ff]">$32.00</div>
                </div>
             </div>

             {/* Greeks & Risk */}
             <div className="grid grid-cols-4 gap-2 text-[10px] font-mono text-[#8b949e] bg-[#000000]/30 p-2 rounded border border-[#1a2332]">
                <div className="flex justify-between"><span>DELTA</span> <span className="text-[#c9d1d9]">-4.2</span></div>
                <div className="flex justify-between"><span>GAMMA</span> <span className="text-[#c9d1d9]">-0.02</span></div>
                <div className="flex justify-between"><span>THETA</span> <span className="text-[#3fb950]">+32.0</span></div>
                <div className="flex justify-between"><span>VEGA</span> <span className="text-[#f85149]">-12.5</span></div>
             </div>
          </TerminalCard>

          {/* Secondary Opportunities List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <TerminalCard className="opacity-80 hover:opacity-100 transition-all border-l-[3px] border-l-[#3fb950]">
                <div className="flex justify-between mb-3">
                   <div>
                     <div className="font-bold text-white flex items-center gap-2">
                        NVDA <span className="text-[10px] text-[#8b949e] font-normal">IRON CONDOR</span>
                     </div>
                     <div className="text-[10px] text-[#8b949e]">45 DTE • EARNINGS PLAY</div>
                   </div>
                   <div className="text-right">
                     <span className="text-[#3fb950] font-bold text-xl">89</span>
                   </div>
                </div>
                <DataRow label="Expected Value" value="+$215" color="text-[#3fb950]" />
                <DataRow label="Breakevens" value="410 / 490" />
             </TerminalCard>

             <TerminalCard className="opacity-80 hover:opacity-100 transition-all border-l-[3px] border-l-[#a855f7]">
                <div className="flex justify-between mb-3">
                   <div>
                     <div className="font-bold text-white flex items-center gap-2">
                        AMD <span className="text-[10px] text-[#8b949e] font-normal">PUT SPREAD</span>
                     </div>
                     <div className="text-[10px] text-[#8b949e]">21 DTE • DIRECTIONAL</div>
                   </div>
                   <div className="text-right">
                     <span className="text-[#a855f7] font-bold text-xl">85</span>
                   </div>
                </div>
                <DataRow label="Expected Value" value="+$145" color="text-[#3fb950]" />
                <DataRow label="Direction" value="BULLISH" color="text-[#3fb950]" />
             </TerminalCard>
          </div>
        </div>

        {/* RIGHT COLUMN: MARKET INTEL */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Gamma Exposure Viz */}
          <TerminalCard className="h-40 relative overflow-hidden flex flex-col">
             <SectionHeader action={<Waves className="w-3 h-3 text-[#00e5ff]" />}>GEX Profile</SectionHeader>
             <div className="flex-1 flex items-end justify-between gap-1 px-2 pb-0 relative z-10">
                {[15, 25, 40, 30, 60, 90, 50, 30, 20, 10].map((h, i) => (
                   <div key={i} className="w-full relative group">
                      <div 
                        className={`w-full rounded-t-sm transition-all duration-500 ${i === 5 ? 'bg-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.4)]' : 'bg-[#1a2332] hover:bg-[#2d3b4f]'}`} 
                        style={{height: `${h}%`}} 
                      />
                   </div>
                ))}
             </div>
             {/* Zero Line */}
             <div className="absolute bottom-8 left-0 right-0 h-px bg-[#1a2332] z-0 border-t border-dashed border-[#8b949e]/30" />
             
             <div className="flex justify-between text-[9px] font-mono text-[#8b949e] mt-2 px-1">
                <span>PUT WALL</span>
                <span className="text-[#00e5ff] font-bold">CALL WALL</span>
             </div>
          </TerminalCard>

          {/* Live Order Tape */}
          <TerminalCard className="h-48 flex flex-col">
             <SectionHeader action={<GitCommit className="w-3 h-3 text-[#3fb950] animate-pulse" />}>
                Institutional Tape
             </SectionHeader>
             <div className="flex-1 overflow-hidden relative">
                <div className="space-y-0.5 absolute inset-0">
                  {[
                    { t: 'MSFT', s: '1.2M', type: 'CALL', p: '$3.45', impact: 'high' },
                    { t: 'SPY', s: '5.8M', type: 'PUT', p: '$1.10', impact: 'med' },
                    { t: 'AMZN', s: '850K', type: 'CALL', p: '$2.80', impact: 'low' },
                    { t: 'META', s: '2.1M', type: 'BLOCK', p: '$4.15', impact: 'high' },
                    { t: 'NVDA', s: '900K', type: 'PUT', p: '$5.20', impact: 'med' },
                    { t: 'AAPL', s: '3.4M', type: 'CALL', p: '$0.85', impact: 'low' },
                  ].map((trade, i) => (
                    <div key={i} className="flex justify-between items-center text-[10px] py-1 border-b border-[#1a2332]/50 last:border-0">
                      <div className="flex items-center gap-2 w-16">
                         <span className={trade.impact === 'high' ? 'text-white font-bold' : 'text-[#8b949e]'}>{trade.t}</span>
                      </div>
                      <div className={`w-10 ${trade.type === 'CALL' ? 'text-[#3fb950]' : trade.type === 'PUT' ? 'text-[#f85149]' : 'text-[#00e5ff]'}`}>
                        {trade.type}
                      </div>
                      <div className="text-right font-mono text-[#c9d1d9] flex-1">{trade.p}</div>
                      <div className="text-right w-12 font-mono text-[#8b949e]">{trade.s}</div>
                    </div>
                  ))}
                </div>
                {/* Gradient Fade at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0d1117] to-transparent" />
             </div>
          </TerminalCard>

          {/* Vol Surface Mini */}
          <TerminalCard>
             <SectionHeader>Term Structure</SectionHeader>
             <div className="space-y-3">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] text-[#8b949e]">CONTANGO</span>
                   <div className="h-1 w-24 bg-[#1a2332] rounded-full overflow-hidden">
                      <div className="h-full w-[70%] bg-[#00e5ff]" />
                   </div>
                </div>
                <DataRow label="Fwd Vol" value="18.2%" color="text-[#c9d1d9]" />
                <DataRow label="Skew Index" value="134.5" color="text-[#f85149]" />
             </div>
          </TerminalCard>

        </div>
      </div>
    </div>
  );
}