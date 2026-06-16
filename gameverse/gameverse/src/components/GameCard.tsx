import { useState } from 'react';
import { Heart, Play, Star, Users } from 'lucide-react';
import { Game } from '../data/games';
import { useApp } from '../context/AppContext';

interface Props {
  game: Game;
  onPlay: (id: string) => void;
  variant?: 'default' | 'compact';
}

const fmt = (n: number) => n >= 1e6 ? `${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `${(n/1e3).toFixed(0)}K` : String(n);

const catColor: Record<string, string> = {
  shooting: 'bg-err/15 text-err',
  action: 'bg-orange-500/15 text-orange-400',
  'battle-royale': 'bg-rose-500/15 text-rose-400',
  racing: 'bg-primary/15 text-primary',
  puzzle: 'bg-purple/15 text-purple',
  sports: 'bg-ok/15 text-ok',
  strategy: 'bg-pink-500/15 text-pink-400',
  multiplayer: 'bg-cyan/15 text-cyan',
  arcade: 'bg-amber-500/15 text-amber-400',
  adventure: 'bg-yellow-500/15 text-yellow-400',
  simulation: 'bg-teal-500/15 text-teal-400',
  casual: 'bg-violet-500/15 text-violet-400',
  horror: 'bg-purple-800/15 text-purple-300',
  survival: 'bg-lime-500/15 text-lime-400',
  fighting: 'bg-orange-600/15 text-orange-300',
  educational: 'bg-sky-500/15 text-sky-400',
};

export default function GameCard({ game, onPlay, variant = 'default' }: Props) {
  const { toggleFavorite, isFavorite } = useApp();
  const [imgLoaded, setImgLoaded] = useState(false);
  const fav = isFavorite(game.id);

  if (variant === 'compact') {
    return (
      <button onClick={() => onPlay(game.id)}
        className="group flex items-center gap-3 p-2 rounded-xl hover:bg-white/[.04] transition-all w-full text-left">
        <div className="w-14 h-10 rounded-lg overflow-hidden shrink-0 bg-card">
          <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-[13px] font-medium text-t1 truncate group-hover:text-primary transition-colors">{game.title}</h4>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Star className="w-3 h-3 text-warn fill-warn" />
            <span className="text-[11px] text-t4">{game.rating}</span>
            <span className="text-[11px] text-t4 mx-0.5">·</span>
            <span className="text-[11px] text-t4">{fmt(game.plays)}</span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="group relative rounded-[20px] overflow-hidden bg-card border border-border/60 hover:border-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/[.06] hover:-translate-y-1">
      {/* Hover gradient overlay on entire card */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 grad-card-hover pointer-events-none rounded-[20px] z-0" />

      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface z-[1]">
        {!imgLoaded && <div className="absolute inset-0 skeleton" />}
        <img src={game.thumbnail} alt={game.title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy" onLoad={() => setImgLoaded(true)} />

        {/* Play overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button onClick={() => onPlay(game.id)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl grad-btn text-white text-[13px] font-semibold shadow-lg shadow-primary/30 scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-4 h-4 fill-white" /> Play Now
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${catColor[game.category] || 'bg-primary/15 text-primary'}`}>
            {game.category.replace('-', ' ')}
          </span>
          {game.isNew && <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-ok/15 text-ok uppercase tracking-wider">New</span>}
        </div>

        {/* Fav */}
        <button onClick={e => { e.stopPropagation(); toggleFavorite(game.id); }}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full grid place-items-center transition-all ${fav ? 'bg-err/90 text-white' : 'bg-black/40 text-white/70 hover:bg-black/60 hover:text-white'}`}>
          <Heart className={`w-3.5 h-3.5 ${fav ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Info */}
      <div className="relative p-3 z-[1]">
        <h3 className="font-semibold text-t1 text-[14px] line-clamp-1 group-hover:text-primary transition-colors">{game.title}</h3>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.floor(game.rating) ? 'text-warn fill-warn' : 'text-t4/30'}`} />
            ))}
            <span className="text-[11px] font-medium text-t4 ml-1">{game.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-t4">
            <Users className="w-3 h-3" />
            <span className="text-[11px]">{fmt(game.plays)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
