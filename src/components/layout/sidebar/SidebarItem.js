import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import clsx from "clsx";
export default function SidebarItem({ label, icon: Icon, href, active, open }) {
    return (_jsxs(Link, { to: href, className: clsx("flex items-center gap-3 px-3 py-2 rounded-lg transition-all font-semibold no-underline", active
            ? "bg-[#152D64] !text-white"
            : "!text-gray-500 hover:bg-gray-100"), children: [_jsx(Icon, { size: 20 }), open && _jsx("span", { className: "text-lg", children: label })] }));
}
