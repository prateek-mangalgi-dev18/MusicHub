
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import axios from "axios";

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedSongs, setLikedSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [songToAdd, setSongToAdd] = useState(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const audioRef = useRef(typeof Audio !== "undefined" ? new Audio() : null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState(null);

  const fallbackImage = "https://unsplash.it/300/300?random";
  const API_BASE_URL = "http://localhost:1000";
  const UPLOADS_BASE_URL = `${API_BASE_URL}/uploads`;

  // Load initial data and fetch all songs
  useEffect(() => {
    const loadFromLocalStorage = () => {
      try {
        const storedLikes = localStorage.getItem("likedSongs");
        const storedPlaylists = localStorage.getItem("playlists");
        const storedCurrentSong = localStorage.getItem("currentSong");
        const storedIsPlaying = localStorage.getItem("isPlaying");

        if (storedLikes) {
          const parsedLikes = JSON.parse(storedLikes);
          if (Array.isArray(parsedLikes)) {
            const validSongs = parsedLikes
              .map(validateSong)
              .filter(song => song && song.fileUrl);
            setLikedSongs(validSongs);
          }
        }

        if (storedPlaylists) {
          const parsedPlaylists = JSON.parse(storedPlaylists);
          if (Array.isArray(parsedPlaylists)) {
            const cleanedPlaylists = parsedPlaylists.map(playlist => ({
              ...playlist,
              songs: playlist.songs
                .map(validateSong)
                .filter(song => song && song.fileUrl)
            })).filter(playlist => playlist.songs.length > 0);
            setPlaylists(cleanedPlaylists);
          }
        }

        if (storedCurrentSong) {
          const song = validateSong(JSON.parse(storedCurrentSong));
          if (song?.fileUrl) {
            setCurrentSong(song);
            if (storedIsPlaying === "true") {
              playSong(song).catch(console.error);
            }
          }
        }
      } catch (e) {
        console.error("Failed to load from localStorage:", e);
      }
    };

    const fetchSongs = async () => {
      try {
        const res = await axios.get('http://localhost:1000/api/songs');
        setAllSongs(res.data);
      } catch (err) {
        console.error("Error fetching songs:", err);
      }
    };

    loadFromLocalStorage();
    fetchSongs();
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
    localStorage.setItem("playlists", JSON.stringify(playlists));
    localStorage.setItem("currentSong", JSON.stringify(currentSong));
    localStorage.setItem("isPlaying", isPlaying.toString());
  }, [likedSongs, playlists, currentSong, isPlaying]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };

    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = () => {
      setError(`Audio error: ${audio.error?.message || 'Unknown error'}`);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Song validation
  const validateSong = (song) => {
    if (!song) return null;
    
    const validatedUrl = formatAudioUrl(song.fileUrl);
    if (!validatedUrl && song.fileUrl) {
      console.warn("Invalid song URL:", song.fileUrl);
    }

    return {
      _id: song._id || Math.random().toString(36).substring(2, 9),
      title: song.title || "Unknown Title",
      artist: song.artist || "Unknown Artist",
      movie: song.movie || "Unknown Movie",
      fileUrl: validatedUrl,
      coverImage: formatImageUrl(song.coverImage) || fallbackImage

    };
  };

  // Format audio URL
  const formatAudioUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/uploads/')) return `${API_BASE_URL}${url}`;
    if (url.startsWith('uploads/')) return `${UPLOADS_BASE_URL}/${url.replace('uploads/', '')}`;
    if (url.startsWith('/')) return `${API_BASE_URL}${url}`;
    try {
      return new URL(url, API_BASE_URL).toString();
    } catch {
      return null;
    }
  };

  const formatImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads/')) return `${API_BASE_URL}${url}`;
  if (url.startsWith('uploads/')) return `${UPLOADS_BASE_URL}/${url.replace('uploads/', '')}`;
  if (url.startsWith('/')) return `${API_BASE_URL}${url}`;
  try {
    return new URL(url, API_BASE_URL).toString();
  } catch {
    return null;
  }
};


  // Play song function
  const playSong = async (song) => {
    if (!song) {
      setError("No song provided to play");
      return false;
    }

    const validatedSong = validateSong(song);
    if (!validatedSong?.fileUrl) {
      setError("This song has no valid audio file");
      return false;
    }

    try {
      const audio = audioRef.current;
      if (!audio) throw new Error("Audio element not available");

      audio.pause();
      audio.currentTime = 0;
      audio.src = validatedSong.fileUrl;
      setCurrentSong(validatedSong);
      setError(null);

      await new Promise((resolve, reject) => {
        const onCanPlay = () => {
          audio.removeEventListener('canplaythrough', onCanPlay);
          resolve();
        };
        const onError = () => {
          audio.removeEventListener('error', onError);
          reject(new Error("Failed to load audio"));
        };
        audio.addEventListener('canplaythrough', onCanPlay);
        audio.addEventListener('error', onError);
      });

      await audio.play();
      setIsPlaying(true);
      return true;
    } catch (err) {
      setError(`Playback failed: ${err.message}`);
      setIsPlaying(false);
      return false;
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentSong) {
      setError("No song selected");
      return;
    }
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
  };

  const handleSeek = (value) => {
    if (!audioRef.current?.duration) {
      setError("Cannot seek - no song loaded");
      return;
    }
    audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
  };

  const handleLike = (song) => {
    if (!song) {
      setError("No song provided to like");
      return;
    }

    const validatedSong = validateSong(song);
    if (!validatedSong?.fileUrl) {
      setError("Cannot like song - no valid audio file");
      return;
    }

    setLikedSongs(prev => {
      const exists = prev.some(s => s._id === validatedSong._id);
      return exists 
        ? prev.filter(s => s._id !== validatedSong._id)
        : [...prev, validatedSong];
    });
  };

  const openAddToPlaylistModal = (song = null, playlistId = null) => {
    setSongToAdd(song);
    setSelectedPlaylistId(playlistId);
    setSelectedSongs(song ? [song] : []);
    setShowPlaylistModal(true);
  };

  const toggleSongSelection = (song) => {
    setSelectedSongs(prev => 
      prev.some(s => s._id === song._id)
        ? prev.filter(s => s._id !== song._id)
        : [...prev, song]
    );
  };

  const createNewPlaylist = () => {
    if (!newPlaylistName.trim()) {
      setError("Playlist name cannot be empty");
      return;
    }
    if (playlists.some(p => p.name === newPlaylistName)) {
      setError("Playlist with this name already exists");
      return;
    }

    const newPlaylist = {
      id: Date.now().toString(),
      name: newPlaylistName.trim(),
      songs: selectedSongs.length > 0 
        ? selectedSongs.map(validateSong).filter(song => song && song.fileUrl)
        : []
    };

    setPlaylists(prev => [...prev, newPlaylist]);
    setNewPlaylistName("");
    setShowPlaylistModal(false);
    setSelectedSongs([]);
  };

  const addToPlaylist = (playlistId, songsToAdd) => {
    if (!songsToAdd || songsToAdd.length === 0) {
      setError("No songs selected to add");
      return;
    }

    setPlaylists(prev => 
      prev.map(playlist => 
        playlist.id === playlistId
          ? {
              ...playlist,
              songs: [
                ...playlist.songs,
                ...songsToAdd
                  .map(validateSong)
                  .filter(song => song && song.fileUrl)
                  .filter(newSong => !playlist.songs.some(s => s._id === newSong._id))
              ]
            }
          : playlist
      )
    );
    setShowPlaylistModal(false);
    setSelectedSongs([]);
  };

  const removeFromPlaylist = (playlistId, songId) => {
    setPlaylists(prev =>
      prev.map(playlist =>
        playlist.id === playlistId
          ? {
              ...playlist,
              songs: playlist.songs.filter(song => song._id !== songId)
            }
          : playlist
      )
    );
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
  };

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        playSong,
        isPlaying,
        togglePlayPause,
        likedSongs,
        playlists,
        allSongs,
        handleLike,
        openAddToPlaylistModal,
        addToPlaylist,
        removeFromPlaylist,
        deletePlaylist,
        createNewPlaylist,
        newPlaylistName,
        setNewPlaylistName,
        showPlaylistModal,
        setShowPlaylistModal,
        selectedPlaylistId,
        selectedSongs,
        toggleSongSelection,
        fallbackImage,
        progress,
        duration,
        currentTime,
        handleSeek,
        error,
        setError,
        audioRef,
        validateSong
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
};

