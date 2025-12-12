import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import ProphetPricingView from '../components/prophet/ProphetPricingView';
import ProphetTool from '../components/prophet/ProphetTool';
import { LoadingPulse } from '../components/prophet/BloombergStyles';

export default function ProphetDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        // Not logged in
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-black flex items-center justify-center">
        <LoadingPulse />
      </div>
    );
  }

  // If user is admin, show the dashboard tool
  if (user?.role === 'admin') {
    return <ProphetTool />;
  }

  // Otherwise show pricing view
  return <ProphetPricingView />;
}