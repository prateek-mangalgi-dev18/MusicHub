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
      <body suppressHydrationWarning>
        <MusicProvider>
          {children}
        </MusicProvider>
      </body>
    </html>
  );
}

