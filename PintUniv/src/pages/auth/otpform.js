import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot, } from "@/components/ui/input-otp";
import { useNavigate, useLocation } from "react-router-dom";
import clsx from "clsx";
import { useVerifyOtpMutation, useResendOtpMutation, useMeMutation } from "@/services/api";
export default function VerifyOtp() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
    const [resendOtp] = useResendOtpMutation();
    const [me] = useMeMutation();
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [shake, setShake] = useState(false);
    const [success, setSuccess] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    // auto verify saat 6 digit
    useEffect(() => {
        if (otp.length === 6) {
            handleVerify();
        }
    }, [otp]);
    // timer resend
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);
    const handleVerify = async () => {
        if (isLoading)
            return;
        setError("");
        try {
            // 1️⃣ verify OTP
            const res = await verifyOtp({ email, otp }).unwrap();
            // server akan return access & refresh token
            localStorage.setItem("token", res.access);
            localStorage.setItem("refresh_token", res.refresh);
            // 2️⃣ ambil user detail
            const user = await me().unwrap();
            localStorage.setItem("user", JSON.stringify(user));
            // 3️⃣ cek role
            const isAdmin = user?.is_staff;
            setSuccess(true);
            setTimeout(() => {
                if (isAdmin) {
                    navigate("/dashboard_admin");
                }
                else {
                    navigate("/dashboard_user");
                }
            }, 700);
        }
        catch (err) {
            console.error(err);
            setShake(true);
            setError("OTP salah, coba lagi!");
            setOtp("");
            setTimeout(() => setShake(false), 500);
        }
    };
    const handleResend = async () => {
        try {
            await resendOtp({ email }).unwrap();
            setResendTimer(60);
        }
        catch (err) {
            console.error(err);
        }
    };
    return (_jsx("div", { className: "flex h-screen items-center justify-center bg-[#152D64] px-4", children: _jsx("div", { className: "w-full max-w-md rounded-xl bg-white p-8 shadow-lg text-center", children: success ? (_jsxs("div", { className: "flex flex-col items-center justify-center success-pop", children: [_jsx("div", { className: "mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-white text-4xl", children: "\u2713" }), _jsx("h2", { className: "text-xl font-bold", children: "Berhasil Verifikasi!" })] })) : (_jsxs(_Fragment, { children: [_jsx("h2", { className: "mb-2 text-2xl font-bold", children: "Verifikasi OTP" }), _jsxs("p", { className: "mb-6 text-gray-600", children: ["Masukkan kode OTP yang dikirim ke ", _jsx("strong", { children: email })] }), _jsx("div", { className: clsx("flex justify-center", shake && "shake"), children: _jsx(InputOTP, { maxLength: 6, value: otp, onChange: setOtp, disabled: isLoading, className: "mx-auto mb-6", children: _jsxs(InputOTPGroup, { className: "gap-3", children: [_jsx(InputOTPSlot, { index: 0 }), _jsx(InputOTPSlot, { index: 1 }), _jsx(InputOTPSlot, { index: 2 }), _jsx(InputOTPSlot, { index: 3 }), _jsx(InputOTPSlot, { index: 4 }), _jsx(InputOTPSlot, { index: 5 })] }) }) }), _jsx(Button, { className: "w-full h-11 mt-5", onClick: handleVerify, disabled: isLoading, children: isLoading ? "Memverifikasi..." : "Verifikasi" }), _jsxs("p", { className: "mt-4 text-sm", children: ["Belum menerima OTP?", " ", _jsx("button", { onClick: handleResend, disabled: resendTimer > 0, className: resendTimer > 0
                                    ? "text-gray-400"
                                    : "text-blue-600 hover:underline", children: resendTimer > 0
                                    ? `Kirim ulang dalam ${resendTimer}s`
                                    : "Kirim Ulang OTP" })] }), error && _jsx("p", { className: "mt-3 text-sm text-red-600", children: error })] })) }) }));
}
