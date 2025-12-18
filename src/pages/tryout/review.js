import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useGetTryoutReviewQuery } from "@/services/api";
/* ================= PAGE ================= */
export default function ReviewTryout() {
    const { tryoutId } = useParams();
    const tryoutIdNum = Number(tryoutId);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { data: review, isLoading, error, } = useGetTryoutReviewQuery(tryoutIdNum, {
        skip: !tryoutIdNum,
    });
    /* ================= STATES ================= */
    if (isLoading)
        return (_jsx(MainLayout, { children: _jsx("div", { className: "flex justify-center py-24", children: _jsx(Spinner, { className: "size-6" }) }) }));
    if (error || !review)
        return (_jsx(MainLayout, { children: _jsx("p", { className: "text-red-600", children: "Gagal memuat data review tryout" }) }));
    if (!review.answers?.length)
        return (_jsx(MainLayout, { children: _jsx("p", { children: "Tidak ada jawaban untuk ditampilkan" }) }));
    const ans = review.answers[currentIndex];
    /* ================= RENDER ================= */
    return (_jsx(MainLayout, { showRightContainer: false, children: _jsxs("div", { className: "grid gap-4 md:h-[calc(100vh-72px)] md:grid-cols-[70%_30%]", children: [_jsxs(Card, { className: "flex flex-col overflow-hidden", children: [_jsxs("div", { className: "bg-[#152D64] px-6 py-3 font-semibold text-white", children: ["Review Soal ", currentIndex + 1, " / ", review.answers.length] }), _jsxs(CardContent, { className: "flex-1 space-y-4 overflow-y-auto", children: [_jsxs("p", { children: [_jsx("strong", { children: "Soal:" }), " ", ans.question_text] }), _jsxs("p", { children: [_jsx("strong", { children: "Jawaban kamu:" }), " ", ans.selected_option] }), _jsxs("p", { children: [_jsx("strong", { children: "Kunci jawaban:" }), " ", ans.correct_choice] }), _jsx("p", { className: ans.is_correct
                                        ? "font-semibold text-green-600"
                                        : "font-semibold text-red-600", children: ans.is_correct ? "Jawaban Benar" : "Jawaban Salah" }), ans.explanation && (_jsxs("div", { children: [_jsx("strong", { children: "Pembahasan:" }), _jsx("p", { className: "mt-1", children: ans.explanation })] })), ans.explanation_image && (_jsx("img", { src: ans.explanation_image, className: "max-w-md rounded" }))] }), _jsxs("div", { className: "flex justify-between border-t p-4", children: [_jsx(Button, { variant: "outline", disabled: currentIndex === 0, onClick: () => setCurrentIndex((i) => i - 1), children: "Previous" }), _jsx(Button, { variant: "outline", disabled: currentIndex === review.answers.length - 1, onClick: () => setCurrentIndex((i) => i + 1), children: "Next" })] })] }), _jsx(Card, { className: "flex flex-col", children: _jsxs(CardContent, { className: "space-y-4", children: [_jsx("h4", { className: "text-center font-semibold", children: "Daftar Soal" }), _jsx("div", { className: "grid grid-cols-5 gap-2", children: review.answers.map((a, idx) => (_jsx(Button, { size: "sm", variant: currentIndex === idx ? "default" : "outline", className: a.is_correct
                                        ? "border-green-500 text-green-700"
                                        : "border-red-500 text-red-700", onClick: () => setCurrentIndex(idx), children: idx + 1 }, idx))) }), _jsxs("div", { className: "mt-auto border-t pt-4 text-center text-sm", children: [_jsxs("p", { children: [_jsx("strong", { children: "Total Soal:" }), " ", review.summary.total] }), _jsxs("p", { className: "text-green-600", children: [_jsx("strong", { children: "Benar:" }), " ", review.summary.correct] }), _jsxs("p", { className: "text-red-600", children: [_jsx("strong", { children: "Salah:" }), " ", review.summary.wrong] })] })] }) })] }) }));
}
