import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/store";
import { CheckCircle2, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ToastContainer() {
  const toasts = useApp((s) => s.toasts);
  const dismiss = useApp((s) => s.dismissToast);
  return (
    <div className="pointer-events-none fixed top-6 right-6 z-50 flex w-[360px] flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto atlas-card-parchment animate-toast-in flex items-start gap-3 p-4",
            t.variant === "achievement" && "border-gilt/60 shadow-gilt"
          )}
        >
          <div className="mt-0.5">
            {t.variant === "achievement" ? (
              <Sparkles className="h-5 w-5 text-gilt" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-verdigris" />
            )}
          </div>
          <div className="flex-1">
            <div className="font-display text-lg leading-tight text-ink-800">{t.title}</div>
            {t.description && (
              <div className="mt-0.5 text-sm text-ink-600">{t.description}</div>
            )}
          </div>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            className="rounded-md p-1 text-ink-400 hover:bg-ink-800/5 hover:text-ink-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    function tick(now: number) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

export function useHasMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export function useGreeting(): string {
  return useMemo(() => {
    const h = new Date().getHours();
    if (h < 5) return "Burning the midnight oil";
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    if (h < 22) return "Good evening";
    return "Late night scholar";
  }, []);
}
