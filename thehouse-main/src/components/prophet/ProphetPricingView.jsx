import React from 'react';
import { Check, Zap, Activity, BarChart3, Layers, ArrowRight } from 'lucide-react';
import { createPageUrl } from '../../utils';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProphetPricingView() {
  const packages = [
    {
      id: 'gamma_exposure',
      name: 'Gamma Exposure',
      price: '$179',
      period: '/mo',
      icon: Activity,
      description: 'Real-time GEX tracking, dealer positioning, market pinning levels',
      features: [
        'Real-time GEX tracking',
        'Dealer positioning analysis',
        'Market pinning levels',
        'Volatility surface visualization'
      ]
    },
    {
      id: 'advanced_analytics',
      name: 'Advanced Analytics',
      price: '$149',
      period: '/mo',
      icon: BarChart3,
      description: 'Custom Scanner + Prophet Calendar + IV Rank for premium sweet spots',
      features: [
        'Prophet Heat Calendar (87-97% POP)',
        'Custom Strategy Scanner',
        'Real-time IV Rank & Percentile',
        'Historical Backtesting Engine'
      ]
    },
    {
      id: '0dte_pro',
      name: '0DTE Pro',
      price: '$179',
      period: '/mo',
      icon: Zap,
      description: '0DTE Probability Cone + Chart Visualization Levels',
      features: [
        '0DTE Probability Cone',
        'Dynamic Chart Overlays',
        '85-95% Accuracy Targets',
        'Live Price Targets'
      ]
    },
    {
      id: 'full_suite',
      name: 'Full Access Prophet Suite',
      price: '$497',
      period: '/mo',
      icon: Layers,
      isFlagship: true,
      description: 'ALL TOOLS + EXCLUSIVE FEATURES. Best value - save $410/mo.',
      features: [
        'EVERYTHING in all other packages',
        'Priority VIP Support',
        'Discord Alpha Room Access',
        'Custom Strategy Alerts',
        'Early Access to New Features'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-[#c9d1d9] p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            PROPHET ENGINE ACCESS
          </h1>
          <p className="text-[#8b949e] text-lg max-w-2xl mx-auto">
            Institutional-grade options intelligence. Select a module to get started or unlock the full power of the Prophet Suite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {packages.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <Card 
                key={pkg.id}
                className={`
                  relative flex flex-col p-6 bg-[#0d1117] border transition-all duration-300 hover:-translate-y-1
                  ${pkg.isFlagship 
                    ? 'border-[#00e5ff] shadow-[0_0_30px_rgba(0,229,255,0.15)]' 
                    : 'border-[#1a2332] hover:border-[#8b949e]'
                  }
                `}
              >
                {pkg.isFlagship && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-[#00e5ff] text-black font-bold hover:bg-[#00e5ff] border-0 px-4">
                      RECOMMENDED
                    </Badge>
                  </div>
                )}

                <div className="mb-6">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${pkg.isFlagship ? 'bg-[#00e5ff]/10 text-[#00e5ff]' : 'bg-[#1a2332] text-[#8b949e]'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                  <p className="text-sm text-[#8b949e] min-h-[60px]">{pkg.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-white font-mono">{pkg.price}</span>
                  <span className="text-[#8b949e]">{pkg.period}</span>
                </div>

                <div className="flex-grow mb-8">
                  <ul className="space-y-3">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#c9d1d9]">
                        <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${pkg.isFlagship ? 'text-[#00e5ff]' : 'text-[#3fb950]'}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  className={`
                    w-full font-bold tracking-wide
                    ${pkg.isFlagship 
                      ? 'bg-[#00e5ff] hover:bg-[#00b8cc] text-black' 
                      : 'bg-[#1a2332] hover:bg-[#212b3b] text-white'
                    }
                  `}
                  onClick={() => window.location.href = createPageUrl(`Checkout?product=${pkg.id}`)}
                >
                  GET STARTED <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center border-t border-[#1a2332] pt-12">
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto text-[#8b949e]">
            <div>
              <h4 className="text-white font-bold mb-2">Instant Access</h4>
              <p className="text-xs">Start trading with institutional data immediately after checkout</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-2">Secure Payment</h4>
              <p className="text-xs">256-bit SSL encrypted payment processing via Stripe</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-2">Cancel Anytime</h4>
              <p className="text-xs">No long-term contracts, full control over your subscription</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}