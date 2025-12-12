import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// Standard Normal cumulative distribution function
function N(x) {
    const a1 = 0.319381530;
    const a2 = -0.356563782;
    const a3 = 1.781477937;
    const a4 = -1.821255978;
    const a5 = 1.330274429;
    const p = 0.2316419;
    const c = 0.39894228;

    if (x >= 0) {
        const k = 1.0 / (1.0 + p * x);
        return 1.0 - c * Math.exp(-x * x / 2.0) * k *
            (a1 + k * (a2 + k * (a3 + k * (a4 + k * a5))));
    } else {
        const k = 1.0 / (1.0 + p * -x);
        return c * Math.exp(-x * x / 2.0) * k *
            (a1 + k * (a2 + k * (a3 + k * (a4 + k * a5))));
    }
}

function blackScholes(S, K, T, r, sigma, type) {
    const d1 = (Math.log(S / K) + (r + sigma * sigma / 2.0) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);
    
    let price = 0;
    let delta = 0;
    let theta = 0;

    if (type === 'call') {
        price = S * N(d1) - K * Math.exp(-r * T) * N(d2);
        delta = N(d1);
        // Theta per year
        theta = (- (S * sigma * Math.exp(-d1 * d1 / 2.0)) / (2 * Math.sqrt(T)) 
                 - r * K * Math.exp(-r * T) * N(d2));
    } else {
        price = K * Math.exp(-r * T) * N(-d2) - S * N(-d1);
        delta = N(d1) - 1;
        // Theta per year
        theta = (- (S * sigma * Math.exp(-d1 * d1 / 2.0)) / (2 * Math.sqrt(T)) 
                 + r * K * Math.exp(-r * T) * N(-d2));
    }

    // Return Theta per day
    return { price, theta: theta / 365.0, delta };
}

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { strategy } = await req.json();
        const { legs, ticker, expiry } = strategy;

        if (!legs || !ticker || !expiry) {
            return Response.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const apiKey = Deno.env.get('POLYGON_API_KEY');
        
        // Fetch spot price
        let spotPrice = 100; // Default fallback
        if (apiKey) {
            try {
                const prevCloseRes = await fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${apiKey}`);
                const prevCloseData = await prevCloseRes.json();
                if (prevCloseData.results && prevCloseData.results.length > 0) {
                    spotPrice = prevCloseData.results[0].c;
                }
            } catch (e) {
                console.error("Error fetching spot price:", e);
            }
        }

        const expiryDate = new Date(expiry);
        const now = new Date();
        const daysToExpiry = (expiryDate - now) / (1000 * 60 * 60 * 24);
        
        if (daysToExpiry <= 0) {
            return Response.json({ error: 'Expiry must be in the future' }, { status: 400 });
        }

        let netTheta = 0;
        const plCurve = [];
        const r = 0.05; // Risk free rate 5%

        // Simulate for each day until expiry
        for (let day = 0; day < Math.ceil(daysToExpiry); day++) {
            let totalValue = 0;
            let currentNetTheta = 0;
            
            // Time remaining at this step (in years)
            const tRemaining = (daysToExpiry - day) / 365.0;
            
            if (tRemaining <= 0) break;

            legs.forEach(leg => {
                const iv = leg.iv || 0.5;
                
                // Resolve relative strikes
                let strike = leg.strike;
                if (typeof strike === 'string') {
                    switch (strike) {
                        case 'atm': strike = spotPrice; break;
                        case 'itm': strike = leg.type === 'call' ? spotPrice * 0.95 : spotPrice * 1.05; break;
                        case 'otm': strike = leg.type === 'call' ? spotPrice * 1.05 : spotPrice * 0.95; break;
                        case 'otm_near': strike = leg.type === 'call' ? spotPrice * 1.025 : spotPrice * 0.975; break;
                        case 'otm_far': strike = leg.type === 'call' ? spotPrice * 1.10 : spotPrice * 0.90; break;
                        default: strike = parseFloat(strike) || spotPrice;
                    }
                } else {
                    strike = parseFloat(strike);
                }

                const bs = blackScholes(spotPrice, strike, tRemaining, r, iv, leg.type);
                
                totalValue += bs.price * leg.quantity;
                currentNetTheta += bs.theta * leg.quantity;
            });

            plCurve.push({ 
                day, 
                value: totalValue, 
                theta: currentNetTheta,
                date: new Date(now.getTime() + day * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            });
            
            // Update final netTheta to be the current day's theta
            if (day === 0) netTheta = currentNetTheta;
        }

        // Calculate simple average theta for metrics
        const avgTheta = plCurve.reduce((sum, p) => sum + p.theta, 0) / (plCurve.length || 1);

        return Response.json({ 
            curve: plCurve, 
            metrics: { 
                netTheta: netTheta, 
                avgTheta: avgTheta,
                pop: 72, // Mocked as per snippet request
                spotPrice
            } 
        });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});