import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { TerminalCard, SectionHeader, MonoValue, StatusBadge, DataRow, LoadingPulse } from './BloombergStyles';
import { Zap, TrendingUp, AlertTriangle, Target, Activity, Shield, BarChart3 } from 'lucide-react';
import ProphetPayoffDiagram from './ProphetPayoffDiagram';
import ProphetWhyThisWins from './ProphetWhyThisWins';

// Prophet Ultimate Algorithm - 12 Metric Scoring System
export function calculateProphetUltimateScore(trade, marketData, spotGammaData, uoaData) {
  const weights = {
    ivRank: 0.20,
    ivHvDiff: 0.15,

    pop: 0.15,
    creditRisk: 0.10,
    termStructure: 0.08,
    uoaSentiment: 0.05,
    skewImbalance: 0.05,
    earningsDistance: 0.02,
  };

  let score = 0;
  const breakdown = {};

  // 1. IV Rank & IV Percentile (20%)
  const ivScore = Math.min(marketData.ivPercentile / 100, 1) * 100;
  breakdown.ivRank = { score: ivScore, weight: weights.ivRank, contribution: ivScore * weights.ivRank };
  score += breakdown.ivRank.contribution;

  // 2. IV vs HV Differential (15%) - IV should be higher than HV for premium selling
  const ivHvDiff = marketData.iv - marketData.realizedVol;
  const ivHvScore = Math.min(Math.max((ivHvDiff + 20) / 40, 0), 1) * 100;
  breakdown.ivHvDiff = { score: ivHvScore, weight: weights.ivHvDiff, contribution: ivHvScore * weights.ivHvDiff };
  score += breakdown.ivHvDiff.contribution;



  // 4. Probability of Profit (15%) - Target >70%
  const popScore = Math.min(trade.pop / 100, 1) * 100;
  breakdown.pop = { score: popScore, weight: weights.pop, contribution: popScore * weights.pop };
  score += breakdown.pop.contribution;

  // 5. Credit/Risk Ratio (10%)
  const creditRiskRatio = trade.credit / (trade.maxLoss || trade.credit * 10);
  const creditRiskScore = Math.min(creditRiskRatio * 200, 100);
  breakdown.creditRisk = { score: creditRiskScore, weight: weights.creditRisk, contribution: creditRiskScore * weights.creditRisk };
  score += breakdown.creditRisk.contribution;

  // 6. IV Term Structure Slope (8%) - Contango is positive
  const termStructureScore = marketData.termStructureSlope > 0 ? 80 + (marketData.termStructureSlope * 20) : 50 - Math.abs(marketData.termStructureSlope) * 30;
  breakdown.termStructure = { score: Math.min(Math.max(termStructureScore, 0), 100), weight: weights.termStructure, contribution: Math.min(Math.max(termStructureScore, 0), 100) * weights.termStructure };
  score += breakdown.termStructure.contribution;

  // 7. UOA Sentiment Score (5%) - Neutral is best for premium selling
  const uoaSentimentNormalized = 100 - Math.abs(uoaData.sentiment || 0);
  breakdown.uoaSentiment = { score: uoaSentimentNormalized, weight: weights.uoaSentiment, contribution: uoaSentimentNormalized * weights.uoaSentiment };
  score += breakdown.uoaSentiment.contribution;

  // 8. Put/Call Skew & Volume Imbalance (5%)
  const skewBalance = 100 - Math.abs((marketData.putCallRatio || 1) - 1) * 50;
  breakdown.skewImbalance = { score: Math.max(skewBalance, 0), weight: weights.skewImbalance, contribution: Math.max(skewBalance, 0) * weights.skewImbalance };
  score += breakdown.skewImbalance.contribution;

  // 9. Distance to Nearest Earnings (2%)
  const earningsScore = marketData.daysToEarnings > 7 ? 100 : marketData.daysToEarnings * 14;
  breakdown.earningsDistance = { score: earningsScore, weight: weights.earningsDistance, contribution: earningsScore * weights.earningsDistance };
  score += breakdown.earningsDistance.contribution;

  // Technical Bonus (up to 5 extra points)
  let technicalBonus = 0;
  if (marketData.rsi >= 40 && marketData.rsi <= 60) technicalBonus += 3;
  if (marketData.priceInBollingerBands) technicalBonus += 2;
  breakdown.technicalBonus = { score: technicalBonus * 20, bonus: technicalBonus };
  score += technicalBonus;

  return {
    score: Math.min(Math.round(score), 100),
    breakdown,
    tier: score >= 90 ? 'GOD_TIER' : score >= 85 ? 'HIGH_EDGE' : score >= 75 ? 'STRONG' : score >= 60 ? 'MODERATE' : 'WEAK'
  };
}

