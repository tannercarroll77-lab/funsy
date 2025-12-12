import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// Enterprise webhook dispatcher for Slack/Discord/Teams/Custom
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 5000, 15000];

async function sendWithRetry(url, payload, retries = 0) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok && retries < MAX_RETRIES) {
      await new Promise(r => setTimeout(r, RETRY_DELAYS[retries]));
      return sendWithRetry(url, payload, retries + 1);
    }
    
    return { success: response.ok, status: response.status, retries };
  } catch (e) {
    if (retries < MAX_RETRIES) {
      await new Promise(r => setTimeout(r, RETRY_DELAYS[retries]));
      return sendWithRetry(url, payload, retries + 1);
    }
    return { success: false, error: e.message, retries };
  }
}

function formatForSlack(event, data) {
  return {
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: `🎰 The House: ${event}` }
      },
      {
        type: 'section',
        fields: Object.entries(data).slice(0, 10).map(([k, v]) => ({
          type: 'mrkdwn',
          text: `*${k}:* ${v}`
        }))
      },
      {
        type: 'context',
        elements: [{ type: 'mrkdwn', text: `Sent at ${new Date().toISOString()}` }]
      }
    ]
  };
}

function formatForDiscord(event, data) {
  return {
    embeds: [{
      title: `🎰 ${event}`,
      color: 0xdc2626,
      fields: Object.entries(data).slice(0, 25).map(([k, v]) => ({
        name: k,
        value: String(v).slice(0, 1024),
        inline: true
      })),
      timestamp: new Date().toISOString()
    }]
  };
}

function formatForTeams(event, data) {
  return {
    '@type': 'MessageCard',
    '@context': 'http://schema.org/extensions',
    themeColor: 'dc2626',
    summary: `The House: ${event}`,
    sections: [{
      activityTitle: `🎰 ${event}`,
      facts: Object.entries(data).slice(0, 10).map(([k, v]) => ({
        name: k,
        value: String(v)
      })),
      markdown: true
    }]
  };
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { event, data, webhook_url, platform } = await req.json();

    if (!event || !data || !webhook_url) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let payload;
    switch (platform) {
      case 'slack':
        payload = formatForSlack(event, data);
        break;
      case 'discord':
        payload = formatForDiscord(event, data);
        break;
      case 'teams':
        payload = formatForTeams(event, data);
        break;
      default:
        payload = { event, data, timestamp: new Date().toISOString() };
    }

    const result = await sendWithRetry(webhook_url, payload);

    return Response.json({
      dispatched: true,
      ...result
    });
  } catch (error) {
    console.error('Webhook dispatch error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});