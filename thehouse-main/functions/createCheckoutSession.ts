import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe@14.10.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  maxNetworkRetries: 3, // Auto-retry on network failures
  timeout: 30000 // 30 second timeout
});

const PRICE_IDS = {

  core: Deno.env.get('STRIPE_PRICE_CORE') || null,
  pro: Deno.env.get('STRIPE_PRICE_PRO') || null,
  prophet_lifetime: Deno.env.get('STRIPE_PRICE_PROPHET_LIFETIME') || null
};

// Rate limiting: track recent requests per user
const recentRequests = new Map();
const RATE_LIMIT_WINDOW = 10000; // 10 seconds
const MAX_REQUESTS_PER_WINDOW = 3;

function checkRateLimit(userId) {
  const now = Date.now();
  const userRequests = recentRequests.get(userId) || [];
  
  // Filter to recent requests only
  const recentOnly = userRequests.filter(t => now - t < RATE_LIMIT_WINDOW);
  
  if (recentOnly.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  recentOnly.push(now);
  recentRequests.set(userId, recentOnly);
  
  // Cleanup old entries periodically
  if (recentRequests.size > 1000) {
    for (const [key, times] of recentRequests.entries()) {
      if (times.every(t => now - t > RATE_LIMIT_WINDOW)) {
        recentRequests.delete(key);
      }
    }
  }
  
  return true;
}



Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit check
    if (!checkRateLimit(user.id)) {
      return Response.json({ 
        error: 'Too many requests. Please wait a moment before trying again.' 
      }, { status: 429 });
    }

    const { plan_type } = await req.json();

    if (!['core', 'pro', 'prophet_lifetime'].includes(plan_type)) {
      return Response.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    if (!PRICE_IDS[plan_type]) {
      return Response.json({ 
        error: 'Stripe pricing not configured.' 
      }, { status: 500 });
    }



    let origin = req.headers.get('origin') || 'https://thehouse.com';
    
    // Enforce HTTPS for production environments to ensure PCI compliance
    if (origin.startsWith('http://') && !origin.includes('localhost')) {
      origin = origin.replace('http://', 'https://');
    }

    // Idempotency key to prevent duplicate charges
    const idempotencyKey = `checkout_${user.id}_${plan_type}_${Math.floor(Date.now() / 60000)}`;

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ['card'],
      billing_address_collection: 'auto', // Enable Address Verification System (AVS) for fraud protection
      line_items: [
        {
          price: PRICE_IDS[plan_type],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/ProphetDashboard?session_id={CHECKOUT_SESSION_ID}&plan=${plan_type}`,
      cancel_url: `${origin}/Home`,
      metadata: {
        plan_type: plan_type,
        user_email: user.email,
        user_id: user.id
      },
      expires_at: Math.floor(Date.now() / 1000) + 1800, // 30 min expiry
    }, {
      idempotencyKey
    });

    return Response.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    
    // Handle specific Stripe errors gracefully
    if (error.type === 'StripeRateLimitError') {
      return Response.json({ 
        error: 'High demand. Please try again in a moment.' 
      }, { status: 503 });
    }
    
    return Response.json({ error: error.message }, { status: 500 });
  }
});