import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, Plus, Check, Star, Sparkles } from 'lucide-react';
import { getImageUrl, GENRE_MAP } from '../services/tmdb';
import { useApp } from '../context/AppContext';
import { getMediaWatchUrl } from '../utils/slug';

export default function HeroBanner({ item }) {
  const navigate = useNavigate();
  const { setSelectedMediaModal, isInWatchlist, toggleWatchlist } = useApp();

  if (!item) return null;

  const title = item.title || item.name;
  const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
  const year = (item.release_date || item.first_air_date || '').substring(0, 4);
  const inWatchlist = isInWatchlist(item.id, mediaType);

  const handlePlay = () => navigate(getMediaWatchUrl(item));

  return (
    <div className="relative w-full h-[55vh] sm:h-[75vh] lg:h-[88vh] text-white overflow-hidden bg-black">

      {/* Background Backdrop */}
      <div className="absolute inset-0">
        <img
          src={getImageUrl(item.backdrop_path, 'backdropOriginal')}
          alt={title}
          className="w-full h-full object-cover object-top sm:object-center scale-105 brightness-75 sm:brightness-90"
        />
        {/* Mobile: dark bottom gradient so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/60 to-black/20 sm:from-[#141414] sm:via-black/40 sm:to-transparent" />
        {/* Desktop: left vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent hidden sm:block" />
      </div>

      {/* Content — sits at the bottom on mobile, vertically centred on desktop */}
      <div className="relative h-full flex items-end sm:items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full sm:max-w-2xl pb-6 sm:pb-0 sm:pt-20 space-y-3 sm:space-y-5">

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-300">
            <span className="flex items-center gap-1 bg-[#E50914] text-white px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow">
              <Sparkles className="w-3 h-3" />
              <span>Trending</span>
            </span>
            {year && (
              <span className="bg-black/60 px-2 py-0.5 rounded border border-gray-700 text-[10px] sm:text-xs">{year}</span>
            )}
            {item.vote_average > 0 && (
              <span className="flex items-center gap-1 text-yellow-400 font-bold bg-black/60 px-2 py-0.5 rounded border border-gray-700 text-[10px] sm:text-xs">
                <Star className="w-3 h-3 fill-current" />
                {item.vote_average.toFixed(1)}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight drop-shadow-2xl leading-none">
            {title}
          </h1>

          {/* Overview — fewer lines on mobile */}
          <p className="text-xs sm:text-base text-gray-200 line-clamp-2 sm:line-clamp-3 drop-shadow max-w-xl leading-relaxed">
            {item.overview}
          </p>

          {/* Genres — hide on very small screens */}
          {item.genre_ids && (
            <div className="hidden xs:flex flex-wrap gap-1.5">
              {item.genre_ids.slice(0, 3).map(id => (
                <span key={id} className="text-[10px] sm:text-xs text-gray-300 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                  {GENRE_MAP[id] || 'Movie'}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 pt-1">
            <button
              onClick={handlePlay}
              className="flex items-center justify-center gap-1.5 bg-white text-black hover:bg-white/90 px-4 sm:px-7 py-2 sm:py-2.5 rounded font-bold text-sm sm:text-base shadow-xl transition-all hover:scale-105 active:scale-95 flex-shrink-0"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-black" />
              <span>Play</span>
            </button>

            <button
              onClick={() => setSelectedMediaModal(item)}
              className="flex items-center justify-center gap-1.5 bg-gray-600/70 hover:bg-gray-600/90 text-white backdrop-blur px-4 sm:px-5 py-2 sm:py-2.5 rounded font-semibold text-sm sm:text-base shadow-xl transition-all hover:scale-105 active:scale-95 border border-white/10 flex-shrink-0"
            >
              <Info className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">More Info</span>
            </button>

            <button
              onClick={() => toggleWatchlist(item)}
              className={`p-2 sm:p-2.5 rounded-full border transition-all hover:scale-110 flex-shrink-0 ${
                inWatchlist
                  ? 'bg-[#E50914] text-white border-red-600 shadow-lg shadow-red-900/50'
                  : 'bg-black/60 text-gray-300 border-gray-500 hover:text-white hover:border-white'
              }`}
              title={inWatchlist ? 'Remove from My List' : 'Add to My List'}
            >
              {inWatchlist ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
