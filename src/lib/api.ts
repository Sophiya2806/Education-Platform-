import type {
  AuthResponse,
  Achievement,
  Comment,
  Course,
  DailyStat,
  LanguageCode,
  Lesson,
  LeaderboardEntry,
  Post,
  ProgressEntry,
  ProgressSummary,
  PublicUser,
  Quest,
  Recommendation,
  Skill,
  SkillStats,
  User,
} from "@shared/types";

const BASE = "/api";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("la_token");
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
    ...init,
  });
  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  const data = await res.json();
  return data.data as T;
}

export const api = {
  // Auth
  signUp: (payload: { username: string; email: string; password: string; nativeLanguage: LanguageCode; targetLanguage: LanguageCode }) =>
    request<AuthResponse>("/auth/sign-up", { method: "POST", body: JSON.stringify(payload) }),
  signIn: (payload: { email: string; password: string }) =>
    request<AuthResponse>("/auth/sign-in", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request<PublicUser>("/auth/me"),
  updateMe: (payload: Partial<Pick<User, "nativeLanguage" | "targetLanguage" | "bio" | "avatarSeed" | "username">>) =>
    request<PublicUser>("/auth/me", { method: "PATCH", body: JSON.stringify(payload) }),

  // Courses
  listCourses: (params: { language?: LanguageCode; level?: string } = {}) => {
    const qs = new URLSearchParams();
    if (params.language) qs.set("language", params.language);
    if (params.level) qs.set("level", params.level);
    return request<Course[]>(`/courses?${qs.toString()}`);
  },
  courseDetail: (id: string) =>
    request<{ course: Course; lessons: Lesson[] }>(`/courses/${id}`),
  lesson: (id: string) => request<Lesson>(`/lessons/${id}`),
  recommendations: (userId: string) => request<Recommendation[]>(`/recommendations/${userId}`),

  // Progress
  progressSummary: (userId: string) => request<ProgressSummary>(`/progress/${userId}`),
  submitProgress: (payload: { lessonId: string; accuracy: number; timeSpentSec: number; skill: Skill }) =>
    request<{
      progress: ProgressEntry;
      xpEarned: number;
      user: { xp: number; level: string; streak: number; hearts: number };
      newAchievements: Achievement[];
    }>("/progress", { method: "POST", body: JSON.stringify(payload) }),

  // Community
  listPosts: (params: { language?: LanguageCode; level?: string } = {}) => {
    const qs = new URLSearchParams();
    if (params.language) qs.set("language", params.language);
    if (params.level) qs.set("level", params.level);
    return request<(Post & { author: PublicUser | null })[]>(`/community/posts?${qs.toString()}`);
  },
  createPost: (payload: { language: LanguageCode; level: string; title: string; body: string }) =>
    request<Post & { author: PublicUser | null }>("/community/posts", { method: "POST", body: JSON.stringify(payload) }),
  reactPost: (id: string, type: "fire" | "clap" | "sparkle") =>
    request<Post>(`/community/posts/${id}/reactions`, { method: "POST", body: JSON.stringify({ type }) }),
  commentPost: (id: string, body: string) =>
    request<Comment>(`/community/posts/${id}/comments`, { method: "POST", body: JSON.stringify({ body }) }),
  leaderboard: () => request<LeaderboardEntry[]>(`/community/leaderboard`),

  // Achievements / Quests
  achievements: () => request<Achievement[]>(`/achievements`),
  quests: () => request<Quest[]>(`/quests`),

  // Users
  publicUser: (id: string) => request<PublicUser>(`/users/${id}`),
};
