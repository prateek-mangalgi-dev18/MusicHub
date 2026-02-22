"use client";

import { Search } from "lucide-react";
import { useMusic } from "@/context/musiccontext";

export default function TopBar() {
    const { searchQuery, setSearchQuery } = useMusic();

    return (
        <div className="sticky top-0 z-50 bg-white border-b border-zinc-200 px-8 py-4">
            <div className="flex items-center gap-4 max-w-7xl mx-auto">
                {/* Search Tracks & Artists */}
                <div className="flex-grow min-w-[200px] relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-black transition-colors" />
                    <input
                        type="text"
                        placeholder="Explore tracks & artists..."
                        className="w-full bg-zinc-100/50 hover:bg-zinc-100 focus:bg-white border border-transparent focus:border-zinc-200 rounded-2xl py-3.5 ps-12 pe-4 text-sm font-black text-black placeholder:text-zinc-400 placeholder:font-bold transition-all outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
