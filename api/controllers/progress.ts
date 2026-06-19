import type { Request, Response } from "express";
import { store } from "../store";
import { levelFromXp } from "../data/languages";
import type { Achievement, DailyStat, ProgressEntry, ProgressSummary, Skill, SkillStats, User } from "@shared/types";

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function computeHeatmap(userId: string): DailyStat[] {
  const out: Map<string, DailyStat> = new Map();
  const today = new Date();
  for (let i = 0; i < 84; i++) {
    const d = new Date(today.getTime() - i * 86400000);
    out.set(dateKey(d), { date: dateKey(d), minutes: 0, lessons: 0, accuracy: 0 });
  }
  store.progress
    .filter((p) => p.userId === userId)
    .forEach((p) => {
      const k = dateKey(new Date(p.completedAt));
      const entry = out.get(k);
      if (entry) {
        entry.minutes += Math.round(p.timeSpentSec / 60);
        entry.lessons += 1;
        entry.accuracy = (entry.accuracy + p.accuracy) / 2 || p.accuracy;
      }
    });
  return Array.from(out.values()).reverse();
}

function computeSkillStats(userId: string): SkillStats {
  const acc: Record<Skill, number[]> = { reading: [], writing: [], listening: [], speaking: [] };
  store.progress.filter((p) => p.userId === userId).forEach((p) => {
    if (acc[p.skill]) acc[p.skill].push(p.accuracy);
  });
  return {
    reading: avg(acc.reading),
    writing: avg(acc.writing),
    listening: avg(acc.listening),
    speaking: avg(acc.speaking),
  };
}

function avg(arr: number[]): number {
  if (!arr.length) return 0.4;
  const v = arr.reduce((a, b) => a + b, 0) / arr.length;
  return Math.max(0, Math.min(1, v));
}

function buildMasteredWords(userId: string) {
  const user = store.findUserById(userId);
  if (!user) return [];
  const lang = user.targetLanguage;
  // Pull vocab items from completed lessons in the user's target language.
  const completed = new Set(
    store.progress.filter((p) => p.userId === userId).map((p) => p.lessonId)
  );
  const items: { word: string; translation: string; language: typeof lang }[] = [];
  store.lessons
    .filter((l) => l.language === lang && completed.has(l.id))
    .forEach((l) => {
      l.items.forEach((it) => {
        if (it.type === "vocab") items.push({ word: it.prompt, translation: it.translation, language: lang });
        if (it.type === "shadow") items.push({ word: it.prompt, translation: it.translation, language: lang });
      });
    });
  return items.slice(0, 24);
}

function maybeUnlock(user: User, lesson: any, accuracy: number): Achievement[] {
  const newlyUnlocked: Achievement[] = [];
  const totalLessons = store.progress.filter((p) => p.userId === user.id).length + 1;

  function unlock(id: string) {
    if (!user.unlockedAchievementIds.includes(id)) {
      user.unlockedAchievementIds.push(id);
      const ach = store.achievements.find((a) => a.id === id);
      if (ach) newlyUnlocked.push({ ...ach, unlocked: true, unlockedAt: new Date().toISOString() });
    }
  }

  if (totalLessons === 1) unlock("first-steps");
  if (user.streak >= 7) unlock("week-warrior");
  if (user.streak >= 30) unlock("month-scholar");
  if (accuracy === 1 && lesson.skill === "writing") unlock("grammar-gem");
  if (lesson.skill === "listening") {
    const listened = store.progress.filter((p) => p.userId === user.id && p.skill === "listening").length;
    if (listened >= 10) unlock("ear-tuned");
  }
  if (user.unlockedAchievementIds.length >= 3) unlock("path-pioneer");
  return newlyUnlocked;
}

export const ProgressController = {
  summary(req: Request, res: Response) {
    const user = store.findUserById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, error: "User not found." });
    const skillStats = computeSkillStats(user.id);
    const heatmap = computeHeatmap(user.id);
    const masteredWords = buildMasteredWords(user.id);
    const entries = store.progress.filter((p) => p.userId === user.id);
    const totalMinutes = entries.reduce((sum, e) => sum + e.timeSpentSec, 0) / 60;
    const totalLessons = entries.length;
    const averageAccuracy = entries.length
      ? entries.reduce((s, e) => s + e.accuracy, 0) / entries.length
      : 0;
    const summary: ProgressSummary = {
      userId: user.id,
      skills: skillStats,
      heatmap,
      masteredWords,
      totalMinutes: Math.round(totalMinutes),
      totalLessons,
      averageAccuracy,
    };
    return res.json({ success: true, data: summary });
  },

  submit(req: Request, res: Response) {
    const user = store.getUserByToken(req.headers.authorization?.replace("Bearer ", ""));
    if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
    const { lessonId, accuracy, timeSpentSec, skill } = req.body || {};
    const lesson = store.getLessonById(lessonId);
    if (!lesson) return res.status(404).json({ success: false, error: "Lesson not found." });

    const entry: ProgressEntry = {
      id: `prog-${user.id}-${lessonId}-${Date.now()}`,
      userId: user.id,
      lessonId,
      courseId: lesson.courseId,
      skill: skill || lesson.skill,
      accuracy: Math.max(0, Math.min(1, Number(accuracy) || 0)),
      timeSpentSec: Math.max(0, Number(timeSpentSec) || 0),
      completedAt: new Date().toISOString(),
    };
    store.recordProgress(entry);

    const xpEarned = Math.round(lesson.xpReward * (0.5 + 0.5 * entry.accuracy));
    user.xp += xpEarned;
    user.level = levelFromXp(user.xp) as any;
    user.hearts = Math.min(5, user.hearts + (entry.accuracy > 0.8 ? 1 : 0));

    const today = new Date();
    const last = new Date(user.lastStudyDate);
    const sameDay = today.toDateString() === last.toDateString();
    if (!sameDay) {
      const yesterday = new Date(today.getTime() - 86400000);
      if (last.toDateString() === yesterday.toDateString()) {
        user.streak += 1;
      } else {
        user.streak = 1;
      }
    }
    user.lastStudyDate = today.toISOString();

    const newAchievements = maybeUnlock(user, lesson, entry.accuracy);

    return res.json({
      success: true,
      data: {
        progress: entry,
        xpEarned,
        user: { xp: user.xp, level: user.level, streak: user.streak, hearts: user.hearts },
        newAchievements,
      },
    });
  },
};
