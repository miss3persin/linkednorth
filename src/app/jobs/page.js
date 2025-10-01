'use client'

import Image from 'next/image'
import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { JobListingCard } from '../components/jobs/JobListingCard'
import { SearchBar } from '../components/ui/SearchBar'
import { Inter, Open_Sans } from 'next/font/google'
import stration_6 from '/public/Open Doodles Chilling.png'
import overlay from '/public/Overlay.png'

const openSans = Open_Sans({ subsets: ['latin'] })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter'  })

export default function JobBoard() {
  const [jobs] = useState([
    {
      id: 1,
      jobTitle: 'Frontend Developer',
      company: 'Apple',
      location: 'United Kingdom',
      jobType: 'On-site',
      contractType: 'Full-Time',
      postedTime: '2 hours ago',
      description: "We're looking for a skilled frontend developer to join our team in London.We're looking for a skilled frontend developer to join our team in London.We're looking for a skilled frontend developer to join our team in London.We're looking for a skilled frontend developer to join our team in London.We're looking for a skilled frontend developer to join our team in London.",
      imageSrc: '/apple.png',
      applyLink: 'https://google.com/careers',
      detailsLink: 'https://google.com/careers/frontend-developer'
    },
    {
      id: 2,
      jobTitle: 'Backend Developer',
      company: 'Uber',
      location: 'United States',
      jobType: 'Remote',
      contractType: 'Contract',
      postedTime: '1 day ago',
      description: 'Join our team to build scalable backend systems.',
      imageSrc: '/Uber.png',
      applyLink: 'https://amazon.jobs',
      detailsLink: 'https://amazon.jobs/backend-developer'
    },
    {
      id: 3,
      jobTitle: 'Product Manager',
      company: 'Microsoft',
      location: 'Canada',
      jobType: 'Hybrid',
      contractType: 'Full-Time',
      postedTime: '3 hours ago',
      description: 'Lead the product development for next-gen tools.',
      imageSrc: '/microsoft.png',
      applyLink: 'https://microsoft.com/careers',
      detailsLink: 'https://microsoft.com/careers/product-manager'
    },
    {
      id: 4,
      jobTitle: 'Product Manager',
      company: 'Netflix',
      location: 'Canada',
      jobType: 'Hybrid',
      contractType: 'Part-Time',
      postedTime: '5 hours ago',
      description: 'Lead the product development for next-gen tools.',
      imageSrc: '/Netflix.png',
      applyLink: 'https://microsoft.com/careers',
      detailsLink: 'https://netflix.com/jobs/product-manager'
    },
    {
      id: 5,
      jobTitle: 'Product Manager',
      company: 'Tesla',
      location: 'Canada',
      jobType: 'Hybrid',
      contractType: 'Internship',
      postedTime: '6 days ago',
      description: 'Lead the product development for next-gen tools.',
      imageSrc: '/Tesla.png',
      applyLink: 'https://microsoft.com/careers',
      detailsLink: 'https://tesla.com/careers/product-manager'
    },
    {
      id: 6,
      jobTitle: 'Product Manager',
      company: 'Reddit',
      location: 'Canada',
      jobType: 'Hybrid',
      contractType: 'Full-Time',
      postedTime: '1 week ago',
      description: 'Lead the product development for next-gen tools.',
      imageSrc: '/reddit.png',
      applyLink: 'https://microsoft.com/careers',
      detailsLink: 'https://redditinc.com/careers/product-manager'
    }
  ])

  // Get query params from search
  let jobTitleQuery = ''
  let countryQuery = ''
  if (typeof window !== 'undefined') {
    const searchParams = useSearchParams()
    jobTitleQuery = searchParams.get('jobTitle') || ''
    countryQuery = searchParams.get('country') || ''
  }

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesTitle = job.jobTitle
        .toLowerCase()
        .includes(jobTitleQuery.toLowerCase())
      const matchesCountry = job.location
        .toLowerCase()
        .includes(countryQuery.toLowerCase())
      return matchesTitle && matchesCountry
    })
  }, [jobs, jobTitleQuery, countryQuery])

  return (
    <div className="min-h-screen flex flex-col mt-20">
      {/* Hero */}
      <section className="relative bg-gray-50 w-full overflow-hidden py-5">
        {/* Overlay image on the right */}
        <div className="absolute right-0 bottom-0 h-full flex items-center pointer-events-none">
          <Image
            src={overlay}
            alt="overlay"
            className="w-auto h-full object-fill"
            priority
          />
        </div>

        {/* Content */}
        <div className="relative max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-[2.8rem] font-bold mb-2">Find your Dream Job</h2>
            <p className={`${inter.variable} text-[#737373] mb-6 font-light`}>
              Explore our job search platform, built to simplify your job hunt. <br />
              Navigate opportunities with ease and find the right position quickly and efficiently.
            </p>

            <SearchBar />
          </div>
        </div>

        {/* Hero image pinned to bottom */}
        <div className="absolute -bottom-4 left-3/4 -translate-x-3/4 w-[25rem]">
          <Image src={stration_6} alt="hero" width={1000} height={1000} />
        </div>
      </section>


      {/* Job Listings */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-3xl">
              {filteredJobs.length} jobs found
            </h3>
            <button className="flex items-center border px-3 py-1 rounded text-sm">
              Most Recent <ChevronDown size={16} className="ml-1" />
            </button>
          </div>

          {/* Job cards */}
          <div className="flex flex-col gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobListingCard
                  key={job.id}
                  jobTitle={job.jobTitle}
                  company={job.company}
                  location={job.location}
                  postedTime={job.postedTime}       // e.g. "3 hours ago"
                  jobType={job.jobType}             // e.g. "Full-Time"
                  contractType={job.contractType}   // e.g. "Contract"
                  description={job.description}
                  imageSrc={job.imageSrc}
                  applyLink={job.applyLink}
                  detailsLink={job.detailsLink}     // new button link
                />
              ))
            ) : (
              <p className="text-gray-600">No jobs match your search.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="border rounded p-6 h-fit">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <span className="bg-purple-100 text-purple-600 p-2 rounded">✉️</span>
            Subscribe for updates
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            We’ll ensure you stay informed whenever the best new job
            opportunities arise, so you’ll never miss out.
          </p>
          <input
            type="email"
            placeholder="Enter Email"
            className="border rounded px-4 py-2 w-full mb-3"
          />
          <button className="bg-black text-white px-4 py-2 w-full rounded">
            Subscribe
          </button>
        </aside>
      </main>
    </div>
  )
}
