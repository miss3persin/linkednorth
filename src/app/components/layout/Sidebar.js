"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";

// Icons
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { FiBriefcase, FiFolder, FiFileText, FiStar, FiLogOut } from "react-icons/fi";

export default function Sidebar() {
  const path = usePathname();

  const items = [
    { href: "/dashboard", label: "Dashboard", icon: <HiOutlineSquares2X2 size={18} /> },
    { href: "/job-listings", label: "Jobs Listings", icon: <FiBriefcase size={18} /> },
    { href: "/library", label: "Library", icon: <FiFolder size={18} /> },
    { href: "/resume-builder", label: "Resume Builder", icon: <FiFileText size={18} /> },
    { href: "/premium", label: "Premium Features", icon: <FiStar size={18} /> },
  ];

  return (
    <aside className="w-60 bg-white border-r min-h-screen flex flex-col justify-between py-6">
      
      {/* Menu */}
      <nav className="space-y-1">
        {items.map((item) => {
          const active = path.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm transition
              ${active ? "bg-gray-100 font-medium border-r-4 border-black text-black" : "text-gray-600 hover:bg-gray-50"}`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t px-4 pt-4">
        <SignOutButton redirectUrl="/">
          <button className="flex items-center gap-3 text-sm text-gray-600 hover:text-black w-full">
            <FiLogOut size={18} />
            Logout
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
