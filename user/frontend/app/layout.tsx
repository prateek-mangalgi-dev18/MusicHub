import type { ReactNode } from "react";
import { MusicProvider } from "@/context/musiccontext";
import Sidebar from "@/components/Sidebar";
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
        className="min-h-screen bg-background text-foreground antialiased selection:bg-accent/20"
      >
        <MusicProvider>
          <div className="flex">
            <Sidebar />
            <main className="flex-grow min-h-screen pl-64 transition-all duration-300">
              {children}
            </main>
          </div>
        </MusicProvider>
      </body>
    </html>
  );
}
