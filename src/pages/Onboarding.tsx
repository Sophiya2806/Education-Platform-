import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/store";
import { PublicShell } from "@/components/layout/PublicShell";
import { LANGUAGES, getLanguage } from "@/lib/languages";
import { CheckCircle2, Circle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { levelFromXp } from "@/lib/languages";
import { toast } from "@/lib/toast";

interface Question {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  skill: "reading" | "writing" | "listening" | "speaking";
}

const QUESTIONS: Question[] = [
  {
    id: "q1",
    prompt: "Which greeting is most appropriate in a formal morning setting?",
    options: ["Hey!", "Good morning", "Sup", "Yo"],
    correctIndex: 1,
    skill: "reading",
  },
  {
    id: "q2",
    prompt: "Pick the correct sentence.",
    options: ["She go to school.", "She goes to school.", "She going to school.", "She gone to school."],
    correctIndex: 1,
    skill: "writing",
  },
  {
    id: "q3",
    prompt: "「ありがとう」 most closely means:",
    options: ["Goodbye", "Please", "Thank you", "Sorry"],
    correctIndex: 2,
    skill: "reading",
  },
  {
    id: "q4",
    prompt: "If someone says \"Could you pass the salt?\", they are:",
    options: ["Stating a fact", "Asking a question", "Making a polite request", "Giving an order"],
    correctIndex: 2,
    skill: "listening",
  },
  {
    id: "q5",
    prompt: "Which sentence uses the past tense correctly?",
    options: ["I eat dinner yesterday.", "I ate dinner yesterday.", "I have eat dinner yesterday.", "I am eat dinner yesterday."],
    correctIndex: 1,
    skill: "writing",
  },
];

export function Onboarding() {
  const navigate = useNavigate();
  const user = useApp((s) => s.user);
  const refreshAll = useApp((s) => s.refreshAll);
  const updateSettings = useApp((s) => s.updateSettings);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  if (!user) {
    navigate("/auth/sign-in", { replace: true });
    return null;
  }

  const target = getLanguage(user.targetLanguage);

  function pickAnswer(i: number) {
    const next = [...answers, i];
    if (step + 1 >= QUESTIONS.length) {
      const correct = next.filter((a, idx) => a === QUESTIONS[idx].correctIndex).length;
      const xp = correct * 40;
      // Save settings + award XP via a placeholder lesson
      void finalize(xp, next);
      return;
    }
    setAnswers(next);
    setStep(step + 1);
  }

  async function finalize(xp: number, finalAnswers: number[]) {
    try {
      const correct = finalAnswers.filter((a, idx) => a === QUESTIONS[idx].correctIndex).length;
      const placeholder = {
        lessonId: `placement-${user!.id}`,
        accuracy: correct / QUESTIONS.length,
        timeSpentSec: 180,
        skill: "reading" as const,
      };
      const res = await api.submitProgress(placeholder).catch(() => null);
      if (res) {
        toast(`+${res.xpEarned} XP earned`, "success", `${correct} of ${QUESTIONS.length} correct`);
        // Update local user from response.
        if (res.user) {
          useApp.setState({
            user: {
              ...user!,
              xp: res.user.xp,
              level: res.user.level as any,
              streak: res.user.streak,
              hearts: res.user.hearts,
            },
          });
        }
      } else {
        toast(`+${xp} XP earned`, "success", `${correct} of ${QUESTIONS.length} correct`);
      }
      await refreshAll();
      navigate("/app/dashboard");
    } catch (err) {
      console.error(err);
      navigate("/app/dashboard");
    }
  }

  const progress = ((step + (answers[step] !== undefined ? 1 : 0)) / QUESTIONS.length) * 100;

  return (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-5 py-16 lg:px-10">
        <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">Chapter 0</div>
        <h1 className="mt-2 font-display text-4xl font-medium leading-tight text-ink-800 sm:text-5xl">
          A quick placement, {target.greeting}.
        </h1>
        <p className="mt-3 text-ink-600">
          Five short questions to find your starting point. No grades — just a calm map.
        </p>

        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-ink-800/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gilt via-cardinal to-lapis transition-all duration-500"
            style={{ width: `${Math.max(6, progress)}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-ink-500">
          <span>Question {Math.min(step + 1, QUESTIONS.length)} of {QUESTIONS.length}</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-gilt-dark" /> Earns XP
          </span>
        </div>

        {step < QUESTIONS.length ? (
          <QuestionCard q={QUESTIONS[step]} onPick={pickAnswer} />
        ) : null}
      </div>
    </PublicShell>
  );
}

function QuestionCard({ q, onPick }: { q: Question; onPick: (i: number) => void }) {
  const [picked, setPicked] = useState<number | null>(null);

  function handle(i: number) {
    if (picked !== null) return;
    setPicked(i);
    setTimeout(() => onPick(i), 320);
  }

  return (
    <div className="atlas-card-parchment mt-8 p-8">
      <div className="text-xs uppercase tracking-[0.18em] text-gilt-dark">Skill · {q.skill}</div>
      <h2 className="mt-2 font-display text-3xl font-medium leading-tight text-ink-800">
        {q.prompt}
      </h2>
      <div className="mt-6 space-y-3">
        {q.options.map((opt, i) => {
          const isPicked = picked === i;
          const isCorrect = i === q.correctIndex;
          return (
            <button
              key={opt}
              onClick={() => handle(i)}
              disabled={picked !== null}
              className={cn(
                "group flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-base transition-all",
                "border-ink-800/15 bg-vellum hover:border-ink-800/40 hover:shadow-atlas",
                isPicked && isCorrect && "border-verdigris bg-verdigris/10",
                isPicked && !isCorrect && "border-cardinal bg-cardinal/10"
              )}
            >
              <span className="text-ink-800">{opt}</span>
              {isPicked ? (
                isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-verdigris" />
                ) : (
                  <Circle className="h-5 w-5 text-cardinal" />
                )
              ) : (
                <Circle className="h-5 w-5 text-ink-300 group-hover:text-ink-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
