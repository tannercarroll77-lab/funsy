import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Sparkles, Activity, BarChart3, Zap, Layers } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '../utils';
import DashboardPreview from '../components/DashboardPreview';
// MarketTicker moved to Layout
import WorldMapBackground from '../components/WorldMapBackground';
import PricingModal from '../components/membership/PricingModal';
import AISupportChat from '../components/AISupportChat';

export default function Home() {
  const [email, setEmail] = useState('');
  const [mounted, setMounted] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = 'trade like the house, the house always wins';

  useEffect(() => {
    setMounted(true);
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);
    return () => clearInterval(typingInterval);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showPricingModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showPricingModal]);

  const handleGetStarted = () => {
    window.location.href = '/SignIn';
  };

  const handleSignIn = () => {
    window.location.href = '/SignIn';
  };

  return (
    <div className="min-h-[100dvh] bg-[#0b0e17] text-white font-inter overflow-x-hidden">
      {/* Market Ticker moved to Layout */}

      {/* Static background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00e5ff]/5 via-transparent to-[#1a1a1a]/5" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,.03)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* Navigation Removed - Using Global Layout Header */}

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 md:pt-40 pb-16 sm:pb-20 md:pb-32">
        {/* World Map Background */}
        <WorldMapBackground />
        
        <div className="text-center max-w-5xl mx-auto space-y-6 sm:space-y-8 md:space-y-12 relative z-10">
          {/* Animated Hero Text */}
          <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Badge className="mb-6 bg-gradient-to-r from-[#00e5ff]/20 to-[#2979ff]/20 border border-[#00e5ff]/30 text-[#00e5ff] px-4 py-1.5 text-xs sm:text-sm backdrop-blur-xl">
              <Sparkles className="w-3 h-3 mr-2 inline" />
              Ultra-Premium Trading Intelligence
            </Badge>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.15] tracking-tighter mb-6 px-2">
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent break-words">
                {typedText}
              </span>
              <span className="inline-block w-0.5 sm:w-1 h-10 sm:h-16 md:h-20 ml-1 sm:ml-2 bg-[#00e5ff] animate-pulse" />
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto font-light px-4 mb-8">
            Professional-grade options analysis platform. Institutional-level insights, delivered with surgical precision.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4">
              <Button 
                className="group relative w-full sm:w-auto bg-gradient-to-r from-[#00e5ff] to-[#2979ff] text-white font-bold text-sm sm:text-base px-8 sm:px-10 py-4 sm:py-6 rounded-sm overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,229,255,0.6)]"
                onClick={handleGetStarted}
              >
                <span className="relative z-10 flex items-center gap-2 justify-center">
                  Access Platform
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#2979ff] to-[#00e5ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>

              <Button 
                variant="outline"
                className="w-full sm:w-auto border-2 border-white/10 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 hover:border-[#00e5ff]/50 text-sm sm:text-base px-8 sm:px-10 py-4 sm:py-6 rounded-sm transition-all duration-300 hover:scale-105"
                onClick={handleSignIn}
              >
                View Demo
              </Button>
            </div>
          </div>

          {/* Floating Stats Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-12 sm:mb-16 px-2 max-w-3xl mx-auto">
            {[
              { value: '24/7', label: 'Market Analysis' },
              { value: '100+', label: 'Strategies' }
            ].map((stat, i) => (
              <div
                key={i}
                className="group relative bg-[#11131a]/60 border border-white/5 rounded-sm sm:rounded-sm p-4 sm:p-6 hover:border-[#00e5ff]/50 transition-colors duration-300"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#00e5ff] to-[#2979ff] bg-clip-text text-transparent mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm text-gray-400 font-medium leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Dashboard Preview */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00e5ff] to-[#2979ff] rounded-sm opacity-20 group-hover:opacity-40 blur-2xl transition-all duration-500" />
            <div className="relative rounded-sm overflow-hidden border border-white/10 backdrop-blur-xl shadow-2xl">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </div>

      {/* What is The House Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32 border-t border-white/5">
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-white/5 backdrop-blur-xl border border-white/10 text-gray-300 px-4 py-1.5 text-xs uppercase tracking-wider">
            Platform Overview
          </Badge>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              What is The House?
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4 font-light">
            Your personal algorithmic trading analyst. We distill complex market data into
            actionable intelligence—high-edge premium selling opportunities identified in seconds,
            not hours.
          </p>
          <Button 
            className="mt-8 group relative bg-gradient-to-r from-[#00e5ff] to-[#2979ff] text-white font-bold px-8 py-6 text-base rounded-sm overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,229,255,0.6)]"
            onClick={handleGetStarted}
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Trading Smarter
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        </div>
      </div>





      {/* Pricing Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-32 border-t border-gray-900">
        <div className="text-center mb-12 sm:mb-16">
          <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider mb-4 lowercase">build your arsenal</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 px-4">Choose Your Weapon</h2>
          <p className="text-gray-400 text-base sm:text-lg lowercase">select individual modules or get the full suite</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto px-2">


          {/* Advanced Analytics */}
          <div 
            className="bg-white/5 border border-gray-800 hover:border-[#00e5ff] p-6 rounded-sm transition-all cursor-pointer flex flex-col"
            onClick={() => window.location.href = createPageUrl('Checkout?product=advanced_analytics')}
          >
            <div className="mb-4 p-3 bg-[#00e5ff]/10 w-fit rounded-sm">
              <BarChart3 className="w-6 h-6 text-[#00e5ff]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
            <div className="text-3xl font-bold mb-4">Coming soon</div>
            <p className="text-sm text-gray-400 mb-6 flex-grow">Prophet Heat Calendar and custom strategy scanner.</p>
            <Button className="w-full bg-transparent border border-gray-700 hover:border-[#00e5ff] hover:bg-[#00e5ff]/10 text-white text-sm">
              Select
            </Button>
          </div>



          {/* Full Suite */}
          <div 
            className="bg-gradient-to-b from-[#00e5ff]/20 to-black border border-[#00e5ff] p-6 rounded-sm transition-all cursor-pointer flex flex-col relative overflow-hidden group"
            onClick={() => window.location.href = createPageUrl('Checkout?product=full_suite')}
          >
            <div className="absolute inset-0 bg-[#00e5ff]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Badge className="w-fit mb-4 bg-[#00e5ff] text-white border-0">BEST VALUE</Badge>
            <div className="mb-4 p-3 bg-[#00e5ff]/20 w-fit rounded-sm">
              <Layers className="w-6 h-6 text-[#00e5ff]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Full Access Suite</h3>
            <div className="text-3xl font-bold mb-4">Coming soon</div>
            <p className="text-sm text-gray-400 mb-6 flex-grow">Everything included. Priority support & Alpha Room.</p>
            <Button className="w-full bg-[#00e5ff] hover:bg-[#00b8cc] text-white border-0 text-sm font-bold shadow-[0_0_20px_rgba(0,229,255,0.4)]">
              Get Full Access
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 border-t border-white/5 mt-20 sm:mt-32">
        <div className="text-center text-xs sm:text-sm text-gray-500 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mb-8">
            <Link to={createPageUrl('TermsOfService')} className="hover:text-[#00e5ff] transition-all duration-300">Privacy Policy</Link>
            <Link to={createPageUrl('TermsOfService')} className="hover:text-[#00e5ff] transition-all duration-300">Terms of Service</Link>
            <Link to={createPageUrl('TermsOfService')} className="hover:text-[#00e5ff] transition-all duration-300">Disclaimer</Link>
            <a href="mailto:support@thehouse.com" className="hover:text-[#00e5ff] transition-all duration-300">Contact</a>
            <a href="https://discord.gg/yuv8TfGXWr" target="_blank" rel="noopener noreferrer" className="hover:text-[#5865F2] transition-all duration-300 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2763-3.68-.2763-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.699.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z"/>
              </svg>
              Discord
            </a>
            </div>
          <p className="font-medium">© 2025 The House. All rights reserved.</p>
          <p className="text-xs text-gray-600 max-w-4xl mx-auto leading-relaxed mt-6 sm:mt-8 px-4 font-light">
            Options trading contains substantial risk and is not for every investor. An investor could potentially lose all or more than the initial investment. 
            Risk capital is money that can be lost without jeopardizing one's financial security or lifestyle. Only risk capital should be used for trading and 
            only those with sufficient risk capital should consider trading. Past performance is not necessarily indicative of future results.
          </p>
        </div>
      </footer>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        .font-inter {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      {/* Pricing Modal */}
      {showPricingModal && <PricingModal onClose={() => setShowPricingModal(false)} />}
      
      {/* AI Chat Bot */}
      <AISupportChat />
      </div>
      );
      }