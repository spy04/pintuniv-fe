import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { guarantee } from "@/assets/icon";
import { useNavigate } from "react-router-dom";
export default function SubscriptionCard() {
    const navigate = useNavigate();
    return (_jsx(Card, { className: "rounded-xl border bg-gradient-to-br from-green-200 to-white shadow", children: _jsxs(CardContent, { className: "p-2", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("img", { src: guarantee, className: "w-10", alt: "guarantee" }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-green-800", children: "Upgrade Premium" }), _jsx("p", { className: "text-sm text-gray-700", children: "Worem ipsum dolor sit amet, consectetur adipiscing elit." })] })] }), _jsx(Button, { className: "mt-4 w-full bg-[#152D64] text-white", onClick: () => navigate(`/subscribe`), children: "Upgrade Sekarang" })] }) }));
}
