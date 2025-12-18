import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import MainLayout from "@/components/layout/MainLayout";
import CalendarSliderCard from "@/components/layout/rightcontainer/CalendarSliderCard";
import SubscriptionCard from "@/components/layout/rightcontainer/SubscriptionCard";
import { Card } from "@/components/ui/card";
export default function RightContainerPage() {
    return (_jsx(MainLayout, { children: _jsxs("div", { className: "flex flex-col gap-4", children: [_jsx(Card, { className: "border-none p-0 shadow-none", children: _jsx(SubscriptionCard, {}) }), _jsx(Card, { className: "border-none p-0 shadow-none", children: _jsx(CalendarSliderCard, {}) })] }) }));
}
