import { useApp } from "@/store";
import { useMemo } from "react";
import { BookOpen, Headphones, Mic, ScrollText } from "lucide-react";
import { SKILLS } from "@/lib/languages";
import { cn } from "@/lib/utils";
import type { SkillStats } from "@shared/types";

export function Progress() {
  const progress = useApp((s) => s.progress);
  const user = useApp((s) => s.user);

  const skills = progress?.skills ?? null;
  const heatmap = progress?.heatmap ?? [];
  const totalMinutes = progress?.totalMinutes ?? 0;
  const totalLessons = progress?.totalLessons ?? 0;
  const averageAccuracy = progress?.averageAccuracy ?? 0;
  const masteredWords = progress?.masteredWords ?? [];

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">Progress</div>
        <h1 className="mt-2 font-display text-4xl font-medium leading-tight text-ink-800 sm:text-5xl">
          The map of your {user?.targetLanguage === "ja" ? "Japanese" : "learning"}.
        </h1>
        <p className="mt-3 max-w-2xl text-ink-600">
          A quiet record of how you've spent your time, and where your growth is loudest.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryStat label="Total minutes" value={totalMinutes.toLocaleString()} />
        <SummaryStat label="Lessons completed" value={totalLessons.toString()} />
        <SummaryStat label="Average accuracy" value={`${Math.round(averageAccuracy * 100)}%`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="atlas-card-parchment p-6">
          <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">Skill radar</div>
          <h2 className="mt-1 font-display text-2xl text-ink-800">Where you shine</h2>
          <div className="mt-4 flex items-center justify-center">
            <Radar skills={skills} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {SKILLS.map((s) => {
              const v = skills ? Math.round(skills[s.key as keyof typeof skills] * 100) : 0;
              return (
                <div key={s.key} className="flex items-center justify-between rounded-lg border border-ink-800/10 bg-vellum/60 p-3">
                  <span className="text-sm text-ink-700">{s.label}</span>
                  <span className="font-mono text-sm text-ink-800">{v}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="atlas-card p-6">
          <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">Study heatmap</div>
          <h2 className="mt-1 font-display text-2xl text-ink-800">Last 12 weeks</h2>
          <div className="mt-4 overflow-x-auto">
            <Heatmap data={heatmap} />
          </div>
        </div>
      </div>

      <div className="atlas-card p-6">
        <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">Mastered lexicon</div>
        <h2 className="mt-1 font-display text-2xl text-ink-800">Words you've claimed</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {masteredWords.length === 0 && (
            <div className="col-span-full rounded-lg border border-ink-800/10 bg-vellum/60 p-4 text-sm text-ink-500">
              Your mastered words will appear here after you complete a few lessons.
            </div>
          )}
          {masteredWords.map((w, i) => (
            <div key={i} className="rounded-lg border border-ink-800/10 bg-vellum/60 p-3">
              <div className="font-display text-lg text-ink-800">{w.word}</div>
              <div className="text-xs text-ink-500">{w.translation}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="atlas-card p-5">
      <div className="text-[10px] uppercase tracking-widest text-ink-500">{label}</div>
      <div className="mt-1 font-display text-3xl text-ink-800">{value}</div>
    </div>
  );
}

function Radar({ skills }: { skills: SkillStats | null }) {
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const r = 100;
  const axes = [
    { key: "reading", label: "Reading", icon: BookOpen },
    { key: "writing", label: "Writing", icon: ScrollText },
    { key: "listening", label: "Listening", icon: Headphones },
    { key: "speaking", label: "Speaking", icon: Mic },
  ];
  const angle = (i: number) => (-Math.PI / 2) + (i * (2 * Math.PI)) / axes.length;
  const point = (i: number, value: number) => {
    const a = angle(i);
    return [cx + Math.cos(a) * r * value, cy + Math.sin(a) * r * value] as const;
  };
  const polygon = axes
    .map((a, i) => point(i, (skills?.[a.key as keyof SkillStats] ?? 0.4)))
    .map(([x, y]) => `${x},${y}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <polygon
          key={g}
          points={axes.map((_, i) => point(i, g).join(",")).join(" ")}
          fill="none"
          stroke="rgba(14,19,32,0.12)"
          strokeWidth="0.8"
        />
      ))}
      {axes.map((a, i) => {
        const [x, y] = point(i, 1);
        return (
          <g key={a.key}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(14,19,32,0.1)" strokeWidth="0.6" />
            <text
              x={cx + Math.cos(angle(i)) * (r + 22)}
              y={cy + Math.sin(angle(i)) * (r + 22) + 4}
              textAnchor="middle"
              fontSize="12"
              fontFamily="Inter Tight"
              fill="#0E1320"
            >
              {a.label}
            </text>
          </g>
        );
      })}
      <polygon
        points={polygon}
        fill="rgba(200, 54, 45, 0.18)"
        stroke="#C8362D"
        strokeWidth="1.5"
      />
      {axes.map((a, i) => {
        const v = skills?.[a.key as keyof SkillStats] ?? 0.4;
        const [x, y] = point(i, v);
        return <circle key={a.key} cx={x} cy={y} r="3.5" fill="#0E1320" />;
      })}
    </svg>
  );
}

function Heatmap({ data }: { data: { date: string; minutes: number }[] }) {
  const weeks = useMemo(() => {
    const arr: { date: string; minutes: number }[][] = [];
    let week: { date: string; minutes: number }[] = [];
    data.forEach((d, i) => {
      week.push(d);
      if (week.length === 7 || i === data.length - 1) {
        arr.push(week);
        week = [];
      }
    });
    return arr;
  }, [data]);
  const max = Math.max(1, ...data.map((d) => d.minutes));

  return (
    <div className="flex gap-1">
      {weeks.map((w, i) => (
        <div key={i} className="flex flex-col gap-1">
          {w.map((d) => {
            const intensity = d.minutes / max;
            const bg =
              d.minutes === 0
                ? "rgba(14,19,32,0.06)"
                : `rgba(200, 162, 74, ${0.18 + intensity * 0.7})`;
            return (
              <div
                key={d.date}
                title={`${d.date} · ${d.minutes} min`}
                className="h-3.5 w-3.5 rounded-sm"
                style={{ background: bg }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
