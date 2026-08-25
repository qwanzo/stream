import React from 'react';
import { Download, ShieldCheck, Smartphone } from 'lucide-react';

const APK_PATH = '/downloads/pansilu-stream-android.apk?v=20260825';

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-[#141414] px-4 pb-20 pt-24 text-white sm:px-6 sm:pt-28">
      <div className="mx-auto max-w-2xl space-y-6">
        <section className="rounded-2xl border border-zinc-800 bg-[#181818] p-6 text-center shadow-2xl sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600/15 text-red-500 ring-1 ring-red-500/30">
            <Smartphone className="h-8 w-8" />
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-red-500">Latest Pansilu Stream Android release</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Download the mobile app</h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-gray-400">
            Install the production Android app for iframe-based streaming on your phone or tablet.
          </p>
          <a
            href={APK_PATH}
            download="pansilu-stream-android.apk"
            className="mx-auto mt-8 flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-950/40 transition-colors hover:bg-red-700"
          >
            <Download className="h-5 w-5" />
            Download APK
          </a>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-gray-500">
            <span>Version 1.0.0</span>
            <span>Android arm64</span>
            <span>18.6 MB</span>
            <span className="flex items-center gap-1.5 text-emerald-400"><ShieldCheck className="h-3.5 w-3.5" />Signed release</span>
          </div>
        </section>
        <p className="text-center text-xs leading-relaxed text-gray-500">
          Android may ask you to allow installation from this browser before installing the APK.
        </p>
      </div>
    </div>
  );
}
