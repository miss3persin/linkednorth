'use client';

import Link from "next/link";
import Image from 'next/image';
import { useState, useEffect } from "react";
import { FiBell, FiMessageSquare } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import logo from '/public/linkednorth-logo.png';

import AuthModals from '@/app/components/modals/AuthModals'
import RecruiterModal from '@/app/components/modals/RecruiterModal'

import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Open_Sans } from 'next/font/google';

const openSans = Open_Sans({ subsets: ['latin'] });

export default function AuthNavbar({ userData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [recruiterModalOpen, setRecruiterModalOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);

  const { user } = useUser();
  const pathname = usePathname();
  const isRecruiter = !!user?.publicMetadata?.isRecruiter;

  useEffect(() => {
    async function fetchCounts() {
      if (!user) return; // Only fetch if user is logged in
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
    const interval = setInterval(() => {
      if (user) fetchCounts();
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handlePostJobClick = () => {
    if (isRecruiter) {
      window.location.href = '/recruiter/post-job';
    } else {
      setRecruiterModalOpen(true);
    }
  };

  const isActive = (path) => {
    if (path === '/joblistings' && (pathname === '/joblistings' || pathname.startsWith('/joblistings/'))) {
      return true;
    }
    return pathname === path;
  };

  return (
    <nav className={`${openSans.className} fixed top-0 left-0 w-full bg-white shadow-sm z-50`}>
      <div className="flex items-center justify-between px-8 sm:px-16 xl:px-[6%] py-4">
        <div className="relative h-10 w-[150px] flex-shrink-0 flex items-center">
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
        <div className="hidden lg:flex flex-1 justify-center">
          <div className="flex items-center gap-6 xl:gap-8 text-[13px]">
            <Link
              href="/"
              className={`${isActive('/') ? 'text-black font-semibold' : 'text-[#868D9B]'} hover:text-black transition-colors`}
            >
              Home
            </Link>
            <Link
              href="/joblistings"
              className={`${isActive('/joblistings') ? 'text-black font-semibold' : 'text-[#868D9B]'} hover:text-black transition-colors`}
            >
              Job Listings
            </Link>
            <Link
              href="/coming-soon"
              className={`${isActive('/coming-soon') ? 'text-black font-semibold' : 'text-[#868D9B]'} hover:text-black transition-colors`}
            >
              Career Resources
            </Link>
            <Link
              href="/coming-soon"
              className={`${isActive('/contact') ? 'text-black font-semibold' : 'text-[#868D9B]'} hover:text-black transition-colors`}
            >
              Contact Us
            </Link>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-8 ml-8">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="relative hover:opacity-70 transition text-[#868D9B] hover:text-black"
              onClick={() => setNotificationCount(0)}
            >
              <FiBell size={20} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-semibold text-[8px]">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Link>
            <Link
              href="/dashboard"
              className="relative hover:opacity-70 transition text-[#868D9B] hover:text-black"
              onClick={() => setMessageCount(0)}
            >
              <FiMessageSquare size={18} />
              {messageCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-semibold text-8px]">
                  {messageCount > 9 ? '9+' : messageCount}
                </span>
              )}
            </Link>
            <Link href="/dashboard" className="hover:opacity-80 transition">
              <img
                src={userData?.imageUrl || user?.imageUrl}
                alt="profile"
                className="h-8 w-8 rounded-full object-cover border-2 border-transparent hover:border-gray-300"
              />
            </Link>
          </div>
          <button
            onClick={handlePostJobClick}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
          >
            Post A Job
          </button>
        </div>
        <button
          className="lg:hidden text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>
      {menuOpen && (
        <div className="lg:hidden fixed top-0 left-0 w-full h-screen bg-white z-40 flex flex-col">
          <div className="flex items-center justify-between px-8 sm:px-16 py-4 border-b">
            <div className="relative h-10 w-[150px] flex items-center justify-center">
              <Link href="/" onClick={() => setMenuOpen(false)}>
                <Image
                  src={logo}
                  alt="LinkedNorth"
                  layout="intrinsic"
                  objectFit="contain"
                  quality={100}
                />
              </Link>
            </div>

            <button
              className="text-2xl focus:outline-none"
              onClick={() => setMenuOpen(false)}
            >
              <HiX />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center gap-6 flex-1 px-6">
            <Link href="/" onClick={() => setMenuOpen(false)} className="text-base hover:text-black">Home</Link>
            <Link href="/joblistings" onClick={() => setMenuOpen(false)} className="text-base hover:text-black">Job Listings</Link>
            <Link href="/coming-soon" onClick={() => setMenuOpen(false)} className="text-base hover:text-black">Career Resources</Link>
            <Link href="/coming-soon" onClick={() => setMenuOpen(false)} className="text-base hover:text-black">Contact Us</Link>

            <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-base hover:text-black">
              Notifications {notificationCount > 0 && (
                <span className="text-red-500">
                  ({notificationCount})
                </span>
              )}
            </Link>
            <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-basr hover:text-black">
              Messages {messageCount > 0 && `(${messageCount})`}
            </Link>

            <button
              onClick={() => {
                setMenuOpen(false);
                handlePostJobClick();
              }}
              className="text-base hover:text-black font-medium"
            >
              Post A Job
            </button>

            <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
              <img
                src={userData?.imageUrl}
                alt="profile"
                className="h-10 w-10 rounded-full object-cover border-2 border-transparent hover:border-gray-300"
              />
            </Link>
          </div>
        </div>
      )}
      <RecruiterModal open={recruiterModalOpen} setOpen={setRecruiterModalOpen} />
    </nav>
  );
}
