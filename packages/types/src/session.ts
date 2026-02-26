/**
 * LoginSession represents the structure of a user's login session, including details about the device used for login, location information, and session management fields.
 */

import { TimeStamp } from "./common";

export type DeviceType = "mobile" | "desktop" | "tablet" | "unknown";

export interface LoginSession extends TimeStamp {
  _id: string;
  sessionId: string;
  ipAddress: string;
  refreshTokenHash: string;

  device: {
    type: DeviceType;
    os: string;
    browser: string;
    deviceName?: string;
  };

  location?: {
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };

  isActive: boolean;
  lastActivityAt: Date;
}
