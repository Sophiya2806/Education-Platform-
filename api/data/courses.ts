import type { Course, Lesson, LanguageCode, Level, Skill } from "@shared/types";

interface CourseTemplate {
  id: string;
  level: Level;
  title: string;
  summary: string;
  skills: Skill[];
}

const COURSE_TEMPLATES: Record<LanguageCode, CourseTemplate[]> = {
  en: [
    { id: "en-a1", level: "A1", title: "First Steps in English", summary: "Greetings, pronouns, and survival phrases.", skills: ["reading", "writing", "listening", "speaking"] },
    { id: "en-a2", level: "A2", title: "Daily Routines", summary: "Talk about your day, food, and travel.", skills: ["reading", "listening", "speaking"] },
    { id: "en-b1", level: "B1", title: "Storytelling Workshop", summary: "Build sentences, tell stories, debate softly.", skills: ["writing", "reading", "speaking"] },
    { id: "en-b2", level: "B2", title: "The Editorial Desk", summary: "Read long-form articles and op-eds.", skills: ["reading", "writing"] },
    { id: "en-c1", level: "C1", title: "Rhetoric & Wit", summary: "Master tone, idiom, and persuasion.", skills: ["writing", "speaking"] },
  ],
  ja: [
    { id: "ja-a1", level: "A1", title: "はじめまして", summary: "Hiragana, basic greetings, and self-introductions.", skills: ["reading", "speaking", "listening"] },
    { id: "ja-a2", level: "A2", title: "毎日のことば", summary: "Daily life vocabulary and the polite forms.", skills: ["reading", "writing", "listening"] },
    { id: "ja-b1", level: "B1", title: "旅と出会い", summary: "Travel, dining, and connecting with strangers.", skills: ["speaking", "listening", "writing"] },
    { id: "ja-b2", level: "B2", title: "ニュースを読み解く", summary: "Read news articles and express opinions.", skills: ["reading", "writing", "speaking"] },
    { id: "ja-c1", level: "C1", title: "文学への招待", summary: "Read short stories and appreciate nuance.", skills: ["reading", "writing", "speaking"] },
  ],
  ko: [
    { id: "ko-a1", level: "A1", title: "안녕하세요", summary: "Hangul, greetings, and counting.", skills: ["reading", "speaking"] },
    { id: "ko-a2", level: "A2", title: "하루의 일상", summary: "Talk about family, food, and routines.", skills: ["speaking", "listening", "writing"] },
    { id: "ko-b1", level: "B1", title: "여행자 한국어", summary: "Travel scenarios and conversations.", skills: ["speaking", "listening", "reading"] },
    { id: "ko-b2", level: "B2", title: "뉴스와 의견", summary: "Read news and share perspectives.", skills: ["reading", "writing", "speaking"] },
    { id: "ko-c1", level: "C1", title: "문학 산책", summary: "Read modern Korean literature.", skills: ["reading", "writing"] },
  ],
  zh: [
    { id: "zh-a1", level: "A1", title: "你好", summary: "Pinyin, tones, and basic sentences.", skills: ["reading", "speaking", "listening"] },
    { id: "zh-a2", level: "A2", title: "日常生活", summary: "Family, food, shopping, and directions.", skills: ["speaking", "listening", "writing"] },
    { id: "zh-b1", level: "B1", title: "城市漫游", summary: "Travel with confidence across China.", skills: ["speaking", "listening", "reading"] },
    { id: "zh-b2", level: "B2", title: "新闻阅读", summary: "Read articles and discuss current events.", skills: ["reading", "writing", "speaking"] },
    { id: "zh-c1", level: "C1", title: "文学与文化", summary: "Dive into poetry and modern essays.", skills: ["reading", "writing"] },
  ],
  fr: [
    { id: "fr-a1", level: "A1", title: "Premiers mots", summary: "Greetings, numbers, and café phrases.", skills: ["reading", "speaking", "listening"] },
    { id: "fr-a2", level: "A2", title: "Vivre au quotidien", summary: "Describe routines, weather, and family.", skills: ["speaking", "listening", "writing"] },
    { id: "fr-b1", level: "B1", title: "Conversations vivantes", summary: "Debate softly, share stories.", skills: ["speaking", "writing", "reading"] },
    { id: "fr-b2", level: "B2", title: "Le journal", summary: "Read Le Monde and opine.", skills: ["reading", "writing"] },
    { id: "fr-c1", level: "C1", title: "Style et nuance", summary: "Master idioms, register, and rhetoric.", skills: ["writing", "speaking", "reading"] },
  ],
  es: [
    { id: "es-a1", level: "A1", title: "¡Hola!", summary: "Alphabet, greetings, and introductions.", skills: ["reading", "speaking", "listening"] },
    { id: "es-a2", level: "A2", title: "La vida diaria", summary: "Family, food, and the local market.", skills: ["speaking", "writing", "listening"] },
    { id: "es-b1", level: "B1", title: "Historias", summary: "Tell stories in past tenses.", skills: ["writing", "speaking", "reading"] },
    { id: "es-b2", level: "B2", title: "El periódico", summary: "Read news and write op-eds.", skills: ["reading", "writing"] },
    { id: "es-c1", level: "C1", title: "Letras vivas", summary: "Read García Lorca and modern poets.", skills: ["reading", "writing", "speaking"] },
  ],
  de: [
    { id: "de-a1", level: "A1", title: "Hallo!", summary: "Greetings, articles, and the verb sein.", skills: ["reading", "speaking", "listening"] },
    { id: "de-a2", level: "A2", title: "Alltagsdeutsch", summary: "Daily life, food, and travel.", skills: ["speaking", "writing", "listening"] },
    { id: "de-b1", level: "B1", title: "Gespräche", summary: "Discuss plans, work, and dreams.", skills: ["speaking", "writing", "reading"] },
    { id: "de-b2", level: "B2", title: "Die Zeitung", summary: "Read articles and write essays.", skills: ["reading", "writing"] },
    { id: "de-c1", level: "C1", title: "Kultur & Literatur", summary: "Read Hesse and contemporary authors.", skills: ["reading", "writing", "speaking"] },
  ],
  it: [
    { id: "it-a1", level: "A1", title: "Ciao!", summary: "Greetings, numbers, and present tense.", skills: ["reading", "speaking", "listening"] },
    { id: "it-a2", level: "A2", title: "Vita quotidiana", summary: "Family, food, and weekend plans.", skills: ["speaking", "writing", "listening"] },
    { id: "it-b1", level: "B1", title: "Storie", summary: "Tell stories in past tenses.", skills: ["writing", "speaking", "reading"] },
    { id: "it-b2", level: "B2", title: "Il giornale", summary: "Read La Repubblica and opine.", skills: ["reading", "writing"] },
    { id: "it-c1", level: "C1", title: "Letteratura", summary: "Read Calvino and modern prose.", skills: ["reading", "writing", "speaking"] },
  ],
};

