import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Radar, Play, Filter, Save, FolderOpen, Bell, BellOff, Download } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function MarketScanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [user, setUser] = useState(null);
  const [saveScanName, setSaveScanName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [selectedScanId, setSelectedScanId] = useState(null);
  
  const queryClient = useQueryClient();
  
  const [filters, setFilters] = useState({
    iv_rank_min: 50,
    iv_rank_max: 100,
    dte_min: 0,
    dte_max: 30,
    sector: 'all',
    min_volume: 100000,
    price_min: 10,
    price_max: 1000,
    market_cap: 'all'
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to load user');
      }
    };
    loadUser();
  }, []);

  const { data: savedScans } = useQuery({
    queryKey: ['savedScans', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await base44.entities.SavedScan.filter({ user_email: user.email }, '-created_date');
    },
    enabled: !!user?.email,
    initialData: []
  });

  const saveScanMutation = useMutation({
    mutationFn: async (scanData) => base44.entities.SavedScan.create(scanData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedScans'] });
      setShowSaveDialog(false);
      setSaveScanName('');
    }
  });

  const updateScanMutation = useMutation({
    mutationFn: async ({ id, data }) => base44.entities.SavedScan.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedScans'] });
    }
  });

  const deleteScanMutation = useMutation({
    mutationFn: async (id) => base44.entities.SavedScan.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedScans'] });
    }
  });

  const handleSaveScan = async () => {
    if (!saveScanName.trim() || !user?.email) return;
    
    await saveScanMutation.mutateAsync({
      user_email: user.email,
      scan_name: saveScanName,
      criteria: filters,
      alert_enabled: false
    });
  };

  const handleLoadScan = (scan) => {
    setFilters(scan.criteria);
    setSelectedScanId(scan.id);
    setShowLoadDialog(false);
  };

  const handleToggleAlert = async (scan) => {
    await updateScanMutation.mutateAsync({
      id: scan.id,
      data: { alert_enabled: !scan.alert_enabled }
    });
  };

  const handleExportCSV = () => {
    if (!results || !results.tickers) return;

    const headers = ['Ticker', 'Company', 'Stock Price', 'Sector', 'IV Rank', 'IV Percentile', 'Best DTE', 'Strategy', 'Expected Credit', 'Edge Score', 'Reasoning'];
    const rows = results.tickers.map(t => [
      t.ticker,
      t.company_name,
      t.stock_price,
      t.sector,
      t.iv_rank,
      t.iv_percentile,
      t.best_dte,
      t.suggested_strategy,
      t.expected_credit,
      t.edge_score,
      t.reasoning
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `market-scan-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleScan = async () => {
    setScanning(true);
    
    if (selectedScanId) {
      await updateScanMutation.mutateAsync({
        id: selectedScanId,
        data: { last_run: new Date().toISOString() }
      });
    }
    
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Scan the current market for stocks/tickers that meet these criteria:
        
CRITERIA:
- IV Rank: ${filters.iv_rank_min}% - ${filters.iv_rank_max}%
- Days to Expiration (DTE): ${filters.dte_min} - ${filters.dte_max} days
- Sector: ${filters.sector === 'all' ? 'Any sector' : filters.sector}
- Minimum Daily Volume: ${filters.min_volume.toLocaleString()} shares
- Stock Price Range: $${filters.price_min} - $${filters.price_max}
- Market Cap: ${filters.market_cap === 'all' ? 'Any' : filters.market_cap}

Return 15-20 tickers that currently meet these criteria with detailed options data.
For each ticker provide:
1. Ticker symbol and company name
2. Current stock price
3. Sector
4. Current IV rank and IV percentile
5. Best DTE for premium selling based on criteria
6. Suggested strategy (short strangle, iron condor, etc.)
7. Expected credit per contract
8. Brief reasoning why this ticker qualifies

Focus on liquid options with high premiums suitable for premium selling strategies.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            scan_timestamp: { type: "string" },
            total_matches: { type: "number" },
            tickers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  ticker: { type: "string" },
                  company_name: { type: "string" },
                  stock_price: { type: "number" },
                  sector: { type: "string" },
                  iv_rank: { type: "number" },
                  iv_percentile: { type: "number" },
                  best_dte: { type: "number" },
                  suggested_strategy: { type: "string" },
                  expected_credit: { type: "number" },
                  edge_score: { type: "number" },
                  reasoning: { type: "string" }
                }
              }
            }
          }
        }
      });
      setResults(response);
    } catch (error) {
      console.error('Market scan failed:', error);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="mb-8">
      <Card className="bg-white/5 border-2 border-gray-800 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-[#dc2626]/20 to-[#dc2626]/20 p-6 cursor-pointer hover:from-[#dc2626]/30 hover:to-[#dc2626]/30 transition-all"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#dc2626] flex items-center justify-center">
                <Radar className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Market Scanner</h3>
                <p className="text-sm text-gray-400">Find premium selling opportunities in real-time</p>
              </div>
            </div>
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              variant="ghost"
              className="text-[#dc2626] hover:text-[#dc2626]/80"
            >
              {isOpen ? 'Close' : 'Open Scanner'}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="p-6 space-y-6">
            {/* Filters */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-[#dc2626]" />
                <h4 className="font-semibold">Scan Criteria</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* IV Rank Range */}
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">IV Rank Min (%)</label>
                  <Input
                    type="number"
                    value={filters.iv_rank_min}
                    onChange={(e) => setFilters({...filters, iv_rank_min: parseInt(e.target.value)})}
                    className="bg-white/5 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">IV Rank Max (%)</label>
                  <Input
                    type="number"
                    value={filters.iv_rank_max}
                    onChange={(e) => setFilters({...filters, iv_rank_max: parseInt(e.target.value)})}
                    className="bg-white/5 border-gray-700 text-white"
                  />
                </div>

                {/* DTE Range */}
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Min DTE</label>
                  <Input
                    type="number"
                    value={filters.dte_min}
                    onChange={(e) => setFilters({...filters, dte_min: parseInt(e.target.value)})}
                    className="bg-white/5 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Max DTE</label>
                  <Input
                    type="number"
                    value={filters.dte_max}
                    onChange={(e) => setFilters({...filters, dte_max: parseInt(e.target.value)})}
                    className="bg-white/5 border-gray-700 text-white"
                  />
                </div>

                {/* Sector */}
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Sector</label>
                  <Select value={filters.sector} onValueChange={(value) => setFilters({...filters, sector: value})}>
                    <SelectTrigger className="bg-white/5 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sectors</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="financials">Financials</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="energy">Energy</SelectItem>
                      <SelectItem value="consumer">Consumer</SelectItem>
                      <SelectItem value="industrials">Industrials</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Volume */}
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Min Daily Volume</label>
                  <Input
                    type="number"
                    value={filters.min_volume}
                    onChange={(e) => setFilters({...filters, min_volume: parseInt(e.target.value)})}
                    className="bg-white/5 border-gray-700 text-white"
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Min Stock Price ($)</label>
                  <Input
                    type="number"
                    value={filters.price_min}
                    onChange={(e) => setFilters({...filters, price_min: parseInt(e.target.value)})}
                    className="bg-white/5 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Max Stock Price ($)</label>
                  <Input
                    type="number"
                    value={filters.price_max}
                    onChange={(e) => setFilters({...filters, price_max: parseInt(e.target.value)})}
                    className="bg-white/5 border-gray-700 text-white"
                  />
                </div>

                {/* Market Cap */}
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Market Cap</label>
                  <Select value={filters.market_cap} onValueChange={(value) => setFilters({...filters, market_cap: value})}>
                    <SelectTrigger className="bg-white/5 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="mega">Mega Cap (&gt;$200B)</SelectItem>
                      <SelectItem value="large">Large Cap ($10B-$200B)</SelectItem>
                      <SelectItem value="mid">Mid Cap ($2B-$10B)</SelectItem>
                      <SelectItem value="small">Small Cap (&lt;$2B)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowSaveDialog(true)}
                  variant="outline"
                  className="border-gray-700 text-white hover:bg-white/10"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Scan
                </Button>
                <Button
                  onClick={() => setShowLoadDialog(true)}
                  variant="outline"
                  className="border-gray-700 text-white hover:bg-white/10"
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Load Scan
                </Button>
                <Button
                  onClick={handleScan}
                  disabled={scanning}
                  className="flex-1 bg-[#dc2626] text-black hover:bg-[#dc2626]/90 font-semibold py-6"
                >
                  {scanning ? (
                    <>
                      <Radar className="w-5 h-5 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Run Scan
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Save Scan Dialog */}
            {showSaveDialog && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                <Card className="bg-[#0a0a0a] border-gray-800 p-6 max-w-md w-full">
                  <h3 className="text-lg font-bold mb-4">Save Scan</h3>
                  <Input
                    placeholder="Enter scan name..."
                    value={saveScanName}
                    onChange={(e) => setSaveScanName(e.target.value)}
                    className="bg-white/5 border-gray-700 text-white mb-4"
                  />
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setShowSaveDialog(false)}
                      variant="outline"
                      className="flex-1 border-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveScan}
                      disabled={!saveScanName.trim()}
                      className="flex-1 bg-[#dc2626] text-black hover:bg-[#dc2626]/90"
                    >
                      Save
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* Load Scan Dialog */}
            {showLoadDialog && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                <Card className="bg-[#0a0a0a] border-gray-800 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Saved Scans</h3>
                    <Button
                      onClick={() => setShowLoadDialog(false)}
                      variant="ghost"
                      size="icon"
                    >
                      ×
                    </Button>
                  </div>
                  
                  {savedScans.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No saved scans yet</p>
                  ) : (
                    <div className="space-y-3">
                      {savedScans.map((scan) => (
                        <Card key={scan.id} className="bg-white/5 border-gray-800 p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{scan.scan_name}</h4>
                              <div className="text-xs text-gray-400 space-y-1">
                                <div>IV: {scan.criteria.iv_rank_min}-{scan.criteria.iv_rank_max}% | DTE: {scan.criteria.dte_min}-{scan.criteria.dte_max}</div>
                                <div>Sector: {scan.criteria.sector} | Volume: {scan.criteria.min_volume?.toLocaleString()}</div>
                                {scan.last_run && (
                                  <div>Last run: {new Date(scan.last_run).toLocaleString()}</div>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleToggleAlert(scan)}
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-[#dc2626]"
                              >
                                {scan.alert_enabled ? (
                                  <Bell className="w-4 h-4 text-[#dc2626]" />
                                ) : (
                                  <BellOff className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleLoadScan(scan)}
                              className="flex-1 bg-[#dc2626] text-black hover:bg-[#dc2626]/90"
                              size="sm"
                            >
                              Load Scan
                            </Button>
                            <Button
                              onClick={() => deleteScanMutation.mutate(scan.id)}
                              variant="outline"
                              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                              size="sm"
                            >
                              Delete
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* Results */}
            {results && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pt-6 border-t border-gray-800">
                  <h4 className="font-semibold">Scan Results</h4>
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={handleExportCSV}
                      variant="outline"
                      className="border-gray-700 text-white hover:bg-white/10"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                    <Badge className="bg-[#dc2626] text-black">
                      {results.total_matches} Matches Found
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-3">
                  {results.tickers.map((ticker, index) => (
                    <Card key={index} className="bg-black/30 border-2 border-gray-800 p-4 hover:border-[#dc2626] transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-[#dc2626] text-white font-mono font-bold text-lg px-3 py-1">
                            {ticker.ticker}
                          </Badge>
                          <div>
                            <div className="font-semibold">{ticker.company_name}</div>
                            <div className="text-xs text-gray-500">{ticker.sector}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#dc2626]">{ticker.edge_score}</div>
                          <div className="text-xs text-gray-400">Edge Score</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        <div className="bg-white/5 rounded-lg p-2">
                          <div className="text-xs text-gray-400">Stock Price</div>
                          <div className="font-semibold">${ticker.stock_price}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2">
                          <div className="text-xs text-gray-400">IV Rank</div>
                          <div className="font-semibold text-[#dc2626]">{ticker.iv_rank}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2">
                          <div className="text-xs text-gray-400">Best DTE</div>
                          <div className="font-semibold">{ticker.best_dte}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2">
                          <div className="text-xs text-gray-400">Expected Credit</div>
                          <div className="font-semibold text-green-400">${ticker.expected_credit}</div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <Badge className="bg-blue-500/20 text-blue-400">
                          {ticker.suggested_strategy}
                        </Badge>
                      </div>

                      <div className="text-sm text-gray-400 italic">
                        "{ticker.reasoning}"
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}