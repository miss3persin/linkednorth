export function buildSaveJobPayload(job, userId) {
  if (!userId) throw new Error('Missing userId when building save payload')
  if (!job) throw new Error('Missing job data when building save payload')

  const jobId = job.id || job.jobId
  if (!jobId) throw new Error('Missing job identifier when building save payload')

  const title =
    job.title ??
    job.jobTitle ??
    job.position ??
    job.name ??
    job.job_name ??
    'Untitled Role'

  const applyUrl =
    job.apply_url ??
    job.applyUrl ??
    job.applyLink ??
    job.externalApplyUrl ??
    null

  const externalSource =
    job.external_source ??
    job.externalSource ??
    job.source ??
    job.detailsLink ??
    null

  return {
    userId,
    jobId,
    title,
    company: job.company ?? null,
    location: job.location ?? null,
    description: job.description ?? null,
    apply_url: applyUrl,
    external_source: externalSource,
  }
}
