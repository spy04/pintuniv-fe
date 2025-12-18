import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useGetEventsQuery } from "@/services/api";
/* ================= PAGE ================= */
export default function EventPage() {
    const navigate = useNavigate();
    const { data: events = [], isLoading, error } = useGetEventsQuery(undefined);
    /* ================= STATES ================= */
    if (isLoading)
        return (_jsx(MainLayout, { children: _jsx("div", { className: "flex justify-center py-24", children: _jsx(Spinner, { className: "size-6" }) }) }));
    if (error)
        return (_jsx(MainLayout, { children: _jsx("p", { className: "text-red-600", children: "Gagal mengambil data event" }) }));
    /* ================= RENDER ================= */
    return (_jsx(MainLayout, { children: _jsxs("div", { className: "space-y-6", children: [_jsx("h1", { className: "text-2xl font-semibold", children: "Daftar Event" }), _jsxs("div", { className: "space-y-3", children: [events.map((e) => (_jsx(Card, { className: "cursor-pointer transition-shadow hover:shadow-md", onClick: () => navigate(`/event/${e.id}`), children: _jsxs(CardContent, { className: "flex items-center gap-4", children: [e.photo && (_jsx("img", { src: e.photo, alt: e.title, className: "h-12 w-12 rounded-md border object-cover" })), _jsxs("div", { children: [_jsx("h2", { className: "font-semibold", children: e.title }), _jsx("p", { className: "text-sm text-gray-600", children: new Date(e.start_date).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                }) })] })] }) }, e.id))), !events.length && (_jsx("p", { className: "py-10 text-center text-gray-500", children: "Belum ada event tersedia" }))] })] }) }));
}
