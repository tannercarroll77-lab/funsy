import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe@14.10.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  maxNetworkRetries: 3
});
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
const discordWebhook = Deno.env.get('DISCORD_WEBHOOK_URL');

// Track processed events to prevent duplicates
const processedEvents = new Map();
const EVENT_TTL = 300000; // 5 minutes

function isEventProcessed(eventId) {
  const now = Date.now();
  
  // Cleanup old entries
  if (processedEvents.size > 500) {
    for (const [id, timestamp] of processedEvents.entries()) {
      if (now - timestamp > EVENT_TTL) {
        processedEvents.delete(id);
      }
    }
  }
  
  if (processedEvents.has(eventId)) {
    return true;
  }
  
  processedEvents.set(eventId, now);
  return false;
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature failed:', err.message);
      return Response.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    // Idempotency check - prevent duplicate processing
    if (isEventProcessed(event.id)) {
      console.log(`Event ${event.id} already processed, skipping`);
      return Response.json({ received: true, duplicate: true });
    }

    console.log(`Processing event: ${event.type} (${event.id})`);

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userEmail = session.customer_email;
      const planType = session.metadata.plan_type;
      const stripeCustomerId = session.customer;
      const subscriptionId = session.subscription;

      if (!userEmail || !planType) {
        console.error('Missing required metadata', { userEmail, planType });
        return Response.json({ error: 'Missing metadata' }, { status: 400 });
      }

      // Get user with retry
      let users;
      for (let attempt = 0; attempt < 3; attempt++) {
        users = await base44.asServiceRole.entities.User.filter({ email: userEmail });
        if (users.length > 0) break;
        await new Promise(r => setTimeout(r, 1000)); // Wait 1s between retries
      }
      
      if (users.length === 0) {
        console.error(`User not found: ${userEmail}`);
        return Response.json({ error: 'User not found' }, { status: 404 });
      }
      const user = users[0];

      // Check if already processed (double-check)
      if (user.stripe_subscription_id === subscriptionId) {
        console.log(`Subscription ${subscriptionId} already assigned to user`);
        return Response.json({ received: true, already_processed: true });
      }

      let updateData = {
        plan_type: planType,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: subscriptionId,
        subscription_status: 'active',
        subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };



      // Update user
      await base44.asServiceRole.entities.User.update(user.id, updateData);
      console.log(`User ${userEmail} updated with plan ${planType}`);

      // Send welcome email (non-blocking)
      base44.asServiceRole.integrations.Core.SendEmail({
        to: userEmail,
        subject: `Welcome to The House - ${planType.replace('_', ' ').toUpperCase()} Member`,
        body: `
          <h2>Welcome to The House</h2>
          <p>Your ${planType.replace('_', ' ').toUpperCase()} membership is now active.</p>
          ${planType === 'prophet_lifetime' ? '<p><strong>You have lifetime access. No monthly fees ever.</strong></p>' : ''}
          <p>Access the platform at: ${req.headers.get('origin') || 'https://thehouse.com'}/ProphetDashboard</p>
          <p>The House Always Wins. 🎰</p>
        `
      }).catch(e => console.error('Email failed:', e));
    }

    // Handle subscription.updated
    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object;
      const users = await base44.asServiceRole.entities.User.filter({ 
        stripe_subscription_id: subscription.id 
      });
      
      if (users.length > 0) {
        await base44.asServiceRole.entities.User.update(users[0].id, {
          subscription_status: subscription.status,
          subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString()
        });
      }
    }

    // Handle payment failure
    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object;
      const users = await base44.asServiceRole.entities.User.filter({ 
        stripe_customer_id: invoice.customer 
      });
      
      if (users.length > 0) {
        await base44.asServiceRole.entities.User.update(users[0].id, {
          subscription_status: 'past_due'
        });
        console.log(`User ${users[0].email} marked as past_due`);
      }
    }

    // Handle subscription cancellation
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      const users = await base44.asServiceRole.entities.User.filter({ 
        stripe_subscription_id: subscription.id 
      });
      
      if (users.length > 0) {
        await base44.asServiceRole.entities.User.update(users[0].id, {
          subscription_status: 'cancelled'
        });
        console.log(`User ${users[0].email} subscription cancelled`);
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});