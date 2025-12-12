import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Check, X, Loader2, Award, Zap, TrendingUp } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function PricingModal({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSubscribe = async (planType) => {
    setLoading(true);
    setSelectedPlan(planType);
    
    try {
      const response = await base44.functions.invoke('createCheckoutSession', { plan_type: planType });
      
      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error.response?.data?.error || 'Checkout is being configured. Please try again shortly.');
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  const plans = [

    {
      id: 'pro',
      name: 'Prophet Member',
      price: 'Coming soon',
      description: 'ML-powered intelligence engine',
      icon: TrendingUp,
      badge: 'Flagship',
      badgeColor: 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white',
      features: [
        'Everything in Core',
        'PROPHET™ ML intelligence engine',
        'Real-time GEX & gamma walls',
        '50+ proprietary metrics',
        'Live trade signals with confidence',
        'Historical backtester',
        'VIP priority support'
      ],
      highlight: true
    },
    {
      id: 'prophet_lifetime',
      name: 'Lifetime Prophet',
      price: 'Coming soon',
      period: '/one-time',
      description: 'One payment, forever access',
      icon: Award,
      badge: 'Best Value',
      badgeColor: 'bg-[#00e5ff] text-white',
      features: [
        'Lifetime PROPHET™ access',
        'No monthly fees ever',
        'All Prophet features included',
        'Real-time GEX & gamma walls',
        'Live trade signals',
        'Historical backtester',
        'VIP priority support'
      ],
      highlight: true
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Choose Your Plan</h2>
            <p className="text-gray-400">Start collecting premium like The House</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white text-3xl"
          >
            <X />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isLoading = loading && selectedPlan === plan.id;
            
            return (
              <Card
                key={plan.id}
                className={`relative p-6 rounded-sm transition-all duration-300 hover:scale-105 ${
                  plan.highlight
                    ? 'bg-gradient-to-br from-[#00e5ff]/20 to-[#2979ff]/20 border-2 border-[#00e5ff]'
                    : 'bg-white/5 border border-white/10'
                } ${plan.soldOut ? 'opacity-60' : ''}`}
              >


                {plan.highlight && !plan.soldOut && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-[#00e5ff] text-white shadow-lg">
                      BEST VALUE
                    </Badge>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-[#00e5ff]/20 to-transparent flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#00e5ff]" />
                  </div>
                  <Badge className={plan.badgeColor}>
                    {plan.soldOut ? 'SOLD OUT' : plan.badge}
                  </Badge>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400">{plan.price === 'Coming soon' ? '' : (plan.period || '/month')}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-[#00e5ff] mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isLoading || plan.soldOut}
                  className={`w-full ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-[#00e5ff] to-[#2979ff] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]'
                      : 'bg-white/10 hover:bg-white/20'
                  } text-white font-semibold`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : plan.soldOut ? (
                    'Sold Out Forever'
                  ) : (
                    'Get Started'
                  )}
                </Button>

                {/* Founding spots logic removed */}
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>All plans include 7-day money-back guarantee</p>
          <p className="mt-2">Secure checkout powered by Stripe</p>
        </div>
      </div>
    </div>
  );
}