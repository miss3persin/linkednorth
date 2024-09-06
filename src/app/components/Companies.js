'use client'

import Image from 'next/image'
import React from 'react'
import airbnb from '/public/Airbnb.png'
import reddit from '/public/Reddit.png'
import tesla from '/public/Tesla.png'
import uber from '/public/Uber.png'
import netflix from '/public/Netflix.png'
import microsoft from '/public/Microsoft.png'
import Marquee from 'react-fast-marquee'

export const Companies = () => {
  return (
    <div className='container px-52'>
    <Marquee gradient={true} speed={30} autoFill={true} className=''>
      <div className='flex gap-8'>
        <Image src={reddit} width={100} height={100} className='w-full ml-8' />
        <Image src={airbnb} width={100} height={100} className='w-full' />
        <Image src={tesla} width={100} height={100} className='w-full' />
        <Image src={uber} width={100} height={100} className='w-full' />
        <Image src={netflix} width={100} height={100} className='w-full' />
        <Image src={microsoft} width={100} height={100} className='w-full' />
      </div>
    </Marquee>
    </div>
  )
}
