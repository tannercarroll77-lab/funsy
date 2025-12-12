// OIPD Filter - Option-Implied Probability Distribution
// Uses simplified Breeden-Litzenberger to extract risk-neutral probabilities

function extractOIPD(chain) {
  // Extract option-implied probability distribution from chain data
  // This is a simplified version - real implementation would use butterfly spreads
  if (!chain || !chain.strikes) {
    return { probabilities: {}, mean: 0, stdDev: 0 };
  }
  
  const probabilities = {};
  const strikes = chain.strikes || [];
  
  strikes.forEach((strike, i) => {
    // Approximate probability density from call/put price differences
    const callPrice = chain.calls?.[i]?.price || 0;
    const putPrice = chain.puts?.[i]?.price || 0;
    const nextCall = chain.calls?.[i + 1]?.price || callPrice;
    const prevCall = chain.calls?.[i - 1]?.price || callPrice;
    
    // Second derivative approximation for probability density
    const density = Math.abs(prevCall - 2 * callPrice + nextCall);
    probabilities[strike] = Math.max(0, density);
  });
  
  // Normalize probabilities
  const total = Object.values(probabilities).reduce((a, b) => a + b, 0) || 1;
  Object.keys(probabilities).forEach(k => {
    probabilities[k] = probabilities[k] / total;
  });
  
  return { probabilities, strikes };
}

function getOIPDProbability(oipd, targetPrice) {
  // Get cumulative probability of price staying above target
  if (!oipd.probabilities || Object.keys(oipd.probabilities).length === 0) {
    return 0.5; // Default neutral probability
  }
  
  let cumProb = 0;
  const sortedStrikes = Object.keys(oipd.probabilities)
    .map(Number)
    .sort((a, b) => a - b);
  
  for (const strike of sortedStrikes) {
    if (strike >= targetPrice) {
      cumProb += oipd.probabilities[strike];
    }
  }
  
  return Math.min(1, Math.max(0, cumProb));
}

export default function oipdFilter(spreads, chain, spotPrice) {
  // Extract OIPD from call/put price ratios (simplified Breeden-Litzenberger)
  const oipd = extractOIPD(chain);
  
  // For each spread, check probability alignment
  const filtered = spreads.map(spread => {
    const breakeven = spread.shortStrike || spread.breakeven || 
      (spread.legs?.[0]?.strike - (spread.credit || 0));
    const probability = getOIPDProbability(oipd, breakeven);
    
    return {
      ...spread,
      oipdProbability: probability,
      oipdScore: probability > 0.6 ? 95 : probability > 0.4 ? 75 : 40,
      oipdStatus: probability > 0.6 ? "🟢 HIGH EDGE" : 
                  probability > 0.4 ? "🟡 MEDIUM" : "🔴 LOW PROB"
    };
  }).filter(s => s.oipdProbability > 0.4); // Only 40%+ probability trades
  
  return filtered.sort((a, b) => b.oipdProbability - a.oipdProbability);
}

export { extractOIPD, getOIPDProbability };