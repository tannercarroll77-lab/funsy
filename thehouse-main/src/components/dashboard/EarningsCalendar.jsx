import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp } from 'lucide-react';

export default function EarningsCalendar() {
  // Mock earnings data - in production this would come from API
  const upcomingEarnings = [
    { ticker: 'TSLA', date: 'Wed, Oct 23', time: 'AMC', ivRank: 92, expected: '$12.40' },
    { ticker: 'NFLX', date: 'Thu, Oct 24', time: 'AMC', ivRank: 88, expected: '$8.90' },
    { ticker: 'NVDA', date: 'Thu, Oct 24', time: 'AMC', ivRank: 95, expected: '$15.20' },
    { ticker: 'META', date: 'Fri, Oct 25', time: 'AMC', ivRank: 86, expected: '$7.80' }
  ];

  return (
    <Card className="bg-white/5 border-2 border-gray-800 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-[#dc2626]" />
        <h3 className="text-lg font-bold">Earnings This Week</h3>
      </div>

      <div className="space-y-3">
        {upcomingEarnings.map((earning, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-3 bg-black/30 border-2 border-gray-800 hover:border-[#dc2626] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Badge className="bg-[#dc2626] text-white font-mono font-bold">
                {earning.ticker}
              </Badge>
              <div>
                <div className="text-sm font-semibold">{earning.date}</div>
                <div className="text-xs text-gray-500">{earning.time}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-xs text-[#dc2626] mb-1">
                <TrendingUp className="w-3 h-3" />
                IV: {earning.ivRank}
              </div>
              <div className="text-xs text-gray-400">{earning.expected}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800">
        <p className="text-xs text-gray-500 text-center">
          "Retail is buying hope again. We're selling it."
        </p>
      </div>
    </Card>
  );
}