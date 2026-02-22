"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LogIn,
    Library,
    User,
    FileText,
    Info,
    Mail,
    Music2,
    Instagram,
    Youtube,
    Search,
    Home,
    ListMusic,
    LogOut
} from "lucide-react";
import { FaSpotify } from "react-icons/fa";
import { useMusic } from "@/context/musiccontext";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { userId } = useMusic();

    const socialItems = [
        { icon: FaSpotify, href: "#" },
        { icon: Instagram, href: "#" },
        { icon: Youtube, href: "#" },
    ];

    const handleSignOut = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const navItems = [
        { icon: Home, label: "Home", href: "/home", public: true },
        { icon: LogIn, label: "Log In", href: "/login", public: !userId },
        { icon: Library, label: "Library", href: "/home/library", public: !!userId },
        { icon: ListMusic, label: "Playlists", href: "/home/playlists", public: !!userId },
        { icon: User, label: "Artists", href: "/artists", public: true },
        // { icon: FileText, label: "Usage Policy", href: "/policy", public: true },
        { icon: Info, label: "About", href: "/about", public: true },
        { icon: Mail, label: "Contact", href: "/contact", public: true },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-black text-white flex flex-col z-[100] border-r border-zinc-900">
            {/* Logo */}
            <div className="p-8">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-accent/20">
                        <Music2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-black tracking-tighter uppercase italic">
                        MusicHub
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-grow px-4 space-y-2 sidebar-scroll overflow-y-auto">
                {navItems.filter(item => item.public).map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-4 px-4 py-3 rounded-md transition-all group ${isActive
                                ? "text-white border-l-4 border-accent -ml-4 pl-8"
                                : "text-zinc-500 hover:text-white"
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-bold text-sm tracking-wide">{item.label}</span>
                        </Link>
                    );
                })}

                {userId && (
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-md transition-all text-zinc-500 hover:text-red-500"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-bold text-sm tracking-wide">Sign Out</span>
                    </button>
                )}
            </nav>

            {/* Socials */}
            <div className="p-8 border-t border-zinc-900">
                <div className="flex gap-6 text-zinc-500">
                    {socialItems.map((social, i) => (
                        <Link key={i} href={social.href} className="hover:text-white transition-colors">
                            <social.icon className="w-5 h-5" />
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    );
}
