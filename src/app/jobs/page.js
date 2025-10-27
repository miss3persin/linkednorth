'use client'

import { Suspense } from 'react'
import JobsPage from './wrapper/JobsPageContent'

export default function Wrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobsPage />
    </Suspense>
  )
}
