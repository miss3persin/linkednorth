"use client";

import Link from "next/link";
import { useState } from "react";
import { FiBell, FiMessageSquare, FiMenu } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { HiMenu, HiX } from "react-icons/hi";

export default function AuthNavbar({ userData }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
            <div className="flex items-center justify-between px-6 md:px-12 py-4">

                {/* Logo */}
                <Link href="/" className="text-xl font-semibold">
                    <span className="font-bold">LINKED</span>
                    <span className="text-gray-500">NORTH</span>
                </Link>

                {/* Links - desktop */}
                <div className="hidden lg:flex items-center gap-8 text-sm text-gray-600">
                    <Link href="/" className="hover:text-black">Home</Link>
                    <Link href="/jobs" className="hover:text-black font-semibold">Job Listings</Link>
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
                    <div className="relative cursor-pointer">
                        <FiBell size={20} />
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                            0
                        </span>
                    </div>

                    {/* Messages Badge */}
                    <div className="relative cursor-pointer">
                        <FiMessageSquare size={20} />
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                            0
                        </span>
                    </div>

                    {/* User Avatar */}
                    <Link href="/dashboard">
                        <img
                            src={userData?.imageUrl}
                            alt="profile"
                            className="h-8 w-8 rounded-full cursor-pointer object-cover"
                        />
                    </Link>


                    {/* Post Job */}
                    <Link href="/post-job" className="px-4 py-2 border rounded-lg text-sm font-medium">
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
                    <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link href="/jobs" onClick={() => setMenuOpen(false)}>Job Listings</Link>
                    <Link href="/resources" onClick={() => setMenuOpen(false)}>Career Resources</Link>
                    <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link>
                    <Link href="/post-job" onClick={() => setMenuOpen(false)}>Post A Job</Link>
                </div>
            )}
        </nav>
    );
}
