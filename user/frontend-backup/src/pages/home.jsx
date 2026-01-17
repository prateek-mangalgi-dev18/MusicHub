import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useMusic } from "../context/musiccontext";
import { FaHeart, FaPlus, FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa';

const HomePage = () => {
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredSongs, setFilteredSongs] = useState([]);
  
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
    setError
  } = useMusic();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.get('http://localhost:1000/api/songs');
        setSongs(res.data);
        setFilteredSongs(res.data);
      } catch (err) {
        console.error("Error fetching songs:", err);
        setError("Failed to load songs. Please try again later.");
      }
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    if (search.trim()) {
      setFilteredSongs(
        songs.filter(song =>
          song?.title?.toLowerCase().includes(search.toLowerCase()) ||
          song?.artist?.toLowerCase().includes(search.toLowerCase()) ||
          song?.movie?.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredSongs(songs);
    }
  }, [search, songs]);

  const formatTime = (sec) => {
    if (isNaN(sec)) return "0:00";
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const isLiked = (songId) => {
    return likedSongs.some(song => song._id === songId);
  };

  const playNextSong = () => {
    if (!currentSong || !filteredSongs.length) return;
    
    const currentIndex = filteredSongs.findIndex(song => song._id === currentSong._id);
    if (currentIndex < filteredSongs.length - 1) {
      playSong(filteredSongs[currentIndex + 1]);
    }
  };

  const playPreviousSong = () => {
    if (!currentSong || !filteredSongs.length) return;
    
    const currentIndex = filteredSongs.findIndex(song => song._id === currentSong._id);
    if (currentIndex > 0) {
      playSong(filteredSongs[currentIndex - 1]);
    }
  };

  return (
    <div className="text-white px-6 py-8 bg-black min-h-screen relative pb-32">
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50">
          {error}
          <button onClick={() => setError(null)} className="ml-2 font-bold">
            ×
          </button>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center bg-zinc-800 p-3 rounded-full shadow-inner flex-grow mr-4">
          <input
            type="text"
            placeholder="Search songs by title, artist or movie..."
            className="bg-transparent outline-none text-white ml-2 flex-1 placeholder-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="text-sm bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full"
        >
          Logout
        </button>
      </div>

      {/* Autocomplete Suggestions */}
      {search.trim() && filteredSongs.length > 0 && (
        <div className="bg-zinc-800 p-3 rounded-xl mb-6 shadow-md">
          {filteredSongs.map(song => (
            <div
              key={song._id}
              className="text-white hover:text-green-400 cursor-pointer py-1"
              onClick={() => setSearch(song.title)}
            >
              {song.title} - {song.artist}
            </div>
          ))}
        </div>
      )}

      {/* Songs */}
      <h2 className="text-2xl font-bold mb-6">🎵 Featured Songs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSongs.length > 0 ? (
          filteredSongs.map((song) => (
            <div key={song._id} className="bg-zinc-900 p-4 rounded-2xl hover:bg-zinc-800 transition-all duration-200 shadow-lg group">
              <div className="relative w-full h-48 rounded-xl overflow-hidden mb-3">
                <img
                  src={song.coverImage || "https://unsplash.it/300/300?random"}
                  alt={song.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mb-3">
                <p className="font-semibold text-lg truncate">{song.title}</p>
                <p className="text-sm text-gray-400 truncate">🎤 {song.artist}</p>
                <p className="text-sm text-gray-400 truncate">🎬 {song.movie}</p>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => playSong(song)}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-full py-1 px-4"
                >
                  {currentSong?._id === song._id && isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <button
                  onClick={() => handleLike(song)}
                  className={`${isLiked(song._id) ? 'text-red-500' : 'text-gray-400'} hover:text-red-600`}
                >
                  <FaHeart />
                </button>
                <button
                  onClick={() => openAddToPlaylistModal(song)}
                  className="text-blue-400 hover:text-blue-500"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 col-span-full">No songs found.</p>
        )}
      </div>

      {/* Global Audio Player */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 w-full bg-zinc-900 text-white flex items-center px-4 py-3 justify-between shadow-inner z-50">
          <div className="flex items-center gap-4 w-1/3 overflow-hidden">
            <img
              src={currentSong.coverImage || "https://unsplash.it/100/100?random"}
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

export default HomePage;