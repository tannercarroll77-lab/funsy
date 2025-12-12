import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X, Send, Sparkles, Ticket, ArrowLeft, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AISupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Welcome to The House. How can I help you collect premium today? You can also submit a support ticket if you need personalized assistance.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    email: '',
    subject: '',
    message: '',
    category: 'other'
  });
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        if (currentUser?.email) {
          setTicketForm(prev => ({ ...prev, email: currentUser.email }));
        }
      } catch (error) {
        // Not logged in
      }
    };
    loadUser();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Lock body scroll removed to prevent mobile layout issues
  /* 
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  */

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a helpful AI assistant for "The House" - a premium options trading briefing service. 
        Be concise, professional, and helpful. Use casino/poker terminology occasionally to match the brand voice.
        
        User question: ${userMessage}
        
        Context: The House provides daily options trading briefings with high-edge premium-selling opportunities (short strangles, iron condors, etc.). 
        Users get 5-10 plays daily based on IV rank, historical data, and edge scores.
        
        If the user seems frustrated or needs personalized help, suggest they can submit a support ticket for human assistance.`,
        add_context_from_internet: false
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Apologies, dealer. Connection issue. Try again?' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitTicket = async () => {
    if (!ticketForm.email || !ticketForm.subject || !ticketForm.message) return;
    
    setIsLoading(true);
    try {
      await base44.entities.SupportTicket.create({
        user_email: ticketForm.email,
        user_name: user?.full_name || '',
        subject: ticketForm.subject,
        message: ticketForm.message,
        category: ticketForm.category,
        priority: 'medium',
        status: 'open'
      });
      
      setTicketSubmitted(true);
      setTimeout(() => {
        setShowTicketForm(false);
        setTicketSubmitted(false);
        setTicketForm({ email: user?.email || '', subject: '', message: '', category: 'other' });
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Your support ticket has been submitted! Our team will respond within 24 hours. Is there anything else I can help you with?' 
        }]);
      }, 2000);
    } catch (error) {
      console.error('Failed to submit ticket:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Playing Card Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-50 group"
      >
        <div className="relative w-20 h-28 transition-all duration-300 hover:scale-110 hover:rotate-6">
          {/* Card Back */}
          <div className={`absolute inset-0 rounded-sm shadow-2xl border-2 transition-all duration-500 ${
            isOpen ? 'rotate-y-180 opacity-0' : 'rotate-y-0 opacity-100'
          }`}>
            <div className="w-full h-full bg-gradient-to-br from-[#00e5ff] to-[#00e5ff] rounded-sm flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white animate-pulse" />
            </div>
          </div>
          
          {/* Card Front */}
          <div className={`absolute inset-0 rounded-sm shadow-2xl border-2 border-[#00e5ff] transition-all duration-500 ${
            isOpen ? 'rotate-y-0 opacity-100' : 'rotate-y-180 opacity-0'
          }`}>
            <div className="w-full h-full bg-white rounded-sm flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-black">A</div>
              <div className="text-4xl text-black">♠</div>
            </div>
          </div>
          
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-sm bg-[#00e5ff] opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300" />
        </div>
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:bottom-48 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 animate-in slide-in-from-bottom-4 duration-300">
          <Card className="bg-[#0a0a0a] border-[#00e5ff] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00e5ff] to-[#00e5ff] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <span className="text-2xl">♠</span>
                </div>
                <div>
                  <div className="font-bold text-white">House Dealer</div>
                  <div className="text-xs text-white/80">AI Support</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages or Ticket Form */}
            {showTicketForm ? (
              <div className="h-60 sm:h-96 overflow-y-auto p-4 bg-[#0a0a0a]">
                {ticketSubmitted ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">Ticket Submitted!</h3>
                    <p className="text-gray-400 text-sm">We'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button 
                      onClick={() => setShowTicketForm(false)}
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back to chat
                    </button>
                    
                    <h3 className="text-lg font-bold text-white">Submit Support Ticket</h3>
                    <p className="text-xs text-gray-400">Please enter your email on file so we can assist you.</p>
                    
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Email on file *</label>
                      <Input
                        value={ticketForm.email}
                        onChange={(e) => setTicketForm({...ticketForm, email: e.target.value})}
                        placeholder="your@email.com"
                        className="bg-white/5 border-gray-700 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Category</label>
                      <Select value={ticketForm.category} onValueChange={(val) => setTicketForm({...ticketForm, category: val})}>
                        <SelectTrigger className="bg-white/5 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="billing">Billing</SelectItem>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="account">Account</SelectItem>
                          <SelectItem value="feature_request">Feature Request</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Subject *</label>
                      <Input
                        value={ticketForm.subject}
                        onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                        placeholder="Brief description of your issue"
                        className="bg-white/5 border-gray-700 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Message *</label>
                      <Textarea
                        value={ticketForm.message}
                        onChange={(e) => setTicketForm({...ticketForm, message: e.target.value})}
                        placeholder="Please describe your issue in detail..."
                        className="bg-white/5 border-gray-700 text-white h-24"
                      />
                    </div>
                    
                    <Button
                      onClick={handleSubmitTicket}
                      disabled={isLoading || !ticketForm.email || !ticketForm.subject || !ticketForm.message}
                      className="w-full bg-[#00e5ff] text-white hover:bg-[#00e5ff]/90"
                    >
                      {isLoading ? 'Submitting...' : 'Submit Ticket'}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-60 sm:h-96 overflow-y-auto p-4 space-y-4 bg-[#0a0a0a]">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-sm px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-[#00e5ff] text-black'
                          : 'bg-white/5 text-white border border-gray-800'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 text-white border border-gray-800 rounded-sm px-4 py-3">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#00e5ff] animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-[#00e5ff] animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 rounded-full bg-[#00e5ff] animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input */}
            {!showTicketForm && (
              <div className="p-4 bg-black/50 border-t border-gray-800">
                <div className="flex gap-2 mb-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about plays, strategies..."
                    disabled={isLoading}
                    className="bg-white/5 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00e5ff]"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="bg-[#00e5ff] text-black hover:bg-[#00e5ff]/90"
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <button
                  onClick={() => setShowTicketForm(true)}
                  className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#00e5ff] transition-colors"
                >
                  <Ticket className="w-3 h-3" />
                  Submit a support ticket
                </button>
              </div>
            )}
          </Card>
        </div>
      )}

      <style>{`
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .rotate-y-0 {
          transform: rotateY(0deg);
        }
      `}</style>
    </>
  );
}