"use client";

import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaHeart, FaPlus } from "react-icons/fa";
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

  if (!currentSong) return null;

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-zinc-900 border-t border-zinc-800 px-6 py-3 z-50">
      <div className="flex items-center justify-between gap-6">

        {/* SONG INFO */}
        <div className="flex items-center gap-3 w-1/4 min-w-0">
          <img
            src={currentSong.coverImage || fallbackImage}
            alt="cover"
            className="w-12 h-12 rounded-md object-cover"
          />
          <div className="truncate">
            <p className="font-semibold truncate">{currentSong.title}</p>
            <p className="text-sm text-gray-400 truncate">{currentSong.artist}</p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col items-center w-1/2">
          <div className="flex items-center gap-6 mb-1">
            <button onClick={playPrevious} className="text-gray-300 hover:text-white">
              <FaStepBackward size={18} />
            </button>

            <button
              onClick={togglePlayPause}
              className="bg-white text-black rounded-full w-10 h-10 flex items-center justify-center"
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>

            <button onClick={playNext} className="text-gray-300 hover:text-white">
              <FaStepForward size={18} />
            </button>
          </div>

          {/* SEEK BAR */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-gray-400 w-10 text-right">
              {formatTime(currentTime)}
            </span>

            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="w-full accent-green-500"
            />

            <span className="text-xs text-gray-400 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4 w-1/4 justify-end">
          <button
            onClick={() => handleLike(currentSong)}
            className="text-gray-300 hover:text-red-500"
          >
            <FaHeart />
          </button>

          <button
            onClick={() => openAddToPlaylistModal(currentSong)}
            className="text-gray-300 hover:text-green-400"
          >
            <FaPlus />
          </button>
        </div>
      </div>
    </div>
  );
}
