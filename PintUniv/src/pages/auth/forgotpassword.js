import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "@/services/api";
export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [success, setSuccess] = useState(false);
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
    const emailValid = email.includes("@") && email.trim() !== "";
    const emailError = submitted && !emailValid;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        if (!emailValid)
            return;
        try {
            await forgotPassword({ email }).unwrap();
            setSuccess(true); // ⬅️ tampilkan success UI
        }
        catch (err) {
            console.error(err);
        }
    };
    return (_jsx("div", { className: "flex min-h-screen items-center justify-center bg-[#152D64] px-4", children: _jsxs("div", { className: "w-full max-w-md rounded-xl bg-white p-8 shadow-xl", children: [!success ? (_jsxs(_Fragment, { children: [_jsx("h1", { className: "text-center text-3xl font-bold mb-2", children: "Lupa Password" }), _jsx("p", { className: "text-center text-gray-600 mb-6 -mt-1", children: "Kami akan mengirimkan link reset password ke email kamu" }), _jsxs("form", { onSubmit: handleSubmit, noValidate: true, className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Input, { type: "text", placeholder: "Masukkan email kamu", value: email, onChange: (e) => setEmail(e.target.value), className: emailError
                                                ? "border-red-500 focus-visible:ring-red-500"
                                                : "" }), emailError && (_jsx("p", { className: "text-sm text-red-600 mt-1", children: "Email tidak valid" }))] }), _jsx(Button, { type: "submit", className: "w-full h-12", disabled: isLoading, children: isLoading ? "Mengirim..." : "Kirim Link Reset" })] })] })) : (_jsx(_Fragment, { children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "flex items-center justify-center mb-4", children: _jsx("div", { className: "h-20 w-20 rounded-full bg-green-500 flex items-center justify-center text-white text-4xl", children: "\u2713" }) }), _jsx("h2", { className: "text-xl font-bold mb-2", children: "Link Terkirim!" }), _jsxs("p", { className: "text-gray-600 mb-6", children: ["Kami sudah mengirimkan link reset password ke ", _jsx("b", { children: email }), ".", _jsx("br", {}), " Silakan cek inbox atau folder spam."] }), _jsx(Button, { className: "w-full h-12", onClick: () => {
                                    setSuccess(false);
                                    setEmail("");
                                    setSubmitted(false);
                                }, children: "Kirim ulang ke email lain" })] }) })), _jsx("div", { className: "mt-4 text-center", children: _jsx(Link, { to: "/", className: "text-sm text-blue-600 hover:underline cursor-pointer", children: "Kembali ke Login" }) })] }) }));
}
