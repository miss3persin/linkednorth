'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null

    const getPages = () => {
        const pages = []
        // Smarter visibility: 3 pages on tiny screens, 5 on larger ones
        const maxVisible = typeof window !== 'undefined' && window.innerWidth < 640 ? 3 : 5

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
            let end = Math.min(totalPages, start + maxVisible - 1)

            if (end === totalPages) {
                start = Math.max(1, end - maxVisible + 1)
            }

            if (start > 1) {
                pages.push(1)
                if (start > 2) pages.push('...')
            }

            for (let i = start; i <= end; i++) {
                pages.push(i)
            }

            if (end < totalPages) {
                if (end < totalPages - 1) pages.push('...')
                pages.push(totalPages)
            }
        }
        return pages
    }

    return (
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-8 py-6 w-full overflow-x-auto no-scrollbar">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 sm:p-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm shrink-0"
                aria-label="Previous page"
            >
                <ChevronLeft size={18} className="sm:hidden" />
                <ChevronLeft size={20} className="hidden sm:block" />
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2">
                {getPages().map((page, index) => (
                    <button
                        key={index}
                        onClick={() => typeof page === 'number' && onPageChange(page)}
                        disabled={page === '...'}
                    className={`
                        flex items-center justify-center text-center leading-none min-w-[36px] h-9 sm:min-w-[40px] sm:h-10 px-2 sm:px-3 rounded-lg text-sm font-bold transition-all shrink-0
                        ${page === currentPage
                            ? 'bg-black text-white shadow-lg shadow-black/10'
                            : page === '...'
                                ? 'border-transparent cursor-default text-gray-400'
                                : 'bg-white border border-gray-200 text-gray-600 hover:border-black/20 hover:bg-gray-50 shadow-sm'
                        }
                    `}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 sm:p-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm shrink-0"
                aria-label="Next page"
            >
                <ChevronRight size={18} className="sm:hidden" />
                <ChevronRight size={20} className="hidden sm:block" />
            </button>
        </div>
    )
}