interface LessonTemplate {
  title: string;
  skill: Skill;
  estimatedMinutes: number;
  xpReward: number;
}

const LESSON_TEMPLATES: LessonTemplate[] = [
  { title: "Vocabulary: Greetings & Introductions", skill: "reading", estimatedMinutes: 6, xpReward: 20 },
  { title: "Grammar: Sentence Foundations", skill: "writing", estimatedMinutes: 8, xpReward: 25 },
  { title: "Shadowing: Phrases in Conversation", skill: "speaking", estimatedMinutes: 7, xpReward: 30 },
  { title: "Listening Lab: Comprehension Drills", skill: "listening", estimatedMinutes: 6, xpReward: 20 },
  { title: "Vocabulary: Daily Life", skill: "reading", estimatedMinutes: 7, xpReward: 22 },
  { title: "Grammar: Tense Practice", skill: "writing", estimatedMinutes: 9, xpReward: 28 },
  { title: "Shadowing: Pronunciation Focus", skill: "speaking", estimatedMinutes: 7, xpReward: 32 },
  { title: "Listening Lab: Short Dialogues", skill: "listening", estimatedMinutes: 6, xpReward: 22 },
];

// Lesson content generators per language.
const VOCAB_POOL: Record<LanguageCode, { prompt: string; translation: string; ipa?: string; example?: string; exampleTranslation?: string }[]> = {
  en: [
    { prompt: "Hello", translation: "A common greeting", example: "Hello, my friend.", exampleTranslation: "A friendly opening." },
    { prompt: "Thank you", translation: "Express gratitude", example: "Thank you for the gift.", exampleTranslation: "Used after receiving something." },
    { prompt: "Library", translation: "A place with books", example: "I study at the library.", exampleTranslation: "Where I read and learn." },
  ],
  ja: [
    { prompt: "ありがとう", translation: "Thank you", ipa: "aɾiɡatoː", example: "ありがとうございます。", exampleTranslation: "Thank you very much." },
    { prompt: "図書館", translation: "Library", ipa: "toshokan", example: "図書館で勉強します。", exampleTranslation: "I study at the library." },
    { prompt: "水", translation: "Water", ipa: "mizu", example: "水をください。", exampleTranslation: "Water, please." },
  ],
  ko: [
    { prompt: "감사합니다", translation: "Thank you", ipa: "kamsahamnida", example: "도와줘서 감사합니다.", exampleTranslation: "Thank you for helping me." },
    { prompt: "도서관", translation: "Library", ipa: "toseogwan", example: "도서관에서 공부해요.", exampleTranslation: "I study at the library." },
    { prompt: "물", translation: "Water", ipa: "mul", example: "물 한 잔 주세요.", exampleTranslation: "A glass of water, please." },
  ],
  zh: [
    { prompt: "谢谢", translation: "Thank you", ipa: "xièxie", example: "谢谢你帮我。", exampleTranslation: "Thanks for helping me." },
    { prompt: "图书馆", translation: "Library", ipa: "túshūguǎn", example: "我在图书馆学习。", exampleTranslation: "I study at the library." },
    { prompt: "水", translation: "Water", ipa: "shuǐ", example: "请给我一杯水。", exampleTranslation: "Please give me a glass of water." },
  ],
  fr: [
    { prompt: "Merci", translation: "Thank you", example: "Merci beaucoup !", exampleTranslation: "Thanks a lot!" },
    { prompt: "Bibliothèque", translation: "Library", example: "J'étudie à la bibliothèque.", exampleTranslation: "I study at the library." },
    { prompt: "Eau", translation: "Water", example: "Une carafe d'eau, s'il vous plaît.", exampleTranslation: "A carafe of water, please." },
  ],
  es: [
    { prompt: "Gracias", translation: "Thank you", example: "Muchas gracias por todo.", exampleTranslation: "Thank you very much for everything." },
    { prompt: "Biblioteca", translation: "Library", example: "Estudio en la biblioteca.", exampleTranslation: "I study at the library." },
    { prompt: "Agua", translation: "Water", example: "Un vaso de agua, por favor.", exampleTranslation: "A glass of water, please." },
  ],
  de: [
    { prompt: "Danke", translation: "Thank you", example: "Vielen Dank für deine Hilfe.", exampleTranslation: "Thank you very much for your help." },
    { prompt: "Bibliothek", translation: "Library", example: "Ich lerne in der Bibliothek.", exampleTranslation: "I study at the library." },
    { prompt: "Wasser", translation: "Water", example: "Ein Glas Wasser, bitte.", exampleTranslation: "A glass of water, please." },
  ],
  it: [
    { prompt: "Grazie", translation: "Thank you", example: "Grazie mille!", exampleTranslation: "Thanks a million!" },
    { prompt: "Biblioteca", translation: "Library", example: "Studio in biblioteca.", exampleTranslation: "I study at the library." },
    { prompt: "Acqua", translation: "Water", example: "Un bicchiere d'acqua, per favore.", exampleTranslation: "A glass of water, please." },
  ],
};

