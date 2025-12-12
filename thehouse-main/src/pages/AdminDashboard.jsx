import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, DollarSign, Award, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        if (currentUser.role !== 'admin') {
          window.location.href = '/Dashboard';
          return;
        }
        setUser(currentUser);
      } catch (error) {
        await base44.auth.redirectToLogin('/AdminDashboard');
      }
    };
    loadUser();
  }, []);

  const { data: foundingSpots, refetch: refetchSpots } = useQuery({
    queryKey: ['foundingSpots'],
    queryFn: async () => {
      const response = await base44.functions.invoke('getFoundingSpots', {});
      return response.data;
    },
    refetchInterval: 5000
  });

  const { data: allUsers, refetch: refetchUsers } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list(),
    initialData: []
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0b0e17] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const foundingMembers = allUsers.filter(u => u.plan_type === 'founding');
  const coreMembers = allUsers.filter(u => u.plan_type === 'core');
  const proMembers = allUsers.filter(u => u.plan_type === 'pro');
  const activeSubscriptions = allUsers.filter(u => u.subscription_status === 'active');

  const totalMRR = 
    (foundingMembers.length * 59) + 
    (coreMembers.length * 89) + 
    (proMembers.length * 149);

  return (
    <div className="min-h-screen bg-[#0b0e17] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <Button
            onClick={() => {
              refetchSpots();
              refetchUsers();
            }}
            className="bg-white/10 hover:bg-white/20"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 border-white/10 p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-[#dc2626]" />
              <Badge className="bg-[#dc2626]/20 text-[#dc2626]">
                {foundingSpots?.remaining || 0} left
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-1">
              {foundingSpots?.total_sold || 0}/200
            </div>
            <div className="text-sm text-gray-400">Founding Members</div>
          </Card>

          <Card className="bg-white/5 border-white/10 p-6">
            <Users className="w-8 h-8 text-blue-400 mb-2" />
            <div className="text-3xl font-bold mb-1">{activeSubscriptions.length}</div>
            <div className="text-sm text-gray-400">Active Subscriptions</div>
          </Card>

          <Card className="bg-white/5 border-white/10 p-6">
            <DollarSign className="w-8 h-8 text-green-400 mb-2" />
            <div className="text-3xl font-bold mb-1">${totalMRR.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Monthly MRR</div>
          </Card>

          <Card className="bg-white/5 border-white/10 p-6">
            <Users className="w-8 h-8 text-purple-400 mb-2" />
            <div className="text-3xl font-bold mb-1">{allUsers.length}</div>
            <div className="text-sm text-gray-400">Total Users</div>
          </Card>
        </div>

        {/* Founding Member Progress */}
        <Card className="bg-white/5 border-white/10 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Founding Member Progress</h2>
          <div className="relative h-8 bg-white/5 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#dc2626] to-[#7f1d1d] transition-all duration-500 flex items-center justify-center"
              style={{ width: `${((foundingSpots?.total_sold || 0) / 200) * 100}%` }}
            >
              <span className="text-xs font-bold text-white">
                {foundingSpots?.total_sold || 0} sold
              </span>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span>0</span>
            <span className="font-bold text-[#dc2626]">
              {foundingSpots?.is_sold_out ? 'SOLD OUT' : `${foundingSpots?.remaining || 0} remaining`}
            </span>
            <span>200</span>
          </div>
        </Card>

        {/* Member Breakdown */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white/5 border-white/10 p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#dc2626]" />
              Founding Members
            </h3>
            <div className="text-2xl font-bold mb-2">{foundingMembers.length}</div>
            <div className="text-sm text-gray-400 mb-4">
              ${foundingMembers.length * 59}/mo revenue
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {foundingMembers.slice(0, 5).map((member) => (
                <div key={member.id} className="text-xs bg-white/5 p-2 rounded">
                  #{member.founding_spot_number} - {member.email}
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-white/5 border-white/10 p-6">
            <h3 className="text-lg font-bold mb-4">Core Members</h3>
            <div className="text-2xl font-bold mb-2">{coreMembers.length}</div>
            <div className="text-sm text-gray-400">
              ${coreMembers.length * 89}/mo revenue
            </div>
          </Card>

          <Card className="bg-white/5 border-white/10 p-6">
            <h3 className="text-lg font-bold mb-4">Pro Members</h3>
            <div className="text-2xl font-bold mb-2">{proMembers.length}</div>
            <div className="text-sm text-gray-400">
              ${proMembers.length * 149}/mo revenue
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}