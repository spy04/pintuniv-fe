import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import {
  useGetUserQuery,
  useGetQuestionsQuery,
  useStartTryoutMutation,
  useSaveDraftMutation,
  useSubmitFinalMutation,
} from "@/services/api";

/* ================= TYPES ================= */
type Choice = {
  key: string;
  text?: string;
  image?: string;
};

type QuestionItem = {
  id: number;
  text: string;
  image?: string;
  explanation?: string;
  explanation_image?: string;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  option_e?: string;
  option_a_image?: string;
  option_b_image?: string;
  option_c_image?: string;
  option_d_image?: string;
  option_e_image?: string;
};

/* ================= PAGE ================= */
export default function QuestionPage() {
  const { tryoutId } = useParams<{ tryoutId: string }>();
  const navigate = useNavigate();

  const tryoutIdNum = Number(tryoutId);

  const { data: user } = useGetUserQuery();
  const isPro = !!user?.profile?.is_pro;

  const { data: questionsRaw = [], isLoading } = useGetQuestionsQuery(
    tryoutIdNum,
    {
      skip: !tryoutIdNum,
    },
  );

  const [startTryout] = useStartTryoutMutation();
  const [saveDraft] = useSaveDraftMutation();
  const [submitFinal] = useSubmitFinalMutation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  /* ================= START SESSION ================= */
  useEffect(() => {
    if (!tryoutIdNum || !isPro) return;

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
    if (timeLeft === null) return;

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
    return questionsRaw.map((q: QuestionItem) => ({
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
  const handleAnswer = (qId: number, key: string) => {
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
    } catch (err) {
      console.error("Submit gagal", err);
    }
  };

  const formatTime = (ms: number | null) => {
    if (!ms) return "--:--";
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  /* ================= GUARD ================= */
  if (!isPro)
    return (
      <MainLayout>
        <div className="py-20 text-center">
          <p className="mb-4 font-semibold">
            Fitur ini hanya untuk pengguna PRO
          </p>
          <Button onClick={() => navigate("/upgrade")}>Upgrade Sekarang</Button>
        </div>
      </MainLayout>
    );

  if (isLoading)
    return (
      <MainLayout>
        <div className="flex justify-center py-24">
          <Spinner className="size-6" />
        </div>
      </MainLayout>
    );

  if (!questions.length)
    return (
      <MainLayout>
        <p>Tidak ada soal</p>
      </MainLayout>
    );

  /* ================= RENDER ================= */
  return (
    <>
      <MainLayout showRightContainer={false}>
        <div className="grid gap-4 md:h-[calc(100vh-72px)] md:grid-cols-[70%_30%]">
          {/* ================= SOAL ================= */}
          <Card className="flex flex-col overflow-hidden">
            <div className="bg-[#152D64] px-6 py-3 font-semibold text-white">
              Soal {currentIndex + 1} / {questions.length}
            </div>

            <CardContent className="flex-1 space-y-4 overflow-y-auto">
              <p>{q.text}</p>

              {q.image && <img src={q.image} className="max-w-md rounded" />}

              {q.choices.map((c: Choice) => (
                <label
                  key={c.key}
                  className="flex cursor-pointer items-start gap-2"
                >
                  <input
                    type="radio"
                    checked={answers[q.id] === c.key}
                    onChange={() => handleAnswer(q.id, c.key)}
                  />
                  <span>
                    <strong>{c.key}.</strong> {c.text}
                    {c.image && <img src={c.image} className="mt-2 max-w-xs" />}
                  </span>
                </label>
              ))}
            </CardContent>

            <div className="flex justify-between border-t p-4">
              <Button
                variant="outline"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((i) => i - 1)}
              >
                Previous
              </Button>

              {currentIndex === questions.length - 1 ? (
                <Button onClick={handleSubmit}>Submit</Button>
              ) : (
                <Button onClick={() => setCurrentIndex((i) => i + 1)}>
                  Next
                </Button>
              )}
            </div>
          </Card>

          {/* ================= SIDEBAR ================= */}
          <Card className="flex flex-col">
            <div className="bg-[#152D64] py-3 text-center font-bold text-white">
              ⏱ {formatTime(timeLeft)}
            </div>

            <CardContent className="grid grid-cols-5 gap-2">
              {questions.map((_, idx) => (
                <Button
                  key={idx}
                  size="sm"
                  variant={
                    currentIndex === idx
                      ? "default"
                      : answers[questions[idx].id]
                        ? "secondary"
                        : "outline"
                  }
                  onClick={() => setCurrentIndex(idx)}
                >
                  {idx + 1}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </>
  );
}