const GRAMMAR_POOL: Record<LanguageCode, { prompt: string; answer: string; choices: string[]; rule: string; example: string }[]> = {
  en: [
    { prompt: "She ___ to the market every Sunday.", answer: "goes", choices: ["go", "goes", "going", "gone"], rule: "Third person singular takes -es.", example: "He writes letters." },
    { prompt: "If I ___ rich, I would travel.", answer: "were", choices: ["am", "was", "were", "be"], rule: "Second conditional uses 'were' for all subjects.", example: "If I were you, I'd wait." },
  ],
  ja: [
    { prompt: "私___学生です。", answer: "は", choices: ["は", "が", "を", "に"], rule: "Topic marker は identifies what you are talking about.", example: "私は学生です。" },
    { prompt: "昨日、本___読みました。", answer: "を", choices: ["を", "は", "が", "に"], rule: "を marks the direct object of a transitive verb.", example: "りんごを食べます。" },
  ],
  ko: [
    { prompt: "저는 학생___", answer: "입니다", choices: ["입니다", "입니다", "있어요", "해요"], rule: "입니다 is the formal 'to be' ending a sentence.", example: "저는 학생입니다." },
    { prompt: "밥을 ___", answer: "먹어요", choices: ["먹어요", "마셔요", "읽어요", "자요"], rule: "먹다 (to eat) conjugates to 먹어요 in present polite.", example: "밥을 먹어요." },
  ],
  zh: [
    { prompt: "我___学生。", answer: "是", choices: ["是", "有", "在", "去"], rule: "是 is the copula 'to be' in Chinese.", example: "我是学生。" },
    { prompt: "我___喝茶。", answer: "喜欢", choices: ["喜欢", "是", "有", "在"], rule: "喜欢 means 'to like'. It takes an object directly.", example: "我喜欢咖啡。" },
  ],
  fr: [
    { prompt: "Je ___ étudiant.", answer: "suis", choices: ["suis", "es", "est", "sommes"], rule: "First person singular of être is suis.", example: "Je suis content." },
    { prompt: "Elle ___ un livre.", answer: "lit", choices: ["lis", "lit", "lire", "lisons"], rule: "Third person singular of lire is lit.", example: "Il lit le journal." },
  ],
  es: [
    { prompt: "Yo ___ español.", answer: "hablo", choices: ["hablo", "hablas", "habla", "hablan"], rule: "First person singular of hablar drops the -ar and adds -o.", example: "Yo hablo inglés." },
    { prompt: "Ella ___ en Madrid.", answer: "vive", choices: ["vivo", "vives", "vive", "vivimos"], rule: "Third person singular of vivir drops -ir and adds -e.", example: "Él vive en Barcelona." },
  ],
  de: [
    { prompt: "Ich ___ Student.", answer: "bin", choices: ["bin", "bist", "ist", "sind"], rule: "First person singular of sein is bin.", example: "Ich bin müde." },
    { prompt: "Er ___ ein Buch.", answer: "liest", choices: ["lese", "liest", "lesen", "las"], rule: "Third person singular of lesen is liest.", example: "Sie liest gern." },
  ],
  it: [
    { prompt: "Io ___ italiano.", answer: "parlo", choices: ["parlo", "parli", "parla", "parliamo"], rule: "First person singular of parlare drops -are and adds -o.", example: "Parlo con Marco." },
    { prompt: "Loro ___ a Roma.", answer: "vivono", choices: ["vivo", "vivi", "vive", "vivono"], rule: "Third person plural of vivere drops -ere and adds -ono.", example: "Vivono in Italia." },
  ],
};

