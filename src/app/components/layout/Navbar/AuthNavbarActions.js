import Link from 'next/link'
import Image from 'next/image'
import { FiBell, FiMessageSquare, FiUser } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { useAuthFetch } from '@/app/lib/useAuthFetch'
import { useSessionContext } from '@/app/lib/supabaseAuthContext'

export default function AuthNavbarActions({ userData, onPostJobClick }) {
  const [notificationCount, setNotificationCount] = useState(0)
  const [messageCount, setMessageCount] = useState(0)
  const authFetch = useAuthFetch()
  const { session } = useSessionContext()
  const user = session?.user
  const profileImageUrl =
    typeof userData?.imageUrl === 'string' && userData.imageUrl.trim()
      ? userData.imageUrl
      : typeof user?.imageUrl === 'string' && user.imageUrl.trim()
        ? user.imageUrl
        : null

  useEffect(() => {
    if (!user) {
      setNotificationCount(0)
      setMessageCount(0)
      return
    }

    let isActive = true

    const fetchCounts = async () => {
      try {
        const res = await authFetch('/api/user/counts')
        if (!res.ok) throw new Error('Failed to fetch counts')
        const data = await res.json()
        if (!isActive) return
        setNotificationCount(data.unreadNotifications || 0)
        setMessageCount(data.unreadMessages ?? data.unreadNotifications ?? 0)
      } catch (err) {
        console.error('Error fetching counts:', err)
      }
    }

    const handleNotificationUpdate = (event) => {
      if (!isActive) return
      const detail = event?.detail

      if (detail?.count !== undefined && typeof detail.count === 'number') {
        setNotificationCount(detail.count)
        return
      }

      if (detail?.delta !== undefined && detail?.delta !== null) {
        setNotificationCount((prev) =>
          Math.max(prev + detail.delta, 0)
        )
        return
      }

      fetchCounts()
    }

    fetchCounts()
    const interval = setInterval(fetchCounts, 10000)

    if (typeof window !== 'undefined') {
      window.addEventListener('notificationsUpdated', handleNotificationUpdate)
    }

    return () => {
      isActive = false
      clearInterval(interval)
      if (typeof window !== 'undefined') {
        window.removeEventListener('notificationsUpdated', handleNotificationUpdate)
      }
    }
  }, [user, authFetch])

  return (
    <div className="flex items-center gap-6">
      <Link
        href="/dashboard"
        className="relative hover:opacity-70 transition text-[#868D9B] hover:text-black"
        onClick={() => setNotificationCount(0)}
      >
        <FiBell size={20} />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-semibold text-[8px]">
            {notificationCount > 9 ? '9+' : notificationCount}
          </span>
        )}
      </Link>
      <Link
        href="/dashboard"
        className="relative hover:opacity-70 transition text-[#868D9B] hover:text-black"
        onClick={() => setMessageCount(0)}
      >
        <FiMessageSquare size={18} />
        {messageCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-semibold text-[8px]">
            {messageCount > 9 ? '9+' : messageCount}
          </span>
        )}
      </Link>
      <Link href="/dashboard" className="hover:opacity-80 transition">
        {profileImageUrl ? (
          <Image
            src={profileImageUrl}
            alt="profile"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover border-2 border-transparent hover:border-gray-300"
          />
        ) : (
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-transparent bg-gray-200 text-gray-500 transition hover:border-gray-300"
            aria-label="profile placeholder"
          >
            <FiUser size={16} />
          </span>
        )}
      </Link>
      <button
        onClick={onPostJobClick}
        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
      >
        Post A Job
      </button>
    </div>
  )
}
