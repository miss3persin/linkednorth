'use client'

import { Suspense } from 'react'
import JobListingsPage from './wrapper/AllJobListings'

export default function Wrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobListingsPage />
    </Suspense>
  )
}
