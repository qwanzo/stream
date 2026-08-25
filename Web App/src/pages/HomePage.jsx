import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import MovieRow from '../components/MovieRow';
import { useApp } from '../context/AppContext';
import {
  getTrendingAnimation,
  getHorrorMovies,
  getFamilyMovies
} from '../services/tmdb';

export default function HomePage() {
  const { apiKey, continueWatching, watchlist } = useApp();

  const [heroItem, setHeroItem] = useState(null);
  const [animationMovies, setAnimationMovies] = useState([]);
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [familyMovies, setFamilyMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [animation, horror, family] = await Promise.all([
          getTrendingAnimation(apiKey),
          getHorrorMovies(apiKey),
          getFamilyMovies(apiKey)
        ]);

        if (isMounted) {
          setAnimationMovies(animation || []);
          setHorrorMovies(horror || []);
          setFamilyMovies(family || []);

          // Hero picks from animation trending (random from top 5)
          if (animation && animation.length > 0) {
            const heroIndex = Math.floor(Math.random() * Math.min(5, animation.length));
            setHeroItem(animation[heroIndex]);
          }
        }
      } catch (err) {
        console.error('Failed to load home page content', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [apiKey]);

  return (
    <div className="min-h-screen bg-[#141414] pb-16">
      {/* Hero Banner */}
      {heroItem && <HeroBanner item={heroItem} />}

      {/* Rows Section */}
      <div className="space-y-6 sm:space-y-8 mt-4 sm:-mt-20 relative z-20">

        {/* Continue Watching Row */}
        {continueWatching.length > 0 && (
          <MovieRow
            title="▶ Continue Watching"
            items={continueWatching}
            isContinueWatching={true}
          />
        )}

        {/* My List Row */}
        {watchlist.length > 0 && (
          <MovieRow
            title="➕ My List"
            items={watchlist}
          />
        )}

        {/* Trending Animated Movies */}
        <MovieRow
          title="🎨 Trending Animated Movies"
          items={animationMovies}
        />

        {/* Horror Movies */}
        {horrorMovies.length > 0 && (
          <MovieRow
            title="👻 Popular Horror Movies"
            items={horrorMovies}
          />
        )}

        {/* Family Movies */}
        {familyMovies.length > 0 && (
          <MovieRow
            title="🍿 Family Movies"
            items={familyMovies}
          />
        )}

      </div>
    </div>
  );
}
