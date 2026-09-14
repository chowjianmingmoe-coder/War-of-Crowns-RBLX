import React, { useState, useEffect } from 'react';
import { Crown, Volume2, VolumeX, Menu, X, Shield, Sparkles, User, Lock, Key } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { useAuth } from '../utils/authContext';

interface NavbarProps {
  currentPage: 'home' | 'announcements' | 'support';
  onNavigate: (page: 'home' | 'announcements' | 'support') => void;
  onOpenAuth: () => void;
  onOpenTrailer: () => void;
  onOpenModeratorPortal: () => void;
  onOpenDossier: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenAuth,
  onOpenTrailer,
  onOpenModeratorPortal,
  onOpenDossier,
}) => {
  const { currentUser, isModerator } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const active = soundManager.toggleMute();
    setIsAudioActive(active);
  };

  const navLinks: { label: string; page?: 'home' | 'announcements' | 'support'; href?: string }[] = [
    { label: 'Overview', page: 'home', href: '#overview' },
    { label: 'Media', page: 'home', href: '#media' },
    { label: 'Announcements', page: 'announcements' },
    { label: 'Support', page: 'support' },
    { label: 'Community', page: 'home', href: '#community' },
  ];

  const handleNavClick = (link: { label: string; page?: 'home' | 'announcements' | 'support'; href?: string }) => {
    soundManager.playClick();
    if (link.page) {
      onNavigate(link.page);
      if (link.href && link.page === 'home') {
        setTimeout(() => {
          const el = document.querySelector(link.href!);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#090b10]/95 backdrop-blur-md border-b border-amber-900/30 py-3 shadow-2xl shadow-black/80'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <button
          id="nav-logo-link"
          className="flex items-center gap-3 group text-left cursor-pointer border-0 bg-transparent p-0"
          onClick={() => {
            soundManager.playClick();
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 via-amber-700 to-yellow-950 p-[1px] shadow-lg shadow-amber-900/30 group-hover:shadow-amber-500/40 transition-all">
            <div className="w-full h-full bg-[#0d1017] rounded-[7px] flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <span className="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-amber-100 block leading-tight group-hover:text-amber-300 transition-colors">
              WAR <span className="text-amber-500">OF</span> CROWNS
            </span>
            <span className="text-[10px] tracking-[0.25em] text-amber-400/70 uppercase block font-semibold">
              Roblox Experience • Play Instantly
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = link.page && currentPage === link.page && (link.page !== 'home' || !link.href);
            return (
              <button
                key={link.label}
                id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleNavClick(link)}
                className={`px-3 py-1.5 text-xs xl:text-sm font-medium rounded-md transition-all font-cinzel tracking-wider uppercase ${
                  isActive
                    ? 'text-amber-300 bg-amber-950/40 border border-amber-600/40 shadow-sm shadow-amber-950'
                    : 'text-slate-300 hover:text-amber-300 hover:bg-amber-950/20'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Ambient Music Toggle */}
          <button
            id="btn-sound-toggle"
            onClick={toggleSound}
            title={isAudioActive ? 'Mute Atmosphere Audio' : 'Play Atmosphere Audio'}
            className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-cinzel ${
              isAudioActive
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-sm shadow-amber-500/30 animate-pulse'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {isAudioActive ? (
              <>
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span className="hidden xl:inline text-[11px] font-semibold text-amber-300">Sound ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="hidden xl:inline text-[11px]">Sound OFF</span>
              </>
            )}
          </button>

          {/* Watch Trailer button */}
          <button
            id="btn-nav-trailer"
            onClick={() => {
              soundManager.playClick();
              onOpenTrailer();
            }}
            className="px-3 py-2 text-xs font-semibold text-amber-200 border border-amber-700/50 hover:border-amber-500 hover:bg-amber-950/30 rounded-lg transition-all font-cinzel tracking-wider uppercase flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Trailer
          </button>

          {/* If user is a Moderator/Creator, provide direct Portal access */}
          {currentUser && isModerator && (
            <button
              id="btn-nav-moderator"
              onClick={() => {
                soundManager.playClick();
                onOpenModeratorPortal();
              }}
              className="px-3 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/60 text-amber-300 font-cinzel font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentUser.role === 'creator' ? 'Creator Console' : 'Moderator Console'}</span>
            </button>
          )}

          {/* Authenticated User Status OR Login CTA */}
          {currentUser ? (
            <button
              id="btn-nav-user-dossier"
              onClick={() => {
                soundManager.playClick();
                onOpenDossier();
              }}
              className="px-3.5 py-2 rounded-lg bg-slate-900 border border-amber-600/60 text-amber-300 font-cinzel font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-slate-800 transition-all shadow-md shadow-amber-950/40"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="truncate max-w-[120px]">{currentUser.callSign}</span>
              <Shield className="w-3.5 h-3.5 text-amber-400" />
            </button>
          ) : (
            <button
              id="btn-nav-auth-login"
              onClick={() => {
                soundManager.playClick();
                onOpenAuth();
              }}
              className="relative group overflow-hidden px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 text-slate-950 font-bold text-xs tracking-wider uppercase font-cinzel shadow-lg shadow-amber-950/50 hover:shadow-amber-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Commander Login
              </span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            id="btn-mobile-sound-toggle"
            onClick={toggleSound}
            className={`p-2 rounded-lg border ${
              isAudioActive
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            {isAudioActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-200 hover:text-amber-400"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0c13]/98 border-b border-amber-900/40 px-6 py-5 shadow-2xl">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  handleNavClick(link);
                  setIsMobileMenuOpen(false);
                }}
                className="text-left text-sm font-medium text-slate-200 hover:text-amber-400 py-2 border-b border-slate-800/60 font-cinzel tracking-wider uppercase"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsMobileMenuOpen(false);
                  onOpenTrailer();
                }}
                className="w-full py-2.5 rounded-lg border border-amber-600/40 text-amber-300 font-cinzel text-xs font-semibold uppercase tracking-wider text-center"
              >
                Watch Cinematic Trailer
              </button>

              {currentUser && isModerator && (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setIsMobileMenuOpen(false);
                    onOpenModeratorPortal();
                  }}
                  className="w-full py-2.5 rounded-lg bg-amber-500/20 border border-amber-500/50 text-amber-300 font-cinzel font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5"
                >
                  <Crown className="w-4 h-4 text-amber-400" />
                  {currentUser.role === 'creator' ? 'Creator Console (Manage Users)' : 'Moderator Console (Manage Users)'}
                </button>
              )}

              {currentUser ? (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setIsMobileMenuOpen(false);
                    onOpenDossier();
                  }}
                  className="w-full py-2.5 rounded-lg bg-slate-900 border border-amber-600/60 text-amber-300 font-bold font-cinzel text-xs uppercase tracking-wider text-center"
                >
                  War Room Dossier ({currentUser.callSign})
                </button>
              ) : (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setIsMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-950 font-bold font-cinzel text-xs uppercase tracking-wider text-center shadow-lg shadow-amber-900/40"
                >
                  Commander Login (Moderator Provisioned)
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
