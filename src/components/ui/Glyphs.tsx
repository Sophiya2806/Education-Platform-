import { cn } from "@/lib/utils";

interface CompassProps {
  size?: number;
  className?: string;
  spinning?: boolean;
  color?: string;
}

export function Compass({ size = 64, className, spinning, color = "#0E1320" }: CompassProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(spinning && "animate-compass-spin", className)}
    >
      <circle cx="32" cy="32" r="30" stroke={color} strokeOpacity="0.18" strokeWidth="1" />
      <circle cx="32" cy="32" r="22" stroke={color} strokeOpacity="0.12" strokeWidth="1" />
      <path d="M32 6 L36 32 L32 58 L28 32 Z" fill={color} fillOpacity="0.08" />
      <path d="M32 6 L36 32 L32 32 Z" fill="#C8362D" />
      <path d="M32 6 L28 32 L32 32 Z" fill="#C8A24A" />
      <path d="M32 58 L36 32 L32 32 Z" fill="#1E3A8A" />
      <text x="32" y="11" textAnchor="middle" fontSize="6" fontFamily="Cormorant Garamond" fontWeight={600} fill={color}>
        N
      </text>
      <text x="32" y="58" textAnchor="middle" fontSize="5" fontFamily="Cormorant Garamond" fill={color} fillOpacity="0.4">
        S
      </text>
      <text x="58" y="33" textAnchor="middle" fontSize="5" fontFamily="Cormorant Garamond" fill={color} fillOpacity="0.4">
        E
      </text>
      <text x="6" y="33" textAnchor="middle" fontSize="5" fontFamily="Cormorant Garamond" fill={color} fillOpacity="0.4">
        W
      </text>
      <circle cx="32" cy="32" r="1.5" fill={color} />
    </svg>
  );
}

export function MapPin({ size = 18, color = "#C8A24A" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2 C7.6 2 4 5.6 4 10 C4 16 12 22 12 22 C12 22 20 16 20 10 C20 5.6 16.4 2 12 2 Z"
        stroke={color}
        strokeWidth="1.5"
        fill={color}
        fillOpacity="0.08"
      />
      <circle cx="12" cy="10" r="2.4" fill={color} />
    </svg>
  );
}

export function Globe({ size = 22, color = "#0E1320" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="1.2" />
      <ellipse cx="12" cy="12" rx="4" ry="9.5" stroke={color} strokeWidth="1" />
      <path d="M3 12 H21" stroke={color} strokeWidth="1" />
      <path d="M5 7 H19" stroke={color} strokeWidth="0.7" strokeOpacity="0.5" />
      <path d="M5 17 H19" stroke={color} strokeWidth="0.7" strokeOpacity="0.5" />
    </svg>
  );
}

export function Flame({ size = 22, color = "#C8362D" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2 C12 6 16 7 16 12 C16 15.5 14 18 12 18 C10 18 8 15.5 8 12 C8 9 10 8 10 5 C11 6 12 5 12 2 Z"
        fill={color}
        fillOpacity="0.15"
        stroke={color}
        strokeWidth="1.2"
      />
      <path
        d="M12 9 C12 11 13.5 11.5 13.5 14 C13.5 15.5 12.8 16.5 12 16.5 C11.2 16.5 10.5 15.5 10.5 14 C10.5 12.2 12 12 12 9 Z"
        fill={color}
      />
    </svg>
  );
}

export function Waveform({ active, height = 32 }: { active: boolean; height?: number }) {
  const bars = Array.from({ length: 28 }, (_, i) => i);
  return (
    <div className="flex h-8 items-center gap-1" style={{ height }}>
      {bars.map((i) => (
        <span
          key={i}
          className={cn("w-1 origin-center rounded-full bg-ink-800/80", active && "animate-wave-pulse")}
          style={{
            height: 8 + ((i * 7) % 22),
            animationDelay: `${i * 60}ms`,
            opacity: active ? 1 : 0.4,
          }}
        />
      ))}
    </div>
  );
}
