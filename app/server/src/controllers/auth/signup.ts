// external imports
import type { Request, Response } from "express";
import type { LoginSession, PublicUser } from "@unified-notes/types";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

// local imports
import UserModel from "@/models/user.js";
import { asyncHandler } from "@/lib/global.err.js";
import SessionModel from "@/models/session.js";
import { ENV } from "@/lib/env.js";
import generateRefreshToken from "@/lib/refreshToken.js";
import generateToken from "@/lib/genJwt.js";

const signup = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name, deviceInfo, location } = req.body;
  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ message: "All fields (email, password, name) are required" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password too short" });
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await UserModel.findOne({ normalizedEmail });

  if (existingUser) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = new UserModel({ email, passwordHash, name });
  await newUser.save();

  const _publicUser: PublicUser = {
    email: newUser.email,
    name: newUser.name,
    displayPictureUrl: newUser.displayPictureUrl,
  };

  const sessionId = randomUUID().toString();

  const ipAddress =
    req.ip?.toString() ||
    req.headers["x-forwarded-for"]?.toString() ||
    req.socket.remoteAddress?.toString();

  const _gen_token = generateRefreshToken({
    userId: newUser._id.toString(),
    sessionId,
  });

  const _sessionUser: Partial<LoginSession> = {
    userId: newUser._id.toString(),
    sessionId,
    ipAddress: ipAddress || "unknown",
    refreshTokenHash: _gen_token.token,
    refreshExpiresAt: _gen_token.expiresAt,
    device: (deviceInfo || undefined) as LoginSession["device"],
    location: (location || undefined) as LoginSession["location"],
    isActive: true,
    lastActivityAt: new Date(),
  };

  await SessionModel.create(_sessionUser);

  const _token = generateToken({
    userId: newUser._id.toString(),
    expiresIn: "15m",
  }).token;

  res.cookie("refreshToken", _gen_token.token, {
    httpOnly: true,
    secure: ENV.isProduction,
    sameSite: "strict",
    path: "/api/v1/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
    message: "User created successfully",
    user: _publicUser,
    token: _token,
  });
});

export { signup };
