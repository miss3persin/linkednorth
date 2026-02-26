"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSessionContext, useSupabaseClient } from '@/app/lib/supabaseAuthContext'
import { useAuthFetch } from '@/app/lib/useAuthFetch';

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

export default function Sidebar() {
  const path = usePathname();
  const { session } = useSessionContext();
  const supabase = useSupabaseClient();
  const user = session?.user;
  const metadataRecruiter = !!user?.user_metadata?.isRecruiter;
  const [isRecruiterStatus, setIsRecruiterStatus] = useState(metadataRecruiter);
  const authFetch = useAuthFetch();

  useEffect(() => {
    let isMounted = true;

    if (!user) {
      setIsRecruiterStatus(false);
      return () => {
        isMounted = false;
      };
    }

    const fetchStatus = async () => {
      try {
        const res = await authFetch('/api/user/recruiter-status');
        if (!res.ok) {
          throw new Error('Failed to fetch recruiter status');
        }
        const data = await res.json();
        if (!isMounted) return;
        if (Boolean(data?.isRecruiter)) {
          setIsRecruiterStatus(true);
        }
      } catch (error) {
        console.error('Recruiter status check failed:', error);
      }
    };

    void fetchStatus();

    return () => {
      isMounted = false;
    };
  }, [user, authFetch]);

  const items = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { href: "/joblistings", label: "Jobs Listings", icon: <Briefcase size={18} /> },
  ];

  const showRecruiterTab = metadataRecruiter || isRecruiterStatus;

  if (showRecruiterTab) {
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <aside
      className="
        bg-white border-r flex flex-col justify-between pb-6
        w-16 xl:w-60
        transition-all duration-300
        sticky top-[72px] h-[calc(100vh-72px)]
      "
    >
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
              <span className="hidden xl:inline">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t px-4 pt-4 mt-auto">
        <button
          onClick={handleSignOut}
          title="Logout"
          className="flex items-center gap-3 text-sm text-gray-600 hover:text-black w-full"
        >
          <LogOut size={18} />
          <span className="hidden xl:inline">Logout</span>
        </button>
      </div>
    </aside>
  );
}
