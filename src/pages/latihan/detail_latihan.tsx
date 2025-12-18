import { useState } from "react";
import { useParams } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  useGetLatihanSoalQuery,
  useSubmitLatihanMutation,
} from "@/services/api";

/* ================= TYPES ================= */
type Choice = {
  key: string;
  text?: string;
  image?: string;
};

type Question = {
  id: number;
  question_text: string;
  explanation: string;
  correct_answer: string;
  image?: string;
  materi?: any;
  kategori?: any;
  choices: Choice[];
};

/* ================= PAGE ================= */
export default function LatihanSoalPage() {
  const { latihanId } = useParams<{ latihanId: string }>();
  const latihanIdNum = Number(latihanId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  /* ===== FETCH SOAL ===== */
  const {
    data: rawSoal = [],
    isLoading,
    error,
  } = useGetLatihanSoalQuery(latihanIdNum, {
    skip: !latihanIdNum,
  });

  const [submitLatihan] = useSubmitLatihanMutation();

  /* ===== FORMAT DATA ===== */
  const soal: Question[] = rawSoal.map((q: any) => ({
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
  const handleAnswer = (qid: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: option }));
  };

  const handleSubmit = async () => {
    if (!currentQuestion) return;

    const userAnswer = answers[currentQuestion.id];
    if (!userAnswer) {
      alert("Pilih dulu jawabannya!");
      return;
    }

    try {
      const res: any = await submitLatihan({
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

      if (correct) setCorrectCount((c) => c + 1);
      if (!answers[currentQuestion.id])
        setTotalAnswered((t) => t + 1);
    } catch {
      alert("Submit gagal");
    }
  };

  const handleNext = () => {
    setShowModal(false);
    setCurrentIndex((i) => Math.min(i + 1, soal.length - 1));
  };

  /* ===== STATES ===== */
  if (isLoading)
    return (
      <MainLayout showRightContainer={false}>
        <div className="flex justify-center py-20">
          <Spinner className="size-6" />
        </div>
      </MainLayout>
    );

  if (error || !currentQuestion)
    return (
      <MainLayout showRightContainer={false}>
        <div className="text-red-600">Gagal memuat soal</div>
      </MainLayout>
    );

  /* ===== RENDER ===== */
  return (
    <MainLayout showRightContainer={false}>
      <div className="mx-auto">
        {/* HEADER */}
        <h2 className="text-xl font-semibold mb-1">
          {currentQuestion.kategori?.title_practice}
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          {currentQuestion.materi?.judul_materi} • {correctCount}/
          {totalAnswered} benar
        </p>

        {/* QUESTION CARD */}
        <Card>
          <CardHeader>
            <CardTitle>
              {currentIndex + 1}. {currentQuestion.question_text}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {currentQuestion.image && (
              <img
                src={currentQuestion.image}
                className="max-w-xs mb-4"
              />
            )}

            {/* OPTIONS */}
            <div className="space-y-3">
              {currentQuestion.choices.map((c) => (
                <label
                  key={c.key}
                  className="flex gap-2 items-start cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`q-${currentQuestion.id}`}
                    checked={answers[currentQuestion.id] === c.key}
                    onChange={() =>
                      handleAnswer(currentQuestion.id, c.key)
                    }
                  />
                  <span>
                    <strong>{c.key}.</strong> {c.text}
                  </span>
                </label>
              ))}
            </div>

            {/* SUBMIT */}
            <div className="flex justify-center mt-6">
              <Button onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <Card className="w-[320px]">
              <CardHeader>
                <CardTitle>
                  {modalContent.correct
                    ? "Jawaban Benar 🎉"
                    : "Jawaban Salah ❌"}
                </CardTitle>
              </CardHeader>

              <CardContent>
                {!modalContent.correct && (
                  <p className="text-sm mb-2">
                    Jawaban benar:{" "}
                    <strong>{modalContent.correctAnswer}</strong>
                  </p>
                )}

                <p className="text-sm mb-4">
                  {modalContent.explanation}
                </p>

                <Button onClick={handleNext} className="w-full">
                  Next
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
