export function saveJobsRedirect(searchParams) {
  if (!searchParams) return

  const query = searchParams.toString()
  const redirectTo = `/joblistings${query ? `?${query}` : ''}`

  localStorage.setItem('redirectAfterLogin', redirectTo)
}
