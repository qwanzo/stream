import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Film, Tv, Sparkles, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getTrendingMovies,
  getTopRatedMovies,
  getTrendingTv,
  getTrendingAnimation,
  getAnimeSeries,
  getImageUrl
} from '../services/tmdb';
import { getMediaWatchUrl } from '../utils/slug';

export default function CategoryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  let categoryTitle = 'Trending This Week';
  let categoryIcon = Sparkles;

  if (path === '/movies') {
    categoryTitle = 'Movies';
    categoryIcon = Film;
  } else if (path === '/tv') {
    categoryTitle = 'TV Series';
    categoryIcon = Tv;
  } else if (path === '/animation') {
    categoryTitle = 'Trending Animation';
    categoryIcon = Sparkles;
  }

  const { apiKey, setSelectedMediaModal } = useApp();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadCategory() {
      setLoading(true);
      let data = [];
      if (path === '/movies') {
        const [trending, topRated] = await Promise.all([
          getTrendingMovies(apiKey),
          getTopRatedMovies(apiKey)
        ]);
        data = [...(trending || []), ...(topRated || [])];
      } else if (path === '/tv') {
        data = await getTrendingTv(apiKey);
      } else if (path === '/animation') {
        data = await getTrendingAnimation(apiKey);
      } else {
        // /animation or default
        data = await getTrendingAnimation(apiKey);
      }

      if (isMounted) {
        // Deduplicate by id+media_type
        const seen = new Set();
        const unique = data.filter(item => {
          const key = `${item.id}-${item.media_type || 'movie'}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setItems(unique);
        setLoading(false);
      }
    }
    loadCategory();
    return () => { isMounted = false; };
  }, [path, apiKey]);

  const IconComponent = categoryIcon;

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center space-x-3 border-b border-zinc-800 pb-4">
        <div className="p-2.5 bg-red-600/10 text-red-500 rounded-xl border border-red-500/20">
          <IconComponent className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{categoryTitle}</h1>
          <p className="text-xs text-gray-400 mt-0.5">Explore popular titles in this category</p>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 pt-2">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-zinc-900 rounded-xl animate-pulse border border-zinc-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 pt-2">
          {items.map(item => {
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
                  loading="lazy"
                />

                {item.vote_average > 0 && (
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[11px] font-bold text-yellow-400 flex items-center space-x-1 border border-yellow-500/30">
                    <Star className="w-3 h-3 fill-current text-yellow-400" />
                    <span>{item.vote_average.toFixed(1)}</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-end">
                  <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-red-500 transition-colors">
                    {title}
                  </h4>
                  <p className="text-[11px] text-gray-300 line-clamp-2 mt-1 font-normal">
                    {item.overview || 'Click to view details and stream now.'}
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
