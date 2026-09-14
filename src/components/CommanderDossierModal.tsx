import React from 'react';
import { useAuth } from '../utils/authContext';
import { soundManager } from '../utils/audio';
import {
  X,
  Shield,
  Crown,
  Gamepad2,
  ExternalLink,
  LogOut,
  Sparkles,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface CommanderDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenModeratorPortal: () => void;
}

export const CommanderDossierModal: React.FC<CommanderDossierModalProps> = ({
  isOpen,
  onClose,
  onOpenModeratorPortal,
}) => {
  const { currentUser, logout, isModerator } = useAuth();

  if (!isOpen || !currentUser) return null;

  const houseNames = {
    valerius: 'House Valerius • The Iron Lion',
    korvath: 'House Korvath • The Obsidian Raven',
    sylvane: 'House Sylvane • The Verdant Stag',
    solgard: 'House Solgard • The Gilded Gryphon',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in overflow-y-auto">
      <div className="relative max-w-2xl w-full bg-[#0d1017] border border-amber-600/50 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-amber-950/70 my-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Heraldic Rank */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-700 p-[1px] shadow-lg shadow-amber-950">
              <div className="w-full h-full bg-[#0d1017] rounded-[11px] flex items-center justify-center font-cinzel font-bold text-lg text-amber-400">
                {currentUser.role === 'creator' ? 'CR' : currentUser.house.substring(0, 2).toUpperCase()}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black font-cinzel text-white">
                  {currentUser.callSign}
                </h3>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  currentUser.role === 'creator'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/60'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}>
                  {currentUser.role === 'creator' ? 'Lead Creator' : currentUser.role.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentUser.role === 'creator' ? 'War of Crowns Roblox Development Studio' : houseNames[currentUser.house]}
              </p>
            </div>
          </div>

          {/* Sign out button */}
          <button
            onClick={() => {
              soundManager.playClick();
              logout();
              onClose();
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-red-500/60 hover:text-red-300 text-slate-400 text-xs font-cinzel font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Commission Verification Badge */}
        <div className="my-5 p-3.5 rounded-xl bg-slate-950 border border-amber-800/40 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500 block">
              AUTHORIZATION & SECURITY DOSSIER
            </span>
            <span className="text-slate-200 font-mono">
              {isModerator ? (
                <>
                  Role: <strong className="text-amber-300 uppercase">{currentUser.role}</strong> • Clearance Level {currentUser.clearanceLevel}
                </>
              ) : (
                <>
                  Commission: <strong className="text-amber-300 uppercase">{currentUser.callSign}</strong> • Status Verified
                </>
              )}
            </span>
          </div>
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono font-bold text-[11px] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE CREDENTIAL
          </span>
        </div>

        {/* Moderator / Creator Actions Quick Launcher */}
        {isModerator && (
          <div className="mb-5 p-4 rounded-xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-yellow-950/40 border border-amber-500/60 flex items-center justify-between">
            <div>
              <h4 className="font-cinzel font-bold text-white text-sm flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400" />
                {currentUser.role === 'creator' ? 'Creator Authority Active' : 'Moderator Authority Active'}
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                {currentUser.role === 'creator'
                  ? 'Supreme administrative permissions enabled. Provision and oversee moderators and commanders.'
                  : 'You have permission to provision and manage authorized accounts for the realm.'}
              </p>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
                onOpenModeratorPortal();
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-cinzel font-bold text-xs uppercase tracking-wider shrink-0 transition-transform active:scale-95 shadow-md shadow-amber-950"
            >
              {currentUser.role === 'creator' ? 'Open Creator Console' : 'Open Moderator Console'}
            </button>
          </div>
        )}

        {/* Roblox Game Experience Access (NO INSTALLATION REQUIRED) */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-cinzel font-bold text-white text-sm flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-amber-400" /> War of Crowns on Roblox
            </h4>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded">
              No Installation Required
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            War of Crowns is a game on <strong className="text-slate-200">Roblox</strong> — no app download or local installer needed. Launch directly into live battle lobbies, fortress sieges, and turn-based skirmishes across PC, Mac, mobile, tablet, and console via Roblox.
          </p>

          <a
            href="https://www.roblox.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playFanfare()}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-cinzel font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-950/50 hover:scale-[1.01] active:scale-98"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Launch War of Crowns on Roblox</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Classified War Council Briefing */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
          <span className="font-cinzel font-bold text-amber-300 uppercase tracking-wider block flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Classified Directive: Operation Iron Citadel
          </span>
          <p className="text-slate-300 leading-relaxed">
            Imperial reconnaissance confirms night infiltrators have disrupted supply caravans through the mountain gorge. All tactical commanders are instructed to join the Roblox experience for coordinated phalanx maneuvers.
          </p>
        </div>
      </div>
    </div>
  );
};
