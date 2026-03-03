'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import logo from '/public/linkednorth-logo.png'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Open_Sans } from 'next/font/google'
import { Button } from '../../ui/Button'
import { HiMenu, HiX } from 'react-icons/hi'

const AuthModals = dynamic(() => import('../../modals/AuthModals'), { ssr: false });
const openSans = Open_Sans({ subsets: ['latin'] })

export default function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  const pathname = usePathname()

  const handleOpenAuthModal = () => {
    setMenuOpen(false)
    setAuthModalOpen(true)
  }


  return (
    <>
      <nav className={`${openSans.className} relative w-screen`}>
        <div className="fixed z-50 flex w-screen items-center justify-between bg-white px-8 sm:px-16 xl:px-[8%] py-4 shadow-sm">
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
                  href="/contact"
                  className={`${pathname === '/contact' ? 'text-black font-semibold' : 'text-[#868D9B]'} hover:text-black transition-colors`}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="hidden lg:flex items-center gap-4 ml-8">
            <Button
              text="Post A Job"
              img=""
              variant="white"
              onClick={handleOpenAuthModal}
              className="!px-5 !py-3"
            />
            <Button
              text="Login/SignUp"
              img=""
              variant="black"
              onClick={handleOpenAuthModal}
              className="!px-5 !py-3"
            />
          </div>
          <div className="lg:hidden flex items-center z-50">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-2xl focus:outline-none"
            >
              {menuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex flex-col items-center justify-center overflow-y-auto bg-white px-6 py-10 text-center">
            <ul className="flex w-full flex-col gap-6 text-[18px] text-[#868D9B]">
              <li className="hover:text-black">
                <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
              </li>
              <li className="hover:text-black">
                <Link href="/jobs" onClick={() => setMenuOpen(false)}>Job Listings</Link>
              </li>
              <li className="hover:text-black">
                <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link>
              </li>
            </ul>
            <div className="flex w-full max-w-xs flex-col gap-3 mt-6">
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
      <AuthModals open={authModalOpen} setOpen={setAuthModalOpen} />
    </>
  )
}
