import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isPremium: boolean;
}

interface AppState {
  user: User | null;
  favorites: string[];
  recentlyPlayed: string[];
  showAuthModal: boolean;
  authMode: 'login' | 'signup' | 'forgot';
  showMobileMenu: boolean;
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
  toggleFavorite: (gameId: string) => void;
  addToRecentlyPlayed: (gameId: string) => void;
  setShowAuthModal: (v: boolean) => void;
  setAuthMode: (m: 'login' | 'signup' | 'forgot') => void;
  setShowMobileMenu: (v: boolean) => void;
  isFavorite: (id: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem('gv-state');
      if (saved) {
        const p = JSON.parse(saved);
        return { ...p, showAuthModal: false, showMobileMenu: false };
      }
    } catch {}
    return {
      user: null, favorites: [], recentlyPlayed: [],
      showAuthModal: false, authMode: 'login' as const, showMobileMenu: false,
    };
  });

  useEffect(() => {
    const { showAuthModal, showMobileMenu, ...rest } = state;
    localStorage.setItem('gv-state', JSON.stringify(rest));
  }, [state]);

  const login = useCallback((email: string, _pw: string) => {
    const name = email.split('@')[0];
    setState(s => ({
      ...s, showAuthModal: false,
      user: { id: '1', name, email, avatar: `https://ui-avatars.com/api/?name=${name}&background=3B82F6&color=fff&bold=true`, isPremium: false },
    }));
  }, []);

  const signup = useCallback((name: string, email: string, _pw: string) => {
    setState(s => ({
      ...s, showAuthModal: false,
      user: { id: '1', name, email, avatar: `https://ui-avatars.com/api/?name=${name}&background=8B5CF6&color=fff&bold=true`, isPremium: false },
    }));
  }, []);

  const logout = useCallback(() => setState(s => ({ ...s, user: null })), []);

  const toggleFavorite = useCallback((id: string) => {
    setState(s => ({
      ...s,
      favorites: s.favorites.includes(id) ? s.favorites.filter(x => x !== id) : [...s.favorites, id],
    }));
  }, []);

  const addToRecentlyPlayed = useCallback((id: string) => {
    setState(s => ({
      ...s,
      recentlyPlayed: [id, ...s.recentlyPlayed.filter(x => x !== id)].slice(0, 24),
    }));
  }, []);

  const setShowAuthModal = useCallback((v: boolean) => setState(s => ({ ...s, showAuthModal: v })), []);
  const setAuthMode = useCallback((m: 'login' | 'signup' | 'forgot') => setState(s => ({ ...s, authMode: m })), []);
  const setShowMobileMenu = useCallback((v: boolean) => setState(s => ({ ...s, showMobileMenu: v })), []);
  const isFavorite = useCallback((id: string) => state.favorites.includes(id), [state.favorites]);

  return (
    <AppContext.Provider value={{
      ...state, login, signup, logout, toggleFavorite, addToRecentlyPlayed,
      setShowAuthModal, setAuthMode, setShowMobileMenu, isFavorite,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};
