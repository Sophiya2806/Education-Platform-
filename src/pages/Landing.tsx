import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Compass,
  Headphones,
  Library,
  Mic,
  ScrollText,
  Sparkles,
  Trophy,
} from "lucide-react";
import { PublicShell } from "@/components/layout/PublicShell";
import { Compass as CompassGlyph, Globe, MapPin } from "@/components/ui/Glyphs";
import { Avatar } from "@/components/ui/Avatar";
import { LANGUAGES } from "@/lib/languages";
import { cn } from "@/lib/utils";

const METHOD = [
  {
    icon: Library,
    title: "Leveled curriculum",
    body: "From wayfarer to polyglot — five clear stages for every language, paced for life.",
  },
  {
    icon: BookOpen,
    title: "Vocabulary & grammar",
    body: "Spaced flashcards and targeted drills that respect the rhythm of your memory.",
  },
  {
    icon: Mic,
    title: "Oral shadowing",
    body: "Listen, repeat, refine. Your voice finds its shape in another tongue.",
  },
  {
    icon: Headphones,
    title: "Listening labs",
    body: "Adaptive audio trains your ear to catch the small sounds that carry meaning.",
  },
  {
    icon: Compass,
    title: "Personalized paths",
    body: "A recommender that watches how you learn, then quietly reorders the journey.",
  },
  {
    icon: Trophy,
    title: "Achievements & community",
    body: "Earn milestones, share progress, and study alongside fellow cartographers.",
  },
];

const QUOTES = [
  {
    body: "Lingo Atlas turned ten minutes before bed into a real habit. I read my first French novel last month.",
    name: "Sofia R.",
    role: "Learner · Spanish → German",
    seed: "sofia",
  },
  {
    body: "The shadowing drills finally got my Tokyo colleagues to stop smiling at my pronunciation.",
    name: "Marco P.",
    role: "Learner · Italian → Japanese",
    seed: "marco",
  },
  {
    body: "I started for travel; I stayed for the community. The leaderboard is gentle and oddly motivating.",
    name: "Yuna K.",
    role: "Learner · Korean → English",
    seed: "yuna",
  },
];

const SAMPLE_LESSONS = [
  { lang: "ja", word: "おはよう", romaji: "ohayou", meaning: "Good morning" },
  { lang: "ko", word: "감사합니다", romaji: "kamsahamnida", meaning: "Thank you" },
  { lang: "fr", word: "merci", romaji: "merci", meaning: "Thank you" },
  { lang: "es", word: "biblioteca", romaji: "biblyoteca", meaning: "Library" },
];

export default function Landing() {
  return (
    <PublicShell>
      <Hero />
      <LanguageAtlas />
      <MethodSection />
      <PathSection />
      <VoicesSection />
      <CtaSection />
    </PublicShell>
  );
}

