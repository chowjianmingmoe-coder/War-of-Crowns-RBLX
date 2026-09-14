import React, { useState } from 'react';
import {
  LifeBuoy,
  Send,
  Search,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Clock,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  User,
  Sparkles,
  ExternalLink,
  Crown,
  FileText
} from 'lucide-react';
import { useSupport } from '../utils/supportContext';
import { useAuth } from '../utils/authContext';
import { TicketCategory, TicketPriority, TicketStatus, SupportTicket } from '../types';
import { soundManager } from '../utils/audio';

interface CustomerSupportPageProps {
  onOpenAuth: () => void;
}

export const CustomerSupportPage: React.FC<CustomerSupportPageProps> = ({ onOpenAuth }) => {
  const { tickets, submitTicket, updateTicketStatus, replyToTicket, isStaff } = useSupport();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'submit' | 'track' | 'faq' | 'staff'>('submit');

  // Submit form state
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<TicketCategory>('Roblox Access');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [playerCallSign, setPlayerCallSign] = useState(currentUser ? currentUser.callSign : '');
  const [playerEmail, setPlayerEmail] = useState(currentUser ? currentUser.email : '');
  const [robloxUsername, setRobloxUsername] = useState(currentUser ? currentUser.username : '');
  const [description, setDescription] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedTicket, setSubmittedTicket] = useState<SupportTicket | null>(null);

  // Track ticket state
  const [lookupQuery, setLookupQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  // Staff Desk state
  const [staffFilter, setStaffFilter] = useState<string>('all');
  const [staffSelectedTicketId, setStaffSelectedTicketId] = useState<string | null>(null);
  const [resolutionNoteInput, setResolutionNoteInput] = useState('');

  // FAQ Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I play War of Crowns on Roblox?',
      a: 'War of Crowns is hosted directly on the Roblox platform! You do not need to download any separate desktop application or installer. Simply open Roblox on your PC, Mac, mobile device, or console, search for "War of Crowns", or click the "Play Directly on Roblox" button on our homepage to join live battle lobbies.'
    },
    {
      q: 'How do I obtain a Commander Account?',
      a: 'To maintain competitive integrity and fair play, commander roster credentials are provisioned directly by the Lead Creator (Jmodd59) or designated House Moderators via the Moderator Command Console. If you have been invited to a guild or tournament, submit an assistance ticket here under "Account Issue" with your desired callsign.'
    },
    {
      q: 'Is War of Crowns cross-platform?',
      a: 'Yes! War of Crowns leverages the Roblox universal engine, allowing seamless cross-play between PC, iOS, Android, tablet, and console commanders in the same siege warfare instances.'
    },
    {
      q: 'How do I report a glitch, map exploit, or game bug?',
      a: 'Please use the "Submit Ticket" form above and choose "Bug Report". Include the coordinate on the map if possible (e.g. Dragonfang ridge), a description of what occurred, and your Roblox username so our engineering team can inspect the match replay.'
    },
    {
      q: 'What should I do if my siege rewards or crest badges didn’t unlock?',
      a: 'If a Roblox event badge or victory laurel failed to grant after completing a fortress defense, file a ticket under "Roblox Access" with your exact Roblox username and the approximate time of the battle. Our staff will check the match telemetry logs and credit the unlock.'
    }
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const res = submitTicket({
      subject,
      category,
      priority,
      playerCallSign,
      playerEmail,
      robloxUsername,
      description
    });

    if (!res.success || !res.ticket) {
      setSubmitError(res.error || 'Failed to submit support ticket.');
      return;
    }

    soundManager.playFanfare();
    setSubmittedTicket(res.ticket);
    setSelectedTicket(res.ticket);
    // Reset form
    setSubject('');
    setDescription('');
  };

  const handleReplyToTicket = (ticketId: string) => {
    if (!replyMessage.trim()) return;

    const res = replyToTicket(ticketId, replyMessage);
    if (res.success) {
      soundManager.playClick();
      setReplyMessage('');
      // Update selected ticket in view
      const updated = tickets.find((t) => t.id === ticketId);
      if (updated) setSelectedTicket(updated);
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'in_progress':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'resolved':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'closed':
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getPriorityBadge = (p: TicketPriority) => {
    switch (p) {
      case 'urgent':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'high':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'medium':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'low':
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const searchedTickets = tickets.filter((t) => {
    if (!lookupQuery.trim()) return true;
    const q = lookupQuery.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      t.playerEmail.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      (t.robloxUsername && t.robloxUsername.toLowerCase().includes(q))
    );
  });

  const staffFilteredTickets = tickets.filter((t) => {
    if (staffFilter === 'all') return true;
    return t.status === staffFilter;
  });

  const staffActiveTicket = tickets.find((t) => t.id === staffSelectedTicketId);

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0d1017] via-[#151a24] to-[#0d1017] border border-amber-900/40 p-8 sm:p-12 mb-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/70 border border-amber-600/40 text-amber-300 text-xs font-cinzel font-semibold uppercase tracking-widest mb-3">
              <LifeBuoy className="w-3.5 h-3.5 text-amber-400" />
              <span>War of Crowns Customer Support & Help Desk</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-cinzel text-white uppercase tracking-tight">
              Customer Support
            </h1>
            <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Have questions about War of Crowns on Roblox, need assistance with your commander credentials, or want to report a gameplay bug? Our support team is here to assist you.
            </p>
          </div>

          {isStaff && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-600/40 text-xs text-amber-300 flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Staff Clearance Active ({currentUser?.role === 'creator' ? 'Lead Creator' : 'Moderator'})
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-slate-800 pb-4">
        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('submit');
          }}
          className={`px-5 py-2.5 rounded-xl text-xs font-cinzel font-bold uppercase tracking-wider transition-all border flex items-center gap-2 ${
            activeTab === 'submit'
              ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm shadow-amber-950'
              : 'bg-[#0d1017] border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Submit Ticket</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('track');
          }}
          className={`px-5 py-2.5 rounded-xl text-xs font-cinzel font-bold uppercase tracking-wider transition-all border flex items-center gap-2 ${
            activeTab === 'track'
              ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm shadow-amber-950'
              : 'bg-[#0d1017] border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Track Ticket</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('faq');
          }}
          className={`px-5 py-2.5 rounded-xl text-xs font-cinzel font-bold uppercase tracking-wider transition-all border flex items-center gap-2 ${
            activeTab === 'faq'
              ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm shadow-amber-950'
              : 'bg-[#0d1017] border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>FAQ & Knowledge Base</span>
        </button>

        {isStaff && (
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('staff');
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-cinzel font-bold uppercase tracking-wider transition-all border flex items-center gap-2 ml-auto ${
              activeTab === 'staff'
                ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-sm shadow-purple-950'
                : 'bg-[#0d1017] border-purple-900/50 text-purple-400 hover:text-purple-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Staff Support Desk ({tickets.filter((t) => t.status === 'open').length} Open)</span>
          </button>
        )}
      </div>

      {/* TAB 1: SUBMIT TICKET */}
      {activeTab === 'submit' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-[#0d1017] border border-slate-800 p-6 sm:p-8">
              <h3 className="text-xl font-bold font-cinzel text-white uppercase mb-2">
                Open a Support Inquiry
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Our support council responds to all commander inquiries promptly. Please provide full details below.
              </p>

              {submitError && (
                <div className="mb-6 p-3.5 rounded-xl bg-red-950/50 border border-red-800 text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {submittedTicket && (
                <div className="mb-6 p-5 rounded-xl bg-emerald-950/40 border border-emerald-600/60 animate-fade-in">
                  <div className="flex items-center gap-2 text-emerald-400 font-cinzel font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Inquiry Registered Successfully!</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Your Ticket Tracking ID is{' '}
                    <strong className="text-amber-300 font-mono text-sm px-2 py-0.5 rounded bg-black/50 border border-amber-600/40">
                      {submittedTicket.id}
                    </strong>
                    . You can track updates under the &ldquo;Track Ticket&rdquo; tab.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedTicket(submittedTicket);
                      setActiveTab('track');
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-cinzel font-bold text-amber-400 hover:text-amber-300 hover:underline"
                  >
                    View Ticket Discussion &rarr;
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-cinzel font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Your Callsign / Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Commander Marcus"
                      value={playerCallSign}
                      onChange={(e) => setPlayerCallSign(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-cinzel font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. commander@warofcrowns.com"
                      value={playerEmail}
                      onChange={(e) => setPlayerEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-cinzel font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Roblox Username
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. RobloxUser_123"
                      value={robloxUsername}
                      onChange={(e) => setRobloxUsername(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-cinzel font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Inquiry Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as TicketCategory)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                    >
                      <option value="Roblox Access">Roblox Access & Badges</option>
                      <option value="Bug Report">Bug / Glitch Report</option>
                      <option value="Account Issue">Account & Provisioning</option>
                      <option value="Gameplay Feedback">Gameplay Feedback</option>
                      <option value="Moderation Appeal">Moderation Appeal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-cinzel font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Urgency Level
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as TicketPriority)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                    >
                      <option value="low">Low (General question)</option>
                      <option value="medium">Medium (Standard request)</option>
                      <option value="high">High (Gameplay blocked)</option>
                      <option value="urgent">Urgent (Account lockout)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-cinzel font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Subject Summary *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Unable to enter eastern siege gate in Roblox"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Detailed Description *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Provide full details: What happened? What device were you using? What was the expected behavior?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500 resize-none font-sans"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-cinzel font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 active:scale-95 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Support Ticket</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar Quick Info */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-[#0d1017] border border-slate-800 p-6">
              <h4 className="text-sm font-bold font-cinzel text-white uppercase mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Immediate Assistance</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                For urgent game server issues or match coordination during weekend siege tournaments on Roblox, reach out to community marshals.
              </p>

              <div className="mt-4 space-y-2.5 text-xs text-slate-300 font-mono">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">Average Response:</span>
                  <span className="text-emerald-400 font-bold">&lt; 2 Hours</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">Official Platform:</span>
                  <span className="text-amber-400 font-bold">Roblox</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">Head of Support:</span>
                  <span className="text-white font-bold">Jmodd59 (Creator)</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-amber-950/30 to-purple-950/20 border border-amber-600/30 p-6">
              <h4 className="text-sm font-bold font-cinzel text-white uppercase mb-2">
                Official Roblox Community
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Join our verified Roblox group for direct community updates, player guilds, and bug bounties.
              </p>
              <a
                href="https://www.roblox.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-cinzel font-bold uppercase transition-colors"
              >
                <span>Visit Roblox Group</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRACK TICKET */}
      {activeTab === 'track' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ticket Selector / Search */}
          <div className="rounded-2xl bg-[#0d1017] border border-slate-800 p-6">
            <h3 className="text-base font-bold font-cinzel text-white uppercase mb-3">
              Lookup Your Ticket
            </h3>
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Ticket ID (e.g. TKT-1042) or email..."
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
              {searchedTickets.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No tickets match that query.
                </div>
              ) : (
                searchedTickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedTicket(t);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedTicket?.id === t.id
                        ? 'bg-amber-950/30 border-amber-500/60'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <span className="font-bold text-amber-400">{t.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border ${getStatusBadge(t.status)}`}>
                        {t.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs font-cinzel font-bold text-white truncate">{t.subject}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1 flex items-center justify-between">
                      <span>{t.playerCallSign}</span>
                      <span>{t.createdAt.split(' ')[0]}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Ticket Details View */}
          <div className="lg:col-span-2">
            {selectedTicket ? (
              <div className="rounded-2xl bg-[#0d1017] border border-slate-800 p-6 sm:p-8 flex flex-col justify-between min-h-[520px]">
                <div>
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-mono font-bold text-amber-400">{selectedTicket.id}</span>
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getStatusBadge(selectedTicket.status)}`}>
                          {selectedTicket.status.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getPriorityBadge(selectedTicket.priority)}`}>
                          {selectedTicket.priority}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold font-cinzel text-white mt-1">
                        {selectedTicket.subject}
                      </h3>
                    </div>

                    <div className="text-right text-xs font-mono text-slate-400">
                      <div>Category: <strong className="text-slate-200">{selectedTicket.category}</strong></div>
                      <div>Opened: <span className="text-slate-400">{selectedTicket.createdAt}</span></div>
                    </div>
                  </div>

                  {/* Resolution Notes banner if resolved */}
                  {selectedTicket.resolutionNotes && (
                    <div className="mb-6 p-4 rounded-xl bg-emerald-950/30 border border-emerald-600/50 text-xs">
                      <div className="font-cinzel font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Staff Resolution Decree:</span>
                      </div>
                      <p className="text-slate-200">{selectedTicket.resolutionNotes}</p>
                    </div>
                  )}

                  {/* Message Thread */}
                  <div className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-1">
                    {selectedTicket.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-4 rounded-xl border text-xs leading-relaxed ${
                          msg.role === 'Creator' || msg.role === 'Moderator'
                            ? 'bg-amber-950/20 border-amber-600/40 text-amber-100 ml-4'
                            : 'bg-slate-950 border-slate-800 text-slate-300 mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono mb-2 border-b border-slate-800/60 pb-1.5">
                          <div className="flex items-center gap-1.5 font-bold">
                            {msg.role === 'Creator' && <Crown className="w-3 h-3 text-amber-400" />}
                            <span className={msg.role === 'Creator' ? 'text-amber-400' : 'text-slate-200'}>
                              {msg.sender}
                            </span>
                            <span className="text-[9px] px-1 rounded bg-black/40 text-slate-400 uppercase">
                              {msg.role}
                            </span>
                          </div>
                          <span className="text-slate-500">{msg.timestamp}</span>
                        </div>
                        <p className="whitespace-pre-line">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reply Form */}
                <div className="pt-4 border-t border-slate-800">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add an update or reply to this ticket..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleReplyToTicket(selectedTicket.id);
                      }}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={() => handleReplyToTicket(selectedTicket.id)}
                      className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-cinzel font-bold text-xs uppercase flex items-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 rounded-2xl bg-[#0d1017] border border-slate-800 text-slate-500">
                <Search className="w-10 h-10 mb-3 opacity-40" />
                <h4 className="text-base font-cinzel font-bold text-slate-300 uppercase">No Ticket Selected</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Select a ticket from the left panel or enter your Ticket ID to view the support conversation.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: FAQ */}
      {activeTab === 'faq' && (
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl bg-[#0d1017] border border-slate-800 p-6 sm:p-10 mb-8">
            <h3 className="text-2xl font-bold font-cinzel text-white uppercase text-center mb-2">
              Frequently Answered Inquiries
            </h3>
            <p className="text-xs text-slate-400 text-center mb-8">
              Review common questions regarding the Roblox experience, cross-platform play, and account provisioning.
            </p>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setOpenFaqIndex(openFaqIndex === index ? null : index);
                    }}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-900/50"
                  >
                    <span className="text-sm font-cinzel font-bold text-slate-200">{faq.q}</span>
                    {openFaqIndex === index ? (
                      <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>

                  {openFaqIndex === index && (
                    <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3 animate-fade-in font-sans">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STAFF SUPPORT DESK (Moderators & Creator only) */}
      {activeTab === 'staff' && isStaff && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#0d1017] border border-purple-900/50">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold font-cinzel text-white uppercase">
                Staff Support Queue & Resolution Desk
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {['all', 'open', 'in_progress', 'resolved'].map((f) => (
                <button
                  key={f}
                  onClick={() => setStaffFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase ${
                    staffFilter === f
                      ? 'bg-purple-600 text-white font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {f.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List */}
            <div className="rounded-2xl bg-[#0d1017] border border-slate-800 p-4 space-y-2.5 max-h-[600px] overflow-y-auto">
              {staffFilteredTickets.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-500">
                  No tickets matching {staffFilter}.
                </div>
              ) : (
                staffFilteredTickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      soundManager.playClick();
                      setStaffSelectedTicketId(t.id);
                      setResolutionNoteInput(t.resolutionNotes || '');
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      staffSelectedTicketId === t.id
                        ? 'bg-purple-950/40 border-purple-500'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <span className="font-bold text-amber-400">{t.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border ${getStatusBadge(t.status)}`}>
                        {t.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs font-cinzel font-bold text-white truncate">{t.subject}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">
                      Player: <strong className="text-slate-200">{t.playerCallSign}</strong> {t.robloxUsername && `(@${t.robloxUsername})`}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Manage Active Staff Ticket */}
            <div className="lg:col-span-2">
              {staffActiveTicket ? (
                <div className="rounded-2xl bg-[#0d1017] border border-slate-800 p-6 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-mono font-bold text-amber-400">{staffActiveTicket.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getStatusBadge(staffActiveTicket.status)}`}>
                          {staffActiveTicket.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold font-cinzel text-white mt-1">
                        {staffActiveTicket.subject}
                      </h3>
                      <div className="text-xs text-slate-400 mt-1">
                        From: <strong className="text-white">{staffActiveTicket.playerCallSign}</strong> ({staffActiveTicket.playerEmail})
                      </div>
                    </div>

                    {/* Status Changer */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">Set Status:</span>
                      {(['open', 'in_progress', 'resolved', 'closed'] as TicketStatus[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => {
                            soundManager.playClick();
                            updateTicketStatus(staffActiveTicket.id, st);
                          }}
                          className={`px-2.5 py-1 rounded text-xs font-mono uppercase border ${
                            staffActiveTicket.status === st
                              ? 'bg-purple-600 border-purple-400 text-white font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {st.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Resolution Notes Editor */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <label className="block text-xs font-cinzel font-bold text-slate-300 uppercase">
                      Official Resolution Note
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Account crest unlocked manually via Roblox Profile ID #4819."
                        value={resolutionNoteInput}
                        onChange={(e) => setResolutionNoteInput(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg bg-[#0d1017] border border-slate-700 text-xs text-white"
                      />
                      <button
                        onClick={() => {
                          soundManager.playFanfare();
                          updateTicketStatus(staffActiveTicket.id, 'resolved', resolutionNoteInput);
                        }}
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-cinzel font-bold uppercase"
                      >
                        Save & Resolve
                      </button>
                    </div>
                  </div>

                  {/* Thread */}
                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                    {staffActiveTicket.messages.map((m) => (
                      <div key={m.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                          <strong className="text-amber-400">{m.sender} ({m.role})</strong>
                          <span>{m.timestamp}</span>
                        </div>
                        <p className="text-slate-200">{m.message}</p>
                      </div>
                    ))}
                  </div>

                  {/* Staff Reply */}
                  <div className="pt-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="Post official staff reply..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleReplyToTicket(staffActiveTicket.id);
                      }}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={() => handleReplyToTicket(staffActiveTicket.id)}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-cinzel font-bold text-xs uppercase"
                    >
                      Send Staff Reply
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-12 rounded-2xl bg-[#0d1017] border border-slate-800 text-slate-500 text-xs font-mono">
                  Select a ticket from the left queue to review or resolve.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
