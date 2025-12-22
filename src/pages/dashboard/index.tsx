import MainLayout from "@/components/layout/MainLayout";
import Container from "@/pages/dashboard/container";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Leaderboard from "./leaderboard";
import About from "./about";
import { useGetUserQuery } from "@/services/api";
import { useEffect, useState } from "react";

export default function DashboardUser() {
  const navigate = useNavigate();

  // 1) Load user dari localStorage dulu
  const [cachedUser, setCachedUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // 2) Fetch user dari API (RTK Query)
  const { data: apiUser, isSuccess, isLoading } = useGetUserQuery();

  // 3) Simpan ke localStorage setelah API sukses
  useEffect(() => {
    if (isSuccess && apiUser) {
      localStorage.setItem("user", JSON.stringify(apiUser));
      setCachedUser(apiUser);
    }
  }, [isSuccess, apiUser]);

  return (
    <MainLayout>
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "25px",
          borderRadius: "10px",
          border: "2px solid #E8E8E8",
        }}
      >
        <h2 className="text-2xl font-bold">
          {cachedUser
            ? `Hallo, ${cachedUser.first_name} ${cachedUser.last_name} !`
            : isLoading
              ? "Loading..."
              : "Hallo, User!"}
        </h2>

        <p className="pt-8 pb-5">Siap Latihan Hari Ini??</p>
        <Button className="pr-10 pl-10" onClick={() => navigate(`/materi`)}>
          Siap
        </Button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <Container bgColor="#FFD052" title="Materi" to="/materi" />
        <Container bgColor="#FF7F7F" title="Tryout" to="/tryouts" />
      </div>

      <Leaderboard />
      <About />
    </MainLayout>
  );
}
