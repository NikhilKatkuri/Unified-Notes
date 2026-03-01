// external imports
import type { Request, Response } from "express";
import bcrypt from "bcrypt";

// local imports
import { asyncHandler } from "@/lib/global.err.js";
import UserModel from "@/models/user.js";
import SessionModel from "@/models/session.js";

const account = asyncHandler(async (req: Request, res: Response) => {
  const { user } = req.body as {
    user: {
      email: string;
      password: string;
    };
  };

  if (!user) {
    res
      .status(400)
      .json({ message: "User object is required in the request body" });
    return;
  }

  const { email, password } = user;
  if (
    !email ||
    typeof email !== "string" ||
    !password ||
    typeof password !== "string"
  ) {
    res.status(400).json({ message: "invalid credentials" });
    return;
  }

  const _user = await UserModel.findOne({ email: email });
  if (!_user) {
    res.status(404).json({ message: "invalid credentials" });
    return;
  }
  const isMatch = await bcrypt.compare(password, _user.passwordHash);
  if (!isMatch) {
    res.status(404).json({ message: "invalid credentials" });
    return;
  }

  await Promise.all([
    UserModel.deleteOne({ _id: _user._id }),
    SessionModel.deleteMany({ userId: _user._id.toString() }),
  ]);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/auth/refresh", // Must match exactly
  });

  res.status(200).json({
    message: "deleted account successfully",
  });
});

export { account };
