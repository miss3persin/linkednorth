
export const formatPostedTime = (dateString) => {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Unknown'

    const now = new Date()
    const diffMs = now - date
    const seconds = Math.floor(diffMs / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)

    if (seconds < 60) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 30) return `${days}d ago`
    if (months < 12) return `${months}mo ago`
    return `${years}y ago`
}


export const titleCaseContract = (str) =>
    str ? str.toLowerCase().split(/[\s_-]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : ''
