import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Ticket,
  Clock,
  User,
  Mail,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Send
} from 'lucide-react';

export default function SupportTicketQueue() {
  const [expandedTicket, setExpandedTicket] = useState(null);
  const [filter, setFilter] = useState('open');
  const [adminNotes, setAdminNotes] = useState({});
  const queryClient = useQueryClient();

  const { data: tickets, isLoading, refetch } = useQuery({
    queryKey: ['supportTickets', filter],
    queryFn: async () => {
      if (filter === 'all') {
        return base44.entities.SupportTicket.list('-created_date', 100);
      }
      return base44.entities.SupportTicket.filter({ status: filter }, '-created_date', 100);
    },
    initialData: []
  });

  const updateTicketMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return base44.entities.SupportTicket.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['supportTickets']);
    }
  });

  const handleStatusChange = async (ticket, newStatus) => {
    const updateData = { status: newStatus };
    if (newStatus === 'resolved' || newStatus === 'closed') {
      updateData.resolved_at = new Date().toISOString();
      updateData.resolved_by = 'admin';
    }
    if (adminNotes[ticket.id]) {
      updateData.admin_notes = adminNotes[ticket.id];
    }
    updateTicketMutation.mutate({ id: ticket.id, data: updateData });
  };

  const handleSaveNotes = async (ticket) => {
    if (!adminNotes[ticket.id]) return;
    updateTicketMutation.mutate({ 
      id: ticket.id, 
      data: { admin_notes: adminNotes[ticket.id] } 
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      in_progress: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
      closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return styles[status] || styles.open;
  };

  const getCategoryBadge = (category) => {
    const styles = {
      billing: 'bg-purple-500/20 text-purple-400',
      technical: 'bg-red-500/20 text-red-400',
      account: 'bg-cyan-500/20 text-cyan-400',
      feature_request: 'bg-green-500/20 text-green-400',
      other: 'bg-gray-500/20 text-gray-400'
    };
    return styles[category] || styles.other;
  };

  const getPriorityIcon = (priority) => {
    if (priority === 'urgent') return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (priority === 'high') return <AlertCircle className="w-4 h-4 text-orange-500" />;
    return null;
  };

  const openCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;

  return (
    <Card className="bg-white/5 border border-gray-800 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Ticket className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-white">Support Queue</h3>
          {openCount > 0 && (
            <Badge className="bg-yellow-500 text-black text-xs">{openCount} open</Badge>
          )}
          {inProgressCount > 0 && (
            <Badge className="bg-blue-500/20 text-blue-400 text-xs">{inProgressCount} in progress</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32 bg-white/5 border-gray-700 text-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={() => refetch()} className="text-gray-400 hover:text-white">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tickets List */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading tickets...</div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Ticket className="w-12 h-12 mx-auto mb-2 opacity-30" />
          No {filter === 'all' ? '' : filter} tickets
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div 
              key={ticket.id} 
              className="bg-black/30 rounded-lg border border-gray-800 overflow-hidden"
            >
              {/* Ticket Header */}
              <div 
                className="p-3 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getPriorityIcon(ticket.priority)}
                      <span className="font-semibold text-white truncate">{ticket.subject}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{ticket.user_email}</span>
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      <span>{new Date(ticket.created_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge className={getCategoryBadge(ticket.category)}>
                      {ticket.category?.replace('_', ' ')}
                    </Badge>
                    <Badge className={getStatusBadge(ticket.status)}>
                      {ticket.status?.replace('_', ' ')}
                    </Badge>
                    {expandedTicket === ticket.id ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedTicket === ticket.id && (
                <div className="p-4 border-t border-gray-800 bg-black/20 space-y-4">
                  {/* User Info */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <User className="w-4 h-4" />
                      <span>{ticket.user_name || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${ticket.user_email}`} className="text-cyan-400 hover:underline">
                        {ticket.user_email}
                      </a>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <MessageSquare className="w-3 h-3" />
                      Message
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-sm text-gray-300 whitespace-pre-wrap">
                      {ticket.message}
                    </div>
                  </div>

                  {/* Admin Notes */}
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Admin Notes</div>
                    <div className="flex gap-2">
                      <Textarea
                        value={adminNotes[ticket.id] ?? ticket.admin_notes ?? ''}
                        onChange={(e) => setAdminNotes({...adminNotes, [ticket.id]: e.target.value})}
                        placeholder="Internal notes..."
                        className="bg-white/5 border-gray-700 text-white text-sm h-20"
                      />
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2 text-xs"
                      onClick={() => handleSaveNotes(ticket)}
                      disabled={updateTicketMutation.isLoading}
                    >
                      Save Notes
                    </Button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
                    <span className="text-xs text-gray-500 mr-2">Set status:</span>
                    {ticket.status !== 'in_progress' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                        onClick={() => handleStatusChange(ticket, 'in_progress')}
                        disabled={updateTicketMutation.isLoading}
                      >
                        In Progress
                      </Button>
                    )}
                    {ticket.status !== 'resolved' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
                        onClick={() => handleStatusChange(ticket, 'resolved')}
                        disabled={updateTicketMutation.isLoading}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Resolve
                      </Button>
                    )}
                    {ticket.status !== 'closed' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs bg-gray-500/10 border-gray-500/30 text-gray-400 hover:bg-gray-500/20"
                        onClick={() => handleStatusChange(ticket, 'closed')}
                        disabled={updateTicketMutation.isLoading}
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Close
                      </Button>
                    )}
                    <a 
                      href={`mailto:${ticket.user_email}?subject=Re: ${ticket.subject}`}
                      className="ml-auto"
                    >
                      <Button size="sm" className="text-xs bg-cyan-500 text-white hover:bg-cyan-600">
                        <Send className="w-3 h-3 mr-1" />
                        Reply via Email
                      </Button>
                    </a>
                  </div>

                  {/* Resolution Info */}
                  {ticket.resolved_at && (
                    <div className="text-xs text-gray-500 pt-2">
                      Resolved by {ticket.resolved_by} on {new Date(ticket.resolved_at).toLocaleString()}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}