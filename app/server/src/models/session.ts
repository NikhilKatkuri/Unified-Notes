import mongoose from "mongoose";

import type { LoginSession } from "@unified-notes/types";

const sessionSchema = new mongoose.Schema<LoginSession & mongoose.Document>({
  userId: {
    type: String,
    ref: "User",
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  refreshTokenHash: {
    type: String,
    required: true,
  },
  refreshExpiresAt: {
    type: Date,
    required: true,
  },
  device: {
    type: {
      type: String,
      enum: ["mobile", "desktop", "tablet", "unknown"],
      required: true,
    },
    os: {
      type: String,
      required: true,
    },
    browser: {
      type: String,
      required: true,
    },
    deviceName: String,
  },
  location: {
    country: String,
    region: String,
    city: String,
    latitude: Number,

    longitude: Number,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastActivityAt: {
    type: Date,
    default: Date.now,
  },
});

sessionSchema.index({ userId: 1, createtedAt: -1 });
const SessionModel = mongoose.model<LoginSession & mongoose.Document>(
  "Session",
  sessionSchema,
  "sessions",
);

export default SessionModel;
