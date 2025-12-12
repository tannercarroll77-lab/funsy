import React from 'react';
import { TrendingUp, Target, Users, DollarSign, Zap, Award, Calendar, BarChart3, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function MetricsDashboard() {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      {/* Dashboard Header */}
      <div className="text-center mb-12 sm:mb-16">
        <Badge className="mb-6 bg-gradient-to-r from-[#dc2626]/20 to-[#7f1d1d]/20 border border-[#dc2626]/30 text-[#dc2626] px-4 py-1.5 text-xs sm:text-sm backdrop-blur-xl">
          <Activity className="w-3 h-3 mr-2 inline animate-pulse" />
          Live Platform Analytics
        </Badge>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Real Traders. Real Results.
          </span>
        </h2>
        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4 font-light">
          Live performance metrics from traders executing The House strategies
        </p>
      </div>

      {/* Main Dashboard Container */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#dc2626] to-[#7f1d1d] rounded-3xl opacity-10 group-hover:opacity-20 blur-2xl transition-all duration-500" />
        <div className="relative bg-[#11131a]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
        {/* Top Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div className="group relative bg-[#0b0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-6 hover:border-[#dc2626]/50 transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-[#dc2626]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#dc2626]/20 to-[#dc2626]/5 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#dc2626]" />
                </div>
                <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-semibold">Members</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#dc2626] to-[#7f1d1d] bg-clip-text text-transparent mb-1">1,247</div>
              <div className="text-[10px] sm:text-xs text-green-400 font-medium">Active traders</div>
            </div>
          </div>

          <div className="group relative bg-[#0b0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-6 hover:border-[#dc2626]/50 transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-[#dc2626]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7f1d1d]/20 to-[#7f1d1d]/5 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#dc2626]" />
                </div>
                <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-semibold">Daily Plays</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#dc2626] to-[#7f1d1d] bg-clip-text text-transparent mb-1">5-10</div>
              <div className="text-[10px] sm:text-xs text-green-400 font-medium">Every trading day</div>
            </div>
          </div>

          <div className="group relative bg-[#0b0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-6 hover:border-[#dc2626]/50 transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-[#dc2626]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400/20 to-green-400/5 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-semibold">Analysis</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">24/7</div>
              <div className="text-[10px] sm:text-xs text-gray-400 font-medium">Market monitoring</div>
            </div>
          </div>

          <div className="group relative bg-[#0b0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-6 hover:border-[#dc2626]/50 transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-[#dc2626]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400/20 to-blue-400/5 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-semibold">Active</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">1,247</div>
              <div className="text-[10px] sm:text-xs text-green-400 font-medium">+324 this week</div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#dc2626]/20 to-transparent mb-8 sm:mb-10" />

        {/* Platform Activity Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-black/40 border border-gray-800 rounded-xl p-3 sm:p-5 hover:border-[#dc2626] transition-all">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#dc2626]" />
              <Badge className="bg-[#dc2626]/20 text-[#dc2626] text-[10px] lowercase">daily</Badge>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">5-10</div>
            <div className="text-xs sm:text-sm text-gray-400 lowercase">plays per day</div>
          </div>

          <div className="bg-black/40 border border-gray-800 rounded-xl p-3 sm:p-5 hover:border-[#dc2626] transition-all">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#dc2626]" />
              <Badge className="bg-green-500/20 text-green-400 text-[10px] lowercase">active</Badge>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">1,247</div>
            <div className="text-xs sm:text-sm text-gray-400 lowercase">active traders</div>
          </div>

          <div className="bg-black/40 border border-gray-800 rounded-xl p-3 sm:p-5 hover:border-[#dc2626] transition-all">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              <Badge className="bg-blue-500/20 text-blue-400 text-[10px] lowercase">ytd</Badge>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">287</div>
            <div className="text-xs sm:text-sm text-gray-400 lowercase">briefings sent</div>
          </div>

          <div className="bg-gradient-to-br from-[#dc2626]/20 to-[#dc2626]/5 border-2 border-[#dc2626]/40 rounded-xl p-3 sm:p-5 hover:border-[#dc2626] transition-all">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#dc2626]" />
              <Badge className="bg-[#dc2626]/30 text-[#dc2626] text-[10px] lowercase">limited</Badge>
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-1 text-[#dc2626]">147</div>
            <div className="text-xs sm:text-sm text-gray-400 lowercase">founding spots left</div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="relative group bg-[#0b0e17]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 sm:p-8 hover:border-[#dc2626]/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-[#dc2626]/5 via-transparent to-[#1a1a1a]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#dc2626]/20 to-[#7f1d1d]/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-[#dc2626]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight">Platform Activity <span className="text-gray-500 font-normal">(Last 24h)</span></h3>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                <div className="text-2xl sm:text-3xl font-extrabold text-green-400 mb-1">5-10</div>
                <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-semibold">Daily Plays</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#dc2626] mb-1">287</div>
                <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-semibold">Briefings Sent</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#dc2626] mb-1">24/7</div>
                <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-semibold">Analysis</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">1,247</div>
                <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-semibold">Active Users</div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-10 sm:mt-12">
        <p className="text-sm sm:text-base text-gray-400 font-medium mb-3">
          Join 1,247 traders collecting premium daily
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 rounded-full bg-[#dc2626] animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
          <span className="uppercase tracking-wider font-semibold">Live Data • Updated Every 5 Minutes</span>
        </div>
      </div>
    </div>
  );
}