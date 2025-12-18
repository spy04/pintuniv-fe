import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "@/components/form/InputField";
import PasswordField from "@/components/form/PasswordField";
import { Button } from "@/components/ui/button";
import { useLoginMutation, useMeMutation } from "@/services/api";
import { Spinner } from "@/components/ui/spinner";

type LoginFormProps = {
  onSwitch?: () => void;
};

export default function LoginForm({ onSwitch }: LoginFormProps) {
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const [me] = useMeMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  /* ================= VALIDATION ================= */
  const isEmailEmpty = submitted && !email.trim();
  const isEmailInvalid =
    submitted && email.trim() !== "" && !email.includes("@");
  const isPasswordEmpty = submitted && !password.trim();

  const isFormInvalid = isEmailEmpty || isEmailInvalid || isPasswordEmpty;
  const [serverError, setServerError] = useState<string | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (serverError) setServerError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (serverError) setServerError(null);
  };

  /* ================= HANDLER ================= */
  const handleLogin = async () => {
    setSubmitted(true);
    if (isFormInvalid) return;

    try {
      const res = await login({ email, password }).unwrap();

      if (res.need_otp) {
        navigate("/otp", { state: { email: res.email } });
        return;
      }

      localStorage.setItem("token", res.access);
      localStorage.setItem("refresh_token", res.refresh);

      const user = await me().unwrap();
      localStorage.setItem("user", JSON.stringify(user));

      navigate(user.is_staff ? "/dashboard_admin" : "/dashboard_user", {
        replace: true,
      });
    } catch (error: any) {
      const message = error?.data?.detail || "Email atau password salah";

      setServerError(message);
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="animate-slideInLeft w-full max-w-md">
      <h1 className="mb-6 text-3xl font-bold">Login</h1>

      <div className="space-y-4">
        {/* EMAIL */}
        <InputField
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={isEmailEmpty || isEmailInvalid}
          helperText={
            isEmailEmpty
              ? "Email wajib diisi"
              : isEmailInvalid
                ? "Format email tidak valid"
                : undefined
          }
        />

        {/* PASSWORD */}
        <PasswordField
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={isPasswordEmpty}
          helperText={isPasswordEmpty ? "Password wajib diisi" : undefined}
        />

        {serverError && (
          <p className="text-destructive mt-1 text-sm">{serverError}</p>
        )}

        <div className="text-right">
          <Button
            variant="link"
            type="button"
            onClick={() => navigate("/forgot-password")}
          >
            Lupa Password?
          </Button>
        </div>

        <Button
          className="h-12 w-full"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner />
              <span>Logging in</span>
            </span>
          ) : (
            "Login"
          )}
        </Button>

        {onSwitch && (
          <Button
            variant="ghost"
            className="w-full md:hidden"
            onClick={onSwitch}
          >
            Belum punya akun? Register
          </Button>
        )}
      </div>
    </div>
  );
}
