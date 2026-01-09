'use client';

import Link from "next/link";
import Image from 'next/image';
import { useState, useEffect } from "react";
import { FiBell, FiMessageSquare } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import logo from '/public/linkednorth-logo.png';

export default function AuthNavbar({ userData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
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
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-12 py-3">
        
        {/* Logo */}
        <div className="relative h-10 w-[140px] flex-shrink-0">
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

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-black">Home</Link>
          <Link href="/joblistings" className="hover:text-black font-semibold">Job Listings</Link>
          <Link href="/resources" className="hover:text-black">Career Resources</Link>
          <Link href="/contact" className="hover:text-black">Contact Us</Link>
        </div>

        {/* Desktop Right Section */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/dashboard" className="relative hover:opacity-70 transition">
            <FiBell size={20} />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-semibold">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </Link>
          <Link href="/dashboard" className="relative hover:opacity-70 transition">
            <FiMessageSquare size={20} />
            {messageCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-semibold">
                {messageCount > 9 ? '9+' : messageCount}
              </span>
            )}
          </Link>
          <Link href="/dashboard" className="hover:opacity-80 transition">
            <img
              src={userData?.imageUrl}
              alt="profile"
              className="h-8 w-8 rounded-full object-cover border-2 border-transparent hover:border-gray-300"
            />
          </Link>
          <Link href="/post-job" className="px-3 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition">
            Post A Job
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden fixed top-0 left-0 w-full h-screen bg-white z-40 flex flex-col items-center justify-center gap-8 px-6">
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-lg hover:text-black">Home</Link>
          <Link href="/joblistings" onClick={() => setMenuOpen(false)} className="text-lg hover:text-black">Job Listings</Link>
          <Link href="/resources" onClick={() => setMenuOpen(false)} className="text-lg hover:text-black">Career Resources</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="text-lg hover:text-black">Contact Us</Link>

          <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-lg hover:text-black">
            Notifications {notificationCount > 0 && `(${notificationCount})`}
          </Link>
          <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-lg hover:text-black">
            Messages {messageCount > 0 && `(${messageCount})`}
          </Link>

          <Link href="/post-job" onClick={() => setMenuOpen(false)} className="text-lg hover:text-black">
            Post A Job
          </Link>

          <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
            <img
              src={userData?.imageUrl}
              alt="profile"
              className="h-10 w-10 rounded-full object-cover border-2 border-transparent hover:border-gray-300"
            />
          </Link>
        </div>
      )}
    </nav>
  );
}
