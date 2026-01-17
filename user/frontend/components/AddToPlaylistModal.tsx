"use client";

import { useEffect, useState } from "react";
import { FaTimes, FaCheck } from "react-icons/fa";
import { useMusic, Song } from "@/context/musiccontext";

export default function AddToPlaylistModal() {
  const {
    showPlaylistModal,
    setShowPlaylistModal,
    playlists,
    selectedPlaylistId,
    setSelectedPlaylistId,
    allSongs,
    selectedSongs,
    toggleSongSelection,
    addToPlaylist,
    createNewPlaylist,
    newPlaylistName,
    setNewPlaylistName,
  } = useMusic();

  const [step, setStep] = useState<"playlist" | "songs" | "create">("playlist");

  /* 🔥 RESET STEP EVERY TIME MODAL OPENS */
  useEffect(() => {
    if (showPlaylistModal) {
      setStep(selectedPlaylistId ? "songs" : "playlist");
    }
  }, [showPlaylistModal, selectedPlaylistId]);

  if (!showPlaylistModal) return null;

  const closeModal = () => {
    setShowPlaylistModal(false);
    setSelectedPlaylistId(null);
    setStep("playlist");
    setNewPlaylistName("");
  };

  const songs: Song[] = Array.isArray(allSongs) ? allSongs : [];

  const activePlaylist = playlists.find(
    (p) => p.id === selectedPlaylistId
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="bg-zinc-900 w-full max-w-md rounded-xl p-6 text-white">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            {step === "playlist" && "Select Playlist"}
            {step === "songs" && "Select Songs"}
            {step === "create" && "Create Playlist"}
          </h2>
          <button onClick={closeModal} className="text-gray-400 hover:text-white">
            <FaTimes />
          </button>
        </div>

        {/* STEP 1: PLAYLIST LIST */}
        {step === "playlist" && (
          <>
            {playlists.length === 0 ? (
              <p className="text-gray-400 text-center mb-4">
                No playlists yet
              </p>
            ) : (
              <div className="space-y-2 mb-4">
                {playlists.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedPlaylistId(p.id);
                      setStep("songs");
                    }}
                    className="p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 cursor-pointer flex justify-between"
                  >
                    <span>{p.name}</span>
                    <span className="text-sm text-gray-400">
                      {p.songs.length} songs
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setStep("create")}
              className="w-full bg-blue-600 py-2 rounded-lg"
            >
              + Create New Playlist
            </button>
          </>
        )}

        {/* STEP 2: SONG SELECTION */}
        {step === "songs" && selectedPlaylistId && (
          <>
            <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
              {songs.map((song) => {
                const alreadyInPlaylist = activePlaylist?.songs.some(
                  (s) => s._id === song._id
                );

                const selected = selectedSongs.some(
                  (s) => s._id === song._id
                );

                return (
                  <div
                    key={song._id}
                    onClick={() => {
                      if (!alreadyInPlaylist) {
                        toggleSongSelection(song);
                      }
                    }}
                    className={`p-3 rounded-lg cursor-pointer flex justify-between items-center ${
                      alreadyInPlaylist
                        ? "bg-zinc-800 opacity-50 cursor-not-allowed"
                        : selected
                        ? "bg-purple-600"
                        : "bg-zinc-800 hover:bg-zinc-700"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium">{song.title}</p>
                      <p className="text-xs text-gray-300">
                        {song.artist}
                      </p>
                      {alreadyInPlaylist && (
                        <p className="text-xs text-green-400">
                          ✓ Already in playlist
                        </p>
                      )}
                    </div>

                    {selected && <FaCheck />}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() =>
                addToPlaylist(selectedPlaylistId, selectedSongs)
              }
              disabled={selectedSongs.length === 0}
              className="w-full bg-purple-600 py-2 rounded-lg disabled:opacity-50"
            >
              Add {selectedSongs.length} song(s)
            </button>
          </>
        )}

        {/* STEP 3: CREATE PLAYLIST */}
        {step === "create" && (
          <>
            <input
              type="text"
              placeholder="Playlist name"
              className="w-full p-2 mb-3 rounded bg-zinc-800 text-white"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
            />

            <button
              onClick={() => {
                createNewPlaylist();
                setStep("playlist");
              }}
              className="w-full bg-blue-600 py-2 rounded-lg"
            >
              Create Playlist
            </button>
          </>
        )}
      </div>
    </div>
  );
}


