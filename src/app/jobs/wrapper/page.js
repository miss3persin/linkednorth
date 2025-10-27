import { Suspense } from "react"
import JobsPage from "./jobs/page"

export const dynamic = "force-dynamic";

export default function Jobs() {
  return (
    <Suspense fallback={<div className="mt-20 text-center">Loading jobs...</div>}>
      <JobsPage />
    </Suspense>
  )
}
