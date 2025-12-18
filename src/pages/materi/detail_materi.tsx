import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import MainLayout from "@/components/layout/MainLayout";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";

import {
  useGetUserQuery,
  useGetMateriDetailQuery,
  useGetLatihanQuery,
} from "@/services/api";

const FREE_SECTION_LIMIT = 3;

type Section = {
  id: string;
  heading: string;
  content: string[];
};

type LatihanItem = {
  id: number;
  title_latihan: string;
  locked?: boolean;
};

export default function DetailMateri() {
  const { materiId } = useParams<{ materiId: string }>();
  const materiIdNum = Number(materiId);

  const [activeSection, setActiveSection] = useState<string | null>(null);

  const { data: user } = useGetUserQuery();
  const isPro = !!user?.profile?.is_pro;

  const { data: materi, isLoading } = useGetMateriDetailQuery(materiIdNum, {
    skip: !materiIdNum,
  });

  const { data: latihan = [] } = useGetLatihanQuery(materiIdNum, {
    skip: !materiIdNum,
  });

  /* ================= BUILD SECTIONS ================= */
  const sections: Section[] = useMemo(() => {
    const raw = materi?.konten_materi || materi?.isi_materi || "";
    if (!raw) return [];

    const lines = raw.split("\n");
    const result: Section[] = [];

    lines.forEach((line) => {
      if (line.startsWith("### ")) {
        const heading = line.replace("### ", "").replace(/\*\*/g, "").trim();
        const id = heading.toLowerCase().replace(/[^a-z0-9]/g, "-");
        result.push({ id, heading, content: [] });
      } else if (result.length) {
        result[result.length - 1].content.push(line);
      }
    });

    return result;
  }, [materi]);

  const freeSections = sections.slice(0, FREE_SECTION_LIMIT);
  const lockedSections = sections.slice(FREE_SECTION_LIMIT);

  const displayedLatihan: LatihanItem[] = useMemo(
    () =>
      latihan.map((l, idx) => ({
        ...l,
        locked: !isPro && idx >= 5,
      })),
    [latihan, isPro],
  );

  /* ================= ACTIVE SECTION ================= */
  useEffect(() => {
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveSection(visible.target.id);
      },
      { threshold: 0.3 },
    );

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  if (isLoading)
    return (
      <MainLayout showRightContainer={false}>
        <div className="flex justify-center py-20">
          <Spinner className="size-6" />
        </div>
      </MainLayout>
    );

  if (!materi)
    return (
      <MainLayout showRightContainer={false}>
        <p className="text-center text-red-600">Materi tidak ditemukan</p>
      </MainLayout>
    );

  return (
    <MainLayout showRightContainer={false}>
      {/* ================= HEADER ================= */}
      <div className="sticky top-[-20px] z-20 border-b bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-3">
          <h1 className="!text-3xl !leading-tight font-semibold break-words md:!text-6xl">
            {materi.judul_materi}
          </h1>
        </div>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="block space-y-6 px-4 py-4 md:hidden">
        {/* DAFTAR ISI – VERTICAL */}
        <Card>
          <CardContent className="pt-4">
            <h4 className="mb-2 text-sm font-semibold">Daftar Isi</h4>
            <div className="space-y-1">
              {sections.map((sec, idx) => {
                const locked = !isPro && idx >= FREE_SECTION_LIMIT;
                return (
                  <button
                    key={sec.id}
                    disabled={locked}
                    onClick={() =>
                      document
                        .getElementById(sec.id)
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className={`w-full rounded px-3 py-2 text-left text-sm ${
                      locked
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {idx + 1}. {sec.heading} {locked && "🔒"}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* CONTENT */}
        <Card>
          <CardContent className="space-y-8 pt-6">
            {freeSections.map((sec) => (
              <section key={sec.id} id={sec.id} className="scroll-mt-28">
                <h3 className="mb-2 font-semibold">{sec.heading}</h3>
                <ReactMarkdown>{sec.content.join("\n")}</ReactMarkdown>
              </section>
            ))}

            {/* LOCKED – NON PRO */}
            {!isPro && lockedSections.length > 0 && (
              <>
                <div className="text-center">
                  <Link
                    to="/subscribe"
                    className="font-semibold text-red-700 underline"
                  >
                    Upgrade ke PRO untuk membuka materi selanjutnya
                  </Link>
                </div>

                <div className="pointer-events-none space-y-6 blur-sm select-none">
                  {lockedSections.map((sec) => (
                    <section key={sec.id}>
                      <h3 className="mb-2 font-semibold">{sec.heading}</h3>
                      <ReactMarkdown>{sec.content.join("\n")}</ReactMarkdown>
                    </section>
                  ))}
                </div>
              </>
            )}

            {/* PRO */}
            {isPro &&
              lockedSections.map((sec) => (
                <section key={sec.id} id={sec.id} className="scroll-mt-28">
                  <h3 className="mb-2 font-semibold">{sec.heading}</h3>
                  <ReactMarkdown>{sec.content.join("\n")}</ReactMarkdown>
                </section>
              ))}
          </CardContent>
        </Card>

        {/* LATIHAN */}
        <Card>
          <CardContent className="pt-4">
            <h4 className="mb-2 font-semibold">Latihan Soal</h4>
            {displayedLatihan.map((l, idx) => (
              <Link
                key={l.id}
                to={l.locked ? "/upgrade" : `/latihan/${l.id}`}
                className={`block rounded px-3 py-2 text-sm ${
                  l.locked
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-gray-100"
                }`}
              >
                {idx + 1}. {l.title_latihan} {l.locked && "🔒"}
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="mx-auto hidden max-w-6xl gap-6 px-6 py-6 md:flex">
        {/* CONTENT */}
        <div className="flex-1">
          <Card>
            <CardContent className="space-y-8 pt-6">
              {freeSections.map((sec) => (
                <section key={sec.id} id={sec.id} className="scroll-mt-40">
                  <h3 className="mb-2 font-semibold">{sec.heading}</h3>
                  <ReactMarkdown>{sec.content.join("\n")}</ReactMarkdown>
                </section>
              ))}

              {!isPro && lockedSections.length > 0 && (
                <>
                  <div className="text-center">
                    <Link
                      to="/subscribe"
                      className="font-semibold text-red-700 underline"
                    >
                      Upgrade ke PRO untuk membuka materi selanjutnya
                    </Link>
                  </div>

                  <div className="pointer-events-none space-y-6 blur-sm select-none">
                    {lockedSections.map((sec) => (
                      <section key={sec.id}>
                        <h3 className="mb-2 font-semibold">{sec.heading}</h3>
                        <ReactMarkdown>{sec.content.join("\n")}</ReactMarkdown>
                      </section>
                    ))}
                  </div>
                </>
              )}

              {isPro &&
                lockedSections.map((sec) => (
                  <section key={sec.id} id={sec.id} className="scroll-mt-40">
                    <h3 className="mb-2 font-semibold">{sec.heading}</h3>
                    <ReactMarkdown>{sec.content.join("\n")}</ReactMarkdown>
                  </section>
                ))}
            </CardContent>
          </Card>
        </div>

        {/* SIDEBAR */}
        {/* SIDEBAR */}
        <aside className="sticky top-28 w-[260px] space-y-4">
          {/* ===== DAFTAR ISI ===== */}
          <Card>
            <CardContent className="pt-4">
              <h4 className="mb-2 font-semibold">Daftar Isi</h4>

              {sections.map((sec, idx) => {
                const locked = !isPro && idx >= FREE_SECTION_LIMIT;

                return (
                  <Link
                    key={sec.id}
                    to={`#${sec.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (locked) return;
                      document
                        .getElementById(sec.id)
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`block rounded px-3 py-2 text-sm ${
                      activeSection === sec.id
                        ? "bg-[#152D64] text-white"
                        : "hover:bg-gray-100"
                    } ${locked ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    {idx + 1}. {sec.heading} {locked && "🔒"}
                  </Link>
                );
              })}
            </CardContent>
          </Card>

          {/* ===== LATIHAN SOAL (INI YANG HILANG) ===== */}
          <Card>
            <CardContent className="pt-4">
              <h4 className="mb-2 font-semibold">Latihan Soal</h4>

              {displayedLatihan.map((l, idx) => (
                <Link
                  key={l.id}
                  to={l.locked ? "/upgrade" : `/latihan/${l.id}`}
                  className={`block rounded px-3 py-2 text-sm ${
                    l.locked
                      ? "cursor-not-allowed opacity-50"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {idx + 1}. {l.title_latihan} {l.locked && "🔒"}
                </Link>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </MainLayout>
  );
}
