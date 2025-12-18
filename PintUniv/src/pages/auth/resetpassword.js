import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PasswordField from "@/components/form/PasswordField";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "@/services/api";
export default function ResetPassword() {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const [resetPassword, { isLoading }] = useResetPasswordMutation();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [passwordValid, setPasswordValid] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [success, setSuccess] = useState(false);
    useEffect(() => {
        const isValid = password.length >= 6 &&
            /[A-Z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[!@#$%^&*(),.?":{}|<>]/.test(password);
        setPasswordValid(isValid);
        setPasswordMatch(confirm === password && password.length > 0);
    }, [password, confirm]);
    const handleReset = async (e) => {
        e.preventDefault();
        if (!passwordValid || !passwordMatch)
            return;
        try {
            await resetPassword({ uid, token, password }).unwrap();
            setSuccess(true); // tampilkan UI sukses
        }
        catch (err) {
            console.error(err);
        }
    };
    return (_jsx("div", { className: "flex min-h-screen items-center justify-center bg-[#152D64] px-4", children: _jsxs("div", { className: "w-full max-w-md rounded-xl bg-white p-8 shadow-xl", children: [!success ? (_jsxs(_Fragment, { children: [_jsx("h1", { className: "text-center text-3xl font-bold mb-2", children: "Reset Password" }), _jsx("p", { className: "text-center text-gray-600 mb-6 -mt-1", children: "Masukkan password baru kamu" }), _jsxs("form", { onSubmit: handleReset, className: "space-y-4", children: [_jsx(PasswordField, { label: "Password Baru", placeholder: "Enter new password", value: password, onChange: (e) => setPassword(e.target.value) }), password.length > 0 && (_jsx("p", { className: `text-sm ${passwordValid ? "text-green-600" : "text-red-600"}`, children: "Password harus minimal 6 karakter, ada huruf besar, angka, dan simbol" })), _jsx(PasswordField, { label: "Konfirmasi Password", placeholder: "Re-enter new password", value: confirm, onChange: (e) => setConfirm(e.target.value) }), confirm.length > 0 && (_jsx("p", { className: `text-sm ${passwordMatch ? "text-green-600" : "text-red-600"}`, children: passwordMatch ? "Password cocok" : "Password tidak cocok" })), _jsx(Button, { type: "submit", className: "w-full h-12 mt-2", disabled: !passwordValid || !passwordMatch || isLoading, children: isLoading ? "Memproses..." : "Ubah Password" })] })] })) : (
                /* SUCCESS UI */
                _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "flex justify-center mb-4", children: _jsx("div", { className: "h-20 w-20 rounded-full bg-green-500 flex items-center justify-center text-white text-4xl", children: "\u2713" }) }), _jsx("h2", { className: "text-xl font-bold mb-2", children: "Password Berhasil Diubah" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Password baru kamu sudah aktif. Silakan login ulang." }), _jsx(Button, { className: "w-full h-12", onClick: () => navigate("/"), children: "Kembali ke Login" })] })), _jsx("div", { className: "mt-4 text-center", children: _jsx(Link, { to: "/", className: "text-sm text-blue-600 hover:underline", children: "Kembali ke Login" }) })] }) }));
}
