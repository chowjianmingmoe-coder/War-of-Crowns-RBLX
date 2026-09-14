import React from 'react';
import { Crown, Shield, ExternalLink, Heart } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface FooterProps {
  onNavigate?: (page: 'home' | 'announcements' | 'support') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#05070a] border-t border-slate-800 text-slate-400 py-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-700 p-[1px] shadow-md shadow-amber-950">
                <div className="w-full h-full bg-[#0d1017] rounded-[7px] flex items-center justify-center">
                  <Crown className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <span className="font-cinzel text-lg font-bold tracking-wider text-amber-100">
                WAR <span className="text-amber-500">OF</span> CROWNS
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The premier tactical grand strategy experience on Roblox. Lead legendary dynasties, command phalanx legions, and claim the high throne with zero app installation needed.
            </p>

            {/* Age Rating Badge */}
            <div className="mt-5 inline-flex items-center gap-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="w-9 h-11 bg-black border border-white flex flex-col items-center justify-center font-mono font-bold text-white text-xs leading-none">
                <span>9+</span>
                <span className="text-[8px] font-normal text-slate-400 mt-0.5">ROBLOX</span>
              </div>
              <div className="text-[11px] text-slate-300">
                <strong className="block text-white font-cinzel">Roblox Experience Guidelines</strong>
                <span>Mild Fantasy Combat & Strategic Warfare</span>
              </div>
            </div>
          </div>

          {/* Quick Links: Navigation */}
          <div>
            <h5 className="font-cinzel text-xs font-bold uppercase tracking-wider text-white mb-3">
              Site Navigation
            </h5>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onNavigate?.('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onNavigate?.('home');
                    setTimeout(() => {
                      document.querySelector('#media')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Media Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onNavigate?.('announcements');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors text-left text-amber-400 font-semibold"
                >
                  Royal Announcements
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onNavigate?.('support');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors text-left text-amber-400 font-semibold"
                >
                  Customer Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onNavigate?.('home');
                    setTimeout(() => {
                      document.querySelector('#community')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Community
                </button>
              </li>
            </ul>
          </div>

          {/* Community & Dispatches */}
          <div>
            <h5 className="font-cinzel text-xs font-bold uppercase tracking-wider text-white mb-3">
              Community
            </h5>
            <ul className="space-y-2">
              {['Official Discord Server', 'Roblox Group & Community', 'Developer Forums', 'Creator Studio Updates', 'Twitch Streams'].map((item) => (
                <li key={item}>
                  <a
                    href="#community"
                    onClick={() => soundManager.playClick()}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1"
                  >
                    <span>{item}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & System */}
          <div>
            <h5 className="font-cinzel text-xs font-bold uppercase tracking-wider text-white mb-3">
              Legal & Support
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-slate-200 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-slate-200 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-slate-200 transition-colors">End User License Agreement</a></li>
              <li><a href="#" className="hover:text-slate-200 transition-colors">Accessibility Standards</a></li>
              <li><a href="#" className="hover:text-slate-200 transition-colors">Cookie Preferences</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© 2026 War of Crowns Studios. All Rights Reserved. All trademarks belong to their respective owners.</p>
          <div className="flex items-center gap-1 text-slate-400 font-cinzel">
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            <span>Built for Grand Tacticians</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
