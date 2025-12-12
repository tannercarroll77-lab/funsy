import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, Send, Users, Zap, CheckCircle, Clock, 
  FileText, Loader2, Sparkles, UserPlus, CreditCard
} from 'lucide-react';
import { toast } from 'sonner';

// Email templates
const EMAIL_TEMPLATES = {
  purchase_confirm: {
    name: 'Purchase Confirmation',
    subject: 'Welcome to The House 🎰 Your subscription is active!',
    icon: CreditCard,
    body: `Hi {{name}},

Thank you for joining The House! Your {{plan}} subscription is now active.

Here's what you get access to:
{{features}}

Get started: {{dashboard_link}}

Questions? Reply to this email anytime.

See you at the tables,
The House Team`
  },
  waitlist: {
    name: 'Waitlist Welcome',
    subject: "You're on the list! 🎰",
    icon: Clock,
    body: `Hi {{name}},

You're officially on The House waitlist!

We're rolling out access in waves to ensure the best experience. You'll be among the first to know when spots open up.

In the meantime:
- Follow us for updates
- Check out our free market insights

Stay tuned,
The House Team`
  },
  upgrade_access: {
    name: 'Upgrade Access Granted',
    subject: 'Your upgrade is live! 🚀',
    icon: Zap,
    body: `Hi {{name}},

Great news! Your account has been upgraded to {{plan}}.

New features unlocked:
{{features}}

Access your upgraded dashboard: {{dashboard_link}}

Thanks for being a valued member,
The House Team`
  },
  thank_you: {
    name: 'Thank You',
    subject: 'Thanks for being part of The House 🙏',
    icon: Sparkles,
    body: `Hi {{name}},

Just wanted to say thank you for being part of The House community.

Your support means everything to us. We're constantly working to bring you better tools and insights.

If you ever need anything, just reply to this email.

Cheers,
The House Team`
  },
  custom: {
    name: 'Custom Email',
    subject: '',
    icon: FileText,
    body: ''
  }
};

const PLAN_FEATURES = {
  founding: [
    '✓ Lifetime $59/month price lock',
    '✓ Founding Member badge',
    '✓ Daily briefings (5-10 plays)',
    '✓ Custom scanner builder',
    '✓ Discord access',
    '✓ Priority support'
  ],
  core: [
    '✓ All daily briefings',
    '✓ Custom scanner builder',
    '✓ Discord community',
    '✓ Email support',
    '✓ Weekend theta bomber'
  ],
  pro: [
    '✓ Everything in Core',
    '✓ PROPHET™ ML engine',
    '✓ Real-time GEX & gamma walls',
    '✓ 50+ proprietary metrics',
    '✓ Live trade signals',
    '✓ VIP priority support'
  ]
};

