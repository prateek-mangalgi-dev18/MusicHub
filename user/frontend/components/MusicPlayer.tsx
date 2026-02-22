"use client";

import { useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaHeart,
  FaPlus,
} from "react-icons/fa";
import { useMusic } from "@/context/musiccontext";

export default function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    playNext,
    playPrevious,
    handleSeek,
    progress,
    currentTime,
    duration,
    handleLike,
    openAddToPlaylistModal,
    fallbackImage,
  } = useMusic();



  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlayPause();
          break;

        case "ArrowRight":
          e.preventDefault();
          handleSeek(Math.min(100, progress + (5 / duration) * 100));
          break;

        case "ArrowLeft":
          e.preventDefault();
          handleSeek(Math.max(0, progress - (5 / duration) * 100));
          break;

        case "ArrowUp":
          e.preventDefault();
          document.querySelector("audio")!.volume = Math.min(
            1,
            document.querySelector("audio")!.volume + 0.05
          );
          break;

        case "ArrowDown":
          e.preventDefault();
          document.querySelector("audio")!.volume = Math.max(
            0,
            document.querySelector("audio")!.volume - 0.05
          );
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlayPause, handleSeek, progress, duration]);



  useEffect(() => {
    if (!currentSong || !("mediaSession" in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentSong.title,
      artist: currentSong.artist,
      artwork: [
        {
          src: currentSong.coverImage || fallbackImage,
          sizes: "512x512",
          type: "image/png",
        },
      ],
    });

    navigator.mediaSession.setActionHandler("play", togglePlayPause);
    navigator.mediaSession.setActionHandler("pause", togglePlayPause);
    navigator.mediaSession.setActionHandler("nexttrack", playNext);
    navigator.mediaSession.setActionHandler("previoustrack", playPrevious);

    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("nexttrack", null);
      navigator.mediaSession.setActionHandler("previoustrack", null);
    };
  }, [
    currentSong,
    togglePlayPause,
    playNext,
    playPrevious,
    fallbackImage,
  ]);

  if (!currentSong) return null;

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="fixed bottom-0 left-64 right-0 bg-white/80 backdrop-blur-xl border-t border-zinc-200 px-6 py-4 z-[90] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between gap-6 max-w-[1600px] mx-auto">
        {/* SONG INFO */}
        <div className="flex items-center gap-4 w-1/4 min-w-0">
          <div className="relative group">
            <img
              src={currentSong.coverImage || fallbackImage}
              alt="cover"
              className="w-14 h-14 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5" />
          </div>
          <div className="truncate">
            <p className="font-black text-black truncate text-sm uppercase tracking-tight leading-tight mb-0.5">
              {currentSong.title}
            </p>
            <p className="text-xs font-bold text-zinc-400 truncate uppercase tracking-widest">
              {currentSong.artist}
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col items-center w-1/2 max-w-2xl px-8">
          <div className="flex items-center gap-8 mb-3">
            <button
              onClick={playPrevious}
              className="text-zinc-400 hover:text-black transition-colors transform active:scale-90"
            >
              <FaStepBackward size={16} />
            </button>

            <button
              onClick={togglePlayPause}
              className="bg-black text-white rounded-full w-12 h-12 flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
            >
              {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} className="ml-1" />}
            </button>

            <button
              onClick={playNext}
              className="text-zinc-400 hover:text-black transition-colors transform active:scale-90"
            >
              <FaStepForward size={16} />
            </button>
          </div>

          {/* SEEK BAR */}
          <div className="flex items-center gap-4 w-full">
            <span className="text-[10px] font-black text-zinc-400 w-10 text-right tabular-nums">
              {formatTime(currentTime)}
            </span>

            <div className="flex-grow relative h-6 flex items-center group">
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="w-full h-1 bg-zinc-100 rounded-full appearance-none cursor-pointer accent-black hover:h-1.5 transition-all"
              />
            </div>

            <span className="text-[10px] font-black text-zinc-400 w-10 tabular-nums">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3 w-1/4 justify-end">
          <button
            onClick={() => handleLike(currentSong)}
            className="p-3 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-accent transition-all active:scale-90"
          >
            <FaHeart size={18} />
          </button>

          <button
            onClick={() => openAddToPlaylistModal(currentSong)}
            className="p-3 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-black transition-all active:scale-90"
          >
            <FaPlus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
