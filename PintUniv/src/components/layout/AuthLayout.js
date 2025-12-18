import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function AuthLayout({ children, sideTitle, sideText, sideAction, showSide = true, // kalau mau hide panel kanan (mobile/full)
 }) {
    return (_jsxs("div", { className: "min-h-screen w-screen flex bg-white light", children: [_jsx("div", { className: "flex-1 flex items-center justify-center p-6", children: children }), showSide && (_jsx("aside", { className: "hidden md:flex flex-1 items-center justify-center bg-gradient-to-b from-slate-800 to-slate-700 text-white p-10", "aria-hidden": true, children: _jsxs("div", { className: "max-w-xs text-center", children: [_jsx("h2", { className: "text-3xl font-bold mb-3", children: sideTitle }), _jsx("p", { className: "text-sm opacity-90 mb-6", children: sideText }), sideAction] }) }))] }));
}
