import jwt from "jsonwebtoken";
import { ENV } from "@/lib/env.js";

interface RefreshTokenPayload {
  userId: string;
  sessionId: string;
}

interface GeneratedRefreshToken {
  token: string;
  expiresAt: Date;
}

const generateRefreshToken = ({
  userId,
  sessionId,
}: RefreshTokenPayload): GeneratedRefreshToken => {
  const token = jwt.sign({ userId, sessionId }, ENV.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  const { exp } = jwt.decode(token) as { exp: number };

  return {
    token,
    expiresAt: new Date(exp * 1000),
  };
};

export default generateRefreshToken;
