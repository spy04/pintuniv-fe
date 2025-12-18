import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent } from "@/components/ui/card";
import { logo_snbt } from "@/assets/icon";
export default function SliderContent({ slide }) {
    if (!slide)
        return null;
    return (_jsxs("div", { className: "w-full flex flex-col items-center", children: [slide.type === "quote" && (_jsx(Card, { className: "w-full bg-[#0A2A7A] text-white rounded-2xl", children: _jsxs(CardContent, { className: "p-6 text-center", children: [_jsx("p", { className: "text-lg", children: slide.text }), _jsxs("p", { className: "text-sm mt-3 opacity-80", children: ["~ ", slide.author, " ~"] })] }) })), slide.type === "promo" && (_jsx(Card, { className: "w-full rounded-xl overflow-hidden", children: _jsx("img", { src: slide.img, className: "w-full h-40 object-cover", alt: "promo" }) })), slide.type === "countdown" && (_jsx(Card, { className: "w-full", children: _jsxs(CardContent, { className: "p-4", children: [_jsx("img", { src: logo_snbt, className: "w-14 mx-auto mb-2", alt: "logo snbt" }), _jsxs("div", { className: "flex w-full rounded-xl overflow-hidden", children: [_jsxs("div", { className: "flex-1 p-2 text-center border-r", children: [_jsx("p", { className: "text-sm text-gray-500", children: "Sisa Hari" }), _jsx("p", { className: "text-3xl font-bold text-[#1D2B53]", children: slide.days })] }), _jsxs("div", { className: "flex-1 p-4 text-center", children: [_jsx("p", { className: "text-sm text-gray-500", children: "Tanggal" }), _jsx("p", { className: "text-[#1D2B53] font-bold", children: new Date(slide.date).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            }) })] })] })] }) }))] }));
}
