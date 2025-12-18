import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { useGetLatihanAllQuery, useGetUserQuery } from "@/services/api";

/* ================= TYPES ================= */
type LatihanItem = {
  id: number;
  title_latihan: string;
  soal?: any[];
  kategori?: {
    title_practice: string;
  };
};

/* ================= PAGE ================= */
export default function Latihan() {
  const navigate = useNavigate();

  /* ===== USER ===== */
  const { data: user } = useGetUserQuery();
  const isPro = !!user?.profile?.is_pro;

  /* ===== LATIHAN ===== */
  const {
    data: latihan = [],
    isLoading,
    error,
  } = useGetLatihanAllQuery(undefined);

  /* ===== GROUP BY KATEGORI ===== */
  const groupedByKategori = useMemo(() => {
    return (latihan as LatihanItem[]).reduce((acc, item) => {
      const key = item.kategori?.title_practice || "Lainnya";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as Record<string, LatihanItem[]>);
  }, [latihan]);

  /* ===== STATES ===== */
  if (isLoading)
    return (
      <MainLayout showRightContainer={false}>
        <div className="flex justify-center py-20">
          <Spinner className="size-6" />
        </div>
      </MainLayout>
    );

  if (error)
    return (
      <MainLayout showRightContainer={false}>
        <div className="text-red-600">Gagal memuat latihan.</div>
      </MainLayout>
    );

  /* ===== RENDER ===== */
  return (
    <MainLayout showRightContainer={false}>
      <div>
        <h1 className="text-2xl font-bold mb-8">Latihan Soal</h1>

        {Object.keys(groupedByKategori).map((kategori) => (
          <div key={kategori} className="mb-12">
            <h3 className="text-lg font-semibold mb-4">
              {kategori}
            </h3>

            {/* GRID BIAR FULL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {groupedByKategori[kategori].map((lat) => (
                <Card key={lat.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-sm">
                      {lat.title_latihan}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col justify-between">
                    <span className="text-xs text-gray-600 mb-4">
                      {lat.soal?.length || 0} soal
                    </span>

                    <Button
                      onClick={() =>
                        navigate(`/latihan/${lat.id}`)
                      }
                      className="mt-auto"
                    >
                      Mulai
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
