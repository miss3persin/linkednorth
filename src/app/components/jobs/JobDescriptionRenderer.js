'use client'

import { parseDescription } from '@/app/lib/cleanDescription'

/**
 * Renders a structured, clean job description from raw HTML or plain text.
 * Parses into headings, bullet lists, and paragraphs automatically.
 */
export default function JobDescriptionRenderer({ description }) {
    if (!description) {
        return (
            <p className="text-gray-400 italic text-sm">
                No description available for this position.
            </p>
        )
    }

    const blocks = parseDescription(description)

    if (blocks.length === 0) {
        return (
            <p className="text-gray-400 italic text-sm">
                No description available for this position.
            </p>
        )
    }

    return (
        <div className="space-y-4 text-[15px] leading-relaxed text-gray-700">
            {blocks.map((block, i) => {
                if (block.type === 'heading') {
                    return (
                        <h3
                            key={i}
                            className="text-base font-bold text-gray-900 mt-6 first:mt-0 pb-1 border-b border-gray-100"
                        >
                            {block.content}
                        </h3>
                    )
                }

                if (block.type === 'list') {
                    return (
                        <ul key={i} className="space-y-1.5 pl-1">
                            {block.content.map((item, j) => (
                                <li key={j} className="flex items-start gap-2.5">
                                    <span className="mt-[7px] flex-shrink-0 w-1.5 h-1.5 rounded-none bg-gray-400" />
                                    <span className="flex-1 text-gray-700">{item}</span>
                                </li>
                            ))}
                        </ul>
                    )
                }

                // paragraph
                return (
                    <p key={i} className="text-gray-700">
                        {block.content}
                    </p>
                )
            })}
        </div>
    )
}
