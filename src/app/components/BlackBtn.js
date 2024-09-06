'use client'

import { Open_Sans } from 'next/font/google'
import Image from 'next/image'
import React from 'react'
// import right_arrow from '/public/chevron right.png'

const openSans = Open_Sans({ subsets: ['latin'] })

export const BlackBtn = ({text, img, link}) => {
  return (
    <button
      className={`${openSans.className} border flex items-center justify-center gap-2 border-btnBlack bg-btnBlack px-7 py-3 text-sm text-white`}
    >
      <a href={link} target='_blank'>
      {text}
      </a>
      <Image src={img}/>
    </button>
  )
}