const SHADOW_POOL: Record<LanguageCode, { prompt: string; transliteration: string; translation: string }[]> = {
  en: [
    { prompt: "Where are you from?", transliteration: "where are you from", translation: "Asking about someone's origin." },
    { prompt: "Could you help me, please?", transliteration: "could you help me please", translation: "A polite request for help." },
  ],
  ja: [
    { prompt: "おはようございます。", transliteration: "ohayou gozaimasu", translation: "Good morning (polite)." },
    { prompt: "すみません、駅はどこですか？", transliteration: "sumimasen, eki wa doko desu ka?", translation: "Excuse me, where is the station?" },
  ],
  ko: [
    { prompt: "안녕하세요, 반갑습니다.", transliteration: "annyeonghaseyo, bangapseumnida", translation: "Hello, nice to meet you." },
    { prompt: "이거 얼마예요?", transliteration: "igeo eolmayeyo?", translation: "How much is this?" },
  ],
  zh: [
    { prompt: "你好,很高兴认识你。", transliteration: "nǐ hǎo, hěn gāoxìng rènshi nǐ", translation: "Hello, nice to meet you." },
    { prompt: "请问洗手间在哪里?", transliteration: "qǐngwèn xǐshǒujiān zài nǎlǐ", translation: "Excuse me, where is the restroom?" },
  ],
  fr: [
    { prompt: "Bonjour, comment allez-vous ?", transliteration: "bonjour, comment allez-vous", translation: "Hello, how are you?" },
    { prompt: "Où est la bibliothèque ?", transliteration: "où est la bibliothèque", translation: "Where is the library?" },
  ],
  es: [
    { prompt: "Hola, ¿cómo te llamas?", transliteration: "hola, cómo te llamas", translation: "Hello, what is your name?" },
    { prompt: "¿Dónde está el baño?", transliteration: "dónde está el baño", translation: "Where is the bathroom?" },
  ],
  de: [
    { prompt: "Guten Tag, wie geht es Ihnen?", transliteration: "guten tag, wie geht es ihnen", translation: "Good day, how are you?" },
    { prompt: "Wo ist der Bahnhof?", transliteration: "wo ist der bahnhof", translation: "Where is the train station?" },
  ],
  it: [
    { prompt: "Buongiorno, come stai?", transliteration: "buongiorno, come stai", translation: "Good morning, how are you?" },
    { prompt: "Dov'è la stazione?", transliteration: "dov'è la stazione", translation: "Where is the station?" },
  ],
};

