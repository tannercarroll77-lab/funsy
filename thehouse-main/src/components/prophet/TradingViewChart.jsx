import React, { useEffect, useRef, memo, useState } from 'react';

function TradingViewChart({ ticker, candles }) {
  const container = useRef();
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const widgetRef = useRef(null);
  
  const [libLoaded, setLibLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Load Lightweight Charts library
  useEffect(() => {
    if (candles && candles.length > 0 && !window.LightweightCharts) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/lightweight-charts@4.1.1/dist/lightweight-charts.standalone.production.js';
      script.async = true;
      script.onload = () => setLibLoaded(true);
      script.onerror = () => setError('Failed to load chart library');
      document.body.appendChild(script);
    } else if (window.LightweightCharts) {
      setLibLoaded(true);
    }
  }, [candles]); // Only try to load if we actually have data

  // Initialize Chart Instance (Custom Chart)
  useEffect(() => {
    // Only initialize if we have candles, lib is loaded, and no error
    if (!container.current || !libLoaded || !window.LightweightCharts || chartRef.current) return;
    if (!candles || candles.length === 0) return; // Don't init custom chart if no data

    try {
        // Clear any existing widget
        container.current.innerHTML = '';
        widgetRef.current = null;

        const { createChart } = window.LightweightCharts;
        const width = container.current.clientWidth || 800;
        const height = container.current.clientHeight || 500;

        const chart = createChart(container.current, {
            width: width,
            height: height,
            layout: {
                background: { color: '#0d1117' },
                textColor: '#c9d1d9',
            },
            grid: {
                vertLines: { color: '#1a2332' },
                horzLines: { color: '#1a2332' },
            },
            timeScale: {
                borderColor: '#1a2332',
                timeVisible: true,
            },
            rightPriceScale: {
                borderColor: '#1a2332',
            },
        });

        const series = chart.addCandlestickSeries({
            upColor: '#3fb950',
            downColor: '#f85149',
            borderVisible: false,
            wickUpColor: '#3fb950',
            wickDownColor: '#f85149',
        });

        chartRef.current = chart;
        seriesRef.current = series;

        const handleResize = () => {
            if (container.current && chart) {
                chart.applyOptions({ width: container.current.clientWidth, height: container.current.clientHeight });
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
                seriesRef.current = null;
            }
        };

    } catch (err) {
        console.error("Chart init error:", err);
        setError(err.message);
    }
  }, [libLoaded, candles]); // Check candles existence to trigger init

  // Update Candles (Custom Chart)
  useEffect(() => {
    if (!chartRef.current || !seriesRef.current || !candles) return;
    
    try {
        const formattedCandles = candles.map(c => ({
            time: c.time < 9999999999 ? c.time : c.time / 1000,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close
        })).sort((a, b) => a.time - b.time);

        if (formattedCandles.length > 0) {
             seriesRef.current.setData(formattedCandles);
             
             if (!chartRef.current._hasFitContent) {
                 chartRef.current.timeScale().fitContent();
                 chartRef.current._hasFitContent = true;
             }
        }
    } catch (err) {
        console.error("Chart candles update error:", err);
    }
  }, [candles]);

  // Fallback Widget Logic - Stabilized
  useEffect(() => {
    // Condition to show widget: No candles OR Error
    const showWidget = (!candles || candles.length === 0) || error;

    if (showWidget) {
       // If we already have the widget and ticker hasn't changed, DO NOTHING.
       if (widgetRef.current && widgetRef.current === ticker) {
           return;
       }

       // Cleanup Custom Chart if exists
       if (chartRef.current) {
           chartRef.current.remove();
           chartRef.current = null;
           seriesRef.current = null;
       }

       // Render Widget
       container.current.innerHTML = '';
       const div = document.createElement("div");
       div.className = "tradingview-widget-container__widget";
       div.style.height = "100%";
       div.style.width = "100%";
       container.current.appendChild(div);

       const script = document.createElement("script");
       script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
       script.type = "text/javascript";
       script.async = true;
       script.innerHTML = JSON.stringify({
        "autosize": true,
        "symbol": ticker,
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "calendar": false,
        "hide_side_toolbar": false,
        "support_host": "https://www.tradingview.com"
       });
       container.current.appendChild(script);
       
       // Mark widget as loaded for this ticker
       widgetRef.current = ticker;
    } else {
        // If we are NOT showing widget (i.e. showing custom chart), clear widget ref
        widgetRef.current = null;
    }
  }, [error, ticker, candles]); // We still depend on candles to switch modes, but inner check prevents reload

  return (
    <div className="tradingview-widget-container h-full w-full min-h-[500px] bg-[#0d1117] border border-[#1a2332] rounded-[2px] overflow-hidden relative" ref={container}>
         {candles && candles.length > 0 && !libLoaded && !error && (
             <div className="absolute inset-0 flex items-center justify-center text-[#8b949e] font-mono text-xs">
                 LOADING CHART ENGINE...
             </div>
         )}
         {error && (
             <div className="hidden absolute top-0 left-0 bg-red-900/20 text-red-500 text-xs p-1">
                 {error}
             </div>
         )}
    </div>
  );
}

export default memo(TradingViewChart);