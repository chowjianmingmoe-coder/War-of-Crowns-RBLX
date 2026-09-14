import React, { useState } from 'react';
import { GAME_IMAGES } from '../data/gameData';
import { Image as ImageIcon, Music, Play, Pause, Maximize2, X, Sparkles, Volume2 } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface Screenshot {
  id: string;
  title: string;
  category: 'Cinematic' | 'Gameplay' | 'World Map';
  src: string;
  description: string;
}

const SCREENSHOTS: Screenshot[] = [
  {
    id: 'shot-1',
    title: 'The Cataclysm of Caelum',
    category: 'Cinematic',
    src: GAME_IMAGES.hero,
    description: 'The ancient high throne surrounded by twilight mists as royal armies clash for succession.'
  },
  {
    id: 'shot-2',
    title: 'Siege of the Sunken Bastion',
    category: 'Gameplay',
    src: GAME_IMAGES.siege,
    description: 'Catapult fireballs illuminating midnight battlements as 10,000 legionnaires advance in phalanx.'
  },
  {
    id: 'shot-3',
    title: 'Cartography of the Contested Realm',
    category: 'World Map',
    src: GAME_IMAGES.map,
    description: 'War council campaign table plotting provincial trade embargoes, garrisons, and naval blockades.'
  },
  {
    id: 'shot-4',
    title: 'Marshal Alden & The Royal Sun-Knights',
    category: 'Cinematic',
    src: GAME_IMAGES.valerius,
    description: 'House Valerius heavy shock-cavalry assembling in the fortress courtyard before dawn.'
  },
  {
    id: 'shot-5',
    title: 'The Whispering Spire at Midnight',
    category: 'Cinematic',
    src: GAME_IMAGES.korvath,
    description: 'Empress Vespera weaving dark occult wards atop the obsidian crags.'
  }
];

const SOUNDTRACK = [
  { id: 'track-1', title: 'Hymn of the Shattered Crown', duration: '3:42', composer: 'Imperial Philharmonic' },
  { id: 'track-2', title: 'Iron Lions of Valerius', duration: '4:15', composer: 'Imperial War Horns' },
  { id: 'track-3', title: 'Whispers in the Obsidian Crag', duration: '3:50', composer: 'Eldritch Choir' },
  { id: 'track-4', title: 'March of the 10,000 Trebuchets', duration: '4:30', composer: 'Orchestral Percussion' }
];

export const MediaGallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'screenshots' | 'soundtrack'>('screenshots');
  const [lightboxImage, setLightboxImage] = useState<Screenshot | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  const handlePlayTrack = (trackId: string) => {
    if (playingTrackId === trackId) {
      setPlayingTrackId(null);
      soundManager.stopAmbient();
    } else {
      setPlayingTrackId(trackId);
      soundManager.playFanfare();
      soundManager.startAmbient();
    }
  };

  return (
    <section id="media" className="py-24 bg-[#090b10] relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-amber-400 text-xs font-cinzel font-semibold tracking-widest uppercase mb-4">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Visuals & Media</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-cinzel text-white uppercase tracking-tight">
            War In High Definition
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            Feast your eyes on photorealistic medieval fantasy battlefields, monumental castle sieges, and hear the orchestral suite of War of Crowns.
          </p>

          {/* Toggle Tabs */}
          <div className="mt-8 inline-flex p-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab('screenshots');
              }}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-cinzel font-bold tracking-wider uppercase transition-all ${
                activeTab === 'screenshots'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Screenshots & Art
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab('soundtrack');
              }}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-cinzel font-bold tracking-wider uppercase transition-all ${
                activeTab === 'soundtrack'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Music className="w-4 h-4" /> Original Soundtrack
            </button>
          </div>
        </div>

        {/* Screenshots Tab View */}
        {activeTab === 'screenshots' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SCREENSHOTS.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => {
                  soundManager.playClick();
                  setLightboxImage(item);
                }}
                className={`group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 cursor-pointer transition-all duration-300 hover:border-amber-500/70 hover:shadow-2xl hover:shadow-amber-950/40 hover:-translate-y-1 ${
                  idx === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/3]'
                }`}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Hover Maximize badge */}
                <div className="absolute top-3 right-3 p-2 rounded-lg bg-black/60 backdrop-blur-md border border-slate-700/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </div>

                {/* Text description */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block mb-1">
                    {item.category}
                  </span>
                  <h4 className="text-base sm:text-lg font-bold font-cinzel text-white group-hover:text-amber-200 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Soundtrack Tab View */}
        {activeTab === 'soundtrack' && (
          <div className="max-w-4xl mx-auto rounded-2xl bg-[#0d1017] border border-slate-800 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <h3 className="text-2xl font-black font-cinzel text-white">
                  War of Crowns: Official Symphonic Suite
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Recorded live with an 80-piece orchestra, featuring authentic medieval instruments, lutes, and thundering war drums.
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-amber-400 font-mono text-xs">
                <Volume2 className="w-4 h-4 animate-pulse" />
                <span>Web Audio Engine</span>
              </div>
            </div>

            <div className="space-y-3">
              {SOUNDTRACK.map((track, idx) => {
                const isPlaying = playingTrackId === track.id;
                return (
                  <div
                    key={track.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      isPlaying
                        ? 'bg-amber-950/40 border-amber-500/70 shadow-lg shadow-amber-950/50'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handlePlayTrack(track.id)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isPlaying
                            ? 'bg-amber-500 text-slate-950 scale-105 shadow-md shadow-amber-500/40'
                            : 'bg-slate-800 hover:bg-amber-600 text-white'
                        }`}
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-500">0{idx + 1}.</span>
                          <h4 className="text-sm sm:text-base font-bold font-cinzel text-white">
                            {track.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{track.composer}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {isPlaying && (
                        <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider animate-pulse flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3" /> Playing
                        </span>
                      )}
                      <span className="text-xs font-mono text-slate-500">{track.duration}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
              <span className="text-xs text-slate-400 font-medium">
                Full 42-track digital soundtrack included in the{' '}
                <strong className="text-amber-300">Royal Crown Edition</strong> and above.
              </span>
            </div>
          </div>
        )}

        {/* Lightbox Modal */}
        {lightboxImage && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-slate-900 border border-slate-700 text-white hover:text-amber-400 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-w-6xl w-full flex flex-col items-center">
              <div className="relative rounded-2xl overflow-hidden border border-amber-900/40 shadow-2xl max-h-[75vh]">
                <img
                  src={lightboxImage.src}
                  alt={lightboxImage.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain max-h-[75vh]"
                />
              </div>
              <div className="mt-4 text-center max-w-2xl">
                <h3 className="text-xl font-bold font-cinzel text-white">{lightboxImage.title}</h3>
                <p className="text-sm text-slate-300 mt-1">{lightboxImage.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
