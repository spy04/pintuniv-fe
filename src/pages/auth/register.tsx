import InputField from "@/components/form/InputField";
import PasswordField from "@/components/form/PasswordField";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRegisterMutation } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner"

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
      const payload = {
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        email,
        password,
      };

      const res = await registerUser(payload).unwrap();

      // setelah register → selalu ke OTP
      navigate("/otp", { state: { email } });

    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="animate-slideInRight w-full max-w-md">
      <h1 className="mb-6 text-3xl font-bold">Register</h1>

      <div className="space-y-4">
        {/* NAMA */}
        <div className="flex w-full gap-6">
          <div className="flex-1">
            <InputField
              label="Nama Depan"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={
                submitted && !firstName
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />
            {submitted && !firstName && (
              <p className="text-sm text-red-600 mt-1">Nama depan wajib diisi</p>
            )}
          </div>

          <div className="flex-1">
            <InputField
              label="Nama Belakang"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={
                submitted && !lastName
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />
            {submitted && !lastName && (
              <p className="text-sm text-red-600 mt-1">Nama belakang wajib diisi</p>
            )}
          </div>
        </div>

        {/* PHONE */}
        <InputField
          label="Nomor HP"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={
            submitted && (!phone || !phoneValid)
              ? "border-red-500 focus-visible:ring-red-500"
              : ""
          }
        />
        {submitted && (!phone || !phoneValid) && (
          <p className="text-sm text-red-600 mt-1">
            {phone ? "Nomor HP hanya boleh angka" : "Nomor HP wajib diisi"}
          </p>
        )}

        {/* EMAIL */}
        <InputField
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={
            submitted && (!email || !emailValid)
              ? "border-red-500 focus-visible:ring-red-500"
              : ""
          }
        />
        {submitted && (!email || !emailValid) && (
          <p className="text-sm text-red-600 mt-1">
            {email ? "Format email tidak valid" : "Email wajib diisi"}
          </p>
        )}

        {/* PASSWORD */}
        <PasswordField
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={
            submitted && !passwordValid
              ? "border-red-500 focus-visible:ring-red-500"
              : ""
          }
        />
        {password.length > 0 && (
          <p
            className={`text-sm ${
              passwordValid ? "text-green-600" : "text-red-600"
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
          className={
            submitted && !passwordMatch
              ? "border-red-500 focus-visible:ring-red-500"
              : ""
          }
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
          className="h-12 w-full cursor-pointer"
          onClick={handleSubmit}
          disabled={isLoading}
        >
        <Spinner />
          {isLoading ? "Processing..." : "Daftar"}
        </Button>

        <Button
          variant="ghost"
          className="w-full md:hidden"
          onClick={onSwitch}
        >
          Sudah punya akun? Login
        </Button>
      </div>
    </div>
  );
}
