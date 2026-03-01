import jwt, { type SignOptions, type Secret } from "jsonwebtoken";
import { ENV } from "@/lib/env.js";

interface GeneratedToken {
  token: string;
  expiresAt: Date;
}

interface GenerateTokenArgs {
  [key: string]: unknown;
  expiresIn?: string | number;
  type?: "jwt" | "refresh";
}

const generateToken = ({
  expiresIn = "7d",
  type = "jwt",
  ...payload
}: GenerateTokenArgs): GeneratedToken => {
  const key: Secret =
    type === "jwt" ? ENV.JWT_SECRET! : ENV.REFRESH_TOKEN_SECRET!;

  const options: SignOptions = { expiresIn } as SignOptions;

  const token = jwt.sign(payload, key, options);

  const decoded = jwt.decode(token) as { exp?: number } | null;

  if (!decoded?.exp) {
    throw new Error("Failed to decode token or token has no expiration.");
  }

  return {
    token,
    expiresAt: new Date(decoded.exp * 1000),
  };
};

export default generateToken;
