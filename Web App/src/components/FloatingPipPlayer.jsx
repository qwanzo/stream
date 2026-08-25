import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Maximize2, Minimize2, Move, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getRiveEmbedUrl, UNSANDBOXED_SERVERS } from '../services/rivestream';
import { getMediaWatchUrl } from '../utils/slug';

export default function FloatingPipPlayer() {
  const { activePipMedia, setActivePipMedia, selectedServer } = useApp();
  const [isMinimized, setIsMinimized] = useState(false);
  const navigate = useNavigate();

  if (!activePipMedia) return null;

  const { media, season = 1, episode = 1 } = activePipMedia;
  const isTv = (media?.media_type || (media?.first_air_date ? 'tv' : 'movie')) === 'tv';
  const title = media?.title || media?.name || 'Floating Stream';

  const embedUrl = getRiveEmbedUrl({
    type: isTv ? 'tv' : 'movie',
    id: media.id,
    season,
    episode,
    server: selectedServer
  });

  const handleExpand = () => {
    setActivePipMedia(null);
    navigate(getMediaWatchUrl(media, season, episode));
  };

  return (
    <div 
      className={`fixed bottom-16 sm:bottom-6 right-4 z-40 transition-all duration-300 shadow-2xl bg-[#141414] border border-zinc-800 rounded-2xl overflow-hidden ${
        isMinimized ? 'w-64 h-14' : 'w-72 sm:w-80 h-48 sm:h-52'
      }`}
    >
      {/* Header Bar */}
      <div className="bg-[#181818] border-b border-zinc-800 px-3 py-1.5 flex items-center justify-between text-xs text-white">
        <div className="flex items-center space-x-1.5 min-w-0">
          <Sparkles className="w-3.5 h-3.5 text-red-500 flex-shrink-0 animate-pulse" />
          <span className="font-bold truncate text-[11px]">{title}</span>
        </div>

        <div className="flex items-center space-x-1 flex-shrink-0">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 text-gray-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
            title={isMinimized ? "Expand Mini Player" : "Minimize Mini Player"}
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleExpand}
            className="p-1 text-gray-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
            title="Open Fullscreen Watch Page"
          >
            <Move className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setActivePipMedia(null)}
            className="p-1 text-gray-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
            title="Close Picture-in-Picture"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Video Content */}
      {!isMinimized && (
        <div className="w-full h-[calc(100%-28px)] bg-black">
          <iframe
            src={embedUrl}
            title={title}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            {...(!UNSANDBOXED_SERVERS.has(selectedServer) && { sandbox: 'allow-scripts allow-same-origin allow-forms allow-presentation' })}
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      )}
    </div>
  );
}
