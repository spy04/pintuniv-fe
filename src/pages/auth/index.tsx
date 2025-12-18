import { useState } from "react";
import LoginForm from "./login";
import RegisterForm from "./register";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="bg-background text-foreground relative flex h-screen w-full overflow-hidden">
      {/* ==== MOBILE VIEW ==== */}
      <div className="flex h-full w-full items-center justify-center px-6 md:hidden">
        {mode === "login" ? (
          <LoginForm onSwitch={() => setMode("register")} />
        ) : (
          <RegisterForm onSwitch={() => setMode("login")} />
        )}
      </div>

      {/* ==== DESKTOP VIEW ==== */}
      <div className="hidden h-full w-full md:flex">
        {/* LEFT SIDE — LOGIN */}
        <div className="relative z-10 flex w-1/2 items-center justify-center px-20">
          {mode === "login" && (
            <LoginForm onSwitch={() => setMode("register")} />
          )}
        </div>

        {/* RIGHT SIDE — REGISTER */}
        <div className="relative z-10 flex w-1/2 items-center justify-center px-20">
          {mode === "register" && (
            <RegisterForm onSwitch={() => setMode("login")} />
          )}
        </div>

        {/* ==== BLUE SLIDER PANEL ==== */}
        <div
          className={`bg-primary text-primary-foreground absolute top-0 left-0 flex h-full w-1/2 flex-col items-center justify-center p-10 text-white transition-transform duration-700 ease-out ${mode === "login" ? "translate-x-full" : "translate-x-0"} `}
          style={{ zIndex: 40 }}
        >
          {mode === "login" ? (
            <>
              <h2 className="mb-4 text-4xl font-bold">Hello Friend!</h2>
              <p className="opacity-80">
                Daftar sekarang, siap-siap jadi lebih pintar!
              </p>
              <Button
                variant="outline"
                className="mt-6 border-white text-black hover:bg-white hover:text-[#152D64]"
                onClick={() => setMode("register")}
              >
                Daftar Sekarang
              </Button>
            </>
          ) : (
            <>
              <h2 className="mb-4 text-4xl font-bold">Welcome Back!</h2>
              <p className="opacity-80">
                Masuk sekarang dan lanjutkan belajar!
              </p>
              <Button
                variant="outline"
                className="mt-6 border-white text-black hover:bg-white hover:text-[#152D64]"
                onClick={() => setMode("login")}
              >
                Login Sekarang
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
