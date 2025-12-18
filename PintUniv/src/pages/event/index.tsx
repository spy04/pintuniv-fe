import { useNavigate } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

import { useGetEventsQuery } from "@/services/api";

/* ================= TYPES ================= */
type EventItem = {
  id: number;
  title: string;
  photo?: string;
  start_date: string;
};

/* ================= PAGE ================= */
export default function EventPage() {
  const navigate = useNavigate();

  const { data: events = [], isLoading, error } = useGetEventsQuery(undefined);

  /* ================= STATES ================= */
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
        <p className="text-red-600">Gagal mengambil data event</p>
      </MainLayout>
    );

  /* ================= RENDER ================= */
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Daftar Event</h1>

        <div className="space-y-3">
          {events.map((e: EventItem) => (
            <Card
              key={e.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => navigate(`/event/${e.id}`)}
            >
              <CardContent className="flex items-center gap-4">
                {/* Image */}
                {e.photo && (
                  <img
                    src={e.photo}
                    alt={e.title}
                    className="h-12 w-12 rounded-md border object-cover"
                  />
                )}

                {/* Text */}
                <div>
                  <h2 className="font-semibold">{e.title}</h2>
                  <p className="text-sm text-gray-600">
                    {new Date(e.start_date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}

          {!events.length && (
            <p className="py-10 text-center text-gray-500">
              Belum ada event tersedia
            </p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
