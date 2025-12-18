import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronLeft, Home, Pen, Book, Clipboard, Calendar, } from "lucide-react";
import { useLocation } from "react-router-dom";
import clsx from "clsx";
import SidebarItem from "./SidebarItem";
import UserSection from "./UserSection";
import { LogoPanjang, LogoPendek } from "@/assets/logo";
export default function Sidebar({ open, setOpen, isMobile }) {
    // MOBILE → sidebar TIDAK ADA
    if (isMobile)
        return null;
    const location = useLocation();
    const menus = [
        { label: "Dashboard", icon: Home, href: "/dashboard_user" },
        { label: "Materi", icon: Book, href: "/materi" },
        { label: "Tryouts", icon: Pen, href: "/tryouts" },
        { label: "Latihan", icon: Clipboard, href: "/latihan" },
        { label: "Event", icon: Calendar, href: "/event" },
    ];
    return (_jsxs("aside", { className: clsx("fixed top-0 left-0 z-50 h-full border-r bg-white shadow-sm transition-all duration-300", open ? "w-64" : "w-20"), children: [_jsxs("div", { className: "flex items-center justify-between p-4", children: [_jsx("img", { src: open ? LogoPanjang : LogoPendek, className: "h-9" }), _jsx(ChevronLeft, { className: clsx("cursor-pointer transition-transform", !open && "rotate-180"), onClick: () => setOpen(!open) })] }), _jsx("nav", { className: "mt-4 space-y-1 px-2", children: menus.map((m) => (_jsx(SidebarItem, { ...m, active: location.pathname === m.href, open: open }, m.href))) }), _jsx(UserSection, { open: open })] }));
}
