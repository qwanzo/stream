import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const TMDB_KEY = 'pansilu_tmdb_api_key';
const THEME_KEY = 'pansilu_theme';

export default function SettingsPage({ onClose }) {
  const [tmdbKey, setTmdbKey] = useState(() => localStorage.getItem(TMDB_KEY) || '5e3fe84dd167f1eab0a5695d99177cf7');
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (tmdbKey) {
      localStorage.setItem(TMDB_KEY, tmdbKey);
    } else {
      localStorage.removeItem(TMDB_KEY);
    }
  }, [tmdbKey]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#141414] border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">TMDB API Key</h3>
            <p className="text-xs text-gray-500">Override the bundled API key for TMDB requests.</p>
            <input
              type="text"
              value={tmdbKey}
              onChange={(e) => setTmdbKey(e.target.value)}
              placeholder="Enter your TMDB API key..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors"
            />
            {tmdbKey && (
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
                <Check className="w-3.5 h-3.5" />
                <span>Custom key active</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Theme</h3>
            <div className="flex gap-2">
              {[
                { value: 'dark', label: 'Dark', activeClass: 'bg-red-600 text-white border-red-500' },
                { value: 'light', label: 'Light', activeClass: 'bg-zinc-700 text-white border-zinc-500' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                    theme === option.value
                      ? option.activeClass
                      : 'bg-zinc-900 text-gray-300 border-zinc-700 hover:bg-zinc-800'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800">
            <p className="text-[10px] text-gray-600 text-center">
              Pansilu Stream v1.0.0 — Built with Tauri + React
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
