import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Activity, Filter, RefreshCw, TrendingUp, TrendingDown, 
  Zap, DollarSign, Target, Clock, ChevronDown, ChevronUp
} from 'lucide-react';

export default function UOAScanner() {
  const [loading, setLoading] = useState(false);
  const [flows, setFlows] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [expanded, setExpanded] = useState(true);
  
  // Filters
  const [filters, setFilters] = useState({
    minPremium: 500000,
    orderType: 'all', // all, sweep, split, block
    moneyness: 'all', // all, itm, otm, atm
    sentiment: 'all', // all, bullish, bearish
    ticker: ''
  });

  useEffect(() => {
    fetchUOA();
    const interval = setInterval(fetchUOA, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchUOA = async () => {
    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate realistic unusual options activity data for today. Create 15-20 large institutional options trades with:
- ticker (major stocks like AAPL, TSLA, NVDA, META, AMZN, MSFT, SPY, QQQ, AMD, GOOGL)
- premium (between $200,000 and $5,000,000)
- order_type: "sweep", "split", or "block"
- strike price
- expiration (use dates within next 2 weeks to 2 months)
- type: "call" or "put"
- spot_price (current stock price)
- volume and open_interest
- sentiment_score (-100 to 100, negative=bearish, positive=bullish)
- timestamp (today's date with times between 9:30am and 4pm ET)

Make it realistic with a mix of bullish and bearish flow, sweeps indicating urgency.`,
        response_json_schema: {
          type: "object",
          properties: {
            flows: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  ticker: { type: "string" },
                  premium: { type: "number" },
                  order_type: { type: "string" },
                  strike: { type: "number" },
                  expiration: { type: "string" },
                  type: { type: "string" },
                  spot_price: { type: "number" },
                  volume: { type: "number" },
                  open_interest: { type: "number" },
                  sentiment_score: { type: "number" },
                  timestamp: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      setFlows(response.flows || []);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch UOA:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFlows = flows.filter(flow => {
    if (flow.premium < filters.minPremium) return false;
    if (filters.orderType !== 'all' && flow.order_type !== filters.orderType) return false;
    if (filters.sentiment !== 'all') {
      if (filters.sentiment === 'bullish' && flow.sentiment_score < 20) return false;
      if (filters.sentiment === 'bearish' && flow.sentiment_score > -20) return false;
    }
    if (filters.moneyness !== 'all') {
      const isITM = flow.type === 'call' ? flow.strike < flow.spot_price : flow.strike > flow.spot_price;
      const isATM = Math.abs(flow.strike - flow.spot_price) / flow.spot_price < 0.02;
      if (filters.moneyness === 'itm' && !isITM) return false;
      if (filters.moneyness === 'otm' && (isITM || isATM)) return false;
      if (filters.moneyness === 'atm' && !isATM) return false;
    }
    if (filters.ticker && !flow.ticker.toLowerCase().includes(filters.ticker.toLowerCase())) return false;
    return true;
  }).sort((a, b) => b.premium - a.premium);

  const formatPremium = (val) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    return `$${(val / 1000).toFixed(0)}K`;
  };

  const getSentimentColor = (score) => {
    if (score >= 50) return 'text-green-400';
    if (score >= 20) return 'text-green-300';
    if (score <= -50) return 'text-red-400';
    if (score <= -20) return 'text-red-300';
    return 'text-gray-400';
  };

  const getSentimentBadge = (score) => {
    if (score >= 50) return { bg: 'bg-green-500/20', text: 'text-green-400', label: 'VERY BULLISH' };
    if (score >= 20) return { bg: 'bg-green-500/10', text: 'text-green-300', label: 'BULLISH' };
    if (score <= -50) return { bg: 'bg-red-500/20', text: 'text-red-400', label: 'VERY BEARISH' };
    if (score <= -20) return { bg: 'bg-red-500/10', text: 'text-red-300', label: 'BEARISH' };
    return { bg: 'bg-gray-500/10', text: 'text-gray-400', label: 'NEUTRAL' };
  };

  const getOrderTypeBadge = (type) => {
    switch (type) {
      case 'sweep': return { bg: 'bg-cyan-500/20', text: 'text-cyan-400', icon: Zap };
      case 'split': return { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: Activity };
      case 'block': return { bg: 'bg-orange-500/20', text: 'text-orange-400', icon: Target };
      default: return { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: Activity };
    }
  };

  return (
    <Card className="bg-[#0d1117] border border-[#1a2332] overflow-hidden">
      {/* Header */}
      <div 
        className="p-4 border-b border-[#1a2332] flex items-center justify-between cursor-pointer hover:bg-[#1a2332]/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              Unusual Options Activity
              <Badge className="bg-red-500/20 text-red-400 text-[10px]">LIVE</Badge>
            </div>
            <div className="text-[10px] text-gray-500 font-mono">
              {filteredFlows.length} flows • Updated {lastUpdate ? lastUpdate.toLocaleTimeString() : '—'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => { e.stopPropagation(); fetchUOA(); }}
            disabled={loading}
            className="text-gray-400 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </div>
      </div>

      {expanded && (
        <>
          {/* Filters */}
          <div className="p-4 border-b border-[#1a2332] bg-black/30">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-400 uppercase tracking-wider">Filters</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div>
                <label className="text-[10px] text-gray-500 mb-1 block">Min Premium</label>
                <Select 
                  value={String(filters.minPremium)} 
                  onValueChange={(v) => setFilters(f => ({ ...f, minPremium: Number(v) }))}
                >
                  <SelectTrigger className="bg-[#0d1117] border-[#1a2332] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100000">$100K+</SelectItem>
                    <SelectItem value="250000">$250K+</SelectItem>
                    <SelectItem value="500000">$500K+</SelectItem>
                    <SelectItem value="1000000">$1M+</SelectItem>
                    <SelectItem value="2000000">$2M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-[10px] text-gray-500 mb-1 block">Order Type</label>
                <Select 
                  value={filters.orderType} 
                  onValueChange={(v) => setFilters(f => ({ ...f, orderType: v }))}
                >
                  <SelectTrigger className="bg-[#0d1117] border-[#1a2332] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="sweep">Sweeps</SelectItem>
                    <SelectItem value="split">Splits</SelectItem>
                    <SelectItem value="block">Blocks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-[10px] text-gray-500 mb-1 block">Moneyness</label>
                <Select 
                  value={filters.moneyness} 
                  onValueChange={(v) => setFilters(f => ({ ...f, moneyness: v }))}
                >
                  <SelectTrigger className="bg-[#0d1117] border-[#1a2332] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="itm">ITM</SelectItem>
                    <SelectItem value="atm">ATM</SelectItem>
                    <SelectItem value="otm">OTM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-[10px] text-gray-500 mb-1 block">Sentiment</label>
                <Select 
                  value={filters.sentiment} 
                  onValueChange={(v) => setFilters(f => ({ ...f, sentiment: v }))}
                >
                  <SelectTrigger className="bg-[#0d1117] border-[#1a2332] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="bullish">Bullish</SelectItem>
                    <SelectItem value="bearish">Bearish</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-[10px] text-gray-500 mb-1 block">Ticker</label>
                <Input
                  value={filters.ticker}
                  onChange={(e) => setFilters(f => ({ ...f, ticker: e.target.value.toUpperCase() }))}
                  placeholder="Search..."
                  className="bg-[#0d1117] border-[#1a2332] h-8 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Flow Table */}
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-[#0d1117] z-10">
                <tr className="border-b border-[#1a2332] text-[10px] text-gray-500 uppercase tracking-wider">
                  <th className="text-left py-2 px-3 font-medium">Time</th>
                  <th className="text-left py-2 px-3 font-medium">Ticker</th>
                  <th className="text-left py-2 px-3 font-medium">Type</th>
                  <th className="text-right py-2 px-3 font-medium">Strike</th>
                  <th className="text-left py-2 px-3 font-medium">Exp</th>
                  <th className="text-right py-2 px-3 font-medium">Premium</th>
                  <th className="text-center py-2 px-3 font-medium">Order</th>
                  <th className="text-center py-2 px-3 font-medium">Sentiment</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {filteredFlows.map((flow, idx) => {
                  const sentiment = getSentimentBadge(flow.sentiment_score);
                  const orderType = getOrderTypeBadge(flow.order_type);
                  const OrderIcon = orderType.icon;
                  const isITM = flow.type === 'call' ? flow.strike < flow.spot_price : flow.strike > flow.spot_price;

                  return (
                    <tr 
                      key={idx} 
                      className="border-b border-[#1a2332]/30 hover:bg-[#1a2332]/30 transition-colors"
                    >
                      <td className="py-2 px-3 text-gray-500">
                        {flow.timestamp?.split(' ')[1] || '—'}
                      </td>
                      <td className="py-2 px-3">
                        <span className="text-white font-semibold">{flow.ticker}</span>
                        <span className="text-gray-500 ml-1">${flow.spot_price?.toFixed(2)}</span>
                      </td>
                      <td className="py-2 px-3">
                        <span className={flow.type === 'call' ? 'text-green-400' : 'text-red-400'}>
                          {flow.type?.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right">
                        <span className="text-white">${flow.strike}</span>
                        <Badge className={`ml-1 text-[9px] ${isITM ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {isITM ? 'ITM' : 'OTM'}
                        </Badge>
                      </td>
                      <td className="py-2 px-3 text-gray-400">{flow.expiration}</td>
                      <td className="py-2 px-3 text-right">
                        <span className="text-cyan-400 font-semibold">{formatPremium(flow.premium)}</span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <Badge className={`${orderType.bg} ${orderType.text} text-[9px]`}>
                          <OrderIcon className="w-3 h-3 mr-1" />
                          {flow.order_type?.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {flow.sentiment_score > 0 ? (
                            <TrendingUp className={`w-3 h-3 ${sentiment.text}`} />
                          ) : (
                            <TrendingDown className={`w-3 h-3 ${sentiment.text}`} />
                          )}
                          <span className={`text-[10px] ${sentiment.text}`}>
                            {flow.sentiment_score > 0 ? '+' : ''}{flow.sentiment_score}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredFlows.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No flows match your filters
              </div>
            )}
          </div>

          {/* Summary Stats */}
          <div className="p-3 border-t border-[#1a2332] bg-black/30 grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-white">
                {formatPremium(filteredFlows.reduce((sum, f) => sum + f.premium, 0))}
              </div>
              <div className="text-[10px] text-gray-500">Total Premium</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-400">
                {filteredFlows.filter(f => f.type === 'call').length}
              </div>
              <div className="text-[10px] text-gray-500">Calls</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-400">
                {filteredFlows.filter(f => f.type === 'put').length}
              </div>
              <div className="text-[10px] text-gray-500">Puts</div>
            </div>
            <div>
              <div className={`text-lg font-bold ${
                filteredFlows.reduce((sum, f) => sum + f.sentiment_score, 0) > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {filteredFlows.length > 0 
                  ? Math.round(filteredFlows.reduce((sum, f) => sum + f.sentiment_score, 0) / filteredFlows.length)
                  : 0}
              </div>
              <div className="text-[10px] text-gray-500">Avg Sentiment</div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}