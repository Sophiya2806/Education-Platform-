import { create } from "zustand";
import { api } from "@/lib/api";
import type {
  Achievement,
  LanguageCode,
  LeaderboardEntry,
  Post,
  ProgressSummary,
  PublicUser,
  Quest,
  Recommendation,
  SkillStats,
} from "@shared/types";

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: "success" | "info" | "achievement";
}

interface AppState {
  // Auth
  user: PublicUser | null;
  token: string | null;
  loadingUser: boolean;

  // Data
  progress: ProgressSummary | null;
  quests: Quest[];
  recommendations: Recommendation[];
  achievements: Achievement[];
  posts: (Post & { author: PublicUser | null })[];
  leaderboard: LeaderboardEntry[];

  // UI
  toasts: ToastMessage[];
  initialized: boolean;

  // Actions
  bootstrap: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (payload: { username: string; email: string; password: string; nativeLanguage: LanguageCode; targetLanguage: LanguageCode }) => Promise<void>;
  signOut: () => void;
  setUser: (user: PublicUser) => void;
  refreshAll: () => Promise<void>;
  pushToast: (t: Omit<ToastMessage, "id">) => void;
  dismissToast: (id: string) => void;
  updateSettings: (payload: Partial<PublicUser>) => Promise<void>;
}

export const useApp = create<AppState>((set, get) => ({
  user: null,
  token: null,
  loadingUser: true,
  progress: null,
  quests: [],
  recommendations: [],
  achievements: [],
  posts: [],
  leaderboard: [],
  toasts: [],
  initialized: false,

  async bootstrap() {
    const token = localStorage.getItem("la_token");
    if (!token) {
      set({ loadingUser: false, initialized: true });
      return;
    }
    set({ token });
    try {
      const user = await api.me();
      set({ user, loadingUser: false, initialized: true });
      await get().refreshAll();
    } catch {
      localStorage.removeItem("la_token");
      set({ user: null, token: null, loadingUser: false, initialized: true });
    }
  },

  async signIn(email, password) {
    const res = await api.signIn({ email, password });
    localStorage.setItem("la_token", res.token);
    set({ user: res.user, token: res.token });
    await get().refreshAll();
  },

  async signUp(payload) {
    const res = await api.signUp(payload);
    localStorage.setItem("la_token", res.token);
    set({ user: res.user, token: res.token });
    await get().refreshAll();
  },

  signOut() {
    localStorage.removeItem("la_token");
    set({ user: null, token: null, progress: null, quests: [], recommendations: [], achievements: [] });
  },

  setUser(user) {
    set({ user });
  },

  async refreshAll() {
    const user = get().user;
    if (!user) return;
    try {
      const [progress, quests, recommendations, achievements, posts, leaderboard] = await Promise.all([
        api.progressSummary(user.id).catch(() => null),
        api.quests().catch(() => []),
        api.recommendations(user.id).catch(() => []),
        api.achievements().catch(() => []),
        api.listPosts().catch(() => []),
        api.leaderboard().catch(() => []),
      ]);
      set({ progress, quests, recommendations, achievements, posts, leaderboard });
    } catch (err) {
      console.error("refreshAll failed", err);
    }
  },

  pushToast(t) {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const toast: ToastMessage = { id, ...t };
    set((s) => ({ toasts: [...s.toasts, toast] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) }));
    }, 4200);
  },

  dismissToast(id) {
    set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) }));
  },

  async updateSettings(payload) {
    const updated = await api.updateMe(payload);
    set({ user: updated });
  },
}));

export function useUser() {
  return useApp((s) => s.user);
}

export function useSkills(): SkillStats | null {
  return useApp((s) => s.progress?.skills ?? null);
}
