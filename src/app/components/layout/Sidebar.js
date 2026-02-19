"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton, useUser } from "@clerk/nextjs";

// Icons
import {
  LayoutDashboard,
  Briefcase,
  Folder,
  FileText,
  Star,
  LogOut,
  Building2
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const path = usePathname();
  const { user } = useUser();
  const isRecruiter = !!user?.publicMetadata?.isRecruiter;

  const items = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { href: "/joblistings", label: "Jobs Listings", icon: <Briefcase size={18} /> },
  ];

  if (isRecruiter) {
    items.push({
      href: "/recruiter/hub",
      label: "Recruiter Hub",
      icon: <Building2 size={18} />
    });
  }

  items.push(
    { href: "/library", label: "Library", icon: <Folder size={18} /> },
    { href: "/resumebuilder", label: "Resume Builder", icon: <FileText size={18} /> },
    { href: "/premium", label: "Premium Features", icon: <Star size={18} /> },
  );

  return (
    <aside
      className="
        bg-white border-r flex flex-col justify-between pb-6
        w-16 xl:w-60
        transition-all duration-300
        sticky top-[72px] h-[calc(100vh-72px)]
      "
    >
      {/* Menu - scrollable if too many items */}
      <nav className="space-y-1 overflow-y-auto thin-scroll">
        {items.map((item) => {
          const active = path.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`
                flex items-center gap-3 px-4 py-3 text-sm transition
                ${active
                  ? "bg-gray-100 font-medium border-r-4 border-black text-black"
                  : "text-gray-600 hover:bg-gray-50"}
              `}
            >
              {item.icon}

              {/* Label — hidden below 1280px */}
              <span className="hidden xl:inline">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout - pinned to bottom */}
      <div className="border-t px-4 pt-4 mt-auto">
        <SignOutButton redirectUrl="/">
          <button
            title="Logout"
            className="flex items-center gap-3 text-sm text-gray-600 hover:text-black w-full"
          >
            <LogOut size={18} />
            <span className="hidden xl:inline">Logout</span>
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
