// 'use client'
// import Link from 'next/link'
// import { usePathname } from 'next/navigation'

// export default function Sidebar() {
//   const path = typeof window !== 'undefined' ? window.location.pathname : ''

//   const items = [
//     { href: '/profile/dashboard', label: 'Dashboard' },
//     { href: '/profile/job-listings', label: 'Jobs Listings' },
//     { href: '/profile/library', label: 'Library' },
//     { href: '/profile/resume-builder', label: 'Resume Builder' },
//     { href: '/profile/premium', label: 'Premium Features' },
//   ]

//   return (
//     <aside className="w-64 bg-white border-r min-h-screen p-6">
//       <div className="mb-8">
//         <p className="text-sm text-gray-500">Account</p>
//         <div className="mt-3 font-semibold">My Profile</div>
//       </div>

//       <nav className="flex flex-col gap-2">
//         {items.map(i => (
//           <Link key={i.href} href={i.href}
//             className={`p-3 rounded text-sm ${path.startsWith(i.href) ? 'bg-gray-100 font-medium' : 'text-gray-700'}`}>
//             {i.label}
//           </Link>
//         ))}
//       </nav>

//       <div className="mt-8">
//         <button className="text-sm px-4 py-2 bg-black text-white rounded">Logout</button>
//       </div>
//     </aside>
//   )
// }
