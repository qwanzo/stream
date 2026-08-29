import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, ChevronDown, ChevronRight, ChevronUp, Maximize2, RefreshCw, Server, ShieldCheck, Sparkles, Tv } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getRiveEmbedUrl, RIVE_SERVERS, UNSANDBOXED_SERVERS } from '../services/rivestream';
import { getMediaDetails, getTvSeasons } from '../services/tmdb';
import { extractIdFromSlug } from '../utils/slug';

const SERVER_ORDER = ['main', 'agg', 'streamsilu', 'vidsrc', 'vidlink', 'embed2', 'cdn'];
const PROVIDER_WARNINGS = {
  streamsilu: 'Aura may redirect you or open popups. Continue only if you trust this provider.',
  vidsrc: 'Most may redirect you or open popups. Continue only if you trust this provider.',
  vidlink: 'Nova may redirect you or open popups. Continue only if you trust this provider.',
  embed2: 'Pulse may redirect you or open popups. Continue only if you trust this provider.',
  cdn: 'Cdn may redirect you or open popups. Continue only if you trust this provider.',
  agg: 'Titan may not have this movie or episode available.'
};

export default function WatchPage() {
  const { slug, id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { selectedServer, setSelectedServer, apiKey, saveWatchProgress, setActivePipMedia } = useApp();
  const mediaId = extractIdFromSlug(slug || id);
  const isTv = window.location.pathname.includes('/watch/tv');
  const mediaType = isTv ? 'tv' : 'movie';
  const season = parseInt(searchParams.get('s') || '1', 10);
  const episode = parseInt(searchParams.get('e') || '1', 10);
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [failoverMessage, setFailoverMessage] = useState('');
  const [pendingServer, setPendingServer] = useState(null);

  useEffect(() => {
    let active = true;
    if (!mediaId) return undefined;
    setLoading(true);
    getMediaDetails(mediaId, mediaType, apiKey).then((details) => {
      if (!active) return;
      setMedia(details);
      setLoading(false);
      if (details) saveWatchProgress(details, season, episode);
    });
    return () => { active = false; };
  }, [apiKey, episode, mediaId, mediaType, saveWatchProgress, season]);

  const embedUrl = getRiveEmbedUrl({ type: mediaType, id: mediaId, season, episode, server: selectedServer });
  const title = media?.title || media?.name || 'Now Streaming';
  const activeServer = Object.values(RIVE_SERVERS).find((server) => server.id === selectedServer);
  const seasons = isTv ? getTvSeasons(media) : [];
  const currentSeason = seasons.find((item) => item.number === season) || seasons[0];
  const seasonCount = seasons.length;
  const episodeCount = currentSeason?.episodeCount || 0;
  const selectServer = (serverId) => {
    if (PROVIDER_WARNINGS[serverId] && serverId !== selectedServer) {
      setPendingServer(serverId);
      return;
    }
    setSelectedServer(serverId);
    setIframeKey((key) => key + 1);
  };
  const confirmServer = () => {
    if (!pendingServer) return;
    setSelectedServer(pendingServer);
    setIframeKey((key) => key + 1);
    setPendingServer(null);
  };
  const nextEpisode = () => {
    if (episode < episodeCount) setSearchParams({ s: String(season), e: String(episode + 1) });
    else if (season < seasonCount) setSearchParams({ s: String(season + 1), e: '1' });
  };
  const failover = () => {
    const index = SERVER_ORDER.indexOf(selectedServer);
    const nextServerId = SERVER_ORDER[(index + 1) % SERVER_ORDER.length];
    selectServer(nextServerId);
    if (PROVIDER_WARNINGS[nextServerId] && nextServerId !== selectedServer) return;
    const nextServer = Object.values(RIVE_SERVERS).find((server) => server.id === nextServerId);
    setFailoverMessage(`Switched to ${nextServer?.name || nextServerId}`);
    window.setTimeout(() => setFailoverMessage(''), 4000);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white pt-14 sm:pt-16 pb-20 md:pb-10">
      <div className="flex items-center justify-between gap-2 px-3 sm:px-6 lg:px-8 py-3 border-b border-zinc-800 max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-gray-300 hover:text-white bg-zinc-800 px-3 py-1.5 rounded-lg text-xs font-semibold"><ArrowLeft className="w-4 h-4" />Back</button>
        <h2 className="text-sm font-bold truncate flex-1 text-center sm:hidden">{title}</h2>
        <div className="flex items-center gap-2">
          {media && <button onClick={() => { setActivePipMedia({ media, season, episode }); navigate('/'); }} className="flex items-center gap-1.5 bg-zinc-800 text-gray-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-zinc-700" title="Pop-out Picture-in-Picture Mini Player"><Maximize2 className="w-3.5 h-3.5 text-yellow-400" /><span className="hidden sm:inline">Mini Player</span></button>}
          <div className="flex items-center gap-1.5 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800 overflow-x-auto max-w-[55vw]"><Server className="w-3.5 h-3.5 text-red-500 hidden sm:block" />{Object.values(RIVE_SERVERS).map((server) => <button key={server.id} onClick={() => selectServer(server.id)} className={`px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap ${selectedServer === server.id ? 'bg-[#E50914] text-white' : 'text-gray-400 hover:text-white hover:bg-zinc-800'}`}>{server.name}</button>)}</div>
        </div>
      </div>
      <div className="w-full aspect-video bg-black sm:rounded-2xl sm:overflow-hidden sm:mx-auto sm:max-w-7xl sm:px-4 lg:px-8 relative sm:mt-4"><div className="w-full h-full overflow-hidden border-zinc-800 shadow-2xl">{!embedUrl ? <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-400 bg-black"><RefreshCw className="w-8 h-8 animate-spin text-red-500" /><p className="text-sm">Preparing player...</p></div> : <iframe key={iframeKey} src={embedUrl} title={title} className="w-full h-full border-0" allowFullScreen allow="autoplay; encrypted-media; picture-in-picture; fullscreen" {...(!UNSANDBOXED_SERVERS.has(selectedServer) && { sandbox: 'allow-scripts allow-same-origin allow-forms allow-presentation' })} referrerPolicy="strict-origin-when-cross-origin" />}</div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-2 text-[11px] text-gray-400"><span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-yellow-500" />If video fails to play, switch engine:</span><div className="flex flex-wrap items-center gap-1.5">{Object.values(RIVE_SERVERS).map((server) => <button key={server.id} onClick={() => selectServer(server.id)} className={`px-2 py-0.5 rounded text-[10px] font-bold border ${selectedServer === server.id ? 'bg-red-600 text-white border-red-500' : 'bg-zinc-900 text-gray-300 border-zinc-700'}`}>{server.name}</button>)}<button onClick={failover} className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800">Auto-Failover Next</button></div></div>
      </div>
      {pendingServer && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4"><div className="w-full max-w-md rounded-xl border border-amber-700/60 bg-[#181818] p-5 shadow-2xl"><div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" /><div><h2 className="text-base font-bold text-white">Provider warning</h2><p className="mt-2 text-sm leading-relaxed text-gray-300">{PROVIDER_WARNINGS[pendingServer]}</p></div></div><div className="mt-5 flex justify-end gap-2"><button onClick={() => setPendingServer(null)} className="rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-gray-300 hover:bg-zinc-800">Cancel</button><button onClick={confirmServer} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700">Continue</button></div></div></div>}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-4 space-y-4"><div className="bg-[#141414] p-4 sm:p-6 rounded-xl border border-zinc-800 space-y-3"><div className="flex items-start justify-between gap-3"><h1 className="text-lg sm:text-2xl font-extrabold">{title}</h1>{isTv && <span className="bg-red-950 text-red-400 border border-red-800/60 font-bold px-2.5 py-1 rounded-full text-xs">S{season} · E{episode}</span>}</div><p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{media?.overview || 'Enjoy high-speed, ad-free streaming powered by CineVault.'}</p><div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 pt-1 border-t border-zinc-800/80"><span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-red-500" />Engine: <strong className="text-gray-200">{activeServer?.name}</strong></span><span className="flex items-center gap-1.5 text-emerald-400"><ShieldCheck className="w-3.5 h-3.5" />Popup Protected</span></div></div>
        {isTv && <div className="bg-[#141414] rounded-xl border border-zinc-800 overflow-hidden"><button onClick={() => setShowEpisodes(!showEpisodes)} className="w-full flex items-center justify-between p-4 text-left"><h3 className="text-sm font-bold flex items-center gap-2"><Tv className="w-4 h-4 text-red-500" />Episode Guide <span className="text-xs font-normal text-gray-400">S{season} E{episode}</span></h3><div className="flex items-center gap-2">{(episode < episodeCount || season < seasonCount) && <span onClick={(event) => { event.stopPropagation(); nextEpisode(); }} className="flex items-center gap-1 bg-red-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold">Next <ChevronRight className="w-3.5 h-3.5" /></span>}{showEpisodes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</div></button>{showEpisodes && <div className="px-4 pb-4 space-y-3 border-t border-zinc-800"><div className="flex gap-2 overflow-x-auto pt-3">{seasons.map(({ number }) => <button key={number} onClick={() => setSearchParams({ s: String(number), e: '1' })} className={`px-3 py-1 rounded-lg text-xs font-bold border ${season === number ? 'bg-red-600 text-white border-red-500' : 'bg-zinc-800 text-gray-300 border-zinc-700'}`}>S{number}</button>)}</div><div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-2 max-h-48 overflow-y-auto">{Array.from({ length: episodeCount }, (_, index) => index + 1).map((value) => <button key={value} onClick={() => setSearchParams({ s: String(season), e: String(value) })} className={`py-2 rounded-lg border text-xs font-bold ${episode === value ? 'bg-[#E50914] text-white border-red-500' : 'bg-zinc-900 border-zinc-800 text-gray-300'}`}>{value}</button>)}</div></div>}</div>}
      </div>
    </div>
  );
}