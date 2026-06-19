import { Router } from "express";
import { AuthController } from "./controllers/auth";
import { CourseController, UserController } from "./controllers/courses";
import { ProgressController } from "./controllers/progress";
import { CommunityController } from "./controllers/community";
import { AchievementController } from "./controllers/achievements";

const router = Router();

router.post("/auth/sign-up", AuthController.signUp);
router.post("/auth/sign-in", AuthController.signIn);
router.get("/auth/me", AuthController.me);
router.patch("/auth/me", AuthController.update);

router.get("/courses", CourseController.list);
router.get("/courses/:id", CourseController.detail);
router.get("/lessons/:id", CourseController.lesson);
router.get("/recommendations/:userId", CourseController.recommendations);

router.get("/progress/:userId", ProgressController.summary);
router.post("/progress", ProgressController.submit);

router.get("/community/posts", CommunityController.list);
router.post("/community/posts", CommunityController.create);
router.post("/community/posts/:id/reactions", CommunityController.react);
router.post("/community/posts/:id/comments", CommunityController.comment);
router.get("/community/leaderboard", CommunityController.leaderboard);

router.get("/achievements", AchievementController.list);
router.get("/quests", AchievementController.quests);

router.get("/users/:id", UserController.publicProfile);

export default router;
