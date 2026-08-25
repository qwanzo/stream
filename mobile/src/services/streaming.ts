export type MediaType = 'movie' | 'tv' | 'torrent';

export type StreamProvider = {
  id: string;
  name: string;
  buildUrl: (options: { type: MediaType; id?: string; magnet?: string; season?: number; episode?: number }) => string;
};

const providers: StreamProvider[] = [
  {
    id: 'main',
    name: 'Apex',
    buildUrl: ({ type, id, season = 1, episode = 1 }) => {
      const params = new URLSearchParams({ type: type === 'tv' ? 'tv' : 'movie', id: id || '' });
      if (type === 'tv') {
        params.set('season', String(season));
        params.set('episode', String(episode));
      }
      return `https://www.rivestream.app/embed?${params.toString()}`;
    }
  },
  {
    id: 'agg',
    name: 'Titan',
    buildUrl: ({ type, id, season = 1, episode = 1 }) => {
      const params = new URLSearchParams({ type: type === 'tv' ? 'tv' : 'movie', id: id || '' });
      if (type === 'tv') {
        params.set('season', String(season));
        params.set('episode', String(episode));
      }
      return `https://www.rivestream.app/embed/agg?${params.toString()}`;
    }
  },
  {
    id: 'pansilu',
    name: 'Aura',
    buildUrl: ({ type, id, season = 1, episode = 1 }) => type === 'tv'
      ? `https://stream-movies-server-01.pansilu.cc.cd/embed/tv/${id}/${season}/${episode}`
      : `https://stream-movies-server-01.pansilu.cc.cd/embed/movie/${id}`
  },
  {
    id: 'vidsrc',
    name: 'Most',
    buildUrl: ({ type, id, season = 1, episode = 1 }) => type === 'tv'
      ? `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`
      : `https://vidsrc.to/embed/movie/${id}`
  },
  {
    id: 'vidlink',
    name: 'Nova',
    buildUrl: ({ type, id, season = 1, episode = 1 }) => type === 'tv'
      ? `https://vidlink.pro/tv/${id}/${season}/${episode}`
      : `https://vidlink.pro/movie/${id}`
  },
  {
    id: 'embed2',
    name: 'Pulse',
    buildUrl: ({ type, id, season = 1, episode = 1 }) => type === 'tv'
      ? `https://www.2embed.cc/embedtv/${id}?s=${season}&e=${episode}`
      : `https://www.2embed.cc/embed/${id}`
  },
  {
    id: 'cdn',
    name: 'Cdn',
    buildUrl: ({ type, id, season = 1, episode = 1 }) => type === 'tv'
      ? `https://cdn-embed.com/serie/${id}/${season}/${episode}`
      : `https://cdn-embed.com/filme/${id}`
  },
  {
    id: 'torrent',
    name: 'Phantom P2P',
    buildUrl: ({ magnet }) => `https://www.rivestream.app/embed/torrent?magnet=${encodeURIComponent(magnet || '')}`
  }
];

export function getProviders(): StreamProvider[] {
  return providers;
}

export function getEmbedUrl(providerId: string, options: { type: MediaType; id?: string; magnet?: string; season?: number; episode?: number }): string {
  return providers.find((provider) => provider.id === providerId)?.buildUrl(options) || '';
}