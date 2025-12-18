import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "@/components/form/InputField";
import PasswordField from "@/components/form/PasswordField";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRegisterMutation } from "@/services/api";

export default function RegisterForm({ onSwitch }) {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const [submitted, setSubmitted] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [phone, setPhone] = useState("");
  const [phoneValid, setPhoneValid] = useState(true);

  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true);

  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);

  const [confirm, setConfirm] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(false);

  /* ================= VALIDATION ================= */
  useEffect(() => {
    const passOK =
      password.length >= 6 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password);

    setPasswordValid(passOK);
    setPasswordMatch(confirm === password && password.length > 0);

    setPhoneValid(/^\d+$/.test(phone) || phone.length === 0);
    setEmailValid(email.includes("@") || email.length === 0);
  }, [password, confirm, phone, email]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    setSubmitted(true);

    if (
      !firstName ||
      !lastName ||
      !phone ||
      !phoneValid ||
      !email ||
      !emailValid ||
      !passwordValid ||
      !passwordMatch
    ) {
      return;
    }

    try {
      await registerUser({
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        email,
        password,
      });

      navigate("/otp", { state: { email } });
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="animate-slideInRight w-full max-w-md">
      <h1 className="mb-6 text-3xl font-bold">Register</h1>

      <div className="space-y-4">
        {/* NAMA */}
        <div className="flex gap-6">
          <InputField
            label="Nama Depan"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={submitted && !firstName}
            helperText={submitted && !firstName ? "Nama depan wajib diisi" : ""}
          />

          <InputField
            label="Nama Belakang"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={submitted && !lastName}
            helperText={
              submitted && !lastName ? "Nama belakang wajib diisi" : ""
            }
          />
        </div>

        {/* PHONE */}
        <InputField
          label="Nomor HP"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={submitted && (!phone || !phoneValid)}
          helperText={
            submitted && !phone
              ? "Nomor HP wajib diisi"
              : submitted && !phoneValid
                ? "Nomor HP hanya boleh angka"
                : ""
          }
        />

        {/* EMAIL */}
        <InputField
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={submitted && (!email || !emailValid)}
          helperText={
            submitted && !email
              ? "Email wajib diisi"
              : submitted && !emailValid
                ? "Format email tidak valid"
                : ""
          }
        />

        {/* PASSWORD */}
        <PasswordField
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={submitted && !passwordValid}
        />

        {password.length > 0 && (
          <p
            className={`text-sm ${
              passwordValid ? "text-green-600" : "text-destructive"
            }`}
          >
            Password minimal 6 karakter, huruf besar, angka, dan simbol
          </p>
        )}

        {/* CONFIRM PASSWORD */}
        <PasswordField
          label="Konfirmasi Password"
          placeholder="Enter your password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={submitted && !passwordMatch}
        />

        {confirm.length > 0 && (
          <p
            className={`text-sm ${
              passwordMatch ? "text-green-600" : "text-destructive"
            }`}
          >
            {passwordMatch ? "Password cocok" : "Password tidak cocok"}
          </p>
        )}

        {/* SUBMIT */}
        <Button
          className="h-12 w-full"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          <span className="flex items-center justify-center gap-2">
            {isLoading && <Spinner />}
            {isLoading ? "Processing" : "Daftar"}
          </span>
        </Button>

        <Button variant="ghost" className="w-full md:hidden" onClick={onSwitch}>
          Sudah punya akun? Login
        </Button>
      </div>
    </div>
  );
}
