import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageSongs = () => {
  const [songs, setSongs] = useState([]);
  const [message, setMessage] = useState('');

  const fetchSongs = async () => {
    try {
      const res = await axios.get('https://musichub-admin-x6wd.onrender.com/admin/songs', {
        withCredentials: true,
      });
      setSongs(res.data.songs || []);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://musichub-admin-x6wd.onrender.com/admin/songs/${id}`, {
        withCredentials: true,
      });
      setMessage('Song deleted successfully');
      fetchSongs();
    } catch (error) {
      console.error('Error deleting song:', error);
      setMessage('Failed to delete song');
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 border shadow rounded">
      <h2 className="text-xl font-bold mb-4">Manage Songs</h2>
      {message && <p className="text-sm text-green-600 mb-4">{message}</p>}
      <ul className="space-y-4">
        {songs.map((song) => (
          <li key={song._id} className="bg-gray-800 p-4 rounded flex justify-between items-center text-white">
            <div>
              <p className="font-semibold">{song.title} - {song.artist}</p>
              <p className="text-sm text-gray-400">{song.movie}</p>
            </div>
            <button
              onClick={() => handleDelete(song._id)}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageSongs;
