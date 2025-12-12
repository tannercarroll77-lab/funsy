import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  ArrowRight, 
  Calendar, 
  Search, 
  Brain, 
  BarChart3, 
  TrendingUp, 
  Zap,
  CheckCircle2,
  Sparkles,
  Activity,
  Layers,
  Lock
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PricingModal from '../components/membership/PricingModal';
import { GammaDemo, AnalyticsDemo, ZeroDTEDemo, FullAccessDemo } from '../components/prophet/FeatureDemos';

export default function Features() {
  const [showPricingModal, setShowPricingModal] = useState(false);

  const handleGetStarted = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        setShowPricingModal(true);
      } else {
        await base44.auth.redirectToLogin('/ProphetDashboard');
      }
    } catch {
      await base44.auth.redirectToLogin('/ProphetDashboard');
    }
  };

  const features = [
    {
      id: 'full_suite',
      icon: Layers,
      name: 'Full Access Prophet Suite',
      tagline: 'The complete arsenal',
      description: 'Get everything. Gamma Exposure, Advanced Analytics, and 0DTE Pro combined into one powerful command center. Plus exclusive access to our Discord Alpha Room and priority VIP support.',
      benefits: [
        'All Prophet Tools Included',
        'Priority VIP Support',
        'Discord Alpha Room Access',
        'Early Beta Access to New Features',
        'Save $410/mo vs Individual Tools'
      ],
      availability: 'Full Access Package',
      DemoComponent: FullAccessDemo,
      premium: true,
      flagship: true
    },
    {
      id: 'gamma_exposure',
      icon: Activity,
      name: 'Gamma Exposure',
      tagline: 'See where dealers are trapped',
      description: 'Track institutional gamma exposure in real-time. Visualize call/put walls and zero gamma levels to predict price pinning and volatility explosions before they happen.',
      benefits: [
        'Real-time GEX tracking',
        'Dealer positioning analysis',
        'Market pinning levels',
        'Volatility surface visualization',
        'Squeeze probability indicators'
      ],
      availability: 'Gamma Exposure Package',
      DemoComponent: GammaDemo,
      premium: true
    },
    {
      id: 'advanced_analytics',
      icon: BarChart3,
      name: 'Advanced Analytics',
      tagline: 'Find the edge in seconds',
      description: 'Stop guessing. Our custom scanner finds high-probability setups instantly, while the Prophet Heat Calendar predicts the best days to trade based on historical edge.',
      benefits: [
        'Prophet Heat Calendar (87-97% POP)',
        'Custom Strategy Scanner',
        'Real-time IV Rank & Percentile',
        'Historical Backtesting Engine',
        'Volatility Risk Premium analysis'
      ],
      availability: 'Advanced Analytics Package',
      DemoComponent: AnalyticsDemo,
      premium: true
    },
    {
      id: '0dte_pro',
      icon: Zap,
      name: '0DTE Pro',
      tagline: 'Surgical intraday precision',
      description: 'Master 0DTE trading with our probability cone and dynamic chart levels. Know exactly where price is likely to stall or reverse with 85-95% statistical confidence.',
      benefits: [
        '0DTE Probability Cone',
        'Dynamic Chart Overlays',
        '85-95% Accuracy Targets',
        'Live Price Targets',
        'Intraday trend reversal alerts'
      ],
      availability: '0DTE Pro Package',
      DemoComponent: ZeroDTEDemo,
      premium: true
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation Removed - Using Global Layout Header */}

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-gradient-to-r from-[#00e5ff]/20 to-[#2979ff]/20 border border-[#00e5ff]/30 text-[#00e5ff] px-4 py-1.5 text-xs sm:text-sm backdrop-blur-xl">
            <Sparkles className="w-3 h-3 mr-2 inline" />
            Professional Trading Intelligence
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Features Built for Winners
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Institutional-grade tools and intelligence, designed for premium sellers who trade like The House
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="space-y-24">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isFlagship = feature.flagship;
            return (
              <div 
                key={index} 
                className={`relative group transition-all duration-500 rounded-sm ${
                  isFlagship 
                    ? 'p-8 my-12 border border-[#00e5ff] bg-[#00e5ff]/5 shadow-[0_0_30px_rgba(0,229,255,0.1)] hover:shadow-[0_0_60px_rgba(0,229,255,0.25)] hover:bg-[#00e5ff]/10' 
                    : 'py-8'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-[#00e5ff] to-[#2979ff] rounded-sm transition-opacity duration-500 -z-10 blur-xl ${isFlagship ? 'opacity-20 group-hover:opacity-30' : 'opacity-5 group-hover:opacity-10'}`} />
                
                <div className="grid lg:grid-cols-12 gap-8 items-center">
                  {/* Left Side - Info */}
                  <div className="lg:col-span-5 order-2 lg:order-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-sm flex items-center justify-center bg-gradient-to-br from-[#00e5ff] to-[#2979ff]">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge className={`${feature.flagship ? 'bg-[#00e5ff] text-white' : 'bg-[#00e5ff] text-black'} font-bold border-0`}>
                        {feature.flagship ? 'FLAGSHIP SUITE' : 'PREMIUM MODULE'}
                      </Badge>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold mb-3 font-mono">{feature.name}</h2>
                    <p className="text-[#00e5ff] font-semibold mb-6 text-lg tracking-wide">{feature.tagline}</p>
                    
                    <p className="text-gray-400 leading-relaxed mb-8 text-lg">{feature.description}</p>
                    
                    <div className="bg-[#0d1117] rounded-sm p-6 border border-[#1a2332] mb-8">
                      <h3 className="text-sm font-bold mb-4 text-white uppercase tracking-wider flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[#00e5ff]" /> Capabilities
                      </h3>
                      <ul className="space-y-3">
                        {feature.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-[#00e5ff] flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      className="bg-[#1a2332] hover:bg-[#212b3b] text-white border border-[#30363d] w-full sm:w-auto font-mono"
                      onClick={() => window.location.href = createPageUrl(`Checkout?product=${feature.id}`)}
                    >
                      Unlock {feature.name} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  {/* Right Side - Demo Image */}
                  <div className="lg:col-span-7 order-1 lg:order-2">
                    <div className="relative rounded-sm overflow-hidden border border-[#1a2332] bg-[#010409] shadow-2xl aspect-video group/image">
                      {/* The Component Demo */}
                      <div className="w-full h-full opacity-40 grayscale group-hover/image:grayscale-[50%] transition-all duration-700 scale-105 group-hover/image:scale-100">
                        <feature.DemoComponent />
                      </div>
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent pointer-events-none" />
                      
                      {/* Lock Overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px] bg-black/20 pointer-events-none">
                        <div className="bg-[#0d1117]/90 border border-[#30363d] p-4 rounded-full mb-4 shadow-xl transform group-hover/image:scale-110 transition-transform duration-300">
                          <Lock className="w-8 h-8 text-[#8b949e]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="rounded-sm bg-gradient-to-r from-[#00e5ff]/20 to-[#2979ff]/20 border-2 border-[#00e5ff] p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Trade Like The House?</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of traders using professional-grade intelligence to collect premium consistently
            </p>
            <Button 
              className="bg-gradient-to-r from-[#00e5ff] to-[#2979ff] text-white font-bold px-10 py-6 text-lg rounded-sm hover:scale-105 hover:shadow-[0_0_40px_rgba(0,229,255,0.6)] transition-all"
              onClick={handleGetStarted}
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card>
        </div>
      </div>

      {/* Pricing Modal */}
      {showPricingModal && <PricingModal onClose={() => setShowPricingModal(false)} />}
    </div>
  );
}