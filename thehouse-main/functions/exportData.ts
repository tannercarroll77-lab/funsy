import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// SOC-2 compliant data export endpoint
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can export all data
    const isAdmin = user.role === 'admin';
    
    const url = new URL(req.url);
    const format = url.searchParams.get('format') || 'json';
    const entity = url.searchParams.get('entity');
    const dateFrom = url.searchParams.get('from');
    const dateTo = url.searchParams.get('to');

    if (!entity) {
      return Response.json({ error: 'Entity parameter required' }, { status: 400 });
    }

    const allowedEntities = ['Play', 'DailyBriefing', 'Subscription'];
    if (!allowedEntities.includes(entity) && !isAdmin) {
      return Response.json({ error: 'Access denied to this entity' }, { status: 403 });
    }

    // Build query
    const query = {};
    if (!isAdmin) {
      query.created_by = user.email;
    }

    let data;
    try {
      data = await base44.asServiceRole.entities[entity].filter(query, '-created_date', 1000);
    } catch (e) {
      return Response.json({ error: 'Invalid entity' }, { status: 400 });
    }

    // Date filtering
    if (dateFrom || dateTo) {
      data = data.filter(item => {
        const itemDate = new Date(item.created_date);
        if (dateFrom && itemDate < new Date(dateFrom)) return false;
        if (dateTo && itemDate > new Date(dateTo)) return false;
        return true;
      });
    }

    // Sanitize sensitive fields
    data = data.map(item => {
      const sanitized = { ...item };
      delete sanitized.stripe_customer_id;
      delete sanitized.stripe_subscription_id;
      return sanitized;
    });

    const exportMeta = {
      exported_at: new Date().toISOString(),
      exported_by: user.email,
      entity,
      record_count: data.length,
      format,
      filters: { dateFrom, dateTo }
    };

    if (format === 'csv') {
      if (data.length === 0) {
        return new Response('No data', { 
          status: 200,
          headers: { 'Content-Type': 'text/csv' }
        });
      }

      const headers = Object.keys(data[0]);
      const csvRows = [
        headers.join(','),
        ...data.map(row => 
          headers.map(h => {
            const val = row[h];
            if (val === null || val === undefined) return '';
            if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
            return `"${String(val).replace(/"/g, '""')}"`;
          }).join(',')
        )
      ];

      return new Response(csvRows.join('\n'), {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${entity}_export_${Date.now()}.csv"`,
          'X-Export-Meta': JSON.stringify(exportMeta)
        }
      });
    }

    return Response.json({
      meta: exportMeta,
      data
    }, {
      headers: {
        'Content-Disposition': `attachment; filename="${entity}_export_${Date.now()}.json"`
      }
    });
  } catch (error) {
    console.error('Export error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});