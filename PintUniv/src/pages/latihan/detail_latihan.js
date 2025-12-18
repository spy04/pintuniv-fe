import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardHeader, CardTitle, CardContent, } from "@/components/ui/card";
import { useGetLatihanSoalQuery, useSubmitLatihanMutation, } from "@/services/api";
/* ================= PAGE ================= */
export default function LatihanSoalPage() {
    const { latihanId } = useParams();
    const latihanIdNum = Number(latihanId);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [correctCount, setCorrectCount] = useState(0);
    const [totalAnswered, setTotalAnswered] = useState(0);
    /* ===== FETCH SOAL ===== */
    const { data: rawSoal = [], isLoading, error, } = useGetLatihanSoalQuery(latihanIdNum, {
        skip: !latihanIdNum,
    });
    const [submitLatihan] = useSubmitLatihanMutation();
    /* ===== FORMAT DATA ===== */
    const soal = rawSoal.map((q) => ({
        id: q.id,
        question_text: q.text_latihan,
        explanation: q.explanation_latihan,
        correct_answer: q.answer_latihan,
        image: q.image_latihan,
        materi: q.materi,
        kategori: q.kategori,
        choices: [
            { key: "A", text: q.option_a_latihan, image: q.option_a_image_latihan },
            { key: "B", text: q.option_b_latihan, image: q.option_b_image_latihan },
            { key: "C", text: q.option_c_latihan, image: q.option_c_image_latihan },
            { key: "D", text: q.option_d_latihan, image: q.option_d_image_latihan },
            { key: "E", text: q.option_e_latihan, image: q.option_e_image_latihan },
        ],
    }));
    const currentQuestion = soal[currentIndex];
    /* ===== HANDLERS ===== */
    const handleAnswer = (qid, option) => {
        setAnswers((prev) => ({ ...prev, [qid]: option }));
    };
    const handleSubmit = async () => {
        if (!currentQuestion)
            return;
        const userAnswer = answers[currentQuestion.id];
        if (!userAnswer) {
            alert("Pilih dulu jawabannya!");
            return;
        }
        try {
            const res = await submitLatihan({
                latihanId: latihanIdNum,
                body: { [currentQuestion.id]: userAnswer },
            }).unwrap();
            const correct = res.results[0].correct === userAnswer;
            setModalContent({
                correct,
                correctAnswer: res.results[0].correct,
                explanation: currentQuestion.explanation,
            });
            setShowModal(true);
            if (correct)
                setCorrectCount((c) => c + 1);
            if (!answers[currentQuestion.id])
                setTotalAnswered((t) => t + 1);
        }
        catch {
            alert("Submit gagal");
        }
    };
    const handleNext = () => {
        setShowModal(false);
        setCurrentIndex((i) => Math.min(i + 1, soal.length - 1));
    };
    /* ===== STATES ===== */
    if (isLoading)
        return (_jsx(MainLayout, { showRightContainer: false, children: _jsx("div", { className: "flex justify-center py-20", children: _jsx(Spinner, { className: "size-6" }) }) }));
    if (error || !currentQuestion)
        return (_jsx(MainLayout, { showRightContainer: false, children: _jsx("div", { className: "text-red-600", children: "Gagal memuat soal" }) }));
    /* ===== RENDER ===== */
    return (_jsx(MainLayout, { showRightContainer: false, children: _jsxs("div", { className: "mx-auto", children: [_jsx("h2", { className: "text-xl font-semibold mb-1", children: currentQuestion.kategori?.title_practice }), _jsxs("p", { className: "text-sm text-gray-600 mb-6", children: [currentQuestion.materi?.judul_materi, " \u2022 ", correctCount, "/", totalAnswered, " benar"] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { children: [currentIndex + 1, ". ", currentQuestion.question_text] }) }), _jsxs(CardContent, { children: [currentQuestion.image && (_jsx("img", { src: currentQuestion.image, className: "max-w-xs mb-4" })), _jsx("div", { className: "space-y-3", children: currentQuestion.choices.map((c) => (_jsxs("label", { className: "flex gap-2 items-start cursor-pointer", children: [_jsx("input", { type: "radio", name: `q-${currentQuestion.id}`, checked: answers[currentQuestion.id] === c.key, onChange: () => handleAnswer(currentQuestion.id, c.key) }), _jsxs("span", { children: [_jsxs("strong", { children: [c.key, "."] }), " ", c.text] })] }, c.key))) }), _jsx("div", { className: "flex justify-center mt-6", children: _jsx(Button, { onClick: handleSubmit, children: "Submit" }) })] })] }), showModal && (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center", children: _jsxs(Card, { className: "w-[320px]", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: modalContent.correct
                                        ? "Jawaban Benar 🎉"
                                        : "Jawaban Salah ❌" }) }), _jsxs(CardContent, { children: [!modalContent.correct && (_jsxs("p", { className: "text-sm mb-2", children: ["Jawaban benar:", " ", _jsx("strong", { children: modalContent.correctAnswer })] })), _jsx("p", { className: "text-sm mb-4", children: modalContent.explanation }), _jsx(Button, { onClick: handleNext, className: "w-full", children: "Next" })] })] }) }))] }) }));
}
