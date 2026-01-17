"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import axios from "axios";

/* ================= TYPES ================= */

export interface Song {
  _id: string;
  title: string;
  artist: string;
  movie?: string;
  fileUrl: string;
  coverImage: string;
}

interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

interface MusicContextType {
  /* player */
  currentSong: Song | null;
  isPlaying: boolean;
  playSong: (song: Song, queue?: Song[]) => Promise<void>;
  playNext: () => void;
  playPrevious: () => void;
  togglePlayPause: () => void;
  handleSeek: (value: number) => void;

  progress: number;
  currentTime: number;
  duration: number;

  /* data */
  allSongs: Song[];
  likedSongs: Song[];
  playlists: Playlist[];

  /* playlist ops */
  openAddToPlaylistModal: (song?: Song | null, playlistId?: string | null) => void;
  addToPlaylist: (playlistId: string, songs: Song[]) => void;
  removeFromPlaylist: (playlistId: string, songId: string) => void;
  deletePlaylist: (playlistId: string) => void;
  createNewPlaylist: () => void;

  /* modal state */
  showPlaylistModal: boolean;
  setShowPlaylistModal: (v: boolean) => void;
  selectedPlaylistId: string | null;
  setSelectedPlaylistId: (v: string | null) => void;
  selectedSongs: Song[];
  toggleSongSelection: (song: Song) => void;
  newPlaylistName: string;
  setNewPlaylistName: (v: string) => void;

  /* misc */
  handleLike: (song: Song) => void;
  fallbackImage: string;
}

const MusicContext = createContext<MusicContextType | null>(null);

/* ================= PROVIDER ================= */

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(
    typeof Audio !== "undefined" ? new Audio() : null
  );

  const API = process.env.NEXT_PUBLIC_API_URL!;
  const fallbackImage = "https://unsplash.it/300/300?random";

  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [queue, setQueue] = useState<Song[]>([]);
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  /* ================= LOAD SONGS ================= */

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const res = await axios.get<Song[]>(`${API}/api/songs`);
        setAllSongs(res.data);
      } catch (e) {
        console.error("Failed to load songs", e);
      }
    };
    loadSongs();
  }, [API]);

  /* ================= AUDIO EVENTS ================= */

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => playNext();
    const onTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const onLoaded = () => setDuration(audio.duration || 0);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [queue, currentSong]);

  /* ================= PLAYER ================= */

  const playSong = async (song: Song, newQueue?: Song[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (newQueue) setQueue(newQueue);

    if (currentSong?._id !== song._id) {
      audio.src = song.fileUrl;
      setCurrentSong(song);
      await audio.play();
    } else {
      audio.play();
    }
  };

  const playNext = () => {
    if (!currentSong || queue.length === 0) return;
    const i = queue.findIndex((s) => s._id === currentSong._id);
    if (i !== -1 && i < queue.length - 1) playSong(queue[i + 1]);
  };

  const playPrevious = () => {
    if (!currentSong || queue.length === 0) return;
    const i = queue.findIndex((s) => s._id === currentSong._id);
    if (i > 0) playSong(queue[i - 1]);
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.paused ? audio.play() : audio.pause();
  };

  const handleSeek = (v: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = (v / 100) * audio.duration;
  };

  /* ================= PLAYLIST ================= */

  const openAddToPlaylistModal = (
  song?: Song | null,
  playlistId?: string | null
) => {
  
  setSelectedSongs(song ? [song] : []);
  setSelectedPlaylistId(playlistId ?? null);
  setShowPlaylistModal(true);
};


  const toggleSongSelection = (song: Song) => {
    setSelectedSongs((p) =>
      p.some((s) => s._id === song._id)
        ? p.filter((s) => s._id !== song._id)
        : [...p, song]
    );
  };

  const createNewPlaylist = () => {
    if (!newPlaylistName.trim()) return;
    setPlaylists((p) => [
      ...p,
      { id: Date.now().toString(), name: newPlaylistName, songs: [] },
    ]);
    setNewPlaylistName("");
  };

  const addToPlaylist = (playlistId: string, songs: Song[]) => {
    setPlaylists((p) =>
      p.map((pl) =>
        pl.id === playlistId
          ? {
              ...pl,
              songs: [
                ...pl.songs,
                ...songs.filter((s) => !pl.songs.some((x) => x._id === s._id)),
              ],
            }
          : pl
      )
    );
    setShowPlaylistModal(false);
  };

  const removeFromPlaylist = (pid: string, sid: string) => {
    setPlaylists((p) =>
      p.map((pl) =>
        pl.id === pid
          ? { ...pl, songs: pl.songs.filter((s) => s._id !== sid) }
          : pl
      )
    );
  };

  const deletePlaylist = (pid: string) => {
    setPlaylists((p) => p.filter((pl) => pl.id !== pid));
  };

  const handleLike = (song: Song) => {
    setLikedSongs((p) =>
      p.some((s) => s._id === song._id)
        ? p.filter((s) => s._id !== song._id)
        : [...p, song]
    );
  };

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        isPlaying,
        playSong,
        playNext,
        playPrevious,
        togglePlayPause,
        handleSeek,

        progress,
        currentTime,
        duration,

        allSongs,
        likedSongs,
        playlists,

        openAddToPlaylistModal,
        addToPlaylist,
        removeFromPlaylist,
        deletePlaylist,
        createNewPlaylist,

        showPlaylistModal,
        setShowPlaylistModal,
        selectedPlaylistId,
        setSelectedPlaylistId,
        selectedSongs,
        toggleSongSelection,
        newPlaylistName,
        setNewPlaylistName,

        handleLike,
        fallbackImage,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used within MusicProvider");
  return ctx;
};

