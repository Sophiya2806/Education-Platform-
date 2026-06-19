import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  seed: string;
  size?: number;
  className?: string;
}

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const PALETTES: [string, string, string][] = [
  ["#1E3A8A", "#C8A24A", "#FBF6E9"],
  ["#C8362D", "#1E3A8A", "#FBF6E9"],
  ["#3B8266", "#C8A24A", "#FBF6E9"],
  ["#0E1320", "#C8362D", "#F4ECDA"],
  ["#A8552F", "#1E3A8A", "#FBF6E9"],
  ["#1E3A8A", "#3B8266", "#FBF6E9"],
];

export function Avatar({ seed, size = 40, className }: AvatarProps) {
  const { initials, palette, pattern } = useMemo(() => {
    const h = hashSeed(seed);
    const palette = PALETTES[h % PALETTES.length];
    const initials = seed
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 2)
      .toUpperCase() || "AT";
    const pattern = h % 4;
    return { initials, palette, pattern };
  }, [seed]);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center overflow-hidden rounded-full border border-ink-800/10", className)}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${palette[0]} 0%, ${palette[1]} 100%)`,
      }}
    >
      <svg
        viewBox="0 0 40 40"
        width={size}
        height={size}
        className="absolute inset-0 opacity-50"
      >
        {pattern === 0 && (
          <>
            <circle cx="20" cy="20" r="14" stroke={palette[2]} strokeWidth="0.6" fill="none" />
            <path d="M6 20 H34" stroke={palette[2]} strokeWidth="0.6" />
            <path d="M20 6 V34" stroke={palette[2]} strokeWidth="0.6" />
          </>
        )}
        {pattern === 1 && (
          <>
            <path d="M0 30 Q10 18 20 24 T40 18" stroke={palette[2]} strokeWidth="0.8" fill="none" />
            <path d="M0 36 Q10 24 20 30 T40 24" stroke={palette[2]} strokeWidth="0.8" fill="none" />
          </>
        )}
        {pattern === 2 && (
          <>
            <path d="M0 20 L20 4 L40 20 L20 36 Z" stroke={palette[2]} strokeWidth="0.6" fill="none" />
            <path d="M10 20 L20 12 L30 20 L20 28 Z" stroke={palette[2]} strokeWidth="0.6" fill="none" />
          </>
        )}
        {pattern === 3 && (
          <>
            <circle cx="14" cy="14" r="3" fill={palette[2]} fillOpacity="0.3" />
            <circle cx="28" cy="22" r="2" fill={palette[2]} fillOpacity="0.3" />
            <circle cx="18" cy="30" r="2" fill={palette[2]} fillOpacity="0.3" />
          </>
        )}
      </svg>
      <span
        className="relative font-display text-base font-semibold tracking-wide"
        style={{ color: palette[2], fontSize: size * 0.34 }}
      >
        {initials}
      </span>
    </div>
  );
}
