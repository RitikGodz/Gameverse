import { useState } from 'react';
import { User, Heart, Clock, Trophy, Settings, Crown, LogOut, Bell, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getGameById } from '../data/games';
import GameCard from './GameCard';

interface Props { onNavigate: (page: string, data?: any) => void; }

export default function Dashboard({ onNavigate }: Props) {
  const { user, favorites, recentlyPlayed, logout, setShowAuthModal, setAuthMode } = useApp();
  const [tab, setTab] = useState('favorites');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center max-w-md p-8">
          <div className="w-16 h-16 rounded-2xl grad-btn grid place-items-center mx-auto mb-5 shadow-lg shadow-primary/25">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-t1 mb-2">Sign In to Continue</h2>
          <p className="text-t3 text-sm mb-5">Access your favorites, recently played games, achievements, and more.</p>
          <button onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
            className="px-6 py-3 rounded-xl grad-btn text-white font-semibold shadow-lg shadow-primary/25">Sign In</button>
        </div>
      </div>
    );
  }

  const favGames = favorites.map(id => getGameById(id)).filter(Boolean);
  const recGames = recentlyPlayed.map(id => getGameById(id)).filter(Boolean);

  const achievements = [
    { title: 'First Game', desc: 'Play your first game', icon: '🎮', done: recentlyPlayed.length > 0 },
    { title: 'Collector', desc: 'Save 5 favorites', icon: '⭐', done: favorites.length >= 5 },
    { title: 'Explorer', desc: 'Try 10 different games', icon: '🗺️', done: recentlyPlayed.length >= 10 },
    { title: 'Dedicated', desc: 'Play 25 games', icon: '🏆', done: recentlyPlayed.length >= 25 },
    { title: 'Champion', desc: 'Complete a daily challenge', icon: '👑', done: false },
    { title: 'Social', desc: 'Share a game with friends', icon: '🤝', done: false },
  ];

  const tabs = [
    { id: 'favorites', label: 'Favorites', icon: Heart, n: favorites.length },
    { id: 'recent', label: 'Recently Played', icon: Clock, n: recentlyPlayed.length },
    { id: 'achievements', label: 'Achievements', icon: Trophy, n: achievements.filter(a => a.done).length },
    { id: 'settings', label: 'Settings', icon: Settings, n: 0 },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Profile */}
        <div className="glass-card rounded-2xl p-6 mb-6 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/[.04] blur-[60px]" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img src={user.avatar} alt="" className="w-16 h-16 rounded-2xl shadow-lg" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-xl font-bold text-t1">{user.name}</h1>
                {user.isPremium && <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-warn/15 text-warn text-[10px] font-semibold"><Crown className="w-3 h-3" /> PRO</span>}
              </div>
              <p className="text-t4 text-[13px]">{user.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-[13px] text-t3"><strong className="text-t1">{favorites.length}</strong> Favorites</span>
                <span className="text-[13px] text-t3"><strong className="text-t1">{recentlyPlayed.length}</strong> Played</span>
              </div>
            </div>
            <button onClick={logout} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass text-[13px] font-medium text-t3 hover:text-err transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          <div className="lg:w-52 shrink-0">
            <div className="flex lg:flex-col gap-0.5 overflow-x-auto hide-scrollbar">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all ${tab === t.id ? 'bg-primary/10 text-primary' : 'text-t3 hover:text-t1 hover:bg-white/[.03]'}`}>
                  <t.icon className="w-4 h-4" /> {t.label}
                  {t.n > 0 && <span className="ml-auto px-1.5 py-0.5 rounded-md bg-input text-[10px] text-t4">{t.n}</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            {tab === 'favorites' && (
              <div>
                <h2 className="text-lg font-bold text-t1 mb-4">Favorite Games</h2>
                {favGames.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">{favGames.map(g => g && <GameCard key={g.id} game={g} onPlay={id => onNavigate('game', { gameId: id })} />)}</div>
                ) : (
                  <div className="glass-card rounded-2xl p-12 text-center">
                    <Heart className="w-10 h-10 text-t4 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-t1 mb-1">No favorites yet</h3>
                    <p className="text-t4 text-sm mb-4">Start adding games to your favorites.</p>
                    <button onClick={() => onNavigate('home')} className="px-5 py-2.5 rounded-xl grad-btn text-white text-sm font-medium">Browse Games</button>
                  </div>
                )}
              </div>
            )}
            {tab === 'recent' && (
              <div>
                <h2 className="text-lg font-bold text-t1 mb-4">Recently Played</h2>
                {recGames.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">{recGames.map(g => g && <GameCard key={g.id} game={g} onPlay={id => onNavigate('game', { gameId: id })} />)}</div>
                ) : (
                  <div className="glass-card rounded-2xl p-12 text-center">
                    <Clock className="w-10 h-10 text-t4 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-t1 mb-1">Nothing yet</h3>
                    <p className="text-t4 text-sm mb-4">Start playing to see your history.</p>
                    <button onClick={() => onNavigate('home')} className="px-5 py-2.5 rounded-xl grad-btn text-white text-sm font-medium">Browse Games</button>
                  </div>
                )}
              </div>
            )}
            {tab === 'achievements' && (
              <div>
                <h2 className="text-lg font-bold text-t1 mb-4">Achievements</h2>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {achievements.map((a, i) => (
                    <div key={i} className={`glass-card rounded-xl p-4 flex items-center gap-3 ${a.done ? '' : 'opacity-45'}`}>
                      <div className={`w-12 h-12 rounded-xl grid place-items-center text-xl ${a.done ? 'bg-primary/10' : 'bg-input'}`}>{a.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] font-semibold text-t1">{a.title}</h4>
                        <p className="text-[11px] text-t4">{a.desc}</p>
                      </div>
                      {a.done && <span className="text-ok text-[12px] font-medium shrink-0">✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tab === 'settings' && (
              <div>
                <h2 className="text-lg font-bold text-t1 mb-4">Settings</h2>
                <div className="space-y-2.5">
                  {[
                    { icon: Bell, color: 'text-cyan', title: 'Notifications', desc: 'New game alerts' },
                    { icon: Shield, color: 'text-ok', title: 'Privacy', desc: 'Manage privacy' },
                  ].map(s => (
                    <div key={s.title} className="glass-card rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <s.icon className={`w-4 h-4 ${s.color}`} />
                        <div><h4 className="text-[13px] font-medium text-t1">{s.title}</h4><p className="text-[11px] text-t4">{s.desc}</p></div>
                      </div>
                      <div className="w-10 h-6 rounded-full bg-primary relative cursor-pointer"><span className="absolute top-0.5 left-[18px] w-5 h-5 rounded-full bg-white shadow transition-all" /></div>
                    </div>
                  ))}
                  <div className="glass-card rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <Crown className="w-4 h-4 text-warn" />
                      <div><h4 className="text-[13px] font-medium text-t1">Premium Membership</h4><p className="text-[11px] text-t4">Ad-free, exclusive games, special badges</p></div>
                    </div>
                    <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-warn to-orange-500 text-white text-sm font-semibold">Upgrade — $4.99/mo</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
