"use client";

import Link from "next/link";
import Image from 'next/image'
import { useState, useEffect } from "react";
import { FiBell, FiMessageSquare } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import logo from '/public/linkednorth-logo.png'

export default function AuthNavbar({ userData }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [messageCount, setMessageCount] = useState(0);

    useEffect(() => {
        // Fetch notification count
        async function fetchCounts() {
            try {
                const res = await fetch('/api/user/counts');
                if (res.ok) {
                    const data = await res.json();
                    setNotificationCount(data.unreadNotifications || 0);
                    setMessageCount(data.unreadMessages || 0);
                }
            } catch (err) {
                console.error('Error fetching counts:', err);
            }
        }

        fetchCounts();

        // Refresh counts every 30 seconds
        const interval = setInterval(fetchCounts, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
            <div className="flex items-center justify-between px-6 md:px-12 py-4">

                {/* Logo */}
                <div className="relative h-10 w-[150px] flex-shrink-0 mx-auto mt-4 lg:mx-0">
                    <Link href="/">
                        <Image
                            src={logo}
                            alt="LinkedNorth"
                            layout="intrinsic"
                            objectFit="contain"
                            quality={100}
                        />
                    </Link>
                </div>

                {/* Links - desktop */}
                <div className="hidden lg:flex items-center gap-8 text-sm text-gray-600">
                    <Link href="/" className="hover:text-black">Home</Link>
                    <Link href="/joblistings" className="hover:text-black font-semibold">Job Listings</Link>
                    <Link href="/resources" className="hover:text-black">Career Resources</Link>
                    <Link href="/contact" className="hover:text-black">Contact Us</Link>
                </div>

                {/* Search bar */}
                <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-lg w-72">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search jobs, companies..."
                        className="bg-transparent focus:outline-none text-sm w-full"
                    />
                </div>

                {/* Icons */}
                <div className="hidden md:flex items-center gap-5">

                    {/* Notifications Badge */}
                    <Link href="/dashboard" className="relative cursor-pointer hover:opacity-70 transition">
                        <FiBell size={20} />
                        {notificationCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold">
                                {notificationCount > 9 ? '9+' : notificationCount}
                            </span>
                        )}
                    </Link>

                    {/* Messages Badge */}
                    <Link href="/dashboard" className="relative cursor-pointer hover:opacity-70 transition">
                        <FiMessageSquare size={20} />
                        {messageCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold">
                                {messageCount > 9 ? '9+' : messageCount}
                            </span>
                        )}
                    </Link>

                    {/* User Avatar */}
                    <Link href="/dashboard" className="hover:opacity-80 transition">
                        <img
                            src={userData?.imageUrl}
                            alt="profile"
                            className="h-8 w-8 rounded-full cursor-pointer object-cover border-2 border-transparent hover:border-gray-300"
                        />
                    </Link>

                    {/* Post Job */}
                    <Link href="/post-job" className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                        Post A Job
                    </Link>
                </div>

                {/* Mobile Menu */}
                <button
                    className="lg:hidden text-xl"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <HiX /> : <HiMenu />}
                </button>
            </div>

            {/* Mobile links */}
            {menuOpen && (
                <div className="lg:hidden bg-white px-6 py-4 shadow-md space-y-4 text-gray-700">
                    <Link href="/" onClick={() => setMenuOpen(false)} className="block hover:text-black">Home</Link>
                    <Link href="/joblistings" onClick={() => setMenuOpen(false)} className="block hover:text-black">Job Listings</Link>
                    <Link href="/resources" onClick={() => setMenuOpen(false)} className="block hover:text-black">Career Resources</Link>
                    <Link href="/contact" onClick={() => setMenuOpen(false)} className="block hover:text-black">Contact Us</Link>
                    <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block hover:text-black">
                        Notifications {notificationCount > 0 && `(${notificationCount})`}
                    </Link>
                    <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block hover:text-black">
                        Messages {messageCount > 0 && `(${messageCount})`}
                    </Link>
                    <Link href="/post-job" onClick={() => setMenuOpen(false)} className="block hover:text-black">Post A Job</Link>
                </div>
            )}
        </nav>
    );
}