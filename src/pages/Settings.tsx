import { useState } from "react";
import { useApp } from "@/store";
import { LANGUAGES } from "@/lib/languages";
import type { LanguageCode } from "@shared/types";
import { LogOut, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@/components/ui/Avatar";
import { toast } from "@/lib/toast";

export function Settings() {
  const navigate = useNavigate();
  const user = useApp((s) => s.user);
  const updateSettings = useApp((s) => s.updateSettings);
  const signOut = useApp((s) => s.signOut);
  const [username, setUsername] = useState(user?.username ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [native, setNative] = useState<LanguageCode>(user?.nativeLanguage ?? "en");
  const [target, setTarget] = useState<LanguageCode>(user?.targetLanguage ?? "ja");
  const [autoplay, setAutoplay] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  async function save() {
    setSaving(true);
    try {
      await updateSettings({ username, bio, nativeLanguage: native, targetLanguage: target, avatarSeed: user!.avatarSeed });
      toast("Settings saved.", "success");
    } catch (err) {
      toast("Couldn't save.", "info");
    } finally {
      setSaving(false);
    }
  }

  function handleSignOut() {
    signOut();
    navigate("/");
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">Settings</div>
        <h1 className="mt-2 font-display text-4xl font-medium leading-tight text-ink-800 sm:text-5xl">
          Adjust your journal.
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="atlas-card-parchment p-6">
          <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">Profile</div>
          <div className="mt-4 flex items-center gap-4">
            <Avatar seed={user.avatarSeed} size={64} />
            <div>
              <div className="font-display text-xl text-ink-800">{user.username}</div>
              <div className="text-xs text-ink-500">Your avatar is generated from your username.</div>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            <Field label="Display name" value={username} onChange={setUsername} />
            <Field label="Bio" value={bio} onChange={setBio} placeholder="A line about your learning." textarea />
          </div>
        </div>

        <div className="atlas-card p-6">
          <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">Languages</div>
          <div className="mt-4 space-y-5">
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-ink-500">I speak</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {LANGUAGES.map((l) => (
                  <Pill key={l.code} active={native === l.code} onClick={() => setNative(l.code)}>
                    <span className="mr-1.5">{l.flag}</span> {l.name}
                  </Pill>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-ink-500">I want to learn</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {LANGUAGES.map((l) => (
                  <Pill key={l.code} active={target === l.code} onClick={() => setTarget(l.code)}>
                    <span className="mr-1.5">{l.flag}</span> {l.name}
                  </Pill>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="atlas-card p-6">
        <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">Accessibility & playback</div>
        <div className="mt-4 space-y-3">
          <Toggle
            label="Auto-play audio in lessons"
            description="Speak phrases automatically when a card opens."
            checked={autoplay}
            onChange={setAutoplay}
          />
          <Toggle
            label="Reduce motion"
            description="Disable non-essential animations across the app."
            checked={reducedMotion}
            onChange={setReducedMotion}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={handleSignOut} className="pill-button-ghost border-cardinal/40 text-cardinal hover:bg-cardinal/10">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
        <button onClick={save} disabled={saving} className="pill-button">
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-ink-500">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder={placeholder}
          className="mt-1.5 w-full rounded-lg border border-ink-800/15 bg-vellum px-3 py-2 text-sm focus:border-gilt focus:outline-none focus:ring-2 focus:ring-gilt/30"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-1.5 w-full rounded-lg border border-ink-800/15 bg-vellum px-3 py-2.5 text-sm focus:border-gilt focus:outline-none focus:ring-2 focus:ring-gilt/30"
        />
      )}
    </label>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-full border px-3 py-1.5 text-sm transition-all " +
        (active
          ? "border-ink-800 bg-ink-800 text-vellum"
          : "border-ink-800/15 bg-vellum/60 text-ink-700 hover:border-ink-800/30")
      }
    >
      {children}
    </button>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-lg border border-ink-800/10 bg-vellum/60 p-4 text-left transition-colors hover:bg-vellum"
    >
      <div>
        <div className="font-medium text-ink-800">{label}</div>
        <div className="text-xs text-ink-500">{description}</div>
      </div>
      <div
        className={
          "flex h-6 w-11 items-center rounded-full border transition-all " +
          (checked ? "border-ink-800 bg-ink-800" : "border-ink-800/20 bg-vellum")
        }
      >
        <span
          className={
            "h-5 w-5 transform rounded-full bg-vellum shadow transition-transform " +
            (checked ? "translate-x-5 bg-gilt" : "translate-x-0.5 bg-ink-800")
          }
        />
      </div>
    </button>
  );
}
