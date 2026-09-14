export interface Unit {
  id: string;
  name: string;
  category: 'Infantry' | 'Cavalry' | 'Ranged' | 'Arcane' | 'Siege';
  factionId: string;
  role: string;
  attack: number;
  defense: number;
  range: number;
  mobility: number;
  morale: number;
  specialAbility: string;
  abilityDescription: string;
  lore: string;
  image?: string;
}

export interface Faction {
  id: string;
  name: string;
  subtitle: string;
  motto: string;
  crest: string;
  primaryColor: string;
  accentColor: string;
  bannerGradient: string;
  leader: {
    name: string;
    title: string;
    description: string;
  };
  summary: string;
  combatPhilosophy: string;
  crownPower: {
    name: string;
    effect: string;
    flavor: string;
  };
  pros: string[];
  cons: string[];
  bannerImage: string;
  units: Unit[];
}

export interface Province {
  id: string;
  name: string;
  title: string;
  controller: string;
  controllerColor: string;
  x: number; // percentage on map
  y: number;
  defenseLevel: 'Tier I: Outpost' | 'Tier II: Castle' | 'Tier III: High Citadel';
  resourceYield: string;
  garrison: string;
  strategicImportance: string;
  lore: string;
}

export interface GameEdition {
  id: string;
  name: string;
  price: string;
  badge?: string;
  isPopular?: boolean;
  description: string;
  perks: string[];
}

export interface NewsArticle {
  id: string;
  title: string;
  category: 'Dev Diary' | 'Major Update' | 'Lore Codex' | 'Community';
  date: string;
  readTime: string;
  excerpt: string;
  tag: string;
}

export interface TacticalEntity {
  id: string;
  name: string;
  house: 'valerius' | 'korvath';
  type: 'commander' | 'knight' | 'archer' | 'mage';
  x: number; // grid coordinate 0-5
  y: number; // grid coordinate 0-3
  maxHp: number;
  currentHp: number;
  attack: number;
  range: number;
  movement: number;
  isAlive: boolean;
  hasActed: boolean;
  crownAbilityAvailable: boolean;
}

export type UserRole = 'creator' | 'moderator' | 'commander' | 'alpha_tester' | 'guild_officer';
export type AllegianceHouse = 'valerius' | 'korvath' | 'sylvane' | 'solgard';

export interface UserAccount {
  id: string;
  username: string;
  callSign: string;
  email: string;
  password?: string;
  role: UserRole;
  house: AllegianceHouse;
  clearanceLevel: number; // 1 to 4
  status: 'active' | 'suspended';
  createdBy: string; // Name/Callsign of the moderator who created this account
  createdById: string;
  createdAt: string;
  lastLoginAt?: string;
  notes?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  moderatorName: string;
  action: string;
  targetUser: string;
  details: string;
}

export type AnnouncementCategory = 'Update' | 'Event' | 'Maintenance' | 'Community' | 'Important';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  authorCallSign: string;
  authorRole: UserRole;
  authorId: string;
  isPinned: boolean;
  createdAt: string;
  tags: string[];
  viewsCount?: number;
}

export type TicketCategory = 'Roblox Access' | 'Bug Report' | 'Account Issue' | 'Gameplay Feedback' | 'Moderation Appeal';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface TicketMessage {
  id: string;
  sender: string;
  role: string;
  message: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  playerCallSign: string;
  playerEmail: string;
  robloxUsername?: string;
  description: string;
  createdAt: string;
  assignedModerator?: string;
  resolutionNotes?: string;
  messages: TicketMessage[];
}

