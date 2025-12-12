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

        const apiKey = Deno.env.get('POLYGON_API_KEY');
        if (!apiKey) {
            return Response.json({ error: 'API key not configured' }, { status: 500 });
        }

        // Fetch options chain from Polygon.io
        // Using v3 snapshot to get real-time quotes and greeks for the chain
        let url = `https://api.polygon.io/v3/snapshot/options/${ticker}?apiKey=${apiKey}&limit=250`;
        
        if (expiration) {
            url += `&expiration_date=${expiration}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            const error = await response.text();
            return Response.json({ error: `Polygon API error: ${error}` }, { status: response.status });
        }

        const data = await response.json();

        return Response.json(data);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});