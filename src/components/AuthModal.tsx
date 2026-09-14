import React, { useState } from 'react';
import { useAuth } from '../utils/authContext';
import { soundManager } from '../utils/audio';
import {
  X,
  Lock,
  Key,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenModeratorPortal?: () => void;
  onOpenDossier?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onOpenModeratorPortal,
  onOpenDossier,
}) => {
  const { login, currentUser } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const res = login(identifier, password);
    if (!res.success) {
      setError(res.error || 'Authentication failed');
      soundManager.playSwordClash();
    } else {
      soundManager.playFanfare();
      setSuccessMessage('Access granted. Welcome back.');
      setTimeout(() => {
        onClose();
        if (onOpenDossier) onOpenDossier();
      }, 900);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in overflow-y-auto">
      <div className="relative max-w-lg w-full bg-[#0d1017] border border-amber-600/50 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-amber-950/70 my-auto">
        {/* Close button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-700 p-[1px] mx-auto mb-3 shadow-lg shadow-amber-950">
            <div className="w-full h-full bg-[#0d1017] rounded-[11px] flex items-center justify-center">
              <Lock className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-amber-400 font-bold block mb-1">
            Tactical Command Terminal
          </span>
          <h3 className="text-2xl sm:text-3xl font-black font-cinzel text-white uppercase">
            Account Authentication
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Enter your authorized credentials to access command rooms and Roblox developer terminals.
          </p>
        </div>

        {/* NOTICE: AUTHORIZED ACCESS ONLY */}
        <div className="mb-6 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3 text-xs">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-slate-300 leading-relaxed">
            <strong className="text-amber-300 block font-cinzel font-semibold mb-0.5">
              Creator & Moderator Authorized Access
            </strong>
            <span>
              Public self-registration is disabled. Accounts can only be commissioned and provisioned by the{' '}
              <strong className="text-white">Creator</strong> or appointed moderators.
            </span>
          </div>
        </div>

        {/* Error / Success feedback */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/50 flex items-start gap-2.5 text-xs text-red-200 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/50 flex items-center gap-2.5 text-xs text-emerald-200 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-cinzel font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Username or Email Address
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter username (e.g. Jmodd59) or email"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-cinzel font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Security Passkey / Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your security password"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-sans"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-cinzel font-bold text-xs uppercase tracking-wider shadow-xl shadow-amber-950/60 flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Key className="w-4 h-4" />
            <span>Authorize & Enter War Room</span>
          </button>
        </form>
      </div>
    </div>
  );
};
