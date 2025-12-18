import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetSubscriptionsQuery, useGetQuotesQuery, useGetCountdownQuery, } from "@/services/api";
import SliderContent from "./SliderContent";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export default function CalendarSliderCard() {
    const [index, setIndex] = useState(0);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [slides, setSlides] = useState([]);
    // redux hooks
    const { data: subs } = useGetSubscriptionsQuery(undefined, {
        pollingInterval: 30000,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });
    const { data: quotes } = useGetQuotesQuery(undefined, {
        pollingInterval: 30000,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });
    const { data: countdowns } = useGetCountdownQuery(undefined, {
        pollingInterval: 30000,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });
    // month label
    const monthLabel = currentDate.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
    });
    // weekly calendar
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const week = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return d;
    });
    const today = new Date().toDateString();
    // build slides
    useEffect(() => {
        if (!subs && !quotes && !countdowns)
            return;
        const promos = subs
            ?.filter((s) => s.diskon?.photo)
            .map((s) => ({
            type: "promo",
            img: s.diskon.photo,
        })) ?? [];
        const qts = quotes?.map((q) => ({
            type: "quote",
            text: q.text || q.isi,
            author: q.nama || "Pintu Univ",
        })) ?? [];
        const cdowns = countdowns?.map((c) => {
            const target = new Date(c.dateUTBK);
            const now = new Date();
            const days = Math.ceil((target.getTime() - now.getTime()) / (1000 * 3600 * 24));
            return {
                type: "countdown",
                days: Math.max(0, days),
                date: c.dateUTBK,
            };
        }) ?? [];
        setSlides([...promos, ...qts, ...cdowns]);
    }, [subs, quotes, countdowns]);
    // auto slide
    useEffect(() => {
        if (!slides.length)
            return;
        const timer = setInterval(() => {
            setIndex((i) => (i + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides]);
    return (_jsx(Card, { className: "rounded-2xl shadow-sm", children: _jsxs(CardContent, { className: "p-2", children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsx("h2", { className: "text-xl font-bold text-[#1D2B53]", children: monthLabel }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "ghost", size: "icon-sm", onClick: () => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7))), children: _jsx(ChevronLeft, { className: "size-4" }) }), _jsx(Button, { variant: "ghost", size: "icon-sm", onClick: () => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7))), children: _jsx(ChevronRight, { className: "size-4" }) })] })] }), _jsx("div", { className: "mb-1 grid grid-cols-7 text-center text-xs text-gray-500", children: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (_jsx("div", { children: d }, d))) }), _jsx("div", { className: "mb-4 grid grid-cols-7 gap-1 text-center", children: week.map((d) => (_jsx("div", { className: `flex h-9 w-9 items-center justify-center rounded-full font-semibold ${d.toDateString() === today
                            ? "bg-[#1D2B53] text-white"
                            : "bg-gray-100 text-gray-700"}`, children: d.getDate() }, d.toISOString()))) }), _jsx("div", { className: "mb-4 border-t" }), _jsx(SliderContent, { slide: slides[index] }), _jsx("div", { className: "mt-3 flex justify-center gap-1", children: slides.map((_, i) => (_jsx("button", { onClick: () => setIndex(i), className: `h-3 w-3 cursor-pointer rounded-full ${i === index ? "bg-[#1D2B53]" : "bg-gray-300"}` }, i))) })] }) }));
}
