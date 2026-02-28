import { asyncHandler } from "@/lib/global.err.js";

import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import UserModel from "@/models/user.js";

const signup = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);

  const inject = {
    email,
    name,
    passwordHash,
  };

  const user = await UserModel.create({ ...inject });

  res.status(201).json({
    message: "User created successfully",
    data: {
      ...user.toObject(),
    },
  });
});

export { signup };
