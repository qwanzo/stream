import React, { useEffect, useMemo, useState } from 'react';
import { Download, ShieldCheck, Smartphone, Monitor, Laptop, Apple, ArrowRight } from 'lucide-react';

const RELEASE_API = 'https://api.github.com/repos/qwanzo/stream/releases/latest';

function formatBytes(bytes = 0) {
  if (!bytes) return 'Unknown size';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
  const value = bytes / (1024 ** index);
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${sizes[index]}`;
}

function getAssetLabel(name = '') {
  const label = name.toLowerCase();
  if (label.includes('android') || label.includes('apk')) return 'Android APK';
  if (label.includes('windows') || label.includes('win')) return 'Windows';
  if (label.includes('linux') || label.includes('appimage') || label.includes('deb') || label.includes('rpm')) return 'Linux';
  if (label.includes('mac') || label.includes('darwin')) return 'macOS';
  return 'Download';
}

function getAssetIcon(label) {
  if (label.includes('Android')) return Smartphone;
  if (label.includes('Windows')) return Monitor;
  if (label.includes('Linux')) return Laptop;
  if (label.includes('macOS')) return Apple;
  return Download;
}

export default function DownloadPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadReleaseAssets() {
      try {
        const response = await fetch(RELEASE_API, {
          headers: { Accept: 'application/vnd.github+json' }
        });

        if (!response.ok) {
          throw new Error('Unable to fetch GitHub release assets.');
        }

        const data = await response.json();
        if (!active) return;

        setAssets(data.assets || []);
      } catch (loadError) {
        if (!active) return;
        setError(loadError.message || 'Unable to load release assets.');
        setAssets([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadReleaseAssets();
    return () => { active = false; };
  }, []);

  const releaseAssets = useMemo(() => {
    if (assets.length > 0) return assets;
    return [
      {
        name: 'plix-android.apk',
        browser_download_url: 'https://github.com/qwanzo/stream/releases/latest/download/plix-android.apk',
        size: 0,
        label: 'Android APK'
      },
      {
        name: 'plix-windows.zip',
        browser_download_url: 'https://github.com/qwanzo/stream/releases/latest',
        size: 0,
        label: 'Windows'
      },
      {
        name: 'plix-linux.AppImage',
        browser_download_url: 'https://github.com/qwanzo/stream/releases/latest',
        size: 0,
        label: 'Linux'
      }
    ];
  }, [assets]);

  return (
    <div className="min-h-screen bg-[#141414] px-4 pb-20 pt-24 text-white sm:px-6 sm:pt-28">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-2xl border border-zinc-800 bg-[#181818] p-6 text-center shadow-2xl sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600/15 text-red-500 ring-1 ring-red-500/30">
            <Download className="h-8 w-8" />
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-red-500">Latest GitHub Release</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Download PLIX</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-400">
            Grab the latest Android, Windows, and Linux build directly from the GitHub release assets.
          </p>
        </section>

        {error && (
          <div className="rounded-xl border border-amber-700/60 bg-amber-950/20 px-4 py-3 text-sm text-amber-200">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {releaseAssets.map((asset) => {
            const label = asset.label || getAssetLabel(asset.name);
            const Icon = getAssetIcon(label);
            const href = asset.browser_download_url || 'https://github.com/qwanzo/stream/releases/latest';

            return (
              <a
                key={`${asset.name}-${asset.browser_download_url}`}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="group block rounded-2xl border border-zinc-800 bg-[#181818] p-5 transition-all hover:border-red-500/60 hover:bg-[#1d1d1d]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600/15 text-red-500 ring-1 ring-red-500/30">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-300">
                    {label}
                  </span>
                </div>

                <h2 className="mt-4 text-lg font-bold text-white">{asset.name || label}</h2>
                <p className="mt-2 text-sm text-gray-400">
                  {asset.size ? formatBytes(asset.size) : 'Available from GitHub Releases'}
                </p>

                <div className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-600 px-3.5 py-2 text-sm font-bold text-white shadow-lg shadow-red-950/40 transition-colors hover:bg-red-700">
                  <Download className="h-4 w-4" />
                  Download
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </a>
            );
          })}
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#181818] p-5 text-sm text-gray-400">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
            <span className="flex items-center gap-1.5 text-emerald-400"><ShieldCheck className="h-3.5 w-3.5" />Official GitHub release builds</span>
            <span>{loading ? 'Loading release list…' : `${releaseAssets.length} asset${releaseAssets.length === 1 ? '' : 's'} available`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
