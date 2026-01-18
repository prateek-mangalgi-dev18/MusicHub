import type { ReactNode } from "react";
import { MusicProvider } from "@/context/musiccontext";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white antialiased"
      >
        <MusicProvider>
          {children}
        </MusicProvider>
      </body>
    </html>
  );
}
