
import React, { useState } from "react";
import { useMusic } from "../context/musiccontext";
import { FaTimes, FaCheck, FaPlus, FaMusic } from "react-icons/fa";

const AddToPlaylistModal = () => {
  const {
    showPlaylistModal,
    setShowPlaylistModal,
    playlists,
    addToPlaylist,
    selectedPlaylistId,
    allSongs,
    selectedSongs,
    toggleSongSelection,
    createNewPlaylist,
    newPlaylistName,
    setNewPlaylistName,
    error,
    setError,
    setSelectedPlaylistId
  } = useMusic();

  const [searchTerm, setSearchTerm] = useState("");
  const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);
  
  const filteredSongs = searchTerm
    ? allSongs.filter(song =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase()))
    : allSongs;

  const handleAddToPlaylist = (playlistId) => {
    if (selectedSongs.length === 0) {
      setError("Please select at least one song");
      return;
    }
    addToPlaylist(playlistId, selectedSongs);
  };

  if (!showPlaylistModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-md max-h-[90vh] flex flex-col border border-zinc-700 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">
            {selectedPlaylistId 
              ? "Add Songs to Playlist" 
              : showNewPlaylistInput
                ? "Create New Playlist"
                : "Add to Playlist"}
          </h3>
          <button 
            onClick={() => {
              setShowPlaylistModal(false);
              setShowNewPlaylistInput(false);
              setError(null);
            }}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded mb-4 text-sm flex items-center gap-2">
            <FaTimes className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {selectedPlaylistId ? (
          <>
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Search songs..."
                className="w-full bg-zinc-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <FaTimes size={14} />
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto mb-4 pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800">
              {filteredSongs.length > 0 ? (
                filteredSongs.map(song => (
                  <div 
                    key={song._id}
                    className={`p-3 hover:bg-zinc-800 rounded-lg cursor-pointer flex justify-between items-center transition-colors mb-2 ${
                      selectedSongs.some(s => s._id === song._id) ? 'bg-zinc-700 border-l-4 border-purple-500' : ''
                    }`}
                    onClick={() => toggleSongSelection(song)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-zinc-700 p-2 rounded-full">
                        <FaMusic className="text-purple-400" size={14} />
                      </div>
                      <div>
                        <p className="font-medium text-white">{song.title}</p>
                        <p className="text-sm text-gray-300">{song.artist}</p>
                      </div>
                    </div>
                    {selectedSongs.some(s => s._id === song._id) && (
                      <div className="bg-purple-500 rounded-full p-1">
                        <FaCheck className="text-white" size={12} />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <FaMusic size={24} className="mb-2" />
                  <p>No songs found</p>
                </div>
              )}
            </div>

            <button
              onClick={() => handleAddToPlaylist(selectedPlaylistId)}
              className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                selectedSongs.length > 0 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-zinc-700 text-gray-400 cursor-not-allowed'
              }`}
              disabled={selectedSongs.length === 0}
            >
              <FaPlus /> 
              {selectedSongs.length > 0 
                ? `Add ${selectedSongs.length} ${selectedSongs.length === 1 ? 'Song' : 'Songs'}`
                : 'Add Songs'}
            </button>
          </>
        ) : showNewPlaylistInput ? (
          <>
            <div className="mb-4">
              <input
                type="text"
                placeholder="New playlist name"
                className="w-full bg-zinc-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
              />
            </div>
            <button
              onClick={createNewPlaylist}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
            >
              Create Playlist
            </button>
          </>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto mb-4 pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800">
              {playlists.length > 0 ? (
                playlists.map(playlist => (
                  <div 
                    key={playlist.id}
                    className="p-3 hover:bg-zinc-800 rounded-lg cursor-pointer flex justify-between items-center transition-colors mb-2 group"
                    onClick={() => {
                      if (selectedSongs.length > 0) {
                        handleAddToPlaylist(playlist.id);
                      } else {
                        setSelectedPlaylistId(playlist.id);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-zinc-700 p-2 rounded-full group-hover:bg-blue-500 transition-colors">
                        <FaMusic className="text-blue-400 group-hover:text-white" size={14} />
                      </div>
                      <span className="font-medium text-white">{playlist.name}</span>
                    </div>
                    <span className="text-gray-400 text-sm bg-zinc-800 px-2 py-1 rounded-full">
                      {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <FaMusic size={24} className="mb-2" />
                  <p>No playlists yet</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowNewPlaylistInput(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <FaPlus /> Create New Playlist
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AddToPlaylistModal;