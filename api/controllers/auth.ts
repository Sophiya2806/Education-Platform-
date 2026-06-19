import type { Request, Response } from "express";
import { store } from "../store";
import type { PublicUser, User } from "@shared/types";

function toPublic(user: User): PublicUser {
  const { password: _password, email, ...rest } = user;
  return { ...rest, email };
}

export const AuthController = {
  signUp(req: Request, res: Response) {
    const { username, email, password, nativeLanguage, targetLanguage } = req.body || {};
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, error: "Username, email, and password are required." });
    }
    if (store.findUserByEmail(email)) {
      return res.status(409).json({ success: false, error: "An account with that email already exists." });
    }
    if (store.findUserByUsername(username)) {
      return res.status(409).json({ success: false, error: "That username is already taken." });
    }
    const id = `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const user: User = {
      id,
      username,
      email,
      password,
      nativeLanguage: nativeLanguage || "en",
      targetLanguage: targetLanguage || "ja",
      level: "A1",
      xp: 0,
      streak: 0,
      lastStudyDate: new Date().toISOString(),
      hearts: 5,
      joinedAt: new Date().toISOString(),
      avatarSeed: username.toLowerCase().replace(/[^a-z0-9]/g, ""),
      bio: "",
      following: [],
      followers: [],
      unlockedAchievementIds: [],
    };
    store.users.push(user);
    const token = store.createToken(id);
    return res.status(201).json({ success: true, data: { token, user: toPublic(user) } });
  },

  signIn(req: Request, res: Response) {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required." });
    }
    const user = store.findUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, error: "Those credentials don't match." });
    }
    const token = store.createToken(user.id);
    return res.json({ success: true, data: { token, user: toPublic(user) } });
  },

  me(req: Request, res: Response) {
    const user = store.getUserByToken(req.headers.authorization?.replace("Bearer ", ""));
    if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
    return res.json({ success: true, data: toPublic(user) });
  },

  update(req: Request, res: Response) {
    const user = store.getUserByToken(req.headers.authorization?.replace("Bearer ", ""));
    if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
    const { nativeLanguage, targetLanguage, bio, avatarSeed, username } = req.body || {};
    if (nativeLanguage) user.nativeLanguage = nativeLanguage;
    if (targetLanguage) user.targetLanguage = targetLanguage;
    if (typeof bio === "string") user.bio = bio;
    if (avatarSeed) user.avatarSeed = avatarSeed;
    if (username && username !== user.username) {
      if (store.findUserByUsername(username)) {
        return res.status(409).json({ success: false, error: "Username already taken." });
      }
      user.username = username;
    }
    return res.json({ success: true, data: toPublic(user) });
  },
};
