import { getTrendingGames } from '../data/games';
import GameCard from './GameCard';

interface Props { onPlay: (id: string) => void; onNavigate: (page: string) => void; }

export default function TrendingGames({ onPlay, onNavigate }: Props) {
  const trending = getTrendingGames().slice(0, 8);
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-warn/15 grid place-items-center"><span className="text-lg">🔥</span></div>
            <div>
              <h2 className="font-head text-xl sm:text-2xl font-bold text-t1">Trending Now</h2>
              <p className="text-t4 text-[13px] mt-0.5">Most popular this week</p>
            </div>
          </div>
          <button onClick={() => onNavigate('trending')} className="text-primary text-[13px] font-medium hover:text-primary-hover transition-colors">View All →</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {trending.map(g => <GameCard key={g.id} game={g} onPlay={onPlay} />)}
        </div>
      </div>
    </section>
  );
}