// Generate simulated market data with realistic values
export function generateSimulatedMarketData(ticker, spotPrice) {
  const baseIV = 25 + Math.random() * 35; // 25-60%
  const realizedVol = baseIV - 5 + Math.random() * 15; // Usually lower than IV
  
  return {
    ticker,
    spotPrice,
    iv: baseIV,
    ivPercentile: 45 + Math.random() * 50, // 45-95%
    realizedVol,
    vix: 14 + Math.random() * 18, // 14-32
    termStructureSlope: -0.3 + Math.random() * 0.8, // -0.3 to 0.5
    putCallRatio: 0.7 + Math.random() * 0.6, // 0.7-1.3
    daysToEarnings: Math.floor(5 + Math.random() * 40),
    rsi: 30 + Math.random() * 40, // 30-70
    priceInBollingerBands: Math.random() > 0.3,
    skew: {
      otmPutIV: baseIV + 2 + Math.random() * 8,
      otmCallIV: baseIV - 2 + Math.random() * 4,
      slope: -0.2 + Math.random() * 0.15
    }
  };
}



// Generate simulated UOA data
export function generateUOAData() {
  return {
    sentiment: Math.floor(Math.random() * 200) - 100, // -100 to +100
    bullishFlow: Math.floor(Math.random() * 50000000), // up to $50M
    bearishFlow: Math.floor(Math.random() * 50000000),
    unusualTrades: Math.floor(3 + Math.random() * 15),
    largestTrade: {
      type: Math.random() > 0.5 ? 'CALL' : 'PUT',
      premium: Math.floor(500000 + Math.random() * 5000000),
      sentiment: Math.random() > 0.5 ? 'BULLISH' : 'BEARISH'
    }
  };
}

