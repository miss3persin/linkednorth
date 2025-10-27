'use client'

import { Open_Sans } from 'next/font/google'
import Image from 'next/image'
import React from 'react'

const openSans = Open_Sans({ subsets: ['latin'] })

export const Button = ({
  text,
  img,
  link,
  variant = "white",
  onClick, // accept onClick
}) => {
  const baseStyles =
    "border flex items-center justify-center gap-2 px-4 sm:px-6 xl:px-8 py-2 sm:py-3 text-xs xl:text-sm w-full sm:w-auto rounded-sm"
  const variants = {
    white: "border-[#181818] bg-white font-semibold text-[#181818]",
    black: "border-[#181818] bg-[#181818] text-white",
  }

  // If `link` is provided, render an <a>
  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-full sm:w-auto ${openSans.className} ${baseStyles} ${variants[variant]}`}
      >
        {text}
        {img && <Image src={img} alt="button-icon" />}
      </a>
    )
  }

  // Otherwise render a <button>
  return (
    <button
      onClick={onClick}
      className={`${openSans.className} ${baseStyles} ${variants[variant]}`}
    >
      {text}
      {img && <Image src={img} alt="button-icon" />}
    </button>
  )
}
