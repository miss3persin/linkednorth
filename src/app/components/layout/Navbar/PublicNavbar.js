'use client'

import Link from 'next/link'
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

  const handleOpenAuthModal = () => {
    setMenuOpen(false) // Close mobile menu if open
    setAuthModalOpen(true) // Open auth modal
  }

  return (
    <>
      <nav className={`${openSans.className} relative w-screen`}>
        <div className="fixed z-50 flex w-screen items-center justify-between bg-white px-8 sm:px-16 xl:px-32 py-4 shadow-sm">
          {/* Logo Centered */}
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

          {/* Desktop Links */}
          <div className="hidden lg:flex lg:items-center lg:gap-10 text-[13px]  text-[#868D9B]">
            <ul className="flex gap-8 xl:gap-10">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/jobs">Job Listings</Link></li>
              <li><Link href="/resources">Career Resources</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
            <div className="flex items-center gap-3 ml-6">
              <Button 
                text="Post A Job" 
                img="" 
                link="/post-job" 
                variant="white" 
              />
              <Button 
                text="Login/SignUp" 
                img="" 
                variant="black" 
                onClick={handleOpenAuthModal}
              />
            </div>
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
                <Link href="/resources" onClick={() => setMenuOpen(false)}>Career Resources</Link>
              </li>
              <li className="hover:text-black cursor-pointer">
                <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link>
              </li>
            </ul>
            <div className="flex flex-col gap-4 mt-6">
              <Button 
                text="Post A Job" 
                img="" 
                link="/post-job" 
                variant="white"
                onClick={() => setMenuOpen(false)}
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