'use client'

import { Suspense } from 'react'
import JobsPage from './wrapper/JobsPageContent'
import { Loader } from '@/app/components/ui/Loader'

export default function Wrapper() {
  return (
    <Suspense fallback={<Loader message="Loading jobs" size="lg" />}>
      <JobsPage />
    </Suspense>
  )
}
