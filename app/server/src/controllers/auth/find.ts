// external imports
import type { Request, Response } from "express";

// local imports
import { asyncHandler } from "@/lib/global.err.js";
import UserModel from "@/models/user.js";

const find = asyncHandler(async (req: Request, res: Response) => {
  const { field, value } = req.query;
  if (!field || typeof field !== "string") {
    res.status(400).json({ message: "Field query parameter is required" });
    return;
  }
  if (!value || typeof value !== "string") {
    res.status(400).json({ message: "Value query parameter is required" });
    return;
  }

  if (field === "email") {
    const user = await UserModel.findOne({ email: value });
    if (user) {
      res.status(400).json({
        message: `Email '${value}' is already taken`,
        available: false,
      });
      return;
    }

    res
      .status(200)
      .json({ message: `Email '${value}' is available`, available: true });
    return;
  }
  res.status(400).json({ message: `Field '${field}' is not supported` });
});

export { find };
