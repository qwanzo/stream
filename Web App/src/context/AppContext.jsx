import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const ACCENT_THEMES = {
  red: { name: 'Netflix Red', main: '#E50914', bgClass: 'bg-[#E50914]', textClass: 'text-[#E50914]', borderClass: 'border-[#E50914]' },
  purple: { name: 'Cyberpunk Purple', main: '#A855F7', bgClass: 'bg-purple-600', textClass: 'text-purple-500', borderClass: 'border-purple-600' },
  emerald: { name: 'Emerald Green', main: '#10B981', bgClass: 'bg-emerald-500', textClass: 'text-emerald-400', borderClass: 'border-emerald-500' },
  gold: { name: 'Midnight Gold', main: '#F59E0B', bgClass: 'bg-amber-500', textClass: 'text-amber-400', borderClass: 'border-amber-500' }
};

export function AppProvider({ children }) {
  const [apiKey, setApiKeyState] = useState(() => {
    return localStorage.getItem('plix_tmdb_api_key') || import.meta.env.VITE_TMDB_API_KEY || '5e3fe84dd167f1eab0a5695d99177cf7';
  });

  const setApiKey = (key) => {
    setApiKeyState(key);
    if (key) {
      localStorage.setItem('plix_tmdb_api_key', key);
    } else {
      localStorage.removeItem('plix_tmdb_api_key');
    }
  };

  const [groqApiKey, setGroqApiKeyState] = useState(() => {
    return localStorage.getItem('plix_groq_api_key') || import.meta.env.VITE_GROQ_API_KEY || '';
  });

  const setGroqApiKey = (key) => {
    setGroqApiKeyState(key);
    if (key) {
      localStorage.setItem('plix_groq_api_key', key);
    } else {
      localStorage.removeItem('plix_groq_api_key');
    }
  };

  const [themeAccent, setThemeAccentState] = useState(() => {
    return localStorage.getItem('plix_theme_accent') || 'red';
  });

  const setThemeAccent = (theme) => {
    setThemeAccentState(theme);
    localStorage.setItem('plix_theme_accent', theme);
  };

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedMediaModal, setSelectedMediaModal] = useState(null);

  const [activePipMedia, setActivePipMedia] = useState(null);

  const [selectedServer, setSelectedServer] = useState('main');
  const [autoFailover, setAutoFailover] = useState(true);

  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem('plix_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('plix_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = (item) => {
    setWatchlist(prev => {
      const exists = prev.some(x => String(x.id) === String(item.id) && x.media_type === item.media_type);
      if (exists) {
        return prev.filter(x => !(String(x.id) === String(item.id) && x.media_type === item.media_type));
      }
      return [item, ...prev];
    });
  };

  const isInWatchlist = (id, media_type = 'movie') => {
    return watchlist.some(x => String(x.id) === String(id) && (x.media_type || 'movie') === media_type);
  };

  const [continueWatching, setContinueWatching] = useState(() => {
    try {
      const saved = localStorage.getItem('plix_continue_watching');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('plix_continue_watching', JSON.stringify(continueWatching));
  }, [continueWatching]);

  const saveWatchProgress = (media, season = 1, episode = 1) => {
    setContinueWatching(prev => {
      const filtered = prev.filter(x => !(String(x.id) === String(media.id) && x.media_type === media.media_type));
      const updatedItem = {
        ...media,
        season,
        episode,
        updatedAt: Date.now()
      };
      return [updatedItem, ...filtered].slice(0, 15);
    });
  };

  const [userRatings, setUserRatings] = useState(() => {
    try {
      const saved = localStorage.getItem('plix_user_ratings');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('plix_user_ratings', JSON.stringify(userRatings));
  }, [userRatings]);

  const setUserRating = (mediaId, rating, note = '') => {
    setUserRatings(prev => ({
      ...prev,
      [mediaId]: { rating, note, updatedAt: Date.now() }
    }));
  };

  return (
    <AppContext.Provider value={{
        apiKey,
        setApiKey,
        groqApiKey,
        setGroqApiKey,
        themeAccent,
        setThemeAccent,
        isApiKeyModalOpen,
        setIsApiKeyModalOpen,
        isAiModalOpen,
        setIsAiModalOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        selectedServer,
        setSelectedServer,
        autoFailover,
        setAutoFailover,
        selectedMediaModal,
        setSelectedMediaModal,
        activePipMedia,
        setActivePipMedia,
        watchlist,
        toggleWatchlist,
        isInWatchlist,
        continueWatching,
        saveWatchProgress,
        userRatings,
        setUserRating,
      }}>
        {children}
      </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
