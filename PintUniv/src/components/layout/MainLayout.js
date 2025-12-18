import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import clsx from "clsx";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import MobileNav from "@/components/layout/sidebar/MobileNav";
import RightContainer from "@/components/layout/rightcontainer/RightContainer";
export default function MainLayout({ children, showRightContainer = true, }) {
    const [open, setOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);
    useEffect(() => {
        if (isMobile)
            setOpen(false);
    }, [isMobile]);
    return (_jsxs("div", { className: "flex h-screen bg-gray-50", children: [_jsx(Sidebar, { open: open, setOpen: setOpen, isMobile: isMobile }), _jsx("main", { className: clsx("flex-1 overflow-y-auto p-6 transition-all duration-300", !isMobile && (open ? "ml-64" : "ml-20"), isMobile && "pb-16"), children: children }), !isMobile && showRightContainer && _jsx(RightContainer, {}), isMobile && _jsx(MobileNav, {})] }));
}
