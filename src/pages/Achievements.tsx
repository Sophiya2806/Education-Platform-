import { useApp } from "@/store";
import { BookOpen, Crown, Flame, Footprints, Globe, Headphones, Library, Mic, Sparkles, Trophy } from "lucide-react";
import type { ComponentType } from "react";

const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  Footprints,
  Flame,
  BookOpen,
  Globe,
  Library,
  Crown,
  Mic,
  Headphones,
  Sparkles,
  Trophy,
  Compass: Sparkles,
};

const RARITY_STYLE: Record<string, { border: string; bg: string; chip: string; label: string }> = {
  common: { border: "border-ink-800/15", bg: "bg-vellum/70", chip: "bg-ink-800/5 text-ink-700", label: "Common" },
  rare: { border: "border-lapis/40", bg: "bg-lapis/5", chip: "bg-lapis/10 text-lapis-dark", label: "Rare" },
  epic: { border: "border-cardinal/40", bg: "bg-cardinal/5", chip: "bg-cardinal/10 text-cardinal-dark", label: "Epic" },
  legendary: { border: "border-gilt/60", bg: "bg-gilt/10", chip: "bg-gilt/20 text-gilt-dark", label: "Legendary" },
};

export function Achievements() {
  const achievements = useApp((s) => s.achievements);
  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">Achievements</div>
        <h1 className="mt-2 font-display text-4xl font-medium leading-tight text-ink-800 sm:text-5xl">
          {unlocked.length} of {achievements.length} unlocked.
        </h1>
        <p className="mt-3 max-w-2xl text-ink-600">
          Small badges for the things you do consistently. They are not grades — they are
          mementos.
        </p>
      </div>

      {unlocked.length > 0 && (
        <div>
          <div className="mb-3 text-xs uppercase tracking-[0.22em] text-ink-500">Unlocked</div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {unlocked.map((a) => (
              <AchievementCard key={a.id} achievement={a} />
            ))}
          </div>
        </div>
      )}

      {locked.length > 0 && (
        <div>
          <div className="mb-3 text-xs uppercase tracking-[0.22em] text-ink-500">Yet to claim</div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {locked.map((a) => (
              <AchievementCard key={a.id} achievement={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AchievementCard({ achievement }: { achievement: ReturnType<typeof useApp.getState>["achievements"][number] }) {
  const Icon = ICON_MAP[achievement.icon] ?? Sparkles;
  const style = RARITY_STYLE[achievement.rarity];
  return (
    <div
      className={`atlas-card relative overflow-hidden p-5 ${achievement.unlocked ? `${style.border} ${style.bg}` : "border-ink-800/10 bg-vellum/40"}`}
    >
      {!achievement.unlocked && (
        <div className="absolute inset-0 grid place-items-center bg-vellum/30 backdrop-blur-[1px]">
          <span className="text-[10px] uppercase tracking-widest text-ink-400">Locked</span>
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full border ${style.border} ${style.bg}`}>
          <Icon className="h-5 w-5 text-ink-800" />
        </div>
        <div>
          <div className="font-display text-xl text-ink-800">{achievement.name}</div>
          <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest ${style.chip}`}>
            {style.label}
          </span>
        </div>
      </div>
      <p className="mt-3 text-sm text-ink-600">{achievement.description}</p>
      <div className="mt-3 text-xs text-gilt-dark">+{achievement.xpReward} XP</div>
    </div>
  );
}
