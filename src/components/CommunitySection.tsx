import React, { useState } from 'react';
import { NEWS_ARTICLES } from '../data/gameData';
import { Crown, MessageSquare, Mail, Sparkles, CheckCircle2, ArrowRight, Shield } from 'lucide-react';
import { soundManager } from '../utils/audio';

export const CommunitySection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    soundManager.playFanfare();
    setIsSubscribed(true);
    // Generate a royal voucher code
    const randomCode = `CROWN-${Math.random().toString(36).substring(2, 6).toUpperCase()}-2026`;
    setVoucherCode(randomCode);
  };

  return (
    <section id="community" className="py-24 bg-[#090b10] relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-amber-400 text-xs font-cinzel font-semibold tracking-widest uppercase mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Developer Dispatches & Community</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-cinzel text-white uppercase tracking-tight">
            Chronicles of War
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            Follow the game’s development, read tactical combat breakdowns, and join thousands of commanders on our official channels.
          </p>
        </div>

        {/* News & Dev Diaries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {NEWS_ARTICLES.map((article) => (
            <div
              key={article.id}
              className="p-6 rounded-2xl bg-[#0d1017] border border-slate-800 hover:border-amber-600/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-3">
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold uppercase tracking-wider">
                    {article.category}
                  </span>
                  <span className="text-slate-500">{article.readTime}</span>
                </div>

                <h4 className="text-base sm:text-lg font-bold font-cinzel text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {article.title}
                </h4>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">{article.excerpt}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">{article.date}</span>
                <span className="text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                  Read Dispatch <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Development Roadmap Strip */}
        <div className="mb-16 p-6 sm:p-8 rounded-2xl bg-[#0c0f17] border border-slate-800">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <h3 className="text-xl font-bold font-cinzel text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" /> Campaign Roadmap 2026-2027
            </h3>
            <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/40">
              Active Development
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">Phase I • Q1 2026</span>
              <h5 className="text-sm font-bold font-cinzel text-white mt-1">Closed Alpha Guild Siege</h5>
              <p className="text-xs text-slate-400 mt-1">5,000 player siege stress test and castle breach physics.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-amber-600/40 shadow-sm shadow-amber-500/10">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Phase II • Q2 2026</span>
              <h5 className="text-sm font-bold font-cinzel text-white mt-1">Global Beta & Dynasty PvP</h5>
              <p className="text-xs text-slate-400 mt-1">Roblox multiplayer tactical skirmish and ranked crown ladders.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Phase III • Q3 2026</span>
              <h5 className="text-sm font-bold font-cinzel text-white mt-1">Global World Launch</h5>
              <p className="text-xs text-slate-400 mt-1">Full grand campaign, 4 dynastic houses, and map creator.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Phase IV • Q4 2026</span>
              <h5 className="text-sm font-bold font-cinzel text-white mt-1">Expansion: Coral Kings</h5>
              <p className="text-xs text-slate-400 mt-1">Naval warfare, floating island citadels, and sea monster raids.</p>
            </div>
          </div>
        </div>

        {/* Developer Dispatches & Community Newsletter */}
        <div className="rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-purple-950/40 border border-amber-600/40 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto text-center relative z-10">
            <div className="inline-flex p-3 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-4">
              <Crown className="w-6 h-6" />
            </div>

            <h3 className="text-2xl sm:text-4xl font-black font-cinzel text-white uppercase">
              Official War of Crowns Dispatches
            </h3>
            <p className="mt-3 text-slate-200 text-sm sm:text-base leading-relaxed">
              Stay ahead of upcoming Roblox experience updates, developer battle-balance logs, and tactical patch notes.
            </p>

            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-cinzel font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 shrink-0 transition-transform active:scale-95"
                >
                  <Sparkles className="w-4 h-4" /> Subscribe
                </button>
              </form>
            ) : (
              <div className="mt-8 p-5 rounded-xl bg-slate-900/90 border border-amber-500/60 text-center animate-fade-in">
                <div className="flex items-center justify-center gap-2 text-amber-400 font-cinzel font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Subscribed to Official Dispatches!</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  You will receive development briefings and Roblox experience updates directly to your inbox.
                </p>
              </div>
            )}

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-400 font-cinzel">
              <span>✓ No Spam, Only War Dispatches</span>
              <span>✓ Roblox Update Notifications</span>
              <span>✓ Unsubscribe Anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
