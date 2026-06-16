import { useState, useCallback, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturedCarousel from './components/FeaturedCarousel';
import TrendingGames from './components/TrendingGames';
import CategoriesSection from './components/CategoriesSection';
import SearchFilter from './components/SearchFilter';
import GamePage from './components/GamePage';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import MostPlayedSection from './components/MostPlayedSection';
import DailyChallenges from './components/DailyChallenges';
import EditorPicks from './components/EditorPicks';
import SandboxGames from './components/SandboxGames';
import ContinuePlaying from './components/ContinuePlaying';

interface PageState { page: string; data?: any; }

function AppContent() {
  const [ps, setPs] = useState<PageState>({ page: 'home' });

  const nav = useCallback((page: string, data?: any) => {
    setPs({ page, data });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const play = useCallback((id: string) => nav('game', { gameId: id }), [nav]);

  useEffect(() => {
    const h = () => setPs({ page: 'home' });
    window.addEventListener('popstate', h);
    return () => window.removeEventListener('popstate', h);
  }, []);

  const renderPage = () => {
    switch (ps.page) {
      case 'game':
        return <GamePage gameId={ps.data?.gameId} onNavigate={nav} />;
      case 'dashboard': case 'favorites': case 'premium':
        return <Dashboard onNavigate={nav} />;
      case 'search':
        return <div className="pt-20"><SearchFilter onPlay={play} initialQuery={ps.data?.query || ''} /></div>;
      case 'category':
        return <div className="pt-20"><SearchFilter onPlay={play} initialCategory={ps.data?.category || ''} /></div>;
      case 'categories':
        return <div className="pt-20"><CategoriesSection onNavigate={nav} /><SearchFilter onPlay={play} /></div>;
      case 'trending': case 'new': case 'games':
        return <div className="pt-20"><SearchFilter onPlay={play} /></div>;
      default:
        return (
          <>
            <HeroSection onNavigate={nav} />
            <ContinuePlaying onPlay={play} />
            <FeaturedCarousel onPlay={play} />
            <TrendingGames onPlay={play} onNavigate={nav} />
            <SandboxGames onPlay={play} onNavigate={nav} />
            <EditorPicks onPlay={play} />
            <DailyChallenges onPlay={play} />
            <CategoriesSection onNavigate={nav} />
            <MostPlayedSection onPlay={play} onNavigate={nav} />
            <SearchFilter onPlay={play} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-base text-t1">
      <Navbar onNavigate={nav} currentPage={ps.page} />
      <main>{renderPage()}</main>
      <Footer onNavigate={nav} />
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
