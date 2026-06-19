import { useEffect, useState } from "react";
import { useApp } from "@/store";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { ArrowRight, BookOpen, Headphones, Mic, ScrollText, Sparkles } from "lucide-react";
import { LANGUAGES, LEVELS, SKILLS, getLanguage } from "@/lib/languages";
import type { Course, LanguageCode, Level, Skill } from "@shared/types";
import { cn } from "@/lib/utils";
import { speak } from "@/lib/languages";

export function Library() {
  const user = useApp((s) => s.user);
  const [language, setLanguage] = useState<LanguageCode>(user?.targetLanguage ?? "ja");
  const [level, setLevel] = useState<Level | "all">("all");
  const [skill, setSkill] = useState<Skill | "all">("all");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .listCourses({ language })
      .then((res) => {
        if (!cancelled) setCourses(res);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [language]);

  const filtered = courses.filter((c) => {
    if (level !== "all" && c.level !== level) return false;
    if (skill !== "all" && !c.skills.includes(skill)) return false;
    return true;
  });

  const featured = getLanguage(language);

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">The library</div>
          <h1 className="mt-2 font-display text-4xl font-medium leading-tight text-ink-800 sm:text-5xl">
            {featured.flag} {featured.name}, level by level.
          </h1>
          <p className="mt-3 max-w-2xl text-ink-600">
            Browse courses by language, level, and skill. Each track holds a few units of
            vocab, grammar, shadowing, and listening — designed to build on itself.
          </p>
          <button
            onClick={() => speak(`Let's learn ${featured.name}.`, language)}
            className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-gilt-dark hover:underline"
          >
            <Sparkles className="h-3.5 w-3.5" /> Hear the introduction
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <FilterRow label="Language">
          {LANGUAGES.map((l) => (
            <Chip key={l.code} active={language === l.code} onClick={() => setLanguage(l.code)}>
              <span className="mr-1.5">{l.flag}</span> {l.name}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="Level">
          <Chip active={level === "all"} onClick={() => setLevel("all")}>
            All levels
          </Chip>
          {LEVELS.map((lv) => (
            <Chip key={lv} active={level === lv} onClick={() => setLevel(lv)}>
              {lv}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="Skill">
          <Chip active={skill === "all"} onClick={() => setSkill("all")}>
            All skills
          </Chip>
          {SKILLS.map((sk) => (
            <Chip key={sk.key} active={skill === sk.key} onClick={() => setSkill(sk.key as Skill)}>
              {sk.label}
            </Chip>
          ))}
        </FilterRow>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="atlas-card h-64 animate-pulse bg-vellum/40" />
          ))
        ) : filtered.length === 0 ? (
          <div className="atlas-card col-span-full p-10 text-center text-ink-500">
            No courses match your filters yet.
          </div>
        ) : (
          filtered.map((c) => <CourseCard key={c.id} course={c} />)
        )}
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  const lang = getLanguage(course.language);
  const skillIcons = course.skills.map((s) => {
    if (s === "reading") return BookOpen;
    if (s === "writing") return ScrollText;
    if (s === "listening") return Headphones;
    return Mic;
  });
  return (
    <Link
      to={`/app/library/${course.id}`}
      className="group atlas-card-parchment relative flex flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-parchment"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{lang.flag}</div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-gilt-dark">Level {course.level}</div>
            <div className="font-display text-2xl text-ink-800">{course.title}</div>
          </div>
        </div>
        <ArrowRight className="h-5 w-5 -translate-y-0.5 translate-x-0.5 text-ink-400 transition-transform group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-gilt" />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink-600">{course.summary}</p>
      <div className="mt-5 flex items-center justify-between text-xs text-ink-500">
        <div className="flex items-center gap-2">
          {skillIcons.slice(0, 4).map((Icon, i) => (
            <span
              key={i}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-ink-800/10 bg-vellum text-ink-600"
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
          ))}
        </div>
        <span>{course.units} units · {course.estimatedHours}h</span>
      </div>
    </Link>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.22em] text-ink-500">{label}</div>
      <div className="mt-2 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm transition-all",
        active
          ? "border-ink-800 bg-ink-800 text-vellum"
          : "border-ink-800/15 bg-vellum/70 text-ink-700 hover:border-ink-800/30"
      )}
    >
      {children}
    </button>
  );
}
