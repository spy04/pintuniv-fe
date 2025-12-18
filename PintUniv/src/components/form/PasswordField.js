import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
export default function PasswordField({ label, ...props }) {
    const [show, setShow] = useState(false);
    return (_jsxs("div", { className: "space-y-1", children: [label && _jsx(Label, { children: label }), _jsxs("div", { className: "relative", children: [_jsx(Input, { type: show ? "text" : "password", ...props }), _jsx("button", { type: "button", onClick: () => setShow(!show), className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500", children: show ? _jsx(EyeOff, { size: 18 }) : _jsx(Eye, { size: 18 }) })] })] }));
}
