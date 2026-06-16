import { getSandboxGames } from '../data/games';
import GameCard from './GameCard';

interface Props { onPlay: (id: string) => void; onNavigate: (page: string, data?: any) => void; }

export default function SandboxGames({ onPlay, onNavigate }: Props) {
  const sandbox = getSandboxGames().slice(0, 8);
  if (!sandbox.length) return null;
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-ok/15 grid place-items-center"><span className="text-lg">⛏️</span></div>
            <div>
              <h2 className="font-head text-xl sm:text-2xl font-bold text-t1">Minecraft-Like Games</h2>
              <p className="text-t4 text-[13px] mt-0.5">Build, craft, and survive</p>
            </div>
          </div>
          <button onClick={() => onNavigate('category', { category: 'sandbox' })} className="text-primary text-[13px] font-medium hover:text-primary-hover transition-colors">View All →</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {sandbox.map(g => <GameCard key={g.id} game={g} onPlay={onPlay} />)}
        </div>
      </div>
    </section>
  );
}
