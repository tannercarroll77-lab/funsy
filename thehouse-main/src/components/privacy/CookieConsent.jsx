import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Cookie, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 flex justify-center pointer-events-none"
        >
          <div className="bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl p-6 max-w-2xl w-full pointer-events-auto backdrop-blur-xl relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#dc2626]/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
              <div className="bg-[#dc2626]/10 p-3 rounded-lg shrink-0">
                <ShieldCheck className="w-8 h-8 text-[#dc2626]" />
              </div>
              
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-bold text-white">We value your privacy</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  We use cookies to enhance your trading experience, analyze traffic, and personalize content. 
                  By clicking "Accept", you consent to our use of cookies in accordance with our GDPR-compliant 
                  <a href="/TermsOfService" className="text-[#dc2626] hover:underline ml-1">Privacy Policy</a>.
                </p>
              </div>

              <div className="flex gap-3 shrink-0 w-full md:w-auto">
                <Button 
                  variant="outline" 
                  onClick={handleDecline}
                  className="flex-1 md:flex-none border-white/10 hover:bg-white/5 text-gray-400 hover:text-white"
                >
                  Decline
                </Button>
                <Button 
                  onClick={handleAccept}
                  className="flex-1 md:flex-none bg-[#dc2626] hover:bg-[#b91c1c] text-white font-medium"
                >
                  Accept All
                </Button>
              </div>
            </div>
            
            <button 
              onClick={handleDecline}
              className="absolute top-2 right-2 text-gray-500 hover:text-white p-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}