import { decodeHtmlEntities } from '@/app/lib/htmlEntities'

export function stripHtml(html) {
    if (!html || typeof html !== 'string') return ''

    let text = html

    text = text
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<\/div>/gi, '\n')
        .replace(/<\/li>/gi, '\n')
        .replace(/<\/h[1-6]>/gi, '\n\n')
        .replace(/<\/tr>/gi, '\n')
        .replace(/<hr\s*\/?>/gi, '\n---\n')

    text = text.replace(/<[^>]+>/g, '')
    text = decodeHtmlEntities(text)

    text = text
        .replace(/[ \t]+/g, ' ')
        .replace(/\n[ \t]+/g, '\n')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim()

    return text
}


export function truncateClean(html, lineCount = 5) {
    const clean = stripHtml(html)
    if (!clean) return ''

    const lines = clean.split('\n').filter((l) => l.trim().length > 0)
    if (lines.length <= lineCount) return clean

    return lines.slice(0, lineCount).join('\n') + '...'
}


export function parseDescription(html) {
    if (!html || typeof html !== 'string') return []

    const clean = stripHtml(html)
    if (!clean) return []

    const HEADING_PATTERNS = [
        /^(about (the )?(role|job|position|company|us|team))/i,
        /^(what you['']ll? (do|be doing|work on))/i,
        /^(your (responsibilities|role|day|impact))/i,
        /^(key responsibilities)/i,
        /^(responsibilities)/i,
        /^(requirements?)/i,
        /^(qualifications?)/i,
        /^(what we('re| are) looking for)/i,
        /^(must[- ]have)/i,
        /^(nice[- ]to[- ]have)/i,
        /^(preferred qualifications?)/i,
        /^(skills? (required|needed|&|and))/i,
        /^(benefits?)/i,
        /^(what we offer)/i,
        /^(perks? (and|&) benefits?)/i,
        /^(compensation)/i,
        /^(salary)/i,
        /^(location)/i,
        /^(how to apply)/i,
        /^(application (process|instructions?))/i,
        /^(equal opportunity)/i,
        /^(diversity)/i,
    ]

    const lines = clean.split('\n')
    const blocks = []
    let currentList = null

    const flushList = () => {
        if (currentList && currentList.length > 0) {
            blocks.push({ type: 'list', content: currentList })
            currentList = null
        }
    }

    for (const rawLine of lines) {
        const line = rawLine.trim()
        if (!line) {
            flushList()
            continue
        }

        const isHeading =
            HEADING_PATTERNS.some((re) => re.test(line)) ||
            (line.length < 80 && line.endsWith(':') && !line.match(/^[•◦‣⁃–—\-*]/)) ||
            (line.length < 60 && line === line.toUpperCase() && line.length > 3)

        if (isHeading) {
            flushList()
            blocks.push({ type: 'heading', content: line.replace(/:$/, '') })
            continue
        }

        const bulletMatch = line.match(/^[•◦‣⁃–—\-*+✓✔→·•]+?\s+(.+)/)
        if (bulletMatch) {
            if (!currentList) currentList = []
            currentList.push(bulletMatch[1].trim())
            continue
        }

        const numberedMatch = line.match(/^\d+[\.\)]\s+(.+)/)
        if (numberedMatch) {
            if (!currentList) currentList = []
            currentList.push(numberedMatch[1].trim())
            continue
        }

        flushList()
        if (
            blocks.length > 0 &&
            blocks[blocks.length - 1].type === 'paragraph'
        ) {
            blocks[blocks.length - 1].content += ' ' + line
        } else {
            blocks.push({ type: 'paragraph', content: line })
        }
    }

    flushList()
    return blocks
}
