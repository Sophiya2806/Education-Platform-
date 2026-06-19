Lingo Atlas
Lingo Atlas is a beautiful, desktop-first, immersive online education platform designed for self-directed language learners. It supports 8 languages (English, Japanese, Korean, Chinese, French, Spanish, German, Italian) through a unified, leveled curriculum.

The platform combines spaced-repetition vocabulary drills, grammar workshops, AI-assisted oral shadowing, and adaptive listening labs. It layers on progress telemetry, personalized learning paths, and a gamified community to keep learners engaged.



🗺️ Core Features
Leveled Curriculum (A1-C1): Five clear stages for every language, from absolute beginner (Wayfarer) to advanced fluency (Polyglot).
Four Interactive Lesson Types:
Vocabulary: Spaced-repetition flashcards with flip animations, IPA, and native audio.
Grammar: Fill-in-the-blank and multiple-choice questions with instant rule explanations.
Shadowing: Listen, record your voice, and get a similarity score (simulated) to improve pronunciation.
Listening Labs: Audio comprehension drills to train your ear.
Personalized Paths: An algorithm that analyzes your recent accuracy and weakest skills to dynamically recommend your next best lesson.
Deep Progress Tracking:
12-week GitHub-style study heatmap.
4-axis skill radar chart (Reading, Writing, Listening, Speaking).
A gallery of your "mastered lexicon".
Gamified Community:
Share milestones and field notes with fellow learners.
React with custom emojis (Fire, Clap, Sparkle).
Weekly and all-time leaderboards based on XP.
Achievements System: 12 unlockable badges (from Common to Legendary) for maintaining streaks, mastering words, and achieving perfect lessons.
🛠️ Tech Stack
This project is built as a modern, single-repository full-stack application.

Frontend:

React 18 + Vite (Fast, modern build tool)
TypeScript (Strict type safety across the stack)
Tailwind CSS 3 (Utility-first styling with a custom "Parchment & Ink" design system)
Zustand (Lightweight, hook-based state management)
React Router 6 (Client-side routing)
Lucide React (Beautiful, consistent iconography)
Backend:

Node.js + Express
TypeScript (Sharing types with the frontend)
In-Memory Store: The backend currently uses an in-memory database seeded with realistic JSON fixtures. This makes it incredibly easy to run and test locally without setting up Postgres or MongoDB.
🚀 Getting Started
To run Lingo Atlas locally, you need Node.js and pnpm installed.

Install dependencies:


Bash

pnpm install
Start the development servers:


Bash

pnpm run dev
This command uses concurrently to start both the Vite frontend (port 5173) and the Express backend (port 3001) simultaneously.

Open the app: Navigate to http://localhost:5173 in your browser.

Using the Demo Account
You don't need to create an account to see the app in action. On the sign-in page, simply use the pre-filled demo credentials:

Email: demo@lingoatlas.app
Password: atlas
🎨 Design System ("Cartographic Atlas")
Lingo Atlas abandons the typical bright, gamified aesthetic of most language apps in favor of an "editorial-meets-cartography" style.

Vibe: A leather-bound field journal.
Colors: Parchment backgrounds (#F4ECDA), deep Navy Ink text (#0E1320), with Cardinal Red (#C8362D) and Gilt Gold (#C8A24A) accents.
Typography: Cormorant Garamond for elegant, oversized display headers, paired with Inter Tight for highly readable UI text.
Details: Hairline borders, subtle paper textures (via SVG noise filters), and custom compass/map-pin SVG glyphs.
📂 Project Structure

Plain Text

lingo-atlas/
├── api/                  # Express Backend
│   ├── controllers/      # Route handlers (auth, courses, progress)
│   ├── data/             # Seed data (vocab pools, demo users, posts)
│   ├── store/            # In-memory database logic
│   ├── routes.ts         # API route definitions
│   └── server.ts         # Express entry point
├── shared/               # Code shared between Frontend & Backend
│   └── types.ts          # TypeScript interfaces (User, Lesson, Post, etc.)
├── src/                  # React Frontend
│   ├── components/       # Reusable UI (Avatar, Glyphs, StatStrip)
│   ├── lib/              # Utilities (API client, language helpers)
│   ├── pages/            # Route components (Dashboard, LessonPlayer, etc.)
│   ├── store/            # Zustand state store
│   ├── App.tsx           # React Router setup
│   └── index.css         # Tailwind directives and custom animations
└── tailwind.config.js    # Custom colors, fonts, and keyframes
