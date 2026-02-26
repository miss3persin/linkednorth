'use client'

import { IoMdNotificationsOutline } from 'react-icons/io'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { dispatchNotificationCount, dispatchNotificationDelta } from '@/app/lib/notificationEvents'
import { useAuthFetch } from '@/app/lib/useAuthFetch'
import {
  HIDDEN_DERIVED_KEY,
  getCookieValue,
  parseHiddenDerivedIds,
  serializeHiddenDerivedIds,
} from '@/app/lib/hiddenDerivedNotifications'

const absoluteDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

const formatNotificationTimestamp = (value) => {
  const date = value ? new Date(value) : null
  if (!date || Number.isNaN(date.getTime())) {
    return ''
  }
  return absoluteDateFormatter.format(date)
}

const loadHiddenDerivedIds = () => {
  if (typeof window === 'undefined') return new Set()
  try {
    const stored = parseHiddenDerivedIds(localStorage.getItem(HIDDEN_DERIVED_KEY))
    if (stored.length) {
      return new Set(stored)
    }
  } catch (error) {
    console.error('Failed to load hidden derived notifications from storage', error)
  }

  try {
    const cookieValue = getCookieValue(HIDDEN_DERIVED_KEY, document.cookie)
    const cookieIds = parseHiddenDerivedIds(cookieValue)
    if (cookieIds.length) {
      return new Set(cookieIds)
    }
  } catch (error) {
    console.error('Failed to load hidden derived notifications from cookie', error)
  }

  return new Set()
}

const persistHiddenDerivedIds = (ids) => {
  if (typeof window === 'undefined') return
  const list = [...ids]
  try {
    localStorage.setItem(HIDDEN_DERIVED_KEY, JSON.stringify(list))
  } catch (error) {
    console.error('Failed to persist hidden derived notification ids', error)
  }

  const serialized = serializeHiddenDerivedIds(list)
  if (serialized) {
    document.cookie = `${HIDDEN_DERIVED_KEY}=${serialized}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
  }
}

export default function DashboardNotifications({ initialNotifications = [] }) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [marking, setMarking] = useState(false)
  const [hiddenDerivedIds, setHiddenDerivedIds] = useState(() => new Set())
  const router = useRouter()
  const authFetch = useAuthFetch()

  useEffect(() => {
    setNotifications(initialNotifications)
  }, [initialNotifications])

  useEffect(() => {
    setHiddenDerivedIds(loadHiddenDerivedIds())
  }, [])

  const visibleNotifications = useMemo(() => {
    if (!hiddenDerivedIds.size) return notifications
    return notifications.filter((n) => !(n.isDerived && hiddenDerivedIds.has(n.id)))
  }, [hiddenDerivedIds, notifications])

  useEffect(() => {
    dispatchNotificationCount(visibleNotifications.length)
  }, [visibleNotifications.length])

  const handleMarkAllRead = async () => {
    if (marking || visibleNotifications.length === 0) return
    setMarking(true)
    try {
      const res = await authFetch('/api/notifications/mark-all-read', {
        method: 'POST',
      })
      if (res.ok) {
        setNotifications([])
        const derivedIds = visibleNotifications
          .filter((notification) => notification.isDerived && notification.id)
          .map((notification) => notification.id)
        if (derivedIds.length > 0) {
          setHiddenDerivedIds((prev) => {
            const updated = new Set(prev)
            derivedIds.forEach((id) => updated.add(id))
            persistHiddenDerivedIds(updated)
            return updated
          })
        }
        dispatchNotificationDelta(-visibleNotifications.length)
      }
    } catch (err) {
      console.error('Failed to mark notifications read', err)
    } finally {
      setMarking(false)
    }
  }

  const handleView = async (notification) => {
    const notificationExists = notifications.some((n) => n.id === notification.id)

    const removeNotificationFromList = () => {
      if (!notificationExists) return
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
      dispatchNotificationDelta(-1)
    }

    const isDerivedNotification = notification.isDerived || notification.id?.startsWith('derived-')
    const routePath =
      notification.actionLink ||
      (notification.targetJobId ? `/joblistings/${notification.targetJobId}` : null)

    if (routePath) {
      await router.push(routePath)
    }

    if (!isDerivedNotification) {
      try {
        const res = await authFetch(`/api/notifications/${notification.id}/mark-read`, {
          method: 'PATCH',
        })

        if (!res.ok) {
          throw new Error('Failed to mark notification read')
        }
      } catch (err) {
        console.error('Failed to mark notification read', err)
        return
      }
    }

    if (isDerivedNotification && notification.id) {
      setHiddenDerivedIds((prev) => {
        const updated = new Set(prev)
        updated.add(notification.id)
        persistHiddenDerivedIds(updated)
        return updated
      })
    }

    removeNotificationFromList()
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-4 flex-shrink-0">
        <h3 className="font-semibold text-lg">Notifications</h3>
        <button
          type="button"
          onClick={handleMarkAllRead}
          disabled={marking || visibleNotifications.length === 0}
          className="text-sm font-normal text-blue-600 disabled:text-gray-400 transition"
        >
          {marking ? 'Marking...' : 'Mark all as read'}
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1 thin-scroll">
        {visibleNotifications.length === 0 ? (
          <p className="text-gray-500 text-sm">You&apos;re all caught up.</p>
        ) : (
          <div className="space-y-3">
            {visibleNotifications.map((n) => {
              const messageBody = n.message || n.text || ''
              const timestampLabel = formatNotificationTimestamp(n.timeValue ?? n.time)

              return (
                <div
                  key={n.id}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm px-4 py-4 sm:px-5 sm:py-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 text-2xl">
                      <IoMdNotificationsOutline className={n.color} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                        <span className="text-xs text-gray-400">{timestampLabel}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2 leading-relaxed break-words">
                        {messageBody}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleView(n)}
                        className="mt-3 text-sm font-semibold text-blue-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        {n.action ?? 'View'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
