import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DiscordPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after 30 seconds
    const timer = setTimeout(() => {
      // Check if already dismissed in this session
      if (!sessionStorage.getItem('discord_popup_dismissed')) {
        setIsVisible(true);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('discord_popup_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-40 right-4 md:bottom-24 md:right-8 z-50 max-w-sm w-full sm:w-auto"
        >
          <div className="bg-[#0a0a0a] border border-[#dc2626]/30 rounded-xl p-5 shadow-[0_0_30px_rgba(220,38,38,0.2)] relative overflow-hidden backdrop-blur-xl">
            {/* Background glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#dc2626]/20 blur-3xl rounded-full pointer-events-none" />
            
            <button 
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-gray-500 hover:text-white transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4 relative z-10">
              <div className="bg-[#dc2626] p-3 rounded-lg flex-shrink-0 shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-1">Join the Community</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  Get live trade alerts and chat with top traders in our private Discord.
                </p>
                <Button 
                  className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-medium text-sm transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                  onClick={() => window.open('https://discord.gg/yuv8TfGXWr', '_blank')}
                >
                  Join Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}