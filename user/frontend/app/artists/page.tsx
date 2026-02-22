"use client";

import { useMusic } from "@/context/musiccontext";
import { User } from "lucide-react";

interface Artist {
    name: string;
    songsCount: number;
}

export default function ArtistsPage() {
    const { allSongs, loadingUser } = useMusic();

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
    }));

    const loading = loadingUser;

    return (
        <div className="flex flex-col w-full h-screen overflow-y-auto bg-slate-50 p-10">
            <div className="max-w-7xl mx-auto w-full">
                <header className="mb-12 border-b border-zinc-200 pb-8">
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic text-black">
                        Our Artists
                    </h1>
                    <p className="text-zinc-500 font-medium mt-2">
                        The voices pulse-checking the rhythm of MusicHub.
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
                                        <User className="w-20 h-20 text-zinc-200 group-hover:text-accent transition-colors" />
                                    </div>
                                </div>
                                <h3 className="font-bold text-xl text-black group-hover:text-accent transition-colors">
                                    {artist.name}
                                </h3>
                                <p className="text-sm font-black text-zinc-400 uppercase tracking-widest mt-1">
                                    {artist.songsCount} {artist.songsCount === 1 ? 'Track' : 'Tracks'}
                                </p>
                            </div>
                        ))}
                        {!loading && artists.length === 0 && <p className="text-zinc-400 font-medium">No artists found in the library.</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
