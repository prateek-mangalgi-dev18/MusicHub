"use client";

import { useMusic } from "@/context/musiccontext";
import TopBar from "@/components/TopBar";
import SongCard from "@/components/SongCard";

export default function LibraryPage() {
  const { likedSongs, loadingUser, searchQuery } = useMusic();

  const filteredLikes = likedSongs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-screen overflow-y-auto bg-slate-50">
      <TopBar />

      <div className="p-10 pb-32 max-w-[1600px] mx-auto w-full">
        {/* Liked Songs Header */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8 border-b border-zinc-200 pb-4">
            <h2 className="text-3xl font-black tracking-tight text-black uppercase italic">
              {searchQuery ? `Searching Liked: ${searchQuery}` : 'Your Liked Songs'}
            </h2>
            <div className="flex gap-2 text-zinc-400 text-xs font-black uppercase tracking-widest">
              {filteredLikes.length} Tracks
            </div>
          </div>

          {loadingUser ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-10 gap-y-16">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-square bg-zinc-200 rounded-xl"></div>
                  <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
                  <div className="h-4 bg-zinc-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredLikes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-10 gap-y-16">
              {filteredLikes.map((song) => (
                <SongCard key={song._id} song={song} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6 text-zinc-300">
                <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
              </div>
              <h3 className="text-xl font-black text-black uppercase italic mb-2">No liked songs yet</h3>
              <p className="text-zinc-400 font-bold text-sm">Start exploring and like your favorite music!</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
