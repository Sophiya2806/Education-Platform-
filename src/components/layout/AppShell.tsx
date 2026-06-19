import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "@/store";
import {
  BookOpen,
  Compass,
  Flame,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  MessageCircleHeart,
  Settings as SettingsIcon,
  Sparkles,
  Trophy,
  User as UserIcon,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { ToastContainer } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { getLanguage, progressInLevel } from "@/lib/languages";
import { useEffect, useState } from "react";

const NAV = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/library", label: "Library", icon: BookOpen },
  { to: "/app/path", label: "Your path", icon: Compass },
  { to: "/app/progress", label: "Progress", icon: LineChart },
  { to: "/app/community", label: "Community", icon: MessageCircleHeart },
  { to: "/app/achievements", label: "Achievements", icon: Trophy },
  { to: "/app/profile", label: "Profile", icon: UserIcon },
  { to: "/app/settings", label: "Settings", icon: SettingsIcon },
];

export function AppShell() {
  const user = useApp((s) => s.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) navigate("/auth/sign-in", { replace: true });
    setReady(true);
  }, [user, navigate]);

  if (!user) return null;
  const target = getLanguage(user.targetLanguage);
  const progress = progressInLevel(user.xp);

  return (
    <div className="relative z-10 flex min-h-screen text-ink-800">
      <ToastContainer />
      <aside className="sticky top-0 hidden h-screen w-72 flex-shrink-0 flex-col border-r border-ink-800/10 bg-vellum/80 px-5 py-7 backdrop-blur lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink-800 text-vellum">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-2xl font-semibold leading-none">Lingo Atlas</div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.22em] text-ink-500">Field journal of languages</div>
          </div>
        </div>

        <div className="mt-7 atlas-card-parchment p-4">
          <div className="flex items-center gap-3">
            <Avatar seed={user.avatarSeed} size={48} />
            <div className="min-w-0 flex-1">
              <div className="truncate font-display text-lg leading-tight">{user.username}</div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-ink-500">
                <span className="text-base leading-none">{target.flag}</span>
                <span>Learning {target.nativeName}</span>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-ink-500">
              <span>Level {progress.level}</span>
              {progress.nextLabel && <span>to {progress.nextLabel}</span>}
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-800/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gilt via-cardinal to-lapis transition-all duration-700"
                style={{ width: `${Math.max(6, progress.percent * 100)}%` }}
              />
            </div>
            {!progress.nextLabel ? (
              <div className="mt-2 flex items-center gap-1 text-[11px] text-gilt">
                <Sparkles className="h-3 w-3" /> Polyglot achieved
              </div>
            ) : (
              <div className="mt-2 text-[11px] text-ink-500">{progress.toNext} XP to {progress.nextLabel}</div>
            )}
          </div>
        </div>

        <nav className="mt-6 flex-1 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-600 transition-all",
                    "hover:bg-ink-800/5 hover:text-ink-800",
                    isActive && "bg-ink-800 text-vellum hover:bg-ink-800 hover:text-vellum"
                  )
                }
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-6 rounded-lg border border-gilt/40 bg-gilt/10 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink-800">
            <Flame className="h-4 w-4 text-cardinal" />
            {user.streak} day streak
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-600">
            Small steps, every day. You're mapping new territory.
          </p>
        </div>
      </aside>

      <main className="relative z-10 flex-1">
        <div className="mx-auto max-w-7xl px-5 py-7 lg:px-10 lg:py-10">
          <MobileHeader />
          <div key={location.pathname} className="animate-fade-up">
            {ready ? <Outlet /> : null}
          </div>
        </div>
      </main>
    </div>
  );
}

function MobileHeader() {
  const user = useApp((s) => s.user);
  if (!user) return null;
  const target = getLanguage(user.targetLanguage);
  return (
    <div className="mb-6 flex items-center justify-between rounded-xl border border-ink-800/10 bg-vellum/80 px-4 py-3 shadow-atlas lg:hidden">
      <div className="flex items-center gap-3">
        <Avatar seed={user.avatarSeed} size={36} />
        <div>
          <div className="text-sm font-semibold">{user.username}</div>
          <div className="text-xs text-ink-500">
            {target.flag} Learning {target.name}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-ink-500">
        <span className="flex items-center gap-1 text-cardinal">
          <Flame className="h-3.5 w-3.5" />
          {user.streak}d
        </span>
        <span className="flex items-center gap-1 text-gilt">
          <Sparkles className="h-3.5 w-3.5" />
          {user.xp}
        </span>
      </div>
    </div>
  );
}
