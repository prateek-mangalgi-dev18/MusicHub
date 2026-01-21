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
  loadingUser: boolean;
  userId: string | null;

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

  showPlaylistModal: boolean;
  setShowPlaylistModal: (v: boolean) => void;
  selectedPlaylistId: string | null;
  setSelectedPlaylistId: (v: string | null) => void;
  selectedSongs: Song[];
  toggleSongSelection: (song: Song) => void;
  newPlaylistName: string;
  setNewPlaylistName: (v: string) => void;

  openAddToPlaylistModal: (song?: Song | null) => void;
  addToPlaylist: (playlistId: string, songs: Song[]) => Promise<void>;
  removeFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  createNewPlaylist: () => Promise<void>;
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

  const [loadingUser, setLoadingUser] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [queue, setQueue] = useState<Song[]>([]);
  const [queueSource, setQueueSource] = useState<QueueSource>("home");
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] =
    useState<string | null>(null);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  /* ================= BOOTSTRAP ================= */

  useEffect(() => {
    const init = async () => {
      setLoadingUser(true);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token");

        const payload = JSON.parse(atob(token.split(".")[1]));
        const uid = payload.id;
        setUserId(uid);

        const [songs, likes, pls] = await Promise.all([
          api.get<Song[]>("/api/songs"),
          api.get<Song[]>("/api/user/likes"),
          api.get<any[]>("/api/user/playlists"),
        ]);

        setAllSongs(songs.data);
        setLikedSongs(likes.data);
        setPlaylists(
          pls.data.map((p) => ({
            id: p._id,
            name: p.name,
            songs: p.songs,
          }))
        );

        /* 🔥 RESTORE LAST PLAYED SONG */
        const saved = localStorage.getItem(`player_state_${uid}`);
        if (saved) {
          const { song, time, playing } = JSON.parse(saved);
          const audio = audioRef.current;
          if (audio && song?.fileUrl) {
            audio.src = song.fileUrl;
            audio.currentTime = time || 0;
            setCurrentSong(song);
            if (playing) audio.play();
          }
        }
      } catch {
        setUserId(null);
      } finally {
        setLoadingUser(false);
      }
    };

    init();
  }, []);

  /* ================= AUDIO ================= */

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

  /* ================= PERSIST PLAYER ================= */

  useEffect(() => {
    if (!userId || !currentSong) return;

    localStorage.setItem(
      `player_state_${userId}`,
      JSON.stringify({
        song: currentSong,
        time: currentTime,
        playing: isPlaying,
      })
    );
  }, [currentSong, currentTime, isPlaying, userId]);

  /* ================= PLAYBACK ================= */

  const playSong = async (
    song: Song,
    source: QueueSource = "home",
    playlistId?: string
  ) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (source === "playlist" && playlistId) {
      const pl = playlists.find((p) => p.id === playlistId);
      if (pl) {
        setQueue(pl.songs);
        setQueueSource("playlist");
        setActivePlaylistId(playlistId);
      }
    } else {
      setQueue(allSongs);
      setQueueSource("home");
      setActivePlaylistId(null);
    }

    audio.src = song.fileUrl;
    setCurrentSong(song);
    await audio.play();
  };

  const playNext = () => {
    if (!currentSong || queue.length === 0) return;
    const i = queue.findIndex((s) => s._id === currentSong._id);
    if (i >= 0 && i < queue.length - 1) {
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

  /* ================= ACTIONS ================= */

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

  const addToPlaylist = async (pid: string, songs: Song[]) => {
    for (const s of songs) {
      await api.post(`/api/user/playlists/${pid}/songs/${s._id}`);
    }
    setPlaylists((p) =>
      p.map((pl) =>
        pl.id === pid
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
        loadingUser,
        userId,
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
        showPlaylistModal,
        setShowPlaylistModal,
        selectedPlaylistId,
        setSelectedPlaylistId,
        selectedSongs,
        toggleSongSelection,
        newPlaylistName,
        setNewPlaylistName,
        openAddToPlaylistModal,
        addToPlaylist,
        removeFromPlaylist,
        deletePlaylist,
        createNewPlaylist,
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


// "use client";

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
//   ReactNode,
// } from "react";
// import api from "@/lib/axios";

// /* ================= TYPES ================= */

// export interface Song {
//   _id: string;
//   title: string;
//   artist: string;
//   movie?: string;
//   fileUrl: string;
//   coverImage: string;
// }

// interface Playlist {
//   id: string;
//   name: string;
//   songs: Song[];
// }

// type QueueSource = "home" | "playlist";

// interface MusicContextType {
//   /* status */
//   loadingUser: boolean;
//   userId: string | null;

//   /* player */
//   currentSong: Song | null;
//   isPlaying: boolean;

//   playSong: (
//     song: Song,
//     source?: QueueSource,
//     playlistId?: string
//   ) => Promise<void>;

//   playNext: () => void;
//   playPrevious: () => void;
//   togglePlayPause: () => void;
//   handleSeek: (value: number) => void;

//   progress: number;
//   currentTime: number;
//   duration: number;

//   /* data */
//   allSongs: Song[];
//   likedSongs: Song[];
//   playlists: Playlist[];

//   /* playlist UI */
//   showPlaylistModal: boolean;
//   setShowPlaylistModal: (v: boolean) => void;
//   selectedPlaylistId: string | null;
//   setSelectedPlaylistId: (v: string | null) => void;
//   selectedSongs: Song[];
//   toggleSongSelection: (song: Song) => void;
//   newPlaylistName: string;
//   setNewPlaylistName: (v: string) => void;

//   /* actions */
//   openAddToPlaylistModal: (song?: Song | null) => void;
//   addToPlaylist: (playlistId: string, songs: Song[]) => Promise<void>;
//   removeFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
//   deletePlaylist: (playlistId: string) => Promise<void>;
//   createNewPlaylist: () => Promise<void>;
//   handleLike: (song: Song) => Promise<void>;

//   fallbackImage: string;
// }

// const MusicContext = createContext<MusicContextType | null>(null);

// /* ================= PROVIDER ================= */

// export function MusicProvider({ children }: { children: ReactNode }) {
//   const audioRef = useRef<HTMLAudioElement | null>(
//     typeof Audio !== "undefined" ? new Audio() : null
//   );

//   const fallbackImage = "https://unsplash.it/300/300?random";

//   const [loadingUser, setLoadingUser] = useState(true);
//   const [userId, setUserId] = useState<string | null>(null);

//   const [allSongs, setAllSongs] = useState<Song[]>([]);
//   const [likedSongs, setLikedSongs] = useState<Song[]>([]);
//   const [playlists, setPlaylists] = useState<Playlist[]>([]);

//   const [currentSong, setCurrentSong] = useState<Song | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);

//   const [queue, setQueue] = useState<Song[]>([]);
//   const [queueSource, setQueueSource] = useState<QueueSource>("home");
//   const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);

//   const [progress, setProgress] = useState(0);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);

//   const [showPlaylistModal, setShowPlaylistModal] = useState(false);
//   const [selectedPlaylistId, setSelectedPlaylistId] =
//     useState<string | null>(null);
//   const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
//   const [newPlaylistName, setNewPlaylistName] = useState("");

//   /* ================= RESET ================= */

//   const hardReset = () => {
//     const audio = audioRef.current;
//     if (audio) {
//       audio.pause();
//       audio.src = "";
//     }

//     setCurrentSong(null);
//     setQueue([]);
//     setLikedSongs([]);
//     setPlaylists([]);
//     setIsPlaying(false);
//     setSelectedSongs([]);
//     setSelectedPlaylistId(null);
//   };

//   /* ================= BOOTSTRAP ================= */

//   useEffect(() => {
//     const init = async () => {
//       setLoadingUser(true);
//       hardReset();

//       try {
//         // const me = await api.get("/api/user/me");
//         // const uid = me.data._id;
//         // setUserId(uid);
//         const token = localStorage.getItem("token");
//         if (!token) throw new Error("No token");

//         const payload = JSON.parse(atob(token.split(".")[1]));
//         setUserId(payload.id);


//         const [songs, likes, pls] = await Promise.all([
//           api.get<Song[]>("/api/songs"),
//           api.get<Song[]>("/api/user/likes"),
//           api.get<any[]>("/api/user/playlists"),
//         ]);

//         setAllSongs(songs.data);
//         setLikedSongs(likes.data);
//         setPlaylists(
//           pls.data.map((p) => ({
//             id: p._id,
//             name: p.name,
//             songs: p.songs,
//           }))
//         );

//         const saved = localStorage.getItem(`player_state_${uid}`);
//         if (saved) {
//           const { song, time, playing } = JSON.parse(saved);
//           const audio = audioRef.current;
//           if (audio) {
//             audio.src = song.fileUrl;
//             audio.currentTime = time;
//             setCurrentSong(song);
//             if (playing) audio.play();
//           }
//         }
//       } catch {
//         setUserId(null);
//         hardReset();
//       } finally {
//         setLoadingUser(false);
//       }
//     };

//     init();
//   }, []);

//   /* ================= AUDIO ================= */

//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     audio.onplay = () => setIsPlaying(true);
//     audio.onpause = () => setIsPlaying(false);
//     audio.onended = () => playNext();

//     audio.ontimeupdate = () => {
//       setCurrentTime(audio.currentTime);
//       setProgress(
//         audio.duration ? (audio.currentTime / audio.duration) * 100 : 0
//       );
//     };

//     audio.onloadedmetadata = () => {
//       setDuration(audio.duration || 0);
//     };
//   }, [queue, currentSong]);

//   /* ================= PERSIST PLAYER ================= */

//   useEffect(() => {
//     if (!userId || !currentSong) return;

//     localStorage.setItem(
//       `player_state_${userId}`,
//       JSON.stringify({
//         song: currentSong,
//         time: currentTime,
//         playing: isPlaying,
//       })
//     );
//   }, [currentSong, currentTime, isPlaying, userId]);

//   /* ================= PLAYBACK ================= */

//   const playSong = async (
//     song: Song,
//     source: QueueSource = "home",
//     playlistId?: string
//   ) => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     if (source === "playlist" && playlistId) {
//       const pl = playlists.find((p) => p.id === playlistId);
//       if (pl) {
//         setQueue(pl.songs);
//         setQueueSource("playlist");
//         setActivePlaylistId(playlistId);
//       }
//     } else {
//       setQueue(allSongs);
//       setQueueSource("home");
//       setActivePlaylistId(null);
//     }

//     audio.src = song.fileUrl;
//     setCurrentSong(song);
//     await audio.play();
//   };

//   const playNext = () => {
//     if (!currentSong || queue.length === 0) return;
//     const i = queue.findIndex((s) => s._id === currentSong._id);
//     if (i >= 0 && i < queue.length - 1) {
//       playSong(queue[i + 1], queueSource, activePlaylistId ?? undefined);
//     }
//   };

//   const playPrevious = () => {
//     if (!currentSong || queue.length === 0) return;
//     const i = queue.findIndex((s) => s._id === currentSong._id);
//     if (i > 0) {
//       playSong(queue[i - 1], queueSource, activePlaylistId ?? undefined);
//     }
//   };

//   const togglePlayPause = () => {
//     const audio = audioRef.current;
//     if (!audio) return;
//     audio.paused ? audio.play() : audio.pause();
//   };

//   const handleSeek = (v: number) => {
//     const audio = audioRef.current;
//     if (!audio || !audio.duration) return;
//     audio.currentTime = (v / 100) * audio.duration;
//   };

//   /* ================= ACTIONS ================= */

//   const handleLike = async (song: Song) => {
//     await api.post(`/api/user/like/${song._id}`);
//     setLikedSongs((p) =>
//       p.some((s) => s._id === song._id)
//         ? p.filter((s) => s._id !== song._id)
//         : [...p, song]
//     );
//   };

//   const createNewPlaylist = async () => {
//     if (!newPlaylistName.trim()) return;
//     const res = await api.post("/api/user/playlists", {
//       name: newPlaylistName,
//     });
//     setPlaylists((p) => [
//       ...p,
//       { id: res.data._id, name: res.data.name, songs: [] },
//     ]);
//     setNewPlaylistName("");
//   };

//   const addToPlaylist = async (pid: string, songs: Song[]) => {
//     for (const s of songs) {
//       await api.post(`/api/user/playlists/${pid}/songs/${s._id}`);
//     }
//     setPlaylists((p) =>
//       p.map((pl) =>
//         pl.id === pid
//           ? {
//               ...pl,
//               songs: [
//                 ...pl.songs,
//                 ...songs.filter(
//                   (s) => !pl.songs.some((x) => x._id === s._id)
//                 ),
//               ],
//             }
//           : pl
//       )
//     );
//     setShowPlaylistModal(false);
//   };

//   const removeFromPlaylist = async (pid: string, sid: string) => {
//     await api.delete(`/api/user/playlists/${pid}/songs/${sid}`);
//     setPlaylists((p) =>
//       p.map((pl) =>
//         pl.id === pid
//           ? { ...pl, songs: pl.songs.filter((s) => s._id !== sid) }
//           : pl
//       )
//     );
//   };

//   const deletePlaylist = async (pid: string) => {
//     await api.delete(`/api/user/playlists/${pid}`);
//     setPlaylists((p) => p.filter((pl) => pl.id !== pid));
//   };

//   const openAddToPlaylistModal = (song?: Song | null) => {
//     setSelectedSongs(song ? [song] : []);
//     setShowPlaylistModal(true);
//   };

//   const toggleSongSelection = (song: Song) => {
//     setSelectedSongs((p) =>
//       p.some((s) => s._id === song._id)
//         ? p.filter((s) => s._id !== song._id)
//         : [...p, song]
//     );
//   };

//   return (
//     <MusicContext.Provider
//       value={{
//         loadingUser,
//         userId,

//         currentSong,
//         isPlaying,
//         playSong,
//         playNext,
//         playPrevious,
//         togglePlayPause,
//         handleSeek,

//         progress,
//         currentTime,
//         duration,

//         allSongs,
//         likedSongs,
//         playlists,

//         showPlaylistModal,
//         setShowPlaylistModal,
//         selectedPlaylistId,
//         setSelectedPlaylistId,
//         selectedSongs,
//         toggleSongSelection,
//         newPlaylistName,
//         setNewPlaylistName,

//         openAddToPlaylistModal,
//         addToPlaylist,
//         removeFromPlaylist,
//         deletePlaylist,
//         createNewPlaylist,

//         handleLike,
//         fallbackImage,
//       }}
//     >
//       {children}
//     </MusicContext.Provider>
//   );
// }

// export const useMusic = () => {
//   const ctx = useContext(MusicContext);
//   if (!ctx) {
//     throw new Error("useMusic must be used within MusicProvider");
//   }
//   return ctx;
// };


