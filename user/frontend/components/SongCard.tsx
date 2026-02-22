"use client";

import { Play, Heart, Plus } from "lucide-react";
import { useMusic } from "@/context/musiccontext";
import type { Song } from "@/types/song";

export default function SongCard({ song }: { song: Song }) {
  const {
    playSong,
    likedSongs,
    handleLike,
    openAddToPlaylistModal,
  } = useMusic();

  const isLiked = likedSongs.some((s) => s._id === song._id);

  return (
    <div className="group relative flex flex-col transition-all duration-300">
      {/* Artwork Container */}
      <div className="relative aspect-square overflow-hidden rounded-lg mb-4 bg-zinc-200">
        <img
          src={song.coverImage || "/default-song.png"}
          alt={song.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover Overlay for quick actions */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow">
        <h3 className="font-black text-xl leading-tight truncate text-black mb-1 group-hover:text-accent transition-colors tracking-tight uppercase italic">
          {song.title}
        </h3>
        <p className="text-zinc-500 text-xs font-black uppercase tracking-widest truncate mb-4">
          {song.artist}
        </p>

        <div className="mt-auto space-y-1">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-300">
            Recent Release
          </p>
          <p className="text-[10px] font-black uppercase tracking-widest text-accent italic">
            {song.movie || "General"}
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => playSong(song)}
            className="flex items-center gap-2 bg-white border border-zinc-200 px-6 py-2 rounded-full text-xs font-black uppercase shadow-sm hover:bg-black hover:text-white hover:border-black transition-all active:scale-95"
          >
            <Play className="w-3 h-3 fill-current" />
            Play
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => handleLike(song)}
              className={`p-2 rounded-full border border-zinc-100 hover:border-accent transition-all ${isLiked ? "bg-accent/10 text-accent border-accent" : "text-zinc-300 hover:text-accent"
                }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={() => openAddToPlaylistModal(song)}
              className="p-2 rounded-full border border-zinc-100 text-zinc-300 hover:text-black hover:border-black transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
