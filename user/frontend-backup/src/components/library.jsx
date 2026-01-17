import React, { useEffect, useState } from 'react';
import { fetchSongs } from '../api/musicapi';

import { FaHeart, FaRegHeart, FaPlus } from 'react-icons/fa';

const Library = () => {
  const [artists, setArtists] = useState({});
  const [likedSongs, setLikedSongs] = useState({});
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    const getSongs = async () => {
      const res = await fetchSongs();
      const grouped = res.data.reduce((acc, song) => {
        acc[song.artist] = [...(acc[song.artist] || []), song];
        return acc;
      }, {});
      setArtists(grouped);
    };
    getSongs();
  }, []);

  const userId = localStorage.getItem('userId'); // or decode token


  const addToPlaylist = (song) => {
    if (!playlist.find(s => s._id === song._id)) {
      setPlaylist(prev => [...prev, song]);
      alert(`"${song.title}" added to your playlist!`);
    } else {
      alert(`"${song.title}" is already in your playlist.`);
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Discover Artists</h2>
      {Object.entries(artists).map(([artist, songs]) => (
        <div key={artist} className="mb-6">
          <h3 className="text-xl font-semibold mb-2">{artist}</h3>
          <div className="grid md:grid-cols-3 gap-3">
            {songs.map(song => (
              <div key={song._id} className="bg-gray-800 p-4 rounded shadow relative">
                <p className="font-semibold">{song.title}</p>
                <audio controls className="w-full mt-2">
                  <source src={song.fileUrl} type="audio/mp3" />
                </audio>

                <div className="flex justify-end gap-3 mt-3">
                  {/* Like Button */}
                  <button onClick={() => toggleLike(song._id)}>
                    {likedSongs[song._id] ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart className="text-white hover:text-red-400" />
                    )}
                  </button>

                  {/* Add to Playlist */}
                  <button onClick={() => addToPlaylist(song)}>
                    <FaPlus className="text-white hover:text-green-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Library;
