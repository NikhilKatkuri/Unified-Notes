import type { UserSnap } from "@unified-notes/types";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema<UserSnap & mongoose.Document>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    displayPictureUrl: { type: String, default: "" },
    isEmailVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
