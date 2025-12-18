import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import SubscriptionCard from "./SubscriptionCard";
import CalendarSliderCard from "./CalendarSliderCard";
import { Card } from "@/components/ui/card";
export default function RightContainer() {
    return (_jsxs("div", { className: "hidden w-[330px] flex-col gap-4 bg-white p-4 md:flex", children: [_jsx(Card, { className: "border-none p-0 shadow-none", children: _jsx(SubscriptionCard, {}) }), _jsx(Card, { className: "border-none p-0 shadow-none", children: _jsx(CalendarSliderCard, {}) })] }));
}
