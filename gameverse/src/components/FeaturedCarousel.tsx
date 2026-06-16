import { useState, useEffect, useCallback } from 'react';
import { Play, ChevronLeft, ChevronRight, Star, Users, Heart } from 'lucide-react';
import { getFeaturedGames } from '../data/games';
import { useApp } from '../context/AppContext';

interface Props { onPlay: (id: string) => void; }
const fmt = (n: number) => n >= 1e6 ? `${(n/1e6).toFixed(1)}M` : `${(n/1e3).toFixed(0)}K`;

export default function FeaturedCarousel({ onPlay }: Props) {
  const featured = getFeaturedGames();
  const [cur, setCur] = useState(0);
  const { toggleFavorite, isFavorite } = useApp();
  const next = useCallback(() => setCur(c => (c + 1) % featured.length), [featured.length]);
  const prev = useCallback(() => setCur(c => (c - 1 + featured.length) % featured.length), [featured.length]);

  useEffect(() => { const t = setInterval(next, 6000); return () => clearInterval(t); }, [next]);

  const game = featured[cur];
  if (!game) return null;

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-head text-xl sm:text-2xl font-bold text-t1">Featured Games</h2>
            <p className="text-t4 text-[13px] mt-0.5">Hand-picked by our team</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={prev} className="p-2 rounded-lg glass hover:bg-white/[.08] transition-all"><ChevronLeft className="w-4 h-4 text-t2" /></button>
            <button onClick={next} className="p-2 rounded-lg glass hover:bg-white/[.08] transition-all"><ChevronRight className="w-4 h-4 text-t2" /></button>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden glass-card">
          <div className="flex flex-col lg:flex-row">
            <div className="relative lg:w-[55%] aspect-video lg:aspect-auto overflow-hidden">
              <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-card hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent lg:hidden" />
            </div>
            <div className="relative lg:w-[45%] p-6 sm:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-md bg-primary/15 text-primary text-[11px] font-semibold uppercase">{game.category.replace('-',' ')}</span>
                {game.isTrending && <span className="px-2.5 py-0.5 rounded-md bg-warn/15 text-warn text-[11px] font-semibold">🔥 Trending</span>}
              </div>
              <h3 className="font-head text-2xl sm:text-3xl font-bold text-t1 mb-2">{game.title}</h3>
              <p className="text-t3 text-sm leading-relaxed line-clamp-2 mb-5">{game.description}</p>
              <div className="flex items-center gap-4 mb-5">
                <div className="flex items-center gap-1"><Star className="w-4 h-4 text-warn fill-warn" /><span className="text-sm font-semibold text-t1">{game.rating}</span></div>
                <div className="flex items-center gap-1 text-t4"><Users className="w-3.5 h-3.5" /><span className="text-[13px]">{fmt(game.plays)} plays</span></div>
              </div>
              <div className="flex items-center gap-2.5">
                <button onClick={() => onPlay(game.id)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl grad-btn text-white text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-[1.02]">
                  <Play className="w-4 h-4 fill-white" /> Play Now
                </button>
                <button onClick={() => toggleFavorite(game.id)}
                  className={`p-2.5 rounded-xl glass transition-all hover:scale-105 ${isFavorite(game.id) ? 'text-err' : 'text-t3 hover:text-t1'}`}>
                  <Heart className={`w-4 h-4 ${isFavorite(game.id) ? 'fill-err' : ''}`} />
                </button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 lg:left-5 lg:translate-x-0 lg:bottom-5">
            {featured.map((_, i) => (
              <button key={i} onClick={() => setCur(i)} className={`h-1 rounded-full transition-all ${i === cur ? 'w-5 bg-primary' : 'w-1.5 bg-white/25 hover:bg-white/40'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
