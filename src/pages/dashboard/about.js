import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Mail, Phone, Copy, ExternalLink, Check, X } from "lucide-react";
import { useState } from "react";
export default function About() {
    const email = "support@pintuniv.com";
    const whatsapp = "+6287881877917";
    const whatsappHref = `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`;
    const [copied, setCopied] = useState("");
    const [openPopup, setOpenPopup] = useState(false);
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(""), 2000);
    };
    return (_jsxs("div", { children: [_jsx("h2", { className: "pt-5 text-2xl font-bold", children: "Company Description" }), _jsx("p", { className: "pt-3", children: "Pintu Universitas adalah platform pembelajaran dan tryout daring yang membantu siswa SMA/SMK mempersiapkan masuk perguruan tinggi. Kami menyediakan modul interaktif, soal tryout berkualitas, dan analisis hasil yang memudahkan siswa mengasah kesiapan ujian." }), _jsx("h2", { className: "pt-5 text-2xl font-bold", children: "Contact Us" }), _jsxs("div", { className: "mt-4 space-y-3", children: [_jsxs("div", { onClick: () => setOpenPopup(true), className: "flex items-center justify-between p-3 rounded-md hover:bg-gray-100 transition-all group cursor-pointer", children: [_jsxs("div", { className: "flex items-center gap-2 text-gray-700", children: [_jsx(Mail, { size: 18 }), _jsx("span", { className: "text-sm", children: email })] }), _jsx("button", { onClick: (e) => {
                                    e.stopPropagation(); // supaya nggak buka popup email
                                    copyToClipboard(email);
                                }, className: "opacity-0 group-hover:opacity-100 p-2 rounded-md hover:bg-gray-200 transition", children: copied === email ? (_jsx(Check, { size: 16, className: "text-green-600" })) : (_jsx(Copy, { size: 16, className: "text-gray-600" })) })] }), _jsxs("div", { onClick: () => window.open(whatsappHref, "_blank"), className: "flex items-center justify-between p-3 rounded-md hover:bg-gray-100 transition group cursor-pointer", children: [_jsxs("div", { className: "flex items-center gap-2 text-gray-700", children: [_jsx(Phone, { size: 18 }), _jsx("span", { className: "text-sm", children: whatsapp })] }), _jsx("a", { href: whatsappHref, target: "_blank", onClick: (e) => e.stopPropagation(), className: "opacity-0 group-hover:opacity-100 p-2 rounded-md hover:bg-gray-200 transition", children: _jsx(ExternalLink, { size: 16 }) })] })] }), copied && (_jsx("p", { className: "text-green-600 text-sm pt-3", children: copied.includes("@") ? "Email disalin!" : "Nomor WhatsApp disalin!" })), openPopup && (_jsx("div", { className: "fixed inset-0 bg-black/30 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white p-5 rounded-lg w-80 shadow-lg relative animate-fadeIn", children: [_jsx("button", { onClick: () => setOpenPopup(false), className: "absolute top-2 right-2 p-1 rounded hover:bg-gray-200", children: _jsx(X, { size: 18 }) }), _jsx("h3", { className: "text-lg font-semibold mb-4", children: "Buka dengan:" }), _jsxs("div", { className: "space-y-3", children: [_jsx("a", { href: `mailto:${email}`, className: "block p-2 border rounded hover:bg-gray-100 cursor-pointer", children: "Default Mail App" }), _jsx("a", { href: `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, target: "_blank", rel: "noopener noreferrer", className: "block p-2 border rounded hover:bg-gray-100 cursor-pointer", children: "Gmail" }), _jsx("a", { href: `https://outlook.live.com/mail/deeplink/compose?to=${email}`, target: "_blank", rel: "noopener noreferrer", className: "block p-2 border rounded hover:bg-gray-100 cursor-pointer", children: "Outlook Web" }), _jsx("a", { href: `https://compose.mail.yahoo.com/?to=${email}`, target: "_blank", rel: "noopener noreferrer", className: "block p-2 border rounded hover:bg-gray-100 cursor-pointer", children: "Yahoo Mail" }), _jsx("button", { onClick: () => {
                                        copyToClipboard(email);
                                        setOpenPopup(false);
                                    }, className: "block w-full p-2 border rounded hover:bg-gray-100 cursor-pointer text-left", children: "Copy Email" })] })] }) }))] }));
}
