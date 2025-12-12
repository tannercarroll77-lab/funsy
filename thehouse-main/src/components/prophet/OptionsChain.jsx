import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { TerminalCard, SectionHeader, TerminalSelect, LoadingPulse } from './BloombergStyles';

export default function OptionsChain({ ticker }) {
  const [loading, setLoading] = useState(false);
  const [chainData, setChainData] = useState(null);
  const [selectedExpiration, setSelectedExpiration] = useState(null);

  useEffect(() => {
    if (ticker) fetchChain();
  }, [ticker]);

  const fetchChain = async (expiration = null) => {
    setLoading(true);
    try {
      const response = await base44.functions.invoke('fetchOptionsChain', { ticker, expiration });
      setChainData(response.data);
      if (!expiration && response.data.expirations?.length > 0) {
        setSelectedExpiration(response.data.expirations[0]);
      }
    } catch (error) {
      console.error('Failed to fetch options chain:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !chainData) {
    return (
      <TerminalCard className="h-[600px] flex items-center justify-center">
        <LoadingPulse />
      </TerminalCard>
    );
  }

  if (!chainData) {
    return (
      <TerminalCard className="p-8 text-center">
        <p className="text-sm text-[#8b949e] font-mono">Enter a ticker to view options data</p>
      </TerminalCard>
    );
  }

  const strikeMap = {};
  chainData.options?.forEach(option => {
    if (!strikeMap[option.strike]) strikeMap[option.strike] = { strike: option.strike };
    if (option.type === 'call') strikeMap[option.strike].call = option;
    else strikeMap[option.strike].put = option;
  });

  const strikes = Object.values(strikeMap).sort((a, b) => a.strike - b.strike);
  const currentPrice = chainData.underlying_price || 0;

  return (
    <TerminalCard noPadding>
      <div className="p-4 border-b border-[#1a2332] flex items-center justify-between">
        <div>
          <SectionHeader className="mb-0 pb-0 border-0">Options Chain</SectionHeader>
          <div className="text-xs text-[#8b949e] font-mono mt-1">
            {ticker} • ${currentPrice.toFixed(2)}
          </div>
        </div>
        {chainData.expirations?.length > 0 && (
          <TerminalSelect
            value={selectedExpiration || ''}
            onChange={(e) => {
              setSelectedExpiration(e.target.value);
              fetchChain(e.target.value);
            }}
          >
            {chainData.expirations.map(exp => (
              <option key={exp} value={exp}>{exp}</option>
            ))}
          </TerminalSelect>
        )}
      </div>

      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-[11px] font-mono">
          <thead className="sticky top-0 bg-[#0d1117] z-10">
            <tr className="border-b border-[#1a2332]">
              <th colSpan="7" className="text-center py-2 text-[#8b949e] text-[10px] uppercase tracking-wider border-r border-[#1a2332]">
                Calls
              </th>
              <th className="text-center py-2 text-[#c9d1d9] text-[10px] uppercase tracking-wider bg-[#000000] px-4">
                Strike
              </th>
              <th colSpan="7" className="text-center py-2 text-[#8b949e] text-[10px] uppercase tracking-wider border-l border-[#1a2332]">
                Puts
              </th>
            </tr>
            <tr className="text-[#8b949e] text-[9px] uppercase tracking-wider border-b border-[#1a2332]">
              <th className="py-2 px-2 text-left font-medium">Last</th>
              <th className="py-2 px-2 text-right font-medium">Bid</th>
              <th className="py-2 px-2 text-right font-medium">Ask</th>
              <th className="py-2 px-2 text-right font-medium">Vol</th>
              <th className="py-2 px-2 text-right font-medium">OI</th>
              <th className="py-2 px-2 text-right font-medium">Δ</th>
              <th className="py-2 px-2 text-right font-medium border-r border-[#1a2332]">IV</th>
              <th className="py-2 px-4 text-center bg-[#000000]"></th>
              <th className="py-2 px-2 text-left font-medium border-l border-[#1a2332]">IV</th>
              <th className="py-2 px-2 text-right font-medium">Δ</th>
              <th className="py-2 px-2 text-right font-medium">OI</th>
              <th className="py-2 px-2 text-right font-medium">Vol</th>
              <th className="py-2 px-2 text-right font-medium">Ask</th>
              <th className="py-2 px-2 text-right font-medium">Bid</th>
              <th className="py-2 px-2 text-right font-medium">Last</th>
            </tr>
          </thead>

          <tbody>
            {strikes.map((row, idx) => {
              const isATM = Math.abs(row.strike - currentPrice) < currentPrice * 0.01;
              
              return (
                <tr
                  key={row.strike}
                  className={`border-b border-[#1a2332]/30 hover:bg-[#1a2332]/30 transition-colors ${
                    isATM ? 'border-l-2 border-l-[#00e5ff] bg-[#1a2332]/20' : ''
                  }`}
                >
                  <td className="py-2 px-2 text-[#c9d1d9]">{row.call?.last?.toFixed(2) || '—'}</td>
                  <td className="py-2 px-2 text-right text-[#8b949e]">{row.call?.bid?.toFixed(2) || '—'}</td>
                  <td className="py-2 px-2 text-right text-[#8b949e]">{row.call?.ask?.toFixed(2) || '—'}</td>
                  <td className="py-2 px-2 text-right text-[#8b949e]">{row.call?.volume || '—'}</td>
                  <td className="py-2 px-2 text-right text-[#8b949e]">{row.call?.open_interest || '—'}</td>
                  <td className="py-2 px-2 text-right text-[#c9d1d9]">{row.call?.delta?.toFixed(2) || '—'}</td>
                  <td className="py-2 px-2 text-right text-[#c9d1d9] border-r border-[#1a2332]">
                    {row.call?.iv ? `${(row.call.iv * 100).toFixed(1)}` : '—'}
                  </td>

                  <td className={`py-2 px-4 text-center font-semibold bg-[#000000] ${isATM ? 'text-[#00e5ff]' : 'text-[#c9d1d9]'}`}>
                    {row.strike.toFixed(2)}
                  </td>

                  <td className="py-2 px-2 text-left text-[#c9d1d9] border-l border-[#1a2332]">
                    {row.put?.iv ? `${(row.put.iv * 100).toFixed(1)}` : '—'}
                  </td>
                  <td className="py-2 px-2 text-right text-[#c9d1d9]">{row.put?.delta?.toFixed(2) || '—'}</td>
                  <td className="py-2 px-2 text-right text-[#8b949e]">{row.put?.open_interest || '—'}</td>
                  <td className="py-2 px-2 text-right text-[#8b949e]">{row.put?.volume || '—'}</td>
                  <td className="py-2 px-2 text-right text-[#8b949e]">{row.put?.ask?.toFixed(2) || '—'}</td>
                  <td className="py-2 px-2 text-right text-[#8b949e]">{row.put?.bid?.toFixed(2) || '—'}</td>
                  <td className="py-2 px-2 text-right text-[#c9d1d9]">{row.put?.last?.toFixed(2) || '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </TerminalCard>
  );
}