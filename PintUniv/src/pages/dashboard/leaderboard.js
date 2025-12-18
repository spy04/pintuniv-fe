import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useGetTotalRanksQuery } from "@/services/api";
export default function Leaderboard() {
    const { data: totalRanks = [], isLoading, isError } = useGetTotalRanksQuery();
    if (isLoading)
        return _jsx("p", { children: "Loading ranking..." });
    if (isError)
        return _jsx("p", { children: "Gagal memuat ranking." });
    return (_jsxs("div", { children: [_jsx("h2", { className: "font-bold text-2xl pt-5", children: "LeaderBoard" }), totalRanks.length === 0 ? (_jsx("p", { children: "Belum ada ranking total." })) : (_jsx("div", { style: {
                    marginTop: "10px",
                    width: "100%",
                    border: "2px solid #000000ff",
                    padding: "10px",
                    borderRadius: "10px",
                }, children: totalRanks.slice(0, 5).map((r, idx) => (_jsxs("div", { style: {
                        display: "grid",
                        gridTemplateColumns: "60px 1fr 80px 80px 80px 100px",
                        alignItems: "center",
                        backgroundColor: "#F0EFEF",
                        borderRadius: "15px",
                        padding: "10px 15px",
                        marginBottom: "8px",
                    }, children: [_jsxs("div", { children: ["#", idx + 1] }), _jsxs("div", { style: {
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }, children: [r.photo ? (_jsx("img", { src: r.photo, alt: r.first_name, style: {
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "50%",
                                        border: "2px solid blue",
                                        objectFit: "cover",
                                    } })) : (_jsx("div", { style: {
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
                                    }, children: r.first_name?.[0]?.toUpperCase() ?? "U" })), _jsxs("span", { children: [r.first_name, " ", r.last_name] })] }), _jsx("div", { style: { textAlign: "center" }, children: r.total_benar }), _jsx("div", { style: { textAlign: "center" }, children: r.total_soal }), _jsx("div", { style: { textAlign: "center" }, children: r.total_score }), _jsx("div", { style: { textAlign: "center" }, children: r.label })] }, idx))) }))] }));
}
