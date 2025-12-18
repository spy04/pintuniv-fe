import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardHeader, CardTitle, CardContent, } from "@/components/ui/card";
import { useGetLatihanAllQuery, useGetUserQuery } from "@/services/api";
/* ================= PAGE ================= */
export default function Latihan() {
    const navigate = useNavigate();
    /* ===== USER ===== */
    const { data: user } = useGetUserQuery();
    const isPro = !!user?.profile?.is_pro;
    /* ===== LATIHAN ===== */
    const { data: latihan = [], isLoading, error, } = useGetLatihanAllQuery(undefined);
    /* ===== GROUP BY KATEGORI ===== */
    const groupedByKategori = useMemo(() => {
        return latihan.reduce((acc, item) => {
            const key = item.kategori?.title_practice || "Lainnya";
            if (!acc[key])
                acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {});
    }, [latihan]);
    /* ===== STATES ===== */
    if (isLoading)
        return (_jsx(MainLayout, { showRightContainer: false, children: _jsx("div", { className: "flex justify-center py-20", children: _jsx(Spinner, { className: "size-6" }) }) }));
    if (error)
        return (_jsx(MainLayout, { showRightContainer: false, children: _jsx("div", { className: "text-red-600", children: "Gagal memuat latihan." }) }));
    /* ===== RENDER ===== */
    return (_jsx(MainLayout, { showRightContainer: false, children: _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold mb-8", children: "Latihan Soal" }), Object.keys(groupedByKategori).map((kategori) => (_jsxs("div", { className: "mb-12", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: kategori }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5", children: groupedByKategori[kategori].map((lat) => (_jsxs(Card, { className: "flex flex-col", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm", children: lat.title_latihan }) }), _jsxs(CardContent, { className: "flex-1 flex flex-col justify-between", children: [_jsxs("span", { className: "text-xs text-gray-600 mb-4", children: [lat.soal?.length || 0, " soal"] }), _jsx(Button, { onClick: () => navigate(`/latihan/${lat.id}`), className: "mt-auto", children: "Mulai" })] })] }, lat.id))) })] }, kategori)))] }) }));
}
