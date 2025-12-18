import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import InputField from "@/components/form/InputField";
import PasswordField from "@/components/form/PasswordField";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLoginMutation, useMeMutation } from "@/services/api";
export default function LoginForm({ onSwitch }) {
    const navigate = useNavigate();
    const [login, { isLoading }] = useLoginMutation();
    const [me] = useMeMutation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const emailEmpty = submitted && email.trim() === "";
    const emailInvalid = submitted && email.trim() !== "" && !email.includes("@");
    const passwordError = submitted && password.trim() === "";
    const handleLogin = async () => {
        setSubmitted(true);
        if (!email || !password || !email.includes("@"))
            return;
        try {
            const res = (await login({ email, password }).unwrap());
            if (res.need_otp) {
                navigate("/otp", { state: { email: res.email } });
                return;
            }
            localStorage.setItem("token", res.access);
            localStorage.setItem("refresh_token", res.refresh);
            // 🔥 fetch user via /me/
            const user = await me().unwrap();
            localStorage.setItem("user", JSON.stringify(user));
            // 🔥 role-based redirect
            if (user.is_staff) {
                navigate("/dashboard_admin", { replace: true });
            }
            else {
                navigate("/dashboard_user", { replace: true });
            }
        }
        catch (err) {
            console.error("Login error:", err);
        }
    };
    return (_jsxs("div", { className: "animate-slideInLeft w-full max-w-md", children: [_jsx("h1", { className: "mb-6 text-3xl font-bold", children: "Login" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(InputField, { label: "Email", placeholder: "Enter your email", value: email, onChange: (e) => setEmail(e.target.value), className: emailEmpty || emailInvalid
                                    ? "border-red-500 focus-visible:ring-red-500"
                                    : "" }), emailEmpty && (_jsx("p", { className: "text-sm text-red-600 mt-1", children: "Email wajib diisi" })), !emailEmpty && emailInvalid && (_jsx("p", { className: "text-sm text-red-600 mt-1", children: "Format email tidak valid" }))] }), _jsxs("div", { children: [_jsx(PasswordField, { label: "Password", placeholder: "Enter your password", value: password, onChange: (e) => setPassword(e.target.value), className: passwordError
                                    ? "border-red-500 focus-visible:ring-red-500"
                                    : "" }), passwordError && (_jsx("p", { className: "text-sm text-red-600 mt-1", children: "Password wajib diisi" }))] }), _jsx("div", { className: "text-right", children: _jsx(Button, { variant: "link", onClick: () => navigate("/forgot-password"), children: "Lupa Password?" }) }), _jsx(Button, { className: "h-12 w-full", onClick: handleLogin, disabled: isLoading, children: isLoading ? "Logging in..." : "Login" }), _jsx(Button, { variant: "ghost", className: "w-full md:hidden", onClick: onSwitch, children: "Belum punya akun? Register" })] })] }));
}
