import { useState } from 'react';
import { Trophy, Clock, Star, ChevronRight, Zap, Target } from 'lucide-react';
import { games } from '../data/games';

interface Props { onPlay: (id: string) => void; }

export default function DailyChallenges({ onPlay }: Props) {
  const [completed, setCompleted] = useState<number[]>([]);
  const now = new Date();
  const seed = now.getFullYear() * 1000 + now.getMonth() * 31 + now.getDate();
  const picks = [games[seed % games.length], games[(seed + 7) % games.length], games[(seed + 13) % games.length]];

  const challenges = [
    { title: 'Play 3 Different Games', desc: 'Try out 3 different games today', xp: '50 XP', icon: Target, done: Math.min(completed.length, 3), total: 3, color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'Score Master', desc: 'Play the daily featured game', xp: '100 XP', icon: Star, done: completed.length > 0 ? 1 : 0, total: 1, color: 'text-warn', bg: 'bg-warn/10' },
    { title: 'Speed Runner', desc: 'Complete any arcade game', xp: '75 XP', icon: Zap, done: 0, total: 1, color: 'text-cyan', bg: 'bg-cyan/10' },
  ];

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-xl bg-warn/15 grid place-items-center"><Trophy className="w-4 h-4 text-warn" /></div>
          <div>
            <h2 className="font-head text-xl sm:text-2xl font-bold text-t1">Daily Challenges</h2>
            <p className="text-t4 text-[13px] mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" /> Resets in {23 - now.getHours()}h {59 - now.getMinutes()}m</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          {challenges.map((c, i) => (
            <div key={i} className="glass-card rounded-2xl p-4 hover:bg-white/[.03] transition-all">
              <div className="flex items-start gap-2.5 mb-3">
                <div className={`w-9 h-9 rounded-xl ${c.bg} grid place-items-center shrink-0`}><c.icon className={`w-4 h-4 ${c.color}`} /></div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[13px] font-semibold text-t1">{c.title}</h4>
                  <p className="text-[11px] text-t4">{c.desc}</p>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-input text-[10px] font-medium text-warn shrink-0">{c.xp}</span>
              </div>
              <div className="w-full bg-input rounded-full h-1.5 mb-1">
                <div className="h-1.5 rounded-full grad-btn transition-all" style={{ width: `${(c.done / c.total) * 100}%` }} />
              </div>
              <p className="text-[10px] text-t4">{c.done}/{c.total}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 glass-card rounded-2xl p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-t1 mb-3 flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-warn fill-warn" /> Today's Picks</h3>
          <div className="grid sm:grid-cols-3 gap-2">
            {picks.map((g, i) => (
              <button key={g.id} onClick={() => { onPlay(g.id); setCompleted(c => [...new Set([...c, i])]); }}
                className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[.04] transition-all text-left">
                <div className="w-12 h-9 rounded-lg overflow-hidden shrink-0 bg-card">
                  <img src={g.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[13px] font-medium text-t1 truncate group-hover:text-primary transition-colors">{g.title}</h4>
                  <p className="text-[11px] text-t4 capitalize">{g.category}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-t4 group-hover:text-primary transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
