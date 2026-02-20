export function dispatchNotificationDelta(delta) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent('notificationsUpdated', {
      detail: { delta },
    })
  )
}

export function dispatchNotificationCount(count) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent('notificationsUpdated', {
      detail: { count },
    })
  )
}
