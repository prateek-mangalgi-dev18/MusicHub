"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
    Search
} from "lucide-react";
import { FaSpotify } from "react-icons/fa";

const navItems = [
    { icon: LogIn, label: "Log In", href: "/login" },
    { icon: Library, label: "Music Library", href: "/" },
    { icon: User, label: "Artists", href: "/artists" },
    { icon: FileText, label: "Usage Policy", href: "/policy" },
    { icon: Info, label: "About", href: "/about" },
    { icon: Mail, label: "Contact", href: "/contact" },
];

const socialItems = [
    { icon: FaSpotify, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Youtube, href: "#" },
];

export default function Sidebar() {
    const pathname = usePathname();

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
                {navItems.map((item) => {
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
            </nav>

            {/* Socials & Actions */}
            <div className="p-8 border-t border-zinc-900 space-y-8">
                <div className="flex gap-6 text-zinc-500">
                    {socialItems.map((social, i) => (
                        <Link key={i} href={social.href} className="hover:text-white transition-colors">
                            <social.icon className="w-5 h-5" />
                        </Link>
                    ))}
                </div>

                <button className="w-full flex items-center justify-center p-3 rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors">
                    <Search className="w-5 h-5 text-white" />
                </button>
            </div>
        </aside>
    );
}
