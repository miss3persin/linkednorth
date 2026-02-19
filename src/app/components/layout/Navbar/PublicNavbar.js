'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { saveJobsRedirect } from '../../../lib/authRedirect'
import { useState } from 'react'
import logo from '/public/linkednorth-logo.png'
import Image from 'next/image'
import AuthModals from '../../modals/AuthModals'
import { Open_Sans } from 'next/font/google'
import { Button } from '../../ui/Button'
import { HiMenu, HiX } from 'react-icons/hi'

const openSans = Open_Sans({ subsets: ['latin'] })

export default function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleOpenAuthModal = () => {
    setMenuOpen(false)

    if (pathname === '/jobs') {
      saveJobsRedirect(searchParams)
    }

    setAuthModalOpen(true)
  }


  return (
    <>
      <nav className={`${openSans.className} relative w-screen`}>
        <div className="fixed z-50 flex w-screen items-center justify-between bg-white px-8 sm:px-16 xl:px-[8%] py-4 shadow-sm">
          {/* Logo - Left */}
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

          {/* NavLinks - Centered Illusion */}
          <div className="hidden lg:flex flex-1 justify-center">
            <ul className="flex gap-10 xl:gap-12 text-[13px]">
              <li>
                <Link
                  href="/"
                  className={`${pathname === '/' ? 'text-black font-semibold' : 'text-[#868D9B]'} hover:text-black transition-colors`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className={`${(pathname === '/jobs' || pathname.startsWith('/jobs/')) ? 'text-black font-semibold' : 'text-[#868D9B]'} hover:text-black transition-colors`}
                >
                  Job Listings
                </Link>
              </li>
              <li>
                <Link
                  href="/coming-soon"
                  className={`${pathname === '/coming-soon' ? 'text-black font-semibold' : 'text-[#868D9B]'} hover:text-black transition-colors`}
                >
                  Career Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/coming-soon"
                  className={`${pathname === '/contact' ? 'text-black font-semibold' : 'text-[#868D9B]'} hover:text-black transition-colors`}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Buttons - Right */}
          <div className="hidden lg:flex items-center gap-4 ml-8">
            <Button
              text="Post A Job"
              img=""
              variant="white"
              onClick={handleOpenAuthModal}
              className="!px-5 !py-2"
            />
            <Button
              text="Login/SignUp"
              img=""
              variant="black"
              onClick={handleOpenAuthModal}
              className="!px-5 !py-2"
            />
          </div>

          {/* Mobile Hamburger */}
          <div className="lg:hidden flex items-center z-50">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-2xl focus:outline-none"
            >
              {menuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>

        {/* Fullscreen Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden fixed top-0 left-0 w-screen h-screen bg-white z-40 flex flex-col items-center justify-center gap-10">
            <ul className="flex flex-col gap-8 text-[20px] text-[#868D9B] text-center">
              <li className="hover:text-black cursor-pointer">
                <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
              </li>
              <li className="hover:text-black cursor-pointer">
                <Link href="/jobs" onClick={() => setMenuOpen(false)}>Job Listings</Link>
              </li>
              <li className="hover:text-black cursor-pointer">
                <Link href="/coming-soon" onClick={() => setMenuOpen(false)}>Career Resources</Link>
              </li>
              <li className="hover:text-black cursor-pointer">
                <Link href="/coming-soon" onClick={() => setMenuOpen(false)}>Contact Us</Link>
              </li>
            </ul>
            <div className="flex flex-col gap-4 mt-6">
              <Button
                text="Post A Job"
                img=""
                variant="white"
                onClick={handleOpenAuthModal}
              />
              <Button
                text="Login/SignUp"
                img=""
                variant="black"
                onClick={handleOpenAuthModal}
              />
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      <AuthModals open={authModalOpen} setOpen={setAuthModalOpen} />
    </>
  )
}