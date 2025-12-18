import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/login", replace: true }) }), _jsx(Route, { path: "/login", element: _jsx(AuthPage, {}) }), _jsx(Route, { path: "/forgot-password", element: _jsx(ForgotPassword, {}) }), _jsx(Route, { path: "/otp", element: _jsx(VerifyOtp, {}) }), _jsx(Route, { path: "/resetpassword", element: _jsx(ResetPassword, {}) }), _jsx(Route, { path: "/dashboard_user", element: _jsx(DashboardUser, {}) }), _jsx(Route, { path: "/tryouts", element: _jsx(Tryouts, {}) }), _jsx(Route, { path: "/question/:tryoutId", element: _jsx(QuestionPage, {}) }), _jsx(Route, { path: "/review/:tryoutId", element: _jsx(ReviewTryout, {}) }), _jsx(Route, { path: "/latihan", element: _jsx(Latihan, {}) }), _jsx(Route, { path: "/latihan/:latihanId", element: _jsx(LatihanSoalPage, {}) }), _jsx(Route, { path: "/materi", element: _jsx(Materi, {}) }), _jsx(Route, { path: "/materi/:materiId", element: _jsx(DetailMateri, {}) }), _jsx(Route, { path: "/setting", element: _jsx(Setting, {}) }), _jsx(Route, { path: "/event", element: _jsx(Event, {}) }), _jsx(Route, { path: "/event/:eventId", element: _jsx(DetailEvent, {}) }), _jsx(Route, { path: "/subscribe/", element: _jsx(SubscriptionPage, {}) }), _jsx(Route, { path: "/activity/", element: _jsx(RightContainerPage, {}) })] }) }));
}
