"use client";

import { useMusic } from "@/context/musiccontext";
import { User } from "lucide-react";
import TopBar from "@/components/TopBar";

interface Artist {
    name: string;
    songsCount: number;
}

export default function ArtistsPage() {
    const { allSongs, loadingUser, searchQuery } = useMusic();

    // Compute unique artists and their track counts from the global song list
    const artistMap: Record<string, number> = {};
    allSongs.forEach(song => {
        if (song.artist) {
            artistMap[song.artist] = (artistMap[song.artist] || 0) + 1;
        }
    });

    const artists = Object.entries(artistMap).map(([name, count]) => ({
        name,
        songsCount: count
    })).filter(artist =>
        artist.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const loading = loadingUser;

    return (
        <div className="flex flex-col w-full h-screen overflow-y-auto bg-slate-50">
            <TopBar />

            <div className="p-10 pb-32 max-w-[1600px] mx-auto w-full">
                <header className="mb-12 border-b border-zinc-200 pb-8">
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic text-black">
                        {searchQuery ? `Searching Artists: ${searchQuery}` : 'Our Artists'}
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-2">
                        {artists.length} curators of sound
                    </p>
                </header>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="animate-pulse space-y-4">
                                <div className="aspect-square bg-zinc-200 rounded-full"></div>
                                <div className="h-4 bg-zinc-200 rounded w-3/4 mx-auto"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                        {artists.map((artist) => (
                            <div key={artist.name} className="group flex flex-col items-center text-center">
                                <div className="relative w-full aspect-square bg-zinc-100 rounded-full overflow-hidden mb-6 ring-1 ring-zinc-200 group-hover:ring-accent transition-all duration-300">
                                    <div className="w-full h-full flex items-center justify-center bg-white group-hover:bg-accent/5 transition-colors">
                                        <User className="w-16 h-16 text-zinc-200 group-hover:text-accent transition-colors" />
                                    </div>
                                </div>
                                <h3 className="font-black text-xl text-black uppercase italic tracking-tight group-hover:text-accent transition-colors">
                                    {artist.name}
                                </h3>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-1">
                                    {artist.songsCount} {artist.songsCount === 1 ? 'Track' : 'Tracks'}
                                </p>
                            </div>
                        ))}
                        {!loading && artists.length === 0 && (
                            <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest col-span-full py-20 text-center">
                                No artists match "{searchQuery}"
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
