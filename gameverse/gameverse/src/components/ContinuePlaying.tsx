import { useApp } from '../context/AppContext';
import { getGameById } from '../data/games';
import GameCard from './GameCard';
import { Clock } from 'lucide-react';

interface Props { onPlay: (id: string) => void; }

export default function ContinuePlaying({ onPlay }: Props) {
  const { recentlyPlayed } = useApp();
  const recent = recentlyPlayed.slice(0, 8).map(id => getGameById(id)).filter(Boolean);
  if (recent.length < 2) return null;
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-xl bg-primary/15 grid place-items-center"><Clock className="w-4 h-4 text-primary" /></div>
          <div>
            <h2 className="font-head text-xl sm:text-2xl font-bold text-t1">Continue Playing</h2>
            <p className="text-t4 text-[13px] mt-0.5">Pick up where you left off</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {recent.map(g => g && <GameCard key={g.id} game={g} onPlay={onPlay} />)}
        </div>
      </div>
    </section>
  );
}
