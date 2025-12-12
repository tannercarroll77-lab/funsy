import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Loader2, CheckCircle2, Lock, Zap, TrendingUp, Activity, BarChart3, Shield, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="group p-6 rounded-xl bg-[#0a0a0a] border border-[#1a2332] hover:border-[#00e5ff]/30 transition-all duration-300 relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#00e5ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10">
      <div className="w-12 h-12 rounded-lg bg-[#1a2332] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-[#00e5ff]" />
      </div>
      <h3 className="text-lg font-bold text-[#c9d1d9] font-mono mb-2">{title}</h3>
      <p className="text-[#8b949e] text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

export default function WaitingList() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      await base44.entities.WaitingListEntry.create({ email });
      setStatus('success');
      setMessage("Access request received. We'll be in touch.");
      setEmail('');
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  const features = [
    {
      icon: Zap,
      title: "Prophet Engine",
      description: "AI-driven volatility forecasting that identifies statistical anomalies in real-time options chains."
    },
    {
      icon: Activity,
      title: "Theta Suite",
      description: "Advanced simulation tools for high-frequency decay capture strategies and earnings plays."
    },
    {
      icon: BarChart3,
      title: "Institutional Data",
      description: "Access the same dark pool data and flow analytics used by major trading desks."
    },
    ];

  return (
    <div className="min-h-screen bg-[#000000] text-[#c9d1d9] overflow-x-hidden selection:bg-[#00e5ff]/20 selection:text-[#00e5ff]">
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-50" />
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#00e5ff]/5 rounded-full blur-[120px] animate-pulse duration-[10s]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#2979ff]/5 rounded-full blur-[100px] animate-pulse duration-[8s] delay-1000" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "outCirc" }}
          className="text-center max-w-3xl mx-auto mb-24"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00e5ff] to-[#2979ff] mb-8 shadow-[0_0_40px_rgba(0,229,255,0.3)]"
          >
            <span className="text-5xl filter drop-shadow-lg">♠</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight font-mono">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
              THE HOUSE
            </span>
          </h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#00e5ff]" />
            <span className="text-[#00e5ff] font-mono text-sm tracking-[0.3em] uppercase">Coming Soon</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#00e5ff]" />
          </motion.div>
          
          <p className="text-lg md:text-xl text-[#8b949e] leading-relaxed font-light max-w-2xl mx-auto">
            The next generation of institutional trading intelligence. 
            We are building the most advanced retail trading terminal ever conceived.
          </p>
        </motion.div>

        {/* Signup Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="w-full max-w-md mx-auto mb-32"
        >
          {status === 'success' ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#0d1117]/80 backdrop-blur-xl border border-[#3fb950]/30 rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-[#3fb950]/10 flex items-center justify-center mb-4 ring-1 ring-[#3fb950]/20">
                <CheckCircle2 className="w-8 h-8 text-[#3fb950]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">You're on the list</h3>
              <p className="text-[#8b949e] text-sm">{message}</p>
            </motion.div>
          ) : (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00e5ff] to-[#2979ff] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
              <div className="relative bg-[#0a0a0a] ring-1 ring-white/10 rounded-xl p-2 flex items-center">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-none text-white placeholder:text-[#8b949e] h-12 px-4 focus-visible:ring-0 text-base w-full font-mono"
                  required
                />
                <Button 
                  onClick={handleSubmit}
                  disabled={status === 'loading'}
                  className="bg-[#00e5ff] hover:bg-[#00e5ff]/90 text-black font-bold h-10 px-6 rounded-lg transition-all font-mono ml-2"
                >
                  {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'JOIN'}
                </Button>
              </div>
              {status === 'error' && (
                <p className="text-[#f85149] text-xs font-mono mt-2 text-center">{message}</p>
              )}
            </div>
          )}
          <p className="text-center text-xs text-[#8b949e] mt-4 font-mono">
            Limited spots available for beta access.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-32">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              {...feature} 
              delay={0.8 + (index * 0.1)} 
            />
          ))}
        </div>

        {/* Footer / Admin Login */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-[#1a2332] to-transparent" />
          <Link to={createPageUrl('SignIn')}>
            <Button variant="ghost" size="sm" className="text-[#8b949e]/50 hover:text-[#00e5ff] font-mono text-[10px] gap-2 transition-colors">
              <Lock className="w-3 h-3" />
              SYSTEM ACCESS
            </Button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}