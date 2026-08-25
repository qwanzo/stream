/**
 * TMDB (The Movie Database) API Service
 * Supports live API requests when TMDB API Key is configured, 
 * with comprehensive high-quality fallback data for animated movies and shows.
 */

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const IMAGE_SIZES = {
  backdrop: `${IMAGE_BASE_URL}/w1280`,
  backdropOriginal: `${IMAGE_BASE_URL}/original`,
  poster: `${IMAGE_BASE_URL}/w500`,
  posterSmall: `${IMAGE_BASE_URL}/w342`,
  logo: `${IMAGE_BASE_URL}/w500`
};

export function getImageUrl(path, size = 'poster') {
  if (!path) return 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1000&auto=format&fit=crop';
  if (path.startsWith('http')) return path;
  return `${IMAGE_SIZES[size] || IMAGE_SIZES.poster}${path}`;
}

// Curated high-quality animated blockbusters for out-of-the-box experience
export const FALLBACK_MOVIES = [
  {
    id: 569094,
    title: "Spider-Man: Across the Spider-Verse",
    name: "Spider-Man: Across the Spider-Verse",
    media_type: "movie",
    overview: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.",
    poster_path: "/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    backdrop_path: "/4Hj2e6Sj935v0KlygWp1T6e52C9.jpg",
    vote_average: 8.4,
    release_date: "2023-05-31",
    genre_ids: [16, 28, 12, 878],
    is_hero: true,
    tagline: "With great power comes great responsibility."
  },
  {
    id: 1022789,
    title: "Inside Out 2",
    name: "Inside Out 2",
    media_type: "movie",
    overview: "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust aren't sure how to feel when Anxiety shows up.",
    poster_path: "/vpnVM9B6NMmQp9VZaWPaOPG2y5x.jpg",
    backdrop_path: "/p5WZCQeHZmY8rV2RGI0weF3xR3X.jpg",
    vote_average: 7.6,
    release_date: "2024-06-11",
    genre_ids: [16, 10751, 35, 12]
  },
  {
    id: 1241982,
    title: "Moana 2",
    name: "Moana 2",
    media_type: "movie",
    overview: "After receiving an unexpected call from her wayfinding ancestors, Moana journeys to the far seas of Oceania and into dangerous, long-lost waters for an adventure unlike anything she has ever faced.",
    poster_path: "/aKP2v0VjR48Z03X0L2k7c7Yy37z.jpg",
    backdrop_path: "/zo8WCoP2N8Pfr917a1gKwPjdmPj.jpg",
    vote_average: 7.0,
    release_date: "2024-11-27",
    genre_ids: [16, 10751, 12, 14, 10402]
  },
  {
    id: 508883,
    title: "The Boy and the Heron",
    name: "The Boy and the Heron",
    media_type: "movie",
    overview: "While the Second World War rages, young Mahito, haunted by his mother's tragic death, is relocated to his family's estate in the countryside. There, a series of mysterious events leads him to a secluded tower, home to a talking grey heron.",
    poster_path: "/r7DEXlpG3gA3o5u6i3o08yZ.jpg",
    backdrop_path: "/75nSbSt6HsdmXPvZtODKVer2yO1.jpg",
    vote_average: 7.4,
    release_date: "2023-07-14",
    genre_ids: [16, 14, 12]
  },
  {
    id: 1011985,
    title: "Kung Fu Panda 4",
    name: "Kung Fu Panda 4",
    media_type: "movie",
    overview: "Po is gearing up to become the spiritual leader of his Valley of Peace, but also needs someone to take his place as Dragon Warrior. As such, he will train a new kung fu practitioner for the spot and will encounter a villain called the Chameleon.",
    poster_path: "/kDp1vUBnMpeYrAKbLVPmSt1mTR1.jpg",
    backdrop_path: "/1XwY11gW45wEw3Fk.jpg",
    vote_average: 7.1,
    release_date: "2024-03-02",
    genre_ids: [16, 10751, 28, 35, 14]
  },
  {
    id: 447365,
    title: "Spider-Man: Into the Spider-Verse",
    name: "Spider-Man: Into the Spider-Verse",
    media_type: "movie",
    overview: "Teen Miles Morales becomes the Spider-Man of his universe, and must join with five spider-powered individuals from other dimensions to stop a threat for all realities.",
    poster_path: "/iiEv2n1r46Yy5G2y2v4z9l8m6d5.jpg",
    backdrop_path: "/7d6EY00g1c59v9fv3.jpg",
    vote_average: 8.4,
    release_date: "2018-12-06",
    genre_ids: [16, 28, 12, 878]
  },
  {
    id: 808,
    title: "Shrek",
    name: "Shrek",
    media_type: "movie",
    overview: "It ain't easy bein' green -- especially if you're a likable ogre named Shrek. On a mission to retrieve a gorgeous princess from the clutches of a fire-breathing dragon, Shrek teams up with a wisecracking donkey.",
    poster_path: "/iB64vpL3dIObOtMZgX3RqdVdAhd.jpg",
    backdrop_path: "/6d5Xv8m69g1A2r.jpg",
    vote_average: 7.7,
    release_date: "2001-05-18",
    genre_ids: [16, 35, 14, 10751, 12]
  },
  {
    id: 862,
    title: "Toy Story",
    name: "Toy Story",
    media_type: "movie",
    overview: "Led by Woody, Andy's toys live happily in his room until Andy's birthday brings Buzz Lightyear onto the scene. Afraid of losing his place in Andy's heart, Woody plots against Buzz.",
    poster_path: "/uXDfjJ2P1GoWnKDEdWyYyPeStm5.jpg",
    backdrop_path: "/lxD5U2p692.jpg",
    vote_average: 8.0,
    release_date: "1995-10-30",
    genre_ids: [16, 35, 10751]
  },
  {
    id: 109445,
    title: "Frozen",
    name: "Frozen",
    media_type: "movie",
    overview: "Young princess Anna sets off on a journey alongside ice harvester Kristoff and his loyal reindeer Sven to find her sister Elsa, whose icy powers have trapped their kingdom in eternal winter.",
    poster_path: "/kgwjIb2FRRjL2yQg38hF26mKx6y.jpg",
    backdrop_path: "/bF2.jpg",
    vote_average: 7.3,
    release_date: "2013-11-20",
    genre_ids: [16, 10751, 12, 14]
  },
  {
    id: 9502,
    title: "Kung Fu Panda",
    name: "Kung Fu Panda",
    media_type: "movie",
    overview: "When the Valley of Peace is threatened, lazy Po the panda discovers his destiny as the chosen Dragon Warrior and trains to become a kung fu master alongside the Furious Five.",
    poster_path: "/wWtN2LWw2u2u.jpg",
    backdrop_path: "/wWtN2LWw.jpg",
    vote_average: 7.3,
    release_date: "2008-06-04",
    genre_ids: [16, 28, 10751, 35]
  }
];

