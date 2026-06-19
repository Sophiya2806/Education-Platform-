import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useApp } from "@/store";
import Landing from "@/pages/Landing";
import { SignIn, SignUp } from "@/pages/Auth";
import { Onboarding } from "@/pages/Onboarding";
import { AppShell } from "@/components/layout/AppShell";
import { Dashboard } from "@/pages/Dashboard";
import { Library } from "@/pages/Library";
import { CourseDetail } from "@/pages/CourseDetail";
import { LessonPlayer } from "@/pages/LessonPlayer";
import { Progress } from "@/pages/Progress";
import { PathPage } from "@/pages/Path";
import { Community } from "@/pages/Community";
import { Achievements } from "@/pages/Achievements";
import { Profile } from "@/pages/Profile";
import { Settings } from "@/pages/Settings";

export default function App() {
  const bootstrap = useApp((s) => s.bootstrap);
  const loadingUser = useApp((s) => s.loadingUser);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  if (loadingUser) {
    return (
      <div className="grid min-h-screen place-items-center text-ink-500">
        <div className="font-display text-2xl italic">Opening the atlas…</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="/auth/sign-up" element={<SignUp />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="library" element={<Library />} />
          <Route path="library/:courseId" element={<CourseDetail />} />
          <Route path="learn/:lessonId" element={<LessonPlayer />} />
          <Route path="progress" element={<Progress />} />
          <Route path="path" element={<PathPage />} />
          <Route path="community" element={<Community />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
