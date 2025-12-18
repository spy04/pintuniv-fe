import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useGetUserQuery, useGetQuestionsQuery, useStartTryoutMutation, useSaveDraftMutation, useSubmitFinalMutation, } from "@/services/api";
/* ================= PAGE ================= */
export default function QuestionPage() {
    const { tryoutId } = useParams();
    const navigate = useNavigate();
    const tryoutIdNum = Number(tryoutId);
    const { data: user } = useGetUserQuery();
    const isPro = !!user?.profile?.is_pro;
    const { data: questionsRaw = [], isLoading } = useGetQuestionsQuery(tryoutIdNum, {
        skip: !tryoutIdNum,
    });
    const [startTryout] = useStartTryoutMutation();
    const [saveDraft] = useSaveDraftMutation();
    const [submitFinal] = useSubmitFinalMutation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(null);
    /* ================= START SESSION ================= */
    useEffect(() => {
        if (!tryoutIdNum || !isPro)
            return;
        startTryout(tryoutIdNum)
            .unwrap()
            .then((session) => {
            if (session?.remaining_time !== undefined) {
                setTimeLeft(session.remaining_time * 1000);
            }
        })
            .catch(() => navigate("/dashboard_user"));
    }, [tryoutIdNum, isPro]);
    /* ================= TIMER ================= */
    useEffect(() => {
        if (timeLeft === null)
            return;
        const t = setInterval(() => {
            setTimeLeft((prev) => {
                if (!prev || prev <= 1000) {
                    clearInterval(t);
                    handleSubmit();
                    return 0;
                }
                return prev - 1000;
            });
        }, 1000);
        return () => clearInterval(t);
    }, [timeLeft]);
    /* ================= FORMAT QUESTIONS ================= */
    const questions = useMemo(() => {
        return questionsRaw.map((q) => ({
            id: q.id,
            text: q.text,
            image: q.image,
            choices: [
                { key: "A", text: q.option_a, image: q.option_a_image },
                { key: "B", text: q.option_b, image: q.option_b_image },
                { key: "C", text: q.option_c, image: q.option_c_image },
                { key: "D", text: q.option_d, image: q.option_d_image },
                { key: "E", text: q.option_e, image: q.option_e_image },
            ],
        }));
    }, [questionsRaw]);
    const q = questions[currentIndex];
    /* ================= HANDLERS ================= */
    const handleAnswer = (qId, key) => {
        setAnswers((prev) => ({ ...prev, [qId]: key }));
        saveDraft({ [qId]: key });
    };
    const handleSubmit = async () => {
        try {
            await submitFinal({
                id: tryoutIdNum,
                answers,
            }).unwrap();
            navigate(`/review/${tryoutIdNum}`);
        }
        catch (err) {
            console.error("Submit gagal", err);
        }
    };
    const formatTime = (ms) => {
        if (!ms)
            return "--:--";
        const s = Math.floor(ms / 1000);
        return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    };
    /* ================= GUARD ================= */
    if (!isPro)
        return (_jsx(MainLayout, { children: _jsxs("div", { className: "py-20 text-center", children: [_jsx("p", { className: "mb-4 font-semibold", children: "Fitur ini hanya untuk pengguna PRO" }), _jsx(Button, { onClick: () => navigate("/upgrade"), children: "Upgrade Sekarang" })] }) }));
    if (isLoading)
        return (_jsx(MainLayout, { children: _jsx("div", { className: "flex justify-center py-24", children: _jsx(Spinner, { className: "size-6" }) }) }));
    if (!questions.length)
        return (_jsx(MainLayout, { children: _jsx("p", { children: "Tidak ada soal" }) }));
    /* ================= RENDER ================= */
    return (_jsx(_Fragment, { children: _jsx(MainLayout, { showRightContainer: false, children: _jsxs("div", { className: "grid gap-4 md:h-[calc(100vh-72px)] md:grid-cols-[70%_30%]", children: [_jsxs(Card, { className: "flex flex-col overflow-hidden", children: [_jsxs("div", { className: "bg-[#152D64] px-6 py-3 font-semibold text-white", children: ["Soal ", currentIndex + 1, " / ", questions.length] }), _jsxs(CardContent, { className: "flex-1 space-y-4 overflow-y-auto", children: [_jsx("p", { children: q.text }), q.image && _jsx("img", { src: q.image, className: "max-w-md rounded" }), q.choices.map((c) => (_jsxs("label", { className: "flex cursor-pointer items-start gap-2", children: [_jsx("input", { type: "radio", checked: answers[q.id] === c.key, onChange: () => handleAnswer(q.id, c.key) }), _jsxs("span", { children: [_jsxs("strong", { children: [c.key, "."] }), " ", c.text, c.image && _jsx("img", { src: c.image, className: "mt-2 max-w-xs" })] })] }, c.key)))] }), _jsxs("div", { className: "flex justify-between border-t p-4", children: [_jsx(Button, { variant: "outline", disabled: currentIndex === 0, onClick: () => setCurrentIndex((i) => i - 1), children: "Previous" }), currentIndex === questions.length - 1 ? (_jsx(Button, { onClick: handleSubmit, children: "Submit" })) : (_jsx(Button, { onClick: () => setCurrentIndex((i) => i + 1), children: "Next" }))] })] }), _jsxs(Card, { className: "flex flex-col", children: [_jsxs("div", { className: "bg-[#152D64] py-3 text-center font-bold text-white", children: ["\u23F1 ", formatTime(timeLeft)] }), _jsx(CardContent, { className: "grid grid-cols-5 gap-2", children: questions.map((_, idx) => (_jsx(Button, { size: "sm", variant: currentIndex === idx
                                        ? "default"
                                        : answers[questions[idx].id]
                                            ? "secondary"
                                            : "outline", onClick: () => setCurrentIndex(idx), children: idx + 1 }, idx))) })] })] }) }) }));
}
