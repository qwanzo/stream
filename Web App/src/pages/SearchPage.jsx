import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Film, Tv, Star, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { searchMulti, getImageUrl } from '../services/tmdb';
import { getMediaWatchUrl } from '../utils/slug';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { apiKey, setSelectedMediaModal } = useApp();
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'movie' | 'tv'

  useEffect(() => {
    let isMounted = true;
    async function doSearch() {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      const data = await searchMulti(query, apiKey);
      if (isMounted) {
        setResults(data || []);
        setLoading(false);
      }
    }
    doSearch();
    return () => { isMounted = false; };
  }, [query, apiKey]);

  const filteredResults = results.filter(item => {
    if (filter === 'all') return true;
    const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
    return mediaType === filter;
  });

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Search Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Search Results for <span className="text-[#E50914]">"{query}"</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Found {filteredResults.length} matching titles
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex space-x-2 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'movie', label: 'Movies' },
            { id: 'tv', label: 'TV Shows' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f.id
                  ? 'bg-[#E50914] text-white shadow'
                  : 'text-gray-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="py-20 flex flex-col items-center justify-center space-y-3 text-gray-400">
          <RefreshCw className="w-8 h-8 animate-spin text-red-600" />
          <p className="text-sm font-medium">Searching Database...</p>
        </div>
      )}

      {/* Empty Results State */}
      {!loading && filteredResults.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <div className="p-4 bg-zinc-900 inline-block rounded-full border border-zinc-800 text-gray-500">
            <Search className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-gray-300">No titles found for "{query}"</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try checking for spelling errors, searching for alternative titles, or searching by keyword.
          </p>
        </div>
      )}

      {/* Grid Results */}
      {!loading && filteredResults.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 pt-2">
          {filteredResults.map(item => {
            const title = item.title || item.name;
            const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');

            return (
              <div
                key={`${item.id}-${mediaType}`}
                onClick={() => navigate(getMediaWatchUrl(item))}
                className="relative aspect-[2/3] bg-[#181818] rounded-xl overflow-hidden border border-zinc-800/80 hover:border-red-600/60 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg group"
              >
                <img
                  src={getImageUrl(item.poster_path, 'poster')}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Rating Badge */}
                {item.vote_average > 0 && (
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[11px] font-bold text-yellow-400 flex items-center space-x-1 border border-yellow-500/30">
                    <Star className="w-3 h-3 fill-current text-yellow-400" />
                    <span>{item.vote_average.toFixed(1)}</span>
                  </div>
                )}

                {/* Media Type Badge */}
                <div className="absolute top-2 left-2 bg-[#E50914] text-white px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider shadow">
                  {mediaType === 'tv' ? 'TV' : 'MOVIE'}
                </div>

                {/* Overlay on Hover */}
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
