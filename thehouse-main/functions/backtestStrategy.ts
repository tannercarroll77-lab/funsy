import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'admin' && (!user.plan_type || !['pro', 'whale', 'prophet'].includes(user.plan_type))) {
      return Response.json({ error: 'Prophet membership required' }, { status: 403 });
    }

    const { ticker, strategy, startDate, endDate, dte, deltaTarget } = await req.json();

    if (!ticker || !strategy || !startDate || !endDate) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Fetch historical data and run backtest via LLM
    const backtestResults = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a quantitative options backtesting engine. Run a historical backtest for the following parameters:

TICKER: ${ticker.toUpperCase()}
STRATEGY: ${strategy}
DATE RANGE: ${startDate} to ${endDate}
TARGET DTE: ${dte || 30} days
TARGET DELTA: ${deltaTarget || 0.16}

Simulate this options selling strategy over the historical period:
1. Entry: Sell ${strategy} at target delta on each expiration cycle
2. Exit: Hold to expiration or close at 50% profit
3. Management: Roll if tested (price breaks short strike)

Calculate REALISTIC results based on actual historical price movements and typical IV levels for ${ticker}:
- Use real historical price data
- Apply realistic IV crush patterns
- Account for assignment risk
- Include commissions ($0.65/contract)

Return detailed backtest metrics.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          ticker: { type: "string" },
          strategy: { type: "string" },
          period: {
            type: "object",
            properties: {
              start: { type: "string" },
              end: { type: "string" },
              trading_days: { type: "number" }
            }
          },
          summary: {
            type: "object",
            properties: {
              total_trades: { type: "number" },
              winning_trades: { type: "number" },
              losing_trades: { type: "number" },
              win_rate: { type: "number" },
              total_pnl: { type: "number" },
              avg_win: { type: "number" },
              avg_loss: { type: "number" },
              profit_factor: { type: "number" },
              sharpe_ratio: { type: "number" },
              max_drawdown: { type: "number" },
              max_drawdown_pct: { type: "number" },
              avg_days_in_trade: { type: "number" },
              avg_credit_received: { type: "number" },
              total_commissions: { type: "number" }
            }
          },
          monthly_returns: {
            type: "array",
            items: {
              type: "object",
              properties: {
                month: { type: "string" },
                pnl: { type: "number" },
                trades: { type: "number" },
                win_rate: { type: "number" }
              }
            }
          },
          trades: {
            type: "array",
            items: {
              type: "object",
              properties: {
                entry_date: { type: "string" },
                exit_date: { type: "string" },
                underlying_entry: { type: "number" },
                underlying_exit: { type: "number" },
                credit: { type: "number" },
                pnl: { type: "number" },
                result: { type: "string" },
                exit_reason: { type: "string" }
              }
            }
          },
          risk_metrics: {
            type: "object",
            properties: {
              var_95: { type: "number" },
              expected_shortfall: { type: "number" },
              longest_losing_streak: { type: "number" },
              recovery_factor: { type: "number" },
              calmar_ratio: { type: "number" }
            }
          },
          market_conditions: {
            type: "object",
            properties: {
              avg_vix: { type: "number" },
              max_vix: { type: "number" },
              min_vix: { type: "number" },
              bull_market_win_rate: { type: "number" },
              bear_market_win_rate: { type: "number" },
              high_vol_win_rate: { type: "number" }
            }
          }
        }
      }
    });

    return Response.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...backtestResults
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});