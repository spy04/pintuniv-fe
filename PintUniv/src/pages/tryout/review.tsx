import { useState } from "react";
import { useParams } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { useGetTryoutReviewQuery } from "@/services/api";

/* ================= TYPES ================= */
type ReviewAnswer = {
  question_text: string;
  selected_option: string;
  correct_choice: string;
  is_correct: boolean;
  explanation?: string;
  explanation_image?: string;
};

type ReviewSummary = {
  total: number;
  correct: number;
  wrong: number;
};

type ReviewData = {
  answers: ReviewAnswer[];
  summary: ReviewSummary;
};

/* ================= PAGE ================= */
export default function ReviewTryout() {
  const { tryoutId } = useParams<{ tryoutId: string }>();
  const tryoutIdNum = Number(tryoutId);

  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    data: review,
    isLoading,
    error,
  } = useGetTryoutReviewQuery(tryoutIdNum, {
    skip: !tryoutIdNum,
  });

  /* ================= STATES ================= */
  if (isLoading)
    return (
      <MainLayout>
        <div className="flex justify-center py-24">
          <Spinner className="size-6" />
        </div>
      </MainLayout>
    );

  if (error || !review)
    return (
      <MainLayout>
        <p className="text-red-600">Gagal memuat data review tryout</p>
      </MainLayout>
    );

  if (!review.answers?.length)
    return (
      <MainLayout>
        <p>Tidak ada jawaban untuk ditampilkan</p>
      </MainLayout>
    );

  const ans: ReviewAnswer = review.answers[currentIndex];

  /* ================= RENDER ================= */
  return (
    <MainLayout showRightContainer={false}>
      <div className="grid gap-4 md:h-[calc(100vh-72px)] md:grid-cols-[70%_30%]">
        {/* ================= REVIEW SOAL ================= */}
        <Card className="flex flex-col overflow-hidden">
          <div className="bg-[#152D64] px-6 py-3 font-semibold text-white">
            Review Soal {currentIndex + 1} / {review.answers.length}
          </div>

          <CardContent className="flex-1 space-y-4 overflow-y-auto">
            <p>
              <strong>Soal:</strong> {ans.question_text}
            </p>

            <p>
              <strong>Jawaban kamu:</strong> {ans.selected_option}
            </p>

            <p>
              <strong>Kunci jawaban:</strong> {ans.correct_choice}
            </p>

            <p
              className={
                ans.is_correct
                  ? "font-semibold text-green-600"
                  : "font-semibold text-red-600"
              }
            >
              {ans.is_correct ? "Jawaban Benar" : "Jawaban Salah"}
            </p>

            {ans.explanation && (
              <div>
                <strong>Pembahasan:</strong>
                <p className="mt-1">{ans.explanation}</p>
              </div>
            )}

            {ans.explanation_image && (
              <img src={ans.explanation_image} className="max-w-md rounded" />
            )}
          </CardContent>

          {/* ===== NAVIGASI ===== */}
          <div className="flex justify-between border-t p-4">
            <Button
              variant="outline"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              disabled={currentIndex === review.answers.length - 1}
              onClick={() => setCurrentIndex((i) => i + 1)}
            >
              Next
            </Button>
          </div>
        </Card>

        {/* ================= SIDEBAR ================= */}
        <Card className="flex flex-col">
          <CardContent className="space-y-4">
            <h4 className="text-center font-semibold">Daftar Soal</h4>

            <div className="grid grid-cols-5 gap-2">
              {review.answers.map((a: ReviewAnswer, idx: number) => (
                <Button
                  key={idx}
                  size="sm"
                  variant={currentIndex === idx ? "default" : "outline"}
                  className={
                    a.is_correct
                      ? "border-green-500 text-green-700"
                      : "border-red-500 text-red-700"
                  }
                  onClick={() => setCurrentIndex(idx)}
                >
                  {idx + 1}
                </Button>
              ))}
            </div>

            {/* ===== SUMMARY ===== */}
            <div className="mt-auto border-t pt-4 text-center text-sm">
              <p>
                <strong>Total Soal:</strong> {review.summary.total}
              </p>
              <p className="text-green-600">
                <strong>Benar:</strong> {review.summary.correct}
              </p>
              <p className="text-red-600">
                <strong>Salah:</strong> {review.summary.wrong}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
