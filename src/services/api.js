// src/services/api.tsx
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = "https://api.pintuniv.com/api/";
// baseQuery utama
const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        if (token)
            headers.set("Authorization", `Bearer ${token}`);
        return headers;
    },
});
// auto refresh token (mirip project lama)
const baseQueryWithRefresh = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result.error?.status === 401) {
        console.log("🔄 Token expired → refreshing...");
        const refresh = localStorage.getItem("refresh_token");
        if (!refresh) {
            localStorage.clear();
            window.location.href = "/";
            return result;
        }
        const refreshResult = await baseQuery({
            url: "token/refresh/",
            method: "POST",
            body: { refresh },
        }, api, extraOptions);
        // FIXED TYPING
        const data = refreshResult.data;
        if (data?.access) {
            const newToken = data.access;
            console.log("🔄 New token:", newToken);
            localStorage.setItem("token", newToken);
            // ulang request
            result = await baseQuery(args, api, extraOptions);
        }
        else {
            localStorage.clear();
            window.location.href = "/";
        }
    }
    return result;
};
export const api = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithRefresh,
    tagTypes: ["User", "Tryout", "Materi", "Latihan"],
    endpoints: (builder) => ({
        // =============== AUTH ==================
        //     me: builder.query<any, void>({
        //   query: () => "me/",
        // }),
        me: builder.mutation({
            query: () => ({
                url: "me/",
                method: "GET",
            }),
        }),
        login: builder.mutation({
            query: (body) => ({
                url: "login/",
                method: "POST",
                body,
            }),
        }),
        verifyOtp: builder.mutation({
            query: (body) => ({
                url: "verify-otp/",
                method: "POST",
                body,
            }),
        }),
        resendOtp: builder.mutation({
            query: (body) => ({
                url: "resend-otp/",
                method: "POST",
                body,
            }),
        }),
        register: builder.mutation({
            query: (body) => ({
                url: "register/",
                method: "POST",
                body,
            }),
        }),
        forgotPassword: builder.mutation({
            query: (body) => ({
                url: "forgot-password/",
                method: "POST",
                body,
            }),
        }),
        resetPassword: builder.mutation({
            query: ({ uid, token, password }) => ({
                url: `reset-password/${uid}/${token}/`,
                method: "POST",
                body: { password },
            }),
        }),
        // =============== USER ==================
        getUser: builder.query({
            query: () => "user/detail/",
            providesTags: ["User"],
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: "user/detail/",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),
        fetchUserDetail: builder.mutation({
            query: () => ({
                url: "user/detail/",
                method: "GET",
            }),
        }),
        // ============== TRYOUT =================
        getTryouts: builder.query({
            query: () => "tryouts/",
        }),
        startTryout: builder.mutation({
            query: (id) => ({
                url: `tryouts/${id}/start/`,
                method: "POST",
            }),
        }),
        getQuestions: builder.query({
            query: (tryoutId) => `questions/?tryout_id=${tryoutId}`,
        }),
        saveDraft: builder.mutation({
            query: (body) => ({
                url: "/answer/draft/",
                method: "POST",
                body,
            }),
        }),
        submitFinal: builder.mutation({
            query: ({ id, answers }) => ({
                url: `/tryouts/${id}/submit/`,
                method: "POST",
                body: answers,
            }),
        }),
        getTryoutReview: builder.query({
            query: (tryoutId) => `tryouts/${tryoutId}/result/`,
        }),
        // ========== PRACTICE TEST ==============
        getPracticeTests: builder.query({
            query: () => "practice-tests/",
        }),
        getMateri: builder.query({
            query: (practiceId) => `materi/?practice_id=${practiceId}`,
        }),
        getMateriDetail: builder.query({
            query: (id) => `/detail-materi/${id}/`,
        }),
        getLatihanAll: builder.query({
            query: () => "latihan/",
        }),
        getLatihan: builder.query({
            query: (materiId) => `latihan/?latihan_id=${materiId}`,
        }),
        getLatihanSoal: builder.query({
            query: (latihanId) => `latihan-soal/?latihan_id=${latihanId}`,
        }),
        submitLatihan: builder.mutation({
            query: ({ latihanId, body }) => ({
                url: `latihan-soal/${latihanId}/submit/`,
                method: "POST",
                body,
            }),
        }),
        // ========== UPLOAD (multipart) =========
        uploadQuestion: builder.mutation({
            query: (formData) => ({
                url: "/question/upload/",
                method: "POST",
                body: formData,
            }),
        }),
        uploadTryout: builder.mutation({
            query: (formData) => ({
                url: "tryout/upload/",
                method: "POST",
                body: formData,
            }),
        }),
        getQuotes: builder.query({
            query: () => "quote/",
        }),
        getCountdown: builder.query({
            query: () => "countdown/",
        }),
        getTryoutRanks: builder.query({
            query: (tryoutId) => `rank/tryout/${tryoutId}/`,
        }),
        getTotalRanks: builder.query({
            query: () => `rank/total/`,
        }),
        getEvents: builder.query({
            query: () => "event/",
        }),
        getSubscriptions: builder.query({
            query: () => "subscription/",
        }),
        checkoutSubscription: builder.mutation({
            query: ({ subscriptionId, amount }) => ({
                url: "create_transaction/",
                method: "POST",
                body: {
                    subscription_id: subscriptionId,
                    amount,
                },
            }),
        }),
    }),
});
// EXPORT HOOKS
export const { 
// useMeQuery,
useMeMutation, useLoginMutation, useVerifyOtpMutation, useResendOtpMutation, useRegisterMutation, useForgotPasswordMutation, useResetPasswordMutation, useGetUserQuery, useUpdateUserMutation, useFetchUserDetailMutation, useGetTryoutsQuery, useStartTryoutMutation, useGetQuestionsQuery, useSaveDraftMutation, useSubmitFinalMutation, useGetTryoutReviewQuery, useGetPracticeTestsQuery, useGetMateriQuery, useGetMateriDetailQuery, useGetLatihanQuery, useGetLatihanAllQuery, useGetLatihanSoalQuery, useSubmitLatihanMutation, useUploadQuestionMutation, useUploadTryoutMutation, useGetSubscriptionsQuery, useGetQuotesQuery, useGetCountdownQuery, useGetTryoutRanksQuery, useGetTotalRanksQuery, useLazyGetMateriQuery, useGetEventsQuery, useCheckoutSubscriptionMutation, } = api;