// Generate all possible trades for a ticker
export function generateAllPossibleTrades(ticker, spotPrice, marketData) {
  const trades = [];
  const dteOptions = [7, 14, 21, 30, 45, 60];
  const deltaOptions = [0.10, 0.15, 0.20, 0.25, 0.30, 0.35];
  const widthOptions = [3, 5, 10, 15, 20];

  // Generate Bull Put Spreads
  dteOptions.forEach(dte => {
    deltaOptions.forEach(delta => {
      widthOptions.forEach(width => {
        const shortStrike = Math.round(spotPrice * (1 - delta * 1.5) / 5) * 5;
        const longStrike = shortStrike - width;
        const credit = calculateCreditSpreadPremium(spotPrice, shortStrike, dte, marketData.iv, 'put');
        const maxLoss = width - credit;
        const pop = (1 - delta) * 100;
        
        if (credit > 0.30 && pop > 65) {
          trades.push({
            id: `BPS_${dte}_${shortStrike}_${width}`,
            type: 'BULL_PUT_SPREAD',
            name: 'Bull Put Spread',
            ticker,
            dte,
            legs: [
              { action: 'SELL', type: 'PUT', strike: shortStrike, delta: -delta },
              { action: 'BUY', type: 'PUT', strike: longStrike, delta: -(delta * 0.4) }
            ],
            credit,
            maxLoss,
            breakeven: shortStrike - credit,
            pop,
            ror: (credit / maxLoss) * 100
          });
        }
      });
    });
  });

  // Generate Bear Call Spreads
  dteOptions.forEach(dte => {
    deltaOptions.forEach(delta => {
      widthOptions.forEach(width => {
        const shortStrike = Math.round(spotPrice * (1 + delta * 1.5) / 5) * 5;
        const longStrike = shortStrike + width;
        const credit = calculateCreditSpreadPremium(spotPrice, shortStrike, dte, marketData.iv, 'call');
        const maxLoss = width - credit;
        const pop = (1 - delta) * 100;
        
        if (credit > 0.30 && pop > 65) {
          trades.push({
            id: `BCS_${dte}_${shortStrike}_${width}`,
            type: 'BEAR_CALL_SPREAD',
            name: 'Bear Call Spread',
            ticker,
            dte,
            legs: [
              { action: 'SELL', type: 'CALL', strike: shortStrike, delta },
              { action: 'BUY', type: 'CALL', strike: longStrike, delta: delta * 0.4 }
            ],
            credit,
            maxLoss,
            breakeven: shortStrike + credit,
            pop,
            ror: (credit / maxLoss) * 100
          });
        }
      });
    });
  });

  // Generate Iron Condors
  dteOptions.forEach(dte => {
    deltaOptions.slice(0, 4).forEach(delta => {
      widthOptions.slice(0, 3).forEach(width => {
        const putShort = Math.round(spotPrice * (1 - delta * 1.5) / 5) * 5;
        const putLong = putShort - width;
        const callShort = Math.round(spotPrice * (1 + delta * 1.5) / 5) * 5;
        const callLong = callShort + width;
        
        const putCredit = calculateCreditSpreadPremium(spotPrice, putShort, dte, marketData.iv, 'put');
        const callCredit = calculateCreditSpreadPremium(spotPrice, callShort, dte, marketData.iv, 'call');
        const credit = putCredit + callCredit;
        const maxLoss = width - credit;
        const pop = (1 - delta * 2) * 100;
        
        if (credit > 0.80 && pop > 60) {
          trades.push({
            id: `IC_${dte}_${putShort}_${callShort}_${width}`,
            type: 'IRON_CONDOR',
            name: 'Iron Condor',
            ticker,
            dte,
            legs: [
              { action: 'BUY', type: 'PUT', strike: putLong, delta: -(delta * 0.3) },
              { action: 'SELL', type: 'PUT', strike: putShort, delta: -delta },
              { action: 'SELL', type: 'CALL', strike: callShort, delta },
              { action: 'BUY', type: 'CALL', strike: callLong, delta: delta * 0.3 }
            ],
            credit,
            maxLoss,
            upperBreakeven: callShort + credit,
            lowerBreakeven: putShort - credit,
            pop,
            ror: (credit / maxLoss) * 100
          });
        }
      });
    });
  });

  return trades;
}

function calculateCreditSpreadPremium(spot, strike, dte, iv, type) {
  const t = dte / 365;
  const sigma = iv / 100;
  const moneyness = type === 'put' ? (spot - strike) / spot : (strike - spot) / spot;
  const baseCredit = spot * sigma * Math.sqrt(t) * 0.4;
  const otmAdjustment = Math.max(0, 1 - moneyness * 8);
  return Math.round(baseCredit * otmAdjustment * 100) / 100;
}

