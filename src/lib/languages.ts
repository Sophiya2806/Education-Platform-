import type { LanguageCode, LanguageMeta } from "@shared/types";

export const LANGUAGES: LanguageMeta[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", family: "Germanic", greeting: "Hello" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", family: "Japonic", greeting: "こんにちは", romanization: "Konnichiwa" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷", family: "Koreanic", greeting: "안녕하세요", romanization: "Annyeonghaseyo" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳", family: "Sino-Tibetan", greeting: "你好", romanization: "Nǐ hǎo" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", family: "Romance", greeting: "Bonjour" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", family: "Romance", greeting: "Hola" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", family: "Germanic", greeting: "Hallo" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", family: "Romance", greeting: "Ciao" },
];

export const LEVEL_INFO: Record<string, { label: string; description: string; range: [number, number] }> = {
  A1: { label: "Wayfarer", description: "First words and gestures.", range: [0, 200] },
  A2: { label: "Pathfinder", description: "Survival phrases and routines.", range: [200, 600] },
  B1: { label: "Chronicler", description: "Hold conversations on familiar topics.", range: [600, 1400] },
  B2: { label: "Cartographer", description: "Read, write, and debate with nuance.", range: [1400, 2800] },
  C1: { label: "Polyglot", description: "Operate with fluency and wit.", range: [2800, 5000] },
};

export const LEVELS = ["A1", "A2", "B1", "B2", "C1"] as const;
export const SKILLS: { key: string; label: string; description: string }[] = [
  { key: "reading", label: "Reading", description: "Comprehension of text and signs." },
  { key: "writing", label: "Writing", description: "Composition and grammar." },
  { key: "listening", label: "Listening", description: "Ear training and dictation." },
  { key: "speaking", label: "Speaking", description: "Pronunciation and shadowing." },
];

export function getLanguage(code: LanguageCode): LanguageMeta {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}

export function levelFromXp(xp: number): string {
  if (xp < 200) return "A1";
  if (xp < 600) return "A2";
  if (xp < 1400) return "B1";
  if (xp < 2800) return "B2";
  return "C1";
}

export function progressInLevel(xp: number): { level: string; percent: number; toNext: number; nextLabel: string | null } {
  const level = levelFromXp(xp);
  const info = LEVEL_INFO[level];
  const [min, max] = info.range;
  const percent = Math.min(1, (xp - min) / (max - min));
  const idx = LEVELS.indexOf(level as any);
  const nextLabel = idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
  const toNext = nextLabel ? max - xp : 0;
  return { level, percent, toNext, nextLabel };
}

export function speak(text: string, lang: LanguageCode = "en") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = langBcp47(lang);
  utter.rate = 0.9;
  utter.pitch = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

export function langBcp47(code: LanguageCode): string {
  const map: Record<LanguageCode, string> = {
    en: "en-US",
    ja: "ja-JP",
    ko: "ko-KR",
    zh: "zh-CN",
    fr: "fr-FR",
    es: "es-ES",
    de: "de-DE",
    it: "it-IT",
  };
  return map[code];
}
