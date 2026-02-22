"use client";

import { useMusic } from "@/context/musiccontext";
import TopBar from "@/components/TopBar";
import SongCard from "@/components/SongCard";

export default function Home() {
  const { allSongs, loadingUser } = useMusic();

  const loading = loadingUser;
  const songs = allSongs;

  return (
    <div className="flex flex-col w-full h-screen overflow-y-auto bg-slate-50">
      <TopBar />

      <div className="p-10 pb-32 max-w-[1600px] mx-auto w-full">
        {/* MusicHub Spotlight */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8 border-b border-zinc-200 pb-4">
            <h2 className="text-3xl font-black tracking-tight text-black uppercase italic">
              MusicHub Picks
            </h2>
            <div className="flex gap-4">
              <div className="flex gap-2">
                <button className="p-2 text-zinc-300 hover:text-black transition-colors">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" /></svg>
                </button>
                <button className="p-2 text-black transition-colors">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" /></svg>
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-10 gap-y-16">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-square bg-zinc-200 rounded-lg"></div>
                  <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
                  <div className="h-4 bg-zinc-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-10 gap-y-16">
              {songs.slice(0, 10).map((song) => (
                <SongCard key={song._id} song={song} />
              ))}
            </div>
          )}
        </section>

        {/* Recent Releases */}
        <section>
          <div className="flex items-center justify-between mb-8 border-b border-zinc-200 pb-4">
            <h2 className="text-3xl font-black tracking-tight text-black">
              Recent Releases
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-10 gap-y-16">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-square bg-zinc-200 rounded-lg"></div>
                  <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
                  <div className="h-4 bg-zinc-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-10 gap-y-16">
              {songs.slice(10).map((song) => (
                <SongCard key={song._id} song={song} />
              ))}
              {songs.length === 0 && <p className="text-zinc-400">No recent releases found.</p>}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
