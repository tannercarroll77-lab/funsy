import React, { useState } from 'react';
import { TerminalCard, SectionHeader, StatusBadge, TerminalInput, TerminalSelect } from './BloombergStyles';
import { Bell, Mail, MessageCircle, Check, X, Plus, Trash2 } from 'lucide-react';

export default function ProphetAlertConfig() {
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'email', threshold: 92, tickers: 'ALL', enabled: true },
    { id: 2, type: 'telegram', threshold: 90, tickers: 'SPY,QQQ,TSLA', enabled: true }
  ]);
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [newAlert, setNewAlert] = useState({ type: 'email', threshold: 90, tickers: 'ALL' });

  const addAlert = () => {
    setAlerts([...alerts, { ...newAlert, id: Date.now(), enabled: true }]);
    setShowAddAlert(false);
    setNewAlert({ type: 'email', threshold: 90, tickers: 'ALL' });
  };

  const toggleAlert = (id) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const removeAlert = (id) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  return (
    <TerminalCard>
      <SectionHeader 
        action={
          <button 
            onClick={() => setShowAddAlert(!showAddAlert)}
            className="flex items-center gap-1 text-[10px] text-[#00e5ff] hover:text-[#00e5ff]/80 font-mono uppercase"
          >
            <Plus className="w-3 h-3" />
            Add Alert
          </button>
        }
      >
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#00e5ff]" />
          Prophet Score Alerts
        </div>
      </SectionHeader>

      {/* Add Alert Form */}
      {showAddAlert && (
        <div className="bg-[#000000] border border-[#00e5ff]/30 rounded-[2px] p-4 mb-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-[10px] text-[#8b949e] uppercase tracking-wider mb-1 block font-mono">
                Alert Type
              </label>
              <TerminalSelect 
                value={newAlert.type}
                onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                className="w-full"
              >
                <option value="email">Email</option>
                <option value="telegram">Telegram</option>
              </TerminalSelect>
            </div>
            <div>
              <label className="text-[10px] text-[#8b949e] uppercase tracking-wider mb-1 block font-mono">
                Min Score
              </label>
              <TerminalInput 
                type="number"
                value={newAlert.threshold}
                onChange={(e) => setNewAlert({ ...newAlert, threshold: parseInt(e.target.value) })}
                min={70}
                max={100}
              />
            </div>
            <div>
              <label className="text-[10px] text-[#8b949e] uppercase tracking-wider mb-1 block font-mono">
                Tickers
              </label>
              <TerminalInput 
                value={newAlert.tickers}
                onChange={(e) => setNewAlert({ ...newAlert, tickers: e.target.value.toUpperCase() })}
                placeholder="ALL or SPY,TSLA,..."
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={addAlert}
              className="flex-1 bg-[#00e5ff] text-black font-bold py-2 rounded-[2px] text-xs uppercase tracking-wider hover:bg-[#00e5ff]/80"
            >
              Create Alert
            </button>
            <button 
              onClick={() => setShowAddAlert(false)}
              className="px-4 border border-[#1a2332] text-[#8b949e] rounded-[2px] hover:border-[#f85149] hover:text-[#f85149]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Active Alerts */}
      <div className="space-y-2">
        {alerts.map(alert => (
          <div 
            key={alert.id}
            className={`
              flex items-center justify-between p-3 rounded-[2px] border transition-all
              ${alert.enabled 
                ? 'bg-[#000000] border-[#1a2332]' 
                : 'bg-[#0d1117] border-[#1a2332]/50 opacity-50'}
            `}
          >
            <div className="flex items-center gap-3">
              {alert.type === 'email' ? (
                <Mail className={`w-4 h-4 ${alert.enabled ? 'text-[#00e5ff]' : 'text-[#8b949e]'}`} />
              ) : (
                <MessageCircle className={`w-4 h-4 ${alert.enabled ? 'text-[#00e5ff]' : 'text-[#8b949e]'}`} />
              )}
              <div>
                <div className="text-xs font-mono text-[#c9d1d9]">
                  Score ≥ <span className="text-[#00e5ff] font-bold">{alert.threshold}</span>
                </div>
                <div className="text-[10px] text-[#8b949e] font-mono">
                  {alert.tickers === 'ALL' ? 'All Tickers' : alert.tickers}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <StatusBadge variant={alert.enabled ? 'success' : 'default'}>
                {alert.enabled ? 'ACTIVE' : 'PAUSED'}
              </StatusBadge>
              <button 
                onClick={() => toggleAlert(alert.id)}
                className={`p-1.5 rounded-[2px] transition-colors ${
                  alert.enabled 
                    ? 'text-[#3fb950] hover:bg-[#3fb950]/10' 
                    : 'text-[#8b949e] hover:bg-[#8b949e]/10'
                }`}
              >
                <Check className="w-4 h-4" />
              </button>
              <button 
                onClick={() => removeAlert(alert.id)}
                className="p-1.5 text-[#f85149] hover:bg-[#f85149]/10 rounded-[2px] transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="text-center py-8 text-[#8b949e] text-xs font-mono">
            No alerts configured. Click "Add Alert" to get started.
          </div>
        )}
      </div>

      {/* Telegram Bot Info */}
      <div className="mt-4 p-3 bg-[#000000] border border-[#1a2332] rounded-[2px]">
        <div className="text-[10px] text-[#8b949e] uppercase tracking-wider mb-2 font-mono">Telegram Setup</div>
        <div className="text-xs text-[#c9d1d9] font-mono mb-2">
          Bot: <span className="text-[#00e5ff]">@ProphetScoreBot</span>
        </div>
        <div className="text-[10px] text-[#8b949e]">
          Send /start to the bot and link your account to receive real-time alerts
        </div>
      </div>
    </TerminalCard>
  );
}