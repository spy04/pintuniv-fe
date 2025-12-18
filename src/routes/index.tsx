import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "@/pages/auth";
import ForgotPassword from "@/pages/auth/forgotpassword";
import VerifyOtp from "@/pages/auth/otpform";
import ResetPassword from "@/pages/auth/resetpassword";
import DashboardUser from "@/pages/dashboard";
import Tryouts from "@/pages/tryout";
import Latihan from "@/pages/latihan";
import Materi from "@/pages/materi";
import Setting from "@/pages/setting";
import Event from "@/pages/event";
import DetailMateri from "@/pages/materi/detail_materi";
import LatihanSoalPage from "@/pages/latihan/detail_latihan";
import QuestionPage from "@/pages/tryout/detail_tryout";
import ReviewTryout from "@/pages/tryout/review";
import DetailEvent from "@/pages/event/detail_event";
import SubscriptionPage from "@/pages/subs";
import RightContainerPage from "@/pages/dashboard/rigthContainer";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp" element={<VerifyOtp />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/dashboard_user" element={<DashboardUser />} />
        <Route path="/tryouts" element={<Tryouts />} />
        <Route path="/question/:tryoutId" element={<QuestionPage />} />
        <Route path="/review/:tryoutId" element={<ReviewTryout />} />
        <Route path="/latihan" element={<Latihan />} />
        <Route path="/latihan/:latihanId" element={<LatihanSoalPage />} />
        <Route path="/materi" element={<Materi />} />
        <Route path="/materi/:materiId" element={<DetailMateri />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/event" element={<Event />} />
        <Route path="/event/:eventId" element={<DetailEvent />} />
        <Route path="/subscribe/" element={<SubscriptionPage />} />
        <Route path="/activity/" element={<RightContainerPage />} />
      </Routes>
    </BrowserRouter>
  );
}
