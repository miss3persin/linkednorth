import { NextResponse } from 'next/server'

const isDebugRouteAllowed =
  process.env.NODE_ENV !== 'production' || process.env.ALLOW_DEBUG_ENDPOINTS === 'true'

export function ensureDebugAccess() {
  if (isDebugRouteAllowed) {
    return null
  }

  return NextResponse.json(
    { error: 'This endpoint is disabled in production.' },
    { status: 404 }
  )
}
