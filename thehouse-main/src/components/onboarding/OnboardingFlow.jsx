import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  CreditCard, 
  Settings, 
  Bell, 
  Sparkles,
  Target,
  TrendingUp,
  Calendar
} from 'lucide-react';
import PricingModal from '../membership/PricingModal';

const steps = [
  { id: 0, title: 'Welcome', icon: Sparkles },
  { id: 1, title: 'Choose Plan', icon: CreditCard },
  { id: 2, title: 'Alert Preferences', icon: Bell },
  { id: 3, title: 'Ready to Trade', icon: TrendingUp }
];

export default function OnboardingFlow({ user, onComplete }) {
  const [currentStep, setCurrentStep] = useState(user?.onboarding_step || 0);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [preferences, setPreferences] = useState({
    scanner: {
      min_iv_rank: 50,
      max_dte: 45,
      preferred_strategies: [],
      sectors: []
    },
    alerts: {
      email_alerts: true,
      daily_briefing_time: '08:45',
      high_edge_alerts: true,
      min_edge_score: 75
    }
  });

  const strategies = [
    'Short Strangle',
    'Short Straddle',
    'Iron Condor',
    'Credit Spread',
    'Jade Lizard',
    'Earnings Play'
  ];

  const sectors = [
    'Technology',
    'Financials',
    'Healthcare',
    'Energy',
    'Consumer',
    'Industrials'
  ];

  useEffect(() => {
    if (user?.scanner_preferences) {
      setPreferences(prev => ({
        ...prev,
        scanner: user.scanner_preferences
      }));
    }
    if (user?.alert_preferences) {
      setPreferences(prev => ({
        ...prev,
        alerts: user.alert_preferences
      }));
    }
  }, [user]);

  const handleNext = async () => {
    // Save current step progress
    await base44.auth.updateMe({ 
      onboarding_step: currentStep + 1 
    });

    if (currentStep === 3) {
      // Complete onboarding
      await base44.auth.updateMe({ 
        onboarding_completed: true,
        alert_preferences: preferences.alerts
      });
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    await base44.auth.updateMe({ 
      onboarding_completed: true,
      onboarding_step: 3
    });
    onComplete();
  };

  const toggleStrategy = (strategy) => {
    setPreferences(prev => ({
      ...prev,
      scanner: {
        ...prev.scanner,
        preferred_strategies: prev.scanner.preferred_strategies.includes(strategy)
          ? prev.scanner.preferred_strategies.filter(s => s !== strategy)
          : [...prev.scanner.preferred_strategies, strategy]
      }
    }));
  };

  const toggleSector = (sector) => {
    setPreferences(prev => ({
      ...prev,
      scanner: {
        ...prev.scanner,
        sectors: prev.scanner.sectors.includes(sector)
          ? prev.scanner.sectors.filter(s => s !== sector)
          : [...prev.scanner.sectors, sector]
      }
    }));
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return user?.plan_type && user.plan_type !== 'free';
    }
    return true;
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-6 overflow-y-auto">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === index;
              const isCompleted = currentStep > index;
              
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted 
                        ? 'bg-[#dc2626] border-[#dc2626]' 
                        : isActive 
                          ? 'bg-[#dc2626]/20 border-[#dc2626]' 
                          : 'bg-white/5 border-gray-700'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <Icon className={`w-5 h-5 ${isActive ? 'text-[#dc2626]' : 'text-gray-500'}`} />
                      )}
                    </div>
                    <span className={`text-xs mt-2 ${isActive ? 'text-white font-semibold' : 'text-gray-500'}`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 transition-all ${
                      isCompleted ? 'bg-[#dc2626]' : 'bg-gray-800'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content Card */}
        <Card className="bg-[#0a0a0a] border-gray-800 p-8">
          {/* Step 0: Welcome */}
          {currentStep === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-[#dc2626] to-[#7f1d1d] rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold mb-4">Welcome to The House</h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Let's get you set up in just a few steps. We'll help you choose a plan, 
                configure your scanner, and set up alerts so you never miss a high-edge opportunity.
              </p>
              <div className="grid grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
                <div className="bg-white/5 border border-gray-800 rounded-xl p-6">
                  <Calendar className="w-8 h-8 text-[#dc2626] mx-auto mb-3" />
                  <div className="text-2xl font-bold mb-1">5-10</div>
                  <div className="text-sm text-gray-400">Daily Plays</div>
                </div>
                <div className="bg-white/5 border border-gray-800 rounded-xl p-6">
                  <Target className="w-8 h-8 text-[#dc2626] mx-auto mb-3" />
                  <div className="text-2xl font-bold mb-1">24/7</div>
                  <div className="text-sm text-gray-400">Analysis</div>
                </div>
                <div className="bg-white/5 border border-gray-800 rounded-xl p-6">
                  <TrendingUp className="w-8 h-8 text-[#dc2626] mx-auto mb-3" />
                  <div className="text-2xl font-bold mb-1">1,247</div>
                  <div className="text-sm text-gray-400">Active Users</div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Choose Plan */}
          {currentStep === 1 && (
            <div className="py-8">
              <h2 className="text-3xl font-bold mb-3 text-center">Choose Your Plan</h2>
              <p className="text-gray-400 mb-8 text-center">
                Select a membership tier to unlock premium features
              </p>

              {user?.plan_type === 'free' || !user?.plan_type ? (
                <div className="text-center">
                  <div className="bg-white/5 border border-gray-800 rounded-xl p-12 mb-6">
                    <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-6">
                      You're currently on the free plan. Upgrade to access daily briefings, 
                      scanner, and more.
                    </p>
                    <Button 
                      className="bg-[#dc2626] text-white hover:bg-[#dc2626]/90"
                      onClick={() => setShowPricingModal(true)}
                    >
                      View Plans & Pricing
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-[#dc2626]/20 to-[#7f1d1d]/20 border-2 border-[#dc2626] rounded-xl p-8 text-center">
                  <Check className="w-16 h-16 text-[#dc2626] mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">
                    {user.plan_type === 'founding' ? 'Founding Member' :
                     user.plan_type === 'pro' ? 'Pro Member' : 'Core Member'}
                  </h3>
                  <p className="text-gray-300 mb-6">
                    You're all set! Let's configure your preferences.
                  </p>
                  {user.founding_spot_number && (
                    <Badge className="bg-[#dc2626] text-white">
                      Founding Spot #{user.founding_spot_number}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Alert Preferences */}
          {currentStep === 2 && (
            <div className="py-8">
              <h2 className="text-3xl font-bold mb-3 text-center">Alert Settings</h2>
              <p className="text-gray-400 mb-8 text-center">
                Configure how and when you receive notifications
              </p>

              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="bg-white/5 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-semibold mb-1">Email Alerts</div>
                      <div className="text-sm text-gray-400">Receive daily briefings via email</div>
                    </div>
                    <button
                      onClick={() => setPreferences(prev => ({
                        ...prev,
                        alerts: { ...prev.alerts, email_alerts: !prev.alerts.email_alerts }
                      }))}
                      className={`w-12 h-6 rounded-full transition-all ${
                        preferences.alerts.email_alerts ? 'bg-[#dc2626]' : 'bg-gray-700'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        preferences.alerts.email_alerts ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>

                <div className="bg-white/5 border border-gray-800 rounded-xl p-6">
                  <label className="text-sm text-gray-400 mb-3 block">
                    Daily Briefing Time (ET)
                  </label>
                  <Input
                    type="time"
                    value={preferences.alerts.daily_briefing_time}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      alerts: { ...prev.alerts, daily_briefing_time: e.target.value }
                    }))}
                    className="bg-white/5 border-gray-700 text-white"
                  />
                </div>

                <div className="bg-white/5 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-semibold mb-1">High Edge Alerts</div>
                      <div className="text-sm text-gray-400">Get notified of exceptional opportunities</div>
                    </div>
                    <button
                      onClick={() => setPreferences(prev => ({
                        ...prev,
                        alerts: { ...prev.alerts, high_edge_alerts: !prev.alerts.high_edge_alerts }
                      }))}
                      className={`w-12 h-6 rounded-full transition-all ${
                        preferences.alerts.high_edge_alerts ? 'bg-[#dc2626]' : 'bg-gray-700'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        preferences.alerts.high_edge_alerts ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                  {preferences.alerts.high_edge_alerts && (
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">
                        Minimum Edge Score: {preferences.alerts.min_edge_score}
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={preferences.alerts.min_edge_score}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          alerts: { ...prev.alerts, min_edge_score: parseInt(e.target.value) }
                        }))}
                        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#dc2626]"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Complete */}
          {currentStep === 3 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-[#dc2626] to-[#7f1d1d] rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold mb-4">You're All Set!</h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Your account is configured and ready. Start exploring high-edge opportunities 
                and collecting premium like the house.
              </p>
              <div className="bg-gradient-to-br from-[#dc2626]/20 to-[#7f1d1d]/20 border-2 border-[#dc2626] rounded-xl p-8 max-w-2xl mx-auto">
                <h3 className="text-xl font-bold mb-4">What's Next?</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#dc2626] mt-0.5" />
                    <span>Daily briefings arrive at {preferences.alerts.daily_briefing_time} ET</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#dc2626] mt-0.5" />
                    <span>Access to custom market scanner and tools</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#dc2626] mt-0.5" />
                    <span>Alerts will notify you of high-edge opportunities</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800">
            <div>
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  className="border-gray-700 text-white"
                  onClick={handleBack}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {currentStep < 3 && currentStep > 0 && (
                <Button
                  variant="ghost"
                  className="text-gray-400"
                  onClick={handleSkip}
                >
                  Skip Setup
                </Button>
              )}
              <Button
                className="bg-[#dc2626] text-white hover:bg-[#dc2626]/90"
                onClick={handleNext}
                disabled={!canProceed()}
              >
                {currentStep === 3 ? 'Start Trading' : 'Continue'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Pricing Modal */}
      {showPricingModal && <PricingModal onClose={() => setShowPricingModal(false)} />}
    </div>
  );
}