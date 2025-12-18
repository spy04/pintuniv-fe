import { jsx as _jsx } from "react/jsx-runtime";
export default function ErrorText({ children }) {
    if (!children)
        return null;
    return _jsx("p", { className: "text-red-500 text-sm", children: children });
}
