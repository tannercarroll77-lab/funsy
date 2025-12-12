import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// Feature flag system with caching
const flagCache = new Map();
const CACHE_TTL = 30000; // 30 seconds

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function isUserInRollout(userId, percentage) {
  if (percentage >= 100) return true;
  if (percentage <= 0) return false;
  return (hashString(userId) % 100) < percentage;
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const user = await base44.auth.me();
    const url = new URL(req.url);
    const flagKey = url.searchParams.get('flag');

    // GET single flag or all flags
    if (req.method === 'GET') {
      const now = Date.now();
      const cacheKey = 'all_flags';
      let flags;

      if (flagCache.has(cacheKey) && (now - flagCache.get(cacheKey).timestamp) < CACHE_TTL) {
        flags = flagCache.get(cacheKey).data;
      } else {
        flags = await base44.asServiceRole.entities.FeatureFlag.list();
        flagCache.set(cacheKey, { data: flags, timestamp: now });
      }

      // Filter expired flags
      flags = flags.filter(f => !f.expires_at || new Date(f.expires_at) > new Date());

      // Evaluate flags for current user
      const evaluatedFlags = {};
      for (const flag of flags) {
        let enabled = flag.enabled;

        if (enabled && user) {
          // Check email allowlist
          if (flag.allowed_emails) {
            const allowedEmails = flag.allowed_emails.split(',').map(e => e.trim().toLowerCase());
            if (!allowedEmails.includes(user.email.toLowerCase())) {
              enabled = false;
            }
          }

          // Check plan restriction
          if (enabled && flag.allowed_plans) {
            const allowedPlans = flag.allowed_plans.split(',').map(p => p.trim());
            if (!allowedPlans.includes(user.plan_type || 'free')) {
              enabled = false;
            }
          }

          // Check rollout percentage
          if (enabled && flag.rollout_percentage < 100) {
            enabled = isUserInRollout(user.id, flag.rollout_percentage);
          }
        }

        evaluatedFlags[flag.flag_key] = {
          enabled,
          metadata: flag.metadata ? JSON.parse(flag.metadata) : null
        };
      }

      if (flagKey) {
        return Response.json(evaluatedFlags[flagKey] || { enabled: false });
      }

      return Response.json(evaluatedFlags);
    }

    // POST - create/update flag (admin only)
    if (req.method === 'POST') {
      if (!user || user.role !== 'admin') {
        return Response.json({ error: 'Admin access required' }, { status: 403 });
      }

      const flagData = await req.json();
      
      const existing = await base44.asServiceRole.entities.FeatureFlag.filter({
        flag_key: flagData.flag_key
      });

      if (existing.length > 0) {
        await base44.asServiceRole.entities.FeatureFlag.update(existing[0].id, flagData);
      } else {
        await base44.asServiceRole.entities.FeatureFlag.create(flagData);
      }

      // Invalidate cache
      flagCache.delete('all_flags');

      return Response.json({ success: true });
    }

    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  } catch (error) {
    console.error('Feature flag error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});