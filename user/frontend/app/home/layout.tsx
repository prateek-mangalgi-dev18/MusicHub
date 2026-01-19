"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Music, ListMusic } from "lucide-react";

import { MusicProvider } from "@/context/musiccontext";
import AddToPlaylistModal from "@/components/AddToPlaylistModal";
import MusicPlayer from "@/components/MusicPlayer";

export default function HomeLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navClass = (path: string) =>
    pathname === path
      ? "text-white"
      : "text-gray-400 hover:text-gray-200";

  return (
    <MusicProvider>
      <div className="w-full min-h-screen flex bg-black text-white">
        {/* Sidebar */}
        <aside className="w-60 bg-gray-900 p-5 fixed h-screen border-r border-gray-800">
          <h1 className="text-2xl font-bold mb-8">MusicHub</h1>

          <ul className="space-y-5">
            <li>
              <Link href="/home" className={`flex items-center gap-3 ${navClass("/home")}`}>
                <Home size={20} />
                Home
              </Link>
            </li>

            <li>
              <Link
                href="/home/library"
                className={`flex items-center gap-3 ${navClass("/home/library")}`}
              >
                <Music size={20} />
                Library
              </Link>
            </li>

            <li>
              <Link
                href="/home/playlists"
                className={`flex items-center gap-3 ${navClass("/home/playlists")}`}
              >
                <ListMusic size={20} />
                Playlists
              </Link>
            </li>
          </ul>
        </aside>

        {/* Main */}
        <main className="flex-1 ml-60 p-8 pb-32 overflow-y-auto">
          {children}
        </main>

        {/* Global UI */}
        <AddToPlaylistModal />
        <MusicPlayer />
      </div>
    </MusicProvider>
  );
}
