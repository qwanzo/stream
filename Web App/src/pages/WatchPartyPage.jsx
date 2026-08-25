import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Copy, Check, Play, MessageSquare, Send, Smile, Sparkles, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function WatchPartyPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { watchlist } = useApp();

  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, user: 'System', text: `Welcome to Watch Party Room #${roomId || 'live'}!`, time: 'Just now', system: true },
    { id: 2, user: 'Pansilu Stream Bot', text: 'Share your room link with friends to watch movies in sync!', time: 'Just now', bot: true }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [floatingEmojis, setFloatingEmojis] = useState([]);

  const roomUrl = window.location.href;
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessage = {
      id: Date.now(),
      user: 'You',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setChatInput('');
  };

  const handleTriggerEmoji = (emoji) => {
    // Add floating emoji animation
    const id = Date.now() + Math.random();
    const left = Math.floor(Math.random() * 80 + 10);
    setFloatingEmojis(prev => [...prev, { id, emoji, left }]);

    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(item => item.id !== id));
    }, 2500);

    // Also append to chat
    setMessages(prev => [...prev, {
      id: Date.now(),
      user: 'You',
      text: `Reacted with ${emoji}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-20 sm:pt-24 pb-20 px-3 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6 relative overflow-hidden">
      
      {/* Floating Emojis Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {floatingEmojis.map((e) => (
          <div
            key={e.id}
            style={{ left: `${e.left}%` }}
            className="absolute bottom-10 text-4xl animate-bounce transition-all duration-1000"
          >
            {e.emoji}
          </div>
        ))}
      </div>

      {/* Room Header & Share Link */}
      <div className="bg-[#181818] border border-zinc-800 rounded-2xl p-4 sm:p-6 space-y-4 text-center">
        <div className="p-3 bg-red-600/10 text-red-500 rounded-full inline-block border border-red-500/20">
          <Users className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>

        <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
          Synced Watch Party Room <span className="text-[#E50914]">#{roomId || 'live'}</span>
        </h1>

        <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
          Invite friends to watch movies, anime, and TV series with real-time live chat & synchronized playback.
        </p>

        {/* Room URL Copy Bar */}
        <div className="flex items-center max-w-lg mx-auto bg-zinc-900 border border-zinc-700 rounded-xl p-1.5">
          <input
            type="text"
            readOnly
            value={roomUrl}
            className="flex-1 bg-transparent px-3 text-xs text-gray-300 focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 bg-[#E50914] hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>

      {/* Grid: Live Chat & Shared Playlist Exporter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Live Chat Room */}
        <div className="lg:col-span-2 bg-[#181818] border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col h-[480px]">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-red-500" />
              <span>Live Room Chat</span>
            </h3>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded font-bold">
              2 Online
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-grow overflow-y-auto space-y-3 pr-2 custom-scrollbar text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-2.5 rounded-xl border ${
                  m.system
                    ? 'bg-red-950/30 border-red-800/40 text-red-300 text-center font-semibold'
                    : m.user === 'You'
                    ? 'bg-red-950/40 border-red-800/50 text-white ml-8'
                    : 'bg-zinc-900 border-zinc-800 text-gray-200 mr-8'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                  <span className="font-bold text-gray-300">{m.user}</span>
                  <span>{m.time}</span>
                </div>
                <p className="leading-relaxed">{m.text}</p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Reaction Emojis Bar */}
          <div className="flex items-center space-x-2 pt-3 border-t border-zinc-800">
            <span className="text-[10px] font-bold text-gray-400 uppercase">React:</span>
            {['🍿', '🔥', '😱', '❤️', '👏', '😂'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleTriggerEmoji(emoji)}
                className="text-base hover:scale-125 transition-transform p-1 bg-zinc-900 rounded-lg border border-zinc-800"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2 pt-2">
            <input
              type="text"
              placeholder="Type message to room..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-grow bg-zinc-900 border border-zinc-700 focus:border-red-600 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="bg-[#E50914] hover:bg-red-700 text-white p-2 rounded-xl transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right 1 Col: Shared Playlist & Quick Launch */}
        <div className="space-y-4">
          <div className="bg-[#181818] border border-zinc-800 rounded-2xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Share2 className="w-4 h-4 text-yellow-500" />
              <span>Share My List Playlist</span>
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Export your saved movies ({watchlist.length} titles) into a shareable playlist link.
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/my-list`);
                alert('Curated My List URL copied to clipboard!');
              }}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 rounded-xl text-xs border border-zinc-700 transition-colors"
            >
              Export My List Playlist Link
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center space-x-2 bg-white text-black hover:bg-white/90 py-3 rounded-xl font-bold text-sm shadow-xl transition-transform hover:scale-105"
            >
              <Play className="w-4 h-4 fill-current text-black" />
              <span>Browse Catalog & Start Room Stream</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