export const FALLBACK_SERIES = [
  {
    id: 94605,
    title: "Arcane",
    name: "Arcane",
    media_type: "tv",
    overview: "Amid the stark discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war between magic technologies and incompatible convictions.",
    poster_path: "/fqldf2t4WPrBDwzP8vwoveRXIYi.jpg",
    backdrop_path: "/mE0nZg.jpg",
    vote_average: 8.7,
    first_air_date: "2021-11-06",
    genre_ids: [16, 10765, 28, 18],
    number_of_seasons: 2,
    episodes_per_season: 9
  },
  {
    id: 85937,
    title: "Demon Slayer: Kimetsu no Yaiba",
    name: "Demon Slayer: Kimetsu no Yaiba",
    media_type: "tv",
    overview: "It is the Taisho Period in Japan. Tanjiro, a kindhearted boy who sells charcoal for a living, finds his family slaughtered by a demon. To make matters worse, his younger sister Nezuko, the sole survivor, has been transformed into a demon herself.",
    poster_path: "/xUfVStWhxERW8yWF9YgKGv.jpg",
    backdrop_path: "/nTv.jpg",
    vote_average: 8.6,
    first_air_date: "2019-04-06",
    genre_ids: [16, 10759, 10765],
    number_of_seasons: 4,
    episodes_per_season: 26
  },
  {
    id: 1429,
    title: "Attack on Titan",
    name: "Attack on Titan",
    media_type: "tv",
    overview: "After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.",
    poster_path: "/hTDu.jpg",
    backdrop_path: "/aT.jpg",
    vote_average: 8.7,
    first_air_date: "2013-04-07",
    genre_ids: [16, 10759, 10765, 18],
    number_of_seasons: 4,
    episodes_per_season: 25
  },
  {
    id: 387,
    title: "SpongeBob SquarePants",
    name: "SpongeBob SquarePants",
    media_type: "tv",
    overview: "Deep down in the Pacific Ocean in the subterranean city of Bikini Bottom lives a square yellow sponge named SpongeBob SquarePants.",
    poster_path: "/387.jpg",
    backdrop_path: "/sb.jpg",
    vote_average: 7.6,
    first_air_date: "1999-05-01",
    genre_ids: [16, 35, 10751, 10765],
    number_of_seasons: 14,
    episodes_per_season: 20
  },
  {
    id: 60625,
    title: "Rick and Morty",
    name: "Rick and Morty",
    media_type: "tv",
    overview: "Rick is a mentally-unbalanced but scientifically gifted old man who has recently reconnected with his family. He spends most of his time involving his young grandson Morty in dangerous, outlandish adventures across the cosmos.",
    poster_path: "/gd.jpg",
    backdrop_path: "/rm.jpg",
    vote_average: 8.7,
    first_air_date: "2013-12-02",
    genre_ids: [16, 35, 10765, 10759],
    number_of_seasons: 7,
    episodes_per_season: 10
  }
];

