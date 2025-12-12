import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, CreditCard, Download, Users, Copy, Check, Rocket } from 'lucide-react';
import PricingModal from '../components/membership/PricingModal';

export default function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [referralCode] = useState('HOUSE-' + Math.random().toString(36).substring(2, 8).toUpperCase());

  useEffect(() => {
    const loadUser = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) {
          window.location.href = '/SignIn';
          return;
        }
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        window.location.href = '/SignIn';
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const { data: subscription } = useQuery({
    queryKey: ['subscription', user?.email],
    queryFn: async () => {
      if (!user) return null;
      const subs = await base44.entities.Subscription.filter({ user_email: user.email });
      return subs[0] || null;
    },
    enabled: !!user,
    initialData: null
  });

  const { data: referrals } = useQuery({
    queryKey: ['referrals', user?.email],
    queryFn: async () => {
      if (!user) return [];
      return await base44.entities.Referral.filter({ referrer_email: user.email });
    },
    enabled: !!user,
    initialData: []
  });

  const { data: pastBriefings } = useQuery({
    queryKey: ['pastBriefings'],
    queryFn: async () => {
      return await base44.entities.DailyBriefing.list('-briefing_date', 10);
    },
    initialData: []
  });

  const handleCopyReferralLink = () => {
    const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Show coming soon for non-admin users
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#00e5ff] to-[#2979ff] flex items-center justify-center">
              <Rocket className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Coming Soon</h1>
            <p className="text-gray-400 text-lg mb-2">
              We're putting the finishing touches on something special.
            </p>
            <p className="text-gray-500">
              Launch date announcement coming soon.
            </p>
          </div>
          
          <Card className="bg-white/5 border-gray-800 p-6 mb-6">
            <div className="text-sm text-gray-400 mb-2">Logged in as</div>
            <div className="font-semibold text-white">{user.email}</div>
          </Card>
          
          <Button
            onClick={() => base44.auth.logout()}
            variant="outline"
            className="border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"
          >
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  const getTierBadge = (tier) => {
    const badges = {
      founding: { color: 'bg-[#fbbf24] text-black', label: 'FOUNDING MEMBER' },
      whale: { color: 'bg-[#00e5ff] text-white', label: 'WHALE' },
      pro: { color: 'bg-purple-600 text-white', label: 'PRO' },
      core: { color: 'bg-gray-600 text-white', label: 'CORE' }
    };
    return badges[tier] || badges.core;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/Dashboard">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <User className="w-8 h-8 text-[#fbbf24]" />
                <div>
                  <h1 className="text-2xl font-bold">Account Settings</h1>
                  <p className="text-sm text-gray-500">Manage your subscription and referrals</p>
                </div>
              </div>
            </div>
            <Link to="/Dashboard">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <Card className="bg-white/5 border-gray-800 p-8">
              <h2 className="text-xl font-bold mb-6">Profile Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Full Name</label>
                  <Input
                    value={user.full_name || ''}
                    readOnly
                    className="bg-white/5 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Email</label>
                  <Input
                    value={user.email || ''}
                    readOnly
                    className="bg-white/5 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Member Since</label>
                  <Input
                    value={new Date(user.created_date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                    readOnly
                    className="bg-white/5 border-gray-700 text-white"
                  />
                </div>
              </div>
            </Card>

            {/* Subscription Card */}
            <Card className="bg-white/5 border-gray-800 p-8">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-[#fbbf24]" />
                <h2 className="text-xl font-bold">Subscription</h2>
              </div>

              {subscription ? (
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className={`${getTierBadge(subscription.tier).color} mb-3`}>
                        {getTierBadge(subscription.tier).label}
                      </Badge>
                      <div className="text-3xl font-bold mb-2">
                        ${subscription.price_monthly}
                        <span className="text-lg text-gray-400 font-normal">/month</span>
                      </div>
                      {subscription.is_lifetime && (
                        <Badge className="bg-[#fbbf24] text-black">
                          Lifetime Pricing Lock ✓
                        </Badge>
                      )}
                    </div>
                    <Badge 
                      className={`${
                        subscription.status === 'active' 
                          ? 'bg-green-500/20 text-green-500 border-green-500' 
                          : 'bg-red-500/20 text-red-500 border-red-500'
                      }`}
                    >
                      {subscription.status.toUpperCase()}
                    </Badge>
                  </div>

                  {subscription.next_billing_date && (
                    <div className="pt-4 border-t border-gray-800">
                      <div className="text-sm text-gray-400">Next billing date</div>
                      <div className="text-lg font-semibold mt-1">
                        {new Date(subscription.next_billing_date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-800">
                    <Button 
                      variant="outline" 
                      className="text-gray-400 border-gray-700 hover:bg-white/5"
                      onClick={() => window.open('https://billing.stripe.com/p/login/test', '_blank')}
                    >
                      Manage Billing
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No active subscription</p>
                  <Button 
                    className="bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 font-semibold"
                    onClick={() => setShowPricingModal(true)}
                  >
                    Choose a Plan
                  </Button>
                </div>
              )}
            </Card>

            {/* Past Briefings */}
            <Card className="bg-white/5 border-gray-800 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Download className="w-6 h-6 text-[#fbbf24]" />
                <h2 className="text-xl font-bold">Past Briefings</h2>
              </div>

              <div className="space-y-3">
                {pastBriefings.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">No briefings yet</p>
                ) : (
                  pastBriefings.map((briefing) => (
                    <div 
                      key={briefing.id}
                      className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-gray-800 hover:border-[#fbbf24]/30 transition-colors"
                    >
                      <div>
                        <div className="font-semibold">{briefing.title}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(briefing.briefing_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-[#fbbf24] hover:bg-[#fbbf24]/10">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Referral Card */}
            <Card className="bg-gradient-to-br from-[#fbbf24]/20 to-[#00e5ff]/10 border-[#fbbf24]/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-[#fbbf24]" />
                <h3 className="text-lg font-bold">Refer & Earn</h3>
              </div>

              <p className="text-sm text-gray-300 mb-4">
                Get <span className="text-[#fbbf24] font-bold">$100 credit</span> for every paid referral
              </p>

              <div className="bg-black/30 rounded-lg p-3 mb-3 border border-gray-800">
                <div className="text-xs text-gray-500 mb-1">Your referral code</div>
                <div className="font-mono font-bold text-[#fbbf24]">{referralCode}</div>
              </div>

              <Button 
                onClick={handleCopyReferralLink}
                className="w-full bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 font-semibold"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Referral Link
                  </>
                )}
              </Button>

              <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="text-sm text-gray-400">Your referrals</div>
                <div className="text-2xl font-bold text-[#fbbf24] mt-1">
                  {referrals.filter(r => r.status === 'completed').length}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ${referrals.filter(r => r.status === 'completed').length * 100} earned
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white/5 border-gray-800 p-6">
              <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400">Days Active</div>
                  <div className="text-2xl font-bold text-[#fbbf24]">
                    {Math.floor((Date.now() - new Date(user.created_date).getTime()) / (1000 * 60 * 60 * 24))}
                  </div>
                </div>
                <div className="h-px bg-gray-800" />
                <div>
                  <div className="text-sm text-gray-400">Briefings Received</div>
                  <div className="text-2xl font-bold">{pastBriefings.length}</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      {showPricingModal && <PricingModal onClose={() => setShowPricingModal(false)} />}
    </div>
  );
}