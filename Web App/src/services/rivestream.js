/**
 * Multi-Provider Streaming & Embed API Integration Service
 * Features Clean Codenamed Streaming Engines (No Brackets):
 * - Aura: streamsilu Server 01 (stream-movies-server-01.streamsilu.cc.cd)
 * - Cdn: CDN Embed (cdn-embed.com)
 * - Pulse: 2Embed (www.2embed.cc)
 * - Nova: VidLink Pro (vidlink.pro)
 * - Most: VidSrc (vidsrcme.ru / vidsrc.me)
 * - Apex: Rive Main (rivestream.app)
 * - Titan: Rive Aggregator (rivestream.app/embed/agg)
 */

export const UNSANDBOXED_SERVERS = new Set(['streamsilu', 'vidsrc', 'vidlink', 'embed2', 'cdn']);

export const PHANTOM_SERVER = {
  id: 'torrent',
  name: 'Phantom',
  fullName: 'Phantom (RiveStream Torrent)',
  badge: 'P2P',
  description: 'RiveStream torrent embed provider'
};

export const RIVE_SERVERS = {
  STREAMSILU: {
    id: 'streamsilu',
    name: 'Aura',
    fullName: 'Aura',
    badge: 'Default / 4K',
    description: 'Primary custom streamsilu server (stream-movies-server-01.streamsilu.cc.cd)',
  },
  CDN: {
    id: 'cdn',
    name: 'Cdn',
    fullName: 'Cdn',
    badge: 'Fast',
    description: 'CDN Embed streaming engine (cdn-embed.com)',
  },
  EMBED2: {
    id: 'embed2',
    name: 'Pulse',
    fullName: 'Pulse',
    badge: 'Multi-Lang',
    description: '2Embed multi-language streaming engine (www.2embed.cc)',
  },
  VIDLINK: {
    id: 'vidlink',
    name: 'Nova',
    fullName: 'Nova',
    badge: 'Pro HD',
    description: 'VidLink Pro high-speed streaming engine (vidlink.pro)',
  },
  VIDSRC: {
    id: 'vidsrc',
    name: 'Most',
    fullName: 'Most',
    badge: 'Fast',
    description: 'VidSrc high-speed streaming engine (vidsrcme.ru)',
  },
  MAIN: {
    id: 'main',
    name: 'Apex',
    fullName: 'Apex',
    badge: 'HD',
    description: 'Primary RiveStream direct embedding engine',
  },
  AGGREGATOR: {
    id: 'agg',
    name: 'Titan',
    fullName: 'Titan',
    badge: 'Recommended',
    description: 'Aggregates multiple streaming sources for highest reliability',
  },
};

/**
 * Constructs the iframe source URL for Codenamed streaming engines.
 * 
 * @param {Object} options
 * @param {'movie' | 'tv'} options.type - Content type
 * @param {string | number} [options.id] - TMDB Media ID
 * @param {string | number} [options.season=1] - TV Season number
 * @param {string | number} [options.episode=1] - TV Episode number
 * @param {'streamsilu' | 'cdn' | 'embed2' | 'vidlink' | 'vidsrc' | 'main' | 'agg'} [options.server='main'] - Selected stream server
 * @returns {string} Fully qualified embed URL
 */
export function getRiveEmbedUrl({ type = 'movie', id, season = 1, episode = 1, server = 'main' }) {
  if (!id) return '';

  const isTv = type === 'tv';
  const s = season || 1;
  const e = episode || 1;

  // Aura (streamsilu Main Server: stream-movies-server-01.streamsilu.cc.cd)
  if (server === 'streamsilu') {
    return isTv
      ? `https://stream-movies-server-01.streamsilu.cc.cd/embed/tv/${id}/${s}/${e}`
      : `https://stream-movies-server-01.streamsilu.cc.cd/embed/movie/${id}`;
  }

  // Cdn (CDN Embed: cdn-embed.com)
  if (server === 'cdn') {
    return isTv
      ? `https://cdn-embed.com/serie/${id}/${s}/${e}`
      : `https://cdn-embed.com/filme/${id}`;
  }

  // Pulse (2Embed: www.2embed.cc)
  if (server === 'embed2') {
    return isTv
      ? `https://www.2embed.cc/embedtv/${id}?s=${s}&e=${e}`
      : `https://www.2embed.cc/embed/${id}`;
  }

  // Nova (VidLink Pro: vidlink.pro)
  if (server === 'vidlink') {
    return isTv
      ? `https://vidlink.pro/tv/${id}/${s}/${e}`
      : `https://vidlink.pro/movie/${id}`;
  }

  // Most (VidSrc: vidsrcme.ru / vidsrc.me)
  if (server === 'vidsrc') {
    return isTv
      ? `https://vidsrc.to/embed/tv/${id}/${s}/${e}`
      : `https://vidsrc.to/embed/movie/${id}`;
  }

  // RiveStream Engines (Apex and Titan)
  let endpoint = 'https://www.rivestream.app/embed';
  if (server === 'agg') {
    endpoint = 'https://www.rivestream.app/embed/agg';
  }

  const params = new URLSearchParams({
    type: isTv ? 'tv' : 'movie',
    id: String(id)
  });

  if (isTv) {
    params.set('season', String(s));
    params.set('episode', String(e));
  }

  return `${endpoint}?${params.toString()}`;
}

export function getPhantomTorrentEmbedUrl(magnet) {
  if (!magnet) return '';
  return `https://www.rivestream.app/embed/torrent?magnet=${encodeURIComponent(magnet)}`;
}
