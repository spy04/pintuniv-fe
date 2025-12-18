import { useGetTotalRanksQuery } from "@/services/api";

export default function Leaderboard() {
  const { data: totalRanks = [], isLoading, isError } = useGetTotalRanksQuery();

  if (isLoading) return <p>Loading ranking...</p>;
  if (isError) return <p>Gagal memuat ranking.</p>;

  return (
    <div>
        <h2 className="font-bold text-2xl pt-5">LeaderBoard</h2>
      {totalRanks.length === 0 ? (
        <p>Belum ada ranking total.</p>
      ) : (
        <div
          style={{
            marginTop: "10px",
            width: "100%",
            border: "2px solid #000000ff",
            padding: "10px",
            borderRadius: "10px",
          }}
        >
          {totalRanks.slice(0, 5).map((r, idx) => (
            <div
              key={idx}
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 80px 80px 80px 100px",
                alignItems: "center",
                backgroundColor: "#F0EFEF",
                borderRadius: "15px",
                padding: "10px 15px",
                marginBottom: "8px",
              }}
            >
              {/* Rank */}
              <div>#{idx + 1}</div>

              {/* Foto + Nama */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {r.photo ? (
                  <img
                    src={r.photo}
                    alt={r.first_name}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      border: "2px solid blue",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      backgroundColor: "gray",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      border: "2px solid #555",
                    }}
                  >
                    {r.first_name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                )}
                <span>
                  {r.first_name} {r.last_name}
                </span>
              </div>

              <div style={{ textAlign: "center" }}>{r.total_benar}</div>
              <div style={{ textAlign: "center" }}>{r.total_soal}</div>
              <div style={{ textAlign: "center" }}>{r.total_score}</div>
              <div style={{ textAlign: "center" }}>{r.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