const LISTEN_POOL: Record<LanguageCode, { audio: string; question: string; choices: string[]; answer: string }[]> = {
  en: [
    { audio: "audio-1", question: "What time does the speaker wake up?", choices: ["6:00", "7:00", "8:00", "9:00"], answer: "7:00" },
    { audio: "audio-2", question: "What is the speaker's favorite food?", choices: ["Pizza", "Sushi", "Tacos", "Pasta"], answer: "Sushi" },
  ],
  ja: [
    { audio: "audio-1", question: "駅はどこですか？", choices: ["左", "右", "前", "後ろ"], answer: "右" },
    { audio: "audio-2", question: "好きな食べ物は何ですか？", choices: ["寿司", "ラーメン", "カレー", "焼肉"], answer: "寿司" },
  ],
  ko: [
    { audio: "audio-1", question: "지금 몇 시예요?", choices: ["두 시", "세 시", "네 시", "다섯 시"], answer: "세 시" },
    { audio: "audio-2", question: "가장 좋아하는 계절은?", choices: ["봄", "여름", "가을", "겨울"], answer: "가을" },
  ],
  zh: [
    { audio: "audio-1", question: "你今天感觉怎么样?", choices: ["很好", "一般", "很累", "生病了"], answer: "很好" },
    { audio: "audio-2", question: "你最喜欢的颜色是?", choices: ["红色", "蓝色", "绿色", "黑色"], answer: "蓝色" },
  ],
  fr: [
    { audio: "audio-1", question: "Quel temps fait-il aujourd'hui ?", choices: ["Soleil", "Pluie", "Neige", "Vent"], answer: "Soleil" },
    { audio: "audio-2", question: "Où habitez-vous ?", choices: ["Paris", "Lyon", "Marseille", "Bordeaux"], answer: "Paris" },
  ],
  es: [
    { audio: "audio-1", question: "¿Qué hora es?", choices: ["Las dos", "Las tres", "Las cuatro", "Las cinco"], answer: "Las tres" },
    { audio: "audio-2", question: "¿Cuál es tu color favorito?", choices: ["Azul", "Rojo", "Verde", "Amarillo"], answer: "Azul" },
  ],
  de: [
    { audio: "audio-1", question: "Wie heißt du?", choices: ["Anna", "Lukas", "Marie", "Jonas"], answer: "Marie" },
    { audio: "audio-2", question: "Was ist dein Hobby?", choices: ["Lesen", "Kochen", "Sport", "Musik"], answer: "Lesen" },
  ],
  it: [
    { audio: "audio-1", question: "Quanti anni hai?", choices: ["20", "25", "30", "35"], answer: "25" },
    { audio: "audio-2", question: "Qual è la tua città preferita?", choices: ["Roma", "Milano", "Firenze", "Napoli"], answer: "Firenze" },
  ],
};

