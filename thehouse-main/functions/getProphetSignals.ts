import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Development mode - allow all authenticated users
    // TODO: Re-enable when billing is configured
    // if (user.plan_type !== 'prophet') {
    //   return Response.json({ error: 'Prophet access required' }, { status: 403 });
    // }

    const { ticker } = await req.json();

    // Fetch real-time options data using Polygon.io
    const polygonApiKey = Deno.env.get('POLYGON_API_KEY');
    
    // Get current stock price
    const priceResponse = await fetch(
      `https://api.polygon.io/v2/last/trade/${ticker}?apiKey=${polygonApiKey}`
    );
    const priceData = await priceResponse.json();
    const spotPrice = priceData.results?.price || 0;

    // Get options chain snapshot
    const optionsResponse = await fetch(
      `https://api.polygon.io/v3/snapshot/options/${ticker}?apiKey=${polygonApiKey}`
    );
    const optionsData = await optionsResponse.json();

    // Calculate Prophet proprietary metrics
    const metrics = calculateProphetMetrics(optionsData, spotPrice);

    // Run ML model prediction
    const mlPrediction = await runProphetMLModel(ticker, metrics, spotPrice);

    // Generate top signals
    const signals = generateTopSignals(optionsData, metrics, mlPrediction, spotPrice);

    return Response.json({
      ticker,
      spot_price: spotPrice,
      timestamp: new Date().toISOString(),
      metrics,
      ml_prediction: mlPrediction,
      top_signals: signals
    });

  } catch (error) {
    console.error('Prophet signals error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function calculateProphetMetrics(optionsData, spotPrice) {
  const options = optionsData.results || [];
  
  // Calculate GEX (Gamma Exposure)
  let totalGamma = 0;
  let callGamma = 0;
  let putGamma = 0;
  const gexByStrike = {};

  options.forEach(opt => {
    const strike = opt.details?.strike_price || 0;
    const gamma = opt.greeks?.gamma || 0;
    const openInterest = opt.open_interest || 0;
    const gexValue = gamma * openInterest * spotPrice * spotPrice * 0.01;

    if (opt.details?.contract_type === 'call') {
      callGamma += gexValue;
    } else {
      putGamma += gexValue;
    }

    totalGamma += Math.abs(gexValue);
    
    if (!gexByStrike[strike]) {
      gexByStrike[strike] = 0;
    }
    gexByStrike[strike] += gexValue;
  });

  // Calculate IV metrics
  const ivValues = options
    .filter(o => o.implied_volatility > 0)
    .map(o => o.implied_volatility);
  
  const avgIV = ivValues.reduce((a, b) => a + b, 0) / ivValues.length || 0;
  const maxIV = Math.max(...ivValues, 0);
  const minIV = Math.min(...ivValues.filter(v => v > 0), 999);

  // Calculate skew
  const callIV = options
    .filter(o => o.details?.contract_type === 'call' && o.implied_volatility > 0)
    .map(o => o.implied_volatility);
  const putIV = options
    .filter(o => o.details?.contract_type === 'put' && o.implied_volatility > 0)
    .map(o => o.implied_volatility);

  const avgCallIV = callIV.reduce((a, b) => a + b, 0) / callIV.length || 0;
  const avgPutIV = putIV.reduce((a, b) => a + b, 0) / putIV.length || 0;
  const skew = ((avgPutIV - avgCallIV) / avgIV) * 100;

  // Find gamma walls
  const strikes = Object.keys(gexByStrike).map(Number).sort((a, b) => a - b);
  const gammaWalls = strikes
    .map(strike => ({
      strike,
      gex: gexByStrike[strike],
      distance_from_spot: ((strike - spotPrice) / spotPrice) * 100
    }))
    .sort((a, b) => Math.abs(b.gex) - Math.abs(a.gex))
    .slice(0, 5);

  // Calculate Put/Call Gamma Ratio
  const pcGammaRatio = putGamma / (callGamma || 1);

  // Calculate Prophet Edge Score (0-100 composite)
  const ivRankScore = Math.min((avgIV / maxIV) * 100, 100);
  const liquidityScore = Math.min((options.length / 500) * 100, 100);
  const gexScore = Math.min((Math.abs(totalGamma) / 1000000000) * 100, 100);
  const skewScore = Math.min(Math.abs(skew), 100);

  const prophetEdgeScore = (
    ivRankScore * 0.3 +
    liquidityScore * 0.2 +
    gexScore * 0.25 +
    skewScore * 0.25
  );

  return {
    total_gamma: totalGamma,
    call_gamma: callGamma,
    put_gamma: putGamma,
    pc_gamma_ratio: pcGammaRatio,
    gamma_walls: gammaWalls,
    avg_iv: avgIV,
    iv_range: { min: minIV, max: maxIV },
    skew: skew,
    liquidity_score: liquidityScore,
    prophet_edge_score: Math.round(prophetEdgeScore),
    total_open_interest: options.reduce((sum, o) => sum + (o.open_interest || 0), 0),
    options_count: options.length
  };
}

async function runProphetMLModel(ticker, metrics, spotPrice) {
  // Simplified ML prediction using LLM for now
  // In production, this would call a trained XGBoost/Neural Net model
  
  const prompt = `You are Prophet's ML engine. Analyze this options data and predict optimal credit spread opportunities.

Ticker: ${ticker}
Spot Price: $${spotPrice}
Prophet Edge Score: ${metrics.prophet_edge_score}
GEX: ${metrics.total_gamma}
Put/Call Gamma Ratio: ${metrics.pc_gamma_ratio.toFixed(2)}
IV Skew: ${metrics.skew.toFixed(2)}%

Generate 3 optimal credit spread recommendations (bull put spread, bear call spread, iron condor) with:
- Specific strikes
- DTE (7-45 days)
- Expected profit probability (POP)
- Confidence score (0-100)
- Risk/reward ratio
- Expected P&L at expiration

Focus on high-probability premium selling opportunities.`;

  try {
    const base44 = createClientFromRequest(Deno.env.get('BASE44_REQUEST'));
    const prediction = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          recommendations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                strategy: { type: "string" },
                strikes: {
                  type: "object",
                  properties: {
                    short: { type: "number" },
                    long: { type: "number" }
                  }
                },
                dte: { type: "number" },
                pop: { type: "number" },
                confidence: { type: "number" },
                expected_credit: { type: "number" },
                max_loss: { type: "number" },
                risk_reward: { type: "number" },
                prophet_signal: { type: "string" }
              }
            }
          },
          market_regime: { type: "string" },
          optimal_dte: { type: "number" }
        }
      }
    });

    return prediction;
  } catch (error) {
    console.error('ML prediction error:', error);
    return {
      recommendations: [],
      market_regime: "unknown",
      optimal_dte: 21
    };
  }
}

