import { useApp } from "@/store";
import { Flame, Heart, Sparkles, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatStrip() {
  const user = useApp((s) => s.user);
  if (!user) return null;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Stat icon={<Flame size={20} color="#C8362D" />} label="Streak" value={`${user.streak}d`} accent="cardinal" />
      <Stat icon={<Sparkles size={20} color="#C8A24A" />} label="Total XP" value={user.xp.toLocaleString()} accent="gilt" />
      <Stat icon={<Trophy size={20} color="#1E3A8A" />} label="Level" value={user.level} accent="lapis" />
      <Stat icon={<Heart size={20} color="#C8362D" />} label="Hearts" value={user.hearts} accent="cardinal" />
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent: "cardinal" | "gilt" | "lapis" | "verdigris";
}) {
  return (
    <div className={cn("atlas-card flex items-center gap-3 px-4 py-3")}>
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border",
          accent === "cardinal" && "border-cardinal/30 bg-cardinal/10",
          accent === "gilt" && "border-gilt/30 bg-gilt/10",
          accent === "lapis" && "border-lapis/30 bg-lapis/10",
          accent === "verdigris" && "border-verdigris/30 bg-verdigris/10"
        )}
      >
        {icon}
      </div>
      <div>
        <div className="text-xs uppercase tracking-[0.18em] text-ink-500">{label}</div>
        <div className="font-display text-2xl font-semibold leading-none text-ink-800">{value}</div>
      </div>
    </div>
  );
}