// Main Trade Card Component
export function ProphetTradeCard({ trade, rank, marketData, uoaData, onSelect }) {
  const spotGammaData = {}; // GEX Removed
  const scoreData = calculateProphetUltimateScore(trade, marketData, spotGammaData, uoaData);
  const [showDetails, setShowDetails] = useState(false);

  const tierStyles = {
    GOD_TIER: 'border-[#00ff88] bg-gradient-to-r from-[#00ff88]/10 to-transparent animate-pulse',
    HIGH_EDGE: 'border-[#00e5ff] bg-gradient-to-r from-[#00e5ff]/10 to-transparent',
    STRONG: 'border-[#3fb950] bg-gradient-to-r from-[#3fb950]/5 to-transparent',
    MODERATE: 'border-[#1a2332]',
    WEAK: 'border-[#1a2332] opacity-60'
  };

  const tierLabels = {
    GOD_TIER: { text: 'GOD TIER', color: 'text-[#00ff88]' },
    HIGH_EDGE: { text: 'HIGH EDGE', color: 'text-[#00e5ff]' },
    STRONG: { text: 'STRONG', color: 'text-[#3fb950]' },
    MODERATE: { text: 'MODERATE', color: 'text-[#8b949e]' },
    WEAK: { text: 'WEAK', color: 'text-[#f85149]' }
  };

  return (
    <TerminalCard 
      className={`cursor-pointer transition-all hover:scale-[1.01] ${tierStyles[scoreData.tier]}`}
      onClick={() => setShowDetails(!showDetails)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold text-[#8b949e] font-mono">#{rank}</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#c9d1d9]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                {trade.name}
              </span>
              <StatusBadge variant={scoreData.tier === 'GOD_TIER' ? 'success' : scoreData.tier === 'HIGH_EDGE' ? 'active' : 'default'}>
                {trade.dte} DTE
              </StatusBadge>
            </div>
            <div className="text-xs text-[#8b949e] mt-1 font-mono">
              {trade.legs.map(l => `${l.action} ${l.strike} ${l.type}`).join(' / ')}
            </div>
          </div>
        </div>
        
        <div className="text-right flex flex-col items-end gap-2">
          <div>
            <div className={`text-4xl font-bold font-mono ${tierLabels[scoreData.tier].color}`} 
                 style={{ fontFamily: "'IBM Plex Mono', monospace", textShadow: scoreData.tier === 'GOD_TIER' ? '0 0 20px #00ff88' : 'none' }}>
              {scoreData.score}
            </div>
            <div className={`text-[10px] uppercase tracking-wider ${tierLabels[scoreData.tier].color}`}>
              {tierLabels[scoreData.tier].text}
            </div>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              // Execute logic placeholder
              console.log('Execute trade', trade);
            }}
            className="bg-[#3fb950] hover:bg-[#2ea043] text-white text-xs font-bold px-4 py-1.5 rounded-[2px] uppercase tracking-wider transition-all shadow-[0_0_10px_rgba(63,185,80,0.3)] hover:shadow-[0_0_15px_rgba(63,185,80,0.5)]"
          >
            Execute
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 mb-4">
        <div className="text-center">
          <div className="text-[10px] text-[#8b949e] uppercase">Credit</div>
          <div className="text-lg font-bold text-[#3fb950] font-mono">${trade.credit.toFixed(2)}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-[#8b949e] uppercase">Max Loss</div>
          <div className="text-lg font-bold text-[#f85149] font-mono">${trade.maxLoss.toFixed(2)}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-[#8b949e] uppercase">POP</div>
          <div className="text-lg font-bold text-[#c9d1d9] font-mono">{trade.pop.toFixed(1)}%</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-[#8b949e] uppercase">ROR</div>
          <div className="text-lg font-bold text-[#00e5ff] font-mono">{trade.ror.toFixed(1)}%</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-[#8b949e] uppercase">Breakeven</div>
          <div className="text-lg font-bold text-[#c9d1d9] font-mono">
            ${trade.breakeven?.toFixed(0) || `${trade.lowerBreakeven?.toFixed(0)}-${trade.upperBreakeven?.toFixed(0)}`}
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="border-t border-[#1a2332] pt-4 mt-4 space-y-4">
          <ProphetPayoffDiagram trade={trade} spotPrice={marketData.spotPrice} />
          <ProphetWhyThisWins trade={trade} scoreData={scoreData} marketData={marketData} spotGammaData={spotGammaData} />
          
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-[#00e5ff] text-black font-bold py-3 rounded-[2px] text-sm uppercase tracking-wider hover:bg-[#00e5ff]/80 transition-colors">
              Send to Tastytrade
            </button>
            <button className="bg-[#3fb950] text-black font-bold py-3 rounded-[2px] text-sm uppercase tracking-wider hover:bg-[#3fb950]/80 transition-colors">
              Send to Tradier
            </button>
          </div>
        </div>
      )}
    </TerminalCard>
  );
}

export default ProphetTradeCard;