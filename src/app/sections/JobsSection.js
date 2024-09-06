import React from 'react'
import { Inter } from 'next/font/google'
import { ApplicationCard } from '../components/ApplicationCard'
import { BlackBtn } from '../components/BlackBtn'
import arrow_right from '/public/chevron right.png'

const inter = Inter({ subsets: ['latin'] })

const jobData = [
  {
    jobTitle: 'Frontend Developer',
    company: 'Apple',
    location: 'United Kingdom',
    jobType: 'On-site',
    description:
      "We're looking for a skilled frontend developer to join our team in London.",
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
  // Add more jobs as needed
]

export const JobsSection = () => {
  return (
    <div className='container mb-48'>
      <div className='mb-10'>
        <p
          className={`${inter.className} px-52 text-center text-5xl font-bold text-headingBlack`}
        >
          Discover a world of opportunities that align with your skills
        </p>
      </div>

      <div className='grid mb-10 w-full grid-cols-1 gap-4 px-24 md:grid-cols-2 lg:grid-cols-3'>
        {jobData.map((job, index) => (
          <ApplicationCard
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

      <div className='flex items-center justify-center'>
      <BlackBtn text='Check More Job Listings' img={arrow_right} link=''/>
      </div>

    </div>
  )
}
