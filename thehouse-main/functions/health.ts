import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

const startTime = Date.now();

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime_ms: Date.now() - startTime,
    version: '2.0.0',
    checks: {}
  };

  const startChecks = Date.now();

  // Database connectivity check
  try {
    const dbStart = Date.now();
    await base44.asServiceRole.entities.FoundingMemberCounter.list('-updated_date', 1);
    checks.checks.database = { status: 'healthy', latency_ms: Date.now() - dbStart };
  } catch (e) {
    checks.checks.database = { status: 'unhealthy', error: e.message };
    checks.status = 'degraded';
  }

  // Memory check
  checks.checks.memory = {
    status: 'healthy',
    heap_used_mb: Math.round((performance?.memory?.usedJSHeapSize || 0) / 1024 / 1024) || 'N/A'
  };

  // External services readiness
  checks.checks.stripe = { status: Deno.env.get('STRIPE_SECRET_KEY') ? 'configured' : 'missing' };
  checks.checks.environment = Deno.env.get('BASE44_APP_ID') ? 'production' : 'development';

  checks.total_check_time_ms = Date.now() - startChecks;

  const httpStatus = checks.status === 'healthy' ? 200 : 503;

  return new Response(JSON.stringify(checks, null, 2), {
    status: httpStatus,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'X-Response-Time': `${checks.total_check_time_ms}ms`
    }
  });
});