import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
  useMeMutation,
} from "@/services/api";
import { cn } from "@/lib/utils";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email: string | undefined = state?.email;

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp] = useResendOtpMutation();
  const [me] = useMeMutation();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  /* ================= GUARD ================= */
  useEffect(() => {
    if (!email) {
      navigate("/", { replace: true });
    }
  }, [email, navigate]);

  /* ================= AUTO VERIFY ================= */
  useEffect(() => {
    if (otp.length === 6 && !isLoading) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  /* ================= RESEND TIMER ================= */
  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setTimeout(() => {
      setResendTimer((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendTimer]);

  /* ================= VERIFY ================= */
  const handleVerify = async () => {
    if (!email) return;

    setError(null);

    try {
      const res = await verifyOtp({ email, otp }).unwrap();

      localStorage.setItem("token", res.access);
      localStorage.setItem("refresh_token", res.refresh);

      const user = await me().unwrap();
      localStorage.setItem("user", JSON.stringify(user));

      setSuccess(true);

      setTimeout(() => {
        navigate(user.is_staff ? "/dashboard_admin" : "/dashboard_user", {
          replace: true,
        });
      }, 700);
    } catch (err) {
      setShake(true);
      setError("OTP salah, coba lagi");
      setOtp("");

      setTimeout(() => setShake(false), 500);
    }
  };

  /* ================= RESEND ================= */
  const handleResend = async () => {
    if (!email || resendTimer > 0 || isResending) return;

    try {
      setIsResending(true);
      setResendSuccess(false);

      await resendOtp({ email }).unwrap();

      // RESET TIMER DENGAN PASTI
      setResendTimer(60);
      setResendSuccess(true);

      // ilangin pesan sukses setelah beberapa detik
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError("Gagal mengirim ulang OTP");
    } finally {
      setIsResending(false);
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="bg-primary flex min-h-screen items-center justify-center px-4">
      <div className="bg-card w-full max-w-md rounded-xl p-8 text-center shadow-sm">
        {success ? (
          /* SUCCESS */
          <div className="success-pop flex flex-col items-center">
            <div className="h- flex1 w- mb-4818 items-center justify-center rounded-full bg-green-500 text-4xl text-white">
              ✓
            </div>
            <h2 className="text-xl font-bold">Berhasil Verifikasi!</h2>
          </div>
        ) : (
          <>
            <h2 className="mb-2 text-2xl font-bold">Verifikasi OTP</h2>
            <p className="text-muted-foreground mb-6">
              Masukkan kode OTP yang dikirim ke{" "}
              <strong className="text-foreground">{email}</strong>
            </p>

            {/* OTP INPUT */}
            <div className={cn("flex justify-center", shake && "shake")}>
              <InputOTP
                maxLength={6}
                value={otp}
                autoFocus
                disabled={isLoading}
                onChange={(value) => {
                  // hanya angka
                  if (/^\d*$/.test(value)) {
                    setOtp(value);
                  }
                }}
                onPaste={(e) => {
                  const pasted = e.clipboardData.getData("text").trim();

                  // hanya terima 6 digit angka
                  if (/^\d{6}$/.test(pasted)) {
                    e.preventDefault();
                    setOtp(pasted);
                  }
                }}
              >
                <InputOTPGroup className="gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="h-10 w-10 text-base md:h-14 md:w-14 md:text-xl"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* VERIFY BUTTON */}
            <Button
              className="mt-6 h-11 w-full"
              onClick={handleVerify}
              disabled={isLoading || otp.length < 6}
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading && <Spinner />}
                {isLoading ? "Memverifikasi" : "Verifikasi"}
              </span>
            </Button>

            {/* RESEND */}
            <p className="text-muted-foreground mt-4 text-sm">
              Belum menerima OTP?{" "}
              <button
                onClick={handleResend}
                disabled={resendTimer > 0 || isResending}
                className={cn(
                  "cursor-pointer font-medium transition",
                  resendTimer > 0 || isResending
                    ? "text-muted-foreground cursor-not-allowed"
                    : "text-primary hover:underline",
                )}
              >
                {isResending
                  ? "Mengirim..."
                  : resendTimer > 0
                    ? `Kirim ulang dalam ${resendTimer}s`
                    : "Kirim Ulang OTP"}
              </button>
            </p>

            {error && <p className="text-destructive mt-3 text-sm">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}
