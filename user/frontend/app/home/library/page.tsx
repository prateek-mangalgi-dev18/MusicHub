"use client";

import { useState } from "react";
import { useMusic } from "@/context/musiccontext";
import {
  FaHeart,
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaPlus,
} from "react-icons/fa";

/* ---------- TYPES ---------- */

interface Song {
  _id: string;
  title: string;
  artist: string;
  movie?: string;
  coverImage?: string;
}

/* ---------- PAGE ---------- */

export default function LibraryPage() {
  const {
    likedSongs,
    handleLike,
    playSong,
    currentSong,
    isPlaying,
    togglePlayPause,
    openAddToPlaylistModal,
    progress,
    duration,
    currentTime,
    handleSeek,
    error,
    setError,
    fallbackImage,
  } = useMusic();

  const [search, setSearch] = useState("");

  /* ---------- FILTER ---------- */

  const filteredSongs = likedSongs.filter((song) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      song.title?.toLowerCase().includes(q) ||
      song.artist?.toLowerCase().includes(q) ||
      song.movie?.toLowerCase().includes(q)
    );
  });

  /* ---------- HELPERS ---------- */

  const formatTime = (sec: number) => {
    if (isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const isLiked = (id: string) =>
    likedSongs.some((song) => song._id === id);

  const playNextSong = () => {
    if (!currentSong || !filteredSongs.length) return;
    const idx = filteredSongs.findIndex(
      (s) => s._id === currentSong._id
    );
    if (idx < filteredSongs.length - 1) {
      playSong(filteredSongs[idx + 1]);
    }
  };

  const playPreviousSong = () => {
    if (!currentSong || !filteredSongs.length) return;
    const idx = filteredSongs.findIndex(
      (s) => s._id === currentSong._id
    );
    if (idx > 0) {
      playSong(filteredSongs[idx - 1]);
    }
  };

  /* ---------- UI ---------- */

  return (
    <div className="text-white px-6 py-8 bg-black min-h-screen relative pb-32">
      {/* ERROR */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 p-4 rounded-lg z-50">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 font-bold"
          >
            ×
          </button>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">❤️ Your Liked Songs</h1>

      <input
        type="text"
        placeholder="Search by title, artist, or movie"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 px-4 py-2 rounded-xl bg-zinc-800 text-white w-full md:w-1/2 outline-none"
      />

      {/* SONG GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSongs.length ? (
          filteredSongs.map((song) => (
            <div
              key={song._id}
              className="bg-zinc-900 p-4 rounded-2xl hover:bg-zinc-800 transition shadow-lg"
            >
              <div className="h-48 rounded-xl overflow-hidden mb-3">
                <img
                  src={song.coverImage || fallbackImage}
                  alt={song.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="font-semibold truncate">{song.title}</p>
              <p className="text-sm text-gray-400 truncate">
                🎤 {song.artist}
              </p>

              <div className="flex justify-between mt-3">
                <button
                  onClick={() => playSong(song)}
                  className="bg-green-600 px-4 py-1 rounded-full"
                >
                  {currentSong?._id === song._id && isPlaying ? (
                    <FaPause />
                  ) : (
                    <FaPlay />
                  )}
                </button>

                <button
                  onClick={() => handleLike(song)}
                  className={
                    isLiked(song._id)
                      ? "text-red-500"
                      : "text-gray-400"
                  }
                >
                  <FaHeart />
                </button>

                <button
                  onClick={() => openAddToPlaylistModal(song)}
                  className="text-blue-400"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400">
            {likedSongs.length === 0
              ? "No liked songs yet."
              : "No matching songs found."}
          </p>
        )}
      </div>

      {/* PLAYER */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 w-full bg-zinc-900 px-4 py-3 flex justify-between z-50">
          <div>
            <p className="font-semibold">{currentSong.title}</p>
            <p className="text-sm text-gray-400">
              {currentSong.artist}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex gap-4">
              <FaStepBackward onClick={playPreviousSong} />
              <button onClick={togglePlayPause}>
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <FaStepForward onClick={playNextSong} />
            </div>

            <input
              type="range"
              value={progress}
              onChange={(e) =>
                handleSeek(Number(e.target.value))
              }
            />

            <div className="text-xs text-gray-400">
              {formatTime(currentTime)} /{" "}
              {formatTime(duration)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
