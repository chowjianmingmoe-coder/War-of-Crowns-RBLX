import React, { useState } from 'react';
import { 
  Megaphone, 
  Pin, 
  Plus, 
  Trash2, 
  Search, 
  Tag, 
  Clock, 
  User, 
  Crown, 
  Shield, 
  CheckCircle2, 
  X, 
  Sparkles,
  AlertCircle,
  Eye,
  Filter
} from 'lucide-react';
import { useAnnouncements } from '../utils/announcementsContext';
import { useAuth } from '../utils/authContext';
import { AnnouncementCategory } from '../types';
import { soundManager } from '../utils/audio';

interface AnnouncementsPageProps {
  onOpenAuth: () => void;
}

export const AnnouncementsPage: React.FC<AnnouncementsPageProps> = ({ onOpenAuth }) => {
  const {
    announcements,
    addAnnouncement,
    deleteAnnouncement,
    togglePinAnnouncement,
    canCreateAnnouncement,
    canDeleteAnnouncement,
  } = useAnnouncements();
  const { currentUser } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<any | null>(null);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState<string | null>(null);

  // New announcement form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<AnnouncementCategory>('Update');
  const [tagsInput, setTagsInput] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const categories: { label: string; value: string }[] = [
    { label: 'All Dispatches', value: 'all' },
    { label: 'Updates', value: 'Update' },
    { label: 'Events', value: 'Event' },
    { label: 'Maintenance', value: 'Maintenance' },
    { label: 'Community', value: 'Community' },
    { label: 'Important', value: 'Important' },
  ];

  const filteredAnnouncements = announcements
    .filter((a) => {
      if (selectedCategory !== 'all' && a.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = a.title.toLowerCase().includes(q);
        const matchesContent = a.content.toLowerCase().includes(q);
        const matchesTag = a.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesContent && !matchesTag) return false;
      }
      return true;
    })
    .sort((a, b) => {
      // Pinned first, then by date
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const res = addAnnouncement({
      title,
      content,
      category,
      tags,
      isPinned
    });

    if (!res.success) {
      setFormError(res.error || 'Failed to publish announcement.');
      return;
    }

    soundManager.playFanfare();
    setPublishSuccess(true);
    setTimeout(() => {
      setPublishSuccess(false);
      setIsCreateModalOpen(false);
      setTitle('');
      setContent('');
      setTagsInput('');
      setIsPinned(false);
    }, 1200);
  };

  const getCategoryBadgeClass = (cat: AnnouncementCategory) => {
    switch (cat) {
      case 'Important':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'Event':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Update':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Maintenance':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'Community':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0d1017] via-[#141824] to-[#0d1017] border border-amber-900/40 p-8 sm:p-12 mb-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/70 border border-amber-600/40 text-amber-300 text-xs font-cinzel font-semibold uppercase tracking-widest mb-3">
              <Megaphone className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Roblox War of Crowns Chronicles</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-cinzel text-white uppercase tracking-tight">
              Royal Announcements
            </h1>
            <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Live updates, patch notes, upcoming Roblox siege events, and high council decrees.
            </p>
          </div>

          {/* Action Bar: Create Announcement if Moderator or Creator (Completely invisible to members) */}
          <div className="flex items-center gap-3">
            {canCreateAnnouncement && (
              <button
                id="btn-create-announcement"
                onClick={() => {
                  soundManager.playClick();
                  setIsCreateModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-cinzel font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-950/60 hover:scale-105 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create Announcement</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                soundManager.playClick();
                setSelectedCategory(cat.value);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold uppercase tracking-wider transition-all border ${
                selectedCategory === cat.value
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm shadow-amber-950'
                  : 'bg-[#0d1017] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dispatches or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0d1017] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-6">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-2xl bg-[#0d1017] border border-slate-800">
            <Megaphone className="w-12 h-12 text-slate-600 mx-auto mb-3 opacity-60" />
            <h4 className="text-lg font-cinzel font-bold text-white uppercase">No Announcements Found</h4>
            <p className="text-xs text-slate-400 mt-1">
              No official dispatches match your selected filter or search query.
            </p>
          </div>
        ) : (
          filteredAnnouncements.map((item) => (
            <article
              key={item.id}
              className={`rounded-2xl border transition-all p-6 sm:p-8 relative overflow-hidden ${
                item.isPinned
                  ? 'bg-gradient-to-br from-[#101420] via-[#0d1017] to-[#0a0c13] border-amber-600/50 shadow-xl shadow-amber-950/20'
                  : 'bg-[#0d1017] border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Pinned Crown Accent */}
              {item.isPinned && (
                <div className="absolute top-0 right-0">
                  <div className="bg-gradient-to-l from-amber-500/20 to-transparent py-1.5 px-4 rounded-bl-xl border-l border-b border-amber-500/30 flex items-center gap-1.5 text-[11px] font-cinzel font-bold text-amber-300 uppercase tracking-wider">
                    <Pin className="w-3 h-3 text-amber-400" />
                    <span>Pinned Announcement</span>
                  </div>
                </div>
              )}

              {/* Top metadata row */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase border ${getCategoryBadgeClass(item.category)}`}>
                  {item.category}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{item.createdAt}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>By <strong className="text-white">{item.authorCallSign}</strong></span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 uppercase font-bold">
                    {item.authorRole === 'creator' ? 'Lead Creator' : 'Moderator'}
                  </span>
                </div>

                {item.viewsCount !== undefined && (
                  <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 font-mono ml-auto">
                    <Eye className="w-3 h-3" />
                    <span>{item.viewsCount} reads</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold font-cinzel text-white leading-snug mb-3">
                {item.title}
              </h3>

              {/* Content with whitespace formatting */}
              <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-light mb-6">
                {item.content}
              </div>

              {/* Footer: Tags & Staff Controls */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-500 mr-1" />
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Moderator & Creator Controls (Invincible & Invisible to members) */}
                {canDeleteAnnouncement && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        togglePinAnnouncement(item.id);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1 border transition-colors ${
                        item.isPinned
                          ? 'bg-amber-950/40 border-amber-600/40 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                      title={item.isPinned ? 'Unpin dispatch' : 'Pin dispatch to top'}
                    >
                      <Pin className="w-3 h-3" />
                      <span>{item.isPinned ? 'Unpin' : 'Pin'}</span>
                    </button>

                    <button
                      id={`btn-delete-announcement-${item.id}`}
                      onClick={() => {
                        soundManager.playClick();
                        setAnnouncementToDelete(item);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-700/60 text-red-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors shadow-sm"
                      title="Delete this announcement permanently"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))
        )}
      </div>

      {/* Custom In-App Deletion Confirmation Modal */}
      {announcementToDelete && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="max-w-md w-full rounded-2xl bg-[#0e121a] border-2 border-red-600/70 p-6 sm:p-8 shadow-2xl relative text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto mb-4 text-red-400 shadow-lg shadow-red-950">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black font-cinzel text-white uppercase mb-2">
              Delete Announcement?
            </h3>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Are you sure you want to permanently delete dispatch <br />
              <strong className="text-red-300 text-sm font-semibold">"{announcementToDelete.title}"</strong>? <br />
              <span className="text-slate-400 text-[11px] mt-1 block">This action is irreversible and removes it for all commanders.</span>
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setAnnouncementToDelete(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white font-cinzel font-semibold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-confirm-delete-announcement"
                onClick={() => {
                  soundManager.playSwordClash();
                  const deletedTitle = announcementToDelete.title;
                  const res = deleteAnnouncement(announcementToDelete.id);
                  if (res.success) {
                    setDeleteSuccessMsg(`Announcement "${deletedTitle}" permanently deleted.`);
                    setTimeout(() => setDeleteSuccessMsg(null), 4000);
                  }
                  setAnnouncementToDelete(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-cinzel font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-950/80 transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Deletion Toast */}
      {deleteSuccessMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-red-950/95 border border-red-500/70 text-red-200 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{deleteSuccessMsg}</span>
        </div>
      )}

      {/* Authoring Modal (Moderators & Creator only) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="max-w-2xl w-full rounded-2xl bg-[#0e121a] border-2 border-amber-600/50 p-6 sm:p-8 shadow-2xl relative">
            {/* Close */}
            <button
              onClick={() => {
                soundManager.playClick();
                setIsCreateModalOpen(false);
              }}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-cinzel text-white uppercase">
                  Publish Royal Announcement
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Posting as {currentUser?.callSign} ({currentUser?.role})
                </p>
              </div>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-800 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {publishSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-700 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Announcement published to Roblox players worldwide!</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-cinzel font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Announcement Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weekend Fortress Siege: High Crown Event on Roblox"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-cinzel font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Dispatch Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AnnouncementCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="Update">Update (Patch Notes & Features)</option>
                    <option value="Event">Event (Roblox Sieges & Tournaments)</option>
                    <option value="Maintenance">Maintenance (Server Downtime)</option>
                    <option value="Community">Community (Guides & Spotlights)</option>
                    <option value="Important">Important (Critical Decrees)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-cinzel font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Roblox, Siege, Patch 1.5"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-cinzel font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Announcement Body Content
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Draft the details of the announcement, battle directives, or Roblox patch notes..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500 resize-none font-sans"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-pin-announcement"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="chk-pin-announcement" className="text-xs text-slate-300 cursor-pointer font-cinzel">
                  Pin this announcement to the very top of the chronicle
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 text-slate-950 font-cinzel font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-md shadow-amber-950"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Publish Announcement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
