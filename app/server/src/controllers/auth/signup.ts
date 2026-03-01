// external imports
import type { Request, Response } from "express";
import type { LoginSession, PublicUser } from "@unified-notes/types";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";

// local imports
import UserModel from "@/models/user.js";
import { asyncHandler } from "@/lib/global.err.js";
import SessionModel from "@/models/session.js";
import { ENV } from "@/lib/env.js";

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

  const _refreshToken = jwt.sign(
    {
      userId: newUser._id.toString(),
      sessionId,
    },
    ENV.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    },
  );

  const _refreshTokenHash = await bcrypt.hash(_refreshToken, 10);

  const _sessionUser: Partial<LoginSession> = {
    userId: newUser._id.toString(),
    sessionId,
    ipAddress: ipAddress || "unknown",
    refreshTokenHash: _refreshTokenHash,
    refreshExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    device: (deviceInfo || undefined) as LoginSession["device"],
    location: (location || undefined) as LoginSession["location"],
    isActive: true,
    lastActivityAt: new Date(),
  };

  await SessionModel.create(_sessionUser);

  const _token = jwt.sign(
    {
      userId: newUser._id.toString(),
      sessionId,
    },
    ENV.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );

  res.cookie("refreshToken", _refreshToken, {
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
