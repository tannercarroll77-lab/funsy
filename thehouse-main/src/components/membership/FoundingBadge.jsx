import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';

export default function FoundingBadge({ spotNumber, variant = 'default' }) {
  if (!spotNumber || spotNumber > 200) return null;

  if (variant === 'compact') {
    return (
      <Badge className="bg-gradient-to-r from-[#dc2626] to-[#7f1d1d] text-white border-[#dc2626] shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-pulse">
        <Award className="w-3 h-3 mr-1" />
        Founding #{spotNumber}
      </Badge>
    );
  }

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-[#dc2626] to-[#7f1d1d] rounded-lg blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse" />
      <div className="relative bg-gradient-to-r from-[#dc2626] to-[#7f1d1d] text-white px-4 py-2 rounded-lg border-2 border-[#dc2626] shadow-2xl flex items-center gap-2">
        <Award className="w-5 h-5 animate-bounce" />
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider">Founding Member</div>
          <div className="text-lg font-bold">#{spotNumber}</div>
        </div>
      </div>
    </div>
  );
}