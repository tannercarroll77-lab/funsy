import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Play, TrendingUp, TrendingDown, Target, BarChart3, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { TerminalCard, SectionHeader, MonoValue, DataRow, TerminalInput, TerminalSelect, StatusBadge, LoadingPulse } from './BloombergStyles';

export default function BacktestModule() {
  const [params, setParams] = useState({
    ticker: '',
    strategy: 'short_strangle',
    startDate: '2023-01-01',
    endDate: '2024-01-01',
    dte: 30,
    deltaTarget: 0.16
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [showTrades, setShowTrades] = useState(false);

  const strategies = [
    { value: 'short_strangle', label: 'Short Strangle' },
    { value: 'short_straddle', label: 'Short Straddle' },
    { value: 'iron_condor', label: 'Iron Condor' },
    { value: 'bull_put_spread', label: 'Bull Put Spread' },
    { value: 'bear_call_spread', label: 'Bear Call Spread' }
  ];

  const runBacktest = async () => {
    if (!params.ticker) return;
    setLoading(true);
    try {
      const response = await base44.functions.invoke('backtestStrategy', params);
      setResults(response.data);
    } catch (error) {
      console.error('Backtest failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TerminalCard>
      <SectionHeader action={<StatusBadge>BETA</StatusBadge>}>Strategy Backtester</SectionHeader>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div>
          <label className="text-[9px] text-[#8b949e] uppercase tracking-wider mb-1 block">Ticker</label>
          <TerminalInput
            value={params.ticker}
            onChange={(e) => setParams({ ...params, ticker: e.target.value.toUpperCase() })}
            placeholder="SPY"
          />
        </div>
        <div>
          <label className="text-[9px] text-[#8b949e] uppercase tracking-wider mb-1 block">Strategy</label>
          <TerminalSelect 
            value={params.strategy} 
            onChange={(e) => setParams({ ...params, strategy: e.target.value })}
            className="w-full"
          >
            {strategies.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </TerminalSelect>
        </div>
        <div>
          <label className="text-[9px] text-[#8b949e] uppercase tracking-wider mb-1 block">Start Date</label>
          <TerminalInput
            type="date"
            value={params.startDate}
            onChange={(e) => setParams({ ...params, startDate: e.target.value })}
          />
        </div>
        <div>
          <label className="text-[9px] text-[#8b949e] uppercase tracking-wider mb-1 block">End Date</label>
          <TerminalInput
            type="date"
            value={params.endDate}
            onChange={(e) => setParams({ ...params, endDate: e.target.value })}
          />
        </div>
        <div>
          <label className="text-[9px] text-[#8b949e] uppercase tracking-wider mb-1 block">DTE</label>
          <TerminalInput
            type="number"
            value={params.dte}
            onChange={(e) => setParams({ ...params, dte: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <label className="text-[9px] text-[#8b949e] uppercase tracking-wider mb-1 block">Delta</label>
          <TerminalInput
            type="number"
            step="0.01"
            value={params.deltaTarget}
            onChange={(e) => setParams({ ...params, deltaTarget: parseFloat(e.target.value) })}
          />
        </div>
      </div>

      <button
        onClick={runBacktest}
        disabled={loading || !params.ticker}
        className="w-full py-2.5 bg-[#000000] border border-[#1a2332] rounded-[2px] text-xs font-mono text-[#c9d1d9] uppercase tracking-wider hover:border-[#00e5ff]/50 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <LoadingPulse />
            Running...
          </>
        ) : (
          <>
            <Play className="w-3 h-3" />
            Run Backtest
          </>
        )}
      </button>

      {results && (
        <div className="mt-6 space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Win Rate"
              value={`${results.summary?.win_rate?.toFixed(1)}%`}
              icon={Target}
              positive={results.summary?.win_rate >= 60}
            />
            <StatCard
              label="Total P&L"
              value={`$${results.summary?.total_pnl?.toLocaleString()}`}
              icon={results.summary?.total_pnl >= 0 ? TrendingUp : TrendingDown}
              positive={results.summary?.total_pnl >= 0}
            />
            <StatCard
              label="Max Drawdown"
              value={`${results.summary?.max_drawdown_pct?.toFixed(1)}%`}
              icon={AlertTriangle}
              positive={results.summary?.max_drawdown_pct <= 15}
            />
            <StatCard
              label="Sharpe Ratio"
              value={results.summary?.sharpe_ratio?.toFixed(2)}
              icon={BarChart3}
              positive={results.summary?.sharpe_ratio >= 1}
            />
          </div>

          {/* Metrics */}
          <div className="grid md:grid-cols-2 gap-4">
            <TerminalCard>
              <SectionHeader>Performance</SectionHeader>
              <DataRow label="Total Trades" value={results.summary?.total_trades} />
              <DataRow label="Winning" value={results.summary?.winning_trades} color="text-[#3fb950]" />
              <DataRow label="Losing" value={results.summary?.losing_trades} color="text-[#f85149]" />
              <DataRow label="Avg Win" value={`$${results.summary?.avg_win?.toFixed(2)}`} color="text-[#3fb950]" />
              <DataRow label="Avg Loss" value={`$${results.summary?.avg_loss?.toFixed(2)}`} color="text-[#f85149]" />
              <DataRow label="Profit Factor" value={results.summary?.profit_factor?.toFixed(2)} />
            </TerminalCard>

            <TerminalCard>
              <SectionHeader>Risk Metrics</SectionHeader>
              <DataRow label="VaR (95%)" value={`$${results.risk_metrics?.var_95?.toFixed(2)}`} />
              <DataRow label="Expected Shortfall" value={`$${results.risk_metrics?.expected_shortfall?.toFixed(2)}`} />
              <DataRow label="Max Losing Streak" value={results.risk_metrics?.longest_losing_streak} />
              <DataRow label="Recovery Factor" value={results.risk_metrics?.recovery_factor?.toFixed(2)} />
              <DataRow label="Calmar Ratio" value={results.risk_metrics?.calmar_ratio?.toFixed(2)} />
              <DataRow label="Avg VIX" value={results.market_conditions?.avg_vix?.toFixed(1)} />
            </TerminalCard>
          </div>

          {/* Monthly Chart */}
          {results.monthly_returns?.length > 0 && (
            <TerminalCard>
              <SectionHeader>Monthly P&L</SectionHeader>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.monthly_returns}>
                    <XAxis dataKey="month" tick={{ fill: '#8b949e', fontSize: 9 }} axisLine={{ stroke: '#1a2332' }} tickLine={false} />
                    <YAxis tick={{ fill: '#8b949e', fontSize: 9 }} axisLine={{ stroke: '#1a2332' }} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#0d1117', border: '1px solid #1a2332', borderRadius: 2, fontSize: 11 }}
                      labelStyle={{ color: '#c9d1d9' }}
                    />
                    <Bar dataKey="pnl" radius={[1, 1, 0, 0]}>
                      {results.monthly_returns.map((entry, index) => (
                        <Cell key={index} fill={entry.pnl >= 0 ? '#3fb950' : '#f85149'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TerminalCard>
          )}

          {/* Trade Log */}
          {results.trades?.length > 0 && (
            <TerminalCard noPadding>
              <button
                onClick={() => setShowTrades(!showTrades)}
                className="w-full p-4 flex items-center justify-between text-[10px] text-[#8b949e] uppercase tracking-wider hover:bg-[#1a2332]/30 transition-colors"
              >
                <span>Trade Log ({results.trades.length})</span>
                {showTrades ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              {showTrades && (
                <div className="max-h-[300px] overflow-y-auto border-t border-[#1a2332]">
                  <table className="w-full text-[11px] font-mono">
                    <thead className="sticky top-0 bg-[#0d1117]">
                      <tr className="text-[#8b949e] text-[9px] uppercase tracking-wider border-b border-[#1a2332]">
                        <th className="py-2 px-3 text-left font-medium">Entry</th>
                        <th className="py-2 px-3 text-left font-medium">Exit</th>
                        <th className="py-2 px-3 text-right font-medium">Credit</th>
                        <th className="py-2 px-3 text-right font-medium">P&L</th>
                        <th className="py-2 px-3 text-center font-medium">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.trades.map((trade, idx) => (
                        <tr key={idx} className="border-b border-[#1a2332]/30 hover:bg-[#1a2332]/20">
                          <td className="py-2 px-3 text-[#c9d1d9]">{trade.entry_date}</td>
                          <td className="py-2 px-3 text-[#c9d1d9]">{trade.exit_date}</td>
                          <td className="py-2 px-3 text-right text-[#8b949e]">${trade.credit?.toFixed(2)}</td>
                          <td className={`py-2 px-3 text-right ${trade.pnl >= 0 ? 'text-[#3fb950]' : 'text-[#f85149]'}`}>
                            ${trade.pnl?.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-center">
                            {trade.result === 'WIN' ? (
                              <CheckCircle className="w-3 h-3 text-[#3fb950] mx-auto" />
                            ) : (
                              <XCircle className="w-3 h-3 text-[#f85149] mx-auto" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TerminalCard>
          )}
        </div>
      )}
    </TerminalCard>
  );
}

function StatCard({ label, value, icon: Icon, positive }) {
  return (
    <TerminalCard className={`border-l-2 ${positive ? 'border-l-[#3fb950]' : positive === false ? 'border-l-[#f85149]' : 'border-l-[#1a2332]'}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3 h-3 text-[#8b949e]" />
        <span className="text-[9px] text-[#8b949e] uppercase tracking-wider">{label}</span>
      </div>
      <div 
        className={`text-xl font-semibold font-mono ${positive ? 'text-[#3fb950]' : positive === false ? 'text-[#f85149]' : 'text-[#c9d1d9]'}`}
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        {value}
      </div>
    </TerminalCard>
  );
}