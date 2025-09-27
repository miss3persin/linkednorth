'use client'

import Link from 'next/link'
import { useState } from 'react'
import logo from '/public/linkednorth-logo.png'
import Image from 'next/image'
import AuthModals from '../modals/AuthModals'
import { Open_Sans } from 'next/font/google'
import { Button } from '../ui/Button'
import { HiMenu, HiX } from 'react-icons/hi'

const openSans = Open_Sans({ subsets: ['latin'] })

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className={`${openSans.className} relative w-screen`}>
        <div className="fixed z-50 flex w-screen items-center justify-between bg-white px-8 sm:px-16 lg:px-32 py-4 shadow-sm">
          {/* Logo Centered */}
          <div className="relative h-10 w-[150px] flex-shrink-0 mx-auto mt-4 lg:mx-0">
            <Image
              src={logo}
              alt="LinkedNorth"
              layout="intrinsic"
              objectFit="contain"
              quality={100}
            />
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex lg:items-center lg:gap-10 text-[13px]  text-[#868D9B]">
            <ul className="flex gap-10">
              <li>Home</li>
              <li>Job Listings</li>
              <li>Career Resources</li>
              <li>Contact Us</li>
            </ul>
            <div className="flex items-center gap-3 ml-8">
              <Button text="Post A Job" img="" link="https://discord.com" variant="white" />
              <Button text="Login/SignUp" img="" variant="black" onClick={() => setOpen(true)} />
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
              <li className="hover:text-black cursor-pointer">Home</li>
              <li className="hover:text-black cursor-pointer">Job Listings</li>
              <li className="hover:text-black cursor-pointer">Career Resources</li>
              <li className="hover:text-black cursor-pointer">Contact Us</li>
            </ul>
            <div className="flex flex-col gap-4 mt-6">
              <Button text="Post A Job" img="" link="https://discord.com" variant="white" />
              <Button text="Login/SignUp" img="" variant="black" onClick={() => setOpen(true)} />
            </div>
          </div>
        )}
      </nav>

      <AuthModals open={open} setOpen={setOpen} />

    </>
  )
}
