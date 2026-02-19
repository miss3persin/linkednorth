


function decodeEntities(str) {
    return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/&mdash;/g, '—')
        .replace(/&ndash;/g, '–')
        .replace(/&bull;/g, '•')
        .replace(/&hellip;/g, '...')
        .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
        .replace(/&[a-zA-Z]+;/g, ' ')
}


export function stripHtml(html) {
    if (!html || typeof html !== 'string') return ''

    let text = html

    // Convert block-level elements to newlines BEFORE stripping tags
    text = text
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<\/div>/gi, '\n')
        .replace(/<\/li>/gi, '\n')
        .replace(/<\/h[1-6]>/gi, '\n\n')
        .replace(/<\/tr>/gi, '\n')
        .replace(/<hr\s*\/?>/gi, '\n---\n')

    // Strip all remaining tags
    text = text.replace(/<[^>]+>/g, '')

    // Decode HTML entities
    text = decodeEntities(text)

    // Normalise whitespace — collapse multiple spaces but preserve intentional newlines
    text = text
        .replace(/[ \t]+/g, ' ')           // collapse horizontal whitespace
        .replace(/\n[ \t]+/g, '\n')        // trim leading spaces from each line
        .replace(/[ \t]+\n/g, '\n')        // trim trailing spaces from each line
        .replace(/\n{3,}/g, '\n\n')        // max two consecutive blank lines
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

        // Detect headings
        const isHeading =
            HEADING_PATTERNS.some((re) => re.test(line)) ||
            (line.length < 80 && line.endsWith(':') && !line.match(/^[•\-*]/)) ||
            (line.length < 60 && line === line.toUpperCase() && line.length > 3)

        if (isHeading) {
            flushList()
            // Remove trailing colon if present
            blocks.push({ type: 'heading', content: line.replace(/:$/, '') })
            continue
        }

        // Detect bullet points (•, -, *, ✓, ✔, →, ▪)
        const bulletMatch = line.match(/^[•\-*✓✔→▪◦‣⁃]\s+(.+)/)
        if (bulletMatch) {
            if (!currentList) currentList = []
            currentList.push(bulletMatch[1].trim())
            continue
        }

        // Numbered list items (1. 2. etc)
        const numberedMatch = line.match(/^\d+[\.\)]\s+(.+)/)
        if (numberedMatch) {
            if (!currentList) currentList = []
            currentList.push(numberedMatch[1].trim())
            continue
        }

        // Regular paragraph text
        flushList()
        // Merge short consecutive paragraphs into one
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
