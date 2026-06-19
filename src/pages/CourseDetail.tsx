import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { useApp } from "@/store";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Headphones, Mic, ScrollText } from "lucide-react";
import type { Course, Lesson, LessonItem } from "@shared/types";
import { getLanguage, speak, langBcp47 } from "@/lib/languages";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";

export function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    api
      .courseDetail(courseId)
      .then((res) => {
        setCourse(res.course);
        setLessons(res.lessons);
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) {
    return <div className="atlas-card h-64 animate-pulse bg-vellum/40" />;
  }
  if (!course) {
    return (
      <div className="atlas-card p-10 text-center text-ink-500">Course not found.</div>
    );
  }
  const lang = getLanguage(course.language);
  const units = groupByUnit(lessons);

  return (
    <div className="space-y-6">
      <Link to="/app/library" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-800">
        <ArrowLeft className="h-4 w-4" /> Back to library
      </Link>
      <div className="atlas-card-parchment relative overflow-hidden p-7 lg:p-10">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">{lang.flag} {lang.name} · Level {course.level}</div>
            <h1 className="mt-2 font-display text-4xl font-medium leading-tight text-ink-800 sm:text-5xl">
              {course.title}
            </h1>
            <p className="mt-3 max-w-xl text-ink-600">{course.summary}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-ink-500">
              <span>{course.units} units</span>
              <span>·</span>
              <span>{course.estimatedHours} hours</span>
              <span>·</span>
              <span>{lessons.length} lessons</span>
            </div>
          </div>
          <div className="rounded-xl border border-ink-800/10 bg-vellum/60 p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">Course map</div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] text-ink-500">
              {course.skills.map((s) => {
                const Icon = s === "reading" ? BookOpen : s === "writing" ? ScrollText : s === "listening" ? Headphones : Mic;
                return (
                  <div key={s} className="rounded-lg border border-ink-800/10 bg-vellum p-3">
                    <Icon className="mx-auto h-4 w-4 text-ink-600" />
                    <div className="mt-1 capitalize">{s}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {units.map((unit) => (
          <div key={unit.unit} className="atlas-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-gilt-dark">Unit {unit.unit}</div>
                <h2 className="mt-1 font-display text-2xl text-ink-800">Chapter {unit.unit}</h2>
              </div>
              <span className="text-xs text-ink-500">{unit.lessons.length} lessons</span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {unit.lessons.map((lesson) => {
                const Icon = skillIcon(lesson.skill);
                return (
                  <Link
                    key={lesson.id}
                    to={`/app/learn/${lesson.id}`}
                    className="group flex items-center justify-between rounded-lg border border-ink-800/10 bg-vellum/60 p-3 transition-all hover:-translate-y-0.5 hover:border-gilt/40 hover:shadow-atlas"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-800/10 bg-vellum text-ink-700">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <div className="text-sm font-medium text-ink-800">{lesson.title}</div>
                        <div className="text-[11px] text-ink-500 capitalize">{lesson.skill} · {lesson.estimatedMinutes} min · {lesson.xpReward} XP</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 -translate-y-0.5 translate-x-0.5 text-ink-400 transition-transform group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-gilt" />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function groupByUnit(lessons: Lesson[]): { unit: number; lessons: Lesson[] }[] {
  const map = new Map<number, Lesson[]>();
  lessons.forEach((l) => {
    if (!map.has(l.unit)) map.set(l.unit, []);
    map.get(l.unit)!.push(l);
  });
  return Array.from(map.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([unit, ls]) => ({ unit, lessons: ls }));
}

function skillIcon(s: string) {
  if (s === "reading") return BookOpen;
  if (s === "writing") return ScrollText;
  if (s === "listening") return Headphones;
  return Mic;
}
