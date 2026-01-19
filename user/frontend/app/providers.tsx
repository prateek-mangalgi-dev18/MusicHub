"use client";

import { ReactNode } from "react";
import { MusicProvider } from "@/context/musiccontext";

export default function Providers({ children }: { children: ReactNode }) {
  return <MusicProvider>{children}</MusicProvider>;
}
