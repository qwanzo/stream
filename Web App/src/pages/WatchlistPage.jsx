import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Trash2, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getImageUrl } from '../services/tmdb';
import { getMediaWatchUrl } from '../utils/slug';

export default function WatchlistPage() {
  const { watchlist, toggleWatchlist } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-red-600/10 text-red-500 rounded-xl border border-red-500/20">
            <Bookmark className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">My List</h1>
            <p className="text-xs text-gray-400 mt-0.5">{watchlist.length} saved titles</p>
          </div>
        </div>
      </div>

      {/* Empty Watchlist State */}
      {watchlist.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <div className="p-4 bg-zinc-900 inline-block rounded-full border border-zinc-800 text-gray-600">
            <Bookmark className="w-12 h-12" />
          </div>
          <h3 className="text-lg font-bold text-gray-300">Your list is empty</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Explore trending movies and TV series, and click the "+" button to save them to your list.
          </p>
        </div>
      )}

      {/* Watchlist Grid */}
      {watchlist.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 pt-2">
          {watchlist.map(item => {
            const title = item.title || item.name;
            const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');

            return (
              <div
                key={`${item.id}-${mediaType}`}
                onClick={() => navigate(getMediaWatchUrl(item))}
                className="relative aspect-[2/3] bg-[#181818] rounded-xl overflow-hidden border border-zinc-800 hover:border-red-600/60 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg group"
              >
                <img
                  src={getImageUrl(item.poster_path, 'poster')}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Rating Badge */}
                {item.vote_average > 0 && (
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[11px] font-bold text-yellow-400 flex items-center space-x-1 border border-yellow-500/30">
                    <Star className="w-3 h-3 fill-current text-yellow-400" />
                    <span>{item.vote_average.toFixed(1)}</span>
                  </div>
                )}

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWatchlist(item);
                  }}
                  className="absolute top-2 left-2 p-1.5 bg-black/80 hover:bg-red-600 text-gray-300 hover:text-white rounded-lg backdrop-blur-md border border-gray-700 transition-colors z-20"
                  title="Remove from My List"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Hover Details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-end">
                  <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-red-500 transition-colors">
                    {title}
                  </h4>
                  <p className="text-[11px] text-gray-300 line-clamp-2 mt-1 font-normal">
                    {item.overview || 'Click to stream now.'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
