import { openSans } from '@/lib/fonts'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import logo from '/public/linkednorth-logo-white.png'

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/joblistings', label: 'Job Listings' },
  { href: '/contact', label: 'Contact Us' },
]

const socialLinks = [
  { href: '/coming-soon', label: 'Twitter' },
  { href: '/coming-soon', label: 'LinkedIn' },
  { href: '/coming-soon', label: 'Instagram' },
  { href: '/coming-soon', label: 'Tiktok' },
]

const communityLinks = [
  { href: '/coming-soon', label: 'Join Newsletter' },
  { href: '/coming-soon', label: 'Join Community' },
]

export default function Footer() {
  return (
    <div className={`${openSans.className} bg-[#262629] flex flex-col`}>
      <div className="container flex flex-col sm:flex-row sm:flex-wrap justify-between gap-10 sm:gap-16 border-b border-[#333333] px-6 sm:px-12 md:px-20 lg:px-28 pt-12 sm:pt-20 xl:pt-24 pb-6 sm:pb-8 mb-6 sm:mb-7">
        <div className="text-[#868D9B] text-sm sm:text-[0.92rem] font-normal max-w-sm">
          <div className="relative h-6 w-[120px] sm:w-[150px] mb-4 sm:mb-5">
            <Image
              src={logo}
              alt="LinkedNorth"
              quality={100}
              style={{ objectFit: 'contain' }}
            />
          </div>
          <p className="mb-5 sm:mb-7 leading-relaxed">
            Connect, share insights, and get support from a network of professionals on the same
            journey.
          </p>
          <p className="hidden sm:block">(c) 2026 LinkedNorth business Corporation</p>
        </div>
        <div className="flex flex-col gap-4 sm:gap-6 text-[#7A7A7A] text-sm">
          {quickLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-4 sm:gap-6 text-[#7A7A7A] text-sm">
          {socialLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-4 sm:gap-6 text-[#7A7A7A] text-sm">
          {communityLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="container text-center sm:text-right px-6 sm:px-12 md:px-20 lg:px-28 mb-6 sm:mb-7">
        <p className="text-[#868D9B] text-xs sm:text-[0.92rem] font-light">
          (c) 2026 LinkedNorth business Corporation
        </p>
      </div>
    </div>
  )
}