function pickFromPool<T>(pool: T[], n: number, offset: number): T[] {
  const out: T[] = [];
  for (let i = 0; i < n; i++) {
    out.push(pool[(i + offset) % pool.length]);
  }
  return out;
}

function buildLesson(courseId: string, language: LanguageCode, level: Level, unit: number, template: LessonTemplate, index: number): Lesson {
  const id = `${courseId}-u${unit}-${index}`;
  const offset = unit * 2;
  let items: Lesson["items"] = [];
  if (template.skill === "reading") {
    items = pickFromPool(VOCAB_POOL[language], 3, offset).map((v) => ({ type: "vocab", ...v }));
  } else if (template.skill === "writing") {
    items = pickFromPool(GRAMMAR_POOL[language], 2, offset).map((g) => ({ type: "grammar", ...g }));
  } else if (template.skill === "speaking") {
    items = pickFromPool(SHADOW_POOL[language], 3, offset).map((s) => ({ type: "shadow", ...s }));
  } else {
    items = pickFromPool(LISTEN_POOL[language], 2, offset).map((l) => ({ type: "listen", ...l }));
  }
  return {
    id,
    courseId,
    language,
    level,
    unit,
    title: template.title,
    skill: template.skill,
    estimatedMinutes: template.estimatedMinutes,
    xpReward: template.xpReward,
    items,
  };
}

export function buildCourses(): { courses: Course[]; lessons: Lesson[] } {
  const courses: Course[] = [];
  const lessons: Lesson[] = [];
  (Object.keys(COURSE_TEMPLATES) as LanguageCode[]).forEach((lang) => {
    COURSE_TEMPLATES[lang].forEach((ct) => {
      const units = 6;
      const lessonIds: string[] = [];
      let templateIndex = 0;
      for (let u = 1; u <= units; u++) {
        LESSON_TEMPLATES.forEach((lt) => {
          if (ct.skills.includes(lt.skill)) {
            const lesson = buildLesson(ct.id, lang, ct.level, u, lt, templateIndex++);
            lessons.push(lesson);
            lessonIds.push(lesson.id);
          }
        });
      }
      courses.push({
        id: ct.id,
        language: lang,
        level: ct.level,
        title: ct.title,
        summary: ct.summary,
        units,
        estimatedHours: units * 3,
        skills: ct.skills,
        lessonIds,
      });
    });
  });
  return { courses, lessons };
}