function Hero() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % LANGUAGES.length), 2400);
    return () => clearInterval(t);
  }, []);
  const featured = LANGUAGES[index];

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:px-10 lg:pt-20">
        <div className="relative z-10 flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gilt/40 bg-gilt/10 px-3 py-1 text-xs font-medium text-ink-700">
            <Sparkles className="h-3.5 w-3.5 text-gilt-dark" /> 1.2M polyglots mapping new tongues
          </div>
          <h1 className="mt-6 font-display text-5xl font-medium leading-[1.05] text-ink-800 sm:text-6xl lg:text-7xl">
            <span className="text-balance">A field journal</span>
            <br />
            <span className="text-balance italic text-cardinal">for learning</span>{" "}
            <span className="relative inline-block">
              <span className="text-balance">{featured.nativeName}</span>
              <span className="absolute -bottom-2 left-0 h-1 w-full origin-left bg-gradient-to-r from-gilt via-cardinal to-lapis" />
            </span>
            <span className="text-balance">, one chapter at a time.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-600">
            Lingo Atlas blends leveled curricula, immersive shadowing, and a global community
            into a calm, beautifully designed study companion. Pick a language — we will
            chart the rest.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link to="/auth/sign-up" className="pill-button text-base">
              Start a free chapter <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link to="/auth/sign-in" className="pill-button-ghost text-base">
              I already have a journal
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-ink-600">
            {[
              { k: "8", v: "Languages" },
              { k: "A1 → C1", v: "Levels" },
              { k: "30s", v: "Avg lesson" },
              { k: "100%", v: "Adaptive" },
            ].map((s) => (
              <div key={s.v} className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-semibold text-ink-800">{s.k}</span>
                <span className="uppercase tracking-[0.18em] text-[10px] text-ink-500">{s.v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
            <div className="absolute inset-0 rounded-3xl border border-ink-800/10 bg-vellum shadow-parchment">
              <div className="absolute -left-3 -top-3 h-12 w-12 rotate-3 border-l-2 border-t-2 border-gilt/60" />
              <div className="absolute -right-3 -bottom-3 h-12 w-12 -rotate-3 border-b-2 border-r-2 border-gilt/60" />
            </div>
            <div className="absolute inset-0 flex flex-col p-8">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-ink-500">
                <span>Chapter · {featured.flag} {featured.name}</span>
                <span>00 / 12</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-ink-700">
                <MapPin size={14} color="#C8A24A" />
                {featured.greeting}
                {featured.romanization && (
                  <span className="font-mono text-xs text-ink-500">· {featured.romanization}</span>
                )}
              </div>
              <div className="mt-6 space-y-3">
                {SAMPLE_LESSONS.map((l) => (
                  <FlashRow key={l.word} {...l} active={l.lang === featured.code} />
                ))}
              </div>
              <div className="mt-auto">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-ink-500">
                  <span>Progress</span>
                  <span>4 / 12 words</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-800/10">
                  <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-gilt via-cardinal to-lapis" />
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <Avatar seed="yuna" size={32} />
                  <div className="text-xs text-ink-600">
                    <div className="font-semibold text-ink-800">Yuna K.</div>
                    <div>"Today's lesson was 6 minutes. Tomorrow, fewer mistakes."</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -right-6 -top-6 hidden rotate-6 lg:block">
              <CompassGlyph size={84} spinning />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FlashRow({ word, romaji, meaning, active }: { word: string; romaji: string; meaning: string; active: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3 text-sm transition-all",
        active
          ? "border-gilt/50 bg-gilt/10 shadow-gilt"
          : "border-ink-800/10 bg-vellum/60"
      )}
    >
      <div className="flex items-baseline justify-between">
        <span className="font-display text-xl text-ink-800">{word}</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-500">{romaji}</span>
      </div>
      <div className="mt-0.5 text-xs text-ink-600">{meaning}</div>
    </div>
  );
}

function LanguageAtlas() {
  return (
    <section id="atlas" className="relative py-16">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">The atlas</div>
            <h2 className="mt-3 font-display text-4xl font-medium leading-tight text-ink-800 sm:text-5xl">
              Eight territories. One scholar.
            </h2>
            <p className="mt-4 text-base text-ink-600">
              Each language is a continent in the atlas — with its own coastlines, idioms, and
              weather. Choose a territory and we will plot your path through it.
            </p>
          </div>
          <Globe size={72} color="#1E3A8A" />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LANGUAGES.map((l) => (
            <Link
              key={l.code}
              to="/auth/sign-up"
              className="group atlas-card relative flex flex-col p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-parchment"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{l.flag}</span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-ink-500">
                  {l.family}
                </span>
              </div>
              <div className="mt-4 font-display text-2xl font-medium text-ink-800">{l.nativeName}</div>
              <div className="text-sm text-ink-500">{l.name}</div>
              <div className="mt-4 flex items-center justify-between text-xs text-ink-600">
                <span className="font-mono">{l.greeting}</span>
                <ArrowUpRight className="h-4 w-4 -translate-y-0.5 translate-x-0.5 text-ink-400 transition-transform group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-gilt" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function MethodSection() {
  return (
    <section id="method" className="relative py-16">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">The method</div>
        <h2 className="mt-3 max-w-3xl font-display text-4xl font-medium leading-tight text-ink-800 sm:text-5xl">
          A small set of rituals, repeated with care.
        </h2>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {METHOD.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.title} className="atlas-card-parchment relative p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gilt/40 bg-gilt/10 text-gilt-dark">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-4 font-display text-2xl font-medium text-ink-800">{m.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{m.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PathSection() {
  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="atlas-card-parchment relative overflow-hidden p-8 lg:p-12">
          <div className="absolute -right-10 -top-10 opacity-10">
            <Globe size={240} color="#0E1320" />
          </div>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">A living path</div>
              <h2 className="mt-3 font-display text-4xl font-medium leading-tight text-ink-800">
                A recommender that reads your habits.
              </h2>
              <p className="mt-4 text-ink-600">
                The path is rebuilt every session: where you hesitate, where you soar, what you
                skipped last Tuesday. A small algorithm quietly trims the itinerary so you keep
                moving.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-ink-700">
                {[
                  "Targets your weakest skill each session",
                  "Mixes review and new material in calm waves",
                  "Reschedules around your streak and time",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-cardinal" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <PathMap />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PathMap() {
  const nodes = [
    { x: 8, y: 70, label: "Greetings", level: "A1" },
    { x: 28, y: 50, label: "Cafe phrases", level: "A1" },
    { x: 46, y: 64, label: "Daily routine", level: "A2" },
    { x: 64, y: 38, label: "Telling stories", level: "B1" },
    { x: 82, y: 56, label: "Op-eds", level: "B2" },
    { x: 92, y: 28, label: "Rhetoric", level: "C1" },
  ];
  return (
    <svg viewBox="0 0 100 80" className="w-full">
      <defs>
        <linearGradient id="path" x1="0" x2="1">
          <stop offset="0%" stopColor="#C8A24A" />
          <stop offset="50%" stopColor="#C8362D" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
      </defs>
      <path
        d="M5 75 C 18 60, 22 40, 32 48 S 50 70, 58 50 S 76 30, 96 22"
        stroke="url(#path)"
        strokeWidth="1.4"
        fill="none"
        strokeDasharray="2 2"
      />
      {nodes.map((n, i) => (
        <g key={n.label}>
          <circle cx={n.x} cy={n.y} r="3.2" fill="#FBF6E9" stroke="#0E1320" strokeWidth="0.6" />
          <circle cx={n.x} cy={n.y} r="1.4" fill={i === 2 ? "#C8362D" : "#1E3A8A"} />
          <text
            x={n.x}
            y={n.y - 6}
            textAnchor="middle"
            fontSize="3.6"
            fontFamily="Cormorant Garamond"
            fill="#0E1320"
            fontWeight={600}
          >
            {n.label}
          </text>
          <text
            x={n.x}
            y={n.y + 9}
            textAnchor="middle"
            fontSize="2.6"
            fill="#0E1320"
            fillOpacity="0.6"
            fontFamily="Inter Tight"
          >
            {n.level}
          </text>
        </g>
      ))}
      <g transform="translate(72, 64)">
        <rect x="0" y="0" width="22" height="12" rx="2" fill="#0E1320" />
        <text x="2" y="5" fontSize="2.6" fontFamily="Inter Tight" fill="#FBF6E9" fontWeight={600}>
          Today's lesson
        </text>
        <text x="2" y="9" fontSize="3.6" fontFamily="Cormorant Garamond" fill="#C8A24A" fontWeight={600}>
          B1 · Shadowing
        </text>
      </g>
    </svg>
  );
}

function VoicesSection() {
  return (
    <section id="voices" className="relative py-16">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="text-xs uppercase tracking-[0.22em] text-gilt-dark">Voices from the field</div>
        <h2 className="mt-3 max-w-2xl font-display text-4xl font-medium leading-tight text-ink-800 sm:text-5xl">
          Stories from the people who study here.
        </h2>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {QUOTES.map((q) => (
            <figure key={q.name} className="atlas-card relative p-6">
              <ScrollText className="absolute right-5 top-5 h-5 w-5 text-gilt/60" />
              <blockquote className="font-display text-xl leading-snug text-ink-800">
                "{q.body}"
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <Avatar seed={q.seed} size={36} />
                <div>
                  <div className="text-sm font-semibold">{q.name}</div>
                  <div className="text-xs text-ink-500">{q.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-5xl px-5 lg:px-10">
        <div className="atlas-card-parchment relative overflow-hidden p-10 text-center">
          <div className="absolute inset-0 grid-noise opacity-30" />
          <div className="relative">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-gilt/50 bg-gilt/10 text-gilt-dark">
              <CompassGlyph size={32} />
            </div>
            <h2 className="mt-5 font-display text-4xl font-medium leading-tight text-ink-800 sm:text-5xl">
              Open the first chapter today.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-600">
              Free to begin. No credit card. Just a calm, beautiful place to start speaking
              another language.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link to="/auth/sign-up" className="pill-button text-base">
                Begin the journey
              </Link>
              <Link to="/auth/sign-in" className="pill-button-ghost text-base">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
