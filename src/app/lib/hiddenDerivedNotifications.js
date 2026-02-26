export const HIDDEN_DERIVED_KEY = 'hiddenDerivedNotifications'

const safeDecode = (value) => {
  if (!value) return ''
  try {
    return decodeURIComponent(value)
  } catch (err) {
    return value
  }
}

export function parseHiddenDerivedIds(value) {
  if (!value) return []
  try {
    const raw = safeDecode(value)
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed.filter(Boolean)
    }
  } catch (err) {
    console.error('Failed to parse hidden derived ids:', err)
  }
  return []
}

export function serializeHiddenDerivedIds(ids) {
  try {
    return encodeURIComponent(JSON.stringify([...ids]))
  } catch (err) {
    console.error('Failed to serialize hidden derived ids:', err)
    return ''
  }
}

export function getCookieValue(name, cookieString = '') {
  if (!cookieString) return ''
  const cookies = cookieString.split(';').map((segment) => segment.trim())
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`))
  if (!match) return ''
  return match.substring(name.length + 1)
}

export function extractHiddenDerivedIdsFromRequest(request) {
  if (!request?.cookies) return new Set()
  const value = request.cookies.get(HIDDEN_DERIVED_KEY)?.value
  const parsed = parseHiddenDerivedIds(value)
  return new Set(parsed)
}
