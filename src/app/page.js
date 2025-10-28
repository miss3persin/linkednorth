'use client'
import React from 'react'
import { Inter, Open_Sans } from 'next/font/google'
import { SearchBar } from './components/ui/SearchBar'
import { Button } from './components/ui/Button'
import { JobCard } from './components/jobs/JobCard'
import features from '/public/features_img.png'
import stration_1 from '/public/Yuppies Bust.png'
import stration_2 from '/public/Yuppies Sitting On Chair.png'
import startion_3 from '/public/Big Shoes Sitting on Rock.png'
import stration_4 from '/public/Big Shoes Torso.png'
import stration_5 from '/public/Yuppies Remote Team.png'
import airbnb from '/public/Airbnb.png'
import reddit from '/public/Reddit.png'
import tesla from '/public/Tesla.png'
import uber from '/public/Uber.png'
import netflix from '/public/Netflix.png'
import microsoft from '/public/Microsoft.png'
import arrow_right from '/public/chevron right.png'
import discord_img from '/public/discord.png'
import feedback_img from '/public/feedback_img.png'
import Marquee from 'react-fast-marquee'
import Image from 'next/image'

const openSans = Open_Sans({ subsets: ['latin'] })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const jobData = [
  {
    jobTitle: 'Frontend Developer',
    company: 'Apple',
    location: 'United Kingdom',
    jobType: 'On-site',
    description: "We're looking for a skilled frontend developer to join our team in London.",
    imageSrc: '/apple.png',
    applyLink: 'https://google.com/careers'
  },
  {
    jobTitle: 'Backend Developer',
    company: 'Uber',
    location: 'United States',
    jobType: 'Remote',
    description: 'Join our team to build scalable backend systems.',
    imageSrc: '/Uber.png',
    applyLink: 'https://amazon.jobs'
  },
  {
    jobTitle: 'Product Manager',
    company: 'Microsoft',
    location: 'Canada',
    jobType: 'Hybrid',
    description: 'Lead the product development for next-gen tools.',
    imageSrc: '/microsoft.png',
    applyLink: 'https://microsoft.com/careers'
  },
  {
    jobTitle: 'Product Manager',
    company: 'Netflix',
    location: 'Canada',
    jobType: 'Hybrid',
    description: 'Lead the product development for next-gen tools.',
    imageSrc: '/Netflix.png',
    applyLink: 'https://microsoft.com/careers'
  },
  {
    jobTitle: 'Product Manager',
    company: 'Tesla',
    location: 'Canada',
    jobType: 'Hybrid',
    description: 'Lead the product development for next-gen tools.',
    imageSrc: '/Tesla.png',
    applyLink: 'https://microsoft.com/careers'
  },
  {
    jobTitle: 'Product Manager',
    company: 'Reddit',
    location: 'Canada',
    jobType: 'Hybrid',
    description: 'Lead the product development for next-gen tools.',
    imageSrc: '/reddit.png',
    applyLink: 'https://microsoft.com/careers'
  }
]

