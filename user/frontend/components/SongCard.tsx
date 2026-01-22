"use client";

import { FaPlus, FaHeart } from "react-icons/fa";
import { useMusic } from "@/context/musiccontext";
import type { Song } from "@/types/song";

// interface Song {
//   _id: string;
//   title: string;
//   artist: string;
//   movie?: string;
//   fileUrl: string;
//   coverImage?: string;
// }

export default function SongCard({ song }: { song: Song }) {
  const {
    playSong,
    likedSongs,
    handleLike,
    openAddToPlaylistModal,
  } = useMusic();

  const isLiked = likedSongs.some((s) => s._id === song._id);

  return (
    <div className="bg-zinc-900 p-4 rounded-xl text-white">
      <img
        src={song.coverImage || "/default-song.png"}
        alt={song.title}
        className="w-full h-40 object-cover rounded mb-3"
      />

      <h3 className="font-semibold truncate">{song.title}</h3>
      <p className="text-sm text-gray-400 truncate">{song.artist}</p>

      <div className="flex justify-between mt-3">
        <button
          onClick={() => playSong(song)}
          className="bg-green-600 px-3 py-1 rounded"
        >
          ▶ Play
        </button>

        <button
          onClick={() => handleLike(song)}
          className={isLiked ? "text-red-500" : "text-gray-400"}
        >
          <FaHeart />
        </button>

        <button
          onClick={() => openAddToPlaylistModal(song)}
          className="text-blue-400"
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
}
