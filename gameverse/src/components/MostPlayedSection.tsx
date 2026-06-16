import { getMostPlayed } from '../data/games';
import GameCard from './GameCard';
import { TrendingUp } from 'lucide-react';

interface Props { onPlay: (id: string) => void; onNavigate: (page: string) => void; }

export default function MostPlayedSection({ onPlay, onNavigate }: Props) {
  const top = getMostPlayed().slice(0, 8);
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan/15 grid place-items-center"><TrendingUp className="w-4 h-4 text-cyan" /></div>
            <div>
              <h2 className="font-head text-xl sm:text-2xl font-bold text-t1">Most Played</h2>
              <p className="text-t4 text-[13px] mt-0.5">All-time fan favorites</p>
            </div>
          </div>
          <button onClick={() => onNavigate('games')} className="text-primary text-[13px] font-medium hover:text-primary-hover transition-colors">View All →</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {top.map((g, i) => (
            <div key={g.id} className="relative">
              {i < 3 && (
                <div className={`absolute -top-1.5 -left-1.5 z-10 w-7 h-7 rounded-lg grid place-items-center text-[11px] font-bold text-white shadow-lg ${
                  i === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                  i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                  'bg-gradient-to-br from-amber-600 to-amber-800'}`}>
                  #{i+1}
                </div>
              )}
              <GameCard game={g} onPlay={onPlay} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
