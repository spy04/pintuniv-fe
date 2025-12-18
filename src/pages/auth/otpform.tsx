import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
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
    if (isLoading) return;

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
        } else {
          navigate("/dashboard_user");
        }
      }, 700);
    } catch (err) {
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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#152D64] px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg text-center">

        {/* SUCCESS UI */}
        {success ? (
          <div className="flex flex-col items-center justify-center success-pop">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-white text-4xl">
              ✓
            </div>
            <h2 className="text-xl font-bold">Berhasil Verifikasi!</h2>
          </div>
        ) : (
          <>
            <h2 className="mb-2 text-2xl font-bold">Verifikasi OTP</h2>
            <p className="mb-6 text-gray-600">
              Masukkan kode OTP yang dikirim ke <strong>{email}</strong>
            </p>

            {/* OTP INPUT */}
            <div className={clsx("flex justify-center", shake && "shake")}>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                disabled={isLoading}
                className="mx-auto mb-6"
              >
                <InputOTPGroup className="gap-3">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              className="w-full h-11 mt-5"
              onClick={handleVerify}
              disabled={isLoading}
            >
              {isLoading ? "Memverifikasi..." : "Verifikasi"}
            </Button>

            {/* RESEND */}
            <p className="mt-4 text-sm">
              Belum menerima OTP?{" "}
              <button
                onClick={handleResend}
                disabled={resendTimer > 0}
                className={
                  resendTimer > 0
                    ? "text-gray-400"
                    : "text-blue-600 hover:underline"
                }
              >
                {resendTimer > 0
                  ? `Kirim ulang dalam ${resendTimer}s`
                  : "Kirim Ulang OTP"}
              </button>
            </p>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}
