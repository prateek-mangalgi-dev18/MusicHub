"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useMusic } from "@/context/musiccontext";
import {
  FaHeart,
  FaPlus,
  FaPlay,
  FaPause,
} from "react-icons/fa";

/* ---------------- TYPES ---------------- */

interface Song {
  _id: string;
  title: string;
  artist: string;
  movie?: string;
  coverImage?: string;
}

/* ---------------- PAGE ---------------- */

export default function HomePage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState("");

  const {
    currentSong,
    playSong,
    isPlaying,
    likedSongs,
    handleLike,
    openAddToPlaylistModal,
  } = useMusic();

  /* ---------------- FETCH SONGS ---------------- */

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await api.get<Song[]>("/api/songs");
        setSongs(res.data);
      } catch (err) {
        console.error("Failed to fetch songs");
      }
    };

    fetchSongs();
  }, []);

  /* ---------------- SEARCH ---------------- */

  const filteredSongs = search
    ? songs.filter(
        (s) =>
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          s.artist.toLowerCase().includes(search.toLowerCase()) ||
          s.movie?.toLowerCase().includes(search.toLowerCase())
      )
    : songs;

  /* ---------------- HELPERS ---------------- */

  const isLiked = (id: string) =>
    likedSongs.some((s) => s._id === id);

  // const logout = async () => {
  //   await api.post("/api/user/logout");
  //   window.location.href = "/login";
  // };
  const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

  /* ---------------- UI ---------------- */

  return (
    <div className="text-white px-6 py-8 bg-black min-h-screen pb-32">
      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search songs..."
          className="bg-zinc-800 px-4 py-2 rounded-full w-full max-w-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={logout}
          className="ml-4 bg-red-600 px-4 py-2 rounded-full"
        >
          Logout
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6">🎵 Featured Songs</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSongs.length ? (
          filteredSongs.map((song) => (
            <div
              key={song._id}
              className="bg-zinc-900 p-4 rounded-2xl"
            >
              <img
                src={song.coverImage || "https://unsplash.it/300/300"}
                alt={song.title}
                className="h-48 w-full object-cover rounded-xl mb-3"
              />

              <p className="font-semibold truncate">{song.title}</p>
              <p className="text-sm text-gray-400 truncate">
                🎤 {song.artist}
              </p>

              <div className="flex justify-between mt-3">
                <button onClick={() => playSong(song)}>
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
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No songs found.</p>
        )}
      </div>
    </div>
  );
}
