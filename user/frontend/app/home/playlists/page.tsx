"use client";

import { useState } from "react";
import { useMusic } from "@/context/musiccontext";
import TopBar from "@/components/TopBar";
import {
  FaPlay,
  FaPause,
  FaTrash,
  FaHeart,
  FaPlus,
} from "react-icons/fa";
import { ListMusic, Plus, Trash2, Music2 } from "lucide-react";

export default function PlaylistsPage() {
  const {
    playlists,
    deletePlaylist,
    playSong,
    currentSong,
    isPlaying,
    handleLike,
    openAddToPlaylistModal,
    removeFromPlaylist,
    likedSongs,
    loadingUser
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

  return (
    <div className="flex flex-col w-full h-screen overflow-y-auto bg-slate-50">
      <TopBar />

      <div className="p-10 pb-32 max-w-[1600px] mx-auto w-full">
        {/* Playlists Header */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8 border-b border-zinc-200 pb-4">
            <h2 className="text-3xl font-black tracking-tight text-black uppercase italic">
              Your Playlists
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-zinc-400 text-xs font-black uppercase tracking-widest">
                {playlists.length} Collections
              </div>
              <button
                onClick={() => openAddToPlaylistModal(null, null)}
                className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-full text-[10px] font-black uppercase shadow-lg hover:scale-105 transition-all active:scale-95"
              >
                <Plus className="w-3 h-3" />
                Create New
              </button>
            </div>
          </div>

          {/* Search Local */}
          <div className="mb-10 relative max-w-md">
            <input
              type="text"
              placeholder="Filter collections..."
              className="w-full bg-white border border-zinc-200 px-6 py-3.5 rounded-2xl text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-accent/20 transition-all text-black"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Playlist Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredPlaylists.length > 0 ? (
              filteredPlaylists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="bg-white border border-zinc-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className="cursor-pointer flex-grow"
                      onClick={() => setExpandedPlaylist(expandedPlaylist === playlist.id ? null : playlist.id)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-400 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                          <ListMusic className="w-5 h-5" />
                        </div>
                        <h3 className="font-black text-xl text-black uppercase italic tracking-tight group-hover:text-accent transition-colors">
                          {playlist.name}
                        </h3>
                      </div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        {playlist.songs.length} Tracks In Collection
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => deletePlaylist(playlist.id)}
                        className="p-3 rounded-full hover:bg-red-50 text-zinc-300 hover:text-red-500 transition-all"
                        title="Delete Playlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Songs Preview / Expanded List */}
                  <div className={`space-y-2 transition-all duration-300 ${expandedPlaylist === playlist.id ? 'max-h-[400px] overflow-y-auto' : 'max-h-0 overflow-hidden'}`}>
                    <div className="pt-2 border-t border-zinc-50">
                      {playlist.songs.length > 0 ? (
                        playlist.songs.map((song) => (
                          <div
                            key={song._id}
                            className="flex justify-between items-center bg-zinc-50/50 hover:bg-zinc-50 p-3 rounded-2xl transition-colors group/song"
                          >
                            <div className="flex items-center gap-3 truncate">
                              <button
                                onClick={() => playSong(song, "playlist", playlist.id)}
                                className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-black hover:bg-black hover:text-white transition-all active:scale-90"
                              >
                                {currentSong?._id === song._id && isPlaying ? <FaPause size={10} /> : <FaPlay size={10} className="ml-0.5" />}
                              </button>
                              <div className="truncate">
                                <p className="font-black text-xs text-black uppercase truncate tracking-tight">{song.title}</p>
                                <p className="text-[9px] font-bold text-zinc-400 uppercase truncate tracking-widest">{song.artist}</p>
                              </div>
                            </div>

                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => handleLike(song)}
                                className={`p-2 transition-colors ${isLiked(song._id) ? "text-accent" : "text-zinc-200 hover:text-accent"}`}
                              >
                                <FaHeart size={12} />
                              </button>
                              <button
                                onClick={() => removeFromPlaylist(playlist.id, song._id)}
                                className="p-2 text-zinc-200 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-zinc-300 text-[10px] font-black uppercase text-center py-8 tracking-[0.2em]">
                          This collection is empty
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setExpandedPlaylist(expandedPlaylist === playlist.id ? null : playlist.id)}
                      className="flex-1 px-4 py-3 rounded-2xl bg-zinc-100 text-zinc-500 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95"
                    >
                      {expandedPlaylist === playlist.id ? 'Collapse' : 'View Tracks'}
                    </button>
                    <button
                      onClick={() => openAddToPlaylistModal(null, playlist.id)}
                      className="flex items-center justify-center gap-2 flex-[0.5] px-4 py-3 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-md"
                    >
                      <Plus className="w-3 h-3" />
                      Add
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-200 mb-6">
                  <Music2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-black uppercase italic mb-2">No playlists found</h3>
                <p className="text-zinc-400 font-bold text-sm">Create your first collection to keep your music organized.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
