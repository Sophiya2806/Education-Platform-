import type { Request, Response } from "express";
import { store } from "../store";
import type { Course, Lesson, LanguageCode, Level, Recommendation, Skill, PublicUser, User } from "@shared/types";
import { levelFromXp } from "../data/languages";

function toPublic(user: User): PublicUser {
  const { password: _password, email, ...rest } = user;
  return { ...rest, email };
}

export const CourseController = {
  list(req: Request, res: Response) {
    const { language, level } = req.query;
    let courses: Course[] = store.courses;
    if (language) courses = courses.filter((c) => c.language === language);
    if (level) courses = courses.filter((c) => c.level === level);
    return res.json({ success: true, data: courses });
  },

  detail(req: Request, res: Response) {
    const course = store.getCourseById(req.params.id);
    if (!course) return res.status(404).json({ success: false, error: "Course not found." });
    const lessons: Lesson[] = course.lessonIds
      .map((id) => store.getLessonById(id))
      .filter((l): l is Lesson => Boolean(l));
    return res.json({ success: true, data: { course, lessons } });
  },

  lesson(req: Request, res: Response) {
    const lesson = store.getLessonById(req.params.id);
    if (!lesson) return res.status(404).json({ success: false, error: "Lesson not found." });
    return res.json({ success: true, data: lesson });
  },

  recommendations(req: Request, res: Response) {
    const user = store.findUserById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, error: "User not found." });

    const completedIds = new Set(
      store.progress.filter((p) => p.userId === user.id).map((p) => p.lessonId)
    );

    const skillAcc: Record<Skill, number[]> = {
      reading: [],
      writing: [],
      listening: [],
      speaking: [],
    };
    store.progress
      .filter((p) => p.userId === user.id)
      .forEach((p) => {
        if (skillAcc[p.skill]) skillAcc[p.skill].push(p.accuracy);
      });
    const skillAvg: Record<Skill, number> = {
      reading: avg(skillAcc.reading),
      writing: avg(skillAcc.writing),
      listening: avg(skillAcc.listening),
      speaking: avg(skillAcc.speaking),
    };
    const weakestSkill: Skill = (Object.keys(skillAvg) as Skill[]).reduce((min, k) =>
      skillAvg[k] < skillAvg[min] ? k : min
    , "reading");

    const userLevel = levelFromXp(user.xp) as Level;
    const eligible = store.lessons.filter(
      (l) =>
        l.language === user.targetLanguage &&
        (l.level === userLevel || l.level === previousLevel(userLevel) || l.level === nextLevel(userLevel))
    );

    const candidates = eligible
      .filter((l) => !completedIds.has(l.id))
      .slice(0, 8);

    const recs: Recommendation[] = candidates.map((lesson, i) => {
      const reason = reasonFor(lesson, weakestSkill, skillAvg, user);
      return {
        lesson,
        reason,
        priority: i + 1,
        estimatedMinutes: lesson.estimatedMinutes,
      };
    });

    return res.json({ success: true, data: recs });
  },
};

function avg(arr: number[]): number {
  if (!arr.length) return 0.6;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function previousLevel(l: Level): Level | null {
  const order: Level[] = ["A1", "A2", "B1", "B2", "C1"];
  const idx = order.indexOf(l);
  return idx > 0 ? order[idx - 1] : null;
}

function nextLevel(l: Level): Level | null {
  const order: Level[] = ["A1", "A2", "B1", "B2", "C1"];
  const idx = order.indexOf(l);
  return idx < order.length - 1 ? order[idx + 1] : null;
}

function reasonFor(lesson: Lesson, weakest: Skill, stats: Record<Skill, number>, user: User): string {
  const skillGap = stats[weakest] < 0.7;
  if (lesson.skill === weakest && skillGap) {
    return `Targets your weakest skill (${weakest}) — current accuracy ${(stats[weakest] * 100).toFixed(0)}%.`;
  }
  if (lesson.level === "A1" && user.xp > 600) {
    return "A confidence-builder to round out your foundation.";
  }
  if (lesson.skill === "speaking" && stats.speaking < 0.75) {
    return "Speaking drills accelerate fluency faster than passive review.";
  }
  if (lesson.skill === "writing") {
    return "Writing reinforces grammar more than any other skill.";
  }
  return "Aligned with your current level and recent study pattern.";
}

export const UserController = {
  publicProfile(req: Request, res: Response) {
    const user = store.findUserById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: "User not found." });
    return res.json({ success: true, data: toPublic(user) });
  },
};
