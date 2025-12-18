import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useGetSubscriptionsQuery, useCheckoutSubscriptionMutation, api, } from "@/services/api";
import { useAppDispatch } from "@/hooks/useAppDispatch";
/* ================= PAGE ================= */
export default function SubscriptionPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { data: subs = [], isLoading } = useGetSubscriptionsQuery();
    const [checkout] = useCheckoutSubscriptionMutation();
    const [selectedSub, setSelectedSub] = useState(null);
    /* ===== SET DEFAULT ===== */
    useEffect(() => {
        if (subs.length > 0)
            setSelectedSub(subs[0]);
    }, [subs]);
    /* ===== HANDLER ===== */
    const handlePay = async (sub) => {
        try {
            const trx = await checkout({
                subscriptionId: sub.id, // ⬅️ INI DIA
                amount: sub.harga_final, // ⬅️ INI DIA
            }).unwrap();
            window.snap.pay(trx.token, {
                onSuccess: () => {
                    dispatch(api.util.invalidateTags(["User"]));
                    navigate("/");
                },
                onPending: () => {
                    console.log("Payment pending");
                },
                onError: () => {
                    console.log("Payment gagal");
                },
                onClose: () => {
                    console.log("Popup ditutup");
                },
            });
        }
        catch (err) {
            console.error("Checkout gagal", err);
        }
    };
    /* ================= STATES ================= */
    if (isLoading)
        return (_jsx(MainLayout, { children: _jsx("div", { className: "flex justify-center py-24", children: _jsx(Spinner, { className: "size-6" }) }) }));
    /* ================= RENDER ================= */
    return (_jsx(MainLayout, { showRightContainer: false, children: _jsxs("div", { className: "mx-auto max-w-6xl space-y-10", children: [_jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Plan & Pricing" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Pilih paket terbaik untuk akses penuh Pintu Universitas" })] }), _jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [_jsx(Card, { className: "bg-blue-50", children: _jsxs(CardContent, { className: "p-6", children: [_jsx("h3", { className: "mb-4 text-center font-semibold", children: "Perbandingan Fitur" }), _jsxs("table", { className: "w-full border-collapse text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b", children: [_jsx("th", { className: "py-2 text-left", children: "Fitur" }), _jsx("th", { className: "py-2 text-center", children: "Basic" }), _jsx("th", { className: "py-2 text-center", children: "Pro" })] }) }), _jsxs("tbody", { children: [_jsxs("tr", { children: [_jsx("td", { className: "py-2", children: "Materi" }), _jsx("td", { className: "text-center", children: "Materi Awal" }), _jsx("td", { className: "text-center", children: "\u2714\uFE0F" })] }), _jsxs("tr", { children: [_jsx("td", { className: "py-2", children: "Latihan Soal" }), _jsx("td", { className: "text-center", children: "5 Soal" }), _jsx("td", { className: "text-center", children: "\u2714\uFE0F" })] }), _jsxs("tr", { children: [_jsx("td", { className: "py-2", children: "Tryout" }), _jsx("td", { className: "text-center", children: "2 / bulan" }), _jsx("td", { className: "text-center", children: "\u2714\uFE0F" })] }), _jsxs("tr", { children: [_jsx("td", { className: "py-2", children: "Analisis Otomatis" }), _jsx("td", { className: "text-center", children: "\u274C" }), _jsx("td", { className: "text-center", children: "\u2714\uFE0F" })] })] })] })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "space-y-6 p-6", children: [_jsx("h3", { className: "text-center font-semibold", children: "Pilih Paket" }), _jsx("div", { className: "flex justify-center gap-2", children: subs.map((sub) => (_jsx(Button, { variant: selectedSub?.id === sub.id ? "default" : "outline", onClick: () => setSelectedSub(sub), children: sub.nama }, sub.id))) }), selectedSub && (_jsxs("div", { className: "space-y-3 text-center", children: [_jsx("div", { children: selectedSub.diskon ? (_jsxs(_Fragment, { children: [_jsxs("p", { className: "text-sm text-gray-400 line-through", children: ["Rp", " ", Math.round(selectedSub.harga_asli /
                                                                    (selectedSub.duration / 30)).toLocaleString("id-ID"), " ", "/ bulan"] }), _jsxs("p", { className: "text-2xl font-bold text-[#152D64]", children: ["Rp", " ", Math.round(selectedSub.harga_final /
                                                                    (selectedSub.duration / 30)).toLocaleString("id-ID"), " ", "/ bulan"] })] })) : (_jsxs("p", { className: "text-2xl font-bold text-[#152D64]", children: ["Rp", " ", Math.round(selectedSub.harga_asli / (selectedSub.duration / 30)).toLocaleString("id-ID"), " ", "/ bulan"] })) }), _jsx("div", { className: "text-sm", children: selectedSub.diskon ? (_jsxs(_Fragment, { children: [_jsxs("span", { className: "mr-2 text-gray-400 line-through", children: ["Rp ", selectedSub.harga_asli.toLocaleString("id-ID")] }), _jsxs("span", { className: "font-semibold text-red-600", children: ["Rp ", selectedSub.harga_final.toLocaleString("id-ID")] })] })) : (_jsxs("span", { className: "font-semibold", children: ["Total: Rp", " ", selectedSub.harga_asli.toLocaleString("id-ID")] })) }), _jsx("p", { className: "text-sm text-gray-600", children: selectedSub.deskripsi }), _jsx(Button, { className: "mt-4", onClick: () => handlePay(selectedSub), children: "Langganan Sekarang" })] }))] }) })] })] }) }));
}
