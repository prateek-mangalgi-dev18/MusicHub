"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import api from "@/lib/axios";

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

type QueueSource = "home" | "playlist";

interface MusicContextType {
  currentSong: Song | null;
  isPlaying: boolean;

  playSong: (
    song: Song,
    source?: QueueSource,
    playlistId?: string
  ) => Promise<void>;

  playNext: () => void;
  playPrevious: () => void;
  togglePlayPause: () => void;
  handleSeek: (value: number) => void;

  progress: number;
  currentTime: number;
  duration: number;

  allSongs: Song[];
  likedSongs: Song[];
  playlists: Playlist[];

  openAddToPlaylistModal: (song?: Song | null) => void;
  addToPlaylist: (playlistId: string, songs: Song[]) => Promise<void>;
  removeFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  createNewPlaylist: () => Promise<void>;

  showPlaylistModal: boolean;
  setShowPlaylistModal: (v: boolean) => void;
  selectedPlaylistId: string | null;
  setSelectedPlaylistId: (v: string | null) => void;
  selectedSongs: Song[];
  toggleSongSelection: (song: Song) => void;
  newPlaylistName: string;
  setNewPlaylistName: (v: string) => void;

  handleLike: (song: Song) => Promise<void>;
  fallbackImage: string;
}

const MusicContext = createContext<MusicContextType | null>(null);

/* ================= PROVIDER ================= */

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(
    typeof Audio !== "undefined" ? new Audio() : null
  );

  const fallbackImage = "https://unsplash.it/300/300?random";

  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [queue, setQueue] = useState<Song[]>([]);
  const [queueSource, setQueueSource] = useState<QueueSource>("home");
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);

  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(
    null
  );
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  /* ================= RESET USER STATE ================= */

  const resetUserState = () => {
    setLikedSongs([]);
    setPlaylists([]);
    setCurrentSong(null);
    setQueue([]);
    setIsPlaying(false);
  };

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const songsRes = await api.get<Song[]>("/api/songs");
        setAllSongs(songsRes.data);

        const likesRes = await api.get<Song[]>("/api/user/likes");
        const playlistsRes = await api.get<any[]>("/api/user/playlists");

        setLikedSongs(likesRes.data);
        setPlaylists(
          playlistsRes.data.map((p) => ({
            id: p._id,
            name: p.name,
            songs: p.songs,
          }))
        );

        // 🔁 Restore player state
        const saved = localStorage.getItem("player_state");
        if (saved) {
          const { song, time, isPlaying } = JSON.parse(saved);
          const audio = audioRef.current;
          if (audio) {
            audio.src = song.fileUrl;
            audio.currentTime = time;
            setCurrentSong(song);
            if (isPlaying) audio.play();
          }
        }
      } catch {
        resetUserState();
      }
    };

    bootstrap();
  }, []);

  /* ================= AUDIO EVENTS ================= */

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onended = () => playNext();

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(
        audio.duration ? (audio.currentTime / audio.duration) * 100 : 0
      );
    };

    audio.onloadedmetadata = () => {
      setDuration(audio.duration || 0);
    };
  }, [queue, currentSong]);

  /* ================= SAVE PLAYER STATE ================= */

  useEffect(() => {
    if (!currentSong) return;

    localStorage.setItem(
      "player_state",
      JSON.stringify({
        song: currentSong,
        time: currentTime,
        isPlaying,
      })
    );
  }, [currentSong, currentTime, isPlaying]);

  /* ================= PLAYBACK ================= */

  const playSong = async (
    song: Song,
    source: QueueSource = "home",
    playlistId?: string
  ) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (source === "playlist" && playlistId) {
      const playlist = playlists.find((p) => p.id === playlistId);
      if (playlist) {
        setQueue(playlist.songs);
        setQueueSource("playlist");
        setActivePlaylistId(playlistId);
      }
    } else {
      setQueue(allSongs);
      setQueueSource("home");
      setActivePlaylistId(null);
    }

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
    if (i !== -1 && i < queue.length - 1) {
      playSong(queue[i + 1], queueSource, activePlaylistId ?? undefined);
    }
  };

  const playPrevious = () => {
    if (!currentSong || queue.length === 0) return;
    const i = queue.findIndex((s) => s._id === currentSong._id);
    if (i > 0) {
      playSong(queue[i - 1], queueSource, activePlaylistId ?? undefined);
    }
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

  /* ================= BACKEND SYNC ================= */

  const handleLike = async (song: Song) => {
    await api.post(`/api/user/like/${song._id}`);
    setLikedSongs((p) =>
      p.some((s) => s._id === song._id)
        ? p.filter((s) => s._id !== song._id)
        : [...p, song]
    );
  };

  const createNewPlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    const res = await api.post("/api/user/playlists", {
      name: newPlaylistName,
    });
    setPlaylists((p) => [
      ...p,
      { id: res.data._id, name: res.data.name, songs: [] },
    ]);
    setNewPlaylistName("");
  };

  const addToPlaylist = async (playlistId: string, songs: Song[]) => {
    for (const s of songs) {
      await api.post(`/api/user/playlists/${playlistId}/songs/${s._id}`);
    }

    setPlaylists((p) =>
      p.map((pl) =>
        pl.id === playlistId
          ? {
              ...pl,
              songs: [
                ...pl.songs,
                ...songs.filter(
                  (s) => !pl.songs.some((x) => x._id === s._id)
                ),
              ],
            }
          : pl
      )
    );
    setShowPlaylistModal(false);
  };

  const removeFromPlaylist = async (pid: string, sid: string) => {
    await api.delete(`/api/user/playlists/${pid}/songs/${sid}`);
    setPlaylists((p) =>
      p.map((pl) =>
        pl.id === pid
          ? { ...pl, songs: pl.songs.filter((s) => s._id !== sid) }
          : pl
      )
    );
  };

  const deletePlaylist = async (pid: string) => {
    await api.delete(`/api/user/playlists/${pid}`);
    setPlaylists((p) => p.filter((pl) => pl.id !== pid));
  };

  const openAddToPlaylistModal = (song?: Song | null) => {
    setSelectedSongs(song ? [song] : []);
    setShowPlaylistModal(true);
  };

  const toggleSongSelection = (song: Song) => {
    setSelectedSongs((p) =>
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


