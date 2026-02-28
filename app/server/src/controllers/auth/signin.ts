import { asyncHandler } from "@/lib/global.err.js";
import UserModel from "@/models/user.js";

import bcrypt from "bcrypt";
import type { Request, Response } from "express";

const signin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: `Email and password are required` });
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: `User not found` });
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatch) {
    return res.status(401).json({ message: `Invalid password` });
  }

  // TODO: Generate and return JWT token or session cookie here for authenticated user
  // TODO: add to sessions collection {loggedin at }

  res.send({
    message: `signin successful`,
    data: {
      ...user.toObject(),
    },
  });
});

export { signin };
