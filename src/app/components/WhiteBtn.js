'use client'

import { Open_Sans } from 'next/font/google'
import Image from 'next/image'
import React from 'react'
// import discord from '/public/discord.png'

const openSans = Open_Sans({ subsets: ['latin'] })

export const WhiteBtn = ({text, img, link}) => {
  return (
    <button
      className={`${openSans.className} border flex items-center justify-center gap-2 border-btnBlack bg-white px-7 py-3 text-sm font-semibold text-btnBlack`}
    >
      <a href={link} target='_blank'>
      {text}
      </a>
      <Image src={img}/>
    </button>
  )
}
