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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!emailValid) return;

    try {
      await forgotPassword({ email }).unwrap();
      setSuccess(true); // ⬅️ tampilkan success UI
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#152D64] px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">

        {!success ? (
          <>
            <h1 className="text-center text-3xl font-bold mb-2">Lupa Password</h1>
            <p className="text-center text-gray-600 mb-6 -mt-1">
              Kami akan mengirimkan link reset password ke email kamu
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Masukkan email kamu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={
                    emailError
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                />

                {emailError && (
                  <p className="text-sm text-red-600 mt-1">
                    Email tidak valid
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full h-12" disabled={isLoading}>
                {isLoading ? "Mengirim..." : "Kirim Link Reset"}
              </Button>
            </form>
          </>
        ) : (
          <>
            {/* SUCCESS STATE */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="h-20 w-20 rounded-full bg-green-500 flex items-center justify-center text-white text-4xl">
                  ✓
                </div>
              </div>

              <h2 className="text-xl font-bold mb-2">Link Terkirim!</h2>
              <p className="text-gray-600 mb-6">
                Kami sudah mengirimkan link reset password ke <b>{email}</b>.
                <br /> Silakan cek inbox atau folder spam.
              </p>

              <Button
                className="w-full h-12"
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                  setSubmitted(false);
                }}
              >
                Kirim ulang ke email lain
              </Button>
            </div>
          </>
        )}

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-sm text-blue-600 hover:underline cursor-pointer"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}
