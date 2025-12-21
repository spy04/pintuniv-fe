import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import {
  useGetSubscriptionsQuery,
  useCheckoutSubscriptionMutation,
  api,
} from "@/services/api";
import { useAppDispatch } from "@/hooks/useAppDispatch";

/* ================= TYPES ================= */
type SubscriptionItem = {
  id: number;
  nama: string;
  deskripsi: string;
  harga_asli: number;
  harga_final: number;
  duration: number; // hari
  diskon?: boolean;
};

/* ================= PAGE ================= */
export default function SubscriptionPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: subs = [], isLoading } = useGetSubscriptionsQuery();
  const [checkout] = useCheckoutSubscriptionMutation();

  const [selectedSub, setSelectedSub] = useState<SubscriptionItem | null>(null);

  /* ===== SET DEFAULT ===== */
  useEffect(() => {
    if (subs.length > 0) setSelectedSub(subs[0]);
  }, [subs]);

  /* ===== HANDLER ===== */
  const handlePay = async (sub: SubscriptionItem) => {
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
    } catch (err) {
      console.error("Checkout gagal", err);
    }
  };

  /* ================= STATES ================= */
  if (isLoading)
    return (
      <MainLayout>
        <div className="flex justify-center py-24">
          <Spinner className="size-6" />
        </div>
      </MainLayout>
    );

  /* ================= RENDER ================= */
  return (
    <MainLayout showRightContainer={false}>
      <div className="mx-auto max-w-6xl space-y-10">
        {/* ===== HEADER ===== */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Langganan Belajar di Pintu Universitas</h1>
          <p className="mt-2 text-gray-600">
            Belajar jadi makin gampang!
Dari materi, latihan soal, tryout, analisis soal sampai jalur masuk universitas impian kamu, semua ada di sini!
          </p>
        </div>

        {/* ===== CONTENT ===== */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* ================= LEFT ================= */}
          <Card className="bg-blue-50">
            <CardContent className="p-6">
              <h3 className="mb-4 text-center font-semibold">
                Perbandingan Fitur
              </h3>

              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Fitur</th>
                    <th className="py-2 text-center">Basic</th>
                    <th className="py-2 text-center">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2">Pintu Universitas</td>
                    <td className="text-center">❌</td>
                    <td className="text-center">Akses penuh ke Informasi jalur masuk universitas</td>
                  </tr>
                  <tr>
                    <td className="py-2">Materi</td>
                    <td className="text-center">Materi Dasar</td>
                    <td className="text-center">Semua materi lengkap dan update</td>
                  </tr>
                  <tr>
                    <td className="py-2">Latihan Soal</td>
                    <td className="text-center">5 Latihan soal / bulan</td>
                    <td className="text-center">Akses ke 10.000+ soal dan pembahasan</td>
                  </tr>
                  <tr>
                    <td className="py-2">Tryout</td>
                    <td className="text-center">2 tryout / bulan</td>
                    <td className="text-center">Akses penuh ke 10+ tryout dengan ranking</td>
                  </tr>
                  <tr>
                    <td className="py-2">Analisis Otomatis</td>
                    <td className="text-center">❌</td>
                    <td className="text-center">✔️</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* ================= RIGHT ================= */}
          <Card>
            <CardContent className="space-y-6 p-6">
              <h3 className="text-center font-semibold">Pilih Paketmu</h3>

              {/* PILIHAN */}
              <div className="flex justify-center gap-2">
                {subs.map((sub) => (
                  <Button
                    key={sub.id}
                    variant={selectedSub?.id === sub.id ? "default" : "outline"}
                    onClick={() => setSelectedSub(sub as SubscriptionItem)}
                  >
                    {sub.nama}
                  </Button>
                ))}
              </div>

              {/* DETAIL */}
              {selectedSub && (
                <div className="space-y-3 text-center">
                  {/* HARGA PER BULAN */}
                  <div>
                    {selectedSub.diskon ? (
                      <>
                        <p className="text-sm text-gray-400 line-through">
                          Rp{" "}
                          {Math.round(
                            selectedSub.harga_asli /
                              (selectedSub.duration / 30),
                          ).toLocaleString("id-ID")}{" "}
                          / bulan
                        </p>

                        <p className="text-2xl font-bold text-[#152D64]">
                          Rp{" "}
                          {Math.round(
                            selectedSub.harga_final /
                              (selectedSub.duration / 30),
                          ).toLocaleString("id-ID")}{" "}
                          / bulan
                        </p>
                      </>
                    ) : (
                      <p className="text-2xl font-bold text-[#152D64]">
                        Rp{" "}
                        {Math.round(
                          selectedSub.harga_asli / (selectedSub.duration / 30),
                        ).toLocaleString("id-ID")}{" "}
                        / bulan
                      </p>
                    )}
                  </div>

                  {/* TOTAL HARGA */}
                  <div className="text-sm">
                    {selectedSub.diskon ? (
                      <>
                        <span className="mr-2 text-gray-400 line-through">
                          Rp {selectedSub.harga_asli.toLocaleString("id-ID")}
                        </span>
                        <span className="font-semibold text-red-600">
                          Rp {selectedSub.harga_final.toLocaleString("id-ID")}
                        </span>
                      </>
                    ) : (
                      <span className="font-semibold">
                        Total: Rp{" "}
                        {selectedSub.harga_asli.toLocaleString("id-ID")}
                      </span>
                    )}
                  </div>

                  {/* DESKRIPSI */}
                  <p className="text-sm text-gray-600">
                    {selectedSub.deskripsi}
                  </p>
                  <p>Langganan sekarang dan nikmati pengalaman belajar interaktif biar makin siap menuju kampus impian! 🚀</p>

                  <Button
                    className="mt-4"
                    onClick={() => handlePay(selectedSub)}
                  >
                    Langganan Sekarang
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
