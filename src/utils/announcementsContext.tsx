import React, { createContext, useContext, useState, useEffect } from 'react';
import { Announcement, AnnouncementCategory, UserRole } from '../types';
import { useAuth } from './authContext';

interface CreateAnnouncementPayload {
  title: string;
  content: string;
  category: AnnouncementCategory;
  isPinned: boolean;
  tags: string[];
}

interface AnnouncementsContextType {
  announcements: Announcement[];
  addAnnouncement: (payload: CreateAnnouncementPayload) => { success: boolean; error?: string };
  deleteAnnouncement: (id: string) => { success: boolean; error?: string };
  togglePinAnnouncement: (id: string) => void;
  canCreateAnnouncement: boolean;
  canDeleteAnnouncement: boolean;
}

const STORAGE_KEY = 'woc_announcements_v1';

const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Grand Siege Tournament: Weekend Crown Skirmishes on Roblox',
    content: `Attention all House commanders and auxiliary vanguards! This coming Saturday at 18:00 UTC, the High Citadel gates will open for our first 100-player Roblox Siege Tournament.\n\nAll four great houses will clash on the contested Dragonfang Chokepoint map. Players defending their guild fortresses for 30 consecutive minutes will earn exclusive golden heraldic sigils for their Roblox avatars.\n\nMake sure your tactical squad has reviewed the updated phalanx combat rules in the codex!`,
    category: 'Event',
    authorCallSign: 'Jmodd59 (Creator)',
    authorRole: 'creator',
    authorId: 'usr-creator-jmodd59',
    isPinned: true,
    createdAt: '2026-09-14 02:00 UTC',
    tags: ['Roblox Event', 'Siege Tournament', 'Golden Sigils'],
    viewsCount: 1420
  },
  {
    id: 'ann-2',
    title: 'Roblox Engine Update 1.4.0: Shading Optimization & Unit Pathfinding',
    content: `We have deployed Patch 1.4.0 live to the Roblox experience servers. Key enhancements:\n\n• Unit Pathfinding: Phalanx formations and heavy cavalry will no longer bottleneck at narrow castle drawbridges.\n• Real-Time Lighting: Enhanced dynamic torchlight and spell bloom during night siege phases.\n• Mobile & Console Optimization: Decreased memory footprint by 24% on iOS and tablet devices.\n\nNo app download is required—simply join the Roblox game to immediately experience the latest server build.`,
    category: 'Update',
    authorCallSign: 'Jmodd59 (Creator)',
    authorRole: 'creator',
    authorId: 'usr-creator-jmodd59',
    isPinned: true,
    createdAt: '2026-09-13 19:30 UTC',
    tags: ['Patch Notes', 'Engine 1.4', 'Roblox Performance'],
    viewsCount: 2850
  },
  {
    id: 'ann-3',
    title: 'Scheduled Roblox Experience Maintenance: Matchmaking Gateway',
    content: `A brief 15-minute server reboot is scheduled for Tuesday at 06:00 UTC to scale our matchmaking lobbies for peak weekend hours. Ongoing battles will conclude gracefully before server restarts. Thank you for your patience!`,
    category: 'Maintenance',
    authorCallSign: 'Jmodd59 (Creator)',
    authorRole: 'creator',
    authorId: 'usr-creator-jmodd59',
    isPinned: false,
    createdAt: '2026-09-12 11:00 UTC',
    tags: ['Maintenance', 'Servers'],
    viewsCount: 930
  },
  {
    id: 'ann-4',
    title: 'Community Dispatch: House Sylvane Strategy Guide Published',
    content: `Huntmaster Elyas has penned a comprehensive tactical breakdown of House Sylvane’s ambush tactics in dense forest terrain. Learn how to bait heavy Valerius shock knights into river mire and utilize extended longbow volleys to shatter enemy morale.`,
    category: 'Community',
    authorCallSign: 'Jmodd59 (Creator)',
    authorRole: 'creator',
    authorId: 'usr-creator-jmodd59',
    isPinned: false,
    createdAt: '2026-09-11 14:15 UTC',
    tags: ['Strategy', 'House Sylvane', 'Guides'],
    viewsCount: 1740
  }
];

const AnnouncementsContext = createContext<AnnouncementsContextType | null>(null);

export const AnnouncementsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
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
    return SEED_ANNOUNCEMENTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements));
    } catch (err) {
      console.error('Failed to save announcements', err);
    }
  }, [announcements]);

  const canCreateAnnouncement = Boolean(
    currentUser && (currentUser.role === 'creator' || currentUser.role === 'moderator')
  );

  const addAnnouncement = (payload: CreateAnnouncementPayload) => {
    if (!currentUser || !canCreateAnnouncement) {
      return { success: false, error: 'Only Moderators and the Creator have clearance to post announcements.' };
    }

    if (!payload.title.trim()) {
      return { success: false, error: 'Announcement title is required.' };
    }

    if (!payload.content.trim()) {
      return { success: false, error: 'Announcement content cannot be empty.' };
    }

    const newAnnouncement: Announcement = {
      id: `ann-${Date.now()}`,
      title: payload.title.trim(),
      content: payload.content.trim(),
      category: payload.category,
      authorCallSign: currentUser.callSign,
      authorRole: currentUser.role,
      authorId: currentUser.id,
      isPinned: payload.isPinned,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      tags: payload.tags.length > 0 ? payload.tags : ['Roblox Official'],
      viewsCount: 1
    };

    setAnnouncements((prev) => [newAnnouncement, ...prev]);
    return { success: true };
  };

  const deleteAnnouncement = (id: string) => {
    if (!canCreateAnnouncement) {
      return { success: false, error: 'Unauthorized to delete announcements.' };
    }

    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    return { success: true };
  };

  const togglePinAnnouncement = (id: string) => {
    if (!canCreateAnnouncement) return;

    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a))
    );
  };

  return (
    <AnnouncementsContext.Provider
      value={{
        announcements,
        addAnnouncement,
        deleteAnnouncement,
        togglePinAnnouncement,
        canCreateAnnouncement,
        canDeleteAnnouncement: canCreateAnnouncement,
      }}
    >
      {children}
    </AnnouncementsContext.Provider>
  );
};

export const useAnnouncements = () => {
  const context = useContext(AnnouncementsContext);
  if (!context) {
    throw new Error('useAnnouncements must be used within an AnnouncementsProvider');
  }
  return context;
};
