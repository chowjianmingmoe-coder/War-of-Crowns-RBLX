import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportTicket, TicketCategory, TicketPriority, TicketStatus } from '../types';
import { useAuth } from './authContext';

interface SubmitTicketPayload {
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  playerCallSign: string;
  playerEmail: string;
  robloxUsername?: string;
  description: string;
}

interface SupportContextType {
  tickets: SupportTicket[];
  submitTicket: (payload: SubmitTicketPayload) => { success: boolean; error?: string; ticket?: SupportTicket };
  updateTicketStatus: (ticketId: string, status: TicketStatus, resolutionNotes?: string) => { success: boolean; error?: string };
  replyToTicket: (ticketId: string, message: string) => { success: boolean; error?: string };
  isStaff: boolean;
}

const STORAGE_KEY = 'woc_support_tickets_v1';

const SEED_TICKETS: SupportTicket[] = [
  {
    id: 'TKT-1042',
    subject: 'Unable to claim Golden Crest badge after Saturday Siege in Roblox',
    category: 'Roblox Access',
    priority: 'medium',
    status: 'resolved',
    playerCallSign: 'VanguardGareth',
    playerEmail: 'gareth.shield@warofcrowns.com',
    robloxUsername: 'Gareth_IronLion',
    description: 'I participated in the 30-minute fortress defense on Roblox yesterday, but the in-game badge prompt didn’t trigger upon victory.',
    createdAt: '2026-09-13 16:45 UTC',
    assignedModerator: 'Jmodd59 (Creator)',
    resolutionNotes: 'Verified battle telemetry on Roblox server logs. Crest badge manual unlock granted via player Roblox profile ID.',
    messages: [
      {
        id: 'msg-1',
        sender: 'VanguardGareth',
        role: 'Player',
        message: 'Hello, I defended the eastern battlement during the full 30-minute siege match yesterday, but did not receive the badge.',
        timestamp: '2026-09-13 16:45 UTC'
      },
      {
        id: 'msg-2',
        sender: 'Jmodd59 (Creator)',
        role: 'Creator',
        message: 'Greetings Commander Gareth! I checked the match log #4928 and confirmed your presence in the victorious stronghold. Your Golden Sigil has been credited to your profile inventory!',
        timestamp: '2026-09-13 18:20 UTC'
      }
    ]
  },
  {
    id: 'TKT-1049',
    subject: 'Collision glitch on Dragonfang mountain ridge',
    category: 'Bug Report',
    priority: 'low',
    status: 'in_progress',
    playerCallSign: 'ArcherSylvia',
    playerEmail: 'sylvia.huntress@warofcrowns.com',
    robloxUsername: 'CanopySniper99',
    description: 'When climbing the north cliff face with House Sylvane scouts, characters can occasionally clip through the rock mesh near coordinate (142, 85).',
    createdAt: '2026-09-14 01:10 UTC',
    assignedModerator: 'Jmodd59 (Creator)',
    messages: [
      {
        id: 'msg-1',
        sender: 'ArcherSylvia',
        role: 'Player',
        message: 'Found a mesh gap near coordinate (142, 85). Sending screenshot coordinates.',
        timestamp: '2026-09-14 01:10 UTC'
      }
    ]
  }
];

const SupportContext = createContext<SupportContextType | null>(null);

export const SupportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return SEED_TICKETS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch (err) {
      console.error('Failed to save support tickets', err);
    }
  }, [tickets]);

  const isStaff = Boolean(
    currentUser && (currentUser.role === 'creator' || currentUser.role === 'moderator')
  );

  const submitTicket = (payload: SubmitTicketPayload) => {
    if (!payload.subject.trim() || !payload.description.trim() || !payload.playerEmail.trim()) {
      return { success: false, error: 'Please fill in all required fields (Subject, Email, Description).' };
    }

    const newTicketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: SupportTicket = {
      id: newTicketId,
      subject: payload.subject.trim(),
      category: payload.category,
      priority: payload.priority,
      status: 'open',
      playerCallSign: payload.playerCallSign.trim() || 'Valiant Commander',
      playerEmail: payload.playerEmail.trim(),
      robloxUsername: payload.robloxUsername?.trim() || undefined,
      description: payload.description.trim(),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: payload.playerCallSign.trim() || 'Player',
          role: 'Player',
          message: payload.description.trim(),
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC'
        }
      ]
    };

    setTickets((prev) => [newTicket, ...prev]);
    return { success: true, ticket: newTicket };
  };

  const updateTicketStatus = (ticketId: string, status: TicketStatus, resolutionNotes?: string) => {
    if (!isStaff) {
      return { success: false, error: 'Only Moderators and Creator can update ticket status.' };
    }

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status,
            assignedModerator: currentUser?.callSign || t.assignedModerator,
            resolutionNotes: resolutionNotes !== undefined ? resolutionNotes : t.resolutionNotes
          };
        }
        return t;
      })
    );

    return { success: true };
  };

  const replyToTicket = (ticketId: string, message: string) => {
    if (!message.trim()) {
      return { success: false, error: 'Message cannot be empty.' };
    }

    const senderName = currentUser ? currentUser.callSign : 'Support Staff';
    const senderRole = currentUser ? (currentUser.role === 'creator' ? 'Creator' : currentUser.role === 'moderator' ? 'Moderator' : 'Player') : 'Support Staff';

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const newMessage = {
            id: `msg-${Date.now()}`,
            sender: senderName,
            role: senderRole,
            message: message.trim(),
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC'
          };
          return {
            ...t,
            messages: [...t.messages, newMessage]
          };
        }
        return t;
      })
    );

    return { success: true };
  };

  return (
    <SupportContext.Provider
      value={{
        tickets,
        submitTicket,
        updateTicketStatus,
        replyToTicket,
        isStaff
      }}
    >
      {children}
    </SupportContext.Provider>
  );
};

export const useSupport = () => {
  const context = useContext(SupportContext);
  if (!context) {
    throw new Error('useSupport must be used within a SupportProvider');
  }
  return context;
};
