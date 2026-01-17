"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useMusic } from "@/context/musiccontext";
import {
  FaHeart,
  FaPlus,
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
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
  const [search, setSearch] = useState<string>("");
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);

  const {
    currentSong,
    playSong,
    isPlaying,
    togglePlayPause,
    likedSongs,
    handleLike,
    openAddToPlaylistModal,
    progress,
    duration,
    currentTime,
    handleSeek,
    error,
    setError,
  } = useMusic();

  /* ---------------- FETCH SONGS ---------------- */

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.get<Song[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/songs`
        );
        setSongs(res.data);
        setFilteredSongs(res.data);
      } catch (err) {
        console.error("Error fetching songs:", err);
        setError("Failed to load songs. Please try again later.");
      }
    };

    fetchSongs();
  }, [setError]);

  /* ---------------- SEARCH ---------------- */

  useEffect(() => {
    if (search.trim()) {
      setFilteredSongs(
        songs.filter(
          (song) =>
            song.title.toLowerCase().includes(search.toLowerCase()) ||
            song.artist.toLowerCase().includes(search.toLowerCase()) ||
            song.movie?.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredSongs(songs);
    }
  }, [search, songs]);

  /* ---------------- HELPERS ---------------- */

  const formatTime = (sec: number) => {
    if (isNaN(sec)) return "0:00";
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const isLiked = (songId: string) =>
  Array.isArray(likedSongs) &&
  likedSongs.some((song: Song) => song._id === songId);


  const playNextSong = () => {
    if (!currentSong || !filteredSongs.length) return;

    const index = filteredSongs.findIndex(
      (song) => song._id === currentSong._id
    );

    if (index < filteredSongs.length - 1) {
      playSong(filteredSongs[index + 1]);
    }
  };

  const playPreviousSong = () => {
    if (!currentSong || !filteredSongs.length) return;

    const index = filteredSongs.findIndex(
      (song) => song._id === currentSong._id
    );

    if (index > 0) {
      playSong(filteredSongs[index - 1]);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="text-white px-6 py-8 bg-black min-h-screen relative pb-32">
      {/* ERROR */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 p-4 rounded-lg z-50">
          {error}
          <button onClick={() => setError(null)} className="ml-2 font-bold">
            ×
          </button>
        </div>
      )}

      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center bg-zinc-800 p-3 rounded-full flex-grow mr-4">
          <input
            type="text"
            placeholder="Search songs by title, artist or movie..."
            className="bg-transparent outline-none text-white ml-2 flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="bg-red-600 px-4 py-2 rounded-full"
        >
          Logout
        </button>
      </div>

      {/* SONG LIST */}
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
                  className={isLiked(song._id) ? "text-red-500" : "text-gray-400"}
                >
                  <FaHeart />
                </button>

                <button onClick={() => openAddToPlaylistModal(song)}>
                  <FaPlus />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No songs found.</p>
        )}
      </div>

      {/* PLAYER */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 w-full bg-zinc-900 p-4 flex justify-between">
          <div>
            <p>{currentSong.title}</p>
            <p className="text-sm text-gray-400">{currentSong.artist}</p>
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
              onChange={(e) => handleSeek(Number(e.target.value))}
            />

            <div className="text-xs text-gray-400">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
