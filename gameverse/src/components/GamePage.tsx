import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft, Maximize, Minimize, Heart, Share2, Flag, Star, Users,
  ThumbsUp, MessageCircle, Play, ChevronRight, Info, Keyboard,
  Loader2, AlertTriangle, ExternalLink, RotateCcw
} from 'lucide-react';
import { getGameById, getGamesByCategory } from '../data/games';
import { useApp } from '../context/AppContext';
import GameCard from './GameCard';

interface Props {
  gameId: string;
  onNavigate: (page: string, data?: any) => void;
}

const fmt = (n: number) => n >= 1e6 ? `${(n/1e6).toFixed(1)}M` : `${(n/1e3).toFixed(0)}K`;

type Phase = 'idle' | 'loading' | 'ready' | 'error';

export default function GamePage({ gameId, onNavigate }: Props) {
  const game = getGameById(gameId);
  const { toggleFavorite, isFavorite, addToRecentlyPlayed, user, setShowAuthModal, setAuthMode } = useApp();

  const [phase, setPhase] = useState<Phase>('idle');
  const [showIframe, setShowIframe] = useState(false);
  const [iframeSrc, setIframeSrc] = useState('');
  const [isFs, setIsFs] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'controls' | 'comments'>('about');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { name: 'ProGamer99', text: 'This game is amazing! Been playing for hours 🔥', date: '2h ago', likes: 24 },
    { name: 'CasualPlayer', text: 'Great graphics and smooth gameplay!', date: '5h ago', likes: 15 },
    { name: 'GameReviewer', text: 'One of the best browser games. Controls are responsive and well-balanced.', date: '1d ago', likes: 42 },
  ]);
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Reset when game changes
  useEffect(() => {
    if (game) {
      addToRecentlyPlayed(game.id);
      window.scrollTo(0, 0);
      setPhase('idle');
      setShowIframe(false);
      setIframeSrc('');
      setActiveTab('about');
      setLiked(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [gameId]);

  // Fullscreen listener
  useEffect(() => {
    const h = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);

  const launchGame = useCallback(() => {
    if (!game) return;

    // For redirect-type games, open in a new tab
    if (game.type === 'redirect') {
      window.open(game.iframeUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // For external iframe games
    setPhase('loading');
    setIframeSrc(game.iframeUrl);
    setShowIframe(true);

    // Auto-resolve after 8s (many cross-origin iframes don't fire onload but work fine)
    timerRef.current = setTimeout(() => {
      setPhase(p => p === 'loading' ? 'ready' : p);
    }, 8000);
  }, [game]);

  const handleIframeLoad = useCallback(() => {
    clearTimeout(timerRef.current);
    setPhase('ready');
  }, []);

  const handleIframeError = useCallback(() => {
    clearTimeout(timerRef.current);
    setPhase('error');
  }, []);

  const retryGame = useCallback(() => {
    setShowIframe(false);
    setIframeSrc('');
    setTimeout(() => launchGame(), 100);
  }, [launchGame]);

  const toggleFullscreen = useCallback(() => {
    if (!wrapRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      wrapRef.current.requestFullscreen().catch(() => {});
    }
  }, []);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch (_e) { /* */ }
  };

  const handleComment = () => {
    if (!user) { setAuthMode('login'); setShowAuthModal(true); return; }
    if (comment.trim()) {
      setComments(prev => [{ name: user.name, text: comment, date: 'Just now', likes: 0 }, ...prev]);
      setComment('');
    }
  };

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-t1 mb-2">Game Not Found</h2>
          <p className="text-t3 mb-6">The game you're looking for doesn't exist.</p>
          <button onClick={() => onNavigate('home')} className="px-6 py-3 rounded-xl grad-btn text-white font-medium">Back to Home</button>
        </div>
      </div>
    );
  }

  const similarGames = getGamesByCategory(game.category).filter(g => g.id !== game.id).slice(0, 6);
  const fav = isFavorite(game.id);
  const isRedirect = game.type === 'redirect';

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-5 text-[13px] flex-wrap">
          <button onClick={() => onNavigate('home')} className="text-t4 hover:text-t1 transition-colors flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" /> Home</button>
          <ChevronRight className="w-3 h-3 text-t4" />
          <button onClick={() => onNavigate('category', { category: game.category })} className="text-t4 hover:text-t1 transition-colors capitalize">{game.category.replace('-',' ')}</button>
          <ChevronRight className="w-3 h-3 text-t4" />
          <span className="text-primary font-medium truncate">{game.title}</span>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div>
            {/* Game Frame */}
            <div ref={wrapRef} className="game-frame-wrap border border-border/50">
              {/* React-managed iframe (only rendered when showIframe is true) */}
              {showIframe && iframeSrc && (
                <iframe
                  src={iframeSrc}
                  className="absolute inset-0 w-full h-full border-0 z-[1]"
                  allow="autoplay; fullscreen; gamepad; microphone; camera"
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-popups-to-escape-sandbox allow-presentation"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  title={game.title}
                />
              )}

              {/* Loading overlay */}
              {phase === 'loading' && (
                <div className="absolute inset-0 z-[2] grid place-items-center bg-base/90 backdrop-blur-sm">
                  <div className="text-center">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-t2 font-medium">Loading {game.title}…</p>
                    <p className="text-t4 text-xs mt-1">This may take a moment</p>
                  </div>
                </div>
              )}

              {/* Error overlay */}
              {phase === 'error' && (
                <div className="absolute inset-0 z-[2] grid place-items-center bg-base/95 backdrop-blur-sm">
                  <div className="text-center px-6 max-w-md">
                    <AlertTriangle className="w-12 h-12 text-warn mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-t1 mb-2">Game Failed to Load</h3>
                    <p className="text-t3 text-sm mb-6">This game may block iframe embedding. Try opening it directly.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button onClick={retryGame} className="flex items-center gap-2 px-5 py-2.5 rounded-xl grad-btn text-white text-sm font-semibold">
                        <RotateCcw className="w-4 h-4" /> Retry
                      </button>
                      <a href={game.iframeUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass text-t1 text-sm font-semibold hover:bg-white/[.08] transition-colors">
                        <ExternalLink className="w-4 h-4" /> Open in New Tab
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Idle overlay */}
              {phase === 'idle' && (
                <div className="absolute inset-0 z-[2] grid place-items-center">
                  <div className="absolute inset-0">
                    <img src={game.thumbnail} alt="" className="w-full h-full object-cover opacity-25 blur-sm" />
                    <div className="absolute inset-0 bg-gradient-to-t from-base via-base/80 to-base/40" />
                  </div>
                  <div className="relative text-center px-6 max-w-lg">
                    <img src={game.thumbnail} alt={game.title} className="w-28 h-20 object-cover rounded-xl mx-auto mb-4 shadow-xl border border-border/50" />
                    <h3 className="text-xl font-bold text-t1 mb-1">{game.title}</h3>

                    {isRedirect ? (
                      <>
                        <p className="text-t4 text-sm mb-2">This game opens in a new tab for the best experience.</p>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan/10 text-cyan text-[11px] font-medium mb-5">
                          <ExternalLink className="w-3 h-3" /> Opens in new tab
                        </div>
                      </>
                    ) : (
                      <p className="text-t4 text-sm mb-6">Click play to start. Some games may take a moment to load.</p>
                    )}

                    <button onClick={launchGame}
                      className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl grad-btn text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.03] transition-all">
                      {isRedirect ? <ExternalLink className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                      {isRedirect ? 'Open Game' : 'Play Now'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => toggleFavorite(game.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all ${fav ? 'bg-err/10 text-err' : 'glass text-t3 hover:text-t1'}`}>
                  <Heart className={`w-3.5 h-3.5 ${fav ? 'fill-err' : ''}`} /> {fav ? 'Saved' : 'Save'}
                </button>
                <button onClick={() => setLiked(!liked)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all ${liked ? 'bg-primary/10 text-primary' : 'glass text-t3 hover:text-t1'}`}>
                  <ThumbsUp className={`w-3.5 h-3.5 ${liked ? 'fill-primary' : ''}`} /> Like
                </button>
                <button onClick={handleShare}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass text-[13px] font-medium text-t3 hover:text-t1 transition-all">
                  <Share2 className="w-3.5 h-3.5" /> {shared ? 'Copied!' : 'Share'}
                </button>
              </div>
              <div className="flex items-center gap-2">
                {!isRedirect && (
                  <button onClick={toggleFullscreen}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass text-[13px] font-medium text-t3 hover:text-t1 transition-all">
                    {isFs ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
                    {isFs ? 'Exit' : 'Fullscreen'}
                  </button>
                )}
                <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass text-[13px] font-medium text-t3 hover:text-err transition-all">
                  <Flag className="w-3.5 h-3.5" /> Report
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-8 border-b border-border/60">
              <div className="flex items-center gap-0.5">
                {([
                  { id: 'about' as const, label: 'About', icon: Info },
                  { id: 'controls' as const, label: 'Controls', icon: Keyboard },
                  { id: 'comments' as const, label: 'Comments', icon: MessageCircle },
                ]).map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-4 py-3 text-[13px] font-medium border-b-2 transition-all ${activeTab === tab.id ? 'border-primary text-t1' : 'border-transparent text-t4 hover:text-t2'}`}>
                    <tab.icon className="w-3.5 h-3.5" /> {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              {activeTab === 'about' && (
                <div className="space-y-5">
                  <div><h3 className="text-base font-semibold text-t1 mb-2">About This Game</h3><p className="text-t3 text-sm leading-relaxed">{game.description}</p></div>
                  <div><h3 className="text-base font-semibold text-t1 mb-2">How to Play</h3><p className="text-t3 text-sm leading-relaxed">{game.instructions}</p></div>
                  <div className="flex flex-wrap gap-1.5">{game.tags.map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-lg bg-surface border border-border text-[11px] font-medium text-t3">#{t}</span>
                  ))}</div>
                </div>
              )}
              {activeTab === 'controls' && (
                <div>
                  <h3 className="text-base font-semibold text-t1 mb-3">Game Controls</h3>
                  <div className="glass-card rounded-xl p-5 space-y-2.5">
                    {game.controls.split('|').map((c, i) => {
                      const parts = c.split('—');
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <kbd className="px-3 py-1 rounded-lg bg-input border border-border text-[11px] font-mono font-semibold text-primary shrink-0">{parts[0]?.trim()}</kbd>
                          {parts[1] && <span className="text-sm text-t3">{parts[1].trim()}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {activeTab === 'comments' && (
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <input type="text" placeholder={user ? 'Write a comment…' : 'Sign in to comment…'} value={comment} onChange={e => setComment(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleComment()}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-input border border-border text-sm text-t1 placeholder:text-t4 focus:outline-none focus:border-primary/50" />
                    <button onClick={handleComment} className="px-4 py-2.5 rounded-xl grad-btn text-white text-sm font-medium">Post</button>
                  </div>
                  <div className="space-y-3">{comments.map((c, i) => (
                    <div key={i} className="glass-card rounded-xl p-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full grad-btn grid place-items-center text-white text-[11px] font-bold">{c.name[0]}</div>
                          <span className="text-[13px] font-medium text-t1">{c.name}</span>
                        </div>
                        <span className="text-[11px] text-t4">{c.date}</span>
                      </div>
                      <p className="text-sm text-t3">{c.text}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button className="flex items-center gap-1 text-[11px] text-t4 hover:text-primary transition-colors"><ThumbsUp className="w-3 h-3" /> {c.likes}</button>
                        <button className="text-[11px] text-t4 hover:text-primary transition-colors">Reply</button>
                      </div>
                    </div>
                  ))}</div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="glass-card rounded-2xl p-5 space-y-4">
              <h3 className="font-head text-lg font-bold text-t1">{game.title}</h3>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-input rounded-xl p-3 text-center">
                  <Star className="w-4 h-4 text-warn fill-warn mx-auto mb-0.5" />
                  <p className="text-base font-bold text-t1">{game.rating}</p>
                  <p className="text-[10px] text-t4">Rating</p>
                </div>
                <div className="bg-input rounded-xl p-3 text-center">
                  <Users className="w-4 h-4 text-cyan mx-auto mb-0.5" />
                  <p className="text-base font-bold text-t1">{fmt(game.plays)}</p>
                  <p className="text-[10px] text-t4">Plays</p>
                </div>
              </div>
              <div className="space-y-2 text-[13px]">
                <div className="flex justify-between"><span className="text-t4">Developer</span><span className="text-t1 font-medium text-right max-w-[180px] truncate">{game.developer}</span></div>
                <div className="flex justify-between"><span className="text-t4">Category</span><span className="text-primary font-medium capitalize">{game.category.replace('-',' ')}</span></div>
                <div className="flex justify-between"><span className="text-t4">Released</span><span className="text-t2">{new Date(game.releaseDate).toLocaleDateString('en-US',{year:'numeric',month:'short'})}</span></div>
                <div className="flex justify-between"><span className="text-t4">Type</span><span className={`font-medium ${isRedirect ? 'text-cyan' : 'text-ok'}`}>{isRedirect ? 'External' : 'Embedded'}</span></div>
              </div>
            </div>

            <a href={game.iframeUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl glass text-[13px] font-medium text-t3 hover:text-t1 hover:bg-white/[.06] transition-colors">
              <ExternalLink className="w-4 h-4" /> Open Game Website
            </a>

            <div>
              <h3 className="font-semibold text-t1 text-sm mb-3">Similar Games</h3>
              <div className="space-y-1.5">
                {similarGames.map(g => (
                  <GameCard key={g.id} game={g} onPlay={id => onNavigate('game', { gameId: id })} variant="compact" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
