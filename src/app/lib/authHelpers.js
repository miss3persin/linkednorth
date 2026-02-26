import { supabaseAdmin } from './supabaseAdmin'

const RETRYABLE_CODES = new Set(['EAI_AGAIN', 'ECONNRESET', 'ETIMEDOUT'])
const RETRYABLE_MESSAGES = ['EAI_AGAIN', 'getaddrinfo', 'fetch failed']
const MAX_RETRIES = 2
const RETRY_DELAY_MS = 250

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const getTokenFromRequest = (request) => {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return null
  const [, token] = authHeader.split(' ')
  return token || null
}

const isRetryableError = (error) => {
  if (!error) return false
  const code = error.code || error?.cause?.code
  if (code && RETRYABLE_CODES.has(code)) {
    return true
  }
  const message = (error.message || '').toLowerCase()
  return RETRYABLE_MESSAGES.some((pattern) => message.includes(pattern.toLowerCase()))
}

export async function getSupabaseUser(request) {
  const token = getTokenFromRequest(request)
  if (!token) return null

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const { data, error } = await supabaseAdmin.auth.getUser(token)
      if (error) {
        throw error
      }
      if (!data?.user) {
        console.error('Supabase auth error: No user found for token')
        return null
      }
      return data.user
    } catch (error) {
      const shouldRetry = attempt < MAX_RETRIES && isRetryableError(error)
      if (!shouldRetry) {
        console.error('Supabase auth error:', error?.message || 'No user', error)
        return null
      }
      await delay(RETRY_DELAY_MS * (attempt + 1))
    }
  }

  return null
}

export async function requireSupabaseUser(request) {
  const user = await getSupabaseUser(request)
  if (!user) {
    const err = new Error('Unauthorized')
    err.code = 'unauthorized'
    throw err
  }
  return user
}
