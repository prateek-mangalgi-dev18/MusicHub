"use client";

import { useMusic } from "@/context/musiccontext";
import { X, LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginModal() {
    const { showLoginModal, setShowLoginModal } = useMusic();
    const router = useRouter();

    if (!showLoginModal) return null;

    const handleNavigate = (path: string) => {
        setShowLoginModal(false);
        router.push(path);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowLoginModal(false)}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Login Required</h2>
                        <button
                            onClick={() => setShowLoginModal(false)}
                            className="p-1 rounded-full hover:bg-white/10 text-zinc-400 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <p className="text-zinc-400 mb-8">
                        Please log in to your account to play songs and access your playlists.
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={() => handleNavigate("/login")}
                            className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl font-bold hover:bg-zinc-200 transition-all active:scale-[0.98]"
                        >
                            <LogIn className="w-4 h-4" />
                            Sign In
                        </button>
                        <button
                            onClick={() => handleNavigate("/signup")}
                            className="w-full flex items-center justify-center gap-2 bg-zinc-800 text-white py-3 rounded-xl font-bold hover:bg-zinc-700 transition-all border border-white/5 active:scale-[0.98]"
                        >
                            <UserPlus className="w-4 h-4" />
                            Create Account
                        </button>
                    </div>
                </div>

                {/* Bottom Accent */}
                <div className="h-1 bg-gradient-to-r from-accent to-purple-600" />
            </div>
        </div>
    );
}
