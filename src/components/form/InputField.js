import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
export default function InputField({ label, ...props }) {
    return (_jsxs("div", { className: "space-y-1", children: [label && _jsx(Label, { children: label }), _jsx(Input, { ...props })] }));
}
