import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Sparkles, Shield, Swords } from 'lucide-react';
import { GAME_IMAGES } from '../data/gameData';
import { soundManager } from '../utils/audio';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRAILER_SCENES = [
  {
    image: GAME_IMAGES.hero,
    title: 'Act I: The Shattered Crown',
    caption: 'For three centuries, the High Crown kept peace. In a single night of betrayal, the lineage ended.',
    tagline: 'When kings perish, the realm burns.'
  },
  {
    image: GAME_IMAGES.valerius,
    title: 'Act II: The Iron Lion Marches',
    caption: 'High Marshal Alden rallies the western legions. Steel, shield walls, and unbreakable faith.',
    tagline: 'Honor forged in holy flame.'
  },
  {
    image: GAME_IMAGES.korvath,
    title: 'Act III: Shadow and Blood',
    caption: 'From the northern crags, Empress Vespera unleashes the occult arts of the Raven Throne.',
    tagline: 'No secret remains safe in the dark.'
  },
  {
    image: GAME_IMAGES.siege,
    title: 'Act IV: The Siege of 10,000 Blades',
    caption: 'Trebuchets split the night sky. The fate of the empire will be decided in blood and iron.',
    tagline: 'Will you claim the throne, or become dust?'
  }
];

export const TrailerModal: React.FC<TrailerModalProps> = ({ isOpen, onClose }) => {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSceneIdx((prev) => (prev + 1) % TRAILER_SCENES.length);
      soundManager.playSwordClash();
    }, 4500);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  const scene = TRAILER_SCENES[currentSceneIdx];

  const toggleSound = () => {
    const active = soundManager.toggleMute();
    setIsMuted(!active);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      {/* Close button */}
      <button
        onClick={() => {
          soundManager.playClick();
          onClose();
        }}
        className="absolute top-6 right-6 p-3 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-amber-500 transition-colors z-20"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="max-w-5xl w-full flex flex-col items-center">
        {/* Cinematic Screen Frame */}
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border-2 border-amber-600/40 bg-black shadow-2xl shadow-amber-950/40 group">
          {/* Active Scene Backdrop */}
          <img
            key={currentSceneIdx}
            src={scene.image}
            alt={scene.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover animate-fade-in scale-105 transition-all duration-1000 filter contrast-110"
          />

          {/* Letterbox Bars for Hollywood Cinematic Feel */}
          <div className="absolute top-0 left-0 right-0 h-10 bg-black/80 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-14 bg-black/90 pointer-events-none" />

          {/* Subtitles / Narrative Overlay */}
          <div className="absolute bottom-16 left-6 right-6 text-center pointer-events-none">
            <span className="text-xs uppercase tracking-[0.3em] text-amber-400 font-cinzel font-bold block mb-1">
              {scene.title}
            </span>
            <p className="text-base sm:text-xl font-cinzel font-semibold text-white drop-shadow-[0_4px_10px_rgba(0,0,0,1)] max-w-3xl mx-auto">
              &ldquo;{scene.caption}&rdquo;
            </p>
            <span className="text-xs text-slate-300 font-mono italic mt-1 block">
              {scene.tagline}
            </span>
          </div>

          {/* Top Branding */}
          <div className="absolute top-4 left-6 flex items-center gap-2 pointer-events-none">
            <span className="font-cinzel text-xs font-black tracking-widest text-amber-300">
              WAR OF CROWNS • OFFICIAL GAMEPLAY TEASER
            </span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          </div>

          {/* Scene Progress Indicators */}
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white border border-slate-700 text-xs flex items-center gap-1 font-mono"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                onClick={toggleSound}
                className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white border border-slate-700 text-xs flex items-center gap-1 font-mono"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            </div>

            {/* Scene Selector Dots */}
            <div className="flex items-center gap-2">
              {TRAILER_SCENES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    soundManager.playClick();
                    setCurrentSceneIdx(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentSceneIdx ? 'w-8 bg-amber-400' : 'w-2.5 bg-slate-700 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Launch Bottom Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 w-full px-2 text-xs font-cinzel text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Tactical Siege Battles • Dynamic Lighting</span>
          </div>
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-purple-400" />
            <span>Experience War of Crowns on Roblox • No App Install Needed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
