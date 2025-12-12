import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedCard from '../components/animations/AnimatedCard';
import PricingModal from '../components/membership/PricingModal';

export default function SignIn() {
  const [showPricing, setShowPricing] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await base44.auth.isAuthenticated();
      if (authenticated) {
        const user = await base44.auth.me();
        
        window.location.href = '/ProphetDashboard';
      }
    } catch (error) {
      // User not authenticated, stay on sign in page
    }
  };

  const handleSignIn = async () => {
    await base44.auth.redirectToLogin('/SignIn');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/30 via-purple-500/20 to-transparent rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-[#00e5ff]/30 via-[#2979ff]/20 to-transparent rounded-full blur-3xl animate-float-slower" />
      </div>

      {/* Main content */}
      <AnimatedCard className="max-w-md w-full">
        <div className="bg-[#0b0e17]/80 backdrop-blur-2xl border border-white/10 rounded-sm p-8 sm:p-12 relative overflow-hidden">
          {/* Animated border */}
          <div className="absolute inset-0 rounded-sm opacity-50">
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, rgba(0, 229, 255, 0.3), rgba(41, 121, 255, 0.3), rgba(0, 229, 255, 0.3))',
                backgroundSize: '200% 100%',
                animation: 'borderSweep 3s linear infinite',
                padding: '1px',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />
          </div>

          <div className="relative z-10 text-center space-y-6">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: 'spring', 
                stiffness: 260, 
                damping: 20,
                delay: 0.1 
              }}
              className="w-16 h-16 mx-auto rounded-sm bg-gradient-to-br from-[#00e5ff] to-[#2979ff] flex items-center justify-center text-3xl relative"
            >
              <div className="absolute inset-0 bg-[#00e5ff] blur-xl opacity-50 animate-pulse-glow" />
              <span className="relative z-10">♠</span>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome to The House
              </h1>
              <p className="text-gray-400">
                Professional options analysis platform
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-3 py-6"
            >
              {[
                'Daily briefings with 5-10 high-edge plays',
                'Real-time market scanner',
                'Private Discord community',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00e5ff]" />
                  <span>{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* Sign in button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Button
                onClick={handleSignIn}
                className="w-full bg-gradient-to-r from-[#00e5ff] to-[#2979ff] hover:from-[#00e5ff]/90 hover:to-[#2979ff]/90 text-white font-semibold py-6 text-base rounded-sm group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5" />
                  Continue with Email
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>

              <p className="text-xs text-gray-500 mt-4">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="pt-6 border-t border-white/10"
            >
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <Sparkles className="w-4 h-4 text-[#00e5ff]" />
                <span>1,247 traders already joined</span>
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedCard>

      {/* Pricing modal for new users */}
      {showPricing && (
        <PricingModal 
          onClose={() => {
            setShowPricing(false);
            window.location.href = '/ProphetDashboard';
          }} 
        />
      )}
    </div>
  );
}