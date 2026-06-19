import type { LanguageMeta } from "@shared/types";

export const LANGUAGES: LanguageMeta[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
    family: "Germanic",
    greeting: "Hello",
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flag: "🇯🇵",
    family: "Japonic",
    greeting: "こんにちは",
    romanization: "Konnichiwa",
  },
  {
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
    flag: "🇰🇷",
    family: "Koreanic",
    greeting: "안녕하세요",
    romanization: "Annyeonghaseyo",
  },
  {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    flag: "🇨🇳",
    family: "Sino-Tibetan",
    greeting: "你好",
    romanization: "Nǐ hǎo",
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    family: "Romance",
    greeting: "Bonjour",
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    family: "Romance",
    greeting: "Hola",
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    family: "Germanic",
    greeting: "Hallo",
  },
  {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    flag: "🇮🇹",
    family: "Romance",
    greeting: "Ciao",
  },
];

export const LEVEL_INFO: Record<
  string,
  { label: string; range: [number, number]; description: string }
> = {
  A1: { label: "Wayfarer", range: [0, 200], description: "First words and gestures." },
  A2: { label: "Pathfinder", range: [200, 600], description: "Survival phrases and routines." },
  B1: { label: "Chronicler", range: [600, 1400], description: "Hold conversations on familiar topics." },
  B2: { label: "Cartographer", range: [1400, 2800], description: "Read, write, and debate with nuance." },
  C1: { label: "Polyglot", range: [2800, 5000], description: "Operate with fluency and wit." },
};

export function levelFromXp(xp: number): string {
  if (xp < 200) return "A1";
  if (xp < 600) return "A2";
  if (xp < 1400) return "B1";
  if (xp < 2800) return "B2";
  return "C1";
}
