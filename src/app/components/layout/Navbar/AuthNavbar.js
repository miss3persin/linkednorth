'use client';

import Link from "next/link";
import Image from 'next/image';
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import logo from '/public/linkednorth-logo.png';
import dynamic from 'next/dynamic';

const AuthModals = dynamic(() => import('@/app/components/modals/AuthModals'), { ssr: false });
const RecruiterModal = dynamic(() => import('@/app/components/modals/RecruiterModal'), { ssr: false });
const AuthNavbarActions = dynamic(() => import('./AuthNavbarActions'), { ssr: false });

import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Open_Sans } from 'next/font/google';

const openSans = Open_Sans({ subsets: ['latin'] });

export default function AuthNavbar({ userData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [recruiterModalOpen, setRecruiterModalOpen] = useState(false);

  const { user } = useUser();
  const pathname = usePathname();
  const isRecruiter = !!user?.publicMetadata?.isRecruiter;

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
          <AuthNavbarActions
            user={user}
            userData={userData}
            onPostJobClick={handlePostJobClick}
          />
        </div>
        <button
          className="lg:hidden text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex flex-col overflow-y-auto bg-white px-6 py-6">
          <div className="flex items-center justify-between border-b pb-3">
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
          <div className="flex flex-1 flex-col items-center justify-center gap-5 pt-6">
            <Link href="/" onClick={() => setMenuOpen(false)} className="text-base hover:text-black">Home</Link>
            <Link href="/joblistings" onClick={() => setMenuOpen(false)} className="text-base hover:text-black">Job Listings</Link>
            <Link href="/coming-soon" onClick={() => setMenuOpen(false)} className="text-base hover:text-black">Career Resources</Link>
            <Link href="/coming-soon" onClick={() => setMenuOpen(false)} className="text-base hover:text-black">Contact Us</Link>
            <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-base hover:text-black">Notifications</Link>
            <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-base hover:text-black">Messages</Link>
            <button
              onClick={() => {
                setMenuOpen(false);
                handlePostJobClick();
              }}
              className="text-base font-medium hover:text-black"
            >
              Post A Job
            </button>
            <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
              <Image
                src={userData?.imageUrl || logo.src}
                alt={userData?.firstName ? `${userData.firstName} ${userData.lastName || ''}`.trim() : 'profile'}
                width={40}
                height={40}
                className="rounded-full border-2 border-transparent hover:border-gray-300"
                unoptimized
              />
            </Link>
          </div>
        </div>
      )}
      <RecruiterModal open={recruiterModalOpen} setOpen={setRecruiterModalOpen} />
    </nav>
  );
}
