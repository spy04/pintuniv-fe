import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useGetTryoutsQuery, useStartTryoutMutation } from "@/services/api";
/* ================= PAGE ================= */
export default function TryoutList() {
    const navigate = useNavigate();
    const { data: tryouts = [], isLoading, error, } = useGetTryoutsQuery(undefined);
    const [startTryout, { isLoading: starting }] = useStartTryoutMutation();
    /* ================= HANDLER ================= */
    const handleTryoutClick = async (t) => {
        try {
            const session = await startTryout(t.id).unwrap();
            if (session.finished) {
                navigate(`/review/${t.id}`, { state: { session } });
            }
            else {
                navigate(`/question/${t.id}`, { state: { session } });
            }
        }
        catch (err) {
            console.error("Gagal memulai tryout", err);
        }
    };
    /* ================= LOADING ================= */
    if (isLoading)
        return (_jsx(MainLayout, { children: _jsx("div", { className: "flex justify-center py-24", children: _jsx(Spinner, { className: "size-6" }) }) }));
    if (error)
        return (_jsx(MainLayout, { children: _jsx("div", { className: "text-red-600", children: "Gagal memuat daftar tryout" }) }));
    /* ================= RENDER ================= */
    return (_jsx(_Fragment, { children: _jsx(MainLayout, { children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("i", { className: "fas fa-pen-alt text-xl" }), _jsx("h1", { className: "text-3xl font-bold", children: "Tryout" })] }), _jsx(Card, { children: _jsx(CardContent, { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b text-left", children: [_jsx("th", { className: "py-3", children: "Judul" }), _jsx("th", { className: "py-3", children: "Waktu" }), _jsx("th", { className: "py-3", children: "Komposisi" }), _jsx("th", { className: "py-3", children: "Aksi" })] }) }), _jsxs("tbody", { children: [tryouts.map((t) => (_jsxs("tr", { className: "border-b last:border-none", children: [_jsx("td", { className: "py-3 font-medium", children: t.title }), _jsxs("td", { className: "py-3", children: [t.duration, " menit"] }), _jsxs("td", { className: "py-3", children: [t.question_count, " soal"] }), _jsx("td", { className: "py-3", children: _jsx(Button, { size: "sm", disabled: starting, onClick: () => handleTryoutClick(t), children: t.finished ? "Lihat Review" : "Mulai Tryout" }) })] }, t.id))), !tryouts.length && (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "py-6 text-center text-gray-500", children: "Belum ada tryout tersedia" }) }))] })] }) }) })] }) }) }));
}
