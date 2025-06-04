"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm py-3 px-6 flex items-center justify-between rounded-b-xl">
      <div className="flex items-center gap-3">
        <img src="/globe.svg" alt="Logo" className="w-8 h-8" />
        <span className="font-bold text-xl tracking-tight text-gray-800">NextBlog</span>
      </div>
      <div className="flex gap-6 text-base font-medium">
        <Link href="/" className={pathname === "/" ? "text-indigo-600" : "hover:text-indigo-500 transition-colors"}>Home</Link>
        <Link href="/users" className={pathname.startsWith("/users") ? "text-indigo-600" : "hover:text-indigo-500 transition-colors"}>Users</Link>
        <Link href="/blog" className={pathname.startsWith("/blog") ? "text-indigo-600" : "hover:text-indigo-500 transition-colors"}>Blog</Link>
        <Link href="/categories" className={pathname.startsWith("/categories") ? "text-indigo-600" : "hover:text-indigo-500 transition-colors"}>Categories</Link>
      </div>
    </nav>
  );
}
