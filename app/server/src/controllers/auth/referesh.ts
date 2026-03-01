// external imports
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

// local imports
import { asyncHandler } from "@/lib/global.err.js";
import { ENV } from "@/lib/env.js";
import UserModel from "@/models/user.js";
import SessionModel from "@/models/session.js";

const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  let decoded: { userId: string; sessionId: string } | null = null;
  try {
    decoded = jwt.verify(refreshToken, ENV.REFRESH_TOKEN_SECRET) as {
      userId: string;
      sessionId: string;
    };
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  if (!decoded || !decoded.userId || !decoded.sessionId) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  const userId = decoded.userId;

  const _user = await UserModel.findById(userId);

  if (!_user) {
    return res.status(404).json({ message: "User not found" });
  }

  const session = await SessionModel.findOne({
    userId: userId,
    sessionId: decoded.sessionId,
  });

  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }
  const _refreshtoken = randomUUID().toString();
  const _refreshtokenHash = await bcrypt.hash(_refreshtoken, 10);

  session.refreshTokenHash = _refreshtokenHash;
  session.refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await session.save();

  res.cookie("refreshToken", _refreshtoken, {
    httpOnly: true,
    secure: ENV.isProduction,
    sameSite: "strict",
    path: "api/v1/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    message: "Refresh token is valid",
    userId: decoded.userId,
    sessionId: decoded.sessionId,
    _refreshtoken,
  });
});

export { refresh };
