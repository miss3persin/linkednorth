import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabaseAdmin'
import { upsertUser } from '@/services/userService'

const isProduction = process.env.NODE_ENV === 'production'
const baseCookieOptions = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax',
  secure: isProduction,
}

const MAX_REFRESH_AGE = 60 * 60 * 24 * 30

function setAuthCookies(response, session) {
  if (!session) return

  const now = Math.floor(Date.now() / 1000)
  const expiresAt = session.expires_at ?? now + 60 * 60
  const maxAge = Math.max(expiresAt - now, 60)

  response.cookies.set('sb-access-token', session.access_token, {
    ...baseCookieOptions,
    maxAge,
  })
  response.cookies.set('sb-refresh-token', session.refresh_token, {
    ...baseCookieOptions,
    maxAge: MAX_REFRESH_AGE,
  })
  response.cookies.set('sb-auth-token', session.access_token, {
    ...baseCookieOptions,
    maxAge,
  })
}

function clearAuthCookies(response) {
  const options = { ...baseCookieOptions, maxAge: 0 }
  response.cookies.set('sb-access-token', '', options)
  response.cookies.set('sb-refresh-token', '', options)
  response.cookies.set('sb-auth-token', '', options)
}

export async function POST(request) {
  const body = await request.json().catch(() => null)
  if (!body?.access_token || !body?.refresh_token) {
    return NextResponse.json({ error: 'Missing session tokens' }, { status: 400 })
  }

  const authResponse = await supabaseAdmin.auth.getUser(body.access_token)
  const authUser = authResponse.data?.user

  if (authUser) {
    const metadata = authUser.user_metadata || {}
    const fallbackName = [metadata.name, metadata.full_name, authUser.name]
      .find((value) => typeof value === 'string' && value.trim()) || ''
    const fallbackParts = fallbackName ? fallbackName.trim().split(/\s+/) : []
    const fallbackFirst = fallbackParts[0] || null
    const fallbackLast = fallbackParts.length > 1 ? fallbackParts.slice(1).join(' ') : null
    const firstName =
      metadata.first_name ||
      metadata.firstName ||
      metadata.given_name ||
      metadata.givenName ||
      fallbackFirst ||
      null
    const lastName =
      metadata.last_name ||
      metadata.lastName ||
      metadata.family_name ||
      metadata.familyName ||
      fallbackLast ||
      null

    try {
      await upsertUser({
        id: authUser.id,
        auth_id: authUser.id,
        email: authUser.email,
        first_name: firstName,
        last_name: lastName,
      })
    } catch (error) {
      console.error('Failed to sync Supabase user to custom users table:', error)
    }
  }

  const response = NextResponse.json({ status: 'session_updated' })
  setAuthCookies(response, body)
  return response
}

export function DELETE() {
  const response = NextResponse.json({ status: 'signed_out' })
  clearAuthCookies(response)
  return response
}
