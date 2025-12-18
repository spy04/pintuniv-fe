import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import MainLayout from "@/components/layout/MainLayout";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { useGetUserQuery, useGetMateriDetailQuery, useGetLatihanQuery, } from "@/services/api";
const FREE_SECTION_LIMIT = 3;
export default function DetailMateri() {
    const { materiId } = useParams();
    const materiIdNum = Number(materiId);
    const [activeSection, setActiveSection] = useState(null);
    const { data: user } = useGetUserQuery();
    const isPro = !!user?.profile?.is_pro;
    const { data: materi, isLoading } = useGetMateriDetailQuery(materiIdNum, {
        skip: !materiIdNum,
    });
    const { data: latihan = [] } = useGetLatihanQuery(materiIdNum, {
        skip: !materiIdNum,
    });
    /* ================= BUILD SECTIONS ================= */
    const sections = useMemo(() => {
        const raw = materi?.konten_materi || materi?.isi_materi || "";
        if (!raw)
            return [];
        const lines = raw.split("\n");
        const result = [];
        lines.forEach((line) => {
            if (line.startsWith("### ")) {
                const heading = line.replace("### ", "").replace(/\*\*/g, "").trim();
                const id = heading.toLowerCase().replace(/[^a-z0-9]/g, "-");
                result.push({ id, heading, content: [] });
            }
            else if (result.length) {
                result[result.length - 1].content.push(line);
            }
        });
        return result;
    }, [materi]);
    const freeSections = sections.slice(0, FREE_SECTION_LIMIT);
    const lockedSections = sections.slice(FREE_SECTION_LIMIT);
    const displayedLatihan = useMemo(() => latihan.map((l, idx) => ({
        ...l,
        locked: !isPro && idx >= 5,
    })), [latihan, isPro]);
    /* ================= ACTIVE SECTION ================= */
    useEffect(() => {
        if (!sections.length)
            return;
        const observer = new IntersectionObserver((entries) => {
            const visible = entries.find((e) => e.isIntersecting);
            if (visible)
                setActiveSection(visible.target.id);
        }, { threshold: 0.3 });
        sections.forEach((sec) => {
            const el = document.getElementById(sec.id);
            if (el)
                observer.observe(el);
        });
        return () => observer.disconnect();
    }, [sections]);
    if (isLoading)
        return (_jsx(MainLayout, { showRightContainer: false, children: _jsx("div", { className: "flex justify-center py-20", children: _jsx(Spinner, { className: "size-6" }) }) }));
    if (!materi)
        return (_jsx(MainLayout, { showRightContainer: false, children: _jsx("p", { className: "text-center text-red-600", children: "Materi tidak ditemukan" }) }));
    return (_jsxs(MainLayout, { showRightContainer: false, children: [_jsx("div", { className: "sticky top-[-20px] z-20 border-b bg-gray-50", children: _jsx("div", { className: "mx-auto max-w-5xl px-4 py-3", children: _jsx("h1", { className: "!text-3xl !leading-tight font-semibold break-words md:!text-6xl", children: materi.judul_materi }) }) }), _jsxs("div", { className: "block space-y-6 px-4 py-4 md:hidden", children: [_jsx(Card, { children: _jsxs(CardContent, { className: "pt-4", children: [_jsx("h4", { className: "mb-2 text-sm font-semibold", children: "Daftar Isi" }), _jsx("div", { className: "space-y-1", children: sections.map((sec, idx) => {
                                        const locked = !isPro && idx >= FREE_SECTION_LIMIT;
                                        return (_jsxs("button", { disabled: locked, onClick: () => document
                                                .getElementById(sec.id)
                                                ?.scrollIntoView({ behavior: "smooth" }), className: `w-full rounded px-3 py-2 text-left text-sm ${locked
                                                ? "cursor-not-allowed opacity-50"
                                                : "hover:bg-gray-100"}`, children: [idx + 1, ". ", sec.heading, " ", locked && "🔒"] }, sec.id));
                                    }) })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "space-y-8 pt-6", children: [freeSections.map((sec) => (_jsxs("section", { id: sec.id, className: "scroll-mt-28", children: [_jsx("h3", { className: "mb-2 font-semibold", children: sec.heading }), _jsx(ReactMarkdown, { children: sec.content.join("\n") })] }, sec.id))), !isPro && lockedSections.length > 0 && (_jsxs(_Fragment, { children: [_jsx("div", { className: "text-center", children: _jsx(Link, { to: "/subscribe", className: "font-semibold text-red-700 underline", children: "Upgrade ke PRO untuk membuka materi selanjutnya" }) }), _jsx("div", { className: "pointer-events-none space-y-6 blur-sm select-none", children: lockedSections.map((sec) => (_jsxs("section", { children: [_jsx("h3", { className: "mb-2 font-semibold", children: sec.heading }), _jsx(ReactMarkdown, { children: sec.content.join("\n") })] }, sec.id))) })] })), isPro &&
                                    lockedSections.map((sec) => (_jsxs("section", { id: sec.id, className: "scroll-mt-28", children: [_jsx("h3", { className: "mb-2 font-semibold", children: sec.heading }), _jsx(ReactMarkdown, { children: sec.content.join("\n") })] }, sec.id)))] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "pt-4", children: [_jsx("h4", { className: "mb-2 font-semibold", children: "Latihan Soal" }), displayedLatihan.map((l, idx) => (_jsxs(Link, { to: l.locked ? "/upgrade" : `/latihan/${l.id}`, className: `block rounded px-3 py-2 text-sm ${l.locked
                                        ? "cursor-not-allowed opacity-50"
                                        : "hover:bg-gray-100"}`, children: [idx + 1, ". ", l.title_latihan, " ", l.locked && "🔒"] }, l.id)))] }) })] }), _jsxs("div", { className: "mx-auto hidden max-w-6xl gap-6 px-6 py-6 md:flex", children: [_jsx("div", { className: "flex-1", children: _jsx(Card, { children: _jsxs(CardContent, { className: "space-y-8 pt-6", children: [freeSections.map((sec) => (_jsxs("section", { id: sec.id, className: "scroll-mt-40", children: [_jsx("h3", { className: "mb-2 font-semibold", children: sec.heading }), _jsx(ReactMarkdown, { children: sec.content.join("\n") })] }, sec.id))), !isPro && lockedSections.length > 0 && (_jsxs(_Fragment, { children: [_jsx("div", { className: "text-center", children: _jsx(Link, { to: "/subscribe", className: "font-semibold text-red-700 underline", children: "Upgrade ke PRO untuk membuka materi selanjutnya" }) }), _jsx("div", { className: "pointer-events-none space-y-6 blur-sm select-none", children: lockedSections.map((sec) => (_jsxs("section", { children: [_jsx("h3", { className: "mb-2 font-semibold", children: sec.heading }), _jsx(ReactMarkdown, { children: sec.content.join("\n") })] }, sec.id))) })] })), isPro &&
                                        lockedSections.map((sec) => (_jsxs("section", { id: sec.id, className: "scroll-mt-40", children: [_jsx("h3", { className: "mb-2 font-semibold", children: sec.heading }), _jsx(ReactMarkdown, { children: sec.content.join("\n") })] }, sec.id)))] }) }) }), _jsxs("aside", { className: "sticky top-28 w-[260px] space-y-4", children: [_jsx(Card, { children: _jsxs(CardContent, { className: "pt-4", children: [_jsx("h4", { className: "mb-2 font-semibold", children: "Daftar Isi" }), sections.map((sec, idx) => {
                                            const locked = !isPro && idx >= FREE_SECTION_LIMIT;
                                            return (_jsxs(Link, { to: `#${sec.id}`, onClick: (e) => {
                                                    e.preventDefault();
                                                    if (locked)
                                                        return;
                                                    document
                                                        .getElementById(sec.id)
                                                        ?.scrollIntoView({ behavior: "smooth" });
                                                }, className: `block rounded px-3 py-2 text-sm ${activeSection === sec.id
                                                    ? "bg-[#152D64] text-white"
                                                    : "hover:bg-gray-100"} ${locked ? "cursor-not-allowed opacity-50" : ""}`, children: [idx + 1, ". ", sec.heading, " ", locked && "🔒"] }, sec.id));
                                        })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "pt-4", children: [_jsx("h4", { className: "mb-2 font-semibold", children: "Latihan Soal" }), displayedLatihan.map((l, idx) => (_jsxs(Link, { to: l.locked ? "/upgrade" : `/latihan/${l.id}`, className: `block rounded px-3 py-2 text-sm ${l.locked
                                                ? "cursor-not-allowed opacity-50"
                                                : "hover:bg-gray-100"}`, children: [idx + 1, ". ", l.title_latihan, " ", l.locked && "🔒"] }, l.id)))] }) })] })] })] }));
}
