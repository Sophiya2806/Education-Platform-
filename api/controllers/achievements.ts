import type { Request, Response } from "express";
import { store } from "../store";

export const AchievementController = {
  list(req: Request, res: Response) {
    const user = store.getUserByToken(req.headers.authorization?.replace("Bearer ", ""));
    if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
    const items = store.achievements.map((a) => ({
      ...a,
      unlocked: user.unlockedAchievementIds.includes(a.id),
    }));
    return res.json({ success: true, data: items });
  },

  quests(req: Request, res: Response) {
    const user = store.getUserByToken(req.headers.authorization?.replace("Bearer ", ""));
    if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
    const today = new Date().toDateString();
    const last = new Date(user.lastStudyDate).toDateString();
    const studiedToday = today === last;
    const todayEntries = store.progress.filter(
      (p) => p.userId === user.id && new Date(p.completedAt).toDateString() === today
    );
    const minutesToday = Math.round(
      todayEntries.reduce((s, e) => s + e.timeSpentSec, 0) / 60
    );
    const quests = [
      {
        id: "q-lesson",
        title: "Finish 1 lesson",
        description: "Complete a vocabulary or grammar lesson.",
        current: Math.min(1, todayEntries.length),
        target: 1,
        xpReward: 25,
        type: "lesson" as const,
      },
      {
        id: "q-vocab",
        title: "Review 10 words",
        description: "Tap through a flashcard session.",
        current: Math.min(10, todayEntries.length * 4),
        target: 10,
        xpReward: 20,
        type: "vocab" as const,
      },
      {
        id: "q-streak",
        title: studiedToday ? "Streak alive" : "Open the app today",
        description: "Keep your streak burning.",
        current: studiedToday ? 1 : 0,
        target: 1,
        xpReward: 15,
        type: "streak" as const,
      },
    ];
    return res.json({ success: true, data: quests });
  },
};
