import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// Usage-based billing meter for future pay-per-signal tier
const usageCache = new Map();
const CACHE_TTL = 60000; // 1 minute

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const method = req.method;
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    // GET - retrieve usage
    if (method === 'GET') {
      const now = Date.now();
      const cacheKey = `usage_${user.id}`;
      const cached = usageCache.get(cacheKey);
      
      if (cached && (now - cached.timestamp) < CACHE_TTL) {
        return Response.json(cached.data);
      }

      // Get current billing period (monthly)
      const periodStart = new Date();
      periodStart.setDate(1);
      periodStart.setHours(0, 0, 0, 0);

      const usageRecords = await base44.asServiceRole.entities.UsageRecord.filter({
        user_email: user.email,
        period_start: { $gte: periodStart.toISOString() }
      });

      const usage = {
        period_start: periodStart.toISOString(),
        period_end: new Date(periodStart.getFullYear(), periodStart.getMonth() + 1, 0).toISOString(),
        api_calls: usageRecords.reduce((sum, r) => sum + (r.api_calls || 0), 0),
        signals_viewed: usageRecords.reduce((sum, r) => sum + (r.signals_viewed || 0), 0),
        scans_run: usageRecords.reduce((sum, r) => sum + (r.scans_run || 0), 0),
        prophet_queries: usageRecords.reduce((sum, r) => sum + (r.prophet_queries || 0), 0),
        exports: usageRecords.reduce((sum, r) => sum + (r.exports || 0), 0),
        limits: {
          api_calls: user.plan_type === 'whale' ? -1 : 10000,
          signals_viewed: user.plan_type === 'whale' ? -1 : 500,
          scans_run: user.plan_type === 'whale' ? -1 : 100,
          prophet_queries: user.plan_type === 'pro' || user.plan_type === 'whale' ? -1 : 0
        }
      };

      usageCache.set(cacheKey, { data: usage, timestamp: now });
      return Response.json(usage);
    }

    // POST - record usage event
    if (method === 'POST') {
      const { event_type, count = 1, metadata } = await req.json();

      const validEvents = ['api_call', 'signal_view', 'scan_run', 'prophet_query', 'export'];
      if (!validEvents.includes(event_type)) {
        return Response.json({ error: 'Invalid event type' }, { status: 400 });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Find or create today's record
      const existing = await base44.asServiceRole.entities.UsageRecord.filter({
        user_email: user.email,
        date: today.toISOString().split('T')[0]
      });

      const fieldMap = {
        api_call: 'api_calls',
        signal_view: 'signals_viewed',
        scan_run: 'scans_run',
        prophet_query: 'prophet_queries',
        export: 'exports'
      };

      if (existing.length > 0) {
        const record = existing[0];
        const field = fieldMap[event_type];
        await base44.asServiceRole.entities.UsageRecord.update(record.id, {
          [field]: (record[field] || 0) + count
        });
      } else {
        await base44.asServiceRole.entities.UsageRecord.create({
          user_email: user.email,
          user_id: user.id,
          date: today.toISOString().split('T')[0],
          period_start: new Date(today.getFullYear(), today.getMonth(), 1).toISOString(),
          [fieldMap[event_type]]: count
        });
      }

      // Invalidate cache
      usageCache.delete(`usage_${user.id}`);

      return Response.json({ recorded: true, event_type, count });
    }

    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  } catch (error) {
    console.error('Usage meter error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});