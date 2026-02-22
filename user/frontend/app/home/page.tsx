"use client";

import { useMusic } from "@/context/musiccontext";
import TopBar from "@/components/TopBar";
import SongCard from "@/components/SongCard";
import { Play } from "lucide-react";

export default function HomePage() {
  const { allSongs, loadingUser, searchQuery } = useMusic();

  const loading = loadingUser;
  const filteredSongs = allSongs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-screen overflow-y-auto bg-slate-50">
      <TopBar />

      <div className="p-10 pb-32 max-w-[1600px] mx-auto w-full">
        {/* Music Library Spotlight */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8 border-b border-zinc-200 pb-4">
            <h2 className="text-3xl font-black tracking-tight text-black uppercase italic">
              {searchQuery ? `Searching: ${searchQuery}` : 'Music Library'}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {loading ? (
              [...Array(10)].map((_, i) => (
                <div key={i} className="space-y-4 animate-pulse">
                  <div className="aspect-square bg-zinc-200 rounded-xl"></div>
                  <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
                  <div className="h-3 bg-zinc-100 rounded w-1/2"></div>
                </div>
              ))
            ) : filteredSongs.length > 0 ? (
              filteredSongs.map((song) => (
                <SongCard key={song._id} song={song} />
              ))
            ) : (
              <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest col-span-full py-20 text-center">
                No matches found for "{searchQuery}"
              </p>
            )}
          </div>
        </section>
      </div>

    </div>
  );
}
