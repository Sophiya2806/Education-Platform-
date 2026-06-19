import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "@/store";
import { api } from "@/lib/api";
import { Flame, MessageCircle, Send, Sparkles, Trophy } from "lucide-react";
import { LANGUAGES, LEVELS } from "@/lib/languages";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import type { LanguageCode, Level } from "@shared/types";
import { toast } from "@/lib/toast";

export function Community() {
  const user = useApp((s) => s.user);
  const posts = useApp((s) => s.posts);
  const leaderboard = useApp((s) => s.leaderboard);
  const refreshAll = useApp((s) => s.refreshAll);
  const [tab, setTab] = useState<"feed" | "leaderboard">("feed");
  const [language, setLanguage] = useState<LanguageCode | "all">("all");
  const [composer, setComposer] = useState({ title: "", body: "" });
  const [posting, setPosting] = useState(false);
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});

  const filtered = language === "all" ? posts : posts.filter((p) => p.language === language);

  async function submitPost() {
    if (!user) return;
    if (!composer.title.trim() || !composer.body.trim()) {
      toast("Add a title and a few words.", "info");
      return;
    }
    setPosting(true);
    try {
      await api.createPost({
        language: user.targetLanguage,
        level: user.level,
        title: composer.title.trim(),
        body: composer.body.trim(),
      });
      setComposer({ title: "", body: "" });
      toast("Posted to the community.", "success");
      await refreshAll();
    } catch (err) {
      toast("Couldn't post.", "info");
    } finally {
      setPosting(false);
    }
  }

  async function react(postId: string, type: "fire" | "clap" | "sparkle") {
    try {
      await api.reactPost(postId, type);
      await refreshAll();
    } catch (err) {
      toast("Couldn't react.", "info");
    }
  }

  async function comment(postId: string) {
    const body = (commentDraft[postId] || "").trim();
    if (!body) return;
    try {
      await api.commentPost(postId, body);
      setCommentDraft((s) => ({ ...s, [postId]: "" }));
      await refreshAll();
    } catch (err) {
      toast("Couldn't comment.", "info");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">The fellowship</div>
          <h1 className="mt-2 font-display text-4xl font-medium leading-tight text-ink-800 sm:text-5xl">
            Stories from fellow scholars.
          </h1>
          <p className="mt-3 max-w-2xl text-ink-600">
            Share milestones, ask questions, and read the field notes of people learning the
            same languages as you.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-ink-800/10">
        {[
          { key: "feed", label: "Feed", icon: MessageCircle },
          { key: "leaderboard", label: "Leaderboard", icon: Trophy },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              className={cn(
                "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                tab === t.key ? "border-cardinal text-ink-800" : "border-transparent text-ink-500 hover:text-ink-800"
              )}
            >
              <Icon className="h-4 w-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === "feed" ? (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Chip active={language === "all"} onClick={() => setLanguage("all")}>All</Chip>
              {LANGUAGES.map((l) => (
                <Chip key={l.code} active={language === l.code} onClick={() => setLanguage(l.code)}>
                  <span className="mr-1.5">{l.flag}</span> {l.name}
                </Chip>
              ))}
            </div>
            {filtered.length === 0 ? (
              <div className="atlas-card p-10 text-center text-ink-500">No posts in this language yet — be the first.</div>
            ) : (
              filtered.map((p) => (
                <article key={p.id} className="atlas-card-parchment p-6">
                  <div className="flex items-center gap-3">
                    <Avatar seed={p.author?.avatarSeed ?? "user"} size={40} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold text-ink-800">{p.author?.username ?? "Unknown"}</span>
                        <span className="text-ink-500">·</span>
                        <span className="text-ink-500">{timeAgo(p.createdAt)}</span>
                        <span className="text-ink-500">·</span>
                        <span className="text-xs uppercase tracking-widest text-gilt-dark">
                          {LANGUAGES.find((l) => l.code === p.language)?.flag} {LEVELS.find((lv) => lv === p.level)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-3 font-display text-2xl text-ink-800">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">{p.body}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <ReactionButton type="fire" count={p.reactions.fire} active={p.userReactions[user?.id ?? ""] === "fire"} onClick={() => react(p.id, "fire")} />
                    <ReactionButton type="clap" count={p.reactions.clap} active={p.userReactions[user?.id ?? ""] === "clap"} onClick={() => react(p.id, "clap")} />
                    <ReactionButton type="sparkle" count={p.reactions.sparkle} active={p.userReactions[user?.id ?? ""] === "sparkle"} onClick={() => react(p.id, "sparkle")} />
                    <span className="ml-auto text-xs text-ink-500">{p.comments.length} comments</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    {p.comments.map((c) => {
                      const author = useApp.getState().leaderboard.find((l) => l.user.id === c.authorId)?.user;
                      return (
                        <div key={c.id} className="flex gap-3 rounded-lg border border-ink-800/10 bg-vellum/60 p-3">
                          <Avatar seed={author?.avatarSeed ?? "user"} size={28} />
                          <div className="flex-1">
                            <div className="text-xs">
                              <span className="font-semibold text-ink-800">{author?.username ?? "Unknown"}</span>
                              <span className="ml-1 text-ink-500">· {timeAgo(c.createdAt)}</span>
                            </div>
                            <div className="text-sm text-ink-700">{c.body}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input
                      value={commentDraft[p.id] ?? ""}
                      onChange={(e) => setCommentDraft((s) => ({ ...s, [p.id]: e.target.value }))}
                      placeholder="Add a kind comment…"
                      className="flex-1 rounded-lg border border-ink-800/15 bg-vellum px-3 py-2 text-sm focus:border-gilt focus:outline-none focus:ring-2 focus:ring-gilt/30"
                    />
                    <button onClick={() => comment(p.id)} className="pill-button-ghost">
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>

          <aside className="space-y-5">
            <div className="atlas-card p-5">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">Compose</div>
                <Sparkles className="h-4 w-4 text-gilt-dark" />
              </div>
              <input
                value={composer.title}
                onChange={(e) => setComposer((s) => ({ ...s, title: e.target.value }))}
                placeholder="A small win, a question…"
                className="mt-3 w-full rounded-lg border border-ink-800/15 bg-vellum px-3 py-2 text-sm focus:border-gilt focus:outline-none focus:ring-2 focus:ring-gilt/30"
              />
              <textarea
                value={composer.body}
                onChange={(e) => setComposer((s) => ({ ...s, body: e.target.value }))}
                placeholder="Tell us a few lines from your journey…"
                rows={4}
                className="mt-2 w-full resize-none rounded-lg border border-ink-800/15 bg-vellum px-3 py-2 text-sm focus:border-gilt focus:outline-none focus:ring-2 focus:ring-gilt/30"
              />
              <button onClick={submitPost} disabled={posting} className="pill-button mt-3 w-full justify-center">
                {posting ? "Posting…" : "Share with the fellowship"} <Send className="h-4 w-4" />
              </button>
            </div>

            <div className="atlas-card p-5">
              <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">Top this week</div>
              <div className="mt-3 space-y-2">
                {leaderboard.slice(0, 4).map((entry) => (
                  <div key={entry.user.id} className="flex items-center gap-3">
                    <div className="w-6 text-center font-mono text-sm text-ink-500">{entry.rank}</div>
                    <Avatar seed={entry.user.avatarSeed} size={28} />
                    <div className="min-w-0 flex-1 truncate text-sm">{entry.user.username}</div>
                    <div className="text-xs text-gilt-dark">{entry.user.streak}d 🔥</div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      ) : (
        <LeaderboardView entries={leaderboard} meId={user?.id ?? ""} />
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-sm transition-all",
        active ? "border-ink-800 bg-ink-800 text-vellum" : "border-ink-800/15 bg-vellum/60 text-ink-700 hover:border-ink-800/30"
      )}
    >
      {children}
    </button>
  );
}

function ReactionButton({
  type,
  count,
  active,
  onClick,
}: {
  type: "fire" | "clap" | "sparkle";
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  const color = type === "fire" ? "text-cardinal" : type === "clap" ? "text-gilt-dark" : "text-lapis";
  const icon = type === "fire" ? <Flame className="h-4 w-4" /> : type === "clap" ? "👏" : <Sparkles className="h-4 w-4" />;
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-all",
        active
          ? "border-ink-800/30 bg-ink-800/5 text-ink-800"
          : "border-ink-800/15 bg-vellum/60 text-ink-600 hover:border-ink-800/30"
      )}
    >
      <span className={color}>{icon}</span>
      {count}
    </button>
  );
}

function LeaderboardView({ entries, meId }: { entries: ReturnType<typeof useApp.getState>["leaderboard"]; meId: string }) {
  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {top3.map((e, i) => (
          <div
            key={e.user.id}
            className={cn(
              "atlas-card-parchment p-5 text-center",
              i === 0 && "border-gilt/60 shadow-gilt"
            )}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-gilt/40 bg-gilt/10 font-display text-lg text-gilt-dark">
              {i + 1}
            </div>
            <div className="mt-3 flex justify-center">
              <Avatar seed={e.user.avatarSeed} size={64} />
            </div>
            <div className="mt-3 font-display text-xl text-ink-800">{e.user.username}{e.user.id === meId && " · you"}</div>
            <div className="text-xs text-ink-500">{LANGUAGES.find((l) => l.code === e.user.targetLanguage)?.name} · {e.user.streak}d 🔥</div>
            <div className="mt-3 font-display text-3xl text-ink-800">{e.user.xp.toLocaleString()}</div>
            <div className="text-[10px] uppercase tracking-widest text-ink-500">total XP</div>
          </div>
        ))}
      </div>
      <div className="atlas-card p-5">
        <div className="space-y-2">
          {rest.map((e) => (
            <div key={e.user.id} className={cn("flex items-center gap-3 rounded-lg border p-3", e.user.id === meId ? "border-gilt/50 bg-gilt/5" : "border-ink-800/10 bg-vellum/60")}>
              <div className="w-6 text-center font-mono text-sm text-ink-500">{e.rank}</div>
              <Avatar seed={e.user.avatarSeed} size={32} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-ink-800">{e.user.username}{e.user.id === meId && " · you"}</div>
                <div className="truncate text-xs text-ink-500">{LANGUAGES.find((l) => l.code === e.user.targetLanguage)?.name} · {e.user.streak}d streak</div>
              </div>
              <div className="text-right text-sm">
                <div className="font-mono text-ink-800">{e.user.xp.toLocaleString()}</div>
                <div className="text-[10px] text-ink-500">XP</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d`;
  return new Date(iso).toLocaleDateString();
}
