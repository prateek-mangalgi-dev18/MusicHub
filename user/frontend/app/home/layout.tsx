"use client";

import type { ReactNode } from "react";
import AddToPlaylistModal from "@/components/AddToPlaylistModal";
import MusicPlayer from "@/components/MusicPlayer";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full min-h-screen flex bg-black text-white">
      {/* Main content - primary sidebar is fixed, so we just use the space */}
      <main className="flex-1 w-full pb-32 overflow-y-auto">
        {children}
      </main>

      {/* Global UI */}
      <AddToPlaylistModal />
      <MusicPlayer />
    </div>
  );
}
