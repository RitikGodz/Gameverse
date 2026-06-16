import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, TrendingUp, Clock, Star, Flame } from 'lucide-react';
import { games, categories, getTrendingGames, getNewGames, getMostPlayed, Game } from '../data/games';
import GameCard from './GameCard';

interface Props { onPlay: (id: string) => void; initialQuery?: string; initialCategory?: string; }
type SortMode = 'all' | 'trending' | 'new' | 'most-played' | 'top-rated';

export default function SearchFilter({ onPlay, initialQuery = '', initialCategory = '' }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [cat, setCat] = useState(initialCategory);
  const [sort, setSort] = useState<SortMode>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let r: Game[] = sort === 'trending' ? getTrendingGames() : sort === 'new' ? getNewGames() : sort === 'most-played' ? getMostPlayed() : sort === 'top-rated' ? [...games].sort((a, b) => b.rating - a.rating) : [...games];
    if (cat) r = r.filter(g => g.category === cat || g.subcategories.includes(cat));
    if (query.trim()) { const q = query.toLowerCase(); r = r.filter(g => g.title.toLowerCase().includes(q) || g.category.includes(q) || g.tags.some(t => t.includes(q))); }
    return r;
  }, [query, cat, sort]);

  const sortBtns: { id: SortMode; label: string; icon: any }[] = [
    { id: 'all', label: 'All', icon: Star }, { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'new', label: 'New', icon: Flame }, { id: 'most-played', label: 'Most Played', icon: Clock },
    { id: 'top-rated', label: 'Top Rated', icon: Star },
  ];

  return (
    <section className="py-12 sm:py-16" id="games-grid">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="font-head text-xl sm:text-2xl font-bold text-t1">
              {cat ? `${categories.find(c => c.id === cat)?.name || 'All'} Games` : query ? `Results for "${query}"` : 'All Games'}
            </h2>
            <p className="text-t4 text-[13px] mt-0.5">{filtered.length} games found</p>
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass text-[13px] font-medium text-t3 sm:hidden">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          {/* Sidebar */}
          <div className={`lg:w-52 shrink-0 space-y-5 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-t4" />
              <input type="text" placeholder="Search…" value={query} onChange={e => setQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-input border border-border text-[13px] text-t1 placeholder:text-t4 focus:outline-none focus:border-primary/50" />
              {query && <button onClick={() => setQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-t4 hover:text-t1"><X className="w-3.5 h-3.5" /></button>}
            </div>
            <div>
              <h4 className="text-[11px] font-semibold text-t4 uppercase tracking-wider mb-2">Sort By</h4>
              <div className="space-y-0.5">
                {sortBtns.map(b => (
                  <button key={b.id} onClick={() => setSort(b.id)}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${sort === b.id ? 'bg-primary/10 text-primary' : 'text-t3 hover:text-t1 hover:bg-white/[.03]'}`}>
                    <b.icon className="w-3.5 h-3.5" /> {b.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold text-t4 uppercase tracking-wider mb-2">Categories</h4>
              <div className="space-y-0.5 max-h-[380px] overflow-y-auto hide-scrollbar">
                <button onClick={() => setCat('')}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[13px] transition-all ${!cat ? 'bg-primary/10 text-primary font-medium' : 'text-t3 hover:text-t1 hover:bg-white/[.03]'}`}>
                  <span>All</span><span className="text-[11px] text-t4">{games.length}</span>
                </button>
                {categories.map(c => (
                  <button key={c.id} onClick={() => setCat(c.id === cat ? '' : c.id)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[13px] transition-all ${cat === c.id ? 'bg-primary/10 text-primary font-medium' : 'text-t3 hover:text-t1 hover:bg-white/[.03]'}`}>
                    <span className="flex items-center gap-1.5"><span className="text-sm">{c.icon}</span> {c.name}</span>
                    <span className="text-[11px] text-t4">{c.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1">
            <div className="hidden sm:flex items-center gap-1.5 mb-5 flex-wrap">
              {sortBtns.map(b => (
                <button key={b.id} onClick={() => setSort(b.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${sort === b.id ? 'grad-btn text-white shadow-md shadow-primary/20' : 'glass text-t3 hover:text-t1'}`}>
                  <b.icon className="w-3 h-3" /> {b.label}
                </button>
              ))}
            </div>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filtered.map(g => <GameCard key={g.id} game={g} onPlay={onPlay} />)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-5xl mb-3">🎮</div>
                <h3 className="text-lg font-semibold text-t1 mb-1">No games found</h3>
                <p className="text-t4 text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
