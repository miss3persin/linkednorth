'use client'

import { IoMdNotificationsOutline } from 'react-icons/io'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { dispatchNotificationCount, dispatchNotificationDelta } from '@/app/lib/notificationEvents'

export default function DashboardNotifications({ initialNotifications = [] }) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [marking, setMarking] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setNotifications(initialNotifications)
  }, [initialNotifications])

  useEffect(() => {
    dispatchNotificationCount(notifications.length)
  }, [notifications.length])

  const handleMarkAllRead = async () => {
    if (marking || notifications.length === 0) return
    setMarking(true)
    try {
      const res = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
      })
      if (res.ok) {
        setNotifications([])
        dispatchNotificationDelta(-notifications.length)
      }
    } catch (err) {
      console.error('Failed to mark notifications read', err)
    } finally {
      setMarking(false)
    }
  }

  const handleView = async (notification) => {
    try {
      const res = await fetch(`/api/notifications/${notification.id}/mark-read`, {
        method: 'PATCH',
      })
      if (res.ok) {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== notification.id)
        )
        dispatchNotificationDelta(-1)
      }
    } catch (err) {
      console.error('Failed to mark notification read', err)
    } finally {
      if (notification.actionLink) {
        router.push(notification.actionLink)
      }
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-4">
        <h3 className="font-semibold text-lg">Notifications</h3>
        <button
          type="button"
          onClick={handleMarkAllRead}
          disabled={marking || notifications.length === 0}
          className="text-sm font-normal text-blue-600 disabled:text-gray-400 transition"
        >
          {marking ? 'Marking...' : 'Mark all as read'}
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 thin-scroll">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-sm">You’re all caught up.</p>
        ) : (
          notifications.map((n, i) => (
            <div
              key={i}
              className="py-4 px-4 bg-[#F9FAFB] flex flex-col sm:flex-row gap-3 sm:gap-4 mb-2 rounded-md"
            >
              <IoMdNotificationsOutline
                className={`text-2xl sm:text-3xl ${n.color}`}
              />

              <div className="flex-1">
                <p className="font-medium">{n.title}</p>
                <p className="text-sm text-gray-500 mt-1 break-words">{n.text}</p>
                <button
                  type="button"
                  onClick={() => handleView(n)}
                  className="text-blue-600 text-sm mt-2 inline-block font-medium"
                >
                  {n.action || 'View'}
                </button>
                <p className="text-xs text-gray-400 mt-2 sm:hidden">{n.time}</p>
              </div>
              <p className="hidden sm:block text-xs text-gray-400 ml-auto">{n.time}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
