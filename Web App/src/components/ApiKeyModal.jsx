import React, { useState } from 'react';
import { X, Key, CheckCircle, AlertCircle, Sparkles, Palette } from 'lucide-react';
import { useApp, ACCENT_THEMES } from '../context/AppContext';

export default function ApiKeyModal() {
  const { apiKey, setApiKey, isApiKeyModalOpen, setIsApiKeyModalOpen, themeAccent, setThemeAccent } = useApp();
  const [inputKey, setInputKey] = useState(apiKey);
  const [status, setStatus] = useState(null);

  if (!isApiKeyModalOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!inputKey.trim()) {
      setApiKey('');
      setStatus(null);
      setIsApiKeyModalOpen(false);
      return;
    }

    setStatus('testing');
    try {
      const res = await fetch(`https://api.themoviedb.org/3/authentication?api_key=${inputKey.trim()}`);
      const data = await res.json();
      if (data.success) {
        setApiKey(inputKey.trim());
        setStatus('success');
        setTimeout(() => {
          setIsApiKeyModalOpen(false);
          setStatus(null);
        }, 1000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const handleClear = () => {
    setInputKey('');
    setApiKey('');
    setStatus(null);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-[#181818] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-white p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg border border-yellow-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">App Settings & API Key</h3>
              <p className="text-xs text-gray-400">Configure TMDB API key & theme preferences</p>
            </div>
          </div>

          <button
            onClick={() => setIsApiKeyModalOpen(false)}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* UI Accent Selector */}
        <div className="space-y-2 border-b border-zinc-800 pb-4">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-1.5">
            <Palette className="w-3.5 h-3.5 text-red-500" />
            <span>UI Accent Theme Color</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(ACCENT_THEMES).map(([key, t]) => (
              <button
                key={key}
                type="button"
                onClick={() => setThemeAccent(key)}
                className={`p-2 rounded-xl border text-left flex items-center justify-between transition-colors ${
                  themeAccent === key
                    ? 'bg-zinc-800 border-red-500 text-white shadow'
                    : 'bg-zinc-900 border-zinc-800 text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className={`w-3.5 h-3.5 rounded-full ${t.bgClass}`} />
                  <span className="text-xs font-bold">{t.name}</span>
                </div>
                {themeAccent === key && <CheckCircle className="w-3.5 h-3.5 text-red-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              TMDB API Key (v3)
            </label>
            <input
              type="text"
              placeholder="Paste your 32-character TMDB API Key..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 focus:border-red-600 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none placeholder-gray-500 transition-colors"
            />
          </div>

          {/* Error / Success Feedback */}
          {status === 'error' && (
            <div className="flex items-center space-x-2 text-red-400 text-xs bg-red-950/50 p-2.5 rounded-lg border border-red-900">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Invalid API Key. Please verify your TMDB key.</span>
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center space-x-2 text-emerald-400 text-xs bg-emerald-950/50 p-2.5 rounded-lg border border-emerald-900">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>API Key validated & saved!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              type="submit"
              disabled={status === 'testing'}
              className="flex-1 bg-[#E50914] hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md hover:scale-[1.02] disabled:opacity-50"
            >
              {status === 'testing' ? 'Testing Key...' : 'Save Preferences'}
            </button>
            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        <p className="text-[11px] text-gray-500 text-center leading-relaxed">
          Need a TMDB API Key? Register for a free developer account at <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer" className="text-red-400 hover:underline">themoviedb.org</a>.
        </p>

      </div>
    </div>
  );
}
