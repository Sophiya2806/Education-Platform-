import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { useApp } from "@/store";
import type { Achievement, Lesson, LessonItem, Skill } from "@shared/types";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Headphones, Mic, ScrollText, Sparkles, Volume2, X, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getLanguage, speak, langBcp47 } from "@/lib/languages";
import { Waveform } from "@/components/ui/Glyphs";
import { toast } from "@/lib/toast";

export function LessonPlayer() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const refreshAll = useApp((s) => s.refreshAll);
  const setUser = useApp((s) => s.setUser);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [results, setResults] = useState<{ correct: boolean }[]>([]);
  const [startTime] = useState(() => Date.now());
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [summary, setSummary] = useState<{
    xpEarned: number;
    accuracy: number;
    newAchievements: Achievement[];
    level: string;
    streak: number;
  } | null>(null);

  useEffect(() => {
    if (!lessonId) return;
    setLoading(true);
    api
      .lesson(lessonId)
      .then(setLesson)
      .finally(() => setLoading(false));
  }, [lessonId]);

  const totalItems = lesson?.items.length ?? 0;
  const progress = useMemo(() => {
    if (!totalItems) return 0;
    return ((step + (results[step] !== undefined ? 1 : 0)) / totalItems) * 100;
  }, [step, results, totalItems]);

  async function handleResult(correct: boolean) {
    if (!lesson) return;
    const next = [...results];
    next[step] = { correct };
    setResults(next);
    if (step + 1 < totalItems) {
      setTimeout(() => setStep(step + 1), 480);
    } else {
      await complete(next);
    }
  }

  async function complete(finalResults: { correct: boolean }[]) {
    if (!lesson) return;
    setCompleting(true);
    const correct = finalResults.filter((r) => r.correct).length;
    const accuracy = correct / finalResults.length;
    const timeSpentSec = Math.round((Date.now() - startTime) / 1000);
    try {
      const res = await api.submitProgress({
        lessonId: lesson.id,
        accuracy,
        timeSpentSec,
        skill: lesson.skill,
      });
      setSummary({
        xpEarned: res.xpEarned,
        accuracy,
        newAchievements: res.newAchievements,
        level: res.user.level,
        streak: res.user.streak,
      });
      setUser({ ...useApp.getState().user!, xp: res.user.xp, level: res.user.level as any, streak: res.user.streak, hearts: res.user.hearts });
      res.newAchievements.forEach((a) => {
        toast(`Achievement unlocked: ${a.name}`, "achievement", a.description);
      });
      toast(`+${res.xpEarned} XP earned`, "success", `${Math.round(accuracy * 100)}% accuracy`);
      await refreshAll();
    } catch (err) {
      console.error(err);
      toast("Couldn't save progress.", "info");
    } finally {
      setCompleting(false);
      setCompleted(true);
    }
  }

  if (loading) {
    return <div className="atlas-card h-96 animate-pulse bg-vellum/40" />;
  }
  if (!lesson) {
    return (
      <div className="atlas-card p-10 text-center text-ink-500">Lesson not found.</div>
    );
  }

  const lang = getLanguage(lesson.language);
  const currentItem = lesson.items[step];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to={`/app/library/${lesson.courseId}`} className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-800">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <button
          onClick={() => navigate("/app/dashboard")}
          className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-800"
        >
          <X className="h-4 w-4" /> Exit lesson
        </button>
      </div>

      <div className="atlas-card-parchment relative overflow-hidden p-6 lg:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gilt/40 bg-gilt/10 text-gilt-dark">
              {(() => {
                const Icon = skillIcon(lesson.skill);
                return <Icon className="h-5 w-5" />;
              })()}
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-gilt-dark">{lang.flag} {lang.name} · Level {lesson.level}</div>
              <h1 className="mt-0.5 font-display text-2xl text-ink-800 sm:text-3xl">{lesson.title}</h1>
            </div>
          </div>
          <div className="hidden text-right text-xs text-ink-500 md:block">
            <div>{step + 1} of {totalItems}</div>
            <div className="font-mono">+{lesson.xpReward} XP</div>
          </div>
        </div>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-ink-800/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gilt via-cardinal to-lapis transition-all duration-500"
            style={{ width: `${Math.max(6, progress)}%` }}
          />
        </div>
      </div>

      {completed && summary ? (
        <CompletionCard
          lesson={lesson}
          summary={summary}
          onContinue={() => navigate("/app/dashboard")}
          onAgain={() => {
            setStep(0);
            setResults([]);
            setCompleted(false);
            setSummary(null);
          }}
        />
      ) : (
        <ItemPlayer
          item={currentItem}
          step={step}
          total={totalItems}
          language={lesson.language}
          onResult={handleResult}
        />
      )}

      {completing && (
        <div className="atlas-card p-4 text-center text-sm text-ink-500">Saving your chapter…</div>
      )}
    </div>
  );
}

