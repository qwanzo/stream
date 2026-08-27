import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search, X, Play, Sparkles,
  Flame, Menu, Home, BookMarked, Film, Tv, Download
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { searchMulti, getImageUrl } from '../services/tmdb';
import { getMediaWatchUrl } from '../utils/slug';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { apiKey, setIsSettingsOpen } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsDropdownVisible(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('#search-container')) {
        setIsDropdownVisible(false);
      }
      if (!e.target.closest('#mobile-menu') && !e.target.closest('#menu-btn')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsDropdownVisible(false);
      return;
    }
    const timer = setTimeout(async () => {
      const results = await searchMulti(searchQuery, apiKey);
      setSearchResults(results.slice(0, 6));
      setIsDropdownVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, apiKey]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsDropdownVisible(false);
      setIsSearchOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Animation', path: '/animation', icon: Sparkles },
    { label: 'Movies', path: '/movies', icon: Film },
    { label: 'TV Series', path: '/tv', icon: Tv },
    { label: 'My List', path: '/my-list', icon: BookMarked },
  ];

  return (
    <>
      {/* ── Top Navbar ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled
          ? 'bg-[#141414] shadow-lg shadow-black/80 border-b border-zinc-800/60'
          : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">

          {/* Left: Logo + Desktop Nav */}
          <div className="flex items-center gap-5 lg:gap-9 min-w-0">
            <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
              <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-red-600 to-red-800 rounded-lg shadow-lg shadow-red-900/60 group-hover:scale-105 transition-transform border border-red-500/40">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-current ml-0.5" />
                <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 w-2 h-2 rounded-full border border-black animate-pulse" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-black text-base sm:text-xl tracking-wider uppercase">
                  STREAMSILU<span className="text-[#E50914]">STREAM</span>
                </span>
                <span className="text-[8px] sm:text-[9px] text-gray-400 font-bold tracking-wider uppercase hidden xs:block">
                  stream.streamsilu.cc.cd
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-colors duration-200 whitespace-nowrap ${
                    location.pathname === link.path
                      ? 'text-white font-bold border-b-2 border-[#E50914] pb-0.5'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">

            {/* Search */}
            <div id="search-container" className="relative">
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <div className={`flex items-center rounded-full transition-all duration-300 ${
                  isSearchOpen
                    ? 'bg-black/90 border border-zinc-700 px-2.5 py-1.5 w-40 sm:w-56 focus-within:border-red-600'
                    : 'bg-transparent'
                }`}>
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="text-gray-300 hover:text-white p-1"
                    aria-label="Toggle search"
                  >
                    <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  {isSearchOpen && (
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent text-white text-sm focus:outline-none ml-1.5 w-full placeholder-gray-500"
                      autoFocus
                    />
                  )}
                  {isSearchOpen && searchQuery && (
                    <button type="button" onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-white p-0.5">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </form>

              {/* Instant Search Dropdown */}
              {isDropdownVisible && searchResults.length > 0 && (
                <div className="absolute right-0 mt-2 w-64 sm:w-80 bg-[#181818] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="p-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-[#141414] px-3 flex items-center justify-between">
                    <span>Results</span>
                    <Flame className="w-3.5 h-3.5 text-red-500" />
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-zinc-800/80">
                    {searchResults.map((item) => {
                      const title = item.title || item.name;
                      const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
                      const year = (item.release_date || item.first_air_date || '').substring(0, 4);
                      return (
                        <Link
                          key={item.id}
                          to={getMediaWatchUrl(item)}
                          onClick={() => setIsDropdownVisible(false)}
                          className="flex items-center p-2.5 hover:bg-zinc-800 cursor-pointer transition-colors gap-3 group"
                        >
                          <img
                            src={getImageUrl(item.poster_path, 'posterSmall')}
                            alt={title}
                            className="w-9 h-12 object-cover rounded shadow"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-semibold text-white truncate group-hover:text-[#E50914]">{title}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                              <span className="uppercase bg-zinc-700/80 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-200">{mediaType}</span>
                              {year && <span>{year}</span>}
                              {item.vote_average > 0 && <span className="text-yellow-400 font-semibold">★ {item.vote_average.toFixed(1)}</span>}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <button onClick={handleSearchSubmit} className="w-full text-center py-2.5 text-xs text-red-500 hover:text-red-400 font-bold bg-[#141414] hover:bg-zinc-900 transition-colors">
                    View all results →
                  </button>
                </div>
              )}
            </div>

            {/* Settings */}
            <button
                onClick={() => setIsSettingsOpen(true)}
                className="hidden sm:flex items-center gap-1 bg-zinc-800/80 hover:bg-zinc-700 text-gray-200 hover:text-white px-2.5 py-1.5 rounded-full text-xs font-semibold border border-zinc-700 transition-all"
                title="Settings"
              >
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>

            <Link to="/download" className="hidden sm:flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800/80 px-2.5 py-1.5 text-xs font-semibold text-gray-200 transition-all hover:bg-zinc-700 hover:text-white" title="Download Android app">
              <Download className="h-3.5 w-3.5 text-red-500" />
              Download
            </Link>

            {/* Mobile Hamburger */}
            <button
              id="menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800/80 text-gray-200 hover:text-white hover:bg-zinc-700 border border-zinc-700 transition-all"
              aria-label="Open menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden bg-[#141414] border-t border-zinc-800 px-4 py-3 space-y-1 shadow-xl"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    location.pathname === link.path
                      ? 'bg-red-950/60 text-white border border-red-800/50'
                      : 'text-gray-300 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-red-500 flex-shrink-0" />
                  {link.label}
                </Link>
              );
            })}

            {/* Mobile-only quick actions */}
            <div className="pt-3 mt-2 border-t border-zinc-800 flex flex-col gap-2">
              <Link to="/download" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-zinc-800 transition-colors">
                <Download className="h-4 w-4 text-red-500" />
                Download Android app
              </Link>
              <button
                  onClick={() => { setIsSettingsOpen(true); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Mobile Bottom Navigation Bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0e0e0e] border-t border-zinc-800 flex items-stretch safe-area-inset-bottom">
        {[
          { label: 'Home', path: '/', icon: Home },
          { label: 'Movies', path: '/movies', icon: Film },
          { label: 'TV Series', path: '/tv', icon: Tv },
          { label: 'My List', path: '/my-list', icon: BookMarked },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = item.path && location.pathname === item.path;

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors active:scale-95 ${
                isActive ? 'text-white' : 'text-gray-500'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#E50914]' : ''}`} />
              <span className={`text-[10px] font-semibold ${isActive ? 'text-white' : ''}`}>{item.label}</span>
              {isActive && <div className="w-1 h-1 rounded-full bg-[#E50914] mt-0.5" />}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

