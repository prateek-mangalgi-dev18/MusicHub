import React, { useState } from "react";
import { useMusic } from "../context/musiccontext";
import { FaPlay, FaPause, FaTrash, FaHeart, FaPlus, FaStepForward, FaStepBackward } from "react-icons/fa";

const Playlist = () => {
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
    fallbackImage,
    progress,
    duration,
    currentTime,
    handleSeek,
    likedSongs
  } = useMusic();
  
  const [search, setSearch] = useState("");
  const [expandedPlaylist, setExpandedPlaylist] = useState(null);

  const filteredPlaylists = search.trim()
    ? playlists.filter(p =>
        p?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : playlists;

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const isLiked = (songId) => {
    return likedSongs.some(song => song._id === songId);
  };

  const playNextSong = () => {
    if (!currentSong || !playlists.length) return;
    
    for (const playlist of playlists) {
      const songIndex = playlist.songs.findIndex(song => song._id === currentSong._id);
      if (songIndex !== -1 && songIndex < playlist.songs.length - 1) {
        playSong(playlist.songs[songIndex + 1]);
        return;
      }
    }
  };

  const playPreviousSong = () => {
    if (!currentSong || !playlists.length) return;
    
    for (const playlist of playlists) {
      const songIndex = playlist.songs.findIndex(song => song._id === currentSong._id);
      if (songIndex !== -1 && songIndex > 0) {
        playSong(playlist.songs[songIndex - 1]);
        return;
      }
    }
  };

  const togglePlaylistExpansion = (playlistId) => {
    setExpandedPlaylist(expandedPlaylist === playlistId ? null : playlistId);
  };

  return (
    <div className="text-white px-6 py-8 bg-black min-h-screen pb-32">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center bg-zinc-800 p-3 rounded-full flex-grow mr-4">
          <input
            type="text"
            placeholder="Search playlists..."
            className="bg-transparent outline-none text-white ml-2 flex-1 placeholder-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">🎶 Your Playlists</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPlaylists.length > 0 ? (
          filteredPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-zinc-900 p-4 rounded-2xl hover:bg-zinc-800 transition-all duration-200 shadow-lg group"
            >
              <div 
                className="flex justify-between items-center mb-3 cursor-pointer"
                onClick={() => togglePlaylistExpansion(playlist.id)}
              >
                <p className="font-semibold text-lg truncate">{playlist.name}</p>
                <p className="text-sm text-gray-400">{playlist.songs?.length || 0} songs</p>
              </div>
              
              {expandedPlaylist === playlist.id && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {playlist.songs?.length > 0 ? (
                    playlist.songs.map((song) => (
                      <div key={song._id} className="flex items-center justify-between p-2 hover:bg-zinc-800 rounded">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <button
                            onClick={() => playSong(song)}
                            className="text-sm truncate hover:text-green-400 flex-1 text-left"
                          >
                            {song.title}
                          </button>
                          {currentSong?._id === song._id && isPlaying && (
                            <span className="text-green-400">▶️</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleLike(song)}
                            className={`${isLiked(song._id) ? 'text-red-500' : 'text-gray-400'} hover:text-red-600`}
                          >
                            <FaHeart size={14} />
                          </button>
                          <button
                            onClick={() => removeFromPlaylist(playlist.id, song._id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-center py-2">No songs in this playlist</p>
                  )}
                </div>
              )}

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => deletePlaylist(playlist.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-full py-1 flex items-center justify-center gap-2"
                >
                  <FaTrash /> Delete
                </button>
                <button
                  onClick={() => openAddToPlaylistModal(null, playlist.id)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full py-1 flex items-center justify-center gap-2"
                >
                  <FaPlus /> Add Songs
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 col-span-full">No playlists found.</p>
        )}
      </div>

      {/* Audio Player */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 w-full bg-zinc-900 text-white flex items-center px-4 py-3 justify-between shadow-inner z-50">
          <div className="flex items-center gap-4 w-1/3 overflow-hidden">
            <img
              src={currentSong.coverImage || fallbackImage}
              alt="cover"
              className="w-12 h-12 rounded-md"
            />
            <div className="truncate">
              <p className="font-semibold truncate">{currentSong.title}</p>
              <p className="text-sm text-gray-400 truncate">{currentSong.artist}</p>
            </div>
          </div>

          <div className="flex flex-col items-center w-1/3">
            <div className="flex items-center gap-6 mb-2">
              <button onClick={playPreviousSong}><FaStepBackward size={20} /></button>
              <button onClick={togglePlayPause}>
                {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
              </button>
              <button onClick={playNextSong}><FaStepForward size={20} /></button>
            </div>
            <input
              type="range"
              value={progress}
              onChange={(e) => handleSeek(e.target.value)}
              className="w-full h-1 rounded bg-gray-700"
            />
            <div className="text-xs text-gray-400 flex justify-between w-full mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="w-1/3 flex justify-end gap-4">
            <button 
              onClick={() => handleLike(currentSong)} 
              className={`hover:text-pink-500 flex items-center gap-1 ${isLiked(currentSong._id) ? 'text-red-500' : 'text-gray-400'}`}
            >
              <FaHeart /> Like
            </button>
            <button 
              onClick={() => openAddToPlaylistModal(currentSong)} 
              className="hover:text-green-400 flex items-center gap-1"
            >
              <FaPlus /> Playlist
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Playlist;

