'use client'
import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSessionContext } from '@/app/lib/supabaseAuthContext'
import AuthModals from './components/modals/AuthModals'
import { inter, openSans } from '@/lib/fonts'
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
import Loader from './components/ui/Loader'
export default function HomePage() {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  // const searchParams = useSearchParams()
  const router = useRouter()
  const { session, isLoading } = useSessionContext()
  const [heroJobs, setHeroJobs] = useState([])
  const [isLoadingHeroJobs, setIsLoadingHeroJobs] = useState(true)

  useEffect(() => {
    if (!isLoading && session && window.location.pathname === '/') {
      router.push('/dashboard');
    }
  }, [isLoading, session, router]);

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    const TARGET_HERO_JOBS = 6
    const PAGE_LIMIT = 60
    const MAX_PAGES = 4

    const loadJobs = async () => {
      try {
        let offset = 0
        let jobsWithDescription = []
        let lastBatchSize = PAGE_LIMIT

        while (
          offset < PAGE_LIMIT * MAX_PAGES &&
          jobsWithDescription.length < TARGET_HERO_JOBS &&
          lastBatchSize === PAGE_LIMIT
        ) {
          const res = await fetch(
            `/api/jobs?limit=${PAGE_LIMIT}&offset=${offset}&sort=recent`,
            {
              signal: controller.signal,
              cache: 'no-store',
            }
          )

          if (!res.ok) throw new Error('Failed to fetch jobs')
          const data = await res.json()
          const batch = Array.isArray(data?.jobs) ? data.jobs : []
          lastBatchSize = batch.length

          const filtered = batch.filter(
            (job) =>
              job &&
              typeof job.description === 'string' &&
              job.description.trim().length > 0
          )

          jobsWithDescription = jobsWithDescription.concat(filtered)
          offset += PAGE_LIMIT
        }

        if (!isMounted) return

        const shuffled = [...jobsWithDescription].sort(
          () => Math.random() - 0.5
        )

        let finalJobs = []
        if (shuffled.length >= TARGET_HERO_JOBS) {
          finalJobs = shuffled.slice(0, TARGET_HERO_JOBS)
        } else if (shuffled.length > 0) {
          while (finalJobs.length < TARGET_HERO_JOBS) {
            finalJobs.push(
              shuffled[finalJobs.length % shuffled.length]
            )
          }
        }

        setHeroJobs(finalJobs)
      } catch (error) {
        if (error?.name === 'AbortError') {
          return
        }
        console.error('Failed to load hero jobs', error)
      } finally {
        if (isMounted) setIsLoadingHeroJobs(false)
      }
    }

    void loadJobs()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center mt-30">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
      </div>
    )
  }

  // Don't render anything if user is signed in (will redirect)
  if (session) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center gap-6">
              <Loader
                variant="loading"
                size="lg"
                spinnerColor="#e5e7eb"
                accentColor="#1a1354"
                showMessage={false}
                className="animate-pulse"
              />
        <div className="text-sm uppercase tracking-[0.35em] text-gray-500">Redirecting...</div>
      </div>
    )
  }

  return (
    <div className="relative">
      <section>
        <div className="container relative px-16 pt-32 mb-48 flex flex-col items-center max-xl:px-8 max-lg:px-6 max-md:px-4 max-lg:pt-24 max-sm:pt-20 max-sm:mb-24">
          <div className="absolute bottom-0 items-center justify-between w-full px-10 hidden xl:flex">
            <Image src={stration_2} alt="" layout="intrinsic" className="mt-10" />
            <Image src={stration_1} alt="" layout="intrinsic" className="mb-52" />
          </div>
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
          <div className="xs:mb-36 mb-28 flex items-center justify-center max-md:mb-16">
            <SearchBar />
          </div>
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
      <section>
        <div className="container flex flex-col lg:flex-row px-4 sm:px-8 md:px-16 xl:px-24 mb-24 sm:mb-36 md:mb-48 items-center gap-10 lg:gap-0 max-md:mb-24">
          <div className="w-full text-center lg:text-left">
            <p
              className={`${inter.variable} text-headingBlack text-3xl sm:text-4xl md:text-5xl mb-6 sm:mb-10 font-bold max-w-lg mx-auto lg:mx-0`}
            >
              What Makes Us Different
            </p>

            <div className="mb-6 sm:mb-10 w-[24rem] lg:block hidden relative mx-auto lg:mx-0">
              <Image src={features} alt="" />
            </div>
            <div className="flex flex-col sm:flex-col lg:flex-col gap-6">
              <div className="order-1 sm:order-1 lg:hidden block relative">
                <Image src={startion_3} alt="" className="w-full" />
                <div className="w-full h-16 sm:h-24 absolute bg-gradient-to-b from-transparent via-white/95 to-white bottom-[0.21rem]"></div>
              </div>
              <div className="flex items-center justify-center lg:justify-stretch max-w-none lg:max-w-md">
                <Button text="Join Our Discord" img={discord_img} link="/coming-soon" variant="white" />
              </div>
            </div>
          </div>
          <div className="w-full relative max-md:mt-10 hidden lg:block">
            <Image src={startion_3} alt="" className="w-full" />
            <div className="w-full h-16 sm:h-24 bg-gradient-to-b from-transparent via-white/95 to-white absolute bottom-0"></div>
          </div>
        </div>
      </section>
      <section>
        <div className="container flex flex-col lg:flex-row px-4 sm:px-8 md:px-16 xl:px-24 mb-24 sm:mb-36 md:mb-48 items-center gap-10 lg:gap-0">
          <div className="lg:block hidden lg:w-4/6 relative max-sm:order-2 lg:order-1">
            <Image src={stration_4} alt="" />
          </div>
          <div className="w-full flex flex-col max-sm:order-1 lg:order-2">
            <p
              className={`${inter.variable} text-[#333333] text-center lg:text-left text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-7 pt-3 font-bold`}
            >
              Build A Standout Resume That Attracts Top{" "}
              <span className="text-[#A0A6B1]">Recruiters</span>
            </p>
            <div className="w-full relative my-4 lg:hidden items-center justify-center flex">
              <Image src={stration_4} alt="" />
            </div>
            <p
              className={`${openSans.className} mb-5 text-center lg:text-left leading-loose text-[#868D9B] max-sm:text-sm max-w-full lg:max-w-lg`}
            >
              Create a standout resume with our tool, built to impress the recruiters who matter most.
            </p>
            <div className="lg:w-full mx-auto">
              <Button
                text="Build Your Resume"
                img={arrow_right}
                onClick={() => setAuthModalOpen(true)}
                variant="black"
              />
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container mb-24 sm:mb-36 md:mb-48">
          <div className="mb-6 sm:mb-10">
            <p className={`${inter.variable} px-4 sm:px-8 md:px-16 xl:px-52 text-center text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold text-headingBlack`}>
              Discover a world of opportunities that align with your skills
            </p>
          </div>

          <div className="mx-auto mb-10 grid w-full max-w-7xl grid-cols-1 gap-4 place-items-center
                sm:grid-cols-2 lg:grid-cols-3
                px-4 sm:px-8 md:px-16 xl:px-24">
            {isLoadingHeroJobs ? (
              <div className="col-span-full flex w-full justify-center">
                <Loader variant="loading" size="lg" spinnerColor="#1d1d1f" accentColor="#1d1d1f" showMessage={false} />
              </div>
            ) : (
              heroJobs.map((job) => (
                <JobCard
                  key={job.id || job.jobId || job.jobTitle}
                  jobTitle={job.jobTitle || job.title || 'Opportunity'}
                  company={job.company}
                  location={job.location || 'Remote'}
                  jobType={job.jobType || 'Remote'}
                  description={job.description || job.summary || ''}
                  imageSrc={job.imageSrc || job.companyLogo || null}
                  applyLink={job.applyLink || job.detailsLink || '/jobs'}
                />
              ))
            )}
          </div>


          <div className="flex items-center justify-center sm:w-full w-5/6 mx-auto">
            <Button text="Check More Job Listings" img={arrow_right} link="/jobs" variant="black" />
          </div>
        </div>
      </section>
      <section>
        <div className="container flex flex-col lg:flex-row-reverse px-4 sm:px-8 md:px-16 xl:px-24 mb-24 sm:mb-36 md:mb-48 items-center gap-14">
          <div className="w-full flex flex-col max-sm:order-1 lg:order-1">
            <p
              className={`${inter.variable} text-[#333333] lg:text-left text-center text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-5 pt-3 font-bold lg:max-w-lg`}
            >
              Real Feedback from Job Seekers{" "}
              <span className="text-[#A0A6B1]">Like You</span>
            </p>
            <div className="w-5/6 relative my-4 sm:hidden justify-center mx-auto">
              <Image src={feedback_img} alt="" />
            </div>
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
          <div className="w-full lg:w-5/6 relative flex max-md:hidden">
            <Image src={feedback_img} alt="" />
          </div>
        </div>
      </section>
      <section>
        <div className="container flex flex-col lg:flex-row px-4 sm:px-8 md:px-16 xl:px-24 mb-20 items-center gap-10 lg:gap-0">
          <div className="w-full relative max-lg:hidden">
            <Image src={stration_5} alt="" />
          </div>
          <div className="w-full flex flex-col">
            <p
              className={`${inter.variable} text-[#333333] lg:text-left text-center text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-5 pt-6 sm:pt-14 font-bold`}
            >
              Sign Up to Get Job Alerts
            </p>
            <div className="w-full relative my-4 lg:hidden items-center justify-center flex">
              <Image src={stration_5} alt="" />
            </div>
            <p
              className={`${openSans.className} mb-5 text-center lg:text-left leading-loose text-[#868D9B] max-sm:text-sm max-w-full lg:max-w-lg`}
            >
              Our powerful job matching technology will send job matches right into your inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 justify-center lg:justify-start mx-auto lg:mx-0">
              <Button
                text="Subscribe"
                link="/jobs"
                variant="black"
              />
            </div>
          </div>
        </div>
      </section>


      <AuthModals open={authModalOpen} setOpen={setAuthModalOpen} />
    </div>
  )
}
