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
    const isValid =
      password.length >= 6 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password);

    setPasswordValid(isValid);
    setPasswordMatch(confirm === password && password.length > 0);
  }, [password, confirm]);

  const handleReset = async (e: any) => {
    e.preventDefault();

    if (!passwordValid || !passwordMatch) return;

    try {
      await resetPassword({ uid, token, password }).unwrap();
      setSuccess(true); // tampilkan UI sukses
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#152D64] px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
        
        {!success ? (
          <>
            <h1 className="text-center text-3xl font-bold mb-2">
              Reset Password
            </h1>

            <p className="text-center text-gray-600 mb-6 -mt-1">
              Masukkan password baru kamu
            </p>

            <form onSubmit={handleReset} className="space-y-4">
              {/* PASSWORD BARU */}
              <PasswordField
                label="Password Baru"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {password.length > 0 && (
                <p
                  className={`text-sm ${
                    passwordValid ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Password harus minimal 6 karakter, ada huruf besar, angka,
                  dan simbol
                </p>
              )}

              {/* KONFIRMASI */}
              <PasswordField
                label="Konfirmasi Password"
                placeholder="Re-enter new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />

              {confirm.length > 0 && (
                <p
                  className={`text-sm ${
                    passwordMatch ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {passwordMatch ? "Password cocok" : "Password tidak cocok"}
                </p>
              )}

              <Button
                type="submit"
                className="w-full h-12 mt-2"
                disabled={!passwordValid || !passwordMatch || isLoading}
              >
                {isLoading ? "Memproses..." : "Ubah Password"}
              </Button>
            </form>
          </>
        ) : (
          /* SUCCESS UI */
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-20 w-20 rounded-full bg-green-500 flex items-center justify-center text-white text-4xl">
                ✓
              </div>
            </div>

            <h2 className="text-xl font-bold mb-2">Password Berhasil Diubah</h2>
            <p className="text-gray-600 mb-6">
              Password baru kamu sudah aktif.  
              Silakan login ulang.
            </p>

            <Button
              className="w-full h-12"
              onClick={() => navigate("/")}
            >
              Kembali ke Login
            </Button>
          </div>
        )}

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-sm text-blue-600 hover:underline"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}
