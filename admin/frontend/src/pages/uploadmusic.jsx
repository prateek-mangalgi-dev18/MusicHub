
import React, { useState, useRef } from 'react';
import axios from 'axios';

const UploadMusic = () => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [movie, setMovie] = useState('');
  const [file, setFile] = useState(null);         // Audio file
  const [imageFile, setImageFile] = useState(null); // Cover image
  const [message, setMessage] = useState('');
  const fileInputRef = useRef();
  const imageInputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !imageFile || !title || !artist) {
      return setMessage("⚠️ Please fill in all required fields.");
    }

    const formData = new FormData();
    formData.append("file", file); // audio
    formData.append("coverImage", imageFile); // image
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("movie", movie);

    try {
      const res = await axios.post("/admin/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      });

      setMessage('✅ Upload successful!');

      // Reset form
      setTitle('');
      setArtist('');
      setMovie('');
      setFile(null);
      setImageFile(null);
      fileInputRef.current.value = null;
      imageInputRef.current.value = null;

    } catch (err) {
      console.error(err);
      setMessage('❌ Upload failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border shadow rounded bg-white">
      <h2 className="text-xl font-bold mb-4">Upload Music</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Movie"
          value={movie}
          onChange={(e) => setMovie(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <label className="block mb-1 font-medium">Audio File</label>
        <input
          type="file"
          accept=".mp3,.wav"
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileInputRef}
          className="w-full mb-4"
          required
        />
        {file && <p className="text-sm text-gray-600 mb-2">Selected: {file.name}</p>}

        <label className="block mb-1 font-medium">Cover Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          ref={imageInputRef}
          className="w-full mb-4"
          required
        />
        {imageFile && <p className="text-sm text-gray-600 mb-2">Selected: {imageFile.name}</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload
        </button>

        {message && <p className="mt-3 text-sm font-medium">{message}</p>}
      </form>
    </div>
  );
};

export default UploadMusic;
