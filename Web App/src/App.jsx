import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import MediaModal from './components/MediaModal';
import ApiKeyModal from './components/ApiKeyModal';
import AiAssistantModal from './components/AiAssistantModal';
import FloatingPipPlayer from './components/FloatingPipPlayer';
import HomePage from './pages/HomePage';
import WatchPage from './pages/WatchPage';
import SearchPage from './pages/SearchPage';
import WatchlistPage from './pages/WatchlistPage';
import CategoryPage from './pages/CategoryPage';
import TorrentWatchPage from './pages/TorrentWatchPage';
import DownloadPage from './pages/DownloadPage';
import SettingsPage from './pages/SettingsPage';

function ModalsContainer() {
  const { isSettingsOpen, setIsSettingsOpen } = useApp();
  return (
    <>
      <MediaModal />
      <ApiKeyModal />
      <AiAssistantModal />
      <FloatingPipPlayer />
      {isSettingsOpen && <SettingsPage onClose={() => setIsSettingsOpen(false)} />}
    </>
  );
}

function AppLayout() {
  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col justify-between selection:bg-[#E50914] selection:text-white">
      <Navbar />

      <main className="flex-grow pb-16 md:pb-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/animation" element={<CategoryPage />} />
          <Route path="/movies" element={<CategoryPage />} />
          <Route path="/tv" element={<CategoryPage />} />

          <Route path="/watch/:slug" element={<WatchPage />} />
          <Route path="/watch/tv/:slug" element={<WatchPage />} />
          <Route path="/watch/movie/:id" element={<WatchPage />} />
          <Route path="/watch/torrent" element={<TorrentWatchPage />} />
          <Route path="/download" element={<DownloadPage />} />

          <Route path="/settings" element={<SettingsPageWrapper />} />

          <Route path="/search" element={<SearchPage />} />
          <Route path="/my-list" element={<WatchlistPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      <ModalsContainer />

      {/* CineVault Footer */}
      <footer className="border-t border-zinc-800/80 bg-[#0e0e0e] py-10 text-xs text-gray-500 font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-300 font-black text-sm tracking-[0.2em]">CINEVAULT</span>
              <span className="text-[10px] text-gray-500 font-normal border border-zinc-800 px-2 py-0.5 rounded">cinevault.cc.cd</span>
            </div>
            <p className="text-gray-500">
              Powered by <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer" className="text-red-500 hover:underline">TMDB</a>.
            </p>
          </div>
          <p className="text-gray-600 text-[11px] leading-relaxed">
          </p>
        </div>
      </footer>
    </div>
  );
}

function SettingsPageWrapper() {
  const { setIsSettingsOpen } = useApp();
  return <SettingsPage onClose={() => setIsSettingsOpen(false)} />;
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppLayout />
      </Router>
    </AppProvider>
  );
}
