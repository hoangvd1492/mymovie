"use client";

import { useRef, useState } from "react";
import { LogOut, UserIcon, Film } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useOnClickOutside } from "usehooks-ts";
import { User } from "@/lib/type/user";

export function UserDropdown({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const supabase = createClient();

  useOnClickOutside(dropdownRef as React.RefObject<HTMLElement>, () =>
    setOpen(false),
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Icon */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="text-sm font-bold"
      >
        <UserIcon />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-5 py-4 w-56 bg-background shadow-[0_0_2px_0] shadow-grey rounded-sm  z-100 overflow-hidden">
          <button
            onClick={() => {
              router.push("/nguoi-dung");
              setOpen(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm font-semibold hover:bg-secondary/50 transition"
          >
            <UserIcon size={16} />
            Người dùng
          </button>

          <button
            onClick={() => {
              router.push("/xem-sau");
              setOpen(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm font-semibold hover:bg-secondary/50 transition"
          >
            <Film size={16} />
            Xem sau
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm font-semibold hover:bg-secondary/50 transition"
          >
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
