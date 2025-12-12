import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { ticker, expiration } = await req.json();

        if (!ticker) {
            return Response.json({ error: 'Ticker is required' }, { status: 400 });
        }

        // Get OAuth access token
        const accessToken = await base44.asServiceRole.connectors.getAccessToken('tastytrade');

        if (!accessToken) {
            return Response.json({ error: 'Tastytrade not authorized' }, { status: 401 });
        }

        // Fetch options chain from Tastytrade
        const chainUrl = expiration 
            ? `https://api.tastyworks.com/option-chains/${ticker}/nested?expiration=${expiration}`
            : `https://api.tastyworks.com/option-chains/${ticker}/nested`;

        const chainResponse = await fetch(chainUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!chainResponse.ok) {
            const error = await chainResponse.text();
            return Response.json({ error: `Tastytrade API error: ${error}` }, { status: chainResponse.status });
        }

        const chainData = await chainResponse.json();

        // Fetch current quote for underlying
        const quoteResponse = await fetch(`https://api.tastyworks.com/quote/equity/${ticker}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        let underlyingPrice = 0;
        if (quoteResponse.ok) {
            const quoteData = await quoteResponse.json();
            underlyingPrice = quoteData.data?.last || 0;
        }

        // Transform data to match our format
        const expirations = chainData.data?.expirations || [];
        const options = [];

        // Process options data
        chainData.data?.items?.forEach(item => {
            if (item['option-type'] === 'Call') {
                options.push({
                    type: 'call',
                    strike: item['strike-price'],
                    expiration: item['expiration-date'],
                    last: item['last'],
                    bid: item['bid'],
                    ask: item['ask'],
                    volume: item['volume'],
                    open_interest: item['open-interest'],
                    delta: item.greeks?.delta,
                    iv: item['implied-volatility']
                });
            } else if (item['option-type'] === 'Put') {
                options.push({
                    type: 'put',
                    strike: item['strike-price'],
                    expiration: item['expiration-date'],
                    last: item['last'],
                    bid: item['bid'],
                    ask: item['ask'],
                    volume: item['volume'],
                    open_interest: item['open-interest'],
                    delta: item.greeks?.delta,
                    iv: item['implied-volatility']
                });
            }
        });

        return Response.json({
            ticker,
            underlying_price: underlyingPrice,
            expirations,
            options
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});