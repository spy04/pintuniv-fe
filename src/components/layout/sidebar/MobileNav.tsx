import { Home, Bell, Clipboard, Calendar } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { User } from "lucide-react";
import { useGetUserQuery } from "@/services/api";

const menus = [
  { label: "Dashboard", icon: Home, href: "/dashboard_user" },
  { label: "Latihan", icon: Clipboard, href: "/latihan" },
  { label: "Aktivitas", icon: Bell, href: "/activity" },
  { label: "Event", icon: Calendar, href: "/event" },
  { label: "Profil", icon: User, href: "/setting" },
];

export default function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 border-t bg-white">
      <div className="grid grid-cols-5">
        {menus.map((m) => {
          const Icon = m.icon;
          const active = location.pathname === m.href;

          return (
            <button
              key={m.href}
              onClick={() => navigate(m.href)}
              className={clsx(
                "flex flex-col items-center justify-center gap-1 py-2 text-xs",
                active ? "font-semibold text-[#152D64]" : "text-gray-400",
              )}
            >
              <Icon className="h-5 w-5" />
              {m.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
