// external imports
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import type { LoginSession, PublicUser } from "@unified-notes/types";
import { randomUUID } from "node:crypto";

// local imports
import { asyncHandler } from "@/lib/global.err.js";
import UserModel from "@/models/user.js";
import SessionModel from "@/models/session.js";
import { ENV } from "@/lib/env.js";
import generateRefreshToken from "@/lib/refreshToken.js";
import generateToken from "@/lib/genJwt.js";

const signin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, deviceInfo, location } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  const _user = await UserModel.findOne({ email });

  if (!_user || !(await bcrypt.compare(password, _user.passwordHash))) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const _publicUser: PublicUser = {
    email: _user.email,
    name: _user.name,
    displayPictureUrl: _user.displayPictureUrl,
  };

  const sessionId = randomUUID().toString();
  const ipAddress =
    req.ip?.toString() ||
    req.headers["x-forwarded-for"]?.toString() ||
    req.socket.remoteAddress?.toString();

  const _gen_token = generateRefreshToken({
    userId: _user._id.toString(),
    sessionId,
  });

  const _sessionUser: Partial<LoginSession> = {
    userId: _user._id.toString(),
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
    userId: _user._id.toString(),
    expiresIn: "15m",
  }).token;

  res.cookie("refreshToken", _gen_token.token, {
    httpOnly: true,
    secure: ENV.isProduction,
    sameSite: "strict",
    path: "/api/v1/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    message: "Signin successful",
    user: _publicUser,
    token: _token,
  });
});

export { signin };
