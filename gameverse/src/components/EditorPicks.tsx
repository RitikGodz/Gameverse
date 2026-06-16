import { getEditorPicks } from '../data/games';
import GameCard from './GameCard';
import { Award } from 'lucide-react';

interface Props { onPlay: (id: string) => void; }

export default function EditorPicks({ onPlay }: Props) {
  const picks = getEditorPicks().slice(0, 8);
  if (!picks.length) return null;
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-xl bg-purple/15 grid place-items-center"><Award className="w-4 h-4 text-purple" /></div>
          <div>
            <h2 className="font-head text-xl sm:text-2xl font-bold text-t1">Editor's Picks</h2>
            <p className="text-t4 text-[13px] mt-0.5">Hand-selected by our team</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {picks.map(g => <GameCard key={g.id} game={g} onPlay={onPlay} />)}
        </div>
      </div>
    </section>
  );
}