export default function HomePage() {
  return (
    <div className="relative">

      {/* Hero Section */}
      <section>
        <div className="container relative px-16 pt-40 mb-48 flex flex-col items-center max-xl:px-8 max-lg:px-6 max-md:px-4 max-lg:pt-24 max-sm:pt-20 max-sm:mb-24">
          {/* Background Illustrations */}
          <div className="absolute bottom-0 items-center justify-between w-full px-10 hidden xl:flex">
            <Image src={stration_2} alt="" layout="intrinsic" className="mt-10" />
            <Image src={stration_1} alt="" layout="intrinsic" className="mb-52" />
          </div>

          {/* Headings */}
          <div className="w-full">
            <p
              className={`${inter.variable} mb-5 xs:mt-0 mt-5 px-16 text-center text-[4.1rem] xs:font-extrabold font-bold leading-tight text-[#333333] max-xl:text-[3.2rem] max-lg:text-[2.5rem] max-md:text-[2rem] max-sm:text-[1.7rem] max-sm:px-4`}
            >
              Find Your Next Role, Verified and{" "}
              <span className="text-[#A0A6B1]">Secured.</span>
            </p>
            <p
              className={`${openSans.className} mb-5 px-[22rem] text-center leading-loose text-[#868D9B] max-xl:px-[12rem] max-lg:px-[6rem] max-md:px-[2rem] max-sm:px-4 max-sm:text-sm`}
            >
              Job search platform worldwide. We connect freelancers and startups
              in an easy way and good collaboration
            </p>
          </div>

          {/* Search Bar */}
          <div className="xs:mb-36 mb-28 flex items-center justify-center max-md:mb-16">
            <SearchBar />
          </div>

          {/* Trusted Companies */}
          <div className="w-full">
            <p className="mb-7 text-center text-sm text-[#868D9B] max-sm:mb-4">
              Trusted by 500+ Companies
            </p>
            <div className="container px-52 max-xl:px-32 max-lg:px-16 max-md:px-8 max-sm:px-4">
              <Marquee gradient={true} speed={30} autoFill={true}>
                <div className="flex gap-8 items-center">
                  <Image src={reddit} alt="" width={100} height={100} className="w-20 max-sm:w-16" />
                  <Image src={airbnb} alt="" width={100} height={100} className="w-20 max-sm:w-16" />
                  <Image src={tesla} alt="" width={100} height={100} className="w-20 max-sm:w-16" />
                  <Image src={uber} alt="" width={100} height={100} className="w-20 max-sm:w-16" />
                  <Image src={netflix} alt="" width={100} height={100} className="w-20 max-sm:w-16" />
                  <Image src={microsoft} alt="" width={100} height={100} className="w-20 max-sm:w-16" />
                </div>
              </Marquee>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="container flex flex-col lg:flex-row px-4 sm:px-8 md:px-16 xl:px-24 mb-24 sm:mb-36 md:mb-48 items-center gap-10 lg:gap-0 max-md:mb-24">

          {/* --- Left Section (Text + Buttons) --- */}
          <div className="w-full text-center lg:text-left">
            <p
              className={`${inter.variable} text-headingBlack text-3xl sm:text-4xl md:text-5xl mb-6 sm:mb-10 font-bold max-w-lg mx-auto lg:mx-0`}
            >
              What Makes Us Different
            </p>

            <div className="mb-6 sm:mb-10 w-[24rem] lg:block hidden relative mx-auto lg:mx-0">
              <Image src={features} alt="" />
            </div>

            {/* 👇 This wrapper ensures image/buttons can reorder independently */}
            <div className="flex flex-col sm:flex-col lg:flex-col gap-6">
              {/* Image (swaps above buttons only on xs) */}
              <div className="order-1 sm:order-1 lg:hidden block relative">
                <Image src={startion_3} alt="" className="w-full" />
                <div className="w-full h-16 sm:h-24 absolute bg-gradient-to-b from-transparent via-white/95 to-white bottom-[0.21rem]"></div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 justify-center lg:justify-start order-2 sm:order-2">
                <Button text="Check Career Resources" img={arrow_right} link="/resources" variant="black" />
                <Button text="Join Our Discord" img={discord_img} link="https://www.google.com/" variant="white" />
              </div>
            </div>
          </div>

          {/* --- Right SectionMain image for larger screens) --- */}
          <div className="w-full relative max-md:mt-10 hidden lg:block">
            <Image src={startion_3} alt="" className="w-full" />
            <div className="w-full h-16 sm:h-24 bg-gradient-to-b from-transparent via-white/95 to-white absolute bottom-0"></div>
          </div>
        </div>
      </section>


      {/* Resume Section */}
      <section>
        <div className="container flex flex-col lg:flex-row px-4 sm:px-8 md:px-16 xl:px-24 mb-24 sm:mb-36 md:mb-48 items-center gap-10 lg:gap-0">

          {/* Image — stays left on large, but moves right below heading on xs */}
          <div className="lg:block hidden lg:w-4/6 relative max-sm:order-2 lg:order-1">
            <Image src={stration_4} alt="" />
          </div>

          {/* Text Section */}
          <div className="w-full flex flex-col max-sm:order-1 lg:order-2">
            {/* Heading */}
            <p
              className={`${inter.variable} text-[#333333] text-center lg:text-left text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-7 pt-3 font-bold`}
            >
              Get Your Resume Reviewed by Top{" "}
              <span className="text-[#A0A6B1]">Recruiters</span>
            </p>

            {/* On small screens, we re-insert the image here so it comes right after the heading */}
            <div className="w-full relative my-4 lg:hidden items-center justify-center flex">
              <Image src={stration_4} alt="" />
            </div>

            {/* Paragraph + Button stay at the bottom */}
            <p
              className={`${openSans.className} mb-5 text-center lg:text-left leading-loose text-[#868D9B] max-sm:text-sm max-w-full lg:max-w-lg`}
            >
              Receive expert feedback from recruiters who've worked with leading
              brands to elevate your resume.
            </p>
            <div className="lg:w-full mx-auto">
              <Button
                text="Check Resume -$25"
                img={arrow_right}
                link=""
                variant="black"
              />
            </div>
          </div>
        </div>
      </section>



      {/* Jobs Section */}
      <section>
        <div className="container mb-24 sm:mb-36 md:mb-48">
          <div className="mb-6 sm:mb-10">
            <p className={`${inter.variable} px-4 sm:px-8 md:px-16 xl:px-52 text-center text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold text-headingBlack`}>
              Discover a world of opportunities that align with your skills
            </p>
          </div>

          <div className="grid mb-10 w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-8 md:px-16 xl:px-24">
            {jobData.map((job, index) => (
              <JobCard
                key={index}
                jobTitle={job.jobTitle}
                company={job.company}
                location={job.location}
                jobType={job.jobType}
                description={job.description}
                imageSrc={job.imageSrc}
                applyLink={job.applyLink}
              />
            ))}
          </div>

          <div className="flex items-center justify-center sm:w-full w-5/6 mx-auto">
            <Button text="Check More Job Listings" img={arrow_right} link="/jobs" variant="black" />
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section>
        <div className="container flex flex-col lg:flex-row-reverse px-4 sm:px-8 md:px-16 xl:px-24 mb-24 sm:mb-36 md:mb-48 items-center gap-14">

          {/* Text Section */}
          <div className="w-full flex flex-col max-sm:order-1 lg:order-1">
            {/* Heading */}
            <p
              className={`${inter.variable} text-[#333333] lg:text-left text-center text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-5 pt-3 font-bold lg:max-w-lg`}
            >
              Real Feedback from Job Seekers{" "}
              <span className="text-[#A0A6B1]">Like You</span>
            </p>

            {/* Image appears right below heading on small screens only */}
            <div className="w-5/6 relative my-4 sm:hidden justify-center mx-auto">
              <Image src={feedback_img} alt="" />
            </div>

            {/* Paragraph + Button stay below */}
            <p
              className={`${openSans.className} mb-5 text-center lg:text-left leading-loose text-[#868D9B] max-sm:text-sm max-w-full lg:max-w-lg`}
            >
              Discover genuine reviews and experiences from our community of job
              seekers. Discover genuine reviews and experiences from our community of
              job seekers.
            </p>

            <div className="w-fit justify-center lg:justify-start mx-auto lg:mx-0">
              <Button
                text="Check More Job Listings"
                img={arrow_right}
                link="/jobs"
                variant="black"
              />
            </div>
          </div>

          {/* Image - large screens only */}
          <div className="w-full lg:w-5/6 relative flex max-md:hidden">
            <Image src={feedback_img} alt="" />
          </div>
        </div>
      </section>


      {/* Connect Section */}
      <section>
        <div className="container flex flex-col lg:flex-row px-4 sm:px-8 md:px-16 xl:px-24 mb-20 items-center gap-10 lg:gap-0">

          {/* Image - large screens only */}
          <div className="w-full relative max-lg:hidden">
            <Image src={stration_5} alt="" />
          </div>

          {/* Text Section */}
          <div className="w-full flex flex-col">
            {/* Heading */}
            <p
              className={`${inter.variable} text-[#333333] lg:text-left text-center text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-5 pt-6 sm:pt-14 font-bold`}
            >
              Sign Up to Get Job Alerts
            </p>

            {/* Image - shows below heading on small screens */}
            <div className="w-full relative my-4 lg:hidden items-center justify-center flex">
              <Image src={stration_5} alt="" />
            </div>

            {/* Paragraph + Buttons stay below */}
            <p
              className={`${openSans.className} mb-5 text-center lg:text-left leading-loose text-[#868D9B] max-sm:text-sm max-w-full lg:max-w-lg`}
            >
              Our powerful job matching technology will send job matches right into your inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 justify-center lg:justify-start mx-auto lg:mx-0">
              <Button
                text="Find Your Future Job"
                link="https://www.google.com/"
                variant="black"
              />
            </div>
          </div>
        </div>
      </section>


    </div>
  )
}
