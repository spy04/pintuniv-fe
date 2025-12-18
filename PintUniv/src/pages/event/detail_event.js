import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useGetEventsQuery } from "@/services/api";
/* ================= PAGE ================= */
export default function DetailEvent() {
    const { id } = useParams();
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { data: events = [], isLoading, error } = useGetEventsQuery(undefined);
    const { event, otherEvents } = useMemo(() => {
        const current = events.find((e) => String(e.id) === String(eventId));
        return {
            event: current,
            otherEvents: events.filter((e) => String(e.id) !== String(eventId)),
        };
    }, [events, eventId]);
    /* ================= STATES ================= */
    if (isLoading)
        return (_jsx(MainLayout, { children: _jsx("div", { className: "flex justify-center py-24", children: _jsx(Spinner, { className: "size-6" }) }) }));
    if (error)
        return (_jsx(MainLayout, { children: _jsx("p", { className: "text-red-600", children: "Gagal memuat data event" }) }));
    if (!event)
        return (_jsx(MainLayout, { children: _jsx("p", { className: "py-10 text-center", children: "Event tidak ditemukan" }) }));
    /* ================= RENDER ================= */
    return (_jsx(MainLayout, { children: _jsxs("div", { className: "space-y-10", children: [event.poster && (_jsx("img", { src: event.poster, alt: event.title, className: "w-full rounded-2xl shadow-md" })), _jsxs("div", { className: "space-y-3", children: [_jsx("h1", { className: "text-2xl font-bold", children: event.title }), _jsxs("p", { className: "text-gray-600", children: [new Date(event.start_date).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                }), " ", "\u2013", " ", new Date(event.end_date).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })] }), event.tempat && (_jsxs("p", { className: "text-gray-600", children: ["Tempat: ", event.tempat] })), event.syarat && (_jsx(Card, { children: _jsx(CardContent, { className: "whitespace-pre-line", children: event.syarat }) }))] }), otherEvents.length > 0 && (_jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Event Lain" }), _jsx("div", { className: "flex gap-4 overflow-x-auto pb-2", children: otherEvents.map((e) => (_jsxs(Card, { className: "min-w-[260px] cursor-pointer transition-shadow hover:shadow-md", onClick: () => navigate(`/event/${e.id}`), children: [e.photo && (_jsx("img", { src: e.photo, alt: e.title, className: "h-36 w-full rounded-t-xl object-cover" })), _jsxs(CardContent, { children: [_jsx("h3", { className: "mb-1 text-sm font-semibold", children: e.title }), _jsx("p", { className: "text-xs text-gray-600", children: new Date(e.start_date).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                }) })] })] }, e.id))) })] }))] }) }));
}
