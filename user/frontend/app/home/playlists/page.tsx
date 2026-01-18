"use client";

import { useState } from "react";
import { useMusic } from "@/context/musiccontext";
import {
  FaPlay,
  FaPause,
  FaTrash,
  FaHeart,
  FaPlus,
  FaStepForward,
  FaStepBackward,
} from "react-icons/fa";

export default function PlaylistsPage() {
  const {
    playlists,
    deletePlaylist,
    playSong,
    currentSong,
    isPlaying,
    togglePlayPause,
    handleLike,
    openAddToPlaylistModal,
    removeFromPlaylist,
    progress,
    duration,
    currentTime,
    handleSeek,
    likedSongs,
  } = useMusic();

  const [search, setSearch] = useState("");
  const [expandedPlaylist, setExpandedPlaylist] = useState<string | null>(null);

  const filteredPlaylists = search.trim()
    ? playlists.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    : playlists;

  const isLiked = (songId: string) =>
    likedSongs.some((song) => song._id === songId);

  const playNextSong = () => {
    if (!currentSong) return;
    for (const playlist of playlists) {
      const idx = playlist.songs.findIndex(
        (s) => s._id === currentSong._id
      );
      if (idx !== -1 && idx < playlist.songs.length - 1) {
        playSong(playlist.songs[idx + 1]);
        return;
      }
    }
  };

  const playPreviousSong = () => {
    if (!currentSong) return;
    for (const playlist of playlists) {
      const idx = playlist.songs.findIndex(
        (s) => s._id === currentSong._id
      );
      if (idx > 0) {
        playSong(playlist.songs[idx - 1]);
        return;
      }
    }
  };

  return (
    <div className="bg-black text-white min-h-screen px-6 py-8 pb-32">
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search playlists..."
          className="w-full md:w-1/2 bg-zinc-800 px-4 py-3 rounded-full outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <h2 className="text-2xl font-bold mb-6">🎶 Your Playlists</h2>

      {/* Playlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPlaylists.map((playlist) => (
          <div
            key={playlist.id}
            className="bg-gradient-to-br from-zinc-900 to-zinc-800 
                       border border-zinc-700 rounded-2xl p-5 
                       shadow-lg hover:scale-[1.02] transition"
          >
            {/* Header */}
            <div
              className="cursor-pointer"
              onClick={() =>
                setExpandedPlaylist(
                  expandedPlaylist === playlist.id ? null : playlist.id
                )
              }
            >
              <h3 className="font-semibold text-lg truncate">
                {playlist.name}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {playlist.songs.length} song
                {playlist.songs.length !== 1 && "s"}
              </p>
            </div>

            {/* Songs */}
            {expandedPlaylist === playlist.id && (
              <div className="mt-4 space-y-2 max-h-56 overflow-y-auto pr-1">
                {playlist.songs.length > 0 ? (
                  playlist.songs.map((song) => (
                    <div
                      key={song._id}
                      className="flex justify-between items-center 
                                 bg-zinc-800/60 px-3 py-2 rounded-lg"
                    >
                      <button
                        onClick={() => playSong(song, "playlist", playlist.id)}
                        className="truncate text-left flex-1 hover:text-green-400"
                      >
                        {song.title}
                      </button>

                      <div className="flex gap-2 ml-3">
                        <button
                          onClick={() => handleLike(song)}
                          className={
                            isLiked(song._id)
                              ? "text-red-500"
                              : "text-gray-400"
                          }
                        >
                          <FaHeart size={14} />
                        </button>

                        <button
                          onClick={() =>
                            removeFromPlaylist(playlist.id, song._id)
                          }
                          className="text-gray-400 hover:text-red-500"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm text-center">
                    No songs yet
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => deletePlaylist(playlist.id)}
                className="flex-1 bg-red-600/90 hover:bg-red-600 
                           text-white py-2 rounded-xl text-sm font-medium"
              >
                🗑 Delete
              </button>

              <button
                onClick={() => openAddToPlaylistModal(null, playlist.id)}
                className="flex-1 bg-blue-600/90 hover:bg-blue-600 
                           text-white py-2 rounded-xl text-sm font-medium"
              >
                ➕ Add
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Player */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 w-full bg-zinc-900 
                        px-6 py-4 flex justify-between items-center">
          <div>
            <p className="font-semibold">{currentSong.title}</p>
            <p className="text-sm text-gray-400">
              {currentSong.artist}
            </p>
          </div>

          <div className="flex gap-6 items-center">
            <FaStepBackward
              className="cursor-pointer"
              onClick={playPreviousSong}
            />
            <button onClick={togglePlayPause}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <FaStepForward
              className="cursor-pointer"
              onClick={playNextSong}
            />
          </div>
        </div>
      )}
    </div>
  );
}