function skillIcon(s: Skill): LucideIcon {
  if (s === "reading") return BookOpen;
  if (s === "writing") return ScrollText;
  if (s === "listening") return Headphones;
  return Mic;
}

function ItemPlayer({
  item,
  step,
  total,
  language,
  onResult,
}: {
  item: LessonItem;
  step: number;
  total: number;
  language: Lesson["language"];
  onResult: (correct: boolean) => void;
}) {
  if (item.type === "vocab") return <VocabPlayer item={item} step={step} total={total} language={language} onResult={onResult} />;
  if (item.type === "grammar") return <GrammarPlayer item={item} step={step} total={total} language={language} onResult={onResult} />;
  if (item.type === "shadow") return <ShadowPlayer item={item} step={step} total={total} language={language} onResult={onResult} />;
  return <ListenPlayer item={item} step={step} total={total} language={language} onResult={onResult} />;
}

// ---------- Vocabulary ----------

function VocabPlayer({
  item,
  step,
  total,
  language,
  onResult,
}: {
  item: Extract<LessonItem, { type: "vocab" }>;
  step: number;
  total: number;
  language: Lesson["language"];
  onResult: (correct: boolean) => void;
}) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="atlas-card-parchment p-6 lg:p-8">
      <div className="flex items-center justify-between text-xs text-ink-500">
        <span>Vocabulary · {step + 1}/{total}</span>
        <span>Tap card to reveal meaning</span>
      </div>
      <div
        className="mt-5 grid cursor-pointer grid-cols-1 items-stretch gap-4 sm:grid-cols-2"
        onClick={() => setFlipped((s) => !s)}
      >
        <div className="rounded-2xl border border-ink-800/10 bg-vellum p-10 text-center shadow-atlas">
          <div className="text-xs uppercase tracking-[0.18em] text-gilt-dark">Prompt</div>
          <div className="mt-3 font-display text-5xl text-ink-800">{item.prompt}</div>
          {item.ipa && <div className="mt-2 font-mono text-sm text-ink-500">{item.ipa}</div>}
        </div>
        <div className={cn("rounded-2xl border border-gilt/30 bg-gilt/5 p-10 text-center shadow-gilt transition-all", !flipped && "opacity-50")}>
          <div className="text-xs uppercase tracking-[0.18em] text-gilt-dark">Meaning</div>
          <div className="mt-3 font-display text-3xl text-ink-800">{item.translation}</div>
          {item.example && (
            <div className="mt-3 text-sm text-ink-600">
              <div className="italic">"{item.example}"</div>
              {item.exampleTranslation && (
                <div className="mt-1 text-ink-500">— {item.exampleTranslation}</div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            speak(item.prompt, language);
          }}
          className="pill-button-ghost"
        >
          <Volume2 className="h-4 w-4" /> Hear it
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => onResult(false)}
            className="pill-button-ghost border-cardinal/40 text-cardinal hover:bg-cardinal/10"
          >
            Review again
          </button>
          <button onClick={() => onResult(true)} className="pill-button">
            <CheckCircle2 className="h-4 w-4" /> Got it
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Grammar ----------

function GrammarPlayer({
  item,
  step,
  total,
  language,
  onResult,
}: {
  item: Extract<LessonItem, { type: "grammar" }>;
  step: number;
  total: number;
  language: Lesson["language"];
  onResult: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const correct = picked === item.answer;
  return (
    <div className="atlas-card-parchment p-6 lg:p-8">
      <div className="text-xs uppercase tracking-[0.18em] text-gilt-dark">Grammar · {step + 1}/{total}</div>
      <h2 className="mt-2 font-display text-3xl text-ink-800 sm:text-4xl">{item.prompt}</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {item.choices.map((c) => {
          const isPicked = picked === c;
          const isCorrect = c === item.answer;
          return (
            <button
              key={c}
              onClick={() => !picked && setPicked(c)}
              disabled={picked !== null}
              className={cn(
                "rounded-lg border px-4 py-3 text-left text-base transition-all",
                "border-ink-800/15 bg-vellum hover:border-ink-800/40",
                isPicked && isCorrect && "border-verdigris bg-verdigris/10",
                isPicked && !isCorrect && "border-cardinal bg-cardinal/10",
                !isPicked && picked && isCorrect && "border-verdigris/40 bg-verdigris/5"
              )}
            >
              <span className="text-ink-800">{c}</span>
            </button>
          );
        })}
      </div>
      {picked && (
        <div className="mt-5 rounded-lg border border-ink-800/10 bg-vellum/60 p-4">
          <div className="text-xs uppercase tracking-[0.18em] text-gilt-dark">Rule of thumb</div>
          <p className="mt-1 text-sm text-ink-700">{item.rule}</p>
          <div className="mt-2 text-sm italic text-ink-600">"{item.example}"</div>
        </div>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button onClick={() => speak(item.prompt, language)} className="pill-button-ghost">
          <Volume2 className="h-4 w-4" /> Hear it
        </button>
        <button
          onClick={() => onResult(correct)}
          disabled={!picked}
          className="pill-button"
        >
          {correct ? "Continue" : "Continue"} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ---------- Shadowing ----------

function ShadowPlayer({
  item,
  step,
  total,
  language,
  onResult,
}: {
  item: Extract<LessonItem, { type: "shadow" }>;
  step: number;
  total: number;
  language: Lesson["language"];
  onResult: (correct: boolean) => void;
}) {
  const [phase, setPhase] = useState<"idle" | "playing" | "recording" | "scored">("idle");
  const [score, setScore] = useState(0);

  function play() {
    setPhase("playing");
    speak(item.prompt, language);
    setTimeout(() => setPhase("recording"), 1800);
  }
  function score_record() {
    // Mock similarity score 60–95.
    const s = 60 + Math.floor(Math.random() * 36);
    setScore(s);
    setPhase("scored");
  }
  return (
    <div className="atlas-card-parchment p-6 lg:p-8">
      <div className="text-xs uppercase tracking-[0.18em] text-gilt-dark">Shadowing · {step + 1}/{total}</div>
      <h2 className="mt-2 font-display text-3xl text-ink-800 sm:text-4xl">{item.prompt}</h2>
      <div className="mt-1 text-sm text-ink-500">
        <span className="font-mono">{item.transliteration}</span> · {item.translation}
      </div>
      <div className="mt-6 grid items-center gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="rounded-xl border border-ink-800/10 bg-vellum p-5 text-center">
          <div className="text-xs uppercase tracking-[0.18em] text-gilt-dark">Waveform</div>
          <div className="mt-3 flex items-center justify-center">
            <Waveform active={phase === "playing" || phase === "recording"} />
          </div>
          <div className="mt-3 text-xs text-ink-500">
            {phase === "idle" && "Tap play to hear the phrase."}
            {phase === "playing" && "Listen carefully…"}
            {phase === "recording" && "Repeat after the voice. We're listening."}
            {phase === "scored" && `Similarity ${score}%`}
          </div>
        </div>
        <div>
          <div className="rounded-xl border border-ink-800/10 bg-vellum p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-gilt-dark">Transcript</div>
            <div className="mt-2 font-display text-2xl leading-relaxed text-ink-800">
              {item.prompt}
            </div>
            <div className="mt-1 text-sm text-ink-500">{item.transliteration}</div>
            <div className="mt-3 text-sm italic text-ink-600">"{item.translation}"</div>
          </div>
          {phase === "scored" && (
            <div className="mt-4 rounded-lg border border-ink-800/10 bg-vellum/60 p-3">
              <div className="flex items-center justify-between text-xs text-ink-500">
                <span>Pronunciation</span>
                <span className="font-mono">{score}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-800/10">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    score >= 85 ? "bg-verdigris" : score >= 70 ? "bg-gilt" : "bg-cardinal"
                  )}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {phase === "idle" && (
          <button onClick={play} className="pill-button-gilt">
            <Volume2 className="h-4 w-4" /> Play phrase
          </button>
        )}
        {phase === "playing" && (
          <button disabled className="pill-button-gilt opacity-60">
            <Waveform active /> Listening…
          </button>
        )}
        {phase === "recording" && (
          <button onClick={score_record} className="pill-button">
            <Mic className="h-4 w-4" /> Score my take
          </button>
        )}
        {phase === "scored" && (
          <div className="flex items-center gap-2">
            <button onClick={play} className="pill-button-ghost">
              <Volume2 className="h-4 w-4" /> Replay
            </button>
            <button onClick={() => onResult(score >= 70)} className="pill-button">
              {score >= 70 ? "Looks good" : "Mark reviewed"} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Listening ----------

function ListenPlayer({
  item,
  step,
  total,
  language,
  onResult,
}: {
  item: Extract<LessonItem, { type: "listen" }>;
  step: number;
  total: number;
  language: Lesson["language"];
  onResult: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const [replays, setReplays] = useState(0);
  const correct = picked === item.answer;
  const maxReplays = 2;

  function play() {
    if (replays >= maxReplays) return;
    // Synthesize a short utterance hint based on the question for tone.
    speak(item.question.replace(/[?¿¡!]/g, ""), language);
    setReplays((r) => r + 1);
  }
  return (
    <div className="atlas-card-parchment p-6 lg:p-8">
      <div className="flex items-center justify-between text-xs text-ink-500">
        <span>Listening · {step + 1}/{total}</span>
        <span>Replays {replays}/{maxReplays}</span>
      </div>
      <h2 className="mt-3 font-display text-3xl text-ink-800 sm:text-4xl">{item.question}</h2>
      <div className="mt-5 rounded-xl border border-ink-800/10 bg-vellum p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-gilt-dark">Audio clip</div>
            <div className="mt-1 text-sm text-ink-500">Tap play to hear the speaker.</div>
          </div>
          <button
            onClick={play}
            disabled={replays >= maxReplays}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all",
              replays < maxReplays
                ? "border-gilt/60 bg-gilt/10 text-gilt-dark hover:bg-gilt/20"
                : "border-ink-800/10 text-ink-300"
            )}
          >
            <Volume2 className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <Waveform active={false} />
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {item.choices.map((c) => {
          const isPicked = picked === c;
          const isCorrect = c === item.answer;
          return (
            <button
              key={c}
              onClick={() => !picked && setPicked(c)}
              disabled={picked !== null}
              className={cn(
                "rounded-lg border px-4 py-3 text-left text-base transition-all",
                "border-ink-800/15 bg-vellum hover:border-ink-800/40",
                isPicked && isCorrect && "border-verdigris bg-verdigris/10",
                isPicked && !isCorrect && "border-cardinal bg-cardinal/10",
                !isPicked && picked && isCorrect && "border-verdigris/40 bg-verdigris/5"
              )}
            >
              <span className="text-ink-800">{c}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => onResult(correct)}
          disabled={!picked}
          className="pill-button"
        >
          Continue <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ---------- Completion ----------

function CompletionCard({
  lesson,
  summary,
  onContinue,
  onAgain,
}: {
  lesson: Lesson;
  summary: { xpEarned: number; accuracy: number; newAchievements: Achievement[]; level: string; streak: number };
  onContinue: () => void;
  onAgain: () => void;
}) {
  return (
    <div className="atlas-card-parchment relative overflow-hidden p-8 text-center">
      <div className="absolute inset-0 grid-noise opacity-20" />
      <div className="relative">
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-gilt/50 bg-gilt/10 text-gilt-dark">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="mt-4 text-xs uppercase tracking-[0.22em] text-gilt-dark">Chapter complete</div>
        <h2 className="mt-1 font-display text-4xl text-ink-800">Nicely done.</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <CompletionStat label="XP earned" value={`+${summary.xpEarned}`} />
          <CompletionStat label="Accuracy" value={`${Math.round(summary.accuracy * 100)}%`} />
          <CompletionStat label="Streak" value={`${summary.streak}d`} />
        </div>
        {summary.newAchievements.length > 0 && (
          <div className="mt-6 rounded-lg border border-gilt/40 bg-gilt/5 p-4 text-left">
            <div className="text-xs uppercase tracking-[0.18em] text-gilt-dark">New achievements</div>
            <div className="mt-2 space-y-1.5 text-sm text-ink-800">
              {summary.newAchievements.map((a) => (
                <div key={a.id} className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-gilt-dark" />
                  <span className="font-medium">{a.name}</span>
                  <span className="text-ink-500">— {a.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button onClick={onAgain} className="pill-button-ghost">Try again</button>
          <button onClick={onContinue} className="pill-button">
            Back to dashboard <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CompletionStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink-800/10 bg-vellum/70 p-3">
      <div className="text-[10px] uppercase tracking-widest text-ink-500">{label}</div>
      <div className="mt-1 font-display text-2xl text-ink-800">{value}</div>
    </div>
  );
}
