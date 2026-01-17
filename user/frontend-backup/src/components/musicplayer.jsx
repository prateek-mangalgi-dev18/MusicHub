

import React, { useEffect, useState } from 'react';
import { FaPlay, FaPause, FaForward, FaBackward, FaHeart, FaPlus } from 'react-icons/fa';
import { useMusic } from '../context/musiccontext'; // Adjust the path if needed

const MusicPlayer = () => {
  const {
    currentSong,
    isPlaying,
    setIsPlaying,
    handleLike,
    handleAddToPlaylist,
    audioElement,
    fallbackImage,
  } = useMusic();

  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  

  useEffect(() => {
    if (audioElement) {
      audioElement.volume = volume;
    }
  }, [volume, audioElement]);

  useEffect(() => {
    if (!audioElement) return;

    const updateProgress = () => {
      if (audioElement.duration) {
        setProgress((audioElement.currentTime / audioElement.duration) * 100);
      }
    };

    audioElement.addEventListener('timeupdate', updateProgress);

    return () => {
      audioElement.removeEventListener('timeupdate', updateProgress);
    };
  }, [audioElement]);

  const togglePlay = () => {
    if (!audioElement) return;
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play().catch((err) => console.error('Play error:', err));
    }
  };

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * audioElement.duration;
    audioElement.currentTime = newTime;
    setProgress(e.target.value);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  if (!currentSong) return null;

  return (
    <div className="w-full bg-gray-900 text-white px-4 py-2 flex items-center justify-between shadow-md">
      {/* Song Info */}
      <div className="flex items-center gap-3">
        <img
          src={song.coverImage || fallbackImage}
          alt="cover"
          className="w-12 h-12 rounded-md object-cover"
        />
        <div>
          <h3 className="text-sm font-semibold">{currentSong.title}</h3>
          <p className="text-xs text-gray-400">{currentSong.artist}</p>
        </div>
      </div>

      {/* Controls + Seekbar */}
      <div className="flex flex-col items-center w-1/2">
        <div className="flex items-center gap-4 mb-1">
          <button><FaBackward /></button> {/* Optional: Add skip functionality */}
          <button onClick={togglePlay}>{isPlaying ? <FaPause /> : <FaPlay />}</button>
          <button><FaForward /></button> {/* Optional: Add skip functionality */}
        </div>
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-blue-400">
            {formatTime(audioElement?.currentTime)}
          </span>
          <input
            type="range"
            value={progress}
            onChange={handleSeek}
            className="w-full accent-blue-500"
          />
          <span className="text-xs text-blue-400">
            {formatTime(audioElement?.duration)}
          </span>
        </div>
      </div>

      {/* Volume and Actions */}
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="accent-blue-500 w-24"
        />
        <button onClick={() => handleLike(currentSong)} className="flex items-center gap-1 text-sm">
          <FaHeart /> Like
        </button>
        <button onClick={() => handleAddToPlaylist(currentSong)} className="flex items-center gap-1 text-sm">
          <FaPlus /> Playlist
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
