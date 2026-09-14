import React from 'react';
import { Crown, Play, Swords, Sparkles, Shield, ChevronDown, CheckCircle2, Gamepad2, ExternalLink, Megaphone, LifeBuoy } from 'lucide-react';
import { GAME_IMAGES } from '../data/gameData';
import { soundManager } from '../utils/audio';

interface HeroSectionProps {
  onOpenAuth: () => void;
  onOpenTrailer: () => void;
  onNavigate?: (page: 'home' | 'announcements' | 'support') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenAuth, onOpenTrailer, onNavigate }) => {
  return (
    <section id="overview" className="relative min-h-screen flex flex-col justify-between pt-28 pb-16 overflow-hidden">
      {/* Background with parallax-like backdrop */}
      <div className="absolute inset-0 z-0">
        <img
          src={GAME_IMAGES.hero}
          alt="War of Crowns Epic Battlefield"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 transform filter brightness-60 contrast-110"
        />
        {/* Layered atmospheric gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-[#090b10]/60 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090b10]/90 via-transparent to-[#090b10]/80" />
        {/* Subtle royal amber glow vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(217,119,6,0.15)_0%,transparent_70%)] pointer-events-none" />
      </div>

      {/* Floating heraldic particles / embers simulation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 opacity-60">
        <div className="absolute top-1/4 left-1/5 w-1.5 h-1.5 bg-amber-400 rounded-full blur-[1px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-yellow-300 rounded-full blur-[1px] animate-ping opacity-30" />
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-amber-500 rounded-full blur-[0.5px] animate-pulse" />
        <div className="absolute top-1/2 right-1/6 w-1.5 h-1.5 bg-orange-400 rounded-full blur-[1px]" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto text-center flex flex-col items-center">
        {/* Heraldic Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-cinzel font-semibold uppercase tracking-[0.2em] shadow-lg shadow-amber-950/80 mb-6 backdrop-blur-sm">
          <Gamepad2 className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Play Directly on Roblox • No App Install Needed</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>

        {/* Grand Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-cinzel tracking-tight text-white uppercase drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] max-w-5xl">
          WAR <span className="gold-gradient-text font-cinzel-dec">OF</span> CROWNS
        </h1>

        {/* Tagline */}
        <p className="mt-6 text-lg sm:text-xl md:text-2xl text-slate-200 max-w-3xl font-light leading-relaxed tracking-wide drop-shadow-md">
          When the ancient High Crown shattered, rival royal houses plunged the realm into total war.
          <span className="block mt-2 font-medium text-amber-300/90 font-cinzel">
            Master tactical warfare, castle sieges, and claim the high throne in Roblox.
          </span>
        </p>

        {/* Primary Call to Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {/* Play on Roblox Direct CTA */}
          <a
            href="https://www.roblox.com"
            target="_blank"
            rel="noopener noreferrer"
            id="btn-hero-play-roblox"
            onClick={() => soundManager.playFanfare()}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-cinzel font-bold text-base tracking-wider uppercase shadow-xl shadow-amber-950/60 hover:scale-105 active:scale-95 transition-all"
          >
            <div className="w-6 h-6 rounded-full bg-slate-950/20 flex items-center justify-center text-slate-950">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <span>Play on Roblox</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          {/* Cinematic Trailer */}
          <button
            id="btn-hero-watch-trailer"
            onClick={() => {
              soundManager.playClick();
              onOpenTrailer();
            }}
            className="group inline-flex items-center gap-3 px-7 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-amber-500/70 text-slate-100 font-cinzel font-semibold text-base tracking-wider uppercase transition-all backdrop-blur-md shadow-lg shadow-black/60"
          >
            <Play className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform fill-current ml-0.5" />
            <span>Watch Trailer</span>
          </button>

          {/* Commander Terminal Access */}
          <button
            id="btn-hero-auth-access"
            onClick={() => {
              soundManager.playClick();
              onOpenAuth();
            }}
            className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-amber-950/40 hover:bg-amber-900/40 border border-amber-700/50 hover:border-amber-400 text-amber-200 font-cinzel font-semibold text-sm tracking-wider uppercase transition-all backdrop-blur-sm"
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Commander War Room</span>
          </button>
        </div>

        {/* Roblox Platform Banner - No Installation Needed */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-600/40 text-[11px] uppercase tracking-[0.2em] text-amber-300 font-semibold font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>A Game in Roblox • No App to Install</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-slate-300 font-mono">
            <span className="px-3.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> ROBLOX EXPERIENCE
            </span>
            <span className="px-3.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" /> NO DOWNLOAD OR INSTALLER
            </span>
            <span className="px-3.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> CROSS-PLAY (PC / MOBILE / CONSOLE)
            </span>
            <span className="px-3.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400" /> INSTANT MULTIPLAYER
            </span>
          </div>

          {/* Quick Shortcuts to Announcements and Customer Support */}
          {onNavigate && (
            <div className="flex items-center gap-3 mt-1">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onNavigate('announcements');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 border border-amber-600/40 text-amber-300 text-xs font-cinzel font-semibold uppercase tracking-wider transition-colors"
              >
                <Megaphone className="w-3.5 h-3.5 text-amber-400" />
                <span>Latest Announcements</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onNavigate('support');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-850 border border-slate-700 text-slate-300 hover:text-white text-xs font-cinzel font-semibold uppercase tracking-wider transition-colors"
              >
                <LifeBuoy className="w-3.5 h-3.5 text-amber-400" />
                <span>Customer Support</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Feature Pillars Bar */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-2xl bg-[#0e121a]/90 border border-slate-800/80 shadow-2xl backdrop-blur-md">
          <div className="p-3 text-center sm:text-left flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200 font-cinzel">Grand Strategy</h4>
              <p className="text-xs text-slate-400 mt-0.5">Manage provinces, gold taxation & food supply lines.</p>
            </div>
          </div>

          <div className="p-3 text-center sm:text-left flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200 font-cinzel">Turn-Based Grids</h4>
              <p className="text-xs text-slate-400 mt-0.5">Flanking bonuses, elevation buffs & shield wall phalanx.</p>
            </div>
          </div>

          <div className="p-3 text-center sm:text-left flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200 font-cinzel">Dynastic Intrigue</h4>
              <p className="text-xs text-slate-400 mt-0.5">Betrothals, secret poisonings, and court councils.</p>
            </div>
          </div>

          <div className="p-3 text-center sm:text-left flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200 font-cinzel">Colossal Sieges</h4>
              <p className="text-xs text-slate-400 mt-0.5">Catapults, battering rams & breachable battlements.</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-6">
          <a
            href="#media"
            className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-slate-400 hover:text-amber-400 transition-colors animate-bounce font-cinzel"
          >
            <span>Explore Media Showcase</span>
            <ChevronDown className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
