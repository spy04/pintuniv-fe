import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { useGetTryoutsQuery, useStartTryoutMutation } from "@/services/api";

/* ================= TYPES ================= */
type TryoutItem = {
  id: number;
  title: string;
  duration: number;
  question_count: number;
  finished?: boolean;
};

/* ================= PAGE ================= */
export default function TryoutList() {
  const navigate = useNavigate();

  const {
    data: tryouts = [],
    isLoading,
    error,
  } = useGetTryoutsQuery(undefined);

  const [startTryout, { isLoading: starting }] = useStartTryoutMutation();

  /* ================= HANDLER ================= */
  const handleTryoutClick = async (t: TryoutItem) => {
    try {
      const session = await startTryout(t.id).unwrap();

      if (session.finished) {
        navigate(`/review/${t.id}`, { state: { session } });
      } else {
        navigate(`/question/${t.id}`, { state: { session } });
      }
    } catch (err) {
      console.error("Gagal memulai tryout", err);
    }
  };

  /* ================= LOADING ================= */
  if (isLoading)
    return (
      <MainLayout>
        <div className="flex justify-center py-24">
          <Spinner className="size-6" />
        </div>
      </MainLayout>
    );

  if (error)
    return (
      <MainLayout>
        <div className="text-red-600">Gagal memuat daftar tryout</div>
      </MainLayout>
    );

  /* ================= RENDER ================= */
  return (
    <>
      <MainLayout>
        <div className="space-y-6">
          {/* ===== HEADER ===== */}
          <div className="flex items-center gap-3">
            <i className="fas fa-pen-alt text-xl" />
            <h1 className="text-3xl font-bold">Tryout</h1>
          </div>

          {/* ===== TABLE ===== */}
          <Card>
            <CardContent className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-3">Judul</th>
                    <th className="py-3">Waktu</th>
                    <th className="py-3">Komposisi</th>
                    <th className="py-3">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {tryouts.map((t: TryoutItem) => (
                    <tr key={t.id} className="border-b last:border-none">
                      <td className="py-3 font-medium">{t.title}</td>
                      <td className="py-3">{t.duration} menit</td>
                      <td className="py-3">{t.question_count} soal</td>
                      <td className="py-3">
                        <Button
                          size="sm"
                          disabled={starting}
                          onClick={() => handleTryoutClick(t)}
                        >
                          {t.finished ? "Lihat Review" : "Mulai Tryout"}
                        </Button>
                      </td>
                    </tr>
                  ))}

                  {!tryouts.length && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-6 text-center text-gray-500"
                      >
                        Belum ada tryout tersedia
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </>
  );
}
