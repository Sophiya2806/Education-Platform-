import type {
  User,
  Course,
  Lesson,
  Post,
  Achievement,
  ProgressEntry,
} from "@shared/types";
import { ACHIEVEMENTS, DEMO_USERS, DEMO_POSTS } from "../data/seed";
import { buildCourses } from "../data/courses";

class Store {
  users: User[] = [];
  courses: Course[] = [];
  lessons: Lesson[] = [];
  posts: Post[] = [];
  progress: ProgressEntry[] = [];
  achievements: Achievement[] = [];
  tokens: Map<string, string> = new Map(); // token -> userId

  constructor() {
    this.seed();
  }

  seed() {
    this.users = [...DEMO_USERS];
    const { courses, lessons } = buildCourses();
    this.courses = courses;
    this.lessons = lessons;
    this.posts = [...DEMO_POSTS];
    this.achievements = ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false }));
    this.progress = this.generateDemoProgress();
  }

  generateDemoProgress(): ProgressEntry[] {
    const entries: ProgressEntry[] = [];
    const today = new Date();
    DEMO_USERS.forEach((user) => {
      const course = this.courses.find(
        (c) => c.language === user.targetLanguage && c.level === user.level
      );
      if (!course) return;
      const lessonSample = course.lessonIds.slice(
        0,
        Math.min(6, course.lessonIds.length)
      );
      lessonSample.forEach((lid, idx) => {
        const lesson = this.lessons.find((l) => l.id === lid);
        if (!lesson) return;
        entries.push({
          id: `prog-${user.id}-${lid}`,
          userId: user.id,
          lessonId: lid,
          courseId: course.id,
          skill: lesson.skill,
          accuracy: 0.6 + Math.random() * 0.4,
          timeSpentSec: lesson.estimatedMinutes * 60 * (0.7 + Math.random() * 0.6),
          completedAt: new Date(today.getTime() - idx * 86400000).toISOString(),
        });
      });
    });
    return entries;
  }

  // User helpers
  findUserByEmail(email: string) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string) {
    return this.users.find((u) => u.id === id);
  }

  findUserByUsername(username: string) {
    return this.users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );
  }

  // Token helpers
  createToken(userId: string): string {
    const token = `la_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    this.tokens.set(token, userId);
    return token;
  }

  getUserByToken(token: string | undefined): User | undefined {
    if (!token) return undefined;
    const userId = this.tokens.get(token);
    if (!userId) return undefined;
    return this.findUserById(userId);
  }

  // Course / lesson
  getCourseById(id: string) {
    return this.courses.find((c) => c.id === id);
  }

  getLessonById(id: string) {
    return this.lessons.find((l) => l.id === id);
  }

  // Progress
  recordProgress(entry: ProgressEntry) {
    const existing = this.progress.find(
      (p) => p.userId === entry.userId && p.lessonId === entry.lessonId
    );
    if (existing) {
      Object.assign(existing, entry);
    } else {
      this.progress.push(entry);
    }
  }
}

export const store = new Store();