export const GENRE_MAP = {
  16: 'Animation',
  28: 'Action',
  12: 'Adventure',
  35: 'Comedy',
  18: 'Drama',
  14: 'Fantasy',
  10751: 'Family',
  878: 'Sci-Fi',
  10765: 'Sci-Fi & Fantasy',
  10759: 'Action & Adventure'
};

async function fetchFromTmdb(endpoint, apiKey, params = {}) {
  if (!apiKey) return null;
  const searchParams = new URLSearchParams({
    api_key: apiKey,
    ...params
  });
  
  try {
    const res = await fetch(`${TMDB_BASE_URL}${endpoint}?${searchParams.toString()}`);
    if (!res.ok) throw new Error(`TMDB error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('TMDB Fetch Error:', err);
    return null;
  }
}

export async function getTrendingMovies(apiKey) {
  if (apiKey) {
    const data = await fetchFromTmdb('/trending/movie/week', apiKey, {});
    if (data?.results?.length) {
      return data.results.map(item => ({ ...item, media_type: 'movie' }));
    }
  }
  return FALLBACK_MOVIES;
}

export async function getTopRatedMovies(apiKey) {
  if (apiKey) {
    const data = await fetchFromTmdb('/movie/top_rated', apiKey, {});
    if (data?.results?.length) {
      return data.results.map(item => ({ ...item, media_type: 'movie' }));
    }
  }
  return [...FALLBACK_MOVIES].sort((a, b) => b.vote_average - a.vote_average);
}

export async function getTrendingTv(apiKey) {
  if (apiKey) {
    const data = await fetchFromTmdb('/trending/tv/week', apiKey, {});
    if (data?.results?.length) {
      return data.results.map(item => ({ ...item, media_type: 'tv' }));
    }
  }
  return FALLBACK_SERIES;
}

export async function getPopularMovies(apiKey) {
  if (apiKey) {
    const data = await fetchFromTmdb('/movie/popular', apiKey, {});
    if (data?.results?.length) {
      return data.results.map(item => ({ ...item, media_type: 'movie' }));
    }
  }
  return FALLBACK_MOVIES;
}

export async function getHorrorMovies(apiKey) {
  if (apiKey) {
    const data = await fetchFromTmdb('/discover/movie', apiKey, {
      with_genres: '27',
      sort_by: 'popularity.desc',
      include_adult: 'false'
    });
    if (data?.results?.length) {
      return data.results.map(item => ({ ...item, media_type: 'movie' }));
    }
  }
  // Fallback horror subset from FALLBACK_MOVIES (none are horror, so return empty)
  return [];
}

export async function getFamilyMovies(apiKey) {
  if (apiKey) {
    const data = await fetchFromTmdb('/discover/movie', apiKey, {
      with_genres: '10751',
      sort_by: 'popularity.desc',
      include_adult: 'false'
    });
    if (data?.results?.length) {
      return data.results.map(item => ({ ...item, media_type: 'movie' }));
    }
  }
  return FALLBACK_MOVIES.filter(m => m.genre_ids.includes(10751));
}

// Keep these for category pages
export async function getTrendingAnimation(apiKey) {
  if (apiKey) {
    const data = await fetchFromTmdb('/discover/movie', apiKey, {
      with_genres: '16',
      sort_by: 'popularity.desc',
      include_adult: 'false'
    });
    if (data?.results?.length) {
      return data.results.map(item => ({ ...item, media_type: 'movie' }));
    }
  }
  return FALLBACK_MOVIES;
}

export async function getAnimeSeries(apiKey) {
  if (apiKey) {
    const data = await fetchFromTmdb('/discover/tv', apiKey, {
      with_genres: '16',
      sort_by: 'popularity.desc',
      with_original_language: 'ja'
    });
    if (data?.results?.length) {
      return data.results.map(item => ({ ...item, media_type: 'tv' }));
    }
  }
  return FALLBACK_SERIES;
}

export async function searchMulti(query, apiKey) {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();

  if (apiKey) {
    const data = await fetchFromTmdb('/search/multi', apiKey, { query: q });
    if (data?.results?.length) {
      return data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
    }
  }

  // Fallback search across local database
  const allItems = [...FALLBACK_MOVIES, ...FALLBACK_SERIES];
  return allItems.filter(item => 
    (item.title && item.title.toLowerCase().includes(q)) || 
    (item.name && item.name.toLowerCase().includes(q)) ||
    (item.overview && item.overview.toLowerCase().includes(q))
  );
}

export function getTvSeasons(media) {
  return media?.seasons
    ?.filter(season => season.season_number > 0)
    .map(season => ({
      number: season.season_number,
      episodeCount: season.episodes?.length || season.episode_count || 0
    })) || [];
}

export async function getMediaDetails(id, type = 'movie', apiKey) {
  const isTv = type === 'tv';
  if (apiKey) {
    const data = await fetchFromTmdb(`/${isTv ? 'tv' : 'movie'}/${id}`, apiKey, {
      append_to_response: 'credits,videos,recommendations,release_dates,content_ratings'
    });
    if (data) {
      if (isTv && data.seasons?.length) {
        const seasons = await Promise.all(
          data.seasons
            .filter(season => season.season_number > 0)
            .map(async (season) => {
              const seasonDetails = await fetchFromTmdb(`/tv/${id}/season/${season.season_number}`, apiKey);
              return seasonDetails || season;
            })
        );
        return { ...data, seasons, media_type: 'tv' };
      }
      return { ...data, media_type: isTv ? 'tv' : 'movie' };
    }
  }

  const list = isTv ? FALLBACK_SERIES : FALLBACK_MOVIES;
  const match = list.find(item => String(item.id) === String(id));
  if (match) return match;

  // Generic fallback object if unknown ID
  return {
    id,
    title: isTv ? `TV Show #${id}` : `Movie #${id}`,
    name: isTv ? `TV Show #${id}` : `Movie #${id}`,
    media_type: isTv ? 'tv' : 'movie',
    overview: 'Stream high quality movies and TV episodes directly powered by RiveStream engine.',
    poster_path: null,
    backdrop_path: null,
    vote_average: 8.0,
    number_of_seasons: isTv ? 3 : undefined
  };
}

