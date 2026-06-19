import { Link } from "react-router-dom";
import { useApp } from "@/store";
import { ArrowRight, BookOpen, Compass, Flame, Headphones, Mic, ScrollText, Sparkles, Trophy, Volume2 } from "lucide-react";
import { StatStrip } from "@/components/ui/StatStrip";
import { getLanguage, progressInLevel, LANGUAGES, SKILLS } from "@/lib/languages";
import { Avatar } from "@/components/ui/Avatar";
import { useCountUp, useGreeting } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { speak } from "@/lib/languages";

export function Dashboard() {
  const user = useApp((s) => s.user);
  const progress = useApp((s) => s.progress);
  const quests = useApp((s) => s.quests);
  const recommendations = useApp((s) => s.recommendations);
  const leaderboard = useApp((s) => s.leaderboard);
  const greeting = useGreeting();

  if (!user) return null;
  const target = getLanguage(user.targetLanguage);
  const xp = useCountUp(user.xp, 1200);
  const levelProgress = progressInLevel(xp);
  const skills = progress?.skills;
  const completedToday = quests.find((q) => q.id === "q-lesson")?.current ?? 0;
  const todayQuestDone = completedToday >= 1;

  const focusSkill = skills
    ? (Object.keys(skills) as Array<keyof typeof skills>).reduce((min, k) => (skills[k] < skills[min] ? k : min), "reading" as keyof typeof skills)
    : "reading";

  const nextRec = recommendations[0];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-ink-800/10 bg-vellum shadow-parchment">
        <div className="grid gap-6 p-7 lg:grid-cols-[1.4fr_1fr] lg:p-10">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">{greeting}</div>
            <h1 className="mt-2 font-display text-4xl font-medium leading-tight text-ink-800 sm:text-5xl">
              Welcome back, <span className="italic text-cardinal">{user.username}</span>.
            </h1>
            <p className="mt-3 max-w-xl text-ink-600">
              You're on a {user.streak}-day streak, deep into {target.name}. {todayQuestDone ? "Today's quest is done — explore freely." : "Ready for today's quest?"}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {nextRec ? (
                <Link to={`/app/learn/${nextRec.lesson.id}`} className="pill-button">
                  Continue lesson <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link to="/app/library" className="pill-button">
                  Browse the library <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              <Link to="/app/path" className="pill-button-ghost">
                See your path
              </Link>
            </div>
            <div className="mt-7">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-ink-500">
                <span>Level {levelProgress.level} · {LEVEL_INFO_LABEL(levelProgress.level)}</span>
                {levelProgress.nextLabel && (
                  <span>{levelProgress.toNext} XP to {levelProgress.nextLabel}</span>
                )}
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink-800/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gilt via-cardinal to-lapis transition-all duration-700"
                  style={{ width: `${Math.max(6, levelProgress.percent * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-xl border border-ink-800/10 bg-vellum/60 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-gilt-dark">Today</div>
                  <div className="mt-1 font-display text-2xl text-ink-800">{target.flag} {target.greeting}</div>
                  {target.romanization && (
                    <div className="text-sm text-ink-500 font-mono">{target.romanization}</div>
                  )}
                </div>
                <button
                  onClick={() => speak(target.greeting, target.code)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-800/15 bg-vellum text-ink-700 hover:border-gilt/60 hover:text-gilt-dark"
                  aria-label="Play pronunciation"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <Stat label="Streak" value={`${user.streak}d`} icon={<Flame className="h-4 w-4 text-cardinal" />} />
                <Stat label="XP" value={xp} icon={<Sparkles className="h-4 w-4 text-gilt-dark" />} />
                <Stat label="Hearts" value={user.hearts} icon={<Trophy className="h-4 w-4 text-lapis" />} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <StatStrip />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Daily quests */}
        <div className="atlas-card-parchment p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">Daily quests</div>
              <h2 className="mt-1 font-display text-2xl text-ink-800">A few small wins</h2>
            </div>
            <Link to="/app/path" className="text-sm font-medium text-cardinal hover:underline">
              See path →
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {quests.length === 0 ? (
              <div className="rounded-lg border border-ink-800/10 bg-vellum/60 p-4 text-sm text-ink-500">
                Today's quests will appear after a quick placement test.
              </div>
            ) : (
              quests.map((q) => {
                const pct = Math.min(1, q.current / q.target);
                return (
                  <div key={q.id} className="rounded-lg border border-ink-800/10 bg-vellum/60 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-display text-lg text-ink-800">{q.title}</div>
                        <div className="text-xs text-ink-500">{q.description}</div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-mono text-ink-700">{q.current} / {q.target}</div>
                        <div className="text-[11px] text-gilt-dark">+{q.xpReward} XP</div>
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-800/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-gilt to-cardinal transition-all"
                        style={{ width: `${Math.max(4, pct * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="atlas-card p-6">
          <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">Skill map</div>
          <h2 className="mt-1 font-display text-2xl text-ink-800">Where you're growing</h2>
          <div className="mt-5 space-y-3">
            {SKILLS.map((s) => {
              const v = skills ? Math.round(skills[s.key as keyof typeof skills] * 100) : 0;
              const Icon = s.key === "reading" ? BookOpen : s.key === "writing" ? ScrollText : s.key === "listening" ? Headphones : Mic;
              const focus = s.key === focusSkill;
              return (
                <div key={s.key} className={cn("rounded-lg border p-3", focus ? "border-gilt/40 bg-gilt/5" : "border-ink-800/10 bg-vellum/60")}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-ink-600" />
                      <span className="text-sm font-medium text-ink-800">{s.label}</span>
                      {focus && <span className="rounded-full bg-cardinal/10 px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-cardinal">focus</span>}
                    </div>
                    <span className="text-sm font-mono text-ink-700">{v}%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-800/10">
                    <div
                      className="h-full rounded-full bg-ink-800 transition-all"
                      style={{ width: `${Math.max(4, v)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Recommendations */}
        <div className="atlas-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">Recommended next</div>
              <h2 className="mt-1 font-display text-2xl text-ink-800">A path, refreshed</h2>
            </div>
            <Compass className="h-6 w-6 text-gilt-dark" />
          </div>
          <div className="mt-5 space-y-3">
            {recommendations.slice(0, 3).map((r, i) => (
              <Link
                key={r.lesson.id}
                to={`/app/learn/${r.lesson.id}`}
                className="group flex items-center justify-between rounded-lg border border-ink-800/10 bg-vellum/60 p-4 transition-all hover:-translate-y-0.5 hover:border-gilt/40 hover:shadow-atlas"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gilt/40 bg-gilt/10 text-gilt-dark">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-display text-lg text-ink-800">{r.lesson.title}</div>
                    <div className="text-xs text-ink-500">{r.reason}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-ink-500">
                  <span>{r.lesson.estimatedMinutes} min</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
            {recommendations.length === 0 && (
              <div className="rounded-lg border border-ink-800/10 bg-vellum/60 p-4 text-sm text-ink-500">
                New recommendations will appear after a few lessons.
              </div>
            )}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="atlas-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">Leaderboard</div>
              <h2 className="mt-1 font-display text-2xl text-ink-800">Today's scholars</h2>
            </div>
            <Trophy className="h-6 w-6 text-gilt-dark" />
          </div>
          <div className="mt-5 space-y-2">
            {leaderboard.slice(0, 5).map((entry) => {
              const u = entry.user;
              const isMe = u.id === user.id;
              return (
                <div
                  key={u.id}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-3",
                    isMe ? "border-gilt/50 bg-gilt/5" : "border-ink-800/10 bg-vellum/60"
                  )}
                >
                  <div className="w-6 text-center font-mono text-sm text-ink-500">{entry.rank}</div>
                  <Avatar seed={u.avatarSeed} size={32} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-ink-800">
                      {u.username}{isMe && <span className="ml-1 text-[10px] text-gilt-dark">· you</span>}
                    </div>
                    <div className="truncate text-xs text-ink-500">
                      {u.streak}d streak · {LANGUAGES.find((l) => l.code === u.targetLanguage)?.name}
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-mono text-ink-800">{u.xp.toLocaleString()}</div>
                    <div className="text-[10px] text-ink-500">XP</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function LEVEL_INFO_LABEL(l: string): string {
  return ({
    A1: "Wayfarer",
    A2: "Pathfinder",
    B1: "Chronicler",
    B2: "Cartographer",
    C1: "Polyglot",
  } as Record<string, string>)[l] ?? l;
}

function Stat({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-ink-800/10 bg-vellum p-3">
      <div className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-widest text-ink-500">
        {icon}
        {label}
      </div>
      <div className="mt-1 font-display text-xl text-ink-800">{value}</div>
    </div>
  );
}
