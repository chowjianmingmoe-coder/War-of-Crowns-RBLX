import React, { useState } from 'react';
import { useAuth } from '../utils/authContext';
import { UserRole, AllegianceHouse, UserAccount } from '../types';
import { soundManager } from '../utils/audio';
import {
  X,
  Shield,
  Crown,
  UserPlus,
  Users,
  FileText,
  Copy,
  Check,
  Search,
  Lock,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  Sliders,
} from 'lucide-react';

interface ModeratorPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModeratorPortalModal: React.FC<ModeratorPortalModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentUser,
    users,
    auditLogs,
    isModerator,
    createUser,
    updateUserStatus,
    resetUserPassword,
    deleteUser,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'create' | 'roster' | 'audit'>('create');

  // Form state for creating a user
  const [formEmail, setFormEmail] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formCallSign, setFormCallSign] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('commander');
  const [formHouse, setFormHouse] = useState<AllegianceHouse>('valerius');
  const [formClearance, setFormClearance] = useState<number>(2);
  const [formNotes, setFormNotes] = useState('');

  const [createdFeedback, setCreatedFeedback] = useState<UserAccount | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Roster search / filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [houseFilter, setHouseFilter] = useState<string>('all');

  // Password reset inline state
  const [resettingUserId, setResettingUserId] = useState<string | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [userToDelete, setUserToDelete] = useState<UserAccount | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGeneratePassword = () => {
    soundManager.playClick();
    const adjectives = ['Iron', 'Valiant', 'Shadow', 'Golden', 'Vanguard', 'Silent'];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const pass = `${randomAdj}${randomNum}!`;
    setFormPassword(pass);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setCreatedFeedback(null);

    if (!formPassword) {
      setFormError('Please enter or generate a password for this user.');
      return;
    }

    const res = createUser({
      email: formEmail,
      username: formUsername,
      callSign: formCallSign || formUsername,
      password: formPassword,
      role: formRole,
      house: formHouse,
      clearanceLevel: Number(formClearance),
      notes: formNotes,
    });

    if (!res.success) {
      soundManager.playSwordClash();
      setFormError(res.error || 'Failed to create user.');
    } else {
      soundManager.playFanfare();
      setCreatedFeedback(res.user || null);
      // Reset form fields
      setFormEmail('');
      setFormUsername('');
      setFormCallSign('');
      setFormPassword('');
      setFormNotes('');
    }
  };

  const handleCopyCredentials = (account: UserAccount) => {
    soundManager.playClick();
    const textToCopy = `WAR OF CROWNS AUTHORIZED CREDENTIALS\nEmail: ${account.email}\nPassword: ${account.password}\nRole: ${account.role.toUpperCase()}\nAllegiance: HOUSE ${account.house.toUpperCase()}\nClearance: Level ${account.clearanceLevel}\nAuthorized by: ${account.createdBy}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.callSign.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesHouse = houseFilter === 'all' || u.house === houseFilter;
    return matchesSearch && matchesRole && matchesHouse;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in overflow-y-auto">
      <div className="relative max-w-4xl w-full bg-[#0d1017] border-2 border-amber-600/60 rounded-2xl p-5 sm:p-8 shadow-2xl shadow-amber-950/80 my-auto flex flex-col max-h-[90vh]">
        {/* Header bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 p-[1px] shadow-lg shadow-amber-950">
              <div className="w-full h-full bg-[#0d1017] rounded-[11px] flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black font-cinzel text-white uppercase">
                  {currentUser?.role === 'creator' ? 'Creator Command Console' : 'Moderator Command Console'}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                  {currentUser?.role === 'creator' ? 'Clearance Level 5' : 'Clearance Level 4'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                User Provisioning, Roblox Game Access, and Security Control
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 gap-2 mt-4">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('create');
            }}
            className={`px-4 py-2.5 font-cinzel font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'create'
                ? 'border-amber-500 text-amber-400 bg-amber-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Provision User Account</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('roster');
            }}
            className={`px-4 py-2.5 font-cinzel font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'roster'
                ? 'border-amber-500 text-amber-400 bg-amber-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Commander Directory ({users.length})</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('audit');
            }}
            className={`px-4 py-2.5 font-cinzel font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'audit'
                ? 'border-amber-500 text-amber-400 bg-amber-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Security Audit Log ({auditLogs.length})</span>
          </button>
        </div>

        {/* Tab 1: Provision New User */}
        {activeTab === 'create' && (
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <strong className="text-amber-300 block font-cinzel font-semibold">
                Authorization Notice:
              </strong>
              Only you and appointed High Moderators have permission to create accounts. Once provisioned,
              deliver the credentials to the commander so they can authenticate via the login terminal.
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-xs text-red-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {createdFeedback && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-xs text-emerald-200 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-cinzel font-bold text-sm text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Account Provisioned Successfully!
                  </span>
                  <button
                    onClick={() => handleCopyCredentials(createdFeedback)}
                    className="px-3 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-mono text-[11px]"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey ? 'Copied to Clipboard!' : 'Copy Credentials'}</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] bg-black/40 p-2.5 rounded-lg border border-emerald-800/40">
                  <div>
                    <span className="text-slate-400 block text-[9px]">CALL-SIGN</span>
                    <strong className="text-white">{createdFeedback.callSign}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">EMAIL</span>
                    <strong className="text-white truncate block">{createdFeedback.email}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">PASSWORD</span>
                    <strong className="text-amber-300">{createdFeedback.password}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">ROLE</span>
                    <strong className="text-cyan-300 uppercase">{createdFeedback.role}</strong>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-cinzel font-bold text-slate-300 uppercase tracking-wider mb-1">
                  User Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="commander.name@domain.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Commander Call-Sign / Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Knight Captain Ronald"
                  value={formCallSign}
                  onChange={(e) => setFormCallSign(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Username Identifier
                </label>
                <input
                  type="text"
                  placeholder="e.g. ronald_valerius"
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-sans"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-cinzel font-bold text-slate-300 uppercase tracking-wider">
                    Initial Security Password *
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[10px] text-amber-400 hover:text-amber-300 font-mono underline"
                  >
                    Generate Random
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Min 6 characters (e.g. Iron9482!)"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 placeholder-slate-500 text-xs sm:text-sm font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel font-bold text-slate-300 uppercase tracking-wider mb-1">
                  User Role
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-sans"
                >
                  <option value="commander">Tactical Commander (Standard)</option>
                  <option value="alpha_tester">Playtester (Roblox Experience Testing)</option>
                  <option value="guild_officer">Guild Officer (War Council)</option>
                  <option value="moderator">Appointed Moderator (User Provisioning)</option>
                  {currentUser?.role === 'creator' && (
                    <option value="creator">Creator (Developer / Supreme Admin)</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-cinzel font-bold text-slate-300 uppercase tracking-wider mb-1">
                  House Allegiance
                </label>
                <select
                  value={formHouse}
                  onChange={(e) => setFormHouse(e.target.value as AllegianceHouse)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-sans"
                >
                  <option value="valerius">House Valerius (Iron Lion)</option>
                  <option value="korvath">House Korvath (Obsidian Raven)</option>
                  <option value="sylvane">House Sylvane (Verdant Stag)</option>
                  <option value="solgard">House Solgard (Gilded Gryphon)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-cinzel font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Clearance Level (1 to 5)
                </label>
                <select
                  value={formClearance}
                  onChange={(e) => setFormClearance(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-sans"
                >
                  <option value={1}>Level 1: Recruit / Auxiliary</option>
                  <option value={2}>Level 2: Field Vanguard / Playtester</option>
                  <option value={3}>Level 3: Senior Commander</option>
                  <option value={4}>Level 4: High Council / Moderator</option>
                  {currentUser?.role === 'creator' && (
                    <option value={5}>Level 5: Supreme Creator / Studio Lead</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-cinzel font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Deployment Notes / Division
                </label>
                <input
                  type="text"
                  placeholder="e.g. Assigned to Roblox Fortress Siege Squad"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-sans"
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-cinzel font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-950/60 flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Authorize & Commission New User Account</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Commander Directory */}
        {activeTab === 'roster' && (
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            {/* Search and filters */}
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by callsign, email, or username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300"
                >
                  <option value="all">All Roles</option>
                  <option value="creator">Creators</option>
                  <option value="moderator">Moderators</option>
                  <option value="commander">Commanders</option>
                  <option value="alpha_tester">Playtesters</option>
                  <option value="guild_officer">Guild Officers</option>
                </select>

                <select
                  value={houseFilter}
                  onChange={(e) => setHouseFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300"
                >
                  <option value="all">All Houses</option>
                  <option value="valerius">Valerius</option>
                  <option value="korvath">Korvath</option>
                  <option value="sylvane">Sylvane</option>
                  <option value="solgard">Solgard</option>
                </select>
              </div>
            </div>

            {/* Users list */}
            <div className="space-y-2.5">
              {filteredUsers.map((u) => {
                const isCurrent = currentUser?.id === u.id;
                const isResetting = resettingUserId === u.id;

                return (
                  <div
                    key={u.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      u.status === 'suspended'
                        ? 'bg-red-950/20 border-red-800/40 opacity-70'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-cinzel font-bold text-amber-400 text-xs uppercase">
                          {u.house.substring(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-cinzel font-bold text-white text-sm">
                              {u.callSign}
                            </span>
                            <span
                              className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                                u.role === 'creator'
                                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50 shadow-sm shadow-amber-950'
                                  : u.role === 'moderator'
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : u.role === 'alpha_tester'
                                  ? 'bg-purple-500/20 text-purple-300'
                                  : 'bg-blue-500/20 text-blue-300'
                              }`}
                            >
                              {u.role === 'creator' ? 'Lead Creator' : u.role.replace('_', ' ')}
                            </span>
                            {u.status === 'suspended' && (
                              <span className="text-[9px] font-mono bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">
                                SUSPENDED
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">{u.email}</p>
                        </div>
                      </div>

                      {/* Info metrics */}
                      <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                        <div className="text-right hidden sm:block">
                          <span className="block text-[9px] text-slate-500">PROVISIONED BY</span>
                          <span className="text-slate-300">{u.createdBy}</span>
                        </div>
                        <div className="text-right hidden md:block">
                          <span className="block text-[9px] text-slate-500">CLEARANCE</span>
                          <span className="text-amber-300">Level {u.clearanceLevel}</span>
                        </div>
                      </div>

                      {/* Management Actions */}
                      <div className="flex items-center gap-1.5 ml-auto">
                        <button
                          onClick={() => handleCopyCredentials(u)}
                          title="Copy account credentials to send to user"
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-mono hidden sm:inline">Creds</span>
                        </button>

                        <button
                          onClick={() => {
                            soundManager.playClick();
                            setResettingUserId(isResetting ? null : u.id);
                            setNewPasswordInput('');
                          }}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 hover:bg-slate-800 text-xs flex items-center gap-1"
                          title="Reset Password"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-mono hidden sm:inline">Pass</span>
                        </button>

                        {!isCurrent && u.role !== 'creator' && (
                          <button
                            onClick={() => {
                              soundManager.playClick();
                              updateUserStatus(u.id, u.status === 'active' ? 'suspended' : 'active');
                            }}
                            className={`p-1.5 rounded-lg text-xs font-mono text-[10px] border ${
                              u.status === 'active'
                                ? 'bg-amber-950/40 border-amber-700/50 text-amber-300 hover:bg-amber-900/40'
                                : 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/40'
                            }`}
                          >
                            {u.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        )}

                        {!isCurrent && u.role !== 'creator' && (
                          <button
                            onClick={() => {
                              soundManager.playClick();
                              setUserToDelete(u);
                            }}
                            className="p-1.5 rounded-lg bg-red-950/40 border border-red-800/40 text-red-400 hover:bg-red-900/40 text-xs"
                            title="Revoke / Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Inline password reset box */}
                    {isResetting && (
                      <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 animate-fade-in">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="New secure password (min 6 chars)..."
                            value={newPasswordInput}
                            onChange={(e) => {
                              setNewPasswordInput(e.target.value);
                              setResetError(null);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-amber-300 font-mono flex-1 focus:outline-none focus:border-amber-500"
                          />
                          <button
                            onClick={() => {
                              if (newPasswordInput.length >= 6) {
                                soundManager.playFanfare();
                                resetUserPassword(u.id, newPasswordInput);
                                setResettingUserId(null);
                                setResetError(null);
                              } else {
                                setResetError('Password must be at least 6 characters.');
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-cinzel font-bold text-xs"
                          >
                            Save New Password
                          </button>
                        </div>
                        {resetError && (
                          <p className="text-[11px] text-red-400">{resetError}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Security Audit Log */}
        {activeTab === 'audit' && (
          <div className="flex-1 overflow-y-auto py-4 space-y-2 pr-1">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono mb-3">
              Immutable ledger of moderator authorizations, user commissions, and security access logs.
            </div>

            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold text-[10px]">
                      {log.action}
                    </span>
                    <span className="text-white font-semibold">{log.targetUser}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1">{log.details}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block">{log.timestamp}</span>
                  <span className="text-[10px] text-amber-300 font-semibold">
                    By: {log.moderatorName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* User Deletion Confirmation Modal */}
        {userToDelete && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="max-w-md w-full rounded-2xl bg-[#0e121a] border-2 border-red-600/70 p-6 text-center shadow-2xl">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto mb-3 text-red-400">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-cinzel font-bold text-white text-lg uppercase mb-2">
                Revoke Account Authorization?
              </h3>
              <p className="text-xs text-slate-300 mb-5 leading-relaxed">
                Permanently revoke credentials for <strong className="text-red-300">{userToDelete.callSign}</strong> ({userToDelete.email})? This user will no longer be able to log into War of Crowns.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setUserToDelete(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white font-cinzel uppercase"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playSwordClash();
                    deleteUser(userToDelete.id);
                    setUserToDelete(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-cinzel font-bold text-xs uppercase shadow-md shadow-red-950"
                >
                  Confirm Revocation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
