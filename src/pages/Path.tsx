import { Link } from "react-router-dom";
import { useApp } from "@/store";
import { ArrowRight, BookOpen, Headphones, Mic, ScrollText, Sparkles } from "lucide-react";
import type { Skill } from "@shared/types";

const SKILL_LABEL: Record<Skill, string> = {
  reading: "Vocabulary",
  writing: "Grammar",
  listening: "Listening",
  speaking: "Shadowing",
};

const SKILL_ICON: Record<Skill, any> = {
  reading: BookOpen,
  writing: ScrollText,
  listening: Headphones,
  speaking: Mic,
};

export function PathPage() {
  const recs = useApp((s) => s.recommendations);
  const user = useApp((s) => s.user);
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">Your path</div>
          <h1 className="mt-2 font-display text-4xl font-medium leading-tight text-ink-800 sm:text-5xl">
            A personalized route, refreshed.
          </h1>
          <p className="mt-3 max-w-2xl text-ink-600">
            We watch where you hesitate, where you soar, and quietly re-order the chapters. Pick
            one and begin; the rest will follow.
          </p>
        </div>
        <div className="atlas-card flex items-center gap-3 px-4 py-3">
          <Sparkles className="h-5 w-5 text-gilt-dark" />
          <div>
            <div className="text-[10px] uppercase tracking-widest text-ink-500">Re-ranked</div>
            <div className="text-sm text-ink-800">After your last 7 days</div>
          </div>
        </div>
      </div>

      <ol className="relative space-y-4 border-l-2 border-gilt/30 pl-6">
        {recs.length === 0 && (
          <div className="atlas-card p-6 text-ink-500">
            Recommendations will appear after a few completed lessons.
          </div>
        )}
        {recs.map((r, i) => {
          const Icon = SKILL_ICON[r.lesson.skill];
          return (
            <li key={r.lesson.id} className="relative">
              <span className="absolute -left-[33px] flex h-7 w-7 items-center justify-center rounded-full border-2 border-gilt bg-vellum text-xs font-mono font-semibold text-gilt-dark">
                {i + 1}
              </span>
              <Link
                to={`/app/learn/${r.lesson.id}`}
                className="atlas-card-parchment group block p-5 transition-all hover:-translate-y-0.5 hover:shadow-parchment"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-800/10 bg-vellum text-ink-700">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-gilt-dark">
                        {SKILL_LABEL[r.lesson.skill]} · Level {r.lesson.level}
                      </div>
                      <div className="font-display text-xl text-ink-800">{r.lesson.title}</div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-ink-400 transition-transform group-hover:translate-x-0.5 group-hover:text-gilt" />
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <PathStat label="Why now" value={r.reason} />
                  <PathStat label="Time" value={`${r.estimatedMinutes} min`} />
                  <PathStat label="Reward" value={`+${r.lesson.xpReward} XP`} />
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function PathStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink-800/10 bg-vellum/60 p-3">
      <div className="text-[10px] uppercase tracking-widest text-ink-500">{label}</div>
      <div className="mt-1 text-sm text-ink-800">{value}</div>
    </div>
  );
}
