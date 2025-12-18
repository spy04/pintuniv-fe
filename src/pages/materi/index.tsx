import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";

import {
  useGetPracticeTestsQuery,
  useLazyGetMateriQuery
} from "@/services/api";

type MateriItem = {
  id: number;
  judul_materi: string;
};

export default function Materi() {
  const navigate = useNavigate();

  const [recent, setRecent] = useState([]);
  const [colorsMap, setColorsMap] = useState<Record<number, string>>({});
  const [materiByPractice, setMateriByPractice] = useState<Record<number, MateriItem[]>>({});

  const scrollRefs = useRef<Record<string | number, HTMLDivElement | null>>({});

  // Fetch practice list
  const { data: practice, isLoading, error } = useGetPracticeTestsQuery(undefined);

  // Lazy query for materi
  const [triggerMateri] = useLazyGetMateriQuery();

  // Load materi after practice arrives
  useEffect(() => {
    const loadMateri = async () => {
      if (!practice) return;

      const materiTemp: Record<number, MateriItem[]> = {};

      for (const p of practice) {
        const res = await triggerMateri(p.id, true);
        materiTemp[p.id] = res.data ?? [];
      }

      setMateriByPractice(materiTemp);
    };

    loadMateri();
  }, [practice, triggerMateri]);

  // Load localStorage
  useEffect(() => {
    const storedRecent = localStorage.getItem("recent");
    if (storedRecent) setRecent(JSON.parse(storedRecent));

    const storedColors = localStorage.getItem("materiColors");
    if (storedColors) setColorsMap(JSON.parse(storedColors));
  }, []);

  const colors = ["#E8F5E9", "#F5E8E8", "#E8EAF5", "#F4E8F5"];

  // Assign color
  const getColor = (id: number) => {
    if (!colorsMap[id]) {
      const random = colors[Math.floor(Math.random() * colors.length)];
      const updated = { ...colorsMap, [id]: random };
      setColorsMap(updated);
      localStorage.setItem("materiColors", JSON.stringify(updated));
    }
    return colorsMap[id];
  };

  const handleClickMateri = (id: number, title: string) => {
    navigate(`/materi/${id}`);
    const updated = [
      { id, judul_materi: title },
      ...recent.filter((x) => x.id !== id),
    ].slice(0, 10);

    setRecent(updated);
    localStorage.setItem("recent", JSON.stringify(updated));
  };

  const scrollLeft = (key: string | number) =>
    scrollRefs.current[key]?.scrollBy({ left: -220, behavior: "smooth" });

  const scrollRight = (key: string | number) =>
    scrollRefs.current[key]?.scrollBy({ left: 220, behavior: "smooth" });

  const renderCategory = (
    title: string,
    items: MateriItem[],
    key: number | string
  ) => (
    <div key={key} className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">{title}</h3>

        <div className="flex gap-2">
          <button onClick={() => scrollLeft(key)} className="text-xl">‹</button>
          <button onClick={() => scrollRight(key)} className="text-xl">›</button>
        </div>
      </div>

      <div
        ref={(el) => {
          scrollRefs.current[key] = el;
          return undefined;
        }}
        className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((m) => (
          <div
            key={m.id}
            className="w-52 h-28 p-3 rounded-lg flex flex-col justify-between flex-shrink-0 border "
            style={{ backgroundColor: getColor(m.id) }}
          >
            <strong className="block text-sm max-h-12 overflow-hidden">
              {m.judul_materi}
            </strong>

            <button
              onClick={() => handleClickMateri(m.id, m.judul_materi)}
              className="bg-[#152D64] text-white px-3 py-1 rounded-md text-sm w-24 self-center"
            >
              Start
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading)
    return (
      <MainLayout>
        <div className="flex justify-center py-20">Loading...</div>
      </MainLayout>
    );

  if (error)
    return (
      <MainLayout>
        <p className="text-red-600">Gagal memuat data.</p>
      </MainLayout>
    );

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">Materi</h1>

      {recent.length > 0 &&
        renderCategory("Recent", recent, "recent")}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search materi..."
          className="w-full p-3 border rounded-lg"
        />
      </div>

      {practice?.map((p) =>
        renderCategory(
          p.title_practice,
          materiByPractice[p.id] ?? [],
          p.id
        )
      )}
    </MainLayout>
  );
}
