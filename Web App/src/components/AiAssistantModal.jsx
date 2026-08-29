import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, Send, Bot, Play, Star, Key, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { askGroqAi } from '../services/groq';
import { slugify } from '../utils/slug';

export default function AiAssistantModal() {
  const { isAiModalOpen, setIsAiModalOpen, groqApiKey, setGroqApiKey } = useApp();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyInput, setKeyInput] = useState(groqApiKey);

  if (!isAiModalOpen) return null;

  const handleSearch = async (queryToSearch) => {
    const q = queryToSearch || prompt;
    if (!q || !q.trim()) return;

    setLoading(true);
    const results = await askGroqAi(q, groqApiKey);
    setRecommendations(results);
    setLoading(false);
  };

  const handleQuickMood = (moodText) => {
    setPrompt(moodText);
    handleSearch(moodText);
  };

  const handleSaveGroqKey = (e) => {
    e.preventDefault();
    setGroqApiKey(keyInput.trim());
    setShowKeyInput(false);
  };

  const quickMoods = [
    "🔥 Mind-bending animated blockbusters",
    "⛩️ Epic anime series with intense battles",
    "🍿 Feel-good family comedy animation",
    "🚀 Dark cyberpunk & futuristic sci-fi"
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-[#181818] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-900">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#E50914] text-white rounded-xl shadow-lg shadow-red-900/50">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
                <span>CineVault AI Assistant</span>
                <span className="bg-red-600/30 text-red-400 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border border-red-500/40">
                  Groq oss-120b
                </span>
              </h3>
              <p className="text-xs text-gray-400">Ask for movie & anime recommendations in natural language</p>
            </div>
          </div>

          <button
            onClick={() => setIsAiModalOpen(false)}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5 custom-scrollbar flex-grow">
          
          {/* Quick Mood Chips */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quick Mood Prompts</p>
            <div className="flex flex-wrap gap-2">
              {quickMoods.map((mood, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickMood(mood)}
                  className="text-xs bg-zinc-900 hover:bg-zinc-800 text-gray-300 hover:text-white px-3 py-1.5 rounded-full border border-zinc-700 transition-colors"
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input Box */}
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="relative flex items-center">
            <input
              type="text"
              placeholder="e.g. Recommend 3 movies like Spider-Man Into the Spider-Verse..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 focus:border-red-600 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none placeholder-gray-500 shadow-inner"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="absolute right-2 bg-[#E50914] hover:bg-red-700 text-white p-2 rounded-lg transition-transform hover:scale-105 disabled:opacity-40"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>

          {/* AI Recommendations Output */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-gray-400">
              <Sparkles className="w-8 h-8 animate-spin text-red-500" />
              <p className="text-sm font-medium">Groq AI is analyzing film catalogs...</p>
            </div>
          )}

          {!loading && recommendations.length > 0 && (
            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">CineVault AI Recommendations</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recommendations.map((rec, idx) => {
                  const mediaType = rec.type || 'movie';
                  const titleSlug = slugify(rec.title || 'title');
                  const year = rec.year || 2024;
                  const watchPath = mediaType === 'tv'
                    ? `/watch/tv/${titleSlug}-${year}-${rec.tmdbId || 569094}`
                    : `/watch/${titleSlug}-${year}-${rec.tmdbId || 569094}`;

                  return (
                    <div
                      key={idx}
                      className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3.5 space-y-2 hover:border-red-600/50 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white line-clamp-1">{rec.title}</h4>
                          <span className="text-[10px] bg-red-950 text-red-400 font-bold px-1.5 py-0.5 rounded border border-red-800/60 uppercase">
                            {rec.year}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                          {rec.recommendationReason}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setIsAiModalOpen(false);
                          navigate(watchPath);
                        }}
                        className="w-full flex items-center justify-center space-x-1.5 bg-[#E50914] hover:bg-red-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-colors shadow"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Stream Now</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer: Groq API Key Config Toggle */}
        <div className="p-4 border-t border-zinc-800 bg-[#141414] text-xs text-gray-400 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Key className="w-3.5 h-3.5 text-yellow-500" />
            <span>Groq Key: <strong>{groqApiKey ? 'Configured' : 'Using Demo AI Model'}</strong></span>
          </div>

          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="text-red-500 hover:text-red-400 font-bold underline"
          >
            {showKeyInput ? 'Close Key Setup' : 'Configure Groq API Key'}
          </button>
        </div>

        {/* Groq Key Drawer */}
        {showKeyInput && (
          <form onSubmit={handleSaveGroqKey} className="p-4 bg-zinc-900 border-t border-zinc-800 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Paste Groq API Key (gsk_...)"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="flex-1 bg-black border border-zinc-700 px-3 py-1.5 rounded-lg text-xs text-white focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#E50914] text-white px-3 py-1.5 rounded-lg font-bold text-xs"
            >
              Save Key
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
