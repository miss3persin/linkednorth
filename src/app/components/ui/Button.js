'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const Button = ({
  text,
  img,
  link,
  variant = "white",
  onClick,
  className = "",
}) => {
  const baseStyles =
    "border flex items-center justify-center gap-2 px-4 sm:px-6 xl:px-8 py-2 sm:py-3 text-xs xl:text-sm w-full sm:w-auto rounded-sm transition-all duration-200"

  const variants = {
    white: "border-[#181818] bg-white font-semibold text-[#181818] hover:bg-gray-100",
    black: "border-[#181818] bg-[#181818] text-white hover:bg-[#333333]",
    ghost: "border-transparent bg-transparent text-blue-600 hover:underline px-0 py-0 w-auto",
  }

  const isInternal = link && link.startsWith('/') && !link.startsWith('//');

  const content = (
    <>
      {text}
      {img && <Image src={img} alt="button-icon" />}
    </>
  );

  if (link) {
    if (isInternal) {
      return (
        <Link
          href={link}
          className={`w-full sm:w-auto font-sans ${baseStyles} ${variants[variant]} ${className}`}
        >
          {content}
        </Link>
      )
    }
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-full sm:w-auto font-sans ${baseStyles} ${variants[variant]} ${className}`}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`font-sans ${baseStyles} ${variants[variant]} ${className}`}
    >
      {content}
    </button>
  )
}
