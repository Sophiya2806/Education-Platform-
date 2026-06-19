import type { Request, Response } from "express";
import { store } from "../store";
import type { Comment, LeaderboardEntry, Post, PublicUser } from "@shared/types";

function toPublic(user: any): PublicUser {
  const { password: _password, email, ...rest } = user;
  return { ...rest, email };
}

export const CommunityController = {
  list(req: Request, res: Response) {
    const { language, level } = req.query;
    let posts = [...store.posts];
    if (language) posts = posts.filter((p) => p.language === language);
    if (level) posts = posts.filter((p) => p.level === level);
    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const enriched = posts.map((p) => {
      const author = store.findUserById(p.authorId);
      return { ...p, author: author ? toPublic(author) : null };
    });
    return res.json({ success: true, data: enriched });
  },

  create(req: Request, res: Response) {
    const user = store.getUserByToken(req.headers.authorization?.replace("Bearer ", ""));
    if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
    const { language, level, title, body } = req.body || {};
    if (!title || !body) return res.status(400).json({ success: false, error: "Title and body required." });
    const post: Post = {
      id: `p-${Date.now().toString(36)}`,
      authorId: user.id,
      language: language || user.targetLanguage,
      level: level || user.level,
      title,
      body,
      reactions: { fire: 0, clap: 0, sparkle: 0 },
      userReactions: {},
      comments: [],
      createdAt: new Date().toISOString(),
    };
    store.posts.push(post);
    return res.status(201).json({ success: true, data: { ...post, author: toPublic(user) } });
  },

  react(req: Request, res: Response) {
    const user = store.getUserByToken(req.headers.authorization?.replace("Bearer ", ""));
    if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
    const post = store.posts.find((p) => p.id === req.params.id);
    if (!post) return res.status(404).json({ success: false, error: "Post not found." });
    const { type } = req.body || {};
    if (!["fire", "clap", "sparkle"].includes(type)) {
      return res.status(400).json({ success: false, error: "Invalid reaction." });
    }
    const existing = post.userReactions[user.id];
    if (existing === type) {
      // remove
      post.reactions[type] -= 1;
      delete post.userReactions[user.id];
    } else {
      if (existing) post.reactions[existing] -= 1;
      post.reactions[type] = (post.reactions[type] || 0) + 1;
      post.userReactions[user.id] = type;
    }
    return res.json({ success: true, data: post });
  },

  comment(req: Request, res: Response) {
    const user = store.getUserByToken(req.headers.authorization?.replace("Bearer ", ""));
    if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
    const post = store.posts.find((p) => p.id === req.params.id);
    if (!post) return res.status(404).json({ success: false, error: "Post not found." });
    const { body } = req.body || {};
    if (!body) return res.status(400).json({ success: false, error: "Comment body required." });
    const comment: Comment = {
      id: `c-${Date.now().toString(36)}`,
      authorId: user.id,
      body,
      createdAt: new Date().toISOString(),
    };
    post.comments.push(comment);
    return res.status(201).json({ success: true, data: comment });
  },

  leaderboard(_req: Request, res: Response) {
    const oneWeekAgo = Date.now() - 7 * 86400000;
    const weekly = new Map<string, number>();
    store.progress
      .filter((p) => new Date(p.completedAt).getTime() > oneWeekAgo)
      .forEach((p) => {
        weekly.set(p.userId, (weekly.get(p.userId) || 0) + p.accuracy * 80);
      });
    const entries: LeaderboardEntry[] = store.users
      .filter((u) => !u.id.startsWith("u-") || u.unlockedAchievementIds.length > 0)
      .map((u) => ({
        rank: 0,
        user: toPublic(u),
        weeklyXp: Math.round(weekly.get(u.id) || 0),
        totalXp: u.xp,
        streak: u.streak,
      }))
      .sort((a, b) => b.totalXp - a.totalXp)
      .map((e, i) => ({ ...e, rank: i + 1 }));
    return res.json({ success: true, data: entries });
  },
};
