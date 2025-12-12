import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// In-memory buffer for batch writes (reduces DB load)
const logBuffer = [];
const BUFFER_FLUSH_SIZE = 50;
const BUFFER_FLUSH_INTERVAL = 10000;

let flushTimeout = null;

async function flushBuffer(base44) {
  if (logBuffer.length === 0) return;
  
  const logsToWrite = logBuffer.splice(0, logBuffer.length);
  try {
    await base44.asServiceRole.entities.AuditLog.bulkCreate(logsToWrite);
  } catch (e) {
    console.error('Audit log flush failed:', e);
    // Re-add failed logs (with limit to prevent memory leak)
    if (logBuffer.length < 500) {
      logBuffer.push(...logsToWrite);
    }
  }
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, resource_type, resource_id, metadata } = await req.json();

    const logEntry = {
      user_email: user.email,
      user_id: user.id,
      action,
      resource_type,
      resource_id,
      metadata: JSON.stringify(metadata || {}),
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown',
      user_agent: req.headers.get('user-agent'),
      timestamp: new Date().toISOString(),
      session_id: req.headers.get('x-session-id') || crypto.randomUUID()
    };

    logBuffer.push(logEntry);

    // Flush if buffer is full
    if (logBuffer.length >= BUFFER_FLUSH_SIZE) {
      await flushBuffer(base44);
    } else if (!flushTimeout) {
      // Set timeout for periodic flush
      flushTimeout = setTimeout(async () => {
        await flushBuffer(base44);
        flushTimeout = null;
      }, BUFFER_FLUSH_INTERVAL);
    }

    return Response.json({ logged: true, buffer_size: logBuffer.length });
  } catch (error) {
    console.error('Audit log error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});