export default function EmailBot() {
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState('purchase_confirm');
  const [sending, setSending] = useState(false);
  const [emailForm, setEmailForm] = useState({
    to: '',
    subject: '',
    body: '',
    name: '',
    plan: 'core'
  });
  const [bulkRecipients, setBulkRecipients] = useState('all_subscribers');
  const [sentHistory, setSentHistory] = useState([]);

  const queryClient = useQueryClient();

  const { data: users } = useQuery({
    queryKey: ['allUsersEmail'],
    queryFn: () => base44.entities.User.list(),
    initialData: []
  });

  const { data: subscriptions } = useQuery({
    queryKey: ['allSubscriptionsEmail'],
    queryFn: () => base44.entities.Subscription.list(),
    initialData: []
  });

  const loadTemplate = (templateKey) => {
    const template = EMAIL_TEMPLATES[templateKey];
    setSelectedTemplate(templateKey);
    setEmailForm(prev => ({
      ...prev,
      subject: template.subject,
      body: template.body
    }));
  };

  const processTemplate = (body, data) => {
    let processed = body;
    processed = processed.replace(/{{name}}/g, data.name || 'there');
    processed = processed.replace(/{{plan}}/g, data.plan || 'subscription');
    processed = processed.replace(/{{dashboard_link}}/g, `${window.location.origin}/Dashboard`);
    
    const features = PLAN_FEATURES[data.plan] || PLAN_FEATURES.core;
    processed = processed.replace(/{{features}}/g, features.join('\n'));
    
    return processed;
  };

  const sendEmail = async (to, subject, body, name) => {
    const processedBody = processTemplate(body, { name, plan: emailForm.plan });
    
    const emailSignature = `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        ♠️ THE HOUSE ♠️
   
   Where The Edge Lives

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${window.location.origin}
`;
    
    await base44.integrations.Core.SendEmail({
      to,
      subject,
      body: processedBody + emailSignature
    });

    setSentHistory(prev => [{
      to,
      subject,
      timestamp: new Date().toISOString(),
      status: 'sent'
    }, ...prev.slice(0, 49)]);
  };

  const handleSendSingle = async () => {
    if (!emailForm.to || !emailForm.subject || !emailForm.body) {
      toast.error('Please fill in all fields');
      return;
    }

    setSending(true);
    try {
      await sendEmail(emailForm.to, emailForm.subject, emailForm.body, emailForm.name);
      toast.success(`Email sent to ${emailForm.to}`);
      setEmailForm(prev => ({ ...prev, to: '', name: '' }));
    } catch (error) {
      toast.error('Failed to send email: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  const handleSendBulk = async () => {
    if (!emailForm.subject || !emailForm.body) {
      toast.error('Please fill in subject and body');
      return;
    }

    let recipients = [];

    if (bulkRecipients === 'all_subscribers') {
      recipients = subscriptions
        .filter(s => s.status === 'active')
        .map(s => ({ email: s.user_email, name: users.find(u => u.email === s.user_email)?.full_name }));
    } else if (bulkRecipients === 'founding') {
      recipients = subscriptions
        .filter(s => s.tier === 'founding' && s.status === 'active')
        .map(s => ({ email: s.user_email, name: users.find(u => u.email === s.user_email)?.full_name }));
    } else if (bulkRecipients === 'pro') {
      recipients = subscriptions
        .filter(s => s.tier === 'pro' && s.status === 'active')
        .map(s => ({ email: s.user_email, name: users.find(u => u.email === s.user_email)?.full_name }));
    } else if (bulkRecipients === 'all_users') {
      recipients = users.map(u => ({ email: u.email, name: u.full_name }));
    }

    if (recipients.length === 0) {
      toast.error('No recipients found for this filter');
      return;
    }

    const confirmed = window.confirm(`Send email to ${recipients.length} recipients?`);
    if (!confirmed) return;

    setSending(true);
    let sent = 0;
    let failed = 0;

    for (const recipient of recipients) {
      try {
        await sendEmail(recipient.email, emailForm.subject, emailForm.body, recipient.name);
        sent++;
      } catch (error) {
        failed++;
        console.error(`Failed to send to ${recipient.email}:`, error);
      }
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 200));
    }

    setSending(false);
    toast.success(`Sent ${sent} emails${failed > 0 ? `, ${failed} failed` : ''}`);
  };

  const subscriberCount = subscriptions.filter(s => s.status === 'active').length;
  const foundingCount = subscriptions.filter(s => s.tier === 'founding').length;
  const proCount = subscriptions.filter(s => s.tier === 'pro').length;

  return (
    <Card className="bg-white/5 border border-gray-800 overflow-hidden">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Email Bot</h2>
            <p className="text-xs text-gray-400">Automated & manual email system</p>
          </div>
        </div>
        <Badge className="bg-green-500/20 text-green-400">
          {subscriberCount} active subscribers
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4">
        <TabsList className="bg-white/5 mb-4">
          <TabsTrigger value="templates" className="data-[state=active]:bg-white/10">
            <FileText className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="compose" className="data-[state=active]:bg-white/10">
            <Send className="w-4 h-4 mr-2" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="bulk" className="data-[state=active]:bg-white/10">
            <Users className="w-4 h-4 mr-2" />
            Bulk Send
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-white/10">
            <Clock className="w-4 h-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(EMAIL_TEMPLATES).map(([key, template]) => {
              const Icon = template.icon;
              return (
                <button
                  key={key}
                  onClick={() => loadTemplate(key)}
                  className={`p-4 rounded-lg border transition-all text-left ${
                    selectedTemplate === key
                      ? 'bg-cyan-500/20 border-cyan-500'
                      : 'bg-white/5 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-2 ${selectedTemplate === key ? 'text-cyan-400' : 'text-gray-400'}`} />
                  <div className="font-semibold text-sm">{template.name}</div>
                </button>
              );
            })}
          </div>

          {selectedTemplate && (
            <div className="bg-black/30 rounded-lg p-4 mt-4">
              <div className="text-sm text-gray-400 mb-2">Preview:</div>
              <div className="font-semibold mb-2">{EMAIL_TEMPLATES[selectedTemplate].subject}</div>
              <pre className="text-xs text-gray-300 whitespace-pre-wrap font-sans">
                {EMAIL_TEMPLATES[selectedTemplate].body}
              </pre>
            </div>
          )}

          <Button 
            onClick={() => setActiveTab('compose')}
            className="w-full bg-cyan-600 hover:bg-cyan-700"
          >
            Use This Template
          </Button>
        </TabsContent>

        {/* Compose Tab */}
        <TabsContent value="compose" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Recipient Email</label>
              <Input
                value={emailForm.to}
                onChange={(e) => setEmailForm(prev => ({ ...prev, to: e.target.value }))}
                placeholder="user@example.com"
                className="bg-white/5 border-gray-700"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Recipient Name</label>
              <Input
                value={emailForm.name}
                onChange={(e) => setEmailForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John"
                className="bg-white/5 border-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Plan (for template variables)</label>
            <Select value={emailForm.plan} onValueChange={(v) => setEmailForm(prev => ({ ...prev, plan: v }))}>
              <SelectTrigger className="bg-white/5 border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="founding">Founding Member</SelectItem>
                <SelectItem value="core">Core</SelectItem>
                <SelectItem value="pro">Prophet Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Subject</label>
            <Input
              value={emailForm.subject}
              onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Email subject..."
              className="bg-white/5 border-gray-700"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Body</label>
            <Textarea
              value={emailForm.body}
              onChange={(e) => setEmailForm(prev => ({ ...prev, body: e.target.value }))}
              placeholder="Email body... Use {{name}}, {{plan}}, {{features}}, {{dashboard_link}} for variables"
              className="bg-white/5 border-gray-700 min-h-[200px] font-mono text-sm"
            />
          </div>

          <Button 
            onClick={handleSendSingle}
            disabled={sending}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Email
              </>
            )}
          </Button>
        </TabsContent>

        {/* Bulk Send Tab */}
        <TabsContent value="bulk" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { key: 'all_subscribers', label: 'All Subscribers', count: subscriberCount },
              { key: 'founding', label: 'Founding Members', count: foundingCount },
              { key: 'pro', label: 'Prophet Pro', count: proCount },
              { key: 'all_users', label: 'All Users', count: users.length }
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => setBulkRecipients(opt.key)}
                className={`p-3 rounded-lg border transition-all ${
                  bulkRecipients === opt.key
                    ? 'bg-cyan-500/20 border-cyan-500'
                    : 'bg-white/5 border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="text-2xl font-bold">{opt.count}</div>
                <div className="text-xs text-gray-400">{opt.label}</div>
              </button>
            ))}
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Subject</label>
            <Input
              value={emailForm.subject}
              onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Email subject..."
              className="bg-white/5 border-gray-700"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Body</label>
            <Textarea
              value={emailForm.body}
              onChange={(e) => setEmailForm(prev => ({ ...prev, body: e.target.value }))}
              placeholder="Email body..."
              className="bg-white/5 border-gray-700 min-h-[150px] font-mono text-sm"
            />
          </div>

          <Button 
            onClick={handleSendBulk}
            disabled={sending}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending to {bulkRecipients === 'all_subscribers' ? subscriberCount : bulkRecipients === 'founding' ? foundingCount : bulkRecipients === 'pro' ? proCount : users.length} recipients...
              </>
            ) : (
              <>
                <Users className="w-4 h-4 mr-2" />
                Send Bulk Email
              </>
            )}
          </Button>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-2">
          {sentHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No emails sent yet this session
            </div>
          ) : (
            sentHistory.map((email, idx) => (
              <div key={idx} className="flex items-center justify-between bg-black/30 rounded-lg p-3">
                <div>
                  <div className="font-semibold text-sm">{email.to}</div>
                  <div className="text-xs text-gray-400">{email.subject}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {new Date(email.timestamp).toLocaleTimeString()}
                  </span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}