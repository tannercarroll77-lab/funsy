import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import {
  Shield,
  Users,
  DollarSign,
  Zap,
  TrendingUp,
  FileText,
  Settings,
  BarChart3,
  Brain,
  ExternalLink,
  Download,
  Clock,
  Target,
  Mail,
  Ticket
} from 'lucide-react';
import EmailBot from '../components/admin/EmailBot';
import SupportTicketQueue from '../components/admin/SupportTicketQueue';

export default function Admin() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        // Redirect if not admin
        if (currentUser.role !== 'admin') {
          window.location.href = '/Dashboard';
        }
      } catch (error) {
        await base44.auth.redirectToLogin('/Admin');
      }
    };
    loadUser();
  }, []);

  const { data: users } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list(),
    enabled: user?.role === 'admin',
    initialData: []
  });

  const { data: subscriptions } = useQuery({
    queryKey: ['allSubscriptions'],
    queryFn: () => base44.entities.Subscription.list(),
    enabled: user?.role === 'admin',
    initialData: []
  });

  const { data: briefings } = useQuery({
    queryKey: ['allBriefings'],
    queryFn: () => base44.entities.DailyBriefing.list('-created_date', 10),
    enabled: user?.role === 'admin',
    initialData: []
  });

  const { data: userLogins } = useQuery({
    queryKey: ['userLogins'],
    queryFn: () => base44.entities.UserLogin.list('-login_timestamp', 100),
    enabled: user?.role === 'admin',
    initialData: []
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const stats = {
    totalUsers: users.length,
    activeSubscriptions: subscriptions.filter(s => s.status === 'active').length,
    foundingMembers: subscriptions.filter(s => s.tier === 'founding').length,
    prophetMembers: subscriptions.filter(s => s.tier === 'prophet').length,
    totalBriefings: briefings.length,
    totalLogins: userLogins.length
  };

  const exportToExcel = () => {
    // Create CSV content
    const headers = ['Email', 'Login Time', 'IP Address', 'User Agent', 'Session ID'];
    const rows = userLogins.map(login => [
      login.user_email,
      new Date(login.login_timestamp).toLocaleString(),
      login.ip_address || 'N/A',
      login.user_agent || 'N/A',
      login.session_id || 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `user_logins_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const productLinks = [


    {
      name: 'Prophet Intelligence',
      description: 'ML-powered options analysis engine',
      path: '/ProphetDashboard',
      icon: Brain,
      color: 'from-cyan-500 to-purple-500'
    },
    {
      name: 'Account Management',
      description: 'User profiles and subscriptions',
      path: '/Account',
      icon: Users,
      color: 'from-blue-500 to-blue-700'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Control Center</h1>
              <p className="text-gray-400">All-access system overview</p>
            </div>
          </div>
          <Badge className="bg-red-500 text-white">
            Logged in as Admin: {user.email}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-white/5 border border-gray-800 p-4">
            <Users className="w-8 h-8 text-cyan-400 mb-2" />
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <div className="text-sm text-gray-400">Total Users</div>
          </Card>

          <Card className="bg-white/5 border border-gray-800 p-4">
            <DollarSign className="w-8 h-8 text-green-400 mb-2" />
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            <div className="text-sm text-gray-400">Active Subs</div>
          </Card>

          <Card className="bg-white/5 border border-gray-800 p-4">
            <Zap className="w-8 h-8 text-red-400 mb-2" />
            <div className="text-2xl font-bold">{stats.foundingMembers}</div>
            <div className="text-sm text-gray-400">Founding</div>
          </Card>

          <Card className="bg-white/5 border border-gray-800 p-4">
            <Brain className="w-8 h-8 text-purple-400 mb-2" />
            <div className="text-2xl font-bold">{stats.prophetMembers}</div>
            <div className="text-sm text-gray-400">Prophet</div>
          </Card>

          <Card className="bg-white/5 border border-gray-800 p-4">
            <FileText className="w-8 h-8 text-yellow-400 mb-2" />
            <div className="text-2xl font-bold">{stats.totalBriefings}</div>
            <div className="text-sm text-gray-400">Briefings</div>
          </Card>

          <Card className="bg-white/5 border border-gray-800 p-4">
            <Clock className="w-8 h-8 text-orange-400 mb-2" />
            <div className="text-2xl font-bold">{stats.totalLogins}</div>
            <div className="text-sm text-gray-400">Total Logins</div>
          </Card>
        </div>

        {/* Product Access */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Product Access</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {productLinks.map((product) => {
              const Icon = product.icon;
              return (
                <Link key={product.path} to={createPageUrl(product.path.replace('/', ''))}>
                  <Card className="bg-white/5 border border-gray-800 p-6 hover:border-gray-600 transition-all group cursor-pointer relative">
                    {product.badge && (
                      <Badge className="absolute top-3 right-3 bg-green-500 text-white text-[10px]">
                        {product.badge}
                      </Badge>
                    )}
                    <div className={`w-12 h-12 bg-gradient-to-br ${product.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-400 mb-4">{product.description}</p>
                    <div className="flex items-center text-sm text-cyan-400">
                      Open <ExternalLink className="w-4 h-4 ml-2" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Support Ticket Queue */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-yellow-400" />
            Support Ticket Queue
          </h2>
          <SupportTicketQueue />
        </div>

        {/* Email Bot */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-cyan-400" />
            Email Bot
          </h2>
          <EmailBot />
        </div>

        {/* User Login Database */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">User Login Database</h2>
            <Button 
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export to Excel
            </Button>
          </div>
          <Card className="bg-white/5 border border-gray-800 p-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 font-semibold text-gray-400">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-400">Login Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-400">IP Address</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-400">Device</th>
                  </tr>
                </thead>
                <tbody>
                  {userLogins.slice(0, 20).map((login, idx) => (
                    <tr key={idx} className="border-b border-gray-800/50 hover:bg-white/5">
                      <td className="py-3 px-4 font-mono text-cyan-400">{login.user_email}</td>
                      <td className="py-3 px-4 text-gray-300">
                        {new Date(login.login_timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-gray-400">{login.ip_address || 'N/A'}</td>
                      <td className="py-3 px-4 text-gray-400 text-xs">
                        {login.user_agent ? login.user_agent.substring(0, 40) + '...' : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {userLogins.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No login records yet
              </div>
            )}
          </Card>
        </div>

        {/* Recent Users */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Recent Users</h2>
          <Card className="bg-white/5 border border-gray-800 p-4">
            <div className="space-y-2">
              {users.slice(0, 10).map((u) => (
                <div key={u.id} className="flex items-center justify-between bg-black/30 rounded-lg p-3">
                  <div>
                    <div className="font-semibold">{u.full_name || u.email}</div>
                    <div className="text-xs text-gray-400">{u.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${
                      u.role === 'admin' ? 'bg-red-500' : 'bg-gray-700'
                    } text-white`}>
                      {u.role}
                    </Badge>
                    {u.plan_type && (
                      <Badge className="bg-cyan-500/20 text-cyan-400">
                        {u.plan_type}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* System Info */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-6 h-6 text-gray-400" />
            <h3 className="text-lg font-bold">System Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Environment</div>
              <div className="font-semibold">Production</div>
            </div>
            <div>
              <div className="text-gray-400">Last Deploy</div>
              <div className="font-semibold">{new Date().toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-gray-400">Database</div>
              <div className="font-semibold">Connected</div>
            </div>
            <div>
              <div className="text-gray-400">API Status</div>
              <div className="font-semibold text-green-400">Operational</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}