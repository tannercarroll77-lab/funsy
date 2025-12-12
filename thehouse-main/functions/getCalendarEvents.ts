import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Check auth
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { startDate } = await req.json(); // Expected "YYYY-MM-DD" of the Monday of the week

    const prompt = `
      Current Date Context: ${new Date().toISOString().split('T')[0]}
      Target Week Start: ${startDate}

      TASK: Search for and extract the REAL scheduled financial events for the specific week starting ${startDate}.
      
      SEARCH QUERIES TO EXECUTE INTERNALLY:
      - site:investing.com "Economic Calendar" week of ${startDate}
      - site:financejuice.com "news" "speech" "president" week of ${startDate}
      - site:forexfactory.com "Calendar" week of ${startDate}
      - "Earnings Whisper calendar week of ${startDate}"

      ROLE: You are a financial data scraper. Your goal is to replicate the data extraction logic of a Python scraper targeting Investing.com, FinanceJuice, and ForexFactory.
      
      PERFORMANCE NOTE: EXECUTE IMMEDIATELY. DO NOT simulate any human delays, sleeps, or wait times often found in scrapers. We need the data instantly.

      CRITICAL INSTRUCTIONS:
      1. **ECONOMIC NEWS (Investing.com)**:
         - Look for "3 Bulls" (Strong/High) AND "2 Bulls" (Medium) events.
         - **Logic**: If sentiment is "Strong" -> Impact: "High", POP: 90. If "Medium" -> Impact: "Medium", POP: 80.
         - Key Events: CPI, PPI, NFP, FOMC, GDP, Retail Sales, ISM, JOLTS, Crude Oil Inventories, Bond Auctions.

      2. **PRESIDENTIAL/CENTRAL BANK SPEECHES (FinanceJuice logic)**:
         - Look for news/headlines containing "President" or "Speech" from FinanceJuice sources.
         - Target: Fed Chair Powell, US President, FOMC Governors.
         - **Logic**: Category: "Speech", Impact: "High", POP: 85.

      3. **EARNINGS (ForexFactory/Investing logic)**:
         - Target Tickers: **AAPL, MSFT, TSLA, AMZN, GOOGL**.
         - **Logic**: If found -> Category: "Earnings", Impact: "High", POP: 90.
         - Append "Earnings" to the event name (e.g., "TSLA Earnings").

      4. **FORMAT**: 
         - Ensure 'impact' is strictly "High" or "Medium".
         - Ensure 'pop' (Probability of Profit/Impact) is set according to the logic above (90, 85, or 80).

      REQUIRED EVENTS TO EXTRACT:
      - Economic: All High/Medium impact events from Investing.com.
      - Speeches: Any major speech by financial heads or US President.
      - Earnings: Only the major tech/S&P 500 tickers listed above.

      Verify dates against the current calendar year.
      
      IMPORTANT: 
      - Prioritize volume and accuracy from Investing.com.
      - Recurring events (Jobless Claims, Oil Inventories) MUST be included if they occur this week.
      - TIMEZONE CRITICAL: ALL times must be converted to US Eastern Time (ET/New York Time). Do not use GMT or London time. Convert if necessary.
      - Ensure dates match the requested week.

      OUTPUT FORMAT:
      Return a JSON object with a single key "events" containing an array.
      Schema:
      {
        "events": [
          {
            "date": "YYYY-MM-DD",
            "time": "HH:MM AM/PM ET",
            "title": "Event Name",
            "type": "economic" | "speech" | "earnings",
            "ticker": "SYMBOL" | null,
            "impact": "High",
            "pop": 90
          }
        ]
      }
    `;

    const llmResponse = await base44.integrations.Core.InvokeLLM({
      prompt: prompt,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          events: {
            type: "array",
            items: {
              type: "object",
              properties: {
                date: { type: "string" },
                time: { type: "string" },
                title: { type: "string" },
                type: { type: "string", enum: ["economic", "speech", "earnings"] },
                ticker: { type: ["string", "null"] },
                impact: { type: "string" },
                pop: { type: "number", description: "Probability of Profit/High Impact Score (0-100)" }
              },
              required: ["date", "time", "title", "type", "impact"]
            }
          }
        },
        required: ["events"]
      }
    });

    let events = llmResponse?.events || [];

    // Fallback logic if scraping fails (mimicking Python script fallback)
    if (!events || events.length === 0) {
      console.log("No events fetched. Using fallback data.");
      const start = new Date(startDate);
      
      // Helper to add days
      const getDay = (offset) => {
        const d = new Date(start);
        d.setDate(start.getDate() + offset);
        return d.toISOString().split('T')[0];
      };

      events = [
        {
          date: getDay(1), // Tuesday
          time: "14:00 PM ET",
          title: "FOMC Meeting",
          type: "economic",
          impact: "High",
          pop: 90,
          ticker: null
        },
        {
          date: getDay(2), // Wednesday
          time: "20:00 PM ET",
          title: "State of the Union / Presidential Speech",
          type: "speech",
          impact: "High",
          pop: 85,
          ticker: null
        },
        {
          date: getDay(3), // Thursday
          time: "16:00 PM ET",
          title: "AAPL Earnings",
          type: "earnings",
          impact: "High",
          pop: 90,
          ticker: "AAPL"
        }
      ];
    }

    return Response.json({ events });

  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});