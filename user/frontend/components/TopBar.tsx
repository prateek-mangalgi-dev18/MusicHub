"use client";

import { Search, ChevronDown } from "lucide-react";

export default function TopBar() {
    return (
        <div className="sticky top-0 z-50 bg-white border-b border-zinc-200 px-8 py-4">
            <div className="flex flex-wrap items-center gap-4 max-w-7xl mx-auto">
                {/* Search Tracks & Artists */}
                <div className="flex-grow min-w-[200px] relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-black transition-colors" />
                    <input
                        type="text"
                        placeholder="Explore tracks & artists..."
                        className="w-full bg-zinc-100/50 hover:bg-zinc-100 focus:bg-white border border-transparent focus:border-zinc-200 rounded-2xl py-3.5 ps-12 pe-4 text-sm font-black text-black placeholder:text-zinc-400 placeholder:font-bold transition-all outline-none"
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-4 bg-zinc-100/50 hover:bg-zinc-100 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-black transition-all group">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-accent group-hover:scale-125 transition-transform"></span>
                            Genres
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                    </button>

                    <button className="flex items-center gap-4 bg-zinc-100/50 hover:bg-zinc-100 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-black transition-all">
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                            Moods
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                    </button>
                </div>

                {/* Toggle Switch */}
                <div className="flex bg-zinc-100/80 p-1.5 rounded-full">
                    <button className="px-6 py-2 text-[9px] font-black uppercase rounded-full bg-white shadow-sm text-black">
                        Regular
                    </button>
                    <button className="px-6 py-2 text-[9px] font-black uppercase rounded-full text-zinc-400 hover:text-black transition-colors">
                        Instrumental
                    </button>
                </div>

                {/* View Toggle (Optional Placeholder) */}
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
    );
}