function generateTopSignals(optionsData, metrics, mlPrediction, spotPrice) {
  // Combine metrics and ML predictions to generate actionable signals
  const signals = [];

  // Add ML recommendations
  if (mlPrediction.recommendations) {
    mlPrediction.recommendations.forEach(rec => {
      signals.push({
        type: 'ml_recommendation',
        strategy: rec.strategy,
        strikes: rec.strikes,
        dte: rec.dte,
        pop: rec.pop,
        confidence: rec.confidence,
        expected_credit: rec.expected_credit,
        prophet_score: metrics.prophet_edge_score,
        signal_strength: rec.confidence > 80 ? 'STRONG' : rec.confidence > 60 ? 'MODERATE' : 'WEAK'
      });
    });
  }

  // Add gamma wall signals
  if (metrics.gamma_walls.length > 0) {
    const topWall = metrics.gamma_walls[0];
    signals.push({
      type: 'gamma_wall',
      description: `Major gamma wall at $${topWall.strike}`,
      strike: topWall.strike,
      gex: topWall.gex,
      distance: topWall.distance_from_spot.toFixed(2) + '%',
      signal_strength: Math.abs(topWall.gex) > 1000000000 ? 'STRONG' : 'MODERATE'
    });
  }

  // Add skew signal
  if (Math.abs(metrics.skew) > 10) {
    signals.push({
      type: 'skew_opportunity',
      description: `${metrics.skew > 0 ? 'Put' : 'Call'} skew detected`,
      skew_value: metrics.skew.toFixed(2),
      recommendation: metrics.skew > 0 ? 'Consider selling put premium' : 'Consider selling call premium',
      signal_strength: Math.abs(metrics.skew) > 20 ? 'STRONG' : 'MODERATE'
    });
  }

  return signals.slice(0, 10); // Top 10 signals
}