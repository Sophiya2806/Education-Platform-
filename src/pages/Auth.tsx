import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "@/store";
import { PublicShell } from "@/components/layout/PublicShell";
import { ArrowRight, Compass, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { LANGUAGES } from "@/lib/languages";
import type { LanguageCode } from "@shared/types";

export function SignIn() {
  const navigate = useNavigate();
  const signIn = useApp((s) => s.signIn);
  const [email, setEmail] = useState("demo@lingoatlas.app");
  const [password, setPassword] = useState("atlas");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
      toast("Welcome back, scholar.", "info");
      navigate("/app/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicShell>
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2 lg:px-10 lg:py-24">
        <AuthSide
          title="Return to your journal."
          subtitle="Your streak, your level, and the small quiet victories are all waiting."
        />
        <div className="relative">
          <div className="atlas-card-parchment relative overflow-hidden p-8 lg:p-10">
            <span className="corner-ornament tl" />
            <span className="corner-ornament tr" />
            <span className="corner-ornament bl" />
            <span className="corner-ornament br" />
            <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">Sign in</div>
            <h1 className="mt-2 font-display text-3xl font-medium text-ink-800">Hello again.</h1>
            <p className="mt-1 text-sm text-ink-500">
              Use the demo account to explore — no registration needed.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <Field
                label="Email"
                icon={<Mail className="h-4 w-4" />}
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@lingoatlas.app"
              />
              <Field
                label="Password"
                icon={<Lock className="h-4 w-4" />}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={setPassword}
                placeholder="••••••"
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="text-ink-400 hover:text-ink-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />

              {error && (
                <div className="rounded-lg border border-cardinal/30 bg-cardinal/10 px-3 py-2 text-sm text-cardinal-dark">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={cn("pill-button w-full justify-center", loading && "opacity-70")}
              >
                {loading ? "Signing you in…" : "Open the journal"} <ArrowRight className="h-4 w-4" />
              </button>

              <div className="rounded-lg border border-gilt/40 bg-gilt/5 p-3 text-xs text-ink-600">
                <div className="font-semibold text-ink-800">Quick demo</div>
                <div className="mt-1">demo@lingoatlas.app · atlas</div>
              </div>
            </form>

            <p className="mt-7 text-sm text-ink-500">
              New to Lingo Atlas?{" "}
              <Link to="/auth/sign-up" className="font-semibold text-cardinal">
                Begin the journey →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}

export function SignUp() {
  const navigate = useNavigate();
  const signUp = useApp((s) => s.signUp);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState<LanguageCode>("en");
  const [targetLanguage, setTargetLanguage] = useState<LanguageCode>("ja");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signUp({ username, email, password, nativeLanguage, targetLanguage });
      toast("Welcome, scholar.", "info");
      navigate("/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicShell>
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2 lg:px-10 lg:py-24">
        <AuthSide
          title="Open your first chapter."
          subtitle="A few details and we'll chart a personalized course for you."
        />
        <div className="relative">
          <div className="atlas-card-parchment relative overflow-hidden p-8 lg:p-10">
            <span className="corner-ornament tl" />
            <span className="corner-ornament tr" />
            <span className="corner-ornament bl" />
            <span className="corner-ornament br" />
            <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">Sign up</div>
            <h1 className="mt-2 font-display text-3xl font-medium text-ink-800">Open the atlas.</h1>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Username" value={username} onChange={setUsername} placeholder="Wanderer" />
                <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@email.com" />
              </div>
              <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 6 characters" />

              <div>
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-ink-500">I speak</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {LANGUAGES.map((l) => (
                    <Pill
                      key={l.code}
                      active={nativeLanguage === l.code}
                      onClick={() => setNativeLanguage(l.code)}
                    >
                      <span className="mr-1.5">{l.flag}</span> {l.name}
                    </Pill>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-ink-500">I want to learn</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {LANGUAGES.map((l) => (
                    <Pill
                      key={l.code}
                      active={targetLanguage === l.code}
                      onClick={() => setTargetLanguage(l.code)}
                    >
                      <span className="mr-1.5">{l.flag}</span> {l.name}
                    </Pill>
                  ))}
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-cardinal/30 bg-cardinal/10 px-3 py-2 text-sm text-cardinal-dark">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={cn("pill-button w-full justify-center", loading && "opacity-70")}
              >
                {loading ? "Charting the course…" : "Begin the journey"} <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-7 text-sm text-ink-500">
              Already have a journal?{" "}
              <Link to="/auth/sign-in" className="font-semibold text-cardinal">
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}

function AuthSide({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col justify-center">
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gilt/40 bg-gilt/10 px-3 py-1 text-xs font-medium text-ink-700">
        <Compass className="h-3.5 w-3.5 text-gilt-dark" /> Lingo Atlas
      </div>
      <h1 className="mt-6 font-display text-4xl font-medium leading-tight text-ink-800 sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 text-lg text-ink-600">{subtitle}</p>
      <ul className="mt-8 space-y-3 text-sm text-ink-700">
        {[
          "Track vocabulary, grammar, listening, and speaking",
          "Get a personalized path that adapts to your weak spots",
          "Earn achievements, share milestones, climb the leaderboard",
        ].map((b) => (
          <li key={b} className="flex items-start gap-3">
            <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cardinal" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-ink-500">{label}</span>
      <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-ink-800/15 bg-vellum px-3 py-2.5 focus-within:border-gilt focus-within:ring-2 focus-within:ring-gilt/30">
        {icon && <span className="text-ink-400">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none"
        />
        {suffix}
      </div>
    </label>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm transition-all",
        active
          ? "border-ink-800 bg-ink-800 text-vellum"
          : "border-ink-800/15 bg-vellum/60 text-ink-700 hover:border-ink-800/30"
      )}
    >
      {children}
    </button>
  );
}
