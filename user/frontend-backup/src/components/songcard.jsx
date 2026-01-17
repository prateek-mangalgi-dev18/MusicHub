import React from 'react';
import { useMusic } from '../musiccontext';

const SongCard = ({ song }) => {
  const { playSong, likedSongs, handleLike } = useMusic();
  const isLiked = likedSongs.some(s => s._id === song._id);

  const localFallbackImage = '/default-song.png';

  const handleImageError = (e) => {
    e.target.src = localFallbackImage;
    e.target.onerror = null;
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    playSong({
      _id: song._id,
      title: song.title || "Unknown Title",
      artist: song.artist || "Unknown Artist",
      movie: song.movie || "Unknown Movie",
      fileUrl: song.fileUrl,
      albumImage: song.albumImage || localFallbackImage
    });
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    handleLike({
      _id: song._id,
      title: song.title || "Unknown Title",
      artist: song.artist || "Unknown Artist",
      movie: song.movie || "Unknown Movie",
      fileUrl: song.fileUrl,
      albumImage: song.albumImage || localFallbackImage
    });
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-white w-48 hover:bg-gray-700 transition-colors">
      <div className="w-full h-48 bg-gray-700 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
        <img
          src={song.coverImage || fallbackImage}
          alt={song.title || "Song cover"}
          className="w-32 h-32 object-cover rounded-md"
          onError={handleImageError}
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-1 truncate">{song.title || "Unknown Title"}</h2>
        <h4 className="text-gray-400 text-sm mb-2 truncate">{song.artist || "Unknown Artist"}</h4>
      </div>

      <button
        onClick={handlePlayClick}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full w-full"
      >
        ▶️ Play
      </button>

      <button
        onClick={handleLikeClick}
        className={`mt-2 w-full p-2 rounded-full ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
      >
        {isLiked ? '❤️ Liked' : '🤍 Like'}
      </button>
    </div>
  );
};

export default SongCard;