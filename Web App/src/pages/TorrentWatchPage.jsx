import React, { useState } from 'react';
import { ArrowLeft, Magnet, Play, ShieldCheck } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getPhantomTorrentEmbedUrl, PHANTOM_SERVER } from '../services/rivestream';

export default function TorrentWatchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [magnetInput, setMagnetInput] = useState(searchParams.get('magnet') || '');
  const navigate = useNavigate();
  const magnet = searchParams.get('magnet')?.trim() || '';
  const embedUrl = getPhantomTorrentEmbedUrl(magnet);

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = magnetInput.trim();
    if (value) setSearchParams({ magnet: value });
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] px-3 pb-20 pt-14 text-white sm:px-6 sm:pt-16 md:pb-10">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="flex items-center justify-between gap-3 border-b border-zinc-800 py-3">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
            <Magnet className="h-4 w-4 text-red-500" /> {PHANTOM_SERVER.name}
          </div>
        </div>

        <section className="rounded-xl border border-zinc-800 bg-[#141414] p-4 sm:p-6">
          <div className="mb-4 flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            <div>
              <h1 className="text-lg font-extrabold">Phantom Torrent Stream</h1>
              <p className="mt-1 text-xs leading-relaxed text-gray-400">RiveStream torrent embed provider. Enter a real magnet link or torrent infohash to load the stream.</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
            <input
              value={magnetInput}
              onChange={(event) => setMagnetInput(event.target.value)}
              placeholder="magnet:?xt=urn:btih:..."
              aria-label="Magnet link or torrent infohash"
              className="min-w-0 flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-xs text-white outline-none focus:border-red-600"
            />
            <button type="submit" disabled={!magnetInput.trim()} className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40">
              <Play className="h-4 w-4 fill-current" /> Load Phantom
            </button>
          </form>
        </section>

        {embedUrl && <div className="aspect-video w-full overflow-hidden bg-black shadow-2xl sm:rounded-2xl">
          <iframe
            src={embedUrl}
            title="Phantom Torrent Stream"
            className="h-full w-full border-0"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>}
      </div>
    </div>
  );
}
