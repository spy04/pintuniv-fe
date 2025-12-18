import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

import { useGetEventsQuery } from "@/services/api";

/* ================= TYPES ================= */
type EventItem = {
  id: number;
  title: string;
  poster?: string;
  photo?: string;
  start_date: string;
  end_date: string;
  tempat?: string;
  syarat?: string;
};

/* ================= PAGE ================= */
export default function DetailEvent() {
  const { id } = useParams<{ id: string }>();
  const { eventId } = useParams<{ eventId: string }>();

  const navigate = useNavigate();

  const { data: events = [], isLoading, error } = useGetEventsQuery(undefined);

  const { event, otherEvents } = useMemo(() => {
    const current = events.find((e) => String(e.id) === String(eventId));

    return {
      event: current,
      otherEvents: events.filter((e) => String(e.id) !== String(eventId)),
    };
  }, [events, eventId]);

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
        <p className="text-red-600">Gagal memuat data event</p>
      </MainLayout>
    );

  if (!event)
    return (
      <MainLayout>
        <p className="py-10 text-center">Event tidak ditemukan</p>
      </MainLayout>
    );

  /* ================= RENDER ================= */
  return (
    <MainLayout>
      <div className="space-y-10">
        {/* ================= POSTER ================= */}
        {event.poster && (
          <img
            src={event.poster}
            alt={event.title}
            className="w-full rounded-2xl shadow-md"
          />
        )}

        {/* ================= DETAIL ================= */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold">{event.title}</h1>

          <p className="text-gray-600">
            {new Date(event.start_date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            –{" "}
            {new Date(event.end_date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          {event.tempat && (
            <p className="text-gray-600">Tempat: {event.tempat}</p>
          )}

          {event.syarat && (
            <Card>
              <CardContent className="whitespace-pre-line">
                {event.syarat}
              </CardContent>
            </Card>
          )}
        </div>

        {/* ================= EVENT LAIN ================= */}
        {otherEvents.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Event Lain</h2>

            <div className="flex gap-4 overflow-x-auto pb-2">
              {otherEvents.map((e: EventItem) => (
                <Card
                  key={e.id}
                  className="min-w-[260px] cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => navigate(`/event/${e.id}`)}
                >
                  {e.photo && (
                    <img
                      src={e.photo}
                      alt={e.title}
                      className="h-36 w-full rounded-t-xl object-cover"
                    />
                  )}

                  <CardContent>
                    <h3 className="mb-1 text-sm font-semibold">{e.title}</h3>
                    <p className="text-xs text-gray-600">
                      {new Date(e.start_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
