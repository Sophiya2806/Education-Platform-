// Shared types between the Express API and the React frontend.

export type LanguageCode = "en" | "ja" | "ko" | "zh" | "fr" | "es" | "de" | "it";
export type Skill = "reading" | "writing" | "listening" | "speaking";
export type Level = "A1" | "A2" | "B1" | "B2" | "C1";

export interface LanguageMeta {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  family: "Germanic" | "Japonic" | "Koreanic" | "Sino-Tibetan" | "Romance";
  greeting: string;
  romanization?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  nativeLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  level: Level;
  xp: number;
  streak: number;
  lastStudyDate: string;
  hearts: number;
  joinedAt: string;
  avatarSeed: string;
  bio: string;
  following: string[];
  followers: string[];
  unlockedAchievementIds: string[];
}

export type PublicUser = Omit<User, "password" | "email"> & { email?: string };

export interface Course {
  id: string;
  language: LanguageCode;
  level: Level;
  title: string;
  summary: string;
  units: number;
  estimatedHours: number;
  skills: Skill[];
  lessonIds: string[];
}

export type LessonItem =
  | {
      type: "vocab";
      prompt: string;
      translation: string;
      ipa?: string;
      example?: string;
      exampleTranslation?: string;
    }
  | {
      type: "grammar";
      prompt: string;
      answer: string;
      choices: string[];
      rule: string;
      example: string;
    }
  | {
      type: "shadow";
      prompt: string;
      transliteration: string;
      translation: string;
    }
  | {
      type: "listen";
      audio: string;
      question: string;
      choices: string[];
      answer: string;
    };

export interface Lesson {
  id: string;
  courseId: string;
  language: LanguageCode;
  level: Level;
  skill: Skill;
  unit: number;
  title: string;
  estimatedMinutes: number;
  xpReward: number;
  items: LessonItem[];
}

export interface ProgressEntry {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  skill: Skill;
  accuracy: number;
  timeSpentSec: number;
  completedAt: string;
}

export interface SkillStats {
  reading: number;
  writing: number;
  listening: number;
  speaking: number;
}

export interface DailyStat {
  date: string;
  minutes: number;
  lessons: number;
  accuracy: number;
}

export interface ProgressSummary {
  userId: string;
  skills: SkillStats;
  heatmap: DailyStat[];
  masteredWords: { word: string; translation: string; language: LanguageCode }[];
  totalMinutes: number;
  totalLessons: number;
  averageAccuracy: number;
}

export interface Post {
  id: string;
  authorId: string;
  language: LanguageCode;
  level: Level;
  title: string;
  body: string;
  reactions: { fire: number; clap: number; sparkle: number };
  userReactions: Record<string, "fire" | "clap" | "sparkle">;
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  xpReward: number;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: PublicUser;
  weeklyXp: number;
  totalXp: number;
  streak: number;
}

export interface Recommendation {
  lesson: Lesson;
  reason: string;
  priority: number;
  estimatedMinutes: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  xpReward: number;
  type: "vocab" | "lesson" | "streak" | "time";
}

export interface AuthResponse {
  token: string;
  user: PublicUser;
}
