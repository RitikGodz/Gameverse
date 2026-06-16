import { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Menu, X, User, Heart, LogOut, Crown, Gamepad2, ChevronDown } from 'lucide-react';
import { searchGames } from '../data/games';

interface NavbarProps {
  onNavigate: (page: string, data?: any) => void;
  currentPage: string;
}

export default function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const { user, logout, setShowAuthModal, setAuthMode, showMobileMenu, setShowMobileMenu, favorites } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const suggestions = useMemo(() => {
    if (searchQuery.trim().length < 2) return [];
    return searchGames(searchQuery.trim()).slice(0, 5);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('search', { query: searchQuery.trim() });
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'categories', label: 'Categories' },
    { id: 'trending', label: 'Trending' },
    { id: 'new', label: 'New Games' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-strong shadow-lg shadow-black/30' : 'bg-transparent'}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-xl grad-btn flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-head font-bold text-lg tracking-wide hidden xs:inline">
                <span className="text-t1">GAME</span>
                <span className="text-cyan">VERSE</span>
              </span>
            </button>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map(l => (
                <button key={l.id} onClick={() => onNavigate(l.id)}
                  className={`relative px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${
                    currentPage === l.id ? 'text-t1 bg-white/[.07]' : 'text-t3 hover:text-t1 hover:bg-white/[.04]'
                  }`}
                >
                  {l.label}
                  {currentPage === l.id && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>

            {/* Right */}
            <div className="flex items-center gap-1.5">
              <button onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-xl text-t3 hover:text-t1 hover:bg-white/[.05] transition-all">
                {searchOpen ? <X className="w-[18px] h-[18px]" /> : <Search className="w-[18px] h-[18px]" />}
              </button>
              <button onClick={() => onNavigate('favorites')}
                className="hidden sm:flex p-2.5 rounded-xl text-t3 hover:text-t1 hover:bg-white/[.05] transition-all relative">
                <Heart className="w-[18px] h-[18px]" />
                {favorites.length > 0 && (
                  <span className="absolute top-1 right-1 w-[14px] h-[14px] rounded-full bg-err text-[9px] font-bold grid place-items-center text-white">{favorites.length > 9 ? '9+' : favorites.length}</span>
                )}
              </button>

              {user ? (
                <div className="relative">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/[.05] transition-all">
                    <img src={user.avatar} alt="" className="w-7 h-7 rounded-lg" />
                    <span className="hidden sm:block text-[13px] font-medium text-t2">{user.name}</span>
                    <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-t4" />
                  </button>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-56 glass-strong rounded-2xl shadow-2xl z-50 py-1.5 border border-border-light/30 overflow-hidden">
                        <div className="px-4 py-3 border-b border-border/60">
                          <p className="text-sm font-semibold text-t1">{user.name}</p>
                          <p className="text-xs text-t4 mt-0.5">{user.email}</p>
                        </div>
                        {[
                          { icon: User, label: 'Dashboard', action: () => onNavigate('dashboard') },
                          { icon: Heart, label: `Favorites (${favorites.length})`, action: () => onNavigate('favorites') },
                          { icon: Crown, label: 'Go Premium', action: () => onNavigate('premium'), gold: true },
                        ].map(item => (
                          <button key={item.label} onClick={() => { item.action(); setUserMenuOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-t3 hover:text-t1 hover:bg-white/[.04] transition-colors">
                            <item.icon className={`w-4 h-4 ${item.gold ? 'text-warn' : ''}`} /> {item.label}
                          </button>
                        ))}
                        <div className="border-t border-border/60 mt-1 pt-1">
                          <button onClick={() => { logout(); setUserMenuOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-err/80 hover:text-err hover:bg-err/[.06] transition-colors">
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                  className="hidden sm:flex px-4 py-2 rounded-xl grad-btn text-white text-[13px] font-semibold shadow-md shadow-primary/20 hover:shadow-primary/40 transition-shadow">
                  Sign In
                </button>
              )}

              <button onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2.5 rounded-xl text-t3 hover:text-t1 hover:bg-white/[.05] transition-all">
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Dropdown */}
        {searchOpen && (
          <div className="border-t border-border/40 bg-base/95 backdrop-blur-xl">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-t4" />
                <input type="text" placeholder="Search games, categories, tags…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} autoFocus
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface border border-border text-t1 text-sm placeholder:text-t4 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all" />
              </form>
              {suggestions.length > 0 && (
                <div className="mt-2 rounded-xl bg-surface border border-border overflow-hidden divide-y divide-border/50">
                  {suggestions.map(g => (
                    <button key={g.id} onClick={() => { onNavigate('game', { gameId: g.id }); setSearchOpen(false); setSearchQuery(''); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/[.04] transition-colors">
                      <img src={g.thumbnail} alt="" className="w-10 h-7 rounded-md object-cover bg-card" loading="lazy" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-t1 truncate">{g.title}</p>
                        <p className="text-[11px] text-t4 capitalize">{g.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-surface border-l border-border shadow-2xl overflow-y-auto">
            <div className="p-5 pt-20 space-y-1">
              {!user && (
                <button onClick={() => { setAuthMode('login'); setShowAuthModal(true); setShowMobileMenu(false); }}
                  className="w-full py-3 rounded-xl grad-btn text-white font-semibold text-sm mb-5">Sign In</button>
              )}
              {[
                { id: 'home', label: 'Home', icon: '🏠' },
                { id: 'categories', label: 'Categories', icon: '📂' },
                { id: 'trending', label: 'Trending', icon: '🔥' },
                { id: 'new', label: 'New Games', icon: '✨' },
                { id: 'favorites', label: 'Favorites', icon: '❤️' },
              ].map(l => (
                <button key={l.id} onClick={() => { onNavigate(l.id); setShowMobileMenu(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentPage === l.id ? 'text-t1 bg-white/[.07]' : 'text-t3 hover:text-t1 hover:bg-white/[.04]'}`}>
                  <span>{l.icon}</span> {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
