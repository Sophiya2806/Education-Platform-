import { Link, useLocation } from "react-router-dom";
import { useApp } from "@/store";
import { Compass, GraduationCap, Library, MapPin, ScrollText } from "lucide-react";
import { useEffect, useState } from "react";
import { LANGUAGES } from "@/lib/languages";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10">
      <PublicHeader />
      {children}
      <PublicFooter />
    </div>
  );
}

function PublicHeader() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`sticky top-0 z-30 border-b border-transparent transition-all duration-300 ${
        scrolled ? "bg-parchment-100/85 backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-10">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink-800 text-vellum shadow-atlas">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-2xl font-semibold leading-none">Lingo Atlas</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-ink-500">
              Field journal of languages
            </div>
          </div>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-ink-600 lg:flex">
          <Link
            to="/"
            className={`gilt-underline ${location.pathname === "/" ? "is-active" : ""}`}
          >
            Home
          </Link>
          <a href="#atlas" className="gilt-underline">Atlas</a>
          <a href="#method" className="gilt-underline">Method</a>
          <a href="#voices" className="gilt-underline">Voices</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/auth/sign-in" className="pill-button-ghost hidden sm:inline-flex">
            Sign in
          </Link>
          <Link to="/auth/sign-up" className="pill-button">
            Begin the journey
          </Link>
        </div>
      </div>
    </header>
  );
}

function PublicFooter() {
  return (
    <footer className="relative z-10 mt-20 border-t border-ink-800/10 bg-ink-800 text-vellum">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-4 lg:px-10">
        <div>
          <div className="flex items-center gap-2 font-display text-2xl">
            <Compass size={20} color="#C8A24A" />
            Lingo Atlas
          </div>
          <p className="mt-3 max-w-sm text-sm text-parchment-300">
            A field journal for language learners. One account, many tongues, countless small horizons.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-gilt">Languages</div>
          <ul className="mt-3 space-y-1.5 text-sm text-parchment-200">
            {LANGUAGES.slice(0, 6).map((l) => (
              <li key={l.code} className="flex items-center gap-2">
                <span>{l.flag}</span> {l.nativeName}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-gilt">Methods</div>
          <ul className="mt-3 space-y-1.5 text-sm text-parchment-200">
            <li className="flex items-center gap-2"><Library size={14} color="#C8A24A" /> Leveled curriculum</li>
            <li className="flex items-center gap-2"><ScrollText size={14} color="#C8A24A" /> Spaced repetition</li>
            <li className="flex items-center gap-2"><MapPin size={14} color="#C8A24A" /> Adaptive paths</li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-gilt">Field notes</div>
          <p className="mt-3 text-sm text-parchment-200">
            A small studio of polyglots and designers building a calmer way to learn.
          </p>
        </div>
      </div>
      <div className="border-t border-parchment-300/10 px-5 py-4 text-center text-xs text-parchment-300 lg:px-10">
        © {new Date().getFullYear()} Lingo Atlas · Crafted for explorers
      </div>
    </footer>
  );
}
