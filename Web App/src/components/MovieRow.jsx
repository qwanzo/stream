import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Plus, Check, Info, Star } from 'lucide-react';
import { getImageUrl } from '../services/tmdb';
import { useApp } from '../context/AppContext';
import { getMediaWatchUrl } from '../utils/slug';

export default function MovieRow({ title, items = [], isContinueWatching = false }) {
  const rowRef = useRef(null);
  const navigate = useNavigate();
  const { setSelectedMediaModal, isInWatchlist, toggleWatchlist } = useApp();

  if (!items || items.length === 0) return null;

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const amount = direction === 'left' ? -rowRef.current.clientWidth * 0.75 : rowRef.current.clientWidth * 0.75;
      rowRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative py-3 sm:py-4 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto group/row">
      {/* Row Title */}
      <h2 className="text-base sm:text-xl font-bold text-white tracking-wide mb-2 sm:mb-3 flex items-center gap-2">
        {title}
      </h2>

      <div className="relative">
        {/* Scroll Left — hidden on touch, visible on hover on desktop */}
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-0 bottom-0 z-30 hidden sm:flex items-center justify-center w-10 bg-black/70 hover:bg-black/90 text-white opacity-0 group-hover/row:opacity-100 transition-opacity rounded-r-md backdrop-blur-sm"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Scroll Right */}
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-0 bottom-0 z-30 hidden sm:flex items-center justify-center w-10 bg-black/70 hover:bg-black/90 text-white opacity-0 group-hover/row:opacity-100 transition-opacity rounded-l-md backdrop-blur-sm"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Scrolling Track */}
        <div
          ref={rowRef}
          className="flex items-stretch gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1 scroll-smooth"
        >
          {items.map((item) => {
            const itemTitle = item.title || item.name;
            const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
            const inWatchlist = isInWatchlist(item.id, mediaType);
            const imagePath = isContinueWatching
              ? (item.backdrop_path || item.poster_path)
              : (item.poster_path || item.backdrop_path);

            const handlePlay = (e) => {
              e.stopPropagation();
              navigate(getMediaWatchUrl(item, item.season || 1, item.episode || 1));
            };

            return (
              <div
                key={`${item.id}-${mediaType}`}
                onClick={() => setSelectedMediaModal(item)}
                className={`relative flex-none cursor-pointer rounded-lg overflow-hidden bg-[#181818] border border-zinc-800/80
                  hover:border-red-600/50 hover:shadow-2xl hover:shadow-red-900/20 transition-all duration-300
                  hover:scale-105 hover:z-10 group/card
                  ${isContinueWatching
                    ? 'w-44 sm:w-64 aspect-video'
                    : 'w-28 sm:w-40 md:w-44 aspect-[2/3]'
                  }`}
              >
                {/* Poster */}
                <img
                  src={getImageUrl(imagePath, isContinueWatching ? 'backdrop' : 'poster')}
                  alt={itemTitle}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                  loading="lazy"
                />

                {/* Rating Badge */}
                {item.vote_average > 0 && (
                  <div className="absolute top-1.5 right-1.5 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-yellow-400 flex items-center gap-0.5 border border-yellow-500/30">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    {item.vote_average.toFixed(1)}
                  </div>
                )}

                {/* Type Badge */}
                <div className="absolute top-1.5 left-1.5 bg-[#E50914] text-white px-1 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide shadow">
                  {mediaType === 'tv' ? 'TV' : 'MOVIE'}
                </div>

                {/* Continue Watching Overlay */}
                {isContinueWatching && item.season && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-2">
                    <p className="text-xs font-bold text-white truncate">{itemTitle}</p>
                    <p className="text-[10px] text-gray-300">S{item.season} E{item.episode}</p>
                    <div className="w-full bg-gray-700 h-1 rounded-full mt-1 overflow-hidden">
                      <div className="bg-[#E50914] h-full w-2/3" />
                    </div>
                  </div>
                )}

                {/* Hover Overlay — desktop only */}
                {!isContinueWatching && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 p-2.5 flex flex-col justify-end">
                    <h3 className="text-xs font-bold text-white line-clamp-1 group-hover/card:text-[#E50914] transition-colors">
                      {itemTitle}
                    </h3>
                    <p className="text-[10px] text-gray-300 line-clamp-2 mt-0.5 font-normal hidden sm:block">
                      {item.overview || 'Click to stream.'}
                    </p>

                    <div className="flex items-center gap-1.5 mt-2 pt-1 border-t border-gray-700/60">
                      <button
                        onClick={handlePlay}
                        className="bg-white text-black hover:bg-gray-200 p-1.5 rounded-full transition-transform hover:scale-110"
                        title="Play"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedMediaModal(item); }}
                        className="bg-zinc-800/90 text-white hover:bg-zinc-700 p-1.5 rounded-full border border-gray-600 transition-transform hover:scale-110"
                        title="More Info"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleWatchlist(item); }}
                        className={`p-1.5 rounded-full border transition-transform hover:scale-110 ${
                          inWatchlist ? 'bg-[#E50914] text-white border-red-600' : 'bg-zinc-800/90 text-gray-300 border-gray-600 hover:text-white'
                        }`}
                        title={inWatchlist ? 'Remove' : 'Add to List'}
                      >
                        {inWatchlist ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
