import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { Home, BarChart3, User, Zap, Menu, X, LogIn, Calendar, TrendingUp } from 'lucide-react';

const DiscordIcon = ({ className }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2763-3.68-.2763-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.699.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z"/>
  </svg>
);
import MarketTicker from './components/MarketTicker';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { EnterpriseProvider } from './components/utils/EnterpriseProvider';
import CommandPalette from './components/utils/CommandPalette';
import { useKeyboardShortcuts } from './components/utils/useKeyboardShortcuts';
import DiscordPopup from './components/DiscordPopup';
import WaitingList from './components/WaitingList';
import { Loader2 } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { shortcuts } = useKeyboardShortcuts({
    openCommandPalette: () => setCommandPaletteOpen(true),
    dashboard: () => window.location.href = createPageUrl('ProphetDashboard'),
    account: () => window.location.href = createPageUrl('Account'),
    home: () => window.location.href = createPageUrl('Home'),
    close: () => setCommandPaletteOpen(false)
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        // User not logged in
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  // Waiting List Logic: 
  // Allow access if:
  // 1. App is loading user state
  // 2. User is admin
  // 3. Current page is SignIn (to allow admins to login)
  if (!isLoading && (!user || user.role !== 'admin') && currentPageName !== 'SignIn') {
    return <WaitingList />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00e5ff] animate-spin" />
      </div>
    );
  }
  
  const baseTabs = [
    { name: 'Home', page: 'Home', icon: Home },
    { name: 'Products', page: 'ProphetDashboard', icon: Zap },
    { name: 'Theta Suite', page: 'ThetaSuite', icon: TrendingUp },
    { name: 'Calendar', page: 'ProphetCalendar', icon: Calendar },
    { name: 'Discord', href: 'https://discord.gg/yuv8TfGXWr', icon: DiscordIcon, external: true },
    { name: 'Account', page: 'Account', icon: User },
  ];

  const tabs = user?.role === 'admin' 
    ? [...baseTabs, { name: 'Admin', page: 'Admin', icon: BarChart3 }]
    : baseTabs;

  const isActive = (page) => currentPageName === page;

  return (
    <EnterpriseProvider>
      <div className="min-h-[100dvh] bg-[#000000]">
        {/* Ticker */}
        <MarketTicker />

        {/* Command Palette */}
        <CommandPalette 
          isOpen={commandPaletteOpen} 
          onClose={() => setCommandPaletteOpen(false)}
          onAction={(action) => {
            if (action === 'shortcuts') {
              // Could show shortcuts modal
            }
          }}
        />

        {/* Page Content */}
        <div className="relative pb-24">
          {children}
        </div>
        
        {/* Discord Popup */}
        <DiscordPopup />

      {/* Global Header */}
      <header className="fixed top-8 left-0 right-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-sm transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <Link to={createPageUrl('Home')} className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-[#00e5ff] to-[#2979ff] flex items-center justify-center text-xl transform group-hover:scale-110 transition-transform duration-300">
              ♠
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-[#00e5ff] to-[#2979ff] bg-clip-text text-transparent tracking-tight">
              THE HOUSE
            </span>
          </Link>


        </div>

        <div className="flex items-center gap-4">
          {!user && (
            <Link to={createPageUrl('SignIn')}>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white gap-2">
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            </Link>
          )}
          {!user && (
            <Link to={createPageUrl('SignIn')}>
              <Button size="sm" className="bg-[#00e5ff] text-black hover:bg-[#00e5ff]/90 font-bold rounded-sm">
                Get Started
              </Button>
            </Link>
          )}
          {user && (
            <Link to={createPageUrl('Account')} className="flex items-center gap-3 pl-4 border-l border-white/10 group hover:opacity-90 transition-opacity">
              <div className="hidden sm:block text-right">

                <div className="text-sm font-bold text-white">
                  {user.full_name ? user.full_name.split(' ')[0] : (user.email?.split('@')[0] || 'Trader')}
                </div>
              </div>
              <div className="w-9 h-9 rounded-sm bg-gradient-to-br from-[#00e5ff] to-[#2979ff] flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(0,229,255,0.3)] border border-white/10">
                {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'T'}
              </div>
            </Link>
          )}
        </div>
      </header>

      {/* Mobile/Global Menu Drawer */}
      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/80 z-[2147483648] backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 w-72 bg-[#0a0a0a] border-r border-white/10 z-[2147483649] p-6 shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-[#00e5ff] to-[#2979ff] flex items-center justify-center text-xl">
                  ♠
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-[#00e5ff] to-[#2979ff] bg-clip-text text-transparent tracking-tight">
                  THE HOUSE
                </span>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-400 hover:text-white hover:rotate-90 transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex flex-col gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = !tab.external && isActive(tab.page);
                
                const commonClasses = `flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200 group ${
                  active 
                    ? 'bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`;

                const content = (
                  <>
                    <div className={`p-1.5 rounded-sm transition-colors ${active ? 'bg-[#00e5ff]/20' : 'group-hover:bg-white/10'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium tracking-wide">{tab.name}</span>
                    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]" />}
                  </>
                );

                if (tab.external) {
                  return (
                    <a
                      key={tab.name}
                      href={tab.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                      className={commonClasses}
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <Link
                    key={tab.name}
                    to={createPageUrl(tab.page)}
                    onClick={() => setIsMenuOpen(false)}
                    className={commonClasses}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>

            <div className="absolute bottom-8 left-6 right-6">
              <div className="p-4 rounded-sm bg-gradient-to-br from-[#00e5ff]/10 to-[#2979ff]/10 border border-[#00e5ff]/20">
                <div className="text-xs text-[#00e5ff] font-bold mb-1">SYSTEM STATUS</div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>Prophet Engine: Online</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
        
        .safe-bottom {
          padding-bottom: env(safe-area-inset-bottom);
          padding-bottom: constant(safe-area-inset-bottom); /* Fallback for older iOS */
        }
      `}</style>
      </div>
    </EnterpriseProvider>
  );
}