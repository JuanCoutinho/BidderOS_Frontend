import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    gemini_api_key?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1` : '/api/v1',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as { auth: { token: string | null } }).auth.token;
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, { email: string; password: string }>({
            query: (body) => ({ url: '/auth/login', method: 'POST', body }),
        }),
        register: builder.mutation<AuthResponse, { name: string; email: string; password: string; password_confirmation: string }>({
            query: (body) => ({ url: '/auth/register', method: 'POST', body }),
        }),
        updateSettings: builder.mutation<{ user: User }, { gemini_api_key: string }>({
            query: (body) => ({ url: '/auth/me', method: 'PUT', body }),
        }),
        me: builder.query<{ user: User }, void>({
            query: () => '/auth/me',
        }),
        resumes: builder.query<{ id: number; filename: string; created_at: string }[], void>({
            query: () => '/resumes',
        }),
        uploadResume: builder.mutation<
            { message: string; processed: string[]; errors?: { file: string; reason: string }[] },
            FormData
        >({
            query: (formData) => ({ url: '/resumes', method: 'POST', body: formData }),
        }),
        recommendations: builder.mutation<{ id: number; filename: string; score: number; created_at: string }[], { job_description: string }>({
            query: (body) => ({ url: '/recommendations', method: 'POST', body }),
        }),
        generateCoverLetter: builder.mutation<{ cover_letter: string }, { resume_id: number; job_description: string }>({
            query: (body) => ({ url: '/recommendations/cover_letter', method: 'POST', body }),
        }),
        generateGapAnalysis: builder.mutation<{ gap_analysis: string }, { resume_id: number; job_description: string }>({
            query: (body) => ({ url: '/recommendations/gap_analysis', method: 'POST', body }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useMeQuery,
    useResumesQuery,
    useUploadResumeMutation,
    useRecommendationsMutation,
    useGenerateCoverLetterMutation,
    useUpdateSettingsMutation,
    useGenerateGapAnalysisMutation
} = authApi;
