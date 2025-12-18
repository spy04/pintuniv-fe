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

    if (!email || !password || !email.includes("@")) return;

    try {
      const res = (await login({ email, password }).unwrap()) as {
        access: string;
        refresh: string;
        email: string;
        need_otp?: boolean;
      };

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
      } else {
        navigate("/dashboard_user", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="animate-slideInLeft w-full max-w-md">
      <h1 className="mb-6 text-3xl font-bold">Login</h1>

      <div className="space-y-4">
        {/* EMAIL */}
        <div>
          <InputField
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={
              emailEmpty || emailInvalid
                ? "border-red-500 focus-visible:ring-red-500"
                : ""
            }
          />

          {emailEmpty && (
            <p className="text-sm text-red-600 mt-1">Email wajib diisi</p>
          )}
          {!emailEmpty && emailInvalid && (
            <p className="text-sm text-red-600 mt-1">
              Format email tidak valid
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <PasswordField
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={
              passwordError
                ? "border-red-500 focus-visible:ring-red-500"
                : ""
            }
          />

          {passwordError && (
            <p className="text-sm text-red-600 mt-1">Password wajib diisi</p>
          )}
        </div>

        <div className="text-right">
          <Button variant="link" onClick={() => navigate("/forgot-password")}>
            Lupa Password?
          </Button>
        </div>

        <Button
          className="h-12 w-full"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>

        <Button
          variant="ghost"
          className="w-full md:hidden"
          onClick={onSwitch}
        >
          Belum punya akun? Register
        </Button>
      </div>
    </div>
  );
}
