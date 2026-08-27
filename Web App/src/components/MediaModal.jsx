import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Play, Plus, Check, Star, Calendar, Tv, Sparkles, Film, Heart, ShieldCheck, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getImageUrl, getMediaDetails, getTvSeasons, GENRE_MAP } from '../services/tmdb';
import { getMediaWatchUrl } from '../utils/slug';

export default function MediaModal() {
  const { selectedMediaModal, setSelectedMediaModal, isInWatchlist, toggleWatchlist, userRatings, setUserRating, apiKey } = useApp();
  const navigate = useNavigate();
  
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [userScore, setUserScore] = useState(0);
  const [userNote, setUserNote] = useState('');
  const [mediaDetails, setMediaDetails] = useState(null);

  const item = selectedMediaModal;

  useEffect(() => {
    if (!item) return;
    setMediaDetails(null);
    const existing = userRatings[item.id];
    if (existing) {
      setUserScore(existing.rating || 0);
      setUserNote(existing.note || '');
    } else {
      setUserScore(0);
      setUserNote('');
    }

    // Try fetching YouTube trailer key from TMDB if API key present
    async function loadTrailer() {
      if (apiKey && item.id) {
        try {
          const isTv = (item.media_type || (item.first_air_date ? 'tv' : 'movie')) === 'tv';
          const res = await fetch(`https://api.themoviedb.org/3/${isTv ? 'tv' : 'movie'}/${item.id}/videos?api_key=${apiKey}`);
          if (res.ok) {
            const data = await res.json();
            const trailer = data?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
            if (trailer) setTrailerKey(trailer.key);
          }
        } catch {
          setTrailerKey(null);
        }
      }
    }
    loadTrailer();

    getMediaDetails(item.id, item.media_type || (item.first_air_date ? 'tv' : 'movie'), apiKey)
      .then((details) => setMediaDetails(details));
  }, [item, apiKey, userRatings]);

  if (!selectedMediaModal) return null;

  const title = item.title || item.name;
  const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
  const isTv = mediaType === 'tv';
  const information = mediaDetails || item;
  const year = (item.release_date || item.first_air_date || '').substring(0, 4);
  const inWatchlist = isInWatchlist(item.id, mediaType);
  const certification = isTv
    ? information.content_ratings?.results?.find((rating) => rating.iso_3166_1 === 'US')?.rating
    : information.release_dates?.results?.find((release) => release.iso_3166_1 === 'US')?.release_dates?.find((date) => date.certification)?.certification;
  const cast = information.credits?.cast?.slice(0, 8) || [];

  const seasons = isTv ? getTvSeasons(information) : [];
  const selectedSeasonData = seasons.find((season) => season.number === selectedSeason) || seasons[0];
  const numEpisodes = selectedSeasonData?.episodeCount || 0;

  const handlePlay = () => {
    setSelectedMediaModal(null);
    navigate(getMediaWatchUrl(item, selectedSeason, selectedEpisode));
  };

  const handleSaveRating = (stars) => {
    setUserScore(stars);
    setUserRating(item.id, stars, userNote);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm animate-fade-in">
      {/* Modal Box */}
      <div 
        className="relative w-full max-w-4xl bg-[#181818] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-white my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            setShowTrailer(false);
            setSelectedMediaModal(null);
          }}
          className="absolute top-4 right-4 z-20 bg-black/70 hover:bg-black text-gray-300 hover:text-white p-2 rounded-full backdrop-blur-md transition-colors border border-gray-700"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto custom-scrollbar">
          
          {/* Backdrop Header / Trailer Video */}
          <div className="relative h-64 sm:h-96 w-full bg-black">
            {showTrailer ? (
              trailerKey ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0`}
                  title={`${title} Trailer`}
                  className="w-full h-full border-0"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-black/70 text-gray-300">
                  Trailer not available
                </div>
              )
            ) : (
              <>
                <img
                  src={getImageUrl(item.backdrop_path || item.poster_path, 'backdropOriginal')}
                  alt={title}
                  className="w-full h-full object-cover filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/40 to-transparent" />
                
                {/* Title & Floating Play/Trailer Buttons */}
                <div className="absolute bottom-6 left-6 right-6 space-y-3">
                  <span className="bg-[#E50914] text-white px-2.5 py-0.5 rounded text-xs font-black uppercase tracking-wider">
                    {isTv ? 'TV Series' : 'Movie'}
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                    {title}
                  </h2>
                  
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={handlePlay}
                      className="flex items-center space-x-2 bg-white text-black hover:bg-white/90 px-6 py-2.5 rounded-lg font-bold text-sm sm:text-base shadow-lg transition-transform hover:scale-105"
                    >
                      <Play className="w-5 h-5 fill-current text-black" />
                      <span>{isTv ? `Play S${selectedSeason} E${selectedEpisode}` : 'Play Movie'}</span>
                    </button>

                    <button
                      onClick={() => setShowTrailer(!showTrailer)}
                      className="flex items-center space-x-2 bg-zinc-800/90 hover:bg-zinc-700 text-white px-4 py-2.5 rounded-lg font-bold text-sm border border-zinc-700 transition-all hover:scale-105"
                    >
                      <Film className="w-4 h-4 text-red-500" />
                      <span>{showTrailer ? 'Close Trailer' : 'Watch HD Trailer'}</span>
                    </button>

                    <button
                      onClick={() => toggleWatchlist(item)}
                      className={`p-2.5 rounded-lg border transition-all ${
                        inWatchlist 
                          ? 'bg-[#E50914] text-white border-red-600' 
                          : 'bg-zinc-800/80 text-gray-300 border-zinc-700 hover:text-white'
                      }`}
                      title={inWatchlist ? "Remove from List" : "Add to List"}
                    >
                      {inWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Details Body */}
          <div className="p-6 space-y-6">
            
            {/* Meta Stats & Personal Rating */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-300 font-semibold">
                {information.vote_average > 0 && (
                  <div className="flex items-center text-yellow-400 font-bold bg-yellow-400/10 border border-yellow-500/30 px-2.5 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-current mr-1 text-yellow-400" />
                    <span>{information.vote_average.toFixed(1)} TMDB</span>
                  </div>
                )}
                {year && (
                  <div className="flex items-center space-x-1 bg-zinc-800 px-2.5 py-1 rounded-full text-gray-300 border border-zinc-700">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{year}</span>
                  </div>
                )}
                {item.genre_ids && item.genre_ids.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.genre_ids.map(id => (
                      <span key={id} className="bg-zinc-800/90 text-gray-300 px-2.5 py-1 rounded-full text-xs border border-zinc-700">
                        {GENRE_MAP[id] || 'Animation'}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Personal Rating Stars */}
              <div className="flex items-center space-x-1 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800">
                <span className="text-xs text-gray-400 font-bold mr-1">Your Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleSaveRating(star)}
                    className="p-0.5 transition-transform hover:scale-125"
                  >
                    <Star className={`w-4 h-4 ${star <= userScore ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Overview */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-200">Overview</h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
                {item.overview || 'No description available for this content.'}
              </p>
            </div>

            <div className="space-y-4 pt-2 border-t border-zinc-800">
              <h3 className="text-base font-bold text-gray-200 flex items-center gap-2">
                <Users className="w-4 h-4 text-red-500" />
                Movie Information
              </h3>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-300">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-red-500" />{year || 'Release date unavailable'}</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-red-500" />TMDB age rating: {certification || 'Not rated by TMDB'}</span>
                {information.runtime && <span>{information.runtime} min</span>}
              </div>
              {cast.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Top Cast</p>
                  <div className="flex gap-3 overflow-x-auto pt-3 pb-1">
                    {cast.map((person) => (
                      <div key={person.credit_id || person.id} className="w-20 shrink-0">
                        {person.profile_path ? <img src={getImageUrl(person.profile_path, 'posterSmall')} alt={person.name} className="w-20 h-24 object-cover rounded-lg bg-zinc-900" /> : <div className="w-20 h-24 rounded-lg bg-zinc-900 border border-zinc-800" aria-label={`${person.name} photo unavailable`} />}
                        <p className="text-[11px] text-white font-semibold truncate mt-1.5">{person.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{person.character || 'Cast'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* TV Show Episode Guide */}
            {isTv && (
              <div className="space-y-4 pt-2 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-200 flex items-center space-x-2">
                    <Tv className="w-4 h-4 text-red-500" />
                    <span>Select Season & Episode</span>
                  </h3>
                </div>

                {/* Season Tabs */}
                <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
                  {seasons.map(({ number }) => (
                    <button
                      key={number}
                      onClick={() => {
                        setSelectedSeason(number);
                        setSelectedEpisode(1);
                      }}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border ${
                        selectedSeason === number
                          ? 'bg-[#E50914] text-white border-red-600'
                          : 'bg-zinc-800 text-gray-300 border-zinc-700 hover:bg-zinc-700'
                      }`}
                    >
                      Season {number}
                    </button>
                  ))}
                </div>

                {/* Episodes Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 pt-2">
                  {Array.from({ length: numEpisodes }, (_, i) => i + 1).map((ep) => (
                    <button
                      key={ep}
                      onClick={() => {
                        setSelectedEpisode(ep);
                        navigate(getMediaWatchUrl(item, selectedSeason, ep));
                        setSelectedMediaModal(null);
                      }}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        selectedEpisode === ep && selectedSeason === selectedSeason
                          ? 'bg-red-950/60 border-red-500 text-white shadow-lg'
                          : 'bg-zinc-900/80 border-zinc-800 text-gray-300 hover:bg-zinc-800 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center justify-between">
                        <span>Episode {ep}</span>
                        <Play className="w-3 h-3 text-red-500 fill-current" />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 truncate">Play Stream</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stream Engine Info Badge */}
            <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-red-950/30 border border-zinc-800 p-4 rounded-xl flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-red-500" />
                <span>Powered by <strong>streamsilu Engine</strong></span>
              </div>
              <button
                onClick={handlePlay}
                className="text-red-500 hover:text-red-400 font-bold underline"
              >
                Stream Now &rarr;
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
