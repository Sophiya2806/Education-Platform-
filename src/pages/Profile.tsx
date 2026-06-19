import { useApp } from "@/store";
import { Avatar } from "@/components/ui/Avatar";
import { LANGUAGES, SKILLS, getLanguage, progressInLevel } from "@/lib/languages";
import { Calendar, Flame, Sparkles, Trophy } from "lucide-react";

export function Profile() {
  const user = useApp((s) => s.user);
  const progress = useApp((s) => s.progress);
  if (!user) return null;
  const target = getLanguage(user.targetLanguage);
  const native = getLanguage(user.nativeLanguage);
  const levelInfo = progressInLevel(user.xp);

  return (
    <div className="space-y-8">
      <div className="atlas-card-parchment relative overflow-hidden p-8">
        <div className="absolute -right-10 -top-10 opacity-10">
          <svg width="240" height="240" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="#0E1320" strokeWidth="0.4" />
            <circle cx="50" cy="50" r="34" fill="none" stroke="#0E1320" strokeWidth="0.4" />
            <path d="M2 50 H98 M50 2 V98" stroke="#0E1320" strokeWidth="0.3" />
            <text x="50" y="6" textAnchor="middle" fontSize="5" fontFamily="Cormorant Garamond" fill="#0E1320">N</text>
            <text x="50" y="98" textAnchor="middle" fontSize="5" fontFamily="Cormorant Garamond" fill="#0E1320">S</text>
            <text x="98" y="51" textAnchor="middle" fontSize="5" fontFamily="Cormorant Garamond" fill="#0E1320">E</text>
            <text x="2" y="51" textAnchor="middle" fontSize="5" fontFamily="Cormorant Garamond" fill="#0E1320">W</text>
          </svg>
        </div>
        <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center">
          <Avatar seed={user.avatarSeed} size={112} />
          <div className="flex-1">
            <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">Field scholar</div>
            <h1 className="mt-1 font-display text-4xl text-ink-800">{user.username}</h1>
            <p className="mt-2 max-w-xl text-sm text-ink-600">
              {user.bio || "Mapping new languages, one careful step at a time."}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink-500">
              <span className="rounded-full border border-ink-800/15 bg-vellum/60 px-2.5 py-1">
                🌍 {native.flag} {native.name} → {target.flag} {target.name}
              </span>
              <span className="rounded-full border border-ink-800/15 bg-vellum/60 px-2.5 py-1">
                <Calendar className="mr-1 inline h-3 w-3" /> Joined {new Date(user.joinedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            <Stat icon={<Flame className="h-4 w-4 text-cardinal" />} label="Streak" value={`${user.streak}d`} />
            <Stat icon={<Sparkles className="h-4 w-4 text-gilt-dark" />} label="XP" value={user.xp.toLocaleString()} />
            <Stat icon={<Trophy className="h-4 w-4 text-lapis" />} label="Level" value={user.level} />
            <Stat icon={<Trophy className="h-4 w-4 text-gilt-dark" />} label="Achievements" value={user.unlockedAchievementIds.length.toString()} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="atlas-card p-6">
          <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">Progress through the atlas</div>
          <h2 className="mt-1 font-display text-2xl text-ink-800">Level {levelInfo.level} · {LEVEL_LABEL(levelInfo.level)}</h2>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink-800/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gilt via-cardinal to-lapis"
              style={{ width: `${Math.max(6, levelInfo.percent * 100)}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-ink-500">
            {levelInfo.nextLabel
              ? `${levelInfo.toNext} XP to ${levelInfo.nextLabel}`
              : "Polyglot rank achieved. Keep going."}
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {SKILLS.map((s) => {
              const v = progress?.skills?.[s.key as keyof typeof progress.skills] ?? 0;
              return (
                <div key={s.key} className="rounded-lg border border-ink-800/10 bg-vellum/60 p-3">
                  <div className="text-xs uppercase tracking-widest text-ink-500">{s.label}</div>
                  <div className="mt-1 font-display text-2xl text-ink-800">{Math.round(v * 100)}%</div>
                  <div className="text-[11px] text-ink-500">{s.description}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="atlas-card p-6">
          <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">Atlas in your pack</div>
          <h2 className="mt-1 font-display text-2xl text-ink-800">Languages</h2>
          <div className="mt-4 space-y-2">
            {[user.targetLanguage, user.nativeLanguage].map((code) => {
              const l = LANGUAGES.find((x) => x.code === code)!;
              return (
                <div key={code} className="flex items-center gap-3 rounded-lg border border-ink-800/10 bg-vellum/60 p-3">
                  <div className="text-2xl">{l.flag}</div>
                  <div className="flex-1">
                    <div className="font-display text-lg text-ink-800">{l.nativeName}</div>
                    <div className="text-xs text-ink-500">{l.family} · {l.greeting}</div>
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

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink-800/10 bg-vellum p-3">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-ink-500">
        {icon} {label}
      </div>
      <div className="mt-1 font-display text-xl text-ink-800">{value}</div>
    </div>
  );
}

function LEVEL_LABEL(l: string) {
  return ({ A1: "Wayfarer", A2: "Pathfinder", B1: "Chronicler", B2: "Cartographer", C1: "Polyglot" } as Record<string, string>)[l] ?? l;
}